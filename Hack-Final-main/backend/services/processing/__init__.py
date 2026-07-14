"""Processing orchestration service.
Orchestrates Person 2's ingestion pipeline through the adapter layer.
Persists every Person 2 output, enforces idempotency, audits all operations.

Architecture:
  Person 1 API → ProcessingService → AdapterContainer → Adapters → Person 2 Modules
                                                                         ↓
                                                                  PostgreSQL / Neo4j
"""

import json
import logging
import asyncio
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

from sqlalchemy.ext.asyncio import AsyncSession

from backend.core.container import container
from backend.core.events import EventType, event_bus
from backend.database.session import get_db_for_service
from backend.models.document import Document, DocumentStatus
from backend.models.pipeline_result import PipelineResult
from backend.services.audit import audit_log_service
from backend.services.document import document_service
from backend.services.notification import notification_service

logger = logging.getLogger("neuroplant.processing")


class ProcessingService:
    """
    Orchestrates document processing by invoking Person 2 adapters.
    Tracks granular step status and persists every output to the database.
    """

    def __init__(self):
        self._subscribed = False

    def subscribe(self) -> None:
        if self._subscribed:
            return
        event_bus.subscribe(EventType.DOCUMENT_PROCESSING_REQUESTED, self._on_processing_requested)
        self._subscribed = True
        logger.info("ProcessingService subscribed to events")

    def _on_processing_requested(self, event: Any) -> None:
        try:
            loop = asyncio.get_event_loop()
        except RuntimeError:
            loop = asyncio.new_event_loop()
        loop.create_task(self.process_document(event.payload.get("doc_id", "")))

    async def _update_step(self, db: AsyncSession, doc: Document, step: str, event_msg: str) -> None:
        doc.status = step
        doc.set_processing_event(event_msg)
        await db.flush()

    # ── Pipeline ──

    async def process_document(self, doc_id: str) -> Dict[str, Any]:
        """
        Full pipeline: Queued → OCR → Classification → Vision → Entity Extraction →
        Relationship Extraction → Embeddings → Graph Population → Integrity Scan → Completed.
        Persists all outputs, enforces idempotency, audits every step.
        """
        db: AsyncSession = await get_db_for_service()
        try:
            doc = await document_service.get_by_id(db, doc_id)
            if not doc:
                logger.error("Document %s not found", doc_id)
                return {"status": "error", "message": "Document not found"}

            # Idempotency: skip if already completed
            if doc.status == DocumentStatus.COMPLETED.value:
                logger.info("Document %s already completed, skipping", doc_id)
                return {"status": "completed", "message": "Already processed"}

            org_id = doc.organization_id
            file_path = doc.file_path
            file_name = doc.file_name
            processing_events: List[str] = []

            # Step 1: Queued
            processing_events.append(f"[{datetime.now(timezone.utc).isoformat()}] Queued for processing")
            await self._update_step(db, doc, DocumentStatus.QUEUED.value, "Queued for processing")
            await db.commit()
            await audit_log_service.log(db, action="pipeline.queued", resource_type="document",
                                        resource_id=doc_id, organization_id=org_id)

            # Step 2: OCR
            processing_events.append(f"[{datetime.now(timezone.utc).isoformat()}] OCR / parsing started")
            await self._update_step(db, doc, DocumentStatus.OCR.value, "Starting OCR / parsing")
            await db.commit()
            ocr_result = container.ocr.process_document(file_path)
            raw_text = ocr_result.get("raw_text", "")
            await audit_log_service.log(db, action="pipeline.ocr", resource_type="document",
                                        resource_id=doc_id, organization_id=org_id,
                                        details=f"raw_text_length={len(raw_text)}")

            # Step 3: Classification
            processing_events.append(f"[{datetime.now(timezone.utc).isoformat()}] Classifying document")
            await self._update_step(db, doc, DocumentStatus.CLASSIFYING.value, "Classifying document")
            await db.commit()
            class_result = container.classification.classify(file_name, raw_text)
            classification = class_result.get("classification", "Unknown")
            confidence = class_result.get("confidence", 0.0)
            doc.classification = classification
            doc.classification_confidence = confidence
            doc.set_pipeline_result("classification", class_result)
            await audit_log_service.log(db, action="pipeline.classification", resource_type="document",
                                        resource_id=doc_id, organization_id=org_id,
                                        details=f"classification={classification}, confidence={confidence}")

            # Step 4: Vision (conditional)
            entities: List[Dict[str, Any]] = []
            relationships: List[Dict[str, Any]] = []
            if classification in ("P&ID", "Engineering Drawing"):
                processing_events.append(f"[{datetime.now(timezone.utc).isoformat()}] Parsing P&ID drawing")
                await self._update_step(db, doc, DocumentStatus.VISION.value, "Parsing P&ID/engineering drawing")
                await db.commit()
                vision_result = container.ocr.parse_pid_drawing(doc.id, file_path, org_id)
                symbols = vision_result.get("symbols", [])
                connections = vision_result.get("connections", [])
                for sym in symbols:
                    entities.append({
                        "name": sym["tag_name"], "type": "PIDElement",
                        "properties": {"symbol_type": sym["symbol_type"]},
                        "source_reference": "P&ID Vision", "confidence": 0.95,
                    })
                for conn in connections:
                    relationships.append({
                        "source_entity_name": conn["source_tag"],
                        "target_entity_name": conn["target_tag"],
                        "relationship_type": conn.get("relationship", "CONNECTED_TO"),
                        "properties": conn.get("properties", {}),
                        "supporting_evidence": f"Line trace ({conn.get('line_type')})",
                        "confidence": conn.get("confidence", 0.92),
                    })
                doc.set_pipeline_result("vision", {"symbols": len(symbols), "connections": len(connections)})
                await audit_log_service.log(db, action="pipeline.vision", resource_type="document",
                                            resource_id=doc_id, organization_id=org_id,
                                            details=f"symbols={len(symbols)}, connections={len(connections)}")

            # Step 5: Entity Extraction
            processing_events.append(f"[{datetime.now(timezone.utc).isoformat()}] Extracting entities")
            await self._update_step(db, doc, DocumentStatus.ENTITY_EXTRACTION.value, "Extracting entities")
            await db.commit()
            ents = container.extraction.extract_entities(org_id, doc.id, raw_text)
            entities.extend(ents)
            doc.set_pipeline_result("entities", {"count": len(entities)})
            await audit_log_service.log(db, action="pipeline.entity_extraction", resource_type="document",
                                        resource_id=doc_id, organization_id=org_id,
                                        details=f"entities={len(entities)}")

            # Step 6: Relationship Extraction
            processing_events.append(f"[{datetime.now(timezone.utc).isoformat()}] Discovering relationships")
            await self._update_step(db, doc, DocumentStatus.RELATIONSHIP_EXTRACTION.value, "Discovering relationships")
            await db.commit()
            rels = container.extraction.extract_relationships(entities, raw_text)
            relationships.extend(rels)
            doc.set_pipeline_result("relationships", {"count": len(relationships)})
            await audit_log_service.log(db, action="pipeline.relationship_extraction", resource_type="document",
                                        resource_id=doc_id, organization_id=org_id,
                                        details=f"relationships={len(relationships)}")

            # Step 7: Embeddings
            processing_events.append(f"[{datetime.now(timezone.utc).isoformat()}] Generating embeddings")
            await self._update_step(db, doc, DocumentStatus.EMBEDDING.value, "Generating embeddings")
            await db.commit()
            vector = container.extraction.generate_embedding(raw_text[:1000])
            doc.set_pipeline_result("embeddings", {"dimensions": len(vector)})

            # Step 8: Graph Population
            processing_events.append(f"[{datetime.now(timezone.utc).isoformat()}] Populating knowledge graph")
            await self._update_step(db, doc, DocumentStatus.GRAPH_POPULATION.value, "Populating knowledge graph")
            await db.commit()
            graph_result = container.graph.persist(org_id, doc.id, entities, relationships)
            stats = graph_result.get("stats", {})
            doc.set_pipeline_result("graph", stats)
            await audit_log_service.log(db, action="pipeline.graph_population", resource_type="document",
                                        resource_id=doc_id, organization_id=org_id,
                                        details=f"nodes={stats.get('nodes_created_or_updated', 0)}, "
                                                f"relationships={stats.get('relationships_created', 0)}")

            # Step 9: Integrity Scan
            processing_events.append(f"[{datetime.now(timezone.utc).isoformat()}] Running integrity scan")
            await self._update_step(db, doc, DocumentStatus.INTEGRITY_SCAN.value, "Running integrity scan")
            await db.commit()
            integrity = container.compliance.run_full_scan(org_id)
            contradictions = integrity.get("contradictions", [])
            drift = integrity.get("regulatory_drift", {})
            mortality = integrity.get("knowledge_mortality", {})
            doc.set_pipeline_result("integrity", {
                "contradictions": len(contradictions),
                "drift_status": drift.get("drift_status", ""),
                "mortality_score": mortality.get("mortality_score", 0),
            })

            # Step 10: Persist all results to PipelineResult table
            result_record = PipelineResult(
                doc_id=doc.id,
                organization_id=org_id,
                classification=classification,
                classification_confidence=confidence,
                entity_count=len(entities),
                entities_json=json.dumps(entities) if entities else None,
                relationship_count=len(relationships),
                relationships_json=json.dumps(relationships) if relationships else None,
                graph_nodes_created=stats.get("nodes_created_or_updated", 0),
                graph_relationships_created=stats.get("relationships_created", 0),
                contradiction_count=len(contradictions),
                contradictions_json=json.dumps(contradictions) if contradictions else None,
                drift_status=drift.get("drift_status", ""),
                drift_json=json.dumps(drift) if drift else None,
                mortality_score=mortality.get("mortality_score", 0),
                mortality_json=json.dumps(mortality) if mortality else None,
                embedding_dims=len(vector),
                status="completed",
                processing_events_json=json.dumps(processing_events),
            )
            db.add(result_record)

            # Step 11: Mark completed
            processing_events.append(f"[{datetime.now(timezone.utc).isoformat()}] Processing completed")
            doc.status = DocumentStatus.COMPLETED.value
            doc.processing_events = json.dumps(processing_events)
            await db.flush()

            # Notify uploader
            if doc.uploaded_by_id:
                await notification_service.create_notification(
                    db, title="Document Processed",
                    message=f"Document '{doc.file_name}' classified as **{classification}** with "
                            f"{len(entities)} entities and {len(relationships)} relationships.",
                    user_id=doc.uploaded_by_id, notification_type="document_processed",
                    organization_id=org_id, reference_type="document", reference_id=doc.id,
                )

            await db.commit()
            await audit_log_service.log(db, action="pipeline.completed", resource_type="document",
                                        resource_id=doc_id, organization_id=org_id,
                                        details=f"classification={classification}, entities={len(entities)}, "
                                                f"relationships={len(relationships)}")

            logger.info("Document %s pipeline complete", doc_id)
            return {"status": "completed", "classification": classification, "entity_count": len(entities),
                    "relationship_count": len(relationships), "processing_events": processing_events}

        except Exception as e:
            logger.error("Pipeline failed for doc %s: %s", doc_id, e, exc_info=True)
            try:
                doc = await document_service.get_by_id(db, doc_id)
                if doc:
                    doc.status = DocumentStatus.FAILED.value
                    doc.error_message = str(e)
                    doc.set_processing_event(f"Failed: {str(e)}")
                    await db.commit()
                await audit_log_service.log(db, action="pipeline.failed", resource_type="document",
                                            resource_id=doc_id, details=str(e))
            except Exception:
                await db.rollback()
            return {"status": "failed", "error": str(e)}
        finally:
            await db.close()

    # ── Non-pipeline operations ──

    async def query_decision(self, question: str, org_id: str) -> Dict[str, Any]:
        return container.decision.query(question, org_id)

    async def start_interview(self, equipment_tag: str, context: str) -> Dict[str, Any]:
        return container.extraction.start_interview(equipment_tag, context)

    async def process_interview(self, equipment_tag: str, context: str, transcript: str, author: str = "Senior Expert", org_id: Optional[str] = None) -> Dict[str, Any]:
        result = container.extraction.process_interview(equipment_tag, context, transcript, author)
        entities = result.get("entities", [])
        relationships = result.get("relationships", [])
        if entities:
            container.graph.persist(org_id or "demo-org", "interview-session", entities, relationships)
        return result

    async def run_integrity_scan(self, org_id: str) -> Dict[str, Any]:
        return container.compliance.run_full_scan(org_id)

    async def get_graph_nodes(self, org_id: Optional[str] = None, type_filter: Optional[str] = None) -> List[Dict[str, Any]]:
        return container.graph.get_nodes(org_id, type_filter)

    async def get_graph_relationships(self, org_id: Optional[str] = None, rel_type: Optional[str] = None) -> List[Dict[str, Any]]:
        return container.graph.get_relationships(org_id, rel_type)

    async def get_graph_stats(self, org_id: Optional[str] = None) -> Dict[str, Any]:
        return container.graph.get_stats(org_id)

    async def get_contradictions(self, org_id: str) -> List[Dict[str, Any]]:
        result = container.compliance.run_full_scan(org_id)
        return result.get("contradictions", [])

    async def get_regulatory_drift(self, org_id: str) -> Dict[str, Any]:
        result = container.compliance.run_full_scan(org_id)
        return result.get("regulatory_drift", {})

    async def get_mortality_score(self, org_id: str) -> Dict[str, Any]:
        result = container.compliance.run_full_scan(org_id)
        return result.get("knowledge_mortality", {})

    async def get_pipeline_progress(self, doc_id: str) -> Dict[str, Any]:
        db: AsyncSession = await get_db_for_service()
        try:
            doc = await document_service.get_by_id(db, doc_id)
            if not doc:
                return {"status": "not_found"}
            return {
                "status": doc.status,
                "processing_events": doc.get_processing_events(),
                "classification": doc.classification,
                "classification_confidence": doc.classification_confidence,
                "pipeline_result": doc.get_pipeline_results(),
                "error_message": doc.error_message,
            }
        finally:
            await db.close()


processing_service = ProcessingService()

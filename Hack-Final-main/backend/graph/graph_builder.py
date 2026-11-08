import os
import logging
from datetime import datetime, date
from pathlib import Path
from typing import Dict, Any, List, Optional
from dotenv import load_dotenv

# Ensure .env is loaded
load_dotenv(Path(__file__).resolve().parent.parent.parent / ".env")

from backend.graph.cypher_queries import (
    get_merge_node_query,
    get_merge_relationship_query,
    LOCKED_NODE_LABELS,
    LOCKED_RELATIONSHIP_TYPES
)

logger = logging.getLogger("neuroplant.graph_builder")


def _sanitize_val(val: Any) -> Any:
    """Recursively converts neo4j.time.DateTime, datetime, and other non-JSON types to ISO strings."""
    if hasattr(val, "iso_format"):
        return val.iso_format()
    if hasattr(val, "to_native"):
        native = val.to_native()
        return native.isoformat() if hasattr(native, "isoformat") else str(native)
    if isinstance(val, (datetime, date)):
        return val.isoformat()
    if isinstance(val, dict):
        return {k: _sanitize_val(v) for k, v in val.items()}
    if isinstance(val, list):
        return [_sanitize_val(v) for v in val]
    return val

class KnowledgeGraphBuilder:
    """
    Single-purpose service for incremental Neo4j graph population and querying.
    Never does full rebuilds. Records creation source, timestamps, confidence, org_id.
    Includes in-memory mock fallback for offline testing.
    """
    def __init__(self):
        self._refresh_config()
        self.mock_graph_store = {"nodes": {}, "relationships": []}

    def _refresh_config(self):
        self.neo4j_uri = os.getenv("NEO4J_URI", "bolt://localhost:7687")
        self.neo4j_user = os.getenv("NEO4J_USER", "neo4j")
        self.neo4j_password = os.getenv("NEO4J_PASSWORD", "password")
        self.mock_mode = os.getenv("NEUROPLANT_MOCK_MODE", os.getenv("MOCK_MODE", "false")).lower() == "true"

    def _get_driver(self):
        self._refresh_config()
        from neo4j import GraphDatabase
        return GraphDatabase.driver(self.neo4j_uri, auth=(self.neo4j_user, self.neo4j_password))

    def persist_entities_and_relationships(
        self,
        org_id: str,
        doc_id: str,
        entities: List[Dict[str, Any]],
        relationships: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Persists validated entities and relationships incrementally into Neo4j."""
        self._refresh_config()
        stats = {"nodes_created_or_updated": 0, "relationships_created": 0}

        if self.mock_mode or not self._connect():
            return self._mock_persist(org_id, doc_id, entities, relationships)

        try:
            driver = self._get_driver()
            with driver.session() as session:
                for ent in entities:
                    label = ent.get("type", "Equipment")
                    if label not in LOCKED_NODE_LABELS:
                        label = "Equipment"
                    query = get_merge_node_query(label)
                    params = {
                        "name": ent["name"],
                        "org_id": org_id,
                        "uuid": ent.get("uuid", ""),
                        "confidence": ent.get("confidence", 0.95),
                        "source_document_id": doc_id,
                        "properties": ent.get("properties", {})
                    }
                    session.run(query, params)
                    stats["nodes_created_or_updated"] += 1

                for rel in relationships:
                    rel_type = rel.get("relationship_type", "RELATED_TO")
                    if rel_type not in LOCKED_RELATIONSHIP_TYPES:
                        rel_type = "RELATED_TO"
                    query = get_merge_relationship_query(rel_type)
                    params = {
                        "source_name": rel["source_entity_name"],
                        "target_name": rel["target_entity_name"],
                        "org_id": org_id,
                        "supporting_evidence": rel.get("supporting_evidence", "Extracted relationship"),
                        "confidence": rel.get("confidence", 0.9),
                        "properties": rel.get("properties", {})
                    }
                    session.run(query, params)
                    stats["relationships_created"] += 1
            driver.close()
            logger.info(f"Persisted {stats['nodes_created_or_updated']} nodes and {stats['relationships_created']} rels to Neo4j.")
            return {"status": "success", "mode": "neo4j", "stats": stats}
        except Exception as e:
            logger.warning(f"Neo4j write failed, falling back to mock persistence: {e}")
            return self._mock_persist(org_id, doc_id, entities, relationships)

    def get_nodes(self, org_id: Optional[str] = None, type_filter: Optional[str] = None) -> List[Dict[str, Any]]:
        """Queries live Neo4j for nodes, or falls back to in-memory store."""
        if not self.mock_mode and self._connect():
            try:
                driver = self._get_driver()
                with driver.session() as session:
                    cypher = "MATCH (n) RETURN n, labels(n)[0] as type"
                    results = session.run(cypher)
                    nodes = []
                    for record in results:
                        n = dict(record["n"])
                        node_type = record["type"] or "Equipment"
                        node_org = n.get("org_id", "demo-org")
                        if org_id and node_org != org_id:
                            continue
                        if type_filter and node_type != type_filter:
                            continue
                        
                        clean_props = {
                            k: _sanitize_val(v)
                            for k, v in n.items()
                            if k not in ["name", "org_id", "uuid", "confidence"]
                        }
                        nodes.append({
                            "name": str(n.get("name", "Unknown")),
                            "type": str(node_type),
                            "org_id": str(node_org),
                            "uuid": str(n.get("uuid", "")),
                            "confidence": float(n.get("confidence", 0.95)),
                            "properties": clean_props
                        })
                driver.close()
                if nodes:
                    return nodes
            except Exception as e:
                logger.warning(f"Neo4j query nodes failed: {e}")

        # Fallback to in-memory store
        nodes_dict = self.mock_graph_store.get("nodes", {})
        nodes = list(nodes_dict.values())
        if org_id:
            nodes = [n for n in nodes if n.get("org_id") == org_id]
        if type_filter:
            nodes = [n for n in nodes if n.get("type") == type_filter]
        return [_sanitize_val(n) for n in nodes]

    def get_relationships(self, org_id: Optional[str] = None, rel_type: Optional[str] = None) -> List[Dict[str, Any]]:
        """Queries live Neo4j for relationships, or falls back to in-memory store."""
        if not self.mock_mode and self._connect():
            try:
                driver = self._get_driver()
                with driver.session() as session:
                    cypher = "MATCH (a)-[r]->(b) RETURN a.name as source_entity_name, b.name as target_entity_name, type(r) as relationship_type, r.supporting_evidence as supporting_evidence, r.confidence as confidence, r.org_id as org_id"
                    results = session.run(cypher)
                    rels = []
                    for record in results:
                        r_org = record["org_id"] or "demo-org"
                        r_type = record["relationship_type"]
                        if org_id and r_org != org_id:
                            continue
                        if rel_type and r_type != rel_type:
                            continue
                        rels.append({
                            "source_entity_name": str(record["source_entity_name"]),
                            "target_entity_name": str(record["target_entity_name"]),
                            "relationship_type": str(r_type),
                            "supporting_evidence": str(record["supporting_evidence"] or "Connected"),
                            "confidence": float(record["confidence"] or 0.9),
                            "org_id": str(r_org)
                        })
                driver.close()
                if rels:
                    return rels
            except Exception as e:
                logger.warning(f"Neo4j query relationships failed: {e}")

        # Fallback to in-memory store
        rels = self.mock_graph_store.get("relationships", [])
        if org_id:
            rels = [r for r in rels if r.get("org_id") == org_id]
        if rel_type:
            rels = [r for r in rels if r.get("relationship_type") == rel_type]
        return [_sanitize_val(r) for r in rels]

    def _connect(self) -> bool:
        self._refresh_config()
        if self.mock_mode:
            return False
        try:
            driver = self._get_driver()
            driver.verify_connectivity()
            driver.close()
            return True
        except Exception:
            return False

    def _mock_persist(self, org_id: str, doc_id: str, entities: List[Dict[str, Any]], relationships: List[Dict[str, Any]]) -> Dict[str, Any]:
        for ent in entities:
            ent["org_id"] = org_id
            key = f"{org_id}:{ent['name']}"
            self.mock_graph_store["nodes"][key] = ent
        for rel in relationships:
            rel["org_id"] = org_id
            self.mock_graph_store["relationships"].append(rel)

        return {
            "status": "success",
            "mode": "mock_memory",
            "stats": {
                "nodes_created_or_updated": len(entities),
                "relationships_created": len(relationships)
            }
        }

graph_builder = KnowledgeGraphBuilder()

"""Document upload and status routes with live pipeline progress tracking."""
from typing import Any, Dict, Optional
from fastapi import APIRouter, Depends, Query, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession
from backend.core.dependencies import get_current_active_user
from backend.database.session import get_db
from backend.schemas.common import ResponseEnvelope, PaginatedEnvelope, PaginatedResponse
from backend.schemas.document import DocumentRead, DocumentUploadResponse, DocumentStatusRead
from backend.models.user import User
from backend.models.document import DocumentStatus
from backend.services.document import document_service
from backend.services.processing import processing_service
from backend.workers.tasks import process_document_pipeline
import asyncio

router = APIRouter(prefix="/documents", tags=["Documents"])


@router.post("/upload", response_model=ResponseEnvelope[DocumentUploadResponse], status_code=201)
async def upload_document(
    file: UploadFile = File(...),
    organization_id: Optional[str] = Form(None),
    process_after_upload: bool = Form(True),
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """Upload a document and optionally trigger the Person 2 ingestion pipeline."""
    org_id = current_user.organization_id or organization_id or "demo-org"
    doc = await document_service.upload(db, file, org_id, uploaded_by_id=current_user.id)

    # Trigger background pipeline processing
    if process_after_upload:
        asyncio.create_task(process_document_pipeline(doc.id))

    return ResponseEnvelope(
        data=DocumentUploadResponse.model_validate(doc),
        message="Document uploaded successfully. Processing pipeline queued.",
    )


@router.get("", response_model=PaginatedEnvelope[DocumentRead])
@router.get("/", response_model=PaginatedEnvelope[DocumentRead])
async def list_documents(
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=100),
    status: Optional[str] = Query(None),
    organization_id: Optional[str] = Query(None),
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """List documents for the current organization with optional status filter."""
    org_id = current_user.organization_id or organization_id
    skip = (page - 1) * page_size
    if org_id:
        items, total = await document_service.list_by_org(
            db, org_id, skip=skip, limit=page_size, status=status,
        )
    else:
        filters = {}
        if status:
            filters["status"] = status
        items, total = await document_service.list(
            db, skip=skip, limit=page_size, filters=filters, order_by="-created_at"
        )
    return PaginatedEnvelope(
        data=PaginatedResponse(
            items=[DocumentRead.model_validate(d) for d in items],
            total=total, page=page, page_size=page_size,
            total_pages=-(-total // page_size) if total > 0 else 0,
        )
    )


@router.get("/{doc_id}", response_model=ResponseEnvelope[DocumentRead])
async def get_document(
    doc_id: str,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """Get a single document by ID."""
    doc = await document_service.get_by_id_or_raise(db, doc_id)
    return ResponseEnvelope(data=DocumentRead.model_validate(doc))


@router.get("/{doc_id}/status", response_model=ResponseEnvelope)
async def get_document_status(
    doc_id: str,
    current_user: User = Depends(get_current_active_user),
):
    """
    Get live pipeline progress for a document.
    Returns current pipeline step, processing events, and results.
    """
    progress = await processing_service.get_pipeline_progress(doc_id)
    return ResponseEnvelope(
        data=progress,
        message="Document pipeline status retrieved",
    )


@router.get("/{doc_id}/pipeline", response_model=ResponseEnvelope)
async def get_document_pipeline(
    doc_id: str,
    current_user: User = Depends(get_current_active_user),
):
    """
    Get detailed pipeline progress including each step's status,
    processing events timeline, and any results extracted.
    """
    progress = await processing_service.get_pipeline_progress(doc_id)
    return ResponseEnvelope(
        data=progress,
        message="Pipeline progress retrieved",
    )


@router.post("/{doc_id}/process", response_model=ResponseEnvelope)
async def request_processing(
    doc_id: str,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """Request AI processing for a document. Runs the full Person 2 ingestion pipeline."""
    doc = await document_service.get_by_id_or_raise(db, doc_id)
    doc.status = DocumentStatus.QUEUED.value
    await db.commit()

    # Launch pipeline in background
    asyncio.create_task(process_document_pipeline(doc.id))

    return ResponseEnvelope(
        data={"doc_id": doc.id, "status": "queued"},
        message="Processing pipeline queued. Track progress via GET /documents/{id}/pipeline.",
    )


@router.delete("/{doc_id}", response_model=ResponseEnvelope)
async def delete_document(
    doc_id: str,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """Delete a document, its database records, and associated knowledge graph nodes."""
    from sqlalchemy import text
    import os

    doc = await document_service.get_by_id(db, doc_id)
    if not doc:
        return ResponseEnvelope(message="Document not found or already deleted", data={"deleted": False})

    # 1. Clean up file on disk
    if doc.file_path and os.path.exists(doc.file_path):
        try:
            os.remove(doc.file_path)
        except Exception:
            pass

    # 2. Clean up SQLite related tables
    try:
        await db.execute(text("DELETE FROM pipeline_results WHERE document_id = :d"), {"d": doc_id})
        await db.execute(text("DELETE FROM audit_logs WHERE target_id = :d"), {"d": doc_id})
        await db.execute(text("DELETE FROM document_chunks WHERE document_id = :d"), {"d": doc_id})
    except Exception:
        pass

    # 3. Delete from documents table
    await db.delete(doc)
    await db.commit()

    # 4. Clean up Neo4j graph nodes and relationships
    from backend.graph.graph_builder import graph_builder
    try:
        driver = graph_builder._get_driver()
        with driver.session() as session:
            # Delete nodes specifically tagged with this source document ID
            session.run("MATCH (n {source_document_id: $doc_id}) DETACH DELETE n", {"doc_id": doc_id})
            
            # Check if any documents remain in SQLite; if 0, wipe entire graph
            res = await db.execute(text("SELECT count(*) FROM documents"))
            remaining_count = res.scalar() or 0
            if remaining_count == 0:
                session.run("MATCH (n) DETACH DELETE n;")
                graph_builder.mock_graph_store = {"nodes": {}, "relationships": []}
        driver.close()
    except Exception as e:
        print(f"Neo4j graph cleanup note: {e}")

    return ResponseEnvelope(
        data={"deleted_id": doc_id},
        message="Document and extracted knowledge graph nodes deleted successfully",
    )


@router.delete("", response_model=ResponseEnvelope)
@router.delete("/", response_model=ResponseEnvelope)
async def delete_all_documents(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """Delete all documents, logs, and wipe the entire knowledge graph."""
    from sqlalchemy import text
    try:
        await db.execute(text("DELETE FROM pipeline_results;"))
        await db.execute(text("DELETE FROM audit_logs;"))
        await db.execute(text("DELETE FROM notifications;"))
        await db.execute(text("DELETE FROM reports;"))
        await db.execute(text("DELETE FROM document_chunks;"))
        await db.execute(text("DELETE FROM documents;"))
        await db.commit()
    except Exception:
        pass

    from backend.graph.graph_builder import graph_builder
    graph_builder.mock_graph_store = {"nodes": {}, "relationships": []}
    try:
        driver = graph_builder._get_driver()
        with driver.session() as session:
            session.run("MATCH (n) DETACH DELETE n;")
        driver.close()
    except Exception as e:
        print(f"Neo4j wipe note: {e}")

    return ResponseEnvelope(
        data={"cleared": True},
        message="All documents and Knowledge Graph nodes cleared successfully",
    )

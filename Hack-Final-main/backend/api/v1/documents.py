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


@router.get("/", response_model=PaginatedEnvelope[DocumentRead])
async def list_documents(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    status: Optional[str] = Query(None),
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """List documents for the current organization with optional status filter."""
    org_id = current_user.organization_id
    skip = (page - 1) * page_size
    items, total = await document_service.list_by_org(
        db, org_id, skip=skip, limit=page_size, status=status,
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

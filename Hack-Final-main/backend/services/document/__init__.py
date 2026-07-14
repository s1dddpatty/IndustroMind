"""Document service — upload, status tracking, processing orchestration."""
import os
import uuid
from datetime import datetime, timezone
from typing import Optional
from fastapi import UploadFile
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from backend.core.config import settings
from backend.core.events import emit_document_uploaded, emit_processing_requested
from backend.core.exceptions import ValidationError, NotFoundError
from backend.models.document import Document, DocumentStatus
from backend.services.base import BaseService


class DocumentService(BaseService[Document]):
    def __init__(self):
        super().__init__(Document)

    async def upload(
        self,
        db: AsyncSession,
        file: UploadFile,
        organization_id: str,
        uploaded_by_id: Optional[str] = None,
    ) -> Document:
        # Validate extension
        ext = os.path.splitext(file.filename or "")[1].lower()
        if ext not in settings.ALLOWED_EXTENSIONS:
            raise ValidationError(f"File extension '{ext}' is not allowed")

        # Validate size by reading content
        content = await file.read()
        if len(content) > settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024:
            raise ValidationError(f"File exceeds {settings.MAX_UPLOAD_SIZE_MB}MB limit")
        await file.seek(0)

        # Store file
        target_org_id = organization_id or "demo-org"
        file_id = str(uuid.uuid4())
        org_dir = os.path.join(settings.UPLOAD_DIR, target_org_id)
        os.makedirs(org_dir, exist_ok=True)
        file_path = os.path.join(org_dir, f"{file_id}{ext}")
        with open(file_path, "wb") as f:
            f.write(content)

        # Create record
        doc = await self.create(
            db,
            file_name=file.filename or "unknown",
            file_path=file_path,
            file_size_bytes=len(content),
            mime_type=file.content_type,
            status=DocumentStatus.UPLOADED.value,
            organization_id=target_org_id,
            uploaded_by_id=uploaded_by_id,
        )

        # Emit event for Person 2 (AI processing)
        emit_document_uploaded(organization_id, doc.id, doc.file_name, doc.file_path)

        return doc

    async def update_status(
        self, db: AsyncSession, doc_id: str, status: str,
        classification: Optional[str] = None,
        classification_confidence: Optional[float] = None,
        error_message: Optional[str] = None,
    ) -> Document:
        doc = await self.get_by_id_or_raise(db, doc_id)
        doc.status = status
        if classification:
            doc.classification = classification
        if classification_confidence is not None:
            doc.classification_confidence = classification_confidence
        if error_message:
            doc.error_message = error_message
        await db.flush()
        await db.refresh(doc)
        return doc

    async def request_processing(self, db: AsyncSession, doc_id: str) -> Document:
        """Request AI processing for a document from Person 2 modules via the pipeline."""
        doc = await self.get_by_id_or_raise(db, doc_id)
        doc.status = DocumentStatus.CLASSIFYING.value
        await db.flush()
        await db.commit()

        # Run Person 2 pipeline asynchronously
        from backend.services.processing import processing_service
        result = await processing_service.process_document(doc_id)

        # Re-fetch updated document
        doc = await self.get_by_id_or_raise(db, doc_id)
        return doc

    async def list_by_org(
        self, db: AsyncSession, org_id: str,
        skip: int = 0, limit: int = 100, status: Optional[str] = None,
    ):
        filters = {"organization_id": org_id}
        if status:
            filters["status"] = status
        return await self.list(db, skip=skip, limit=limit, filters=filters, order_by="-created_at")


document_service = DocumentService()

"""Audit log routes."""
from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from backend.core.dependencies import get_current_active_user, require_role
from backend.core.security import Roles
from backend.database.session import get_db
from backend.schemas.common import PaginatedEnvelope, PaginatedResponse
from backend.schemas.audit_log import AuditLogRead
from backend.models.user import User
from backend.services.audit import audit_log_service

router = APIRouter(prefix="/audit-logs", tags=["Audit Logs"])


@router.get("/", response_model=PaginatedEnvelope[AuditLogRead])
async def list_audit_logs(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    action: Optional[str] = Query(None),
    current_user: User = Depends(require_role(Roles.ORG_ADMIN)),
    db: AsyncSession = Depends(get_db),
):
    org_id = current_user.organization_id
    skip = (page - 1) * page_size
    items, total = await audit_log_service.list_by_org(
        db, org_id, skip=skip, limit=page_size, action=action,
    )
    return PaginatedEnvelope(
        data=PaginatedResponse(
            items=[AuditLogRead.model_validate(l) for l in items],
            total=total, page=page, page_size=page_size,
            total_pages=-(-total // page_size) if total > 0 else 0,
        )
    )

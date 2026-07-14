"""Admin and dashboard routes with Person 2 data integration."""
from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from backend.core.dependencies import get_current_active_user, require_role
from backend.core.security import Roles
from backend.database.session import get_db
from backend.schemas.common import ResponseEnvelope, PaginatedEnvelope, PaginatedResponse
from backend.schemas.admin import SystemStats, DashboardStats
from backend.schemas.audit_log import AuditLogRead
from backend.models.user import User
from backend.services.admin import admin_service

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.get("/stats", response_model=ResponseEnvelope[SystemStats])
async def get_system_stats(
    current_user: User = Depends(require_role(Roles.SUPER_ADMIN)),
    db: AsyncSession = Depends(get_db),
):
    """Get system-wide statistics."""
    stats = await admin_service.get_system_stats(db)
    return ResponseEnvelope(data=stats)


@router.get("/dashboard/{org_id}", response_model=ResponseEnvelope)
async def get_org_dashboard(
    org_id: str,
    current_user: User = Depends(require_role(Roles.ORG_ADMIN)),
    db: AsyncSession = Depends(get_db),
):
    """
    Get full organization dashboard including Person 1 stats and Person 2 intelligence data.
    Aggregates: document stats, graph stats, integrity scan, alerts.
    """
    result = await admin_service.get_full_dashboard(db, org_id)
    return ResponseEnvelope(data=result, message="Full dashboard retrieved")


@router.get("/dashboard/{org_id}/stats", response_model=ResponseEnvelope[DashboardStats])
async def get_org_dashboard_stats(
    org_id: str,
    current_user: User = Depends(require_role(Roles.ORG_ADMIN)),
    db: AsyncSession = Depends(get_db),
):
    """Get basic organization dashboard statistics (Person 1 data only)."""
    stats = await admin_service.get_org_dashboard(db, org_id)
    return ResponseEnvelope(data=stats)


@router.get("/audit-log", response_model=PaginatedEnvelope[AuditLogRead])
async def get_recent_audit_logs(
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=200),
    current_user: User = Depends(require_role(Roles.SUPER_ADMIN)),
    db: AsyncSession = Depends(get_db),
):
    """Get recent audit log entries."""
    limit = page_size
    skip = (page - 1) * page_size
    logs = await admin_service.get_recent_audit_logs(db, limit=limit)
    return PaginatedEnvelope(
        data=PaginatedResponse(
            items=[AuditLogRead.model_validate(l) for l in logs],
            total=len(logs), page=page, page_size=page_size,
            total_pages=1,
        )
    )

"""Report routes."""
from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from backend.core.dependencies import get_current_active_user, require_role
from backend.core.security import Roles
from backend.database.session import get_db
from backend.schemas.common import ResponseEnvelope, PaginatedEnvelope, PaginatedResponse
from backend.schemas.report import ReportRead, ReportCreate
from backend.models.user import User
from backend.services.report import report_service

router = APIRouter(prefix="/reports", tags=["Reports"])


@router.get("/", response_model=PaginatedEnvelope[ReportRead])
async def list_reports(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    report_type: Optional[str] = Query(None),
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    org_id = current_user.organization_id
    skip = (page - 1) * page_size
    items, total = await report_service.list_by_org(
        db, org_id, skip=skip, limit=page_size, report_type=report_type,
    )
    return PaginatedEnvelope(
        data=PaginatedResponse(
            items=[ReportRead.model_validate(r) for r in items],
            total=total, page=page, page_size=page_size,
            total_pages=-(-total // page_size) if total > 0 else 0,
        )
    )


@router.get("/{report_id}", response_model=ResponseEnvelope[ReportRead])
async def get_report(
    report_id: str,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    report = await report_service.get_by_id_or_raise(db, report_id)
    return ResponseEnvelope(data=ReportRead.model_validate(report))


@router.post("/", response_model=ResponseEnvelope[ReportRead], status_code=201)
async def create_report(
    body: ReportCreate,
    current_user: User = Depends(require_role(Roles.EDITOR)),
    db: AsyncSession = Depends(get_db),
):
    report = await report_service.create_report(
        db,
        title=body.title,
        report_type=body.report_type,
        format=body.format,
        parameters=body.parameters,
        organization_id=current_user.organization_id,
        created_by_id=current_user.id,
    )
    return ResponseEnvelope(
        data=ReportRead.model_validate(report),
        message="Report creation requested. Worker will generate it.",
    )

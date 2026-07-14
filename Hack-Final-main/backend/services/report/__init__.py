"""Report service."""
from typing import Any, Dict, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from backend.models.report import Report
from backend.services.base import BaseService


class ReportService(BaseService[Report]):
    def __init__(self):
        super().__init__(Report)

    async def create_report(
        self, db: AsyncSession, title: str, report_type: str,
        organization_id: str, format: str = "pdf",
        parameters: Optional[Dict[str, Any]] = None,
        created_by_id: Optional[str] = None,
    ) -> Report:
        import json
        return await self.create(
            db,
            title=title,
            report_type=report_type,
            format=format,
            parameters=json.dumps(parameters) if parameters else None,
            organization_id=organization_id,
            created_by_id=created_by_id,
        )

    async def list_by_org(
        self, db: AsyncSession, org_id: str,
        skip: int = 0, limit: int = 100, report_type: Optional[str] = None,
    ):
        filters = {"organization_id": org_id}
        if report_type:
            filters["report_type"] = report_type
        return await self.list(db, skip=skip, limit=limit, filters=filters, order_by="-created_at")


report_service = ReportService()

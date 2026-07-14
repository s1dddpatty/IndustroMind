"""Audit logging service."""
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from backend.models.audit_log import AuditLog
from backend.services.base import BaseService


class AuditLogService(BaseService[AuditLog]):
    def __init__(self):
        super().__init__(AuditLog)

    async def log(
        self, db: AsyncSession, action: str, resource_type: str,
        resource_id: Optional[str] = None, details: Optional[str] = None,
        ip_address: Optional[str] = None, user_agent: Optional[str] = None,
        organization_id: Optional[str] = None, actor_id: Optional[str] = None,
    ) -> AuditLog:
        return await self.create(
            db,
            action=action,
            resource_type=resource_type,
            resource_id=resource_id,
            details=details,
            ip_address=ip_address,
            user_agent=user_agent,
            organization_id=organization_id,
            actor_id=actor_id,
        )

    async def list_by_org(
        self, db: AsyncSession, org_id: str,
        skip: int = 0, limit: int = 100, action: Optional[str] = None,
    ):
        filters = {"organization_id": org_id}
        if action:
            filters["action"] = action
        return await self.list(db, skip=skip, limit=limit, filters=filters, order_by="-created_at")


audit_log_service = AuditLogService()

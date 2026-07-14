"""Admin service — system stats, dashboard data with Person 2 integration.
Dashboard methods read from persisted PipelineResult table instead of calling adapters directly.
"""
from typing import Any, Dict, List, Optional
from sqlalchemy import select, func, desc
from sqlalchemy.ext.asyncio import AsyncSession
from backend.models.organization import Organization
from backend.models.user import User
from backend.models.document import Document, DocumentStatus
from backend.models.organization import Plant
from backend.models.notification import Notification
from backend.models.audit_log import AuditLog
from backend.models.pipeline_result import PipelineResult
from backend.schemas.admin import SystemStats, DashboardStats
from backend.services.processing import processing_service
import json


class AdminService:
    async def get_system_stats(self, db: AsyncSession) -> SystemStats:
        orgs = await db.execute(select(func.count(Organization.id)))
        users = await db.execute(select(func.count(User.id)))
        docs = await db.execute(select(func.count(Document.id)))
        plants = await db.execute(select(func.count(Plant.id)))
        active = await db.execute(select(func.count(User.id)).where(User.is_active == True))
        return SystemStats(
            total_organizations=orgs.scalar() or 0,
            total_users=users.scalar() or 0,
            total_documents=docs.scalar() or 0,
            total_plants=plants.scalar() or 0,
            active_users=active.scalar() or 0,
        )

    async def get_org_dashboard(self, db: AsyncSession, org_id: str) -> DashboardStats:
        status_result = await db.execute(
            select(Document.status, func.count(Document.id))
            .where(Document.organization_id == org_id).group_by(Document.status)
        )
        docs_by_status = dict(status_result.all())

        class_result = await db.execute(
            select(Document.classification, func.count(Document.id))
            .where(Document.organization_id == org_id, Document.classification.isnot(None))
            .group_by(Document.classification)
        )
        docs_by_class = dict(class_result.all())

        from datetime import datetime, timedelta, timezone
        week_ago = datetime.now(timezone.utc) - timedelta(days=7)
        recent = await db.execute(
            select(func.count(Document.id))
            .where(Document.organization_id == org_id, Document.created_at >= week_ago)
        )

        pipeline_statuses = [s.value for s in DocumentStatus if s.value not in ("completed", "failed")]
        pending = await db.execute(
            select(func.count(Document.id))
            .where(Document.organization_id == org_id, Document.status.in_(pipeline_statuses))
        )

        failed = await db.execute(
            select(func.count(Document.id))
            .where(Document.organization_id == org_id, Document.status == "failed")
        )

        notif_count = await db.execute(
            select(func.count(Notification.id)).where(Notification.organization_id == org_id)
        )
        unread = await db.execute(
            select(func.count(Notification.id))
            .where(Notification.organization_id == org_id, Notification.is_read == False)
        )

        return DashboardStats(
            documents_by_status=docs_by_status,
            documents_by_classification=docs_by_class,
            recent_uploads=recent.scalar() or 0,
            pending_processing=pending.scalar() or 0,
            failed_documents=failed.scalar() or 0,
            total_notifications=notif_count.scalar() or 0,
            unread_notifications=unread.scalar() or 0,
        )

    async def get_recent_audit_logs(self, db: AsyncSession, org_id: Optional[str] = None, limit: int = 50):
        stmt = select(AuditLog)
        if org_id:
            stmt = stmt.where(AuditLog.organization_id == org_id)
        stmt = stmt.order_by(AuditLog.created_at.desc()).limit(limit)
        result = await db.execute(stmt)
        return list(result.scalars().all())

    async def get_full_dashboard(self, db: AsyncSession, org_id: str) -> Dict[str, Any]:
        """Aggregate dashboard with Person 1 stats + persisted Person 2 data."""
        stats = await self.get_org_dashboard(db, org_id)
        graph_stats = await processing_service.get_graph_stats(org_id)
        persisted = await self._get_latest_pipeline_summary(db, org_id)
        alerts = await self._get_alert_summary_from_db(db, org_id)

        return {
            "stats": stats.model_dump(),
            "graph": graph_stats,
            "pipeline_results": persisted,
            "alerts": alerts,
        }

    async def _get_latest_pipeline_summary(self, db: AsyncSession, org_id: str) -> Dict[str, Any]:
        """Read last 10 pipeline results from database, not from adapters."""
        stmt = (
            select(PipelineResult)
            .where(PipelineResult.organization_id == org_id)
            .order_by(PipelineResult.created_at.desc())
            .limit(10)
        )
        result = await db.execute(stmt)
        records = list(result.scalars().all())

        return {
            "total_processed": len(records),
            "latest_classifications": [
                {"doc_id": r.doc_id, "classification": r.classification,
                 "entity_count": r.entity_count, "relationship_count": r.relationship_count,
                 "mortality_score": r.mortality_score, "drift_status": r.drift_status,
                 "processed_at": r.created_at.isoformat() if r.created_at else None}
                for r in records
            ],
        }

    async def _get_alert_summary_from_db(self, db: AsyncSession, org_id: str) -> Dict[str, Any]:
        """Read alerts from persisted pipeline results instead of calling adapters."""
        stmt = (
            select(PipelineResult)
            .where(PipelineResult.organization_id == org_id)
            .order_by(PipelineResult.created_at.desc())
            .limit(5)
        )
        result = await db.execute(stmt)
        records = list(result.scalars().all())

        total_contradictions = sum(r.contradiction_count or 0 for r in records)
        latest = records[0] if records else None

        critical = 0
        warnings = 0
        if latest:
            if latest.contradiction_count and latest.contradiction_count > 0:
                critical += 1
            if latest.drift_status == "Action Required":
                critical += 1

        return {
            "total_alerts": total_contradictions,
            "critical": critical,
            "warnings": warnings,
            "mortality_score": latest.mortality_score if latest else 0,
            "drift_status": latest.drift_status if latest else "Compliant",
        }


admin_service = AdminService()

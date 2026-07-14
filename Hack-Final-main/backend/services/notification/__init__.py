"""Notification service."""
from typing import List, Optional
from sqlalchemy import select, func, update
from sqlalchemy.ext.asyncio import AsyncSession
from backend.models.notification import Notification
from backend.services.base import BaseService


class NotificationService(BaseService[Notification]):
    def __init__(self):
        super().__init__(Notification)

    async def create_notification(
        self, db: AsyncSession, title: str, message: str,
        user_id: str, notification_type: str = "info",
        organization_id: Optional[str] = None,
        reference_type: Optional[str] = None, reference_id: Optional[str] = None,
    ) -> Notification:
        return await self.create(
            db,
            title=title,
            message=message,
            notification_type=notification_type,
            user_id=user_id,
            organization_id=organization_id,
            reference_type=reference_type,
            reference_id=reference_id,
        )

    async def list_by_user(
        self, db: AsyncSession, user_id: str,
        skip: int = 0, limit: int = 50, unread_only: bool = False,
    ):
        filters = {"user_id": user_id}
        if unread_only:
            filters["is_read"] = False
        return await self.list(db, skip=skip, limit=limit, filters=filters, order_by="-created_at")

    async def mark_as_read(self, db: AsyncSession, notification_id: str) -> Notification:
        from datetime import datetime, timezone
        obj = await self.get_by_id_or_raise(db, notification_id)
        obj.is_read = True
        obj.read_at = datetime.now(timezone.utc)
        await db.flush()
        await db.refresh(obj)
        return obj

    async def mark_all_read(self, db: AsyncSession, user_id: str) -> int:
        from datetime import datetime, timezone
        stmt = (
            update(Notification)
            .where(Notification.user_id == user_id, Notification.is_read == False)
            .values(is_read=True, read_at=datetime.now(timezone.utc))
        )
        result = await db.execute(stmt)
        return result.rowcount

    async def count_unread(self, db: AsyncSession, user_id: str) -> int:
        stmt = select(func.count(Notification.id)).where(
            Notification.user_id == user_id, Notification.is_read == False
        )
        result = await db.execute(stmt)
        return result.scalar() or 0

    async def broadcast_to_org(
        self, db: AsyncSession, org_id: str, title: str, message: str,
        notification_type: str = "info",
        reference_type: Optional[str] = None, reference_id: Optional[str] = None,
    ) -> List[Notification]:
        """Send a notification to all active users in an organization."""
        from backend.models.user import User
        user_result = await db.execute(
            select(User.id).where(
                User.organization_id == org_id, User.is_active == True
            )
        )
        user_ids = [row[0] for row in user_result.all()]
        notifications = []
        for uid in user_ids:
            n = await self.create_notification(
                db, title=title, message=message,
                user_id=uid, notification_type=notification_type,
                organization_id=org_id,
                reference_type=reference_type, reference_id=reference_id,
            )
            notifications.append(n)
        return notifications


notification_service = NotificationService()

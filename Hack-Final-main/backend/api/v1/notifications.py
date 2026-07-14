"""Notification routes."""
from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from backend.core.dependencies import get_current_active_user
from backend.database.session import get_db
from backend.schemas.common import ResponseEnvelope, PaginatedEnvelope, PaginatedResponse
from backend.schemas.notification import NotificationRead
from backend.models.user import User
from backend.services.notification import notification_service

router = APIRouter(prefix="/notifications", tags=["Notifications"])


@router.get("/", response_model=PaginatedEnvelope[NotificationRead])
async def list_notifications(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    unread_only: bool = Query(False),
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    skip = (page - 1) * page_size
    items, total = await notification_service.list_by_user(
        db, current_user.id, skip=skip, limit=page_size, unread_only=unread_only,
    )
    return PaginatedEnvelope(
        data=PaginatedResponse(
            items=[NotificationRead.model_validate(n) for n in items],
            total=total, page=page, page_size=page_size,
            total_pages=-(-total // page_size) if total > 0 else 0,
        )
    )


@router.get("/unread-count", response_model=ResponseEnvelope)
async def get_unread_count(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    count = await notification_service.count_unread(db, current_user.id)
    return ResponseEnvelope(data={"count": count})


@router.patch("/{notification_id}/read", response_model=ResponseEnvelope[NotificationRead])
async def mark_read(
    notification_id: str,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    notif = await notification_service.mark_as_read(db, notification_id)
    return ResponseEnvelope(data=NotificationRead.model_validate(notif))


@router.post("/mark-all-read", response_model=ResponseEnvelope)
async def mark_all_read(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    count = await notification_service.mark_all_read(db, current_user.id)
    return ResponseEnvelope(message=f"{count} notifications marked as read")

"""Notification schemas."""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class NotificationRead(BaseModel):
    id: str
    title: str
    message: str
    notification_type: str
    is_read: bool
    read_at: Optional[datetime] = None
    organization_id: Optional[str] = None
    reference_type: Optional[str] = None
    reference_id: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}


class NotificationCreate(BaseModel):
    title: str
    message: str
    notification_type: str = "info"
    user_id: str
    organization_id: Optional[str] = None
    reference_type: Optional[str] = None
    reference_id: Optional[str] = None

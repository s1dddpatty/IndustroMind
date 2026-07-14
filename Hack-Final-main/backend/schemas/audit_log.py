"""Audit log schemas."""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class AuditLogRead(BaseModel):
    id: str
    action: str
    resource_type: str
    resource_id: Optional[str] = None
    details: Optional[str] = None
    ip_address: Optional[str] = None
    organization_id: Optional[str] = None
    actor_id: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}

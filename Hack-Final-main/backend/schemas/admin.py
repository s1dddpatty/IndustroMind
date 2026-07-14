"""Admin schemas."""
from typing import Any, Dict, List, Optional
from pydantic import BaseModel


class SystemStats(BaseModel):
    total_organizations: int
    total_users: int
    total_documents: int
    total_plants: int
    active_users: int


class DashboardStats(BaseModel):
    documents_by_status: Dict[str, int]
    documents_by_classification: Dict[str, int]
    recent_uploads: int
    pending_processing: int
    failed_documents: int
    total_notifications: int
    unread_notifications: int

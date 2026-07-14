"""Report schemas."""
from datetime import datetime
from typing import Any, Dict, Optional
from pydantic import BaseModel


class ReportRead(BaseModel):
    id: str
    title: str
    report_type: str
    format: str
    status: str
    parameters: Optional[str] = None
    file_path: Optional[str] = None
    error_message: Optional[str] = None
    organization_id: str
    created_by_id: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class ReportCreate(BaseModel):
    title: str
    report_type: str
    format: str = "pdf"
    parameters: Optional[Dict[str, Any]] = None

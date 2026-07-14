"""Document schemas with pipeline progress tracking."""
import json
from datetime import datetime
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field, field_validator


class DocumentUploadResponse(BaseModel):
    id: str
    file_name: str
    file_size_bytes: Optional[int] = None
    mime_type: Optional[str] = None
    status: str
    organization_id: str
    created_at: datetime

    model_config = {"from_attributes": True}


class DocumentRead(BaseModel):
    id: str
    file_name: str
    file_size_bytes: Optional[int] = None
    mime_type: Optional[str] = None
    classification: Optional[str] = None
    classification_confidence: Optional[float] = None
    status: str
    error_message: Optional[str] = None
    processing_events: Optional[List[str]] = None
    pipeline_result: Optional[Dict[str, Any]] = None
    organization_id: str
    uploaded_by_id: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}

    @field_validator("processing_events", "pipeline_result", mode="before", check_fields=False)
    @classmethod
    def parse_json_fields(cls, v: Any, info) -> Any:
        if isinstance(v, (str, bytes)):
            try:
                return json.loads(v)
            except Exception:
                if info.field_name == "processing_events":
                    return []
                return {}
        return v


class DocumentStatusRead(BaseModel):
    id: str
    file_name: str
    status: str
    classification: Optional[str] = None
    classification_confidence: Optional[float] = None
    error_message: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class DocumentPipelineProgress(BaseModel):
    """Live pipeline progress for a document being processed."""
    doc_id: str
    status: str
    processing_events: List[str] = Field(default_factory=list)
    classification: Optional[str] = None
    classification_confidence: Optional[float] = None
    pipeline_result: Dict[str, Any] = Field(default_factory=dict)
    error_message: Optional[str] = None

    @field_validator("processing_events", "pipeline_result", mode="before", check_fields=False)
    @classmethod
    def parse_json_fields(cls, v: Any, info) -> Any:
        if isinstance(v, (str, bytes)):
            try:
                return json.loads(v)
            except Exception:
                if info.field_name == "processing_events":
                    return []
                return {}
        return v


class DocumentProcessingResult(BaseModel):
    """Result emitted by Person 2 after AI processing completes."""
    doc_id: str
    status: str
    classification: Optional[str] = None
    entities: Optional[List[Dict[str, Any]]] = None
    relationships: Optional[List[Dict[str, Any]]] = None
    integrity_issues: Optional[Dict[str, Any]] = None
    processing_events: Optional[List[str]] = None

    @field_validator("processing_events", "entities", "relationships", "integrity_issues", mode="before", check_fields=False)
    @classmethod
    def parse_json_fields(cls, v: Any, info) -> Any:
        if isinstance(v, (str, bytes)):
            try:
                return json.loads(v)
            except Exception:
                if info.field_name in ("processing_events", "entities", "relationships"):
                    return []
                return {}
        return v

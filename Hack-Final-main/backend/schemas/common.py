"""
Shared response envelope for all API responses.
Every API endpoint returns one of these envelopes.
"""

from __future__ import annotations

from datetime import datetime, timezone
from typing import Any, Dict, Generic, List, Optional, TypeVar

from pydantic import BaseModel, Field

DataT = TypeVar("DataT")


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")


class ErrorDetail(BaseModel):
    field: Optional[str] = None
    message: str


class ResponseEnvelope(BaseModel, Generic[DataT]):
    """Standard API response envelope. Every endpoint returns this."""

    success: bool = True
    data: Optional[DataT] = None
    message: str = "Success"
    errors: Optional[List[ErrorDetail]] = None
    timestamp: str = Field(default_factory=utc_now)


class PaginatedResponse(BaseModel, Generic[DataT]):
    """Paginated list wrapper for list endpoints."""

    items: List[DataT]
    total: int
    page: int
    page_size: int
    total_pages: int


class PaginatedEnvelope(BaseModel, Generic[DataT]):
    """Paginated response envelope."""

    success: bool = True
    data: Optional[PaginatedResponse[DataT]] = None
    message: str = "Success"
    errors: Optional[List[ErrorDetail]] = None
    timestamp: str = Field(default_factory=utc_now)


class ErrorResponse(BaseModel):
    """Error response envelope."""

    success: bool = False
    data: Optional[Any] = None
    message: str = "Error"
    errors: Optional[List[ErrorDetail]] = None
    timestamp: str = Field(default_factory=utc_now)
    details: Optional[Dict[str, Any]] = None

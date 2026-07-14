"""SQLAlchemy models — Report and ReportSchedule."""
from typing import Optional
from sqlalchemy import String, Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from backend.database.base import Base, TimestampMixin, UUIDMixin
import enum


class ReportFormat(str, enum.Enum):
    PDF = "pdf"
    CSV = "csv"
    JSON = "json"


class ReportStatus(str, enum.Enum):
    PENDING = "pending"
    GENERATING = "generating"
    COMPLETED = "completed"
    FAILED = "failed"


class Report(TimestampMixin, UUIDMixin, Base):
    __tablename__ = "reports"

    title: Mapped[str] = mapped_column(String(255), nullable=False)
    report_type: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    format: Mapped[str] = mapped_column(String(16), nullable=False, default=ReportFormat.PDF.value)
    status: Mapped[str] = mapped_column(String(32), nullable=False, default=ReportStatus.PENDING.value)
    parameters: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    file_path: Mapped[Optional[str]] = mapped_column(String(1024), nullable=True)
    error_message: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    organization_id: Mapped[str] = mapped_column(String(36), ForeignKey("organizations.id"), nullable=False, index=True)
    created_by_id: Mapped[Optional[str]] = mapped_column(String(36), nullable=True)

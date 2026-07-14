"""SQLAlchemy model — Document."""
from typing import TYPE_CHECKING, Optional, Dict, Any
from sqlalchemy import String, Text, Integer, Float, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.database.base import Base, TimestampMixin, UUIDMixin
import enum
import json

if TYPE_CHECKING:
    from backend.models.organization import Organization


class DocumentStatus(str, enum.Enum):
    UPLOADED = "uploaded"
    QUEUED = "queued"
    CLASSIFYING = "classifying"
    OCR = "ocr"
    VISION = "vision"
    ENTITY_EXTRACTION = "entity_extraction"
    RELATIONSHIP_EXTRACTION = "relationship_extraction"
    EMBEDDING = "embedding"
    GRAPH_POPULATION = "graph_population"
    INTEGRITY_SCAN = "integrity_scan"
    DECISION_BRIEF = "decision_brief"
    COMPLETED = "completed"
    FAILED = "failed"

    @classmethod
    def pipeline_order(cls) -> list[str]:
        return [
            cls.UPLOADED.value,
            cls.QUEUED.value,
            cls.CLASSIFYING.value,
            cls.OCR.value,
            cls.VISION.value,
            cls.ENTITY_EXTRACTION.value,
            cls.RELATIONSHIP_EXTRACTION.value,
            cls.EMBEDDING.value,
            cls.GRAPH_POPULATION.value,
            cls.INTEGRITY_SCAN.value,
            cls.DECISION_BRIEF.value,
            cls.COMPLETED.value,
        ]


class Document(TimestampMixin, UUIDMixin, Base):
    __tablename__ = "documents"

    file_name: Mapped[str] = mapped_column(String(512), nullable=False)
    file_path: Mapped[str] = mapped_column(String(1024), nullable=False)
    file_size_bytes: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    mime_type: Mapped[Optional[str]] = mapped_column(String(128), nullable=True)
    classification: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    classification_confidence: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    status: Mapped[str] = mapped_column(String(32), nullable=False, default=DocumentStatus.UPLOADED.value)
    error_message: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    processing_events: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    pipeline_result: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    organization_id: Mapped[str] = mapped_column(String(36), ForeignKey("organizations.id"), nullable=False, index=True)
    uploaded_by_id: Mapped[Optional[str]] = mapped_column(String(36), nullable=True)

    organization: Mapped["Organization"] = relationship("Organization", back_populates="documents")

    def set_processing_event(self, event: str) -> None:
        events = self.get_processing_events()
        events.append(event)
        self.processing_events = json.dumps(events)

    def get_processing_events(self) -> list[str]:
        if not self.processing_events:
            return []
        try:
            return json.loads(self.processing_events)
        except (json.JSONDecodeError, TypeError):
            return []

    def set_pipeline_result(self, key: str, value: Any) -> None:
        results = self.get_pipeline_results()
        results[key] = value
        self.pipeline_result = json.dumps(results)

    def get_pipeline_results(self) -> dict:
        if not self.pipeline_result:
            return {}
        try:
            return json.loads(self.pipeline_result)
        except (json.JSONDecodeError, TypeError):
            return {}

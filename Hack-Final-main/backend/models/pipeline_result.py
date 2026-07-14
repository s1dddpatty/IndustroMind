"""SQLAlchemy model — PipelineResult persists every Person 2 output."""
from typing import Optional
from sqlalchemy import String, Text, ForeignKey, Float, Integer
from sqlalchemy.orm import Mapped, mapped_column
from backend.database.base import Base, TimestampMixin, UUIDMixin


class PipelineResult(TimestampMixin, UUIDMixin, Base):
    __tablename__ = "pipeline_results"

    doc_id: Mapped[str] = mapped_column(String(36), ForeignKey("documents.id"), nullable=False, index=True)
    organization_id: Mapped[str] = mapped_column(String(36), ForeignKey("organizations.id"), nullable=False, index=True)

    # Classification
    classification: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    classification_confidence: Mapped[Optional[float]] = mapped_column(Float, nullable=True)

    # Entity extraction summary
    entity_count: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    entities_json: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    # Relationship extraction summary
    relationship_count: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    relationships_json: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    # Graph population stats
    graph_nodes_created: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    graph_relationships_created: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)

    # Integrity scan results
    contradiction_count: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    contradictions_json: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    drift_status: Mapped[Optional[str]] = mapped_column(String(32), nullable=True)
    drift_json: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    mortality_score: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    mortality_json: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    # Embedding dimension
    embedding_dims: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)

    # Pipeline status
    status: Mapped[str] = mapped_column(String(32), nullable=False, default="completed")
    error_message: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    processing_events_json: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

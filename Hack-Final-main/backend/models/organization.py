"""SQLAlchemy models — Organization, Plant."""
import uuid
from datetime import datetime, timezone
from typing import TYPE_CHECKING, List, Optional
from sqlalchemy import Boolean, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.database.base import Base, TimestampMixin, UUIDMixin

if TYPE_CHECKING:
    from backend.models.user import User
    from backend.models.document import Document
    from backend.models.audit_log import AuditLog


class Organization(TimestampMixin, UUIDMixin, Base):
    __tablename__ = "organizations"

    name: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    slug: Mapped[str] = mapped_column(String(128), unique=True, nullable=False, index=True)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    contact_email: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    settings: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    users: Mapped[List["User"]] = relationship("User", back_populates="organization", lazy="selectin")
    plants: Mapped[List["Plant"]] = relationship("Plant", back_populates="organization", lazy="selectin",
                                                  cascade="all, delete-orphan")
    documents: Mapped[List["Document"]] = relationship("Document", back_populates="organization", lazy="selectin",
                                                       cascade="all, delete-orphan")
    audit_logs: Mapped[List["AuditLog"]] = relationship("AuditLog", back_populates="organization", lazy="selectin",
                                                         cascade="all, delete-orphan")


class Plant(TimestampMixin, UUIDMixin, Base):
    __tablename__ = "plants"

    name: Mapped[str] = mapped_column(String(255), nullable=False)
    code: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    location: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    organization_id: Mapped[str] = mapped_column(String(36), ForeignKey("organizations.id"), nullable=False, index=True)

    organization: Mapped["Organization"] = relationship("Organization", back_populates="plants")

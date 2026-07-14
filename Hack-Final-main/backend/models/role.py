"""SQLAlchemy model — Role (Role-Based Access Control)."""
from typing import Optional
from sqlalchemy import String, Boolean, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from backend.database.base import Base, TimestampMixin, UUIDMixin


class Role(TimestampMixin, UUIDMixin, Base):
    """
    Mandatory Role table storing RBAC definitions scoped by organization_id.
    Locked roles: Organization Administrator, Plant Manager, Maintenance Engineer,
    Compliance Officer, Safety Officer, Field Technician, Subject Matter Expert, External Auditor.
    """
    __tablename__ = "roles"

    name: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    description: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    permissions: Mapped[Optional[str]] = mapped_column(String(1024), nullable=True)
    is_system_role: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    organization_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("organizations.id"), nullable=True, index=True)

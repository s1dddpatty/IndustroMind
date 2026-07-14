"""
Model registry — import all concrete models here so they register on Base.metadata.
This must be imported before any create_all or Alembic migration.
"""

from backend.models.user import User
from backend.models.role import Role
from backend.models.organization import Organization, Plant
from backend.models.document import Document
from backend.models.audit_log import AuditLog
from backend.models.notification import Notification
from backend.models.report import Report
from backend.models.pipeline_result import PipelineResult

__all__ = [
    "User",
    "Role",
    "Organization",
    "Plant",
    "Document",
    "AuditLog",
    "Notification",
    "Report",
    "PipelineResult",
]

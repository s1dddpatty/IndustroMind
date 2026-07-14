"""Dashboard API routes — aggregate Person 1 + Person 2 data for the frontend.
All intelligence data is read from persisted PipelineResult table.
Adapters are never called from dashboard routes.
"""
import json
from fastapi import APIRouter, Depends

from backend.core.dependencies import get_current_active_user
from backend.database.session import get_db
from backend.models.user import User
from backend.schemas.common import ResponseEnvelope
from backend.services.admin import admin_service
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/alerts", response_model=ResponseEnvelope)
async def get_dashboard_alerts(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Aggregate alerts from persisted Person 2 pipeline results.
    Reads from PipelineResult table — never calls adapters directly.
    """
    org_id = current_user.organization_id or "demo-org"

    # Read alerts from persisted data via admin service
    from backend.models.pipeline_result import PipelineResult
    from sqlalchemy import select, desc
    stmt = (
        select(PipelineResult)
        .where(PipelineResult.organization_id == org_id)
        .order_by(PipelineResult.created_at.desc())
        .limit(5)
    )
    result = await db.execute(stmt)
    records = list(result.scalars().all())

    alerts = []
    for r in records:
        if r.contradiction_count and r.contradiction_count > 0:
            contradictions = json.loads(r.contradictions_json) if r.contradictions_json else []
            for c in contradictions:
                alerts.append({
                    "type": "contradiction",
                    "severity": c.get("severity", "info"),
                    "title": f"Contradiction: {c.get('description', '')[:80]}",
                    "message": c.get("description", ""),
                    "source": "integrity_scan",
                    "affected_assets": c.get("affected_assets", []),
                })

        if r.drift_status == "Action Required":
            drift = json.loads(r.drift_json) if r.drift_json else {}
            alerts.append({
                "type": "regulatory_drift",
                "severity": "high",
                "title": "Regulatory Drift Detected",
                "message": drift.get("summary", ""),
                "source": "regulatory_drift",
                "details": {
                    "outdated_procedures": drift.get("outdated_procedures", []),
                    "unmapped_regulations": drift.get("unmapped_regulations", []),
                },
            })

        if r.mortality_score and r.mortality_score > 60:
            mortality = json.loads(r.mortality_json) if r.mortality_json else {}
            alerts.append({
                "type": "knowledge_mortality",
                "severity": "medium",
                "title": f"Knowledge Mortality: {r.mortality_score}/100",
                "message": mortality.get("summary", ""),
                "source": "knowledge_mortality",
                "details": {
                    "high_risk_experts": mortality.get("high_risk_experts", []),
                    "knowledge_at_risk": mortality.get("knowledge_at_risk", []),
                },
            })

    # Failed document alerts
    dashboard = await admin_service.get_org_dashboard(db, org_id)
    if dashboard.failed_documents > 0:
        alerts.append({
            "type": "document_failure",
            "severity": "high",
            "title": f"{dashboard.failed_documents} document(s) failed processing",
            "message": f"{dashboard.failed_documents} document(s) have failed processing and require attention.",
            "source": "document_processing",
        })

    return ResponseEnvelope(data={
        "alerts": alerts,
        "total": len(alerts),
        "critical_count": sum(1 for a in alerts if a["severity"] in ("critical", "high")),
        "warning_count": sum(1 for a in alerts if a["severity"] == "medium"),
    }, message="Dashboard alerts retrieved")

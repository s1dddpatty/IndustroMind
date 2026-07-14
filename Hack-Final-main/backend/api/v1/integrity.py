"""Compliance & integrity API routes — expose Person 2 compliance, drift, mortality through Person 1's REST API."""
from fastapi import APIRouter, Depends
from fastapi.params import Body

from backend.core.dependencies import get_current_active_user
from backend.models.user import User
from backend.schemas.common import ResponseEnvelope
from backend.schemas.ai import IntegrityScanRequest, IntegrityScanRead, ContradictionRead, RegulatoryDriftRead, KnowledgeMortalityRead
from backend.services.processing import processing_service

router = APIRouter(prefix="/integrity", tags=["Integrity & Compliance"])


@router.post("/scan", response_model=ResponseEnvelope)
async def run_integrity_scan(
    body: IntegrityScanRequest = Body(...),
    current_user: User = Depends(get_current_active_user),
):
    """Run a full knowledge integrity scan: contradictions + drift + mortality."""
    org_id = body.org_id or current_user.organization_id
    result = await processing_service.run_integrity_scan(org_id)
    return ResponseEnvelope(data=result, message="Integrity scan completed")


@router.get("/contradictions", response_model=ResponseEnvelope)
async def get_contradictions(
    current_user: User = Depends(get_current_active_user),
):
    """Get detected contradictions for your organization."""
    org_id = current_user.organization_id or "demo-org"
    result = await processing_service.get_contradictions(org_id)
    return ResponseEnvelope(data={"contradictions": result, "count": len(result)}, message="Contradictions retrieved")


@router.get("/regulatory-drift", response_model=ResponseEnvelope)
async def get_regulatory_drift(
    current_user: User = Depends(get_current_active_user),
):
    """Get regulatory drift status for your organization."""
    org_id = current_user.organization_id or "demo-org"
    result = await processing_service.get_regulatory_drift(org_id)
    return ResponseEnvelope(data=result, message="Regulatory drift retrieved")


@router.get("/mortality", response_model=ResponseEnvelope)
async def get_knowledge_mortality(
    current_user: User = Depends(get_current_active_user),
):
    """Get knowledge mortality score for your organization."""
    org_id = current_user.organization_id or "demo-org"
    result = await processing_service.get_mortality_score(org_id)
    return ResponseEnvelope(data=result, message="Knowledge mortality score retrieved")

"""Mortality API routes — locked endpoint GET /api/v1/mortality/score matching PLAN.pdf Shared Contracts."""
from fastapi import APIRouter, Depends
from backend.core.dependencies import get_current_active_user
from backend.models.user import User
from backend.schemas.common import ResponseEnvelope
from backend.services.processing import processing_service

router = APIRouter(prefix="/mortality", tags=["Knowledge Mortality"])


@router.get("/score", response_model=ResponseEnvelope)
async def get_mortality_score_endpoint(
    current_user: User = Depends(get_current_active_user),
):
    """Get knowledge mortality score for your organization."""
    org_id = current_user.organization_id or "demo-org"
    result = await processing_service.get_mortality_score(org_id)
    return ResponseEnvelope(data=result, message="Knowledge mortality score retrieved")

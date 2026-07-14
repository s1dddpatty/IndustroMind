"""Expert Interview API routes — locked endpoints POST /api/v1/expert/interview/start matching PLAN.pdf Shared Contracts."""
from fastapi import APIRouter, Depends
from backend.core.dependencies import get_current_active_user
from backend.models.user import User
from backend.schemas.common import ResponseEnvelope
from backend.schemas.ai import ExpertInterviewStartRequest, ExpertInterviewProcessRequest
from backend.services.processing import processing_service

router = APIRouter(prefix="/expert", tags=["Expert Interview"])


@router.post("/interview/start", response_model=ResponseEnvelope)
async def start_expert_interview_endpoint(
    body: ExpertInterviewStartRequest,
    current_user: User = Depends(get_current_active_user),
):
    """Start a guided expert interview session for a piece of equipment."""
    result = await processing_service.start_interview(body.equipment_tag, body.context)
    return ResponseEnvelope(data=result, message="Expert interview started")


@router.post("/interview/process", response_model=ResponseEnvelope)
async def process_expert_interview_endpoint(
    body: ExpertInterviewProcessRequest,
    current_user: User = Depends(get_current_active_user),
):
    """Process an interview transcript into ExpertInsight entities and relationships."""
    result = await processing_service.process_interview(
        body.equipment_tag, body.context, body.transcript, body.author,
        org_id=current_user.organization_id
    )
    return ResponseEnvelope(data=result, message="Interview transcript processed")

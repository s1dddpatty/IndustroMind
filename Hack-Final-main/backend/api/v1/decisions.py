"""Decision & Expert Interview API routes — expose Person 2's decision intelligence through Person 1's REST API."""
from fastapi import APIRouter, Depends

from backend.core.dependencies import get_current_active_user
from backend.models.user import User
from backend.schemas.common import ResponseEnvelope
from backend.schemas.ai import (
    QueryRequest,
    ExpertInterviewStartRequest,
    ExpertInterviewStartResponse,
    ExpertInterviewProcessRequest,
)
from backend.services.processing import processing_service

router = APIRouter(prefix="/decisions", tags=["Decision Intelligence"])


@router.post("/query", response_model=ResponseEnvelope)
async def decision_query(
    body: QueryRequest,
    current_user: User = Depends(get_current_active_user),
):
    """
    Run a GraphRAG query and return a structured decision brief.
    Orchestrates Person 2's retrieval + decision brief generation.
    """
    org_id = body.org_id or current_user.organization_id
    result = await processing_service.query_decision(body.question, org_id)
    return ResponseEnvelope(data=result, message="Decision brief generated")


@router.post("/expert/interview/start", response_model=ResponseEnvelope)
async def start_expert_interview(
    body: ExpertInterviewStartRequest,
    current_user: User = Depends(get_current_active_user),
):
    """Start a guided expert interview session for a piece of equipment."""
    result = await processing_service.start_interview(body.equipment_tag, body.context)
    return ResponseEnvelope(data=result, message="Expert interview started")


@router.post("/expert/interview/process", response_model=ResponseEnvelope)
async def process_expert_interview(
    body: ExpertInterviewProcessRequest,
    current_user: User = Depends(get_current_active_user),
):
    """Process an interview transcript into ExpertInsight entities and relationships."""
    result = await processing_service.process_interview(
        body.equipment_tag, body.context, body.transcript, body.author
    )
    return ResponseEnvelope(data=result, message="Interview transcript processed")

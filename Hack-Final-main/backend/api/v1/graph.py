"""Graph API routes — expose Person 2's Neo4j graph through Person 1's REST API."""
from typing import Optional
from fastapi import APIRouter, Depends, Query

from backend.core.dependencies import get_current_active_user
from backend.models.user import User
from backend.schemas.common import ResponseEnvelope
from backend.schemas.ai import GraphNodeRead, GraphRelationshipRead, GraphStatsRead
from backend.services.processing import processing_service

router = APIRouter(prefix="/graph", tags=["Knowledge Graph"])


@router.get("/nodes", response_model=ResponseEnvelope)
async def get_graph_nodes(
    org_id: Optional[str] = Query(None),
    type_filter: Optional[str] = Query(None, alias="type"),
    current_user: User = Depends(get_current_active_user),
):
    """Get all nodes from the knowledge graph, optionally filtered."""
    target_org = org_id or current_user.organization_id
    nodes = await processing_service.get_graph_nodes(target_org, type_filter)
    return ResponseEnvelope(
        data={"nodes": nodes, "count": len(nodes)},
        message="Graph nodes retrieved",
    )


@router.get("/relationships", response_model=ResponseEnvelope)
async def get_graph_relationships(
    org_id: Optional[str] = Query(None),
    rel_type: Optional[str] = Query(None, alias="type"),
    current_user: User = Depends(get_current_active_user),
):
    """Get all relationships from the knowledge graph, optionally filtered."""
    target_org = org_id or current_user.organization_id
    rels = await processing_service.get_graph_relationships(target_org, rel_type)
    return ResponseEnvelope(
        data={"relationships": rels, "edges": rels, "count": len(rels)},
        message="Graph relationships retrieved",
    )


@router.get("/stats", response_model=ResponseEnvelope[GraphStatsRead])
async def get_graph_stats(
    org_id: Optional[str] = Query(None),
    current_user: User = Depends(get_current_active_user),
):
    """Get knowledge graph statistics."""
    target_org = org_id or current_user.organization_id
    stats = await processing_service.get_graph_stats(target_org)
    return ResponseEnvelope(data=stats, message="Graph stats retrieved")


@router.get("/labels", response_model=ResponseEnvelope)
async def get_locked_labels(
    current_user: User = Depends(get_current_active_user),
):
    """Get the locked node labels and relationship types from the graph schema."""
    from backend.core.container import container
    return ResponseEnvelope(data={
        "node_labels": container.graph.locked_node_labels,
        "relationship_types": container.graph.locked_relationship_types,
    })

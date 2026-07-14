"""AI, graph, compliance, and integrity response schemas."""
from datetime import datetime
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


# ── AI Query / Decision Brief ──

class DecisionBriefRead(BaseModel):
    query: str
    org_id: str
    intent: Optional[str] = None
    detected_entities: Optional[List[str]] = None
    graph_traversal_results: Optional[List[Dict[str, Any]]] = None
    semantic_search_results: Optional[List[Dict[str, Any]]] = None
    decision_brief: Optional[Dict[str, Any]] = None


class DecisionBriefResponse(BaseModel):
    """Full decision brief with all fields."""
    executive_summary: str
    recommendation: str
    operational_context: str
    affected_assets: List[str]
    applicable_regulations: List[str]
    maintenance_history: List[str]
    historical_incidents: List[str]
    dependencies: List[str]
    risk_assessment: str
    supporting_evidence: List[str]
    confidence_level: str
    suggested_next_steps: List[str]
    source_references: List[str]


from pydantic import BaseModel, Field, model_validator


class QueryRequest(BaseModel):
    question: Optional[str] = None
    query: Optional[str] = None
    org_id: str = Field("demo-org")

    @model_validator(mode="after")
    def populate_question(self) -> "QueryRequest":
        if not self.question and self.query:
            self.question = self.query
        if not self.question:
            raise ValueError("Either question or query must be provided")
        return self


# ── Expert Interview ──

class ExpertInterviewStartRequest(BaseModel):
    equipment_tag: str = Field(..., min_length=1)
    context: str = ""


class ExpertInterviewStartResponse(BaseModel):
    equipment_tag: str
    session_id: str
    status: str
    questions: List[str]


class ExpertInterviewProcessRequest(BaseModel):
    equipment_tag: str = Field(..., min_length=1)
    context: str = ""
    transcript: str = Field(..., min_length=1)
    author: str = "Senior Expert"


class ExpertInterviewProcessResponse(BaseModel):
    entities: List[Dict[str, Any]]
    relationships: List[Dict[str, Any]]


# ── Graph ──

class GraphNodeRead(BaseModel):
    name: str
    type: str
    properties: Dict[str, Any] = Field(default_factory=dict)
    org_id: Optional[str] = None
    confidence: float = 0.0


class GraphRelationshipRead(BaseModel):
    source_entity_name: str
    target_entity_name: str
    relationship_type: str
    properties: Dict[str, Any] = Field(default_factory=dict)
    supporting_evidence: str = ""
    confidence: float = 0.0


class GraphStatsRead(BaseModel):
    total_nodes: int
    total_relationships: int
    nodes_by_type: Dict[str, int]
    relationships_by_type: Dict[str, int]


# ── Compliance / Integrity ──

class IntegrityScanRequest(BaseModel):
    org_id: str = Field("demo-org")


class ContradictionRead(BaseModel):
    severity: str
    description: str
    affected_assets: List[str]
    affected_documents: List[str]
    evidence: str
    suggested_resolution: str
    responsible_department: str


class RegulatoryDriftRead(BaseModel):
    drift_status: str
    outdated_procedures: List[Dict[str, Any]]
    unmapped_regulations: List[Dict[str, Any]]
    summary: str


class KnowledgeMortalityRead(BaseModel):
    mortality_score: float
    risk_level: str
    high_risk_experts: List[Dict[str, Any]]
    knowledge_at_risk: List[Dict[str, Any]]
    recommended_interviews: List[Dict[str, Any]]
    summary: str


class IntegrityScanRead(BaseModel):
    org_id: str
    overall_status: str
    contradictions: List[ContradictionRead]
    regulatory_drift: RegulatoryDriftRead
    knowledge_mortality: KnowledgeMortalityRead


# ── Dashboard Alerts ──

class DashboardAlert(BaseModel):
    id: str
    type: str
    severity: str
    title: str
    message: str
    source: str
    created_at: datetime
    acknowledged: bool = False


class DashboardAlertList(BaseModel):
    alerts: List[DashboardAlert]
    total: int
    critical_count: int
    warning_count: int

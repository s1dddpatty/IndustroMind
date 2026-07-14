import json
from typing import Dict, Any, List
from pydantic import BaseModel, Field, field_validator
from backend.ai.llm_client import PromptLoader, llm_client

LOCKED_RELATIONSHIP_TYPES = {
    "CONNECTED_TO", "PART_OF", "LOCATED_IN", "MAINTAINED_BY",
    "GOVERNED_BY", "REFERENCES", "INSPECTED_BY", "CAUSES",
    "PREVENTS", "DEPENDS_ON", "DOWNSTREAM_AFFECTS", "REQUIRES",
    "AUTHORED_BY", "CONTRADICTS", "SUPERSEDES", "RELATES_TO"
}

class ExtractedRelationship(BaseModel):
    source_entity_name: str
    target_entity_name: str
    relationship_type: str
    properties: Dict[str, Any] = Field(default_factory=dict)
    supporting_evidence: str
    confidence: float = Field(ge=0.0, le=1.0, default=0.9)

    @field_validator("relationship_type")
    @classmethod
    def validate_rel_type(cls, v: str) -> str:
        if v not in LOCKED_RELATIONSHIP_TYPES:
            raise ValueError(f"Invalid relationship type '{v}'. Must be one of {LOCKED_RELATIONSHIP_TYPES}")
        return v

    @field_validator("supporting_evidence")
    @classmethod
    def validate_evidence(cls, v: str) -> str:
        if not v or len(v.strip()) == 0:
            raise ValueError("Supporting evidence cannot be empty.")
        return v

class RelationshipExtractionAgent:
    """
    Single-purpose agent responsible for discovering relationships between entities.
    Enforces locked Neo4j relationship types and mandatory supporting evidence.
    """
    def __init__(self):
        self.prompt_config = PromptLoader.load_prompt("relationship_discovery")

    def extract_relationships(self, entities: List[Dict[str, Any]], chunk_text: str) -> List[Dict[str, Any]]:
        if not entities:
            return []

        user_prompt = self.prompt_config["user_prompt_template"].format(
            entities_json=json.dumps(entities, indent=2),
            chunk_text=chunk_text
        )

        mock_fallback = {
            "relationships": [
                {
                    "source_entity_name": "SOP-MECH-042",
                    "target_entity_name": "P-204",
                    "relationship_type": "GOVERNED_BY",
                    "properties": {"action": "Isolation and Seal Replacement"},
                    "supporting_evidence": "Establish guidelines for safely isolating centrifugal pump P-204",
                    "confidence": 0.98
                },
                {
                    "source_entity_name": "SOP-MECH-042",
                    "target_entity_name": "OSHA 29 CFR 1910.147",
                    "relationship_type": "GOVERNED_BY",
                    "properties": {"compliance_type": "Mandatory"},
                    "supporting_evidence": "Governed by Regulation: OSHA 29 CFR 1910.147 (Lockout/Tagout)",
                    "confidence": 0.99
                },
                {
                    "source_entity_name": "V-101",
                    "target_entity_name": "P-204",
                    "relationship_type": "CONNECTED_TO",
                    "properties": {"connection_type": "Suction"},
                    "supporting_evidence": "Close suction valve V-101",
                    "confidence": 0.95
                },
                {
                    "source_entity_name": "V-102",
                    "target_entity_name": "P-204",
                    "relationship_type": "CONNECTED_TO",
                    "properties": {"connection_type": "Discharge"},
                    "supporting_evidence": "Close discharge valve V-102",
                    "confidence": 0.95
                },
                {
                    "source_entity_name": "INC-2023-09",
                    "target_entity_name": "P-204",
                    "relationship_type": "RELATES_TO",
                    "properties": {"failure_type": "Premature valve opening"},
                    "supporting_evidence": "Historical Incident Reference: Incident INC-2023-09 occurred due to premature valve opening",
                    "confidence": 0.94
                }
            ]
        }

        raw_result = llm_client.invoke(
            system_prompt=self.prompt_config["system_prompt"],
            user_prompt=user_prompt,
            mock_fallback=mock_fallback
        )

        raw_rels = raw_result.get("relationships", [])
        validated_rels = []

        for item in raw_rels:
            try:
                rel_obj = ExtractedRelationship(**item)
                validated_rels.append(rel_obj.model_dump())
            except Exception:
                continue

        return validated_rels

relationship_extraction_agent = RelationshipExtractionAgent()

import uuid
import json
from typing import Dict, Any, List
from pydantic import BaseModel, Field, field_validator
from backend.ai.llm_client import PromptLoader, llm_client

LOCKED_NODE_LABELS = {
    "Equipment", "Procedure", "Regulation", "Inspection", "Incident",
    "WorkOrder", "MaintenanceHistory", "Expert", "ExpertInsight",
    "Document", "Plant", "Organization", "PIDElement"
}

class ExtractedEntity(BaseModel):
    uuid: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    type: str
    properties: Dict[str, Any] = Field(default_factory=dict)
    source_reference: str = "Page 1, Para 1"
    confidence: float = Field(ge=0.0, le=1.0, default=0.9)

    @field_validator("type")
    @classmethod
    def validate_type(cls, v: str) -> str:
        if v not in LOCKED_NODE_LABELS:
            raise ValueError(f"Invalid node label '{v}'. Must be one of {LOCKED_NODE_LABELS}")
        return v

class EntityExtractionAgent:
    """
    Single-purpose agent responsible for extracting entities from chunks.
    Enforces strict Pydantic validation against locked Neo4j labels.
    """
    def __init__(self):
        self.prompt_config = PromptLoader.load_prompt("entity_extraction")

    def extract_entities(self, org_id: str, doc_id: str, chunk_text: str) -> List[Dict[str, Any]]:
        user_prompt = self.prompt_config["user_prompt_template"].format(
            org_id=org_id,
            doc_id=doc_id,
            chunk_text=chunk_text
        )

        mock_fallback = {
            "entities": [
                {
                    "name": "P-204",
                    "type": "Equipment",
                    "properties": {"equipment_type": "Centrifugal Pump", "unit": "Unit 3", "steam_pressure": "400 psi"},
                    "source_reference": "Page 1, Para 1",
                    "confidence": 0.98
                },
                {
                    "name": "SOP-MECH-042",
                    "type": "Procedure",
                    "properties": {"title": "Centrifugal Pump P-204 Isolation and Seal Replacement"},
                    "source_reference": "Page 1, Header",
                    "confidence": 0.99
                },
                {
                    "name": "OSHA 29 CFR 1910.147",
                    "type": "Regulation",
                    "properties": {"title": "Lockout/Tagout Standard"},
                    "source_reference": "Page 1, Header",
                    "confidence": 0.99
                },
                {
                    "name": "V-101",
                    "type": "Equipment",
                    "properties": {"valve_type": "Suction Valve"},
                    "source_reference": "Page 1, Step 3a",
                    "confidence": 0.95
                },
                {
                    "name": "V-102",
                    "type": "Equipment",
                    "properties": {"valve_type": "Discharge Valve"},
                    "source_reference": "Page 1, Step 3a",
                    "confidence": 0.95
                },
                {
                    "name": "INC-2023-09",
                    "type": "Incident",
                    "properties": {"description": "Premature valve opening prior to pressure bleed"},
                    "source_reference": "Page 1, Step 4",
                    "confidence": 0.97
                }
            ]
        }

        raw_result = llm_client.invoke(
            system_prompt=self.prompt_config["system_prompt"],
            user_prompt=user_prompt,
            mock_fallback=mock_fallback
        )

        raw_entities = raw_result.get("entities", [])
        validated_entities = []

        for item in raw_entities:
            try:
                # Add uuid if missing
                if "uuid" not in item:
                    item["uuid"] = str(uuid.uuid4())
                entity_obj = ExtractedEntity(**item)
                entity_dict = entity_obj.model_dump()
                entity_dict["org_id"] = org_id
                entity_dict["source_document_id"] = doc_id
                validated_entities.append(entity_dict)
            except Exception as e:
                # Skip invalid entity or fallback type
                continue

        return validated_entities

entity_extraction_agent = EntityExtractionAgent()

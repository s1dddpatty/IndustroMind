import json
from typing import Dict, Any, List
from pydantic import BaseModel, Field, field_validator
from backend.ai.llm_client import PromptLoader, llm_client

class DetectedContradiction(BaseModel):
    severity: str = Field(default="Major")
    description: str = Field(default="Operational contradiction identified.")
    affected_assets: List[str] = Field(default_factory=list)
    affected_documents: List[str] = Field(default_factory=list)
    evidence: str = Field(default="Document comparative evidence.")
    suggested_resolution: str = Field(default="Review and align conflicting SOPs.")
    responsible_department: str = Field(default="Process Safety")

    @field_validator("severity", mode="before")
    @classmethod
    def normalize_severity(cls, v: Any) -> str:
        s = str(v).capitalize()
        if s in ["Critical", "Major", "Minor", "Informational"]:
            return s
        if "crit" in s.lower() or "high" in s.lower():
            return "Critical"
        if "warn" in s.lower() or "med" in s.lower():
            return "Major"
        return "Minor"

class ContradictionDetectionEngine:
    """
    Single-purpose compliance engine responsible for scanning graph nodes and excerpts for factual or operational contradictions.
    Produces validated contradiction payloads ready for dashboard display or graph persistence.
    """
    def __init__(self):
        self.prompt_config = PromptLoader.load_prompt("contradiction_detection")

    def detect_contradictions(self, asset_context: str, excerpts: List[Dict[str, str]]) -> List[Dict[str, Any]]:
        if not excerpts:
            return []

        user_prompt = self.prompt_config["user_prompt_template"].format(
            asset_context=asset_context,
            excerpts_json=json.dumps(excerpts, indent=2)
        )

        mock_fallback = {
            "contradictions": [
                {
                    "severity": "Critical",
                    "description": "SOP-MECH-042 requires isolation valve V-101 to be locked out before venting, but OEM manual rev 3 states V-101 must remain cracked open 5% during seal warm-up.",
                    "affected_assets": ["P-204", "V-101"],
                    "affected_documents": ["SOP-MECH-042", "OEM-PUMP-204-MANUAL"],
                    "evidence": "SOP-MECH-042: 'Close suction valve V-101... Apply LOTO' vs OEM Manual: 'Keep V-101 cracked 5% during initial seal flush.'",
                    "suggested_resolution": "Update SOP-MECH-042 to add a dedicated warm-up flush bypass loop or clarify OEM exception.",
                    "responsible_department": "Process Safety & Mechanical Reliability"
                }
            ]
        }

        raw_result = llm_client.invoke(
            system_prompt=self.prompt_config["system_prompt"],
            user_prompt=user_prompt,
            mock_fallback=mock_fallback
        )

        raw_list = raw_result.get("contradictions", [])
        validated = []
        for item in raw_list:
            try:
                obj = DetectedContradiction(**item)
                validated.append(obj.model_dump())
            except Exception:
                continue

        return validated

contradiction_detection_engine = ContradictionDetectionEngine()

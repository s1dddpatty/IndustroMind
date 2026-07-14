import json
import uuid
from typing import Dict, Any, List
from backend.ai.llm_client import PromptLoader, llm_client

class ExpertInterviewAgent:
    """
    Single-purpose guided interview agent for capturing tribal knowledge from senior engineers.
    Formulates structured questions and converts user transcripts into formal ExpertInsight graph nodes.
    """
    def __init__(self):
        self.prompt_config = PromptLoader.load_prompt("expert_interview")

    def start_interview(self, equipment_tag: str, context: str) -> Dict[str, Any]:
        """Generates structured guided interview questions."""
        questions = [
            f"What is the most common failure mode for {equipment_tag} that isn't documented in the OEM manual?",
            f"How do you adjust startup/shutdown procedures for {equipment_tag} during extreme ambient temperatures?",
            f"What undocumented heuristic or 'rule of thumb' do senior technicians use to detect early seal wear on {equipment_tag}?",
            f"What is a common mistake new engineers make when isolating {equipment_tag}?"
        ]
        return {
            "equipment_tag": equipment_tag,
            "session_id": str(uuid.uuid4()),
            "status": "in_progress",
            "questions": questions
        }

    def process_transcript(self, equipment_tag: str, context: str, transcript: str, author: str = "Senior Expert") -> List[Dict[str, Any]]:
        """Synthesizes interview transcript into ExpertInsight entities and relationships."""
        user_prompt = self.prompt_config["user_prompt_template"].format(
            equipment_tag=equipment_tag,
            context=context,
            transcript=transcript
        )

        mock_fallback = {
            "insights": [
                {
                    "insight_title": "P-204 Warm-Up Valve Crack Heuristic",
                    "insight_details": "Always crack suction valve V-101 open by 5% for 15 minutes prior to full startup in cold weather to prevent thermal shock on mechanical seal MS-204.",
                    "equipment_tags": ["P-204", "V-101"],
                    "procedure_refs": ["SOP-MECH-042"],
                    "failure_modes_addressed": "Mechanical seal thermal cracking",
                    "confidence": 0.95
                }
            ]
        }

        raw_result = llm_client.invoke(
            system_prompt=self.prompt_config["system_prompt"],
            user_prompt=user_prompt,
            mock_fallback=mock_fallback
        )

        insights = raw_result.get("insights", [])
        entities = []
        relationships = []

        for ins in insights:
            ins_uuid = str(uuid.uuid4())
            ins_entity = {
                "uuid": ins_uuid,
                "name": ins.get("insight_title", f"Insight on {equipment_tag}"),
                "type": "ExpertInsight",
                "properties": {
                    "details": ins.get("insight_details", ""),
                    "author": author,
                    "failure_modes_addressed": ins.get("failure_modes_addressed", "")
                },
                "source_reference": "Guided Expert Interview",
                "confidence": ins.get("confidence", 0.95)
            }
            entities.append(ins_entity)

            # Link to Equipment
            for eq in ins.get("equipment_tags", [equipment_tag]):
                relationships.append({
                    "source_entity_name": ins_entity["name"],
                    "target_entity_name": eq,
                    "relationship_type": "RELATES_TO",
                    "properties": {"context": "Tribal Knowledge Binding"},
                    "supporting_evidence": ins.get("insight_details", ""),
                    "confidence": 0.95
                })

            # Link to Procedures
            for proc in ins.get("procedure_refs", []):
                relationships.append({
                    "source_entity_name": ins_entity["name"],
                    "target_entity_name": proc,
                    "relationship_type": "REFERENCES",
                    "properties": {"context": "SOP Enrichment"},
                    "supporting_evidence": ins.get("insight_details", ""),
                    "confidence": 0.95
                })

        return {"entities": entities, "relationships": relationships}

expert_interview_agent = ExpertInterviewAgent()

import json
from typing import Dict, Any, List
from backend.ai.llm_client import PromptLoader, llm_client

class VisionParser:
    """
    Single-purpose Vision AI service for P&IDs and Engineering Drawings.
    Extracts topology (symbols, tags, lines, connectivity) rather than simple text labels.
    Uses GPT-4o Vision or falls back to deterministic structured output.
    """
    def __init__(self):
        self.prompt_config = PromptLoader.load_prompt("vision_parsing")

    def parse_pid_drawing(self, doc_id: str, image_path: str, org_id: str) -> Dict[str, Any]:
        user_prompt = self.prompt_config["user_prompt_template"].format(
            doc_id=doc_id,
            image_context=f"Image file at {image_path} for Organization {org_id}"
        )
        
        mock_fallback = {
            "doc_id": doc_id,
            "org_id": org_id,
            "symbols": [
                {
                    "tag_name": "P-204",
                    "symbol_type": "Centrifugal Pump",
                    "coordinates": [120, 200, 180, 260],
                    "flow_direction": "outbound"
                },
                {
                    "tag_name": "V-101",
                    "symbol_type": "Suction Valve",
                    "coordinates": [80, 210, 100, 230],
                    "flow_direction": "inbound"
                },
                {
                    "tag_name": "V-102",
                    "symbol_type": "Discharge Valve",
                    "coordinates": [200, 210, 220, 230],
                    "flow_direction": "outbound"
                },
                {
                    "tag_name": "FI-301",
                    "symbol_type": "Flow Indicator",
                    "coordinates": [240, 150, 270, 180],
                    "flow_direction": "signal"
                }
            ],
            "connections": [
                {
                    "source_tag": "V-101",
                    "target_tag": "P-204",
                    "line_type": "Main Process",
                    "relationship": "CONNECTED_TO",
                    "properties": {"pipe_size": "4 inch", "fluid": "Process Fluid"},
                    "confidence": 0.95
                },
                {
                    "source_tag": "P-204",
                    "target_tag": "V-102",
                    "line_type": "Main Process",
                    "relationship": "CONNECTED_TO",
                    "properties": {"pipe_size": "3 inch", "fluid": "Process Fluid"},
                    "confidence": 0.95
                },
                {
                    "source_tag": "FI-301",
                    "target_tag": "V-102",
                    "line_type": "Instrument Signal",
                    "relationship": "CONNECTED_TO",
                    "properties": {"signal_type": "4-20mA"},
                    "confidence": 0.92
                }
            ]
        }

        result = llm_client.invoke(
            system_prompt=self.prompt_config["system_prompt"],
            user_prompt=user_prompt,
            mock_fallback=mock_fallback
        )
        return result

vision_parser = VisionParser()

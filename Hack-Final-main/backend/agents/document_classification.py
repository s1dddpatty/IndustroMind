import json
from typing import Dict, Any
from backend.ai.llm_client import PromptLoader, llm_client

VALID_CATEGORIES = {
    "SOP", "Maintenance Manual", "Inspection Report", "Incident Report",
    "P&ID", "Engineering Drawing", "Regulation", "OEM Manual", "Excel",
    "Email", "Work Order", "Unknown"
}

class DocumentClassificationAgent:
    """
    Single-purpose agent responsible for categorizing uploaded documents
    into one of the locked industrial document categories.
    """
    def __init__(self):
        self.prompt_config = PromptLoader.load_prompt("document_classification")

    def classify_document(self, file_name: str, raw_text: str) -> Dict[str, Any]:
        user_prompt = self.prompt_config["user_prompt_template"].format(
            file_name=file_name,
            document_text=raw_text[:2000]  # First 2000 chars for classification
        )

        # Deterministic heuristic fallback based on file name or text
        text_lower = raw_text.lower()
        if "sop-" in text_lower or "standard operating procedure" in text_lower:
            mock_cat = "SOP"
        elif "p&id" in text_lower or "piping and instrumentation" in text_lower or "drawing" in file_name.lower():
            mock_cat = "P&ID"
        elif "incident" in text_lower or "inc-" in text_lower:
            mock_cat = "Incident Report"
        elif "inspection" in text_lower or "ndt" in text_lower:
            mock_cat = "Inspection Report"
        elif "work order" in text_lower or "wo-" in text_lower:
            mock_cat = "Work Order"
        elif "regulation" in text_lower or "osha" in text_lower or "cfr" in text_lower:
            mock_cat = "Regulation"
        elif "maintenance" in text_lower or "manual" in text_lower:
            mock_cat = "Maintenance Manual"
        else:
            mock_cat = "Unknown"

        mock_fallback = {
            "category": mock_cat,
            "confidence": 0.96,
            "reasoning": f"Document content heavily references {mock_cat} keywords and structure."
        }

        result = llm_client.invoke(
            system_prompt=self.prompt_config["system_prompt"],
            user_prompt=user_prompt,
            mock_fallback=mock_fallback
        )

        category = result.get("category", "Unknown")
        if category not in VALID_CATEGORIES:
            category = "Unknown"
            result["category"] = category

        return result

document_classification_agent = DocumentClassificationAgent()

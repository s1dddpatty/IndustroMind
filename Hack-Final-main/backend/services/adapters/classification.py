"""Classification adapter — wraps Person 2 DocumentClassificationAgent."""
from typing import Any, Dict

from backend.agents.document_classification import document_classification_agent


class ClassificationAdapter:
    """Clean interface over Person 2's document classification."""

    def classify(self, file_name: str, raw_text: str) -> Dict[str, Any]:
        """Classify a document. Returns {category, confidence, reasoning}."""
        result = document_classification_agent.classify_document(file_name, raw_text)
        return {
            "classification": result.get("category", "Unknown"),
            "confidence": result.get("confidence", 0.0),
            "reasoning": result.get("reasoning", ""),
        }

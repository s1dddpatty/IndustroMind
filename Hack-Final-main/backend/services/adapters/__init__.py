"""Person 2 adapter layer.
Each adapter wraps a Person 2 module providing a clean interface.
Adapters never contain AI logic — they only delegate and transform.

Architecture:
  ProcessingService → AdapterContainer → Adapters → Person 2 Modules
"""

__all__ = [
    "classification_adapter",
    "extraction_adapter",
    "ocr_adapter",
    "graph_adapter",
    "compliance_adapter",
    "decision_adapter",
    "retrieval_adapter",
]

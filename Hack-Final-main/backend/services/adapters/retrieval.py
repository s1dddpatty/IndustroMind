"""Retrieval adapter — wraps Person 2 GraphRAG retrieval agent standalone."""
from typing import Any, Dict, List

from backend.agents.graphrag_retrieval import graphrag_retrieval_agent


class RetrievalAdapter:
    """Clean interface over Person 2's graph + semantic retrieval."""

    def retrieve(self, question: str, org_id: str) -> Dict[str, Any]:
        """Retrieve context via graph traversal + semantic search."""
        return graphrag_retrieval_agent.retrieve_context(question, org_id)

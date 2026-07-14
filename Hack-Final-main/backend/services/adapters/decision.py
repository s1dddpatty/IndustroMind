"""Decision adapter — wraps Person 2 DecisionBriefGenerator and GraphRAG retrieval."""
from typing import Any, Dict

from backend.decision.decision_brief_generator import decision_brief_generator
from backend.agents.graphrag_retrieval import graphrag_retrieval_agent


class DecisionAdapter:
    """Clean interface over Person 2's decision intelligence."""

    def retrieve_context(self, question: str, org_id: str) -> Dict[str, Any]:
        """Run GraphRAG retrieval: intent detection → graph traversal → semantic search."""
        return graphrag_retrieval_agent.retrieve_context(question, org_id)

    def generate_brief(self, query: str, retrieved_context: Dict[str, Any]) -> Dict[str, Any]:
        """Generate a structured decision brief from retrieved context."""
        return decision_brief_generator.generate_brief(query, retrieved_context)

    def query(self, question: str, org_id: str) -> Dict[str, Any]:
        """Full query flow: retrieval + decision brief generation."""
        context = self.retrieve_context(question, org_id)
        brief = self.generate_brief(question, context)
        return {
            "query": question,
            "org_id": org_id,
            "intent": context.get("intent"),
            "detected_entities": context.get("detected_entities"),
            "graph_traversal_results": context.get("graph_traversal_results"),
            "semantic_search_results": context.get("semantic_search_results"),
            "decision_brief": brief,
        }

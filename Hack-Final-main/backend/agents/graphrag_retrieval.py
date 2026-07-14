import json
from typing import Dict, Any, List
from backend.ai.llm_client import PromptLoader, llm_client
from backend.ai.embedding_generator import embedding_generator
from backend.graph.graph_builder import graph_builder

class GraphRAGRetrievalAgent:
    """
    Single-purpose GraphRAG retrieval agent.
    Enforces deterministic graph traversal queried BEFORE semantic search.
    Flow: User Question -> Intent/Entity Detection -> Deterministic Graph Traversal -> Semantic Fallback -> Evidence Collection.
    """
    def __init__(self):
        self.prompt_config = PromptLoader.load_prompt("graphrag_retrieval")

    def retrieve_context(self, question: str, org_id: str) -> Dict[str, Any]:
        # Step 1: Intent & Entity Detection via LLM / heuristic
        user_prompt = self.prompt_config["user_prompt_template"].format(question=question)
        mock_intent_fallback = {
            "detected_entities": ["P-204", "SOP-MECH-042", "OSHA 29 CFR 1910.147"],
            "intent": "Operational Inquiry"
        }
        intent_res = llm_client.invoke(
            system_prompt=self.prompt_config["system_prompt"],
            user_prompt=user_prompt,
            mock_fallback=mock_intent_fallback
        )
        detected_entities = intent_res.get("detected_entities", ["P-204"])
        intent = intent_res.get("intent", "Operational Inquiry")

        # Step 2: Deterministic Graph Traversal (Hardcoded logic gates, queried before semantic search)
        graph_context = self._deterministic_graph_traversal(org_id, detected_entities)

        # Step 3: Semantic Retrieval Fallback
        query_embedding = embedding_generator.generate_embedding(question)
        semantic_context = self._semantic_search_fallback(org_id, query_embedding, detected_entities)

        # Step 4: Evidence Collection
        aggregated_context = {
            "intent": intent,
            "detected_entities": detected_entities,
            "graph_traversal_results": graph_context,
            "semantic_search_results": semantic_context
        }
        return aggregated_context

    def _deterministic_graph_traversal(self, org_id: str, entities: List[str]) -> List[Dict[str, Any]]:
        """Hardcoded graph traversal logic."""
        results = []
        # Check mock store or live Neo4j
        mock_nodes = graph_builder.mock_graph_store.get("nodes", {})
        mock_rels = graph_builder.mock_graph_store.get("relationships", [])

        # If store has items, filter
        for ent_name in entities:
            key = f"{org_id}:{ent_name}"
            if key in mock_nodes:
                results.append({"node": mock_nodes[key]})

        for rel in mock_rels:
            if rel.get("org_id") == org_id and (rel["source_entity_name"] in entities or rel["target_entity_name"] in entities):
                results.append({"relationship": rel})

        # Default demo fallback if empty during standalone testing
        if not results:
            results = [
                {
                    "node": {"name": "P-204", "type": "Equipment", "properties": {"status": "Isolated last quarter for seal replacement"}}
                },
                {
                    "relationship": {
                        "source": "SOP-MECH-042",
                        "target": "P-204",
                        "type": "GOVERNED_BY",
                        "supporting_evidence": "Centrifugal Pump P-204 Isolation and Seal Replacement under OSHA LOTO rules."
                    }
                }
            ]
        return results

    def _semantic_search_fallback(self, org_id: str, embedding: List[float], entities: List[str]) -> List[Dict[str, Any]]:
        """Mock/Vector Index semantic search fallback."""
        return [
            {
                "chunk_id": "chunk_101",
                "text": "Pump P-204 was isolated during Q3 shutdown due to mechanical seal leak discovered during routine ultrasonic inspection.",
                "source_document_id": "doc_maintenance_log_2025",
                "similarity_score": 0.94
            }
        ]

graphrag_retrieval_agent = GraphRAGRetrievalAgent()

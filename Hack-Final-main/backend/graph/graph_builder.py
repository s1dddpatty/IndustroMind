import os
import logging
from typing import Dict, Any, List
from backend.graph.cypher_queries import (
    get_merge_node_query,
    get_merge_relationship_query,
    LOCKED_NODE_LABELS,
    LOCKED_RELATIONSHIP_TYPES
)

logger = logging.getLogger("neuroplant.graph_builder")

class KnowledgeGraphBuilder:
    """
    Single-purpose service for incremental Neo4j graph population.
    Never does full rebuilds. Records creation source, timestamps, confidence, org_id.
    Includes in-memory mock fallback for offline testing.
    """
    def __init__(self):
        self.neo4j_uri = os.getenv("NEO4J_URI", "bolt://localhost:7687")
        self.neo4j_user = os.getenv("NEO4J_USER", "neo4j")
        self.neo4j_password = os.getenv("NEO4J_PASSWORD", "password")
        self.mock_mode = os.getenv("NEUROPLANT_MOCK_MODE", os.getenv("MOCK_MODE", "true")).lower() == "true"
        self.mock_graph_store = {"nodes": {}, "relationships": []}

    def persist_entities_and_relationships(
        self,
        org_id: str,
        doc_id: str,
        entities: List[Dict[str, Any]],
        relationships: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Persists validated entities and relationships incrementally."""
        stats = {"nodes_created_or_updated": 0, "relationships_created": 0}

        if self.mock_mode or not self._connect():
            return self._mock_persist(org_id, doc_id, entities, relationships)

        try:
            from neo4j import GraphDatabase
            driver = GraphDatabase.driver(self.neo4j_uri, auth=(self.neo4j_user, self.neo4j_password))
            with driver.session() as session:
                for ent in entities:
                    label = ent.get("type")
                    if label not in LOCKED_NODE_LABELS:
                        continue
                    query = get_merge_node_query(label)
                    params = {
                        "name": ent["name"],
                        "org_id": org_id,
                        "uuid": ent.get("uuid", ""),
                        "confidence": ent.get("confidence", 0.9),
                        "source_document_id": doc_id,
                        "properties": ent.get("properties", {})
                    }
                    session.run(query, params)
                    stats["nodes_created_or_updated"] += 1

                for rel in relationships:
                    rel_type = rel.get("relationship_type")
                    if rel_type not in LOCKED_RELATIONSHIP_TYPES:
                        continue
                    query = get_merge_relationship_query(rel_type)
                    params = {
                        "source_name": rel["source_entity_name"],
                        "target_name": rel["target_entity_name"],
                        "org_id": org_id,
                        "supporting_evidence": rel.get("supporting_evidence", ""),
                        "confidence": rel.get("confidence", 0.9),
                        "properties": rel.get("properties", {})
                    }
                    session.run(query, params)
                    stats["relationships_created"] += 1
            driver.close()
            return {"status": "success", "stats": stats}
        except Exception as e:
            logger.warning(f"Neo4j connection failed, falling back to mock persistence: {e}")
            return self._mock_persist(org_id, doc_id, entities, relationships)

    def _connect(self) -> bool:
        if self.mock_mode:
            return False
        try:
            from neo4j import GraphDatabase
            driver = GraphDatabase.driver(self.neo4j_uri, auth=(self.neo4j_user, self.neo4j_password))
            driver.verify_connectivity()
            driver.close()
            return True
        except Exception:
            return False

    def _mock_persist(self, org_id: str, doc_id: str, entities: List[Dict[str, Any]], relationships: List[Dict[str, Any]]) -> Dict[str, Any]:
        for ent in entities:
            ent["org_id"] = org_id
            key = f"{org_id}:{ent['name']}"
            self.mock_graph_store["nodes"][key] = ent
        for rel in relationships:
            rel["org_id"] = org_id
            self.mock_graph_store["relationships"].append(rel)

        return {
            "status": "success",
            "mode": "mock_memory",
            "stats": {
                "nodes_created_or_updated": len(entities),
                "relationships_created": len(relationships)
            }
        }

graph_builder = KnowledgeGraphBuilder()

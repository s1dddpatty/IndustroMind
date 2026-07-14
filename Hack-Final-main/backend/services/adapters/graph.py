"""Graph adapter — wraps Person 2 KnowledgeGraphBuilder and Cypher queries."""
from typing import Any, Dict, List, Optional

from backend.graph.graph_builder import graph_builder
from backend.graph.cypher_queries import LOCKED_NODE_LABELS, LOCKED_RELATIONSHIP_TYPES


class GraphAdapter:
    """Clean interface over Person 2's Neo4j graph layer."""

    @property
    def locked_node_labels(self) -> List[str]:
        return list(LOCKED_NODE_LABELS)

    @property
    def locked_relationship_types(self) -> List[str]:
        return list(LOCKED_RELATIONSHIP_TYPES)

    def persist(self, org_id: str, doc_id: str, entities: List[Dict[str, Any]], relationships: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Persist entities and relationships into the graph."""
        return graph_builder.persist_entities_and_relationships(org_id, doc_id, entities, relationships)

    def get_nodes(self, org_id: Optional[str] = None, type_filter: Optional[str] = None) -> List[Dict[str, Any]]:
        """Retrieve graph nodes, optionally filtered by org and type."""
        nodes_dict = graph_builder.mock_graph_store.get("nodes", {})
        nodes = list(nodes_dict.values())
        filtered = nodes
        if org_id:
            filtered = [n for n in filtered if n.get("org_id") == org_id]
        if type_filter:
            filtered = [n for n in filtered if n.get("type") == type_filter]
        return filtered

    def get_relationships(self, org_id: Optional[str] = None, rel_type: Optional[str] = None) -> List[Dict[str, Any]]:
        """Retrieve graph relationships, optionally filtered by org and type."""
        rels = graph_builder.mock_graph_store.get("relationships", [])
        filtered = rels
        if org_id:
            filtered = [r for r in filtered if r.get("org_id") == org_id]
        if rel_type:
            filtered = [r for r in filtered if r.get("relationship_type") == rel_type]
        return filtered

    def get_stats(self, org_id: Optional[str] = None) -> Dict[str, Any]:
        """Get graph statistics: node count by type, relationship count by type."""
        nodes = self.get_nodes(org_id)
        rels = self.get_relationships(org_id)

        node_types: Dict[str, int] = {}
        for n in nodes:
            t = n.get("type", "Unknown")
            node_types[t] = node_types.get(t, 0) + 1

        rel_types: Dict[str, int] = {}
        for r in rels:
            t = r.get("relationship_type", "Unknown")
            rel_types[t] = rel_types.get(t, 0) + 1

        return {
            "total_nodes": len(nodes),
            "total_relationships": len(rels),
            "nodes_by_type": node_types,
            "relationships_by_type": rel_types,
        }

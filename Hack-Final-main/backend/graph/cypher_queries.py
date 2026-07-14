"""
Strict Cypher query definitions targeting Neo4j.
Enforces the locked list of node labels and relationship types agreed upon in Day 1 Shared Contracts.
"""

LOCKED_NODE_LABELS = [
    "Equipment", "Procedure", "Regulation", "Inspection", "Incident",
    "WorkOrder", "MaintenanceHistory", "Expert", "ExpertInsight",
    "Document", "Plant", "Organization", "PIDElement"
]

LOCKED_RELATIONSHIP_TYPES = [
    "CONNECTED_TO", "PART_OF", "LOCATED_IN", "MAINTAINED_BY",
    "GOVERNED_BY", "REFERENCES", "INSPECTED_BY", "CAUSES",
    "PREVENTS", "DEPENDS_ON", "DOWNSTREAM_AFFECTS", "REQUIRES",
    "AUTHORED_BY", "CONTRADICTS", "SUPERSEDES", "RELATES_TO"
]

def get_merge_node_query(label: str) -> str:
    """
    Returns incremental MERGE query for a locked node label.
    Every node carries mandatory properties: org_id, created_at, updated_at, confidence, source_document_id.
    """
    if label not in LOCKED_NODE_LABELS:
        raise ValueError(f"Label '{label}' is not in the locked Neo4j label list.")
    
    return f"""
    MERGE (n:{label} {{name: $name, org_id: $org_id}})
    ON CREATE SET 
        n.uuid = $uuid,
        n.created_at = datetime(),
        n.updated_at = datetime(),
        n.confidence = $confidence,
        n.source_document_id = $source_document_id,
        n += $properties
    ON MATCH SET 
        n.updated_at = datetime(),
        n.confidence = CASE WHEN $confidence > n.confidence THEN $confidence ELSE n.confidence END,
        n += $properties
    RETURN n
    """

def get_merge_relationship_query(rel_type: str) -> str:
    """
    Returns incremental MERGE query for a locked relationship type between two entities.
    Requires supporting evidence.
    """
    if rel_type not in LOCKED_RELATIONSHIP_TYPES:
        raise ValueError(f"Relationship type '{rel_type}' is not in the locked Neo4j relationship list.")
    
    return f"""
    MATCH (source {{name: $source_name, org_id: $org_id}})
    MATCH (target {{name: $target_name, org_id: $org_id}})
    MERGE (source)-[r:{rel_type}]->(target)
    ON CREATE SET 
        r.created_at = datetime(),
        r.updated_at = datetime(),
        r.supporting_evidence = $supporting_evidence,
        r.confidence = $confidence,
        r += $properties
    ON MATCH SET 
        r.updated_at = datetime(),
        r.supporting_evidence = r.supporting_evidence + ' | ' + $supporting_evidence,
        r += $properties
    RETURN r
    """

# Vector Index Creation Query
CREATE_VECTOR_INDEX_QUERY = """
CREATE VECTOR INDEX neuroplant_entity_embeddings IF NOT EXISTS
FOR (n:Document) ON (n.embedding)
OPTIONS {indexConfig: {
 `vector.dimensions`: 3072,
 `vector.similarity_function`: 'cosine'
}}
"""

# Traversal Queries for GraphRAG
FETCH_NEIGHBORHOOD_QUERY = """
MATCH (n {org_id: $org_id})-[r]-(neighbor)
WHERE n.name IN $entity_names OR n.uuid IN $entity_names
RETURN n.name AS source, type(r) AS rel, neighbor.name AS target, r.supporting_evidence AS evidence
LIMIT 50
"""

FETCH_DOWNSTREAM_AFFECTS_QUERY = """
MATCH path = (source:Equipment {name: $source_name, org_id: $org_id})-[r:CONNECTED_TO|DOWNSTREAM_AFFECTS*1..3]->(target:Equipment)
RETURN [node in nodes(path) | node.name] AS impact_path
"""

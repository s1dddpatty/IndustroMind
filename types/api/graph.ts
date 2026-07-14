export interface GraphNodeRead {
  name: string;
  type: string;
  properties?: Record<string, any>;
  org_id?: string;
  confidence?: number;
}

export interface GraphRelationshipRead {
  source_entity_name: string;
  target_entity_name: string;
  relationship_type: string;
  properties?: Record<string, any>;
  supporting_evidence?: string;
  confidence?: number;
}

export interface GraphStatsRead {
  total_nodes: number;
  total_relationships: number;
  nodes_by_type: Record<string, number>;
  relationships_by_type: Record<string, number>;
}

export interface GraphNodesResponse {
  data: {
    nodes: GraphNodeRead[];
    count: number;
  };
  message: string;
}

export interface GraphRelationshipsResponse {
  data: {
    relationships: GraphRelationshipRead[];
    edges: GraphRelationshipRead[];
    count: number;
  };
  message: string;
}

export interface GraphStatsResponse {
  data: GraphStatsRead;
  message: string;
}

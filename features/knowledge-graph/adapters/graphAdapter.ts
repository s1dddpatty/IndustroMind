import { GraphNodeRead, GraphRelationshipRead, GraphStatsRead } from "../../../types/api/graph";
import { KgNode, KgEdge, KgAnalytics, KgData, MOCK_KG_DATA } from "../constants/graphData";

export const graphAdapter = {
  adaptGraphData(
    nodesRes: GraphNodeRead[],
    relsRes: GraphRelationshipRead[],
    statsRes: GraphStatsRead | null
  ): KgData {
    // Sanitization Metrics (For debugging/monitoring only)
    const metrics = {
      totalInputNodes: nodesRes.length,
      totalInputEdges: relsRes.length,
      duplicateNodesRemoved: 0,
      orphanEdgesRemoved: 0,
      invalidReferencesIgnored: 0
    };

    // 1. Adapt Nodes (with deduplication)
    const uniqueNodeIds = new Set<string>();
    const adaptedNodes: KgNode[] = [];
    
    nodesRes.forEach(node => {
      if (!node.name) {
        metrics.invalidReferencesIgnored++;
        return;
      }
      if (uniqueNodeIds.has(node.name)) {
        metrics.duplicateNodesRemoved++;
        return;
      }
      uniqueNodeIds.add(node.name);
      
      adaptedNodes.push({
        id: node.name,
        label: node.name,
        category: (node.type || "Equipment") as any,
        status: "Healthy", // Placeholder: Backend doesn't support node status yet
        aiSummary: node.properties?.summary || `Entity of type ${node.type}`,
        owner: "System", // Placeholder
        department: "General", // Placeholder
        lastUpdated: new Date().toISOString(), // Placeholder
        health: {
          coverage: 100,
          confidence: Math.round((node.confidence || 0.95) * 100),
          completeness: 100,
          checks: [], // Placeholder: health checklists not available yet
          aiRecommendations: []
        },
        timeline: [] // Placeholder: timeline events not yet supported via API
      });
    });

    // 2. Adapt Edges (Orphan Edge protection)
    const adaptedEdges: KgEdge[] = [];
    
    relsRes.forEach(rel => {
      if (!rel.source_entity_name || !rel.target_entity_name) {
        metrics.invalidReferencesIgnored++;
        return;
      }
      if (!uniqueNodeIds.has(rel.source_entity_name) || !uniqueNodeIds.has(rel.target_entity_name)) {
        metrics.orphanEdgesRemoved++;
        return;
      }
      
      adaptedEdges.push({
          id: `${rel.source_entity_name}-${rel.target_entity_name}-${rel.relationship_type}`,
          source: rel.source_entity_name,
          target: rel.target_entity_name,
          relationship: rel.relationship_type,
          reasoning: rel.supporting_evidence || rel.properties?.reasoning || "Relationship established by analysis."
      });
    });

    if (process.env.NODE_ENV !== "production") {
      console.debug("Graph Sanitization Metrics:", metrics);
    }

    // 3. Adapt Analytics
    const adaptedAnalytics: KgAnalytics = {
      ...MOCK_KG_DATA.analytics, // Base layout placeholders
      totalNodes: statsRes?.total_nodes || adaptedNodes.length,
      totalRelationships: statsRes?.total_relationships || adaptedEdges.length
      // placeholders: knowledgeIntegrity, missingRelationships, orphanNodes, etc.
    };

    return {
      nodes: adaptedNodes,
      edges: adaptedEdges,
      analytics: adaptedAnalytics
    };
  }
};

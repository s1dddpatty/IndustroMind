import { apiClient } from "../../../lib/api/client";
import { API_ROUTES } from "../../../constants/api";
import { 
  GraphNodesResponse, 
  GraphRelationshipsResponse, 
  GraphStatsResponse,
  GraphNodeRead,
  GraphRelationshipRead,
  GraphStatsRead
} from "../../../types/api/graph";

export const graphRepository = {
  async getNodes(signal?: AbortSignal): Promise<GraphNodeRead[]> {
    const response = await apiClient.get<GraphNodesResponse>(API_ROUTES.GRAPH.NODES, { signal });
    // Safe extraction handling both envelope variations
    return response.data?.data?.nodes || (response.data as any)?.nodes || [];
  },

  async getRelationships(signal?: AbortSignal): Promise<GraphRelationshipRead[]> {
    const response = await apiClient.get<GraphRelationshipsResponse>(API_ROUTES.GRAPH.RELATIONSHIPS, { signal });
    // Safe extraction handling both envelope variations
    return response.data?.data?.relationships || response.data?.data?.edges || (response.data as any)?.relationships || [];
  },

  async getStats(signal?: AbortSignal): Promise<GraphStatsRead | null> {
    try {
      // The endpoint is /api/v1/graph/stats. We'll use API_ROUTES if available or hardcode.
      const response = await apiClient.get<GraphStatsResponse>('/api/v1/graph/stats', { signal });
      return response.data?.data || null;
    } catch (error) {
      console.warn("Graph stats endpoint unavailable, gracefully falling back", error);
      return null;
    }
  }
};

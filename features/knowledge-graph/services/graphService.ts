import { graphRepository } from "../repositories/graphRepository";
import { graphAdapter } from "../adapters/graphAdapter";
import { KgData, MOCK_KG_DATA } from "../constants/graphData";
import { APP_MODE, getDemoLatency } from "@/features/shared/config/appMode";

let cachedGraphData: KgData | null = null;
let isFetchInProgress: Promise<KgData> | null = null;

export const graphService = {
  /**
   * Fetches the complete Knowledge Graph (Nodes, Edges, Stats) concurrently
   * and delegates to the adapter. Implements an in-memory cache to prevent redundant fetches.
   */
  async fetchGraph(forceRefresh = false, signal?: AbortSignal): Promise<KgData> {
    if (!forceRefresh && cachedGraphData) {
      return cachedGraphData;
    }

    if (!forceRefresh && isFetchInProgress) {
      return isFetchInProgress;
    }

    if (APP_MODE === "DEMO") {
      isFetchInProgress = (async () => {
        await getDemoLatency(500, 1000);
        cachedGraphData = MOCK_KG_DATA;
        return MOCK_KG_DATA;
      })();
      return isFetchInProgress;
    }

    isFetchInProgress = (async () => {
      try {
        const [nodes, rels, stats] = await Promise.all([
          graphRepository.getNodes(signal),
          graphRepository.getRelationships(signal),
          graphRepository.getStats(signal)
        ]);

        const adaptedData = graphAdapter.adaptGraphData(nodes, rels, stats);
        cachedGraphData = adaptedData;
        return adaptedData;
      } catch (error) {
        if (APP_MODE === "AUTO") {
          console.warn("Backend unreachable, falling back to DEMO mode for Graph.");
          cachedGraphData = MOCK_KG_DATA;
          return MOCK_KG_DATA;
        }
        throw error;
      } finally {
        isFetchInProgress = null;
      }
    })();

    return isFetchInProgress;
  },

  /**
   * Clears the in-memory cache.
   */
  clearCache() {
    cachedGraphData = null;
  }
};

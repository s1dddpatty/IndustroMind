import { dashboardRepository } from "../repositories/dashboardRepository";
import { integrityService } from "../../compliance/services/integrityService";
import { documentRepository } from "../../documents/repositories/documentRepository";
import { auditRepository } from "../../system-health/repositories/auditRepository";
import { graphRepository } from "../../knowledge-graph/repositories/graphRepository";
import { aiBriefRepository } from "../repositories/aiBriefRepository";
import { queryRepository } from "../repositories/queryRepository";

import { dashboardAdapter } from "../adapters/dashboardAdapter";
import { DashboardData, DASHBOARD_DATA } from "../constants/dashboardData";
import { APP_MODE, getDemoLatency } from "@/features/shared/config/appMode";

let cachedDashboardData: DashboardData | null = null;

export const dashboardService = {
  /**
   * Fetches the dashboard overview data.
   */
  async getDashboardData(forceRefresh = false, signal?: AbortSignal): Promise<DashboardData> {
    if (!forceRefresh && cachedDashboardData) {
      return cachedDashboardData;
    }

    if (APP_MODE === "DEMO") {
      await getDemoLatency(400, 800);
      cachedDashboardData = DASHBOARD_DATA;
      return cachedDashboardData;
    }

    // Fire all requests concurrently, allowing individual failures without crashing the entire page.
    const [
      alertsRes,
      mortalityRes,
      documentsRes,
      auditRes,
      graphNodesRes,
      aiBriefRes,
      queriesRes
    ] = await Promise.allSettled([
      dashboardRepository.getAlerts(),
      integrityService.getMortalityScore(signal),
      documentRepository.getDocuments(),
      auditRepository.getSystemHealthLogs(),
      graphRepository.getNodes(),
      aiBriefRepository.getLatestBrief(),
      queryRepository.getRecentQueries()
    ]);

    const allFailed = alertsRes.status === "rejected" && documentsRes.status === "rejected" && graphNodesRes.status === "rejected";
    
    if (APP_MODE === "AUTO" && allFailed) {
      console.warn("Backend unreachable, falling back to DEMO mode for Dashboard.");
      cachedDashboardData = DASHBOARD_DATA;
      return cachedDashboardData;
    }

    // Extract values safely, passing null for rejected promises so the adapter uses fallback data
    cachedDashboardData = dashboardAdapter.adaptDashboardData(
      alertsRes.status === "fulfilled" ? alertsRes.value : null,
      mortalityRes.status === "fulfilled" ? mortalityRes.value : null,
      documentsRes.status === "fulfilled" ? documentsRes.value : null,
      auditRes.status === "fulfilled" ? auditRes.value : null,
      graphNodesRes.status === "fulfilled" ? graphNodesRes.value : null,
      aiBriefRes.status === "fulfilled" ? aiBriefRes.value : null,
      queriesRes.status === "fulfilled" ? queriesRes.value : []
    );
    
    return cachedDashboardData;
  },

  /**
   * Manually invalidate the full cache
   */
  clearCache() {
    cachedDashboardData = null;
  }
};

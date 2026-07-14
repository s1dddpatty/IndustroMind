import { integrityRepository } from "../repositories/integrityRepository";
import { integrityAdapter } from "../adapters/integrityAdapter";
import { ComplianceRule, COMPLIANCE_STATS, MOCK_COMPLIANCE_RULES } from "../constants/complianceData";
import { ScanResponseDTO, KnowledgeMortalityResponseDTO } from "../../../types/api/integrity";
import { APP_MODE, getDemoLatency } from "@/features/shared/config/appMode";

export interface IntegrityData {
  rules: ComplianceRule[];
  stats: typeof COMPLIANCE_STATS;
}

let cachedIntegrityData: IntegrityData | null = null;
let isFetchInProgress: Promise<IntegrityData> | null = null;
let cachedMortalityData: KnowledgeMortalityResponseDTO | null = null;

export const integrityService = {
  /**
   * Fetches Contradictions, Drift, and Mortality concurrently.
   * Partial failures degrade gracefully.
   */
  async fetchIntegrityData(forceRefresh = false, signal?: AbortSignal): Promise<IntegrityData> {
    if (!forceRefresh && cachedIntegrityData) {
      return cachedIntegrityData;
    }

    if (!forceRefresh && isFetchInProgress) {
      return isFetchInProgress;
    }

    if (APP_MODE === "DEMO") {
      isFetchInProgress = (async () => {
        await getDemoLatency();
        const demoData = { rules: MOCK_COMPLIANCE_RULES, stats: COMPLIANCE_STATS };
        cachedIntegrityData = demoData;
        return demoData;
      })();
      return isFetchInProgress;
    }

    isFetchInProgress = (async () => {
      try {
        const [contradictionsRes, driftRes, mortalityRes] = await Promise.allSettled([
          integrityRepository.getContradictions(signal),
          integrityRepository.getRegulatoryDrift(signal),
          integrityRepository.getMortality(signal)
        ]);

        if (contradictionsRes.status === "rejected" && driftRes.status === "rejected" && mortalityRes.status === "rejected") {
          throw new Error("All endpoints rejected");
        }

        const cData = contradictionsRes.status === "fulfilled" ? contradictionsRes.value.data.contradictions : null;
        const dData = driftRes.status === "fulfilled" ? driftRes.value.data : null;
        const mData = mortalityRes.status === "fulfilled" ? mortalityRes.value.data : null;

        if (mortalityRes.status === "fulfilled") {
            cachedMortalityData = mortalityRes.value;
        }

        const adaptedData = integrityAdapter.adaptIntegrityData(cData, dData, mData);
        cachedIntegrityData = adaptedData;
        return adaptedData;
      } catch (error) {
        if (APP_MODE === "AUTO") {
          console.warn("Backend unreachable, falling back to DEMO mode for integrity data.");
          const demoData = { rules: MOCK_COMPLIANCE_RULES, stats: COMPLIANCE_STATS };
          cachedIntegrityData = demoData;
          return demoData;
        }
        throw error;
      } finally {
        isFetchInProgress = null;
      }
    })();

    return isFetchInProgress;
  },

  /**
   * Dedicated method for the Dashboard to reuse Mortality data without 
   * duplicate network calls if it's already cached from the Compliance page.
   */
  async getMortalityScore(signal?: AbortSignal): Promise<KnowledgeMortalityResponseDTO> {
    if (cachedMortalityData) {
      return cachedMortalityData;
    }
    
    const mockMortality: KnowledgeMortalityResponseDTO = {
      data: {
        mortality_score: 85,
        risk_level: "High",
        high_risk_experts: [],
        knowledge_at_risk: [],
        recommended_interviews: [],
        summary: "Mock summary"
      }
    };

    if (APP_MODE === "DEMO") {
      await getDemoLatency();
      return mockMortality;
    }
    try {
      const data = await integrityRepository.getMortality(signal);
      cachedMortalityData = data;
      return data;
    } catch (error) {
      if (APP_MODE === "AUTO") {
        return mockMortality;
      }
      throw error;
    }
  },

  /**
   * Triggers a backend scan and invalidates the cache so the next
   * fetch request pulls fresh data.
   * 
   * ARCHITECTURE NOTE FOR ASYNC PROCESSING (FUTURE):
   * When the backend transitions `/scan` to an async job queue, this method 
   * should be updated to:
   * 1. POST /scan to receive a jobId
   * 2. Poll GET /scan/status/{jobId} until completed
   * 3. Clear cache and re-fetch only upon completion
   * 
   * The UI will simply `await runScan()` and show a loading spinner, decoupled 
   * from the actual polling mechanism happening inside this service.
   */
  async runScan(orgId: string = "demo-org", signal?: AbortSignal): Promise<ScanResponseDTO> {
    const mockScanResponse: ScanResponseDTO = {
      data: {
        org_id: orgId,
        overall_status: "completed",
        contradictions: [],
        regulatory_drift: {
          drift_status: "stable",
          outdated_procedures: [],
          unmapped_regulations: [],
          summary: ""
        },
        knowledge_mortality: {
          mortality_score: 85,
          risk_level: "High",
          high_risk_experts: [],
          knowledge_at_risk: [],
          recommended_interviews: [],
          summary: ""
        }
      }
    };

    if (APP_MODE === "DEMO") {
      await getDemoLatency(800, 1500); // Simulate longer scan
      this.clearCache();
      return mockScanResponse;
    }
    try {
      const res = await integrityRepository.runScan(orgId, signal);
      // Invalidate full cache since new contradictions/drift may have been found
      this.clearCache();
      return res;
    } catch (error) {
      if (APP_MODE === "AUTO") {
        await getDemoLatency(800, 1500);
        this.clearCache();
        return mockScanResponse;
      }
      throw error;
    }
  },

  /**
   * Clears the entire Integrity cache.
   */
  clearCache() {
    cachedIntegrityData = null;
    cachedMortalityData = null;
  },

  /**
   * Clears only specific segments of the cache.
   * Useful for targeted mutations (e.g., resolving a single contradiction).
   * In a more robust setup, this would selectively mutate `cachedIntegrityData.rules`.
   */
  clearContradictionsCache() {
    // For now, any mutation requires a full re-fetch to ensure consistency across the stats
    this.clearCache();
  },

  clearDriftCache() {
    this.clearCache();
  }
};

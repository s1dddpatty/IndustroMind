import { apiClient } from "@/lib/api/client";
import { 
  ContradictionResponseDTO, 
  RegulatoryDriftResponseDTO, 
  KnowledgeMortalityResponseDTO, 
  ScanResponseDTO 
} from "../../../types/api/integrity";

export const integrityRepository = {
  async getContradictions(signal?: AbortSignal): Promise<ContradictionResponseDTO> {
    const response = await apiClient.get<ContradictionResponseDTO>("/api/v1/integrity/contradictions", { signal });
    return response.data;
  },

  async getRegulatoryDrift(signal?: AbortSignal): Promise<RegulatoryDriftResponseDTO> {
    const response = await apiClient.get<RegulatoryDriftResponseDTO>("/api/v1/integrity/regulatory-drift", { signal });
    return response.data;
  },

  async getMortality(signal?: AbortSignal): Promise<KnowledgeMortalityResponseDTO> {
    const response = await apiClient.get<KnowledgeMortalityResponseDTO>("/api/v1/integrity/mortality", { signal });
    return response.data;
  },

  async runScan(orgId: string = "demo-org", signal?: AbortSignal): Promise<ScanResponseDTO> {
    const response = await apiClient.post<ScanResponseDTO>("/api/v1/integrity/scan", { org_id: orgId }, { signal });
    return response.data;
  }
};

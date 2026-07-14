import { apiClient } from "../../../lib/api/client";
import { AuditLogsResponseDTO } from "../../../types/api/audit";
import { handleApiError } from "../../../lib/api/errors";

export const auditRepository = {
  async getSystemHealthLogs(): Promise<AuditLogsResponseDTO> {
    try {
      const response = await apiClient.get<AuditLogsResponseDTO>("/api/v1/audit-logs/");
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
};

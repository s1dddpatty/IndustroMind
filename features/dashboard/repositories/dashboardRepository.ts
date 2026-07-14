import { apiClient } from "../../../lib/api/client";
import { API_ROUTES } from "../../../constants/api";
import { AlertsResponseDTO } from "../../../types/api/dashboard";
import { handleApiError } from "../../../lib/api/errors";

export const dashboardRepository = {
  async getAlerts(): Promise<AlertsResponseDTO> {
    try {
      const response = await apiClient.get<AlertsResponseDTO>(API_ROUTES.DASHBOARD.ALERTS);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
};

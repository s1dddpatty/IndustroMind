import { apiClient } from "../../../lib/api/client";
import { API_ROUTES } from "../../../constants/api";
import { MortalityResponseDTO } from "../../../types/api/dashboard";
import { handleApiError } from "../../../lib/api/errors";

export const mortalityRepository = {
  async getMortalityScore(): Promise<MortalityResponseDTO> {
    try {
      const response = await apiClient.get<MortalityResponseDTO>(API_ROUTES.MORTALITY.SCORE);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
};

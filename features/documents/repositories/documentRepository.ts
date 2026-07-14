import { apiClient } from "../../../lib/api/client";
import { API_ROUTES } from "../../../constants/api";
import { DocumentsResponseDTO } from "../../../types/api/documents";
import { handleApiError } from "../../../lib/api/errors";

export const documentRepository = {
  async getDocuments(page: number = 1, limit: number = 50, signal?: AbortSignal): Promise<DocumentsResponseDTO> {
    try {
      // Future-proofing: Pass pagination parameters to the backend
      const response = await apiClient.get<DocumentsResponseDTO>(API_ROUTES.DOCUMENTS.LIST, {
        params: { page, limit },
        signal
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async uploadDocument(file: File): Promise<void> {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("process_after_upload", "true");
      
      await apiClient.post(API_ROUTES.DOCUMENTS.UPLOAD, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
    } catch (error) {
      throw handleApiError(error);
    }
  }
};

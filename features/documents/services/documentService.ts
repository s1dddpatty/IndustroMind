import { documentRepository } from "../repositories/documentRepository";
import { documentAdapter } from "../adapters/documentAdapter";
import { DocumentData, MOCK_DOCUMENTS } from "../../dashboard/constants/recentDocumentsData";
import { APP_MODE, getDemoLatency } from "@/features/shared/config/appMode";

export const documentService = {
  /**
   * Fetches and adapts the complete document list.
   * Internal repository currently requests page 1, limit 100 for future compatibility.
   */
  async fetchDocuments(signal?: AbortSignal): Promise<DocumentData[]> {
    if (APP_MODE === "DEMO") {
      await getDemoLatency();
      return [...MOCK_DOCUMENTS];
    }
    
    try {
      const rawData = await documentRepository.getDocuments(1, 100, signal);
      return documentAdapter.adaptDocumentList(rawData);
    } catch (error) {
      if (APP_MODE === "AUTO") {
        console.warn("Backend unreachable, falling back to DEMO mode for documents.");
        return [...MOCK_DOCUMENTS];
      }
      throw error;
    }
  },

  /**
   * Uploads a document via FormData
   */
  async uploadDocument(file: File): Promise<void> {
    if (APP_MODE === "DEMO") {
      await getDemoLatency();
      return;
    }
    
    try {
      await documentRepository.uploadDocument(file);
    } catch (error) {
      if (APP_MODE === "AUTO") {
        console.warn("Backend unreachable, simulating DEMO mode upload.");
        return;
      }
      throw error;
    }
  }
};

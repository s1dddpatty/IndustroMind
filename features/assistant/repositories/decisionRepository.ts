import { apiClient } from "@/lib/api/client";
import { QueryRequest, QueryResponseDTO } from "@/types/api/decisions";

export const decisionRepository = {
  /**
   * Queries the Decision Assistant for a given question/prompt.
   */
  async queryAssistant(payload: QueryRequest, signal?: AbortSignal): Promise<QueryResponseDTO> {
    const response = await apiClient.post<QueryResponseDTO>("/api/v1/decisions/query", payload, { signal });
    return response.data;
  },

  /**
   * FUTURE: Fetch a specific conversation by ID
   */
  async getConversation(conversationId: string, signal?: AbortSignal): Promise<any> {
    throw new Error("getConversation not implemented on backend yet");
  },

  /**
   * FUTURE: Delete/Archive a conversation
   */
  async clearConversation(conversationId: string, signal?: AbortSignal): Promise<void> {
    throw new Error("clearConversation not implemented on backend yet");
  }
};

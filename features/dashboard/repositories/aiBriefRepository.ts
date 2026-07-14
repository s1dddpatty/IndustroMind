import { MOCK_AI_BRIEFS } from "../constants/aiDecisionBriefData";

// Temporary mock repository until backend endpoint is available
export const aiBriefRepository = {
  async getLatestBrief(): Promise<any> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return MOCK_AI_BRIEFS[0]; // Returning the mock data directly since no backend DTO exists yet
  }
};

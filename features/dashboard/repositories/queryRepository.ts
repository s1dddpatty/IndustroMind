import { MOCK_RECENT_QUERIES } from "../constants/recentQueriesData";

// Temporary mock repository until backend endpoint is available
export const queryRepository = {
  async getRecentQueries(): Promise<any[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return MOCK_RECENT_QUERIES; // Returning the mock data directly since no backend DTO exists yet
  }
};

import { AiDecisionBrief, MOCK_AI_BRIEFS } from "../constants/aiDecisionBriefData";

/**
 * Service to simulate a backend AI generation process.
 * In a real application, this would call POST /api/brief/generate
 * and optionally connect to a WebSocket for streaming updates.
 */

export type GenerationStep = {
  message: string;
  durationMs: number;
};

export const GENERATION_STEPS: GenerationStep[] = [
  { message: "Reading uploaded documents...", durationMs: 800 },
  { message: "Extracting operational entities...", durationMs: 700 },
  { message: "Building Knowledge Graph...", durationMs: 900 },
  { message: "Linking relevant SOPs...", durationMs: 600 },
  { message: "Detecting procedural contradictions...", durationMs: 800 },
  { message: "Evaluating compliance status...", durationMs: 700 },
  { message: "Finding operational risks...", durationMs: 800 },
  { message: "Prioritizing maintenance recommendations...", durationMs: 600 },
  { message: "Writing executive summary...", durationMs: 900 },
  { message: "Finalizing AI Brief...", durationMs: 600 },
];

export const aiBriefService = {
  /**
   * Generates a new brief. Resolves with the new brief object after the simulated delay.
   */
  async generateNewBrief(currentBriefId?: string): Promise<AiDecisionBrief> {
    const totalDelay = GENERATION_STEPS.reduce((sum, step) => sum + step.durationMs, 0);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        // Pick a random brief that is not the current one
        const availableBriefs = MOCK_AI_BRIEFS.filter(b => b.id !== currentBriefId);
        const randomBrief = availableBriefs[Math.floor(Math.random() * availableBriefs.length)] || MOCK_AI_BRIEFS[0];
        
        // Return a fresh clone with updated timestamp to simulate a brand new generation
        const newBrief: AiDecisionBrief = {
          ...randomBrief,
          id: `brief-${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
        
        resolve(newBrief);
      }, totalDelay + 200); // Add a small buffer
    });
  }
};

/**
 * Application Modes:
 * "AUTO" - Tries backend first, falls back to demo data if backend fails or is unreachable.
 * "LIVE" - Always requires the backend. Fails if backend is unreachable.
 * "DEMO" - Never calls the backend. Resolves instantly (with simulated delay) using mock data.
 */
export type AppMode = "AUTO" | "LIVE" | "DEMO";

// Hardcoded for this build per requirements. Can be mapped to process.env in the future.
export const APP_MODE: AppMode = "LIVE";

/**
 * Returns a randomized delay between min and max milliseconds to simulate network latency
 * during DEMO mode execution.
 */
export const getDemoLatency = (min = 300, max = 700): Promise<void> => {
  const latency = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise(resolve => setTimeout(resolve, latency));
};

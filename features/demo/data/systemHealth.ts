export interface SystemService {
  name: string;
  status: "Operational" | "Healthy" | "Degraded" | "Down";
}

export const demoSystemHealth = {
  overallHealth: 98,
  services: [
    { name: "AI Services", status: "Operational" as const },
    { name: "Knowledge Graph", status: "Healthy" as const },
    { name: "Document Processing", status: "Operational" as const },
    { name: "Compliance Engine", status: "Operational" as const }
  ]
};

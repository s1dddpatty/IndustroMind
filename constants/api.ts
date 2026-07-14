export const API_ROUTES = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
  },
  DASHBOARD: {
    ALERTS: "/dashboard/alerts",
  },
  DOCUMENTS: {
    LIST: "/api/v1/documents/",
    UPLOAD: "/api/v1/documents/upload",
  },
  GRAPH: {
    NODES: "/graph/nodes",
    RELATIONSHIPS: "/graph/relationships",
  },
  EXPERT: {
    START_INTERVIEW: "/expert/interview/start",
    PROCESS_INTERVIEW: "/expert/interview/process",
  },
  INTEGRITY: {
    SCAN: "/integrity/scan",
    CONTRADICTIONS: "/integrity/contradictions",
    REGULATORY_DRIFT: "/integrity/regulatory-drift",
  },
  MORTALITY: {
    SCORE: "/mortality/score",
  },
  AUDIT: {
    LOGS: "/audit-logs",
  },
} as const;

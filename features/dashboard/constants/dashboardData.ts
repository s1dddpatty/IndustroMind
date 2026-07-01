import { AlertData, DASHBOARD_ALERTS } from "./alerts";
// Knowledge Graph data is dynamically imported by the workspace now
import { AiDecisionBrief, MOCK_AI_BRIEFS } from "./aiDecisionBriefData";
import { DocumentData, MOCK_DOCUMENTS } from "./recentDocumentsData";
import { Query, MOCK_RECENT_QUERIES } from "./recentQueriesData";
import { SystemModule, MOCK_SYSTEM_HEALTH } from "./systemHealthData";

export interface HeroData {
  greeting: string;
  subtitle: string;
  primaryAction: string;
  secondaryAction: string;
}

export interface KpiData {
  id: string;
  title: string;
  value: string;
  iconName: string;
  color: "green" | "red" | "orange" | "purple" | "blue";
  trend: {
    value: string;
    direction: "up" | "down";
    text: string;
    colorOverride?: "green" | "red";
  };
  sparklineData: number[];
}

export interface WorkspaceSectionData {
  title: string;
}

export interface ProactiveAlertsData extends WorkspaceSectionData {
  criticalCount: number;
  alerts: AlertData[];
}

export interface KnowledgeGraphData extends WorkspaceSectionData {
}

export interface DashboardWorkspaceData {
  proactiveAlerts: ProactiveAlertsData;
  knowledgeGraph: KnowledgeGraphData;
  aiDecisionBrief: {
    title: string;
    currentBrief: AiDecisionBrief;
  };
}

export interface DashboardBottomRowData {
  recentDocuments: {
    title: string;
    documents: DocumentData[];
  };
  recentQueries: WorkspaceSectionData & {
    queries: Query[];
  };
  systemHealth: WorkspaceSectionData & {
    services: SystemModule[];
  };
}

export interface DashboardData {
  hero: HeroData;
  kpis: KpiData[];
  workspace: DashboardWorkspaceData;
  bottomRow: DashboardBottomRowData;
}

export const DASHBOARD_DATA: DashboardData = {
  hero: {
    greeting: "Welcome back, Admin 👋",
    subtitle: "Here's what's happening at your plant today.",
    primaryAction: "Upload Document",
    secondaryAction: "Ask AI",
  },
  kpis: [
    {
      id: "kpi-1",
      title: "Knowledge Integrity",
      value: "92%",
      iconName: "ShieldCheck",
      color: "green",
      trend: {
        value: "8%",
        direction: "up",
        text: "vs last 7 days",
      },
      sparklineData: [10, 15, 12, 18, 24, 20, 30],
    },
    {
      id: "kpi-2",
      title: "Active Contradictions",
      value: "3",
      iconName: "TriangleAlert",
      color: "red",
      trend: {
        value: "2",
        direction: "down",
        text: "vs last 7 days",
      },
      sparklineData: [5, 4, 4, 3, 3, 2, 1],
    },
    {
      id: "kpi-3",
      title: "SOPs Non-Compliant",
      value: "7",
      iconName: "FileWarning",
      color: "orange",
      trend: {
        value: "3",
        direction: "up",
        text: "vs last 7 days",
      },
      sparklineData: [2, 2, 3, 4, 4, 5, 7],
    },
    {
      id: "kpi-4",
      title: "Knowledge Mortality",
      value: "34%",
      iconName: "Activity",
      color: "purple",
      trend: {
        value: "6%",
        direction: "down",
        text: "vs last 7 days",
        colorOverride: "green",
      },
      sparklineData: [40, 38, 38, 36, 35, 34, 34],
    },
    {
      id: "kpi-5",
      title: "Documents Processed",
      value: "247",
      iconName: "FileText",
      color: "blue",
      trend: {
        value: "24",
        direction: "up",
        text: "vs last 7 days",
      },
      sparklineData: [200, 210, 215, 220, 230, 235, 247],
    },
  ],
  workspace: {
    proactiveAlerts: {
      title: "Proactive Alerts",
      criticalCount: 3,
      alerts: DASHBOARD_ALERTS,
    },
    knowledgeGraph: {
      title: "Knowledge Graph Overview",
    },
    aiDecisionBrief: {
      title: "AI Decision Brief",
      currentBrief: MOCK_AI_BRIEFS[0]
    },
  },
  bottomRow: {
    recentDocuments: {
      title: "Recent Documents",
      documents: MOCK_DOCUMENTS
    },
    recentQueries: {
      title: "Recent Queries",
      queries: MOCK_RECENT_QUERIES
    },
    systemHealth: {
      title: "System Health",
      services: MOCK_SYSTEM_HEALTH
    },
  },
};

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
      value: "0%",
      iconName: "ShieldCheck",
      color: "green",
      trend: {
        value: "0%",
        direction: "up",
        text: "Awaiting documents",
      },
      sparklineData: [0, 0, 0, 0, 0],
    },
    {
      id: "kpi-2",
      title: "Active Contradictions",
      value: "0",
      iconName: "TriangleAlert",
      color: "red",
      trend: {
        value: "0",
        direction: "down",
        text: "No contradictions",
      },
      sparklineData: [0, 0, 0, 0, 0],
    },
    {
      id: "kpi-3",
      title: "SOPs Non-Compliant",
      value: "0",
      iconName: "FileWarning",
      color: "orange",
      trend: {
        value: "0",
        direction: "down",
        text: "All SOPs compliant",
      },
      sparklineData: [0, 0, 0, 0, 0],
    },
    {
      id: "kpi-4",
      title: "Knowledge Mortality",
      value: "0%",
      iconName: "Activity",
      color: "purple",
      trend: {
        value: "0%",
        direction: "down",
        text: "No risk detected",
        colorOverride: "green",
      },
      sparklineData: [0, 0, 0, 0, 0],
    },
    {
      id: "kpi-5",
      title: "Documents Processed",
      value: "0",
      iconName: "FileText",
      color: "blue",
      trend: {
        value: "0",
        direction: "up",
        text: "Upload to begin",
      },
      sparklineData: [0, 0, 0, 0, 0],
    },
  ],
  workspace: {
    proactiveAlerts: {
      title: "Proactive Alerts",
      criticalCount: 0,
      alerts: [],
    },
    knowledgeGraph: {
      title: "Knowledge Graph Overview",
    },
    aiDecisionBrief: {
      title: "AI Decision Brief",
      currentBrief: {
        id: "brief-init",
        title: "Awaiting Document Analysis",
        timestamp: "Just now",
        status: "Informational",
        executiveSummary: "No industrial documents analyzed yet. Upload an SOP or standard to trigger AI reasoning.",
        recommendation: "Upload a compliance PDF to generate operational decision briefs.",
        actionItems: [],
        keyFindings: [],
        confidence: 0,
        tags: ["Pending Upload"],
        category: "Operational",
        metrics: []
      } as any
    },
  },
  bottomRow: {
    recentDocuments: {
      title: "Recent Documents",
      documents: []
    },
    recentQueries: {
      title: "Recent Queries",
      queries: []
    },
    systemHealth: {
      title: "System Health",
      services: MOCK_SYSTEM_HEALTH
    },
  },
};

export interface ReportConfidenceMetrics {
  aiConfidence: number;
  evidenceConfidence: number;
  knowledgeCoverage: number;
  dataFreshness: number;
  reasoningConfidence: number;
}

export interface ReportNarrative {
  whatHappened: string;
  whyItHappened: string;
  operationalImpact: string;
  whatNext: string;
  costOfInaction: string;
}

export interface ReportFinding {
  id: string;
  title: string;
  description: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  trend: "Improving" | "Degrading" | "Stable";
}

export interface ReportChartData {
  id: string;
  title: string;
  type: "trend" | "bar" | "distribution";
  labels: string[];
  series: { name: string; data: number[]; color: string }[];
}

export interface ReportEvidence {
  id: string;
  title: string;
  type: "Document" | "SOP" | "Knowledge Graph Node" | "Inspection Report" | "Maintenance Record" | "Compliance Rule" | "Alert" | "AI Brief" | "Decision Assistant Session" | "Expert Knowledge Node";
}

export interface ExecutiveDecisionAction {
  id: string;
  action: string;
  department: string;
  impact: string;
}

export interface ExecutiveDecisionPanel {
  immediateActions: ExecutiveDecisionAction[];
  shortTermActions: ExecutiveDecisionAction[];
  longTermImprovements: ExecutiveDecisionAction[];
  escalationRequired: boolean;
}

export interface ReportVersion {
  version: string;
  generatedDate: string;
  generatedBy: string;
  reviewedBy: string;
  approvedBy: string;
  changesSinceLast: string;
}

export interface IntelligenceReport {
  id: string;
  title: string;
  reportType: "Daily Operations Summary" | "Maintenance Summary" | "Compliance Status Report" | "Safety Performance Report" | "Asset Health Report" | "Inspection Summary" | "Knowledge Gap Report" | "Cross-functional Intelligence Report";
  category: "Executive" | "Maintenance" | "Compliance" | "Safety" | "Operations" | "Asset" | "Knowledge";
  status: "Draft" | "Pending Approval" | "Published" | "Archived" | "queued" | "processing" | "completed" | "failed" | "cancelled" | "expired";
  
  generatedBy: string;
  generatedAt: string;
  timeRange: "Last 24 Hours" | "Last 7 Days" | "Last 30 Days" | "YTD" | "Custom";
  department: string;

  confidence: ReportConfidenceMetrics;
  narrative: ReportNarrative;
  findings: ReportFinding[];
  charts: ReportChartData[];
  evidence: ReportEvidence[];
  affectedAssets: Array<{ id: string, tag: string, name: string }>;
  decisionPanel: ExecutiveDecisionPanel;
  knowledgeInsights: string[];
  history: ReportVersion[];

  // Source provenance metadata
  backendMetadata?: {
    backendId?: string;
    originalPayload?: any;
    endpointOrigin?: string;
    fetchedAt?: string;
    adapterVersion?: string;
  };

  // AI Readiness fields (optional future capability)
  aiExecutiveSummary?: string;
  aiRecommendations?: string[];
  aiConfidenceScore?: number;
  relatedDocuments?: string[];
  relatedAssetsList?: string[];
  relatedGraphNodes?: string[];
  complianceImpact?: string;
  knowledgeImpact?: string;
  suggestedActionsList?: string[];
  
  // Future capabilities
  scheduled?: boolean;
  recurring?: boolean;
  isShared?: boolean;
}

export const MOCK_INTELLIGENCE_REPORTS: IntelligenceReport[] = [
  {
    id: "rep-001",
    title: "Unit 2 Cross-Functional Risk & Compliance Synthesis",
    reportType: "Cross-functional Intelligence Report",
    category: "Executive",
    status: "Published",
    generatedBy: "IndustroMind Neuro-Symbolic Engine",
    generatedAt: "2026-07-01T06:00:00Z",
    timeRange: "Last 7 Days",
    department: "Plant Management",

    confidence: {
      aiConfidence: 96,
      evidenceConfidence: 98,
      knowledgeCoverage: 92,
      dataFreshness: 99,
      reasoningConfidence: 95
    },

    narrative: {
      whatHappened: "A systemic risk cluster has emerged in Unit 2 centering around undocumented maintenance practices and missing compliance verifications. Specifically, active maintenance on Compressor C-105 bypassed mandated LOTO pneumatic bleed procedures, and Firewater Pump P-201 deluge valves missed their 30-day inspection window.",
      whyItHappened: "The root cause traces to knowledge fragmentation. The pneumatic bleed heuristic for C-105 exists as tacit knowledge (Expert Knowledge ek-002) but was never propagated into the official SOP. Concurrently, the inspection scheduling system failed to trigger the P-201 deluge valve alert due to a stale equipment hierarchy mapping.",
      operationalImpact: "Unit 2 is currently operating under a severe, undocumented safety exposure. A fire event would face delayed suppression, while any further mechanical intervention on C-105 poses a fatal risk to maintenance personnel.",
      whatNext: "Immediate halt of all C-105 interventions until the SOP is updated. Immediate dispatch of safety inspectors to Unit 2 deluge valves.",
      costOfInaction: "High probability of regulatory shutdown if audited by OSHA/OISD, or catastrophic safety incidents resulting in fatalities and massive production loss."
    },

    findings: [
      {
        id: "find-1",
        title: "C-105 LOTO Pneumatic Bypass",
        description: "Mechanics performing filter replacements are bypassing the pneumatic bleed on V-901 because the official SOP does not mention it.",
        severity: "Critical",
        trend: "Degrading"
      },
      {
        id: "find-2",
        title: "OISD-189 Compliance Gap (P-201)",
        description: "Deluge valve inspections for the primary cooling sector are 12 days overdue.",
        severity: "High",
        trend: "Degrading"
      },
      {
        id: "find-3",
        title: "P-201 Cold-Start Vibration Stabilization",
        description: "Cold-start vibration heuristics correctly applied by operators prevented 2 false trips this week.",
        severity: "Medium",
        trend: "Improving"
      }
    ],

    charts: [
      {
        id: "chart-1",
        title: "Unit 2 Risk Distribution (7 Days)",
        type: "bar",
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        series: [
          { name: "Safety Risks", data: [2, 1, 1, 3, 5, 4, 6], color: "#ef4444" },
          { name: "Operational Anomalies", data: [5, 4, 4, 3, 2, 2, 1], color: "#f59e0b" }
        ]
      },
      {
        id: "chart-2",
        title: "Compliance Health Trend",
        type: "trend",
        labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
        series: [
          { name: "Overall Score", data: [95, 92, 85, 79], color: "#10b981" }
        ]
      }
    ],

    evidence: [
      { id: "ev-1", title: "OSHA 1910.147 Compliance Alert", type: "Compliance Rule" },
      { id: "ev-2", title: "LOTO Bypass Pitfalls on C-105", type: "Expert Knowledge Node" }, // Simulated
      { id: "ev-3", title: "OISD-189 Section 4.2", type: "Compliance Rule" },
      { id: "ev-4", title: "C-105 Maintenance Work Order", type: "Maintenance Record" },
      { id: "ev-5", title: "Compressor C-105 LOTO SOP (Outdated)", type: "SOP" }
    ],

    affectedAssets: [
      { id: "asset-002", tag: "C-105", name: "Main Air Compressor" },
      { id: "asset-001", tag: "P-201", name: "Primary Cooling Water Pump" }
    ],

    decisionPanel: {
      immediateActions: [
        { id: "act-1", action: "Halt C-105 maintenance and dispatch safety team.", department: "HSE", impact: "Eliminates immediate fatal hazard." },
        { id: "act-2", action: "Perform emergency deluge valve inspection on Unit 2.", department: "Maintenance", impact: "Restores fire safety compliance." }
      ],
      shortTermActions: [
        { id: "act-3", action: "Update C-105 LOTO SOP to include V-901 bleed step.", department: "Engineering", impact: "Closes systemic knowledge gap." }
      ],
      longTermImprovements: [
        { id: "act-4", action: "Audit scheduling hierarchy for all firewater systems.", department: "Reliability", impact: "Prevents future missing inspections." }
      ],
      escalationRequired: true
    },

    knowledgeInsights: [
      "Contradiction: Expert Knowledge 'ek-002' contradicts the official C-105 SOP. The tacit knowledge is correct, the document is dangerously outdated.",
      "Missing Relationship: The CMMS maintenance schedule for P-201 is not currently mapped to the OISD-189 regulatory node in the Knowledge Graph.",
      "High Integrity: The P-201 cold-start vibration heuristic was successfully utilized 3 times this week, proving high operational value."
    ],

    history: [
      {
        version: "v1.1",
        generatedDate: "2026-07-01T06:00:00Z",
        generatedBy: "Neuro-Symbolic Engine",
        reviewedBy: "AI Automated Review",
        approvedBy: "System",
        changesSinceLast: "Escalated severity of C-105 finding based on new work order execution."
      },
      {
        version: "v1.0",
        generatedDate: "2026-06-30T06:00:00Z",
        generatedBy: "Neuro-Symbolic Engine",
        reviewedBy: "AI Automated Review",
        approvedBy: "System",
        changesSinceLast: "Initial Generation"
      }
    ]
  }
];

export const REPORT_STATS = {
  generatedToday: 12,
  scheduledReports: 45,
  pendingApproval: 3,
  criticalReports: 1,
  aiGeneratedBriefs: 28
};

export interface OperationalRisk {
  id: string;
  title: string;
  severity: "High" | "Medium" | "Low";
  description: string;
}

export interface ComplianceIssue {
  id: string;
  status: "Compliant" | "Warning" | "Violation";
  details: string;
}

export interface MaintenanceAction {
  id: string;
  asset: string;
  action: string;
  priority: "Urgent" | "Normal";
}

export interface AiSuggestedAction {
  id: string;
  action: string;
  impact: string;
}

export interface HumanDecision {
  id: string;
  decision: string;
  deadline: string;
}

export interface AiDecisionBrief {
  id: string;
  title: string;
  createdAt: string;
  plantId: string;
  shift: string;
  confidenceScore: number;
  status: "Ready" | "Review Required" | "Critical";
  
  // Dashboard Preview Data
  previewBullets: string[];
  
  // Full Workspace Data
  executiveSummary: string;
  operationalRisks: OperationalRisk[];
  complianceSummary: ComplianceIssue[];
  maintenanceRecommendations: MaintenanceAction[];
  inspectionPriorities: string[];
  aiSuggestedActions: AiSuggestedAction[];
  predictedBottlenecks: string[];
  requiredHumanDecisions: HumanDecision[];
}

export const MOCK_AI_BRIEFS: AiDecisionBrief[] = [
  {
    id: "brief-001",
    title: "Morning Shift Brief",
    createdAt: new Date(Date.now() - 30 * 60000).toISOString(),
    plantId: "Sample Plant - Steel Manufacturing",
    shift: "Morning (06:00 - 14:00)",
    confidenceScore: 92,
    status: "Ready",
    previewBullets: [
      "3 high-priority issues identified",
      "7 SOPs require attention",
      "All critical assets operational",
      "No safety incidents in last 24h"
    ],
    executiveSummary: "The plant is operating at 94% overall efficiency. No critical failures detected overnight. However, minor anomalies in Pump P-201 and potential compliance drifts in Zone B require attention before the afternoon peak.",
    operationalRisks: [
      { id: "risk-1", title: "Vibration Anomaly", severity: "Medium", description: "Pump P-201 showing 12% increase in vibration." },
      { id: "risk-2", title: "Temperature Spike", severity: "Low", description: "Cooling Tower 3 water return temp elevated by 2°C." }
    ],
    complianceSummary: [
      { id: "comp-1", status: "Warning", details: "OISD-116 standard update requires review for 7 SOPs." }
    ],
    maintenanceRecommendations: [
      { id: "maint-1", asset: "Pump P-201", action: "Schedule predictive maintenance for bearing replacement.", priority: "Normal" }
    ],
    inspectionPriorities: [
      "Zone B Storage Tanks - Routine structural check",
      "Cooling Tower 3 - Thermal imaging scan"
    ],
    aiSuggestedActions: [
      { id: "act-1", action: "Pre-order Bearing SK-44", impact: "Prevents 4h downtime if P-201 fails." },
      { id: "act-2", action: "Distribute OISD-116 summary", impact: "Ensures compliance across 3 shifts." }
    ],
    predictedBottlenecks: [
      "Material flow at Conveyor Belt C expected to slow by 15% due to scheduled upstream maintenance at 10:00 AM."
    ],
    requiredHumanDecisions: [
      { id: "dec-1", decision: "Approve P-201 maintenance window for tomorrow", deadline: "Today, 14:00" }
    ]
  },
  {
    id: "brief-002",
    title: "Safety Inspection Brief",
    createdAt: new Date(Date.now() - 120 * 60000).toISOString(),
    plantId: "Sample Plant - Steel Manufacturing",
    shift: "Night (22:00 - 06:00)",
    confidenceScore: 88,
    status: "Review Required",
    previewBullets: [
      "2 safety near-misses recorded",
      "Hazmat storage compliance at 98%",
      "Emergency suppression system test passed",
      "PPE compliance flagged in Sector 4"
    ],
    executiveSummary: "Overall safety posture remains strong. Night shift reported two minor near-misses involving forklift traffic in Sector 4. PPE compliance monitoring detected a 5% drop in hard-hat adherence during the 03:00 break period.",
    operationalRisks: [
      { id: "risk-3", title: "Forklift Traffic Convergence", severity: "High", description: "Sector 4 intersection lacking convex mirrors." },
      { id: "risk-4", title: "PPE Non-compliance", severity: "Medium", description: "Hard-hat adherence dropped during night shift." }
    ],
    complianceSummary: [
      { id: "comp-2", status: "Violation", details: "Hazmat Log Book incomplete for Chemical Storage Bay C." }
    ],
    maintenanceRecommendations: [
      { id: "maint-2", asset: "Sector 4 Mirrors", action: "Install wide-angle traffic mirrors at intersection.", priority: "Urgent" }
    ],
    inspectionPriorities: [
      "Chemical Storage Bay C - Complete log book audit",
      "Sector 4 - PPE spot checks"
    ],
    aiSuggestedActions: [
      { id: "act-3", action: "Conduct 5-minute safety stand-down", impact: "Reinforces PPE requirements." }
    ],
    predictedBottlenecks: [
      "None predicted related to safety operations."
    ],
    requiredHumanDecisions: [
      { id: "dec-2", decision: "Sign off on Hazmat Audit correction", deadline: "Today, 17:00" }
    ]
  },
  {
    id: "brief-003",
    title: "Maintenance Review",
    createdAt: new Date(Date.now() - 240 * 60000).toISOString(),
    plantId: "Sample Plant - Steel Manufacturing",
    shift: "Day (06:00 - 18:00)",
    confidenceScore: 96,
    status: "Ready",
    previewBullets: [
      "12 work orders closed successfully",
      "3 predictive alerts generated",
      "Spare parts inventory optimal",
      "Contractor permits verified"
    ],
    executiveSummary: "Maintenance execution is on schedule. The new predictive model has successfully identified three early-stage wear patterns, allowing us to transition them from reactive to planned maintenance.",
    operationalRisks: [
      { id: "risk-5", title: "Conveyor Belt Wear", severity: "Medium", description: "Belt CB-09 showing edge fraying." }
    ],
    complianceSummary: [
      { id: "comp-3", status: "Compliant", details: "All contractor permits and safety inductions are current." }
    ],
    maintenanceRecommendations: [
      { id: "maint-3", asset: "Belt CB-09", action: "Schedule belt splicing and repair.", priority: "Normal" },
      { id: "maint-4", asset: "Compressor A", action: "Replace oil filter (predictive alert).", priority: "Normal" }
    ],
    inspectionPriorities: [
      "Conveyor Belt CB-09 - Detailed thickness check"
    ],
    aiSuggestedActions: [
      { id: "act-4", action: "Allocate 2 technicians for CB-09 repair", impact: "Ensures repair fits within 2h window." }
    ],
    predictedBottlenecks: [
      "Compressor A downtime will reduce pneumatic capacity by 10% for 45 minutes."
    ],
    requiredHumanDecisions: [
      { id: "dec-3", decision: "Approve overtime for weekend preventive maintenance", deadline: "Tomorrow, 12:00" }
    ]
  }
];

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
    id: "brief-p204",
    title: "Centrifugal Pump P-204 Isolation Assessment",
    createdAt: new Date().toISOString(),
    plantId: "Unit 3 - Hydrocarbon Processing",
    shift: "Operational",
    confidenceScore: 96,
    status: "Ready",
    previewBullets: [
      "SOP-MECH-042 mandates 5-step LOTO sequence prior to mechanical seal maintenance",
      "Critical contradiction detected: Suction valve V-101 closed state prevents seal MS-204 thermal flush",
      "Mandatory zero-pressure verification on PT-302 and electrical lockout at MCC-4B"
    ],
    executiveSummary: "Centrifugal Pump P-204 in Unit 3 was evaluated against SOP-MECH-042 and OEM maintenance manuals. While the LOTO sequence provides robust electrical and pressure isolation, AI detected a procedural contradiction where complete closure of suction valve V-101 causes dry-run face friction on mechanical seal MS-204 during warm-up recirculation.",
    operationalRisks: [
      {
        id: "risk-1",
        title: "Thermal Shock & Micro-Fracturing",
        severity: "High",
        description: "Dry running seal MS-204 for more than 45 seconds during cold restart causes carbon face micro-fracturing."
      },
      {
        id: "risk-2",
        title: "Residual Header Pressure",
        severity: "Medium",
        description: "Discharge valve V-102 manifold retains up to 280 psi until manual bleed-down is confirmed."
      }
    ],
    complianceSummary: [
      {
        id: "comp-1",
        status: "Warning",
        details: "SOP-MECH-042 requires amendment to incorporate 5% suction valve cracked-open bypass for seal flush."
      },
      {
        id: "comp-2",
        status: "Compliant",
        details: "Electrical lockout aligns with OSHA 29 CFR 1910.147 requirements."
      }
    ],
    maintenanceRecommendations: [
      {
        id: "maint-1",
        asset: "Pump P-204",
        action: "Inspect cartridge mechanical seal MS-204 wear depth (< 1.2mm safe threshold)",
        priority: "Urgent"
      },
      {
        id: "maint-2",
        asset: "Valve V-101",
        action: "Calibrate position limiter to ensure exact 5% bypass during thermal flush",
        priority: "Normal"
      }
    ],
    inspectionPriorities: [
      "Confirm PT-302 indicates 0.0 psi prior to unbolting seal gland plate",
      "Inspect seal barrier fluid pot level and pressure gauge (Plan 53A)",
      "Log baseline vibration velocity on inboard bearing housing after restart"
    ],
    aiSuggestedActions: [
      {
        id: "act-1",
        action: "Issue interim Engineering Variance Permit for SOP-MECH-042 warm-up sequence",
        impact: "Prevents repeated seal failure and eliminates hydrocarbon leakage risk"
      }
    ],
    predictedBottlenecks: [
      "Barrier fluid refill lead time if reservoir is drained during seal inspection",
      "Manual sign-off required from Unit 3 Control Room operator before MCC-4B re-energization"
    ],
    requiredHumanDecisions: [
      {
        id: "dec-1",
        decision: "Approve 5% suction valve bypass clause in SOP-MECH-042",
        deadline: "Next Maintenance Shift"
      }
    ]
  },
  {
    id: "brief-unit3-overview",
    title: "Unit 3 Rotating Equipment Integrity Brief",
    createdAt: new Date().toISOString(),
    plantId: "Unit 3 - Hydrocarbon Processing",
    shift: "Operational",
    confidenceScore: 94,
    status: "Ready",
    previewBullets: [
      "Overall rotating machinery health at 92% across Unit 3 train",
      "Suction and discharge isolation valve integrity verified on lines 301 & 302",
      "Historical incident INC-2023-09 lessons incorporated into active operating envelope"
    ],
    executiveSummary: "Multi-asset operational scan across Unit 3 hydrocarbon pumps and isolation valves confirms that overall system integrity is high. Knowledge Graph traversal identified that maintenance history and operational safety protocols are thoroughly documented with cross-references to OSHA 29 CFR 1910.147 and ISO 13709.",
    operationalRisks: [
      {
        id: "risk-3",
        title: "Cold-Start Viscosity Drag",
        severity: "Medium",
        description: "Process fluid viscosity spikes below 15°C ambient temperature require extended line recirculation."
      }
    ],
    complianceSummary: [
      {
        id: "comp-3",
        status: "Compliant",
        details: "All Unit 3 isolation procedures comply with ISO 13709 centrifugal pump standards."
      }
    ],
    maintenanceRecommendations: [
      {
        id: "maint-3",
        asset: "Valve V-102",
        action: "Perform ultrasonic leak-by detection on discharge seat",
        priority: "Normal"
      }
    ],
    inspectionPriorities: [
      "Monthly acoustic inspection on P-204 bearing housings",
      "Quarterly pressure transmitter calibration on PT-302"
    ],
    aiSuggestedActions: [
      {
        id: "act-2",
        action: "Schedule automated telemetry ingestion for vibration and temperature sensors",
        impact: "Enables predictive bearing wear alerts 30 days prior to threshold breach"
      }
    ],
    predictedBottlenecks: [
      "Calibration technician availability for Unit 3 shutdown window"
    ],
    requiredHumanDecisions: [
      {
        id: "dec-2",
        decision: "Sign off on quarterly compliance audit report",
        deadline: "End of Quarter"
      }
    ]
  }
];

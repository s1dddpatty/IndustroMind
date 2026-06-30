export interface AssetTimelineEvent {
  id: string;
  date: string;
  type: "Commissioned" | "Maintenance" | "Inspection" | "Failure" | "Replacement" | "Alert" | "AI Recommendation";
  title: string;
  description: string;
  status: "Completed" | "Pending" | "Critical";
  assignedTo?: string;
}

export interface RelatedKnowledgeItem {
  id: string;
  title: string;
  type: "Document" | "SOP" | "Compliance" | "Alert" | "AI Brief" | "Query" | "Knowledge Node";
  relevanceScore: number;
  date?: string;
  status?: string;
  url?: string;
}

export interface AssetComplianceRule {
  id: string;
  regulation: string;
  description: string;
  status: "Compliant" | "Non-Compliant" | "Pending Review";
  lastChecked: string;
  impactLevel: "High" | "Medium" | "Low";
}

export interface AssetKnowledgeCoverage {
  sopsLinked: boolean;
  datasheetLinked: boolean;
  inspectionReportsAvailable: boolean;
  maintenanceHistoryAvailable: boolean;
  complianceMapped: boolean;
  sparePartsDocumentationMissing: boolean;
  replacementHistoryIncomplete: boolean;
  calibrationEvidenceUnavailable: boolean;
  overallScore: number; // 0-100
}

export interface AiRecommendation {
  id: string;
  action: string;
  reason: string;
  timeframe: string;
  priority: "High" | "Medium" | "Low";
}

export interface Asset {
  id: string;
  assetTag: string;
  assetName: string;
  assetType: "Rotary" | "Static" | "Electrical" | "Instrumentation" | "HVAC";
  manufacturer: string;
  model: string;
  location: string;
  department: string;
  criticality: "Critical" | "High" | "Medium" | "Low";
  status: "Healthy" | "Warning" | "Critical" | "Maintenance" | "Offline";
  healthScore: number; // 0-100
  riskScore: number; // 0-100
  failureProbability: number; // 0-100%
  remainingUsefulLife: string;
  operationalState: "Running" | "Standby" | "Stopped";
  
  installationDate: string;
  commissionDate: string;
  lastInspection: string;
  nextInspection: string;
  lastMaintenance: string;
  nextMaintenance: string;

  executiveAiSummary: string;
  
  knowledgeCoverage: AssetKnowledgeCoverage;
  aiRecommendations: AiRecommendation[];
  maintenanceTimeline: AssetTimelineEvent[];
  compliance: AssetComplianceRule[];
  relatedKnowledge: RelatedKnowledgeItem[];

  owner: string;
  tags: string[];
}

export const MOCK_ASSETS: Asset[] = [
  {
    id: "asset-001",
    assetTag: "P-201",
    assetName: "Primary Cooling Water Pump",
    assetType: "Rotary",
    manufacturer: "Flowserve",
    model: "Durco Mark 3",
    location: "Unit 2, Area 4",
    department: "Operations",
    criticality: "Critical",
    status: "Warning",
    healthScore: 78,
    riskScore: 42,
    failureProbability: 18,
    remainingUsefulLife: "14 months",
    operationalState: "Running",
    
    installationDate: "2020-03-15",
    commissionDate: "2020-04-01",
    lastInspection: "2026-05-15",
    nextInspection: "2026-11-15",
    lastMaintenance: "2025-12-10",
    nextMaintenance: "2026-07-01",

    executiveAiSummary: "Pump P-201 is currently operational but exhibits an 18% failure probability due to rising vibration in the inboard bearing. Knowledge coverage is 96%, with all SOPs and compliance mapped. One high-priority maintenance recommendation is pending. Bearing wear probability has increased by 12% over the last month, correlating with recent anomalies detected in Unit 2.",
    
    knowledgeCoverage: {
      sopsLinked: true,
      datasheetLinked: true,
      inspectionReportsAvailable: true,
      maintenanceHistoryAvailable: true,
      complianceMapped: true,
      sparePartsDocumentationMissing: false,
      replacementHistoryIncomplete: false,
      calibrationEvidenceUnavailable: true,
      overallScore: 96
    },

    aiRecommendations: [
      {
        id: "rec-1",
        action: "Replace inboard bearing",
        reason: "Vibration signature matches known failure pattern for Durco Mark 3 bearings.",
        timeframe: "Within 12 operating hours",
        priority: "High"
      },
      {
        id: "rec-2",
        action: "Update Maintenance SOP",
        reason: "Recent vendor bulletin suggests new lubrication intervals.",
        timeframe: "Within 7 days",
        priority: "Medium"
      }
    ],

    maintenanceTimeline: [
      {
        id: "evt-1",
        date: "2026-06-28",
        type: "AI Recommendation",
        title: "Bearing Replacement Suggested",
        description: "AI detected abnormal vibration patterns.",
        status: "Pending"
      },
      {
        id: "evt-2",
        date: "2026-05-15",
        type: "Inspection",
        title: "Q2 Visual Inspection",
        description: "Passed with minor casing wear noted.",
        status: "Completed",
        assignedTo: "John Smith"
      },
      {
        id: "evt-3",
        date: "2025-12-10",
        type: "Maintenance",
        title: "Annual Overhaul",
        description: "Replaced seals and realigned shaft.",
        status: "Completed",
        assignedTo: "Team Alpha"
      },
      {
        id: "evt-4",
        date: "2020-04-01",
        type: "Commissioned",
        title: "Initial Commissioning",
        description: "Asset brought online.",
        status: "Completed"
      }
    ],

    compliance: [
      {
        id: "comp-1",
        regulation: "API 610",
        description: "Centrifugal Pumps for Petroleum, Petrochemical and Natural Gas Industries",
        status: "Compliant",
        lastChecked: "2026-01-10",
        impactLevel: "High"
      },
      {
        id: "comp-2",
        regulation: "OSHA 1910.212",
        description: "General requirements for all machines (Guarding)",
        status: "Compliant",
        lastChecked: "2026-05-15",
        impactLevel: "High"
      },
      {
        id: "comp-3",
        regulation: "EPA SPCC",
        description: "Spill Prevention, Control, and Countermeasure for lubricant leakage",
        status: "Pending Review",
        lastChecked: "2025-11-20",
        impactLevel: "Medium"
      }
    ],

    relatedKnowledge: [
      {
        id: "rk-1",
        title: "Bearing Replacement SOP v2.4",
        type: "SOP",
        relevanceScore: 99
      },
      {
        id: "rk-2",
        title: "Durco Mark 3 Technical Manual",
        type: "Document",
        relevanceScore: 95
      },
      {
        id: "rk-3",
        title: "High Vibration Alert P-201",
        type: "Alert",
        relevanceScore: 100,
        status: "Active"
      },
      {
        id: "rk-4",
        title: "P-201 Impeller Degradation Analysis",
        type: "AI Brief",
        relevanceScore: 92
      },
      {
        id: "rk-5",
        title: "API 610 Compliance Audit",
        type: "Compliance",
        relevanceScore: 88
      }
    ],

    owner: "Jane Doe (Lead Reliability Engineer)",
    tags: ["cooling", "critical-path", "api-610"]
  },
  {
    id: "asset-002",
    assetTag: "C-105",
    assetName: "Main Air Compressor",
    assetType: "Rotary",
    manufacturer: "Atlas Copco",
    model: "GA 90",
    location: "Utility Room B",
    department: "Utilities",
    criticality: "High",
    status: "Healthy",
    healthScore: 94,
    riskScore: 12,
    failureProbability: 2,
    remainingUsefulLife: "4.5 years",
    operationalState: "Running",
    
    installationDate: "2022-08-10",
    commissionDate: "2022-08-25",
    lastInspection: "2026-06-01",
    nextInspection: "2026-12-01",
    lastMaintenance: "2026-02-15",
    nextMaintenance: "2026-08-15",

    executiveAiSummary: "Compressor C-105 is operating efficiently with no active anomalies. Health score remains stable at 94%. Knowledge coverage is adequate, though some replacement part documentation is missing. AI predicts stable operation for the next 6 months.",
    
    knowledgeCoverage: {
      sopsLinked: true,
      datasheetLinked: true,
      inspectionReportsAvailable: true,
      maintenanceHistoryAvailable: true,
      complianceMapped: true,
      sparePartsDocumentationMissing: true,
      replacementHistoryIncomplete: true,
      calibrationEvidenceUnavailable: false,
      overallScore: 78
    },

    aiRecommendations: [
      {
        id: "rec-3",
        action: "Upload Spare Parts List",
        reason: "Missing critical documentation for GA 90 filters.",
        timeframe: "Next 30 days",
        priority: "Low"
      }
    ],

    maintenanceTimeline: [
      {
        id: "evt-5",
        date: "2026-06-01",
        type: "Inspection",
        title: "Routine Air Quality Check",
        description: "Air purity within ISO 8573-1 standards.",
        status: "Completed"
      },
      {
        id: "evt-6",
        date: "2026-02-15",
        type: "Maintenance",
        title: "Filter Replacement",
        description: "Replaced oil and air filters.",
        status: "Completed"
      }
    ],

    compliance: [
      {
        id: "comp-4",
        regulation: "ISO 8573-1",
        description: "Compressed Air Purity Classes",
        status: "Compliant",
        lastChecked: "2026-06-01",
        impactLevel: "High"
      }
    ],

    relatedKnowledge: [
      {
        id: "rk-6",
        title: "Atlas Copco GA Series Manual",
        type: "Document",
        relevanceScore: 98
      }
    ],

    owner: "Mike Johnson (Utilities Lead)",
    tags: ["compressed-air", "utility"]
  },
  {
    id: "asset-003",
    assetTag: "HE-302",
    assetName: "Product Cooler Heat Exchanger",
    assetType: "Static",
    manufacturer: "Alfa Laval",
    model: "T20-BFG",
    location: "Unit 3",
    department: "Process",
    criticality: "High",
    status: "Critical",
    healthScore: 45,
    riskScore: 88,
    failureProbability: 65,
    remainingUsefulLife: "2 months",
    operationalState: "Running",
    
    installationDate: "2018-01-15",
    commissionDate: "2018-02-01",
    lastInspection: "2025-11-20",
    nextInspection: "2026-11-20",
    lastMaintenance: "2023-04-10",
    nextMaintenance: "2026-07-15",

    executiveAiSummary: "HE-302 is in critical condition. Thermal efficiency has dropped by 32% over the last 90 days, strongly indicating severe fouling. Immediate CIP (Clean-In-Place) is recommended. Risk score is critically high at 88.",
    
    knowledgeCoverage: {
      sopsLinked: true,
      datasheetLinked: false,
      inspectionReportsAvailable: true,
      maintenanceHistoryAvailable: true,
      complianceMapped: false,
      sparePartsDocumentationMissing: true,
      replacementHistoryIncomplete: false,
      calibrationEvidenceUnavailable: true,
      overallScore: 55
    },

    aiRecommendations: [
      {
        id: "rec-4",
        action: "Schedule urgent CIP",
        reason: "Severe fouling detected. Thermal efficiency drop.",
        timeframe: "Within 48 hours",
        priority: "High"
      },
      {
        id: "rec-5",
        action: "Upload Datasheet",
        reason: "Missing OEM thermal ratings.",
        timeframe: "Next 7 days",
        priority: "Low"
      }
    ],

    maintenanceTimeline: [
      {
        id: "evt-7",
        date: "2026-06-30",
        type: "Alert",
        title: "Thermal Efficiency Warning",
        description: "Delta-T below minimum threshold.",
        status: "Critical"
      }
    ],

    compliance: [
      {
        id: "comp-5",
        regulation: "ASME BPVC Section VIII",
        description: "Rules for Construction of Pressure Vessels",
        status: "Pending Review",
        lastChecked: "2025-11-20",
        impactLevel: "High"
      }
    ],

    relatedKnowledge: [
      {
        id: "rk-7",
        title: "HE-302 Fouling Analysis",
        type: "AI Brief",
        relevanceScore: 100
      }
    ],

    owner: "Process Engineering Team",
    tags: ["heat-transfer", "fouling-risk"]
  }
];

export const ASSET_STATS = {
  total: 412,
  critical: 45,
  healthy: 320,
  inMaintenance: 12,
  highRisk: 8,
  aiRecommendations: 24,
  avgHealth: 88,
  knowledgeCoverageAvg: 76
};

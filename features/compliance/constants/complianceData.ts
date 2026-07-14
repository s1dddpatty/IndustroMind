export interface ComplianceImpact {
  safety: "High" | "Medium" | "Low" | "None";
  operational: "High" | "Medium" | "Low" | "None";
  environmental: "High" | "Medium" | "Low" | "None";
  financial: "High" | "Medium" | "Low" | "None";
  description: string;
}

export interface ComplianceEvidence {
  id: string;
  title: string;
  type: "SOP" | "Inspection Report" | "Maintenance Record" | "Document" | "Knowledge Graph Node" | "AI Brief";
  url?: string;
  relevanceScore: number;
  date: string;
}

export interface ComplianceTimelineEvent {
  id: string;
  date: string;
  type: "Requirement Created" | "Inspection" | "Violation Detected" | "Alert Generated" | "AI Recommendation" | "Maintenance" | "Verification" | "Compliance Restored";
  title: string;
  description: string;
  status: "Completed" | "Pending" | "Critical";
}

export interface AffectedAsset {
  id: string;
  assetTag: string;
  assetName: string;
  criticality: "Critical" | "High" | "Medium" | "Low";
  status: "Healthy" | "Warning" | "Critical" | "Maintenance" | "Offline";
}

export interface ComplianceAiRecommendation {
  id: string;
  action: string;
  reason: string;
  priority: "Critical" | "High" | "Medium" | "Low";
  type: "Schedule Inspection" | "Update SOP" | "Review Maintenance" | "Generate Audit Report" | "Escalate" | "Update Documentation" | "Generate AI Brief";
}

export interface ComplianceKnowledgeCoverage {
  regulationMapped: boolean;
  sopsLinked: boolean;
  assetsLinked: boolean;
  documentsLinked: boolean;
  inspectionAvailable: boolean;
  maintenanceEvidenceAvailable: boolean;
  missingCalibration: boolean;
  missingInspection: boolean;
  missingApproval: boolean;
  overallCoverageScore: number;
}

export interface ComplianceRule {
  id: string;
  regulationId: string;
  regulationName: string;
  standard: "OISD" | "API" | "OSHA" | "ISO" | "EPA";
  category: "Safety" | "Equipment" | "Environmental" | "Procedural";
  severity: "Critical" | "High" | "Medium" | "Low";
  status: "Compliant" | "Warning" | "Non-Compliant" | "Pending Review";
  description: string;
  
  complianceScore: number; // 0-100
  riskScore: number; // 0-100
  evidenceCompleteness: number; // 0-100
  evaluationConfidence: number; // 0-100
  
  lastEvaluated: string;
  nextScheduledEvaluation: string;
  evidenceFreshness: "Fresh" | "Stale" | "Outdated";
  lastDocumentUpdate: string;

  executiveAiSummary: string;
  aiReasoning: string;
  impact: ComplianceImpact;

  affectedAssets: AffectedAsset[];
  evidence: ComplianceEvidence[];
  knowledgeCoverage: ComplianceKnowledgeCoverage;
  timeline: ComplianceTimelineEvent[];
  aiRecommendations: ComplianceAiRecommendation[];

  owner: string;
  department: string;
  tags: string[];

  // Source provenance metadata for future AI and traceability (not rendered)
  backendMetadata?: {
    sourceType: "contradiction" | "regulatoryDrift" | "mortality" | "mock";
    backendId?: string;
    backendEntityType?: string;
    originalPayload?: any;
    endpointOrigin?: string;
    fetchedAt?: string;
    adapterVersion?: string;
  };

  // AI Readiness fields (currently placeholders)
  aiExplanation?: string;
  aiConfidence?: number;
  remediationPriority?: string;
  supportingDocuments?: string[];
  relatedGraphNodes?: string[];
  relatedAssets?: string[];
  generatedActionPlan?: string;
  approvalWorkflow?: string;
}

export const MOCK_COMPLIANCE_RULES: ComplianceRule[] = [
  {
    id: "comp-oisd-189",
    regulationId: "OISD-189 Section 4.2",
    regulationName: "Fire Protection in Refineries",
    standard: "OISD",
    category: "Safety",
    severity: "Critical",
    status: "Warning",
    description: "Requires mandatory monthly inspection of deluge valves and quarterly flow testing of firewater pumps.",
    
    complianceScore: 78,
    riskScore: 65,
    evidenceCompleteness: 85,
    evaluationConfidence: 92,
    
    lastEvaluated: "2026-06-30T08:00:00Z",
    nextScheduledEvaluation: "2026-07-01T08:00:00Z",
    evidenceFreshness: "Stale",
    lastDocumentUpdate: "2025-11-12",

    executiveAiSummary: "OISD-189 compliance is currently at risk. While the firewater pump P-201 passed its quarterly flow test, the monthly deluge valve inspection for Unit 2 is overdue by 12 days. This introduces a high safety risk and operational exposure during potential fire events. Immediate inspection is required to restore full compliance.",
    aiReasoning: "The system correlated the latest inspection record (dated 42 days ago) against the 30-day requirement in OISD-189 Sec 4.2. Assets in Unit 2 lack current verification.",
    
    impact: {
      safety: "High",
      operational: "Medium",
      environmental: "None",
      financial: "Low",
      description: "Failure of deluge valves could lead to uncontained fire spread, severely impacting plant safety and triggering massive regulatory fines."
    },

    affectedAssets: [
      {
        id: "asset-001",
        assetTag: "P-201",
        assetName: "Primary Cooling Water Pump", // Using P-201 as mock asset
        criticality: "Critical",
        status: "Warning"
      }
    ],

    evidence: [
      {
        id: "ev-1",
        title: "OISD-189 Official Standard",
        type: "Document",
        relevanceScore: 100,
        date: "2024-01-10"
      },
      {
        id: "ev-2",
        title: "Deluge Valve Inspection Log (Overdue)",
        type: "Inspection Report",
        relevanceScore: 98,
        date: "2026-05-18" // Over 30 days ago
      },
      {
        id: "ev-3",
        title: "Firewater Pump P-201 Maintenance Record",
        type: "Maintenance Record",
        relevanceScore: 90,
        date: "2026-06-15"
      }
    ],

    knowledgeCoverage: {
      regulationMapped: true,
      sopsLinked: true,
      assetsLinked: true,
      documentsLinked: true,
      inspectionAvailable: true,
      maintenanceEvidenceAvailable: true,
      missingCalibration: false,
      missingInspection: true, // This is the issue
      missingApproval: false,
      overallCoverageScore: 85
    },

    timeline: [
      {
        id: "tl-1",
        date: "2026-06-18",
        type: "Inspection",
        title: "Scheduled Inspection Missed",
        description: "Monthly deluge valve inspection was not logged by the due date.",
        status: "Critical"
      },
      {
        id: "tl-2",
        date: "2026-06-19",
        type: "Violation Detected",
        title: "OISD-189 Warning Triggered",
        description: "AI identified missing evidence for Sec 4.2 compliance.",
        status: "Completed"
      },
      {
        id: "tl-3",
        date: "2026-06-30",
        type: "Alert Generated",
        title: "Escalated Compliance Warning",
        description: "Overdue by 12 days. Escalated to Safety Lead.",
        status: "Completed"
      }
    ],

    aiRecommendations: [
      {
        id: "rec-1",
        action: "Schedule immediate deluge valve inspection for Unit 2.",
        reason: "Inspection is 12 days overdue, violating OISD-189 30-day requirement.",
        priority: "Critical",
        type: "Schedule Inspection"
      },
      {
        id: "rec-2",
        action: "Generate AI Brief for Safety Review",
        reason: "Prepare executive summary of the gap for the morning safety meeting.",
        priority: "Medium",
        type: "Generate AI Brief"
      }
    ],

    owner: "Safety & Integrity Dept",
    department: "HSE",
    tags: ["fire-safety", "oisd", "valves"],
    backendMetadata: { sourceType: "mock" }
  },
  {
    id: "comp-api-610",
    regulationId: "API 610 12th Edition",
    regulationName: "Centrifugal Pumps for Petroleum Industries",
    standard: "API",
    category: "Equipment",
    severity: "High",
    status: "Compliant",
    description: "Specifies requirements for centrifugal pumps, including vibration limits, bearing housing temperatures, and seal leakages.",
    
    complianceScore: 98,
    riskScore: 12,
    evidenceCompleteness: 100,
    evaluationConfidence: 99,
    
    lastEvaluated: "2026-06-30T10:15:00Z",
    nextScheduledEvaluation: "2026-07-01T10:15:00Z",
    evidenceFreshness: "Fresh",
    lastDocumentUpdate: "2026-01-20",

    executiveAiSummary: "All monitored API 610 pumps are operating within specified vibration and thermal limits. Comprehensive evidence is available from real-time vibration sensors and recent maintenance logs. Compliance posture is exceptionally strong with no identified risks.",
    aiReasoning: "Real-time telemetry from P-201 and P-202 confirms vibration velocities are below the 3.0 mm/s threshold. Last calibration certificates are valid and linked.",
    
    impact: {
      safety: "Medium",
      operational: "High",
      environmental: "None",
      financial: "High",
      description: "API 610 compliance directly correlates with pump reliability. Non-compliance indicates impending failure, which could halt production."
    },

    affectedAssets: [
      {
        id: "asset-001",
        assetTag: "P-201",
        assetName: "Primary Cooling Water Pump",
        criticality: "Critical",
        status: "Warning" // Although API 610 compliant, asset has a warning from another system
      }
    ],

    evidence: [
      {
        id: "ev-4",
        title: "P-201 Vibration Telemetry Log",
        type: "Maintenance Record",
        relevanceScore: 99,
        date: "2026-06-30"
      },
      {
        id: "ev-5",
        title: "API 610 Compliance Checklist SOP",
        type: "SOP",
        relevanceScore: 100,
        date: "2026-01-20"
      }
    ],

    knowledgeCoverage: {
      regulationMapped: true,
      sopsLinked: true,
      assetsLinked: true,
      documentsLinked: true,
      inspectionAvailable: true,
      maintenanceEvidenceAvailable: true,
      missingCalibration: false,
      missingInspection: false,
      missingApproval: false,
      overallCoverageScore: 100
    },

    timeline: [
      {
        id: "tl-4",
        date: "2026-05-15",
        type: "Verification",
        title: "Annual API Audit Passed",
        description: "Third-party audit confirmed all parameters.",
        status: "Completed"
      }
    ],

    aiRecommendations: [],

    owner: "Reliability Engineering",
    department: "Maintenance",
    tags: ["rotating-equipment", "api-610", "pumps"],
    backendMetadata: { sourceType: "mock" }
  },
  {
    id: "comp-osha-1910",
    regulationId: "OSHA 1910.147",
    regulationName: "Control of Hazardous Energy (Lockout/Tagout)",
    standard: "OSHA",
    category: "Procedural",
    severity: "Critical",
    status: "Non-Compliant",
    description: "Requires practices and procedures to disable machinery or equipment to prevent the release of hazardous energy while employees perform servicing.",
    
    complianceScore: 42,
    riskScore: 95,
    evidenceCompleteness: 60,
    evaluationConfidence: 96,
    
    lastEvaluated: "2026-06-30T11:00:00Z",
    nextScheduledEvaluation: "2026-06-30T12:00:00Z",
    evidenceFreshness: "Fresh",
    lastDocumentUpdate: "2024-08-05",

    executiveAiSummary: "CRITICAL VIOLATION: Current LOTO (Lockout/Tagout) procedures for Compressor C-105 are outdated and lack mandatory supervisor approval signatures for the recent maintenance cycle. This presents an immediate, severe safety risk to personnel and violates OSHA 1910.147.",
    aiReasoning: "The Knowledge Graph identified a maintenance event on C-105 yesterday. A cross-reference with the LOTO electronic log showed no corresponding isolation certificate. Furthermore, the LOTO SOP linked to C-105 has not been updated since 2024.",
    
    impact: {
      safety: "High",
      operational: "Medium",
      environmental: "None",
      financial: "High",
      description: "Severe risk of fatal injury during maintenance. Very high probability of major regulatory fines and plant shutdown orders if audited."
    },

    affectedAssets: [
      {
        id: "asset-002",
        assetTag: "C-105",
        assetName: "Main Air Compressor",
        criticality: "High",
        status: "Healthy"
      }
    ],

    evidence: [
      {
        id: "ev-6",
        title: "Compressor C-105 LOTO SOP (Outdated)",
        type: "SOP",
        relevanceScore: 100,
        date: "2024-08-05"
      },
      {
        id: "ev-7",
        title: "C-105 Maintenance Work Order",
        type: "Maintenance Record",
        relevanceScore: 95,
        date: "2026-06-29"
      }
    ],

    knowledgeCoverage: {
      regulationMapped: true,
      sopsLinked: true,
      assetsLinked: true,
      documentsLinked: false, // Missing isolation cert
      inspectionAvailable: false,
      maintenanceEvidenceAvailable: true,
      missingCalibration: false,
      missingInspection: false,
      missingApproval: true, // The core violation
      overallCoverageScore: 60
    },

    timeline: [
      {
        id: "tl-5",
        date: "2026-06-29",
        type: "Maintenance",
        title: "C-105 Filter Replacement Started",
        description: "Work order executed without linked LOTO cert.",
        status: "Completed"
      },
      {
        id: "tl-6",
        date: "2026-06-29",
        type: "Violation Detected",
        title: "Missing Isolation Certificate",
        description: "AI detected active maintenance without LOTO evidence.",
        status: "Critical"
      },
      {
        id: "tl-7",
        date: "2026-06-29",
        type: "Alert Generated",
        title: "LOTO Violation Alert",
        description: "Immediate work stoppage recommended.",
        status: "Completed"
      }
    ],

    aiRecommendations: [
      {
        id: "rec-3",
        action: "Escalate to Plant Manager immediately.",
        reason: "Active maintenance occurred without documented LOTO.",
        priority: "Critical",
        type: "Escalate"
      },
      {
        id: "rec-4",
        action: "Update LOTO SOP for C-105",
        reason: "Current SOP is over 24 months old.",
        priority: "High",
        type: "Update SOP"
      }
    ],

    owner: "Operations & HSE",
    department: "Plant Safety",
    tags: ["loto", "safety", "osha"],
    backendMetadata: { sourceType: "mock" }
  }
];

export const COMPLIANCE_STATS = {
  overallScore: 79,
  compliantRequirements: 142,
  openViolations: 18,
  criticalViolations: 3,
  auditsDue: 5,
  inspectionsPending: 12,
  aiRecommendations: 24,
  knowledgeCoverage: 84
};

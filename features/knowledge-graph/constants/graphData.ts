export type KgNodeType = 
  | "Equipment" 
  | "Document" 
  | "Procedure" 
  | "Compliance" 
  | "Personnel" 
  | "Alert" 
  | "AIInsight";

export type KgNodeStatus = 
  | "Healthy" 
  | "Warning" 
  | "Critical" 
  | "Incomplete" 
  | "Outdated" 
  | "Contradiction";

export interface KgNodeHealth {
  coverage: number;
  confidence: number;
  completeness: number;
  checks: {
    label: string;
    status: "Present" | "Missing" | "Outdated";
  }[];
  aiRecommendations: string[];
}

export interface KgTimelineEvent {
  id: string;
  date: string;
  type: string;
  description: string;
}

export interface KgNode {
  id: string;
  label: string;
  category: KgNodeType;
  status: KgNodeStatus;
  aiSummary: string;
  owner?: string;
  department?: string;
  lastUpdated?: string;
  health: KgNodeHealth;
  timeline: KgTimelineEvent[];
}

export interface KgEdge {
  id: string;
  source: string;
  target: string;
  relationship: string;
  reasoning: string; // The explainability text
}

export interface KgAnalytics {
  knowledgeIntegrity: number;
  knowledgeCoverage: number;
  knowledgeConfidence: number;
  totalNodes: number;
  totalRelationships: number;
  missingRelationships: number;
  contradictionsDetected: number;
  orphanNodes: number;
  aiSuggestedImprovements: number;
  
  // Graph Analytics
  mostConnectedAsset: string;
  highestRiskAsset: string;
  criticalKnowledgeHub: string;
  leastDocumentedAsset: string;
}

export interface KgData {
  nodes: KgNode[];
  edges: KgEdge[];
  analytics: KgAnalytics;
}

export const MOCK_KG_DATA: KgData = {
  analytics: {
    knowledgeIntegrity: 94,
    knowledgeCoverage: 88,
    knowledgeConfidence: 91,
    totalNodes: 12450,
    totalRelationships: 38200,
    missingRelationships: 412,
    contradictionsDetected: 3,
    orphanNodes: 14,
    aiSuggestedImprovements: 28,
    mostConnectedAsset: "Pump P-201",
    highestRiskAsset: "Compressor C-105",
    criticalKnowledgeHub: "SOP-MAINT-CORE",
    leastDocumentedAsset: "Valve V-992"
  },
  nodes: [
    {
      id: "P-201",
      label: "Pump P-201",
      category: "Equipment",
      status: "Warning",
      aiSummary: "Critical centrifugal pump supporting production line A. Currently showing signs of bearing wear based on acoustic sensors.",
      owner: "R. Sharma",
      department: "Maintenance",
      lastUpdated: "2026-06-25",
      health: {
        coverage: 92,
        confidence: 96,
        completeness: 85,
        checks: [
          { label: "Manual Present", status: "Present" },
          { label: "Maintenance History", status: "Present" },
          { label: "Inspection Records", status: "Present" },
          { label: "Compliance Linked", status: "Present" },
          { label: "Sensor Data", status: "Present" },
          { label: "Replacement History", status: "Missing" },
          { label: "Calibration Records", status: "Missing" }
        ],
        aiRecommendations: [
          "Digitize and link the 2024 replacement history to improve mean-time-between-failure predictions.",
          "Upload recent calibration certificates to clear the compliance warning."
        ]
      },
      timeline: [
        { id: "t1", date: "2026-06-25", type: "AI Brief Generated", description: "Vibration anomaly detected. Brief generated." },
        { id: "t2", date: "2026-06-20", type: "Alert Raised", description: "High temperature warning on bearing housing." },
        { id: "t3", date: "2026-05-15", type: "Maintenance", description: "Routine lubrication performed." }
      ]
    },
    {
      id: "SOP-MAINT-P201",
      label: "SOP-MAINT-P201",
      category: "Procedure",
      status: "Healthy",
      aiSummary: "Standard operating procedure detailing the monthly and annual maintenance routines for centrifugal pumps.",
      owner: "Engineering Team",
      department: "Operations",
      lastUpdated: "2025-11-10",
      health: {
        coverage: 100,
        confidence: 99,
        completeness: 100,
        checks: [
          { label: "Document Parsed", status: "Present" },
          { label: "Steps Extracted", status: "Present" },
          { label: "Safety Warnings Mapped", status: "Present" }
        ],
        aiRecommendations: []
      },
      timeline: [
        { id: "t1", date: "2025-11-10", type: "SOP Updated", description: "Revision 4 published with updated safety protocols." }
      ]
    },
    {
      id: "OISD-189",
      label: "OISD-189",
      category: "Compliance",
      status: "Contradiction",
      aiSummary: "Standard on fire protection facilities for petroleum refineries. There is a detected contradiction regarding minimum clearance distance.",
      owner: "Safety Board",
      department: "HSE",
      lastUpdated: "2026-01-05",
      health: {
        coverage: 100,
        confidence: 80,
        completeness: 100,
        checks: [
          { label: "Full Text Indexed", status: "Present" },
          { label: "Clauses Mapped", status: "Present" },
          { label: "Conflicts Resolved", status: "Missing" }
        ],
        aiRecommendations: [
          "Review clause 4.2.1 against SOP-MAINT-P201; a potential contradiction in clearance requirements was detected."
        ]
      },
      timeline: [
        { id: "t1", date: "2026-01-05", type: "Regulation Updated", description: "New national standard published." }
      ]
    },
    {
      id: "INSP-2026-05",
      label: "Inspection May 2026",
      category: "Document",
      status: "Healthy",
      aiSummary: "Monthly acoustic and vibration inspection report for Line A assets.",
      owner: "J. Doe",
      department: "Quality",
      lastUpdated: "2026-05-28",
      health: {
        coverage: 95,
        confidence: 98,
        completeness: 100,
        checks: [
          { label: "Data Extracted", status: "Present" },
          { label: "Signatures Verified", status: "Present" }
        ],
        aiRecommendations: []
      },
      timeline: [
        { id: "t1", date: "2026-05-28", type: "Document Uploaded", description: "Inspection signed off and uploaded." }
      ]
    },
    {
      id: "AI-REC-P201",
      label: "Bearing Wear Alert",
      category: "AIInsight",
      status: "Warning",
      aiSummary: "Predictive model indicates an 85% probability of bearing failure within 14 days based on acoustic signature.",
      owner: "IndustroMind AI",
      department: "System",
      lastUpdated: "2026-06-25",
      health: {
        coverage: 100,
        confidence: 85,
        completeness: 100,
        checks: [
          { label: "Model Confidence > 80%", status: "Present" },
          { label: "Human Review", status: "Missing" }
        ],
        aiRecommendations: [
          "Requires human engineer review to validate the acoustic anomaly."
        ]
      },
      timeline: [
        { id: "t1", date: "2026-06-25", type: "Insight Generated", description: "Acoustic anomaly detected crossing threshold." }
      ]
    }
  ],
  edges: [
    {
      id: "e1",
      source: "P-201",
      target: "SOP-MAINT-P201",
      relationship: "Governed By",
      reasoning: "This SOP defines the explicit maintenance procedure and lubrication schedule for this specific pump model."
    },
    {
      id: "e2",
      source: "P-201",
      target: "INSP-2026-05",
      relationship: "Supported By",
      reasoning: "The latest inspection report contains direct vibration readings and acoustic measurements for this pump."
    },
    {
      id: "e3",
      source: "SOP-MAINT-P201",
      target: "OISD-189",
      relationship: "Must Comply With",
      reasoning: "The SOP incorporates safety clearances mandated by OISD-189, though a recent contradiction was flagged."
    },
    {
      id: "e4",
      source: "AI-REC-P201",
      target: "P-201",
      relationship: "Predicts For",
      reasoning: "The predictive model analyzed historical vibration data mapped to this exact asset."
    },
    {
      id: "e5",
      source: "AI-REC-P201",
      target: "INSP-2026-05",
      relationship: "Based On Evidence",
      reasoning: "The model used the raw acoustic data embedded in this inspection report to generate the warning."
    }
  ]
};

// Evidence Chain for GraphRAG
export const MOCK_EVIDENCE_CHAIN = {
  question: "Is Pump P-201 safe to operate?",
  steps: [
    { id: "step1", entity: "Pump P-201", action: "Identified asset", icon: "Asset" },
    { id: "step2", entity: "INSP-2026-05", action: "Extracted latest vibration readings", icon: "Document" },
    { id: "step3", entity: "AI-REC-P201", action: "Checked predictive models (Warning Active)", icon: "AIInsight" },
    { id: "step4", entity: "SOP-MAINT-P201", action: "Checked allowable operating limits", icon: "Procedure" },
    { id: "step5", entity: "OISD-189", action: "Verified compliance constraints", icon: "Compliance" }
  ],
  conclusion: "No. Pump P-201 is showing early signs of bearing failure and an AI Warning is active. It exceeds SOP limits for continuous operation."
};

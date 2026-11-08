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
  reasoning: string;
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
    knowledgeIntegrity: 0,
    knowledgeCoverage: 0,
    knowledgeConfidence: 0,
    totalNodes: 0,
    totalRelationships: 0,
    missingRelationships: 0,
    contradictionsDetected: 0,
    orphanNodes: 0,
    aiSuggestedImprovements: 0,
    mostConnectedAsset: "None",
    highestRiskAsset: "None",
    criticalKnowledgeHub: "None",
    leastDocumentedAsset: "None"
  },
  nodes: [],
  edges: []
};

// Evidence Chain for GraphRAG
export const MOCK_EVIDENCE_CHAIN = {
  question: "Is Pump P-201 safe to operate?",
  steps: [],
  conclusion: "No active query evaluated yet."
};

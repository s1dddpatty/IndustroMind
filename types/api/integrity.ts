export interface ContradictionRead {
  severity: string;
  description: string;
  affected_assets: string[];
  affected_documents: string[];
  evidence: string;
  suggested_resolution: string;
  responsible_department: string;
}

export interface RegulatoryDriftRead {
  drift_status: string;
  outdated_procedures: any[];
  unmapped_regulations: any[];
  summary: string;
}

export interface KnowledgeMortalityRead {
  mortality_score: number;
  risk_level: string;
  high_risk_experts: any[];
  knowledge_at_risk: any[];
  recommended_interviews: any[];
  summary: string;
}

export interface IntegrityScanRead {
  org_id: string;
  overall_status: string;
  contradictions: ContradictionRead[];
  regulatory_drift: RegulatoryDriftRead;
  knowledge_mortality: KnowledgeMortalityRead;
}

export interface ContradictionResponseDTO {
  data: { contradictions: ContradictionRead[], count: number };
  message?: string;
}

export interface RegulatoryDriftResponseDTO {
  data: RegulatoryDriftRead;
  message?: string;
}

export interface KnowledgeMortalityResponseDTO {
  data: KnowledgeMortalityRead;
  message?: string;
}

export interface ScanResponseDTO {
  data: IntegrityScanRead;
  message?: string;
}

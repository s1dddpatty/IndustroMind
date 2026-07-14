import { ApiResponse } from "./common";

export interface DecisionBriefRead {
  query: string;
  org_id: string;
  intent?: string | null;
  detected_entities?: string[] | null;
  graph_traversal_results?: Record<string, any>[] | null;
  semantic_search_results?: Record<string, any>[] | null;
  decision_brief?: DecisionBrief | null;
}

export interface DecisionBrief {
  executive_summary?: string;
  recommendation?: string;
  operational_context?: string;
  affected_assets?: string[];
  applicable_regulations?: string[];
  maintenance_history?: string[];
  historical_incidents?: string[];
  dependencies?: string[];
  risk_assessment?: string;
  supporting_evidence?: string[];
  confidence_level?: string;
  suggested_next_steps?: string[];
  source_references?: string[];
}

export interface QueryRequest {
  question?: string;
  query?: string;
  org_id?: string;
}

export type QueryResponseDTO = ApiResponse<DecisionBriefRead>;

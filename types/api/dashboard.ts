export interface BackendAlertDTO {
  id?: string;
  type?: string;
  severity?: string;
  title?: string;
  message?: string;
  description?: string;
}

export interface AlertsResponseDTO {
  data?: { alerts: BackendAlertDTO[] };
  alerts?: BackendAlertDTO[];
}

export interface BackendMortalityDTO {
  score?: number;
  mortality_score?: number;
  highRiskExperts?: string[];
  high_risk_experts?: string[];
  risk_level?: string;
  summary?: string;
}

export interface MortalityResponseDTO {
  data?: BackendMortalityDTO;
  score?: number;
  mortality_score?: number;
  highRiskExperts?: string[];
  high_risk_experts?: string[];
  risk_level?: string;
  summary?: string;
}

export interface BackendAuditLogDTO {
  id: string;
  action: string;
  resource_type: string;
  resource_id?: string | null;
  details?: string | null;
  ip_address?: string | null;
  created_at: string;
}

export interface AuditLogsResponseDTO {
  data?: {
    items: BackendAuditLogDTO[];
    total: number;
  };
  items?: BackendAuditLogDTO[];
  total?: number;
}

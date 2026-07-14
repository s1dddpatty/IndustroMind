export interface BackendDocumentDTO {
  id: string;
  file_name?: string;
  filename?: string;
  status?: string;
  classification?: string;
  classification_confidence?: number;
  confidence_score?: number;
  created_at?: string;
  entity_count?: number;
  processing_events?: string[];
  pipeline_result?: any;
}

export interface DocumentsResponseDTO {
  data?: {
    items?: BackendDocumentDTO[];
  } | BackendDocumentDTO[];
  items?: BackendDocumentDTO[];
}

export type DocumentType = "SOP" | "Datasheet" | "Report" | "Checklist" | "Manual" | "P&ID" | "Certificate";
export type DocumentStatus = "Processing" | "Processed" | "Failed" | "Review Required" | "Draft";

export interface DocumentProcessingStep {
  step: string;
  status: "pending" | "running" | "completed" | "failed";
  durationMs?: number;
}

export interface DocumentVersion {
  id: string;
  version: string;
  createdAt: string;
  createdBy: string;
  changes: string;
}

export interface DocumentRelationship {
  id: string;
  type: "Asset" | "SOP" | "Risk" | "Compliance" | "Person" | "KnowledgeNode";
  name: string;
}

export interface DocumentData {
  id: string;
  title: string;
  fileName: string;
  documentType: DocumentType;
  asset: string;
  uploadedBy: string;
  uploadedAt: string;
  lastModified: string;
  status: DocumentStatus;
  version: string;
  fileSize: string;
  pages: number;
  confidence: number;
  tags: string[];
  summary: string;

  keyHighlights: string[];
  revisionHistory: DocumentVersion[];
  relatedEntities: DocumentRelationship[];
  complianceReferences: string[];
  processingTimeline: { timestamp: string; action: string }[];
  aiInsights: string[];
  suggestedActions: { action: string; priority: "Low" | "Medium" | "High" }[];

  owner: string;
  department: string;
  approvalStatus: "Approved" | "Pending" | "Rejected";
  expiryDate?: string;
}

export const MOCK_DOCUMENTS: DocumentData[] = [];

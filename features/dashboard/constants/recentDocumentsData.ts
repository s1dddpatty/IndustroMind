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

export const MOCK_DOCUMENTS: DocumentData[] = [
  {
    id: "doc-001",
    title: "Maintenance SOP",
    fileName: "SOP-MAINT-P201.pdf",
    documentType: "SOP",
    asset: "Pump P-201",
    uploadedBy: "Admin User",
    uploadedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    lastModified: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    status: "Processed",
    version: "v2.1",
    fileSize: "1.2 MB",
    pages: 14,
    confidence: 98,
    tags: ["Maintenance", "Critical", "Hydraulics"],
    summary: "Standard operating procedure for the annual maintenance, inspection, and bearing replacement of centrifugal pump P-201. Outlines lockout-tagout (LOTO) requirements and torque specifications.",
    keyHighlights: [
      "Updated torque specs for casing bolts (120 Nm)",
      "Added vibration analysis baseline requirement",
      "Modified LOTO sequence for upstream valve V-104"
    ],
    revisionHistory: [
      { id: "rev-2", version: "v2.1", createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), createdBy: "Admin User", changes: "Minor torque updates" },
      { id: "rev-1", version: "v2.0", createdAt: "2025-01-15T10:00:00Z", createdBy: "Sarah Jenkins", changes: "Major overhaul for 2025 compliance" }
    ],
    relatedEntities: [
      { id: "ast-1", type: "Asset", name: "Pump P-201" },
      { id: "rsk-1", type: "Risk", name: "High Pressure Fluid Release" },
      { id: "cmp-1", type: "Compliance", name: "OSHA 1910.147 (LOTO)" }
    ],
    complianceReferences: ["OSHA 1910.147", "ISO 9001:2015 Sec 7.1.3"],
    processingTimeline: [
      { timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), action: "Document Uploaded" },
      { timestamp: new Date(Date.now() - 118 * 60 * 1000).toISOString(), action: "OCR Extraction Complete" },
      { timestamp: new Date(Date.now() - 117 * 60 * 1000).toISOString(), action: "Knowledge Graph Linked" }
    ],
    aiInsights: [
      "Contradiction detected with safety manual v1.2 regarding valve isolation.",
      "Vibration thresholds are 10% tighter than manufacturer defaults."
    ],
    suggestedActions: [
      { action: "Update Safety Manual v1.2", priority: "High" },
      { action: "Schedule Training for Maint Team", priority: "Medium" }
    ],
    owner: "Sarah Jenkins",
    department: "Maintenance",
    approvalStatus: "Approved",
    expiryDate: "2027-01-15T00:00:00Z"
  },
  {
    id: "doc-002",
    title: "Inspection Guideline",
    fileName: "OISD-GDN-116.pdf",
    documentType: "Checklist",
    asset: "OISD Global",
    uploadedBy: "System",
    uploadedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    lastModified: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    status: "Processed",
    version: "v1.0",
    fileSize: "4.5 MB",
    pages: 42,
    confidence: 95,
    tags: ["Safety", "Regulatory", "OISD"],
    summary: "Safety and environmental standards for operating pressure vessels and storage tanks.",
    keyHighlights: ["New emission limits", "Quarterly ultrasonic testing required"],
    revisionHistory: [
      { id: "rev-1", version: "v1.0", createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), createdBy: "System", changes: "Initial import" }
    ],
    relatedEntities: [
      { id: "ast-2", type: "Asset", name: "Storage Tank T-500" }
    ],
    complianceReferences: ["OISD-116"],
    processingTimeline: [
      { timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), action: "System Import" }
    ],
    aiInsights: ["New compliance rule affects 12 procedures."],
    suggestedActions: [{ action: "Review impacted procedures", priority: "High" }],
    owner: "Compliance Officer",
    department: "HSE",
    approvalStatus: "Approved",
    expiryDate: undefined
  },
  {
    id: "doc-003",
    title: "Equipment Datasheet",
    fileName: "Pump_P-201_Datasheet.pdf",
    documentType: "Datasheet",
    asset: "Pump P-201",
    uploadedBy: "Mike Chen",
    uploadedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    lastModified: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    status: "Processed",
    version: "Rev B",
    fileSize: "0.8 MB",
    pages: 4,
    confidence: 99,
    tags: ["OEM", "Specs"],
    summary: "Manufacturer specifications for Pump P-201 including flow curves and material composition.",
    keyHighlights: ["Max operating temp: 150C", "Impeller diameter: 210mm"],
    revisionHistory: [],
    relatedEntities: [{ id: "ast-1", type: "Asset", name: "Pump P-201" }],
    complianceReferences: [],
    processingTimeline: [],
    aiInsights: [],
    suggestedActions: [],
    owner: "Mike Chen",
    department: "Engineering",
    approvalStatus: "Approved"
  },
  {
    id: "doc-004",
    title: "Annual Report",
    fileName: "Annual_Maintenance_Report.pdf",
    documentType: "Report",
    asset: "Plant Wide",
    uploadedBy: "Admin User",
    uploadedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    lastModified: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: "Review Required",
    version: "Draft",
    fileSize: "15 MB",
    pages: 112,
    confidence: 85,
    tags: ["Report", "2025"],
    summary: "Comprehensive review of all maintenance activities.",
    keyHighlights: [],
    revisionHistory: [],
    relatedEntities: [],
    complianceReferences: [],
    processingTimeline: [],
    aiInsights: [],
    suggestedActions: [],
    owner: "Admin User",
    department: "Management",
    approvalStatus: "Pending"
  }
];

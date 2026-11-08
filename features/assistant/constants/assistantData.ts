export type MessageRole = "user" | "assistant" | "system";

export type MessageStatus = "pending" | "receiving" | "streaming" | "completed" | "archived" | "error";

export interface GraphNodeRef {
  id: string;
  label: string;
  type: "Equipment" | "Document" | "Procedure" | "Risk" | "Regulation";
  status?: "Healthy" | "Warning" | "Critical";
}

export interface EvidenceItem {
  id: string;
  type: "SOP" | "Manual" | "Datasheet" | "Regulation" | "Sensor" | "Alert" | "Report";
  title: string;
  excerpt: string;
  pageOrSection?: string;
  url?: string;
  confidence: number;
}

export interface ActionRecommendation {
  id: string;
  actionType: "Maintenance" | "Inspection" | "Approval" | "Shutdown" | "Notify";
  description: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  targetAsset?: string;
}

export interface ComplianceImpact {
  id: string;
  standard: string; // e.g. OISD-116
  rule: string;
  status: "Compliant" | "Violation" | "Warning";
  description: string;
}

export interface AiReasoningStep {
  id: string;
  status: "pending" | "active" | "completed";
  message: string;
  durationMs: number;
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;

  // Lifecycle
  status?: MessageStatus;
  errorDetail?: string;

  // Rich Context (typically attached to 'assistant' messages)
  reasoningSteps?: AiReasoningStep[];
  executiveSummary?: string;
  confidenceScore?: number;
  evidence?: EvidenceItem[];
  graphNodes?: GraphNodeRef[];
  complianceImpacts?: ComplianceImpact[];
  recommendations?: ActionRecommendation[];
  followUpQuestions?: string[];

  // Future AI Orchestration Prep (Not rendered yet, but modeled)
  invokedTools?: any[];
  executionSteps?: any[];
  reasoningSummary?: string;
  generatedArtifacts?: any[];
  reportIds?: string[];
  graphNodeIds?: string[];
  complianceIds?: string[];
  documentIds?: string[];

  // Technical Metadata (Not Exposed in UI)
  backendRequestId?: string;
  endpointOrigin?: string;
  adapterVersion?: string;
}

export interface ChatConversation {
  id: string;
  title: string;
  department: "Maintenance" | "Operations" | "Compliance" | "Engineering" | "Safety";
  timestamp: string;
  pinned: boolean;
  messages: ChatMessage[];
  status?: "active" | "archived";

  // Contextual Awareness
  sourceModule?: string;
  selectedEntity?: string;
  metadata?: Record<string, any>;
}

export const ASSISTANT_PROMPTS = [
  "Is Pump P-201 safe to restart?",
  "Which SOP conflicts exist?",
  "Summarize yesterday's maintenance.",
  "Show all compliance risks.",
  "Find every document mentioning valve V-104.",
  "Explain why compressor C-104 keeps overheating.",
  "Generate shutdown recommendations.",
  "What changed after the last inspection?"
];

// Empty conversation history initially until documents are ingested and chats occur
export const MOCK_CONVERSATIONS: ChatConversation[] = [];

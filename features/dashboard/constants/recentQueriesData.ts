export interface TimelineEvent {
  id: string;
  timestamp: string;
  label: string;
  status: "completed" | "in-progress" | "pending";
}

export interface ReferenceItem {
  id: string;
  type: "Document" | "Asset" | "Alert" | "KnowledgeGraphNode" | "SOP";
  title: string;
  identifier?: string;
  url?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "ai" | "system";
  content: string;
  timestamp: string;
}

export interface AiResponseSection {
  type: "ExecutiveSummary" | "KeyFindings" | "OperationalRisks" | "ComplianceImpact" | "RecommendedActions" | "Confidence" | "SourcesUsed" | "Custom";
  title: string;
  content: string;
  items?: string[];
}

export interface AnalyticsInfo {
  viewCount: number;
  lastViewed: string;
  pinned: boolean;
  favorite: boolean;
  shared: number;
  exported: number;
  feedback: "positive" | "negative" | "none";
}

export interface Query {
  id: string;
  question: string;
  timestamp: string;
  user: string;
  department: "Maintenance" | "Operations" | "Safety" | "Compliance" | "Engineering";
  
  conversationId: string;
  parentConversationId?: string;
  sessionId?: string;
  messageType: "initial" | "followUp";
  source: "web" | "mobile" | "api";
  attachments: string[];
  isFollowUp: boolean;
  
  status: "Complete" | "Processing" | "Failed";
  responseSummary: string;
  confidence: number;
  confidenceExplanation: string;
  processingTime: string;
  
  structuredResponse: AiResponseSection[];
  timeline: TimelineEvent[];
  relatedDocuments: ReferenceItem[];
  relatedAssets: ReferenceItem[];
  relatedAlerts: ReferenceItem[];
  knowledgeNodes: ReferenceItem[];
  relatedSops: ReferenceItem[];
  conversation: ChatMessage[];
  tags: string[];
  analytics: AnalyticsInfo;
}

export const MOCK_RECENT_QUERIES: Query[] = [
  {
    id: "qry-p204",
    question: "Is Pump P-204 safe to restart under SOP-MECH-042?",
    timestamp: new Date().toISOString(),
    user: "Plant Administrator",
    department: "Operations",
    conversationId: "conv-p204-restart",
    messageType: "initial",
    source: "web",
    attachments: ["SOP-MECH-042.pdf"],
    isFollowUp: false,
    status: "Complete",
    responseSummary: "Centrifugal pump P-204 is restricted from restart due to a critical contradiction between SOP-MECH-042 suction valve LOTO requirements and OEM mechanical seal flush specifications.",
    confidence: 98,
    confidenceExplanation: "Direct cross-correlation between SOP-MECH-042 section 3 and Flowserve Durco Mark 3 OEM manual rev 3 verified via Knowledge Graph.",
    processingTime: "1.2s",
    structuredResponse: [
      {
        type: "ExecutiveSummary",
        title: "Executive Summary",
        content: "Centrifugal pump P-204 in Unit 3 cannot be restarted under current conditions. A critical contradiction exists between SOP-MECH-042 suction valve LOTO lockout and OEM mechanical seal MS-204 barrier fluid flush procedures."
      },
      {
        type: "OperationalRisks",
        title: "Operational Risks",
        content: "High risk of seal face dry-running and thermal shock. Valve V-101 100% closed state prevents barrier fluid circulation at 15 psi differential.",
        items: [
          "Micro-fracturing of carbon seal faces within 45 seconds of dry run",
          "Potential volatile hydrocarbon leakage at seal gland"
        ]
      },
      {
        type: "RecommendedActions",
        title: "Recommended Actions",
        content: "Authorize an immediate bypass exception for SOP-MECH-042: Crack suction valve V-101 by 5% during initial 10-minute warm-up flush.",
        items: [
          "Update SOP-MECH-042 with OEM bypass amendment",
          "Verify pressure on PT-302 reads 0 psi prior to removing lockout tags"
        ]
      }
    ],
    timeline: [
      { id: "tl-1", timestamp: "Just now", label: "Query received via Decision Assistant", status: "completed" },
      { id: "tl-2", timestamp: "Just now", label: "Knowledge Graph traversal across SOP-MECH-042 & P-204", status: "completed" },
      { id: "tl-3", timestamp: "Just now", label: "Synthesized Decision Brief response", status: "completed" }
    ],
    relatedDocuments: [
      { id: "doc-sop-042", type: "Document", title: "SOP-MECH-042 Revision 3.2" }
    ],
    relatedAssets: [
      { id: "ast-p204", type: "Asset", title: "Centrifugal Pump P-204", identifier: "P-204" },
      { id: "ast-v101", type: "Asset", title: "Suction Isolation Valve V-101", identifier: "V-101" }
    ],
    relatedAlerts: [
      { id: "alt-101", type: "Alert", title: "Contradiction: SOP-MECH-042 vs OEM Manual" }
    ],
    knowledgeNodes: [
      { id: "node-p204", type: "KnowledgeGraphNode", title: "P-204 (Equipment)" },
      { id: "node-sop-042", type: "KnowledgeGraphNode", title: "SOP-MECH-042 (Procedure)" }
    ],
    relatedSops: [
      { id: "sop-042", type: "SOP", title: "SOP-MECH-042" }
    ],
    conversation: [
      { id: "msg-1", role: "user", content: "Is Pump P-204 safe to restart under SOP-MECH-042?", timestamp: new Date().toISOString() },
      { id: "msg-2", role: "ai", content: "Pump P-204 is in a restricted state. AI detected a critical contradiction between LOTO suction isolation and OEM mechanical seal flush requirements.", timestamp: new Date().toISOString() }
    ],
    tags: ["P-204", "SOP-MECH-042", "Contradiction", "Safety"],
    analytics: {
      viewCount: 14,
      lastViewed: "Just now",
      pinned: true,
      favorite: true,
      shared: 2,
      exported: 1,
      feedback: "positive"
    }
  }
];

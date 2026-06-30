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
  content: string; // Markdown or plain text
  items?: string[]; // Optional bullet points
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
  
  // Future Multi-turn & Streaming Support
  conversationId: string;
  parentConversationId?: string;
  sessionId?: string;
  messageType: "initial" | "followUp";
  source: "web" | "mobile" | "api";
  attachments: string[];
  isFollowUp: boolean;
  
  status: "Complete" | "Processing" | "Failed";
  responseSummary: string; // Short version for cards
  confidence: number;
  confidenceExplanation: string;
  processingTime: string;
  
  // Rich AI Response Payload
  structuredResponse: AiResponseSection[];
  
  // Lifecycle
  timeline: TimelineEvent[];
  
  // References
  relatedDocuments: ReferenceItem[];
  relatedAssets: ReferenceItem[];
  relatedAlerts: ReferenceItem[];
  knowledgeNodes: ReferenceItem[];
  relatedSops: ReferenceItem[];
  
  // Multi-turn History
  conversation: ChatMessage[];
  
  tags: string[];
  analytics: AnalyticsInfo;
}

export const MOCK_RECENT_QUERIES: Query[] = [
  {
    id: "q-101",
    question: "Is Pump P-201 safe to restart?",
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
    user: "Admin User",
    department: "Operations",
    conversationId: "conv-101",
    sessionId: "sess-01",
    messageType: "initial",
    source: "web",
    attachments: [],
    isFollowUp: false,
    status: "Complete",
    responseSummary: "Pump P-201 requires a seal inspection before restart due to a recent vibration alert.",
    confidence: 96,
    confidenceExplanation: "High confidence due to multiple corroborating sources including recent SCADA vibration data and SOP-MAINT-P201 guidelines.",
    processingTime: "4.2s",
    structuredResponse: [
      {
        type: "ExecutiveSummary",
        title: "Executive Summary",
        content: "Pump P-201 is currently in a restricted state. A restart is not recommended until a visual inspection of the primary mechanical seal is completed."
      },
      {
        type: "KeyFindings",
        title: "Key Findings",
        content: "",
        items: [
          "Vibration anomaly detected 2 hours ago (Alert #492).",
          "Last maintenance log indicates minor seal wear (3 weeks ago).",
          "Knowledge Graph identifies P-201 as a critical path asset for Line B."
        ]
      },
      {
        type: "RecommendedActions",
        title: "Recommended Actions",
        content: "",
        items: [
          "Dispatch maintenance to inspect mechanical seal.",
          "Acknowledge Alert #492.",
          "Review SOP-MAINT-P201 Section 4.2 for safe restart procedures."
        ]
      }
    ],
    timeline: [
      { id: "t1", timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), label: "User asked question", status: "completed" },
      { id: "t2", timestamp: new Date(Date.now() - 1000 * 60 * 29.9).toISOString(), label: "Searching documents...", status: "completed" },
      { id: "t3", timestamp: new Date(Date.now() - 1000 * 60 * 29.8).toISOString(), label: "Traversing Knowledge Graph...", status: "completed" },
      { id: "t4", timestamp: new Date(Date.now() - 1000 * 60 * 29.6).toISOString(), label: "Running Compliance Engine...", status: "completed" },
      { id: "t5", timestamp: new Date(Date.now() - 1000 * 60 * 29.3).toISOString(), label: "Generating AI Summary...", status: "completed" },
      { id: "t6", timestamp: new Date(Date.now() - 1000 * 60 * 29.0).toISOString(), label: "Response Ready", status: "completed" }
    ],
    relatedDocuments: [
      { id: "doc-1", type: "Document", title: "P-201 Datasheet", identifier: "DS-P201" }
    ],
    relatedAssets: [
      { id: "ast-1", type: "Asset", title: "Pump P-201", identifier: "P-201" }
    ],
    relatedAlerts: [
      { id: "alt-1", type: "Alert", title: "Vibration Anomaly Detected", identifier: "ALT-492" }
    ],
    knowledgeNodes: [
      { id: "kn-1", type: "KnowledgeGraphNode", title: "Line B Flow Dependency", identifier: "KN-1049" }
    ],
    relatedSops: [
      { id: "sop-1", type: "SOP", title: "Pump Restart Procedure", identifier: "SOP-MAINT-P201" }
    ],
    conversation: [
      { id: "msg-1", role: "user", content: "Is Pump P-201 safe to restart?", timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
      { id: "msg-2", role: "ai", content: "Pump P-201 is currently in a restricted state. A restart is not recommended until a visual inspection of the primary mechanical seal is completed. I found a recent vibration anomaly (Alert #492) that violates SOP-MAINT-P201 restart conditions.", timestamp: new Date(Date.now() - 1000 * 60 * 29).toISOString() }
    ],
    tags: ["Maintenance", "Safety", "P-201"],
    analytics: { viewCount: 1, lastViewed: new Date().toISOString(), pinned: false, favorite: false, shared: 0, exported: 0, feedback: "none" }
  },
  {
    id: "q-102",
    question: "Show all SOP conflicts",
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
    user: "Compliance Officer",
    department: "Compliance",
    conversationId: "conv-102",
    sessionId: "sess-02",
    messageType: "initial",
    source: "web",
    attachments: [],
    isFollowUp: false,
    status: "Complete",
    responseSummary: "Identified 3 active SOP conflicts related to recent OISD-189 regulation updates.",
    confidence: 88,
    confidenceExplanation: "Moderate confidence. Cross-referencing identified potential ambiguities in legacy safety manuals.",
    processingTime: "8.1s",
    structuredResponse: [
      {
        type: "ExecutiveSummary",
        title: "Executive Summary",
        content: "There are currently 3 active Standard Operating Procedures (SOPs) that conflict with the newly ingested OISD-189 regulations regarding hazardous material storage."
      },
      {
        type: "ComplianceImpact",
        title: "Compliance Impact",
        content: "Failure to update these procedures may result in non-compliance penalties during the upcoming Q3 audit."
      }
    ],
    timeline: [
      { id: "t1", timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), label: "User asked question", status: "completed" },
      { id: "t2", timestamp: new Date(Date.now() - 1000 * 60 * 119.5).toISOString(), label: "Querying Regulatory Database...", status: "completed" },
      { id: "t3", timestamp: new Date(Date.now() - 1000 * 60 * 119).toISOString(), label: "Response Ready", status: "completed" }
    ],
    relatedDocuments: [],
    relatedAssets: [],
    relatedAlerts: [],
    knowledgeNodes: [],
    relatedSops: [
      { id: "sop-2", type: "SOP", title: "Hazmat Storage Guidelines", identifier: "SOP-SAFE-004" }
    ],
    conversation: [
      { id: "msg-1", role: "user", content: "Show all SOP conflicts", timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString() },
      { id: "msg-2", role: "ai", content: "I have identified 3 SOPs that conflict with the latest OISD-189 updates.", timestamp: new Date(Date.now() - 1000 * 60 * 119).toISOString() }
    ],
    tags: ["Compliance", "OISD-189"],
    analytics: { viewCount: 5, lastViewed: new Date().toISOString(), pinned: true, favorite: true, shared: 2, exported: 1, feedback: "positive" }
  },
  {
    id: "q-103",
    question: "What inspections are due this week?",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // Yesterday
    user: "Maintenance Supervisor",
    department: "Maintenance",
    conversationId: "conv-103",
    sessionId: "sess-03",
    messageType: "initial",
    source: "mobile",
    attachments: [],
    isFollowUp: false,
    status: "Complete",
    responseSummary: "12 routine inspections and 2 critical safety audits are scheduled for this week.",
    confidence: 99,
    confidenceExplanation: "High confidence. Direct query from CMMS database.",
    processingTime: "1.2s",
    structuredResponse: [
      {
        type: "ExecutiveSummary",
        title: "Overview",
        content: "A total of 14 inspection tasks are due between Monday and Friday."
      },
      {
        type: "KeyFindings",
        title: "Critical Items",
        content: "",
        items: [
          "Emergency Suppression System Audit (Due Wed)",
          "Compressor C-104 Annual Vibration Baseline (Due Fri)"
        ]
      }
    ],
    timeline: [
      { id: "t1", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), label: "Query received", status: "completed" },
      { id: "t2", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 23.99).toISOString(), label: "Response Ready", status: "completed" }
    ],
    relatedDocuments: [],
    relatedAssets: [
      { id: "ast-2", type: "Asset", title: "Compressor C-104", identifier: "C-104" }
    ],
    relatedAlerts: [],
    knowledgeNodes: [],
    relatedSops: [],
    conversation: [
      { id: "msg-1", role: "user", content: "What inspections are due this week?", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
      { id: "msg-2", role: "ai", content: "There are 14 inspections due this week. Two are critical safety audits.", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 23.99).toISOString() }
    ],
    tags: ["Scheduling", "Inspections"],
    analytics: { viewCount: 2, lastViewed: new Date().toISOString(), pinned: false, favorite: false, shared: 0, exported: 0, feedback: "none" }
  },
  {
    id: "q-104",
    question: "Explain vibration increase in Compressor C-104",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    user: "Reliability Engineer",
    department: "Engineering",
    conversationId: "conv-104",
    sessionId: "sess-04",
    messageType: "initial",
    source: "web",
    attachments: [],
    isFollowUp: false,
    status: "Complete",
    responseSummary: "Vibration is likely due to bearing wear correlated with a recent pressure drop in the lube oil system.",
    confidence: 92,
    confidenceExplanation: "High confidence. Pattern matches historical failure mode from 2024.",
    processingTime: "6.5s",
    structuredResponse: [
      {
        type: "ExecutiveSummary",
        title: "Root Cause Analysis",
        content: "The 15% increase in vibration amplitude at the non-drive end bearing of C-104 correlates strongly with a 5 PSI drop in lube oil supply pressure recorded 48 hours prior."
      },
      {
        type: "OperationalRisks",
        title: "Operational Risks",
        content: "Continued operation may lead to catastrophic bearing failure within 7-10 days."
      }
    ],
    timeline: [
      { id: "t1", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), label: "Query received", status: "completed" },
      { id: "t2", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 47.9).toISOString(), label: "Response Ready", status: "completed" }
    ],
    relatedDocuments: [],
    relatedAssets: [
      { id: "ast-2", type: "Asset", title: "Compressor C-104", identifier: "C-104" }
    ],
    relatedAlerts: [],
    knowledgeNodes: [],
    relatedSops: [],
    conversation: [
      { id: "msg-1", role: "user", content: "Explain vibration increase in Compressor C-104", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString() },
      { id: "msg-2", role: "ai", content: "The vibration increase is likely due to a bearing wear issue correlated with the recent lube oil pressure drop.", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 47.9).toISOString() }
    ],
    tags: ["Engineering", "RCA", "C-104"],
    analytics: { viewCount: 12, lastViewed: new Date().toISOString(), pinned: false, favorite: true, shared: 5, exported: 1, feedback: "positive" }
  }
];

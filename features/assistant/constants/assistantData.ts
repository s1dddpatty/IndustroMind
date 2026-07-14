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

// Mock data representing a complete conversational history
export const MOCK_CONVERSATIONS: ChatConversation[] = [
  {
    id: "conv-1",
    title: "Pump P-201 Safety Check",
    department: "Operations",
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
    pinned: true,
    status: "active",
    messages: [
      {
        id: "msg-1",
        role: "user",
        content: "Is Pump P-201 safe to restart?",
        timestamp: new Date(Date.now() - 1000 * 60 * 31).toISOString(),
        status: "completed"
      },
      {
        id: "msg-2",
        role: "assistant",
        status: "completed",
        content: "Based on the cross-reference of recent maintenance records, real-time sensor data, and current SOPs, it is **NOT SAFE** to restart Pump P-201 at this moment.",
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        reasoningSteps: [
          { id: "step-1", status: "completed", message: "Searching recent maintenance records...", durationMs: 400 },
          { id: "step-2", status: "completed", message: "Querying Knowledge Graph for Pump P-201 dependencies...", durationMs: 650 },
          { id: "step-3", status: "completed", message: "Checking compliance against OISD-116...", durationMs: 300 },
          { id: "step-4", status: "completed", message: "Analyzing sensor telemetry history...", durationMs: 800 },
          { id: "step-5", status: "completed", message: "Generating operational recommendations...", durationMs: 500 }
        ],
        executiveSummary: "Pump P-201 exhibits anomalous vibration patterns combined with an uncompleted mandatory 12-month inspection. Restarting poses a severe mechanical failure risk and violates OISD-116 compliance.",
        confidenceScore: 98,
        evidence: [
          {
            id: "ev-1",
            type: "Sensor",
            title: "Vibration Sensor VX-201",
            excerpt: "Vibration amplitude exceeded 8.2mm/s during last shutdown phase (Threshold: 7.5mm/s).",
            confidence: 99
          },
          {
            id: "ev-2",
            type: "Report",
            title: "Monthly Inspection Log",
            excerpt: "Annual bearing seal inspection marked as 'Pending - Awaiting Parts'.",
            pageOrSection: "Section 3.1",
            confidence: 100
          },
          {
            id: "ev-3",
            type: "SOP",
            title: "SOP-MAINT-P201",
            excerpt: "Do not initiate cold start sequence if preceding shutdown recorded high vibration without manual seal verification.",
            pageOrSection: "Page 4, Step 2",
            confidence: 95
          }
        ],
        graphNodes: [
          { id: "node-1", label: "Pump P-201", type: "Equipment", status: "Critical" },
          { id: "node-2", label: "VX-201", type: "Equipment", status: "Warning" },
          { id: "node-3", label: "OISD-116", type: "Regulation" },
          { id: "node-4", label: "SOP-MAINT-P201", type: "Procedure" }
        ],
        complianceImpacts: [
          {
            id: "comp-1",
            standard: "OISD-116",
            rule: "Rotary Equipment Safety",
            status: "Violation",
            description: "Operating a pump with known pending mandatory inspections constitutes a Class B safety violation."
          }
        ],
        recommendations: [
          {
            id: "rec-1",
            actionType: "Inspection",
            priority: "Critical",
            description: "Perform manual bearing seal inspection.",
            targetAsset: "Pump P-201"
          },
          {
            id: "rec-2",
            actionType: "Maintenance",
            priority: "High",
            description: "Re-calibrate Vibration Sensor VX-201.",
            targetAsset: "VX-201"
          }
        ],
        followUpQuestions: [
          "What inspections remain for Pump P-201?",
          "Show me the historical vibration data.",
          "Which SOPs are affected by OISD-116?",
          "Who approved the last maintenance?"
        ]
      }
    ]
  },
  {
    id: "conv-2",
    title: "Compressor C-104 Overheating",
    department: "Engineering",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    pinned: false,
    status: "active",
    messages: [
      {
        id: "msg-1",
        role: "user",
        content: "Explain why compressor C-104 keeps overheating.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
        status: "completed"
      },
      {
        id: "msg-2",
        role: "assistant",
        content: "Compressor C-104 is experiencing systemic overheating due to a failing upstream cooling valve (V-104) and degraded synthetic lubricant.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 47.9).toISOString(),
        status: "completed"
      }
    ]
  }
];

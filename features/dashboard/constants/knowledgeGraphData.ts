export type NodeType = 
  | "Equipment" 
  | "Document" 
  | "Procedure" 
  | "Risk" 
  | "Maintenance" 
  | "Inspection" 
  | "Sensor" 
  | "AI Insight"
  | "Personnel";

export type NodeStatus = 
  | "Healthy" 
  | "Warning" 
  | "Critical" 
  | "Offline" 
  | "AI recommendation"
  | "Recently Updated";

export interface GraphNode {
  id: string;
  label: string;
  type: NodeType;
  status: NodeStatus;
  description?: string;
  health?: number;
  priority?: "Low" | "Medium" | "High" | "Critical";
  confidence?: number;
  riskScore?: number;
  metadata?: Record<string, any>;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number;
  fy?: number;
}

export interface GraphEdge {
  id?: string;
  source: string;
  target: string;
  relationship: string;
  strength?: number;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphEdge[];
}

export const KNOWLEDGE_GRAPH_DATA: GraphData = {
  nodes: [
    {
      id: "P-201",
      label: "Pump P-201",
      type: "Equipment",
      status: "Warning",
      description: "Main cooling water circulation pump for Unit 4.",
      health: 72,
      priority: "High",
      riskScore: 65,
      metadata: { lastMaintenance: "2026-05-12", manufacturer: "FlowServe" }
    },
    {
      id: "SOP-MAINT",
      label: "Maintenance SOP",
      type: "Procedure",
      status: "Healthy",
      description: "Standard operating procedure for pump maintenance.",
    },
    {
      id: "RISK-01",
      label: "SOP Conflict",
      type: "Risk",
      status: "Critical",
      description: "Conflict detected between SOP-MAINT and recent OISD-116 update.",
      riskScore: 92,
      priority: "Critical"
    },
    {
      id: "INSP-442",
      label: "Inspection Record",
      type: "Inspection",
      status: "Recently Updated",
      description: "Monthly vibration and acoustic inspection.",
    },
    {
      id: "EMP-RSHARMA",
      label: "Engineer R. Sharma",
      type: "Personnel",
      status: "Healthy",
      description: "Lead maintenance engineer assigned to Unit 4.",
    },
    {
      id: "OISD-116",
      label: "OISD-116 Standard",
      type: "Procedure",
      status: "Warning",
      description: "Updated on 15 Jan 2025. Requires annual compliance check.",
    },
    {
      id: "DOC-FAIL",
      label: "Failure History",
      type: "Document",
      status: "Healthy",
      description: "Historical failure records for P-200 series pumps.",
    },
    {
      id: "DOC-VIB",
      label: "Vibration Analysis",
      type: "Document",
      status: "AI recommendation",
      description: "AI analysis of recent vibration trends indicating bearing wear.",
      confidence: 88
    },
    {
      id: "DOC-ANNUAL",
      label: "Annual Report",
      type: "Document",
      status: "Healthy",
      description: "2025 Annual Maintenance Report.",
    },
    // Extended nodes for a fuller graph
    { id: "SENS-VIB1", label: "Vibration Sensor A", type: "Sensor", status: "Warning" },
    { id: "SENS-TEMP1", label: "Temp Sensor 1", type: "Sensor", status: "Healthy" },
    { id: "P-202", label: "Pump P-202", type: "Equipment", status: "Healthy" },
    { id: "AI-INSIGHT-1", label: "Bearing Wear Prediction", type: "AI Insight", status: "AI recommendation", confidence: 92 },
    { id: "MAINT-WO-992", label: "Work Order 992", type: "Maintenance", status: "Recently Updated" },
    { id: "RISK-02", label: "Overheating Risk", type: "Risk", status: "Warning", riskScore: 78 }
  ],
  links: [
    { source: "P-201", target: "SOP-MAINT", relationship: "Requires" },
    { source: "P-201", target: "RISK-01", relationship: "Has Risk" },
    { source: "P-201", target: "INSP-442", relationship: "Has Record" },
    { source: "P-201", target: "EMP-RSHARMA", relationship: "Maintained By" },
    { source: "P-201", target: "OISD-116", relationship: "Must Comply" },
    { source: "P-201", target: "DOC-FAIL", relationship: "Has History" },
    { source: "P-201", target: "DOC-VIB", relationship: "Analyzed By" },
    { source: "P-201", target: "DOC-ANNUAL", relationship: "Referenced In" },
    { source: "RISK-01", target: "SOP-MAINT", relationship: "Conflicts With" },
    { source: "RISK-01", target: "OISD-116", relationship: "Conflicts With" },
    { source: "DOC-VIB", target: "INSP-442", relationship: "Based On" },
    { source: "SENS-VIB1", target: "P-201", relationship: "Monitors" },
    { source: "SENS-TEMP1", target: "P-201", relationship: "Monitors" },
    { source: "AI-INSIGHT-1", target: "SENS-VIB1", relationship: "Analyzes" },
    { source: "AI-INSIGHT-1", target: "P-201", relationship: "Predicts For" },
    { source: "MAINT-WO-992", target: "P-201", relationship: "Repairs" },
    { source: "RISK-02", target: "SENS-TEMP1", relationship: "Identified By" },
    { source: "P-202", target: "SOP-MAINT", relationship: "Requires" },
  ]
};

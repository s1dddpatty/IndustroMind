export type NodeType = "equipment" | "document" | "procedure" | "risk" | "expert";

export interface DemoGraphNode {
  id: string;
  label: string;
  type: NodeType;
  x: number;
  y: number;
}

export interface DemoGraphEdge {
  source: string;
  target: string;
}

export const demoGraph = {
  nodes: [
    { id: "center", label: "Pump\nP-201", type: "equipment" as NodeType, x: 0, y: 0 },
    { id: "node1", label: "Annual\nReport", type: "document" as NodeType, x: -100, y: -60 },
    { id: "node2", label: "Maintenance\nSOP", type: "procedure" as NodeType, x: 0, y: -100 },
    { id: "node3", label: "SOP\nConflict", type: "risk" as NodeType, x: 100, y: -60 },
    { id: "node4", label: "Inspection\nRecord", type: "document" as NodeType, x: 120, y: 20 },
    { id: "node5", label: "Engineer\nR. Sharma", type: "expert" as NodeType, x: 80, y: 90 },
    { id: "node6", label: "OISD-116\nStandard", type: "procedure" as NodeType, x: 0, y: 120 },
    { id: "node7", label: "Failure\nHistory", type: "document" as NodeType, x: -80, y: 90 },
    { id: "node8", label: "Vibration\nAnalysis", type: "document" as NodeType, x: -120, y: 20 },
  ],
  edges: [
    { source: "center", target: "node1" },
    { source: "center", target: "node2" },
    { source: "center", target: "node3" },
    { source: "center", target: "node4" },
    { source: "center", target: "node5" },
    { source: "center", target: "node6" },
    { source: "center", target: "node7" },
    { source: "center", target: "node8" },
  ]
};

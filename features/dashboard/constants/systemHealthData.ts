export type SystemStatus = "Healthy" | "Operational" | "Warning" | "Degraded" | "Critical" | "Offline" | "Maintenance" | "Updating";
export type MetricType = "cpu" | "memory" | "latency" | "requests" | "error";

export interface DataPoint {
  timestamp: string;
  value: number;
}

export interface MetricHistory {
  cpu: DataPoint[];
  memory: DataPoint[];
  latency: DataPoint[];
  requests: DataPoint[];
  errors: DataPoint[];
}

export interface IncidentRecord {
  id: string;
  type: "Incident" | "Maintenance" | "Deployment" | "Recovery";
  title: string;
  description: string;
  status: "Resolved" | "Ongoing" | "Scheduled";
  timestamp: string;
  resolvedAt?: string;
}

export interface DependencyReference {
  id: string;
  name: string;
  type: "upstream" | "downstream";
  status: SystemStatus;
}

export interface RelatedEntity {
  id: string;
  type: "Alert" | "Document" | "Asset" | "KnowledgeGraphNode" | "Query" | "Session" | "Job";
  title: string;
}

export interface SystemModule {
  id: string;
  name: string;
  category: "AI" | "Infrastructure" | "Knowledge" | "Processing" | "Security";
  status: SystemStatus;
  
  // Real-time Metrics
  healthScore: number;
  uptime: number; // percentage
  lastChecked: string;
  latency: number; // ms
  responseTime: number; // ms
  cpuUsage: number; // percentage
  memoryUsage: number; // percentage
  queueLength: number;
  errorRate: number; // percentage
  
  // Counts
  warningCount: number;
  criticalCount: number;
  
  description: string;
  
  // Relationships
  dependencies: DependencyReference[];
  relatedEntities: RelatedEntity[];
  
  // History Arrays
  history: MetricHistory;
  incidents: IncidentRecord[];
  
  // Metadata
  version: string;
  lastDeployment: string;
  owner: string;
  environment: "Production" | "Staging" | "Development";
}

// Generate some fake array data for sparklines
const generateMetricData = (baseValue: number, variance: number, points: number = 24): DataPoint[] => {
  const data: DataPoint[] = [];
  const now = Date.now();
  for (let i = points; i >= 0; i--) {
    data.push({
      timestamp: new Date(now - i * 5 * 60000).toISOString(), // Every 5 mins
      value: Math.max(0, baseValue + (Math.random() * variance * 2 - variance))
    });
  }
  return data;
};

export const MOCK_SYSTEM_HEALTH: SystemModule[] = [
  {
    id: "sys-ai-01",
    name: "AI Services",
    category: "AI",
    status: "Operational",
    healthScore: 99,
    uptime: 99.98,
    lastChecked: new Date().toISOString(),
    latency: 120,
    responseTime: 350,
    cpuUsage: 45,
    memoryUsage: 60,
    queueLength: 12,
    errorRate: 0.01,
    warningCount: 0,
    criticalCount: 0,
    description: "Core LLM routing, embedding generation, and prompt orchestration services.",
    dependencies: [
      { id: "sys-kg-01", name: "Knowledge Graph Engine", type: "downstream", status: "Healthy" },
      { id: "sys-db-02", name: "Vector Database", type: "upstream", status: "Operational" }
    ],
    relatedEntities: [
      { id: "brief-1", type: "Query", title: "Morning Shift Brief Generation" }
    ],
    history: {
      cpu: generateMetricData(45, 10),
      memory: generateMetricData(60, 5),
      latency: generateMetricData(120, 30),
      requests: generateMetricData(50, 20),
      errors: generateMetricData(0, 0.5)
    },
    incidents: [
      { id: "inc-1", type: "Deployment", title: "v2.1 Model Weights Update", description: "Deployed new instruction-tuned weights.", status: "Resolved", timestamp: new Date(Date.now() - 86400000 * 2).toISOString(), resolvedAt: new Date(Date.now() - 86400000 * 2 + 3600000).toISOString() }
    ],
    version: "2.1.4",
    lastDeployment: new Date(Date.now() - 86400000 * 2).toISOString(),
    owner: "AI Platform Team",
    environment: "Production"
  },
  {
    id: "sys-kg-01",
    name: "Knowledge Graph Engine",
    category: "Knowledge",
    status: "Healthy",
    healthScore: 100,
    uptime: 99.99,
    lastChecked: new Date().toISOString(),
    latency: 15,
    responseTime: 45,
    cpuUsage: 30,
    memoryUsage: 85,
    queueLength: 0,
    errorRate: 0,
    warningCount: 0,
    criticalCount: 0,
    description: "Semantic entity extraction and relationship mapping engine powered by Neo4j.",
    dependencies: [
      { id: "sys-ai-01", name: "AI Services", type: "upstream", status: "Operational" },
      { id: "sys-db-01", name: "Neo4j Database", type: "upstream", status: "Healthy" }
    ],
    relatedEntities: [
      { id: "kn-402", type: "KnowledgeGraphNode", title: "Pump P-201 Subgraph" }
    ],
    history: {
      cpu: generateMetricData(30, 5),
      memory: generateMetricData(85, 2),
      latency: generateMetricData(15, 5),
      requests: generateMetricData(200, 50),
      errors: generateMetricData(0, 0)
    },
    incidents: [],
    version: "1.8.0",
    lastDeployment: new Date(Date.now() - 86400000 * 14).toISOString(),
    owner: "Knowledge Engineering",
    environment: "Production"
  },
  {
    id: "sys-doc-01",
    name: "Document Processing",
    category: "Processing",
    status: "Warning",
    healthScore: 82,
    uptime: 99.5,
    lastChecked: new Date().toISOString(),
    latency: 450,
    responseTime: 1200,
    cpuUsage: 88,
    memoryUsage: 92,
    queueLength: 340,
    errorRate: 2.4,
    warningCount: 3,
    criticalCount: 0,
    description: "PDF parsing, OCR pipeline, and chunking service for ingestion.",
    dependencies: [
      { id: "sys-q-01", name: "File Processing Queue", type: "upstream", status: "Warning" },
      { id: "sys-ai-01", name: "AI Services", type: "downstream", status: "Operational" }
    ],
    relatedEntities: [
      { id: "job-102", type: "Job", title: "OISD Global Batch Ingestion" }
    ],
    history: {
      cpu: generateMetricData(88, 10),
      memory: generateMetricData(92, 5),
      latency: generateMetricData(450, 100),
      requests: generateMetricData(10, 5),
      errors: generateMetricData(2.4, 1.5)
    },
    incidents: [
      { id: "inc-2", type: "Incident", title: "High Memory Pressure", description: "OOM risk detected in OCR worker nodes during large PDF batch.", status: "Ongoing", timestamp: new Date(Date.now() - 3600000 * 4).toISOString() }
    ],
    version: "3.0.2",
    lastDeployment: new Date(Date.now() - 86400000 * 5).toISOString(),
    owner: "Data Engineering",
    environment: "Production"
  },
  {
    id: "sys-comp-01",
    name: "Compliance Engine",
    category: "Knowledge",
    status: "Operational",
    healthScore: 96,
    uptime: 99.9,
    lastChecked: new Date().toISOString(),
    latency: 85,
    responseTime: 220,
    cpuUsage: 25,
    memoryUsage: 45,
    queueLength: 0,
    errorRate: 0.1,
    warningCount: 1,
    criticalCount: 0,
    description: "Evaluates operations against ingested OISD, OSHA, and internal SOP standards.",
    dependencies: [
      { id: "sys-kg-01", name: "Knowledge Graph Engine", type: "upstream", status: "Healthy" }
    ],
    relatedEntities: [
      { id: "alt-88", type: "Alert", title: "SOP Conflict Detected" }
    ],
    history: {
      cpu: generateMetricData(25, 8),
      memory: generateMetricData(45, 5),
      latency: generateMetricData(85, 20),
      requests: generateMetricData(30, 15),
      errors: generateMetricData(0.1, 0.2)
    },
    incidents: [],
    version: "1.4.1",
    lastDeployment: new Date(Date.now() - 86400000 * 30).toISOString(),
    owner: "Compliance Tech",
    environment: "Production"
  },
  {
    id: "sys-auth-01",
    name: "Authentication",
    category: "Security",
    status: "Healthy",
    healthScore: 100,
    uptime: 100,
    lastChecked: new Date().toISOString(),
    latency: 12,
    responseTime: 25,
    cpuUsage: 15,
    memoryUsage: 20,
    queueLength: 0,
    errorRate: 0.0,
    warningCount: 0,
    criticalCount: 0,
    description: "OAuth2, SSO, and RBAC token provisioning.",
    dependencies: [],
    relatedEntities: [],
    history: {
      cpu: generateMetricData(15, 2),
      memory: generateMetricData(20, 2),
      latency: generateMetricData(12, 3),
      requests: generateMetricData(150, 40),
      errors: generateMetricData(0, 0)
    },
    incidents: [],
    version: "4.2.0",
    lastDeployment: new Date(Date.now() - 86400000 * 90).toISOString(),
    owner: "Security Ops",
    environment: "Production"
  }
];

// Helper to compute overall system health dynamically based on weighting
export function calculateOverallSystemHealth(services: SystemModule[]): number {
  if (services.length === 0) return 100;
  
  let totalScore = 0;
  services.forEach(service => {
    // We could add criticality weights, but for now we just average their healthScore
    totalScore += service.healthScore;
  });
  
  return Math.round(totalScore / services.length);
}

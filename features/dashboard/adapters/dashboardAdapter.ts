import { AlertsResponseDTO, MortalityResponseDTO } from "../../../types/api/dashboard";
import { DocumentsResponseDTO } from "../../../types/api/documents";
import { AuditLogsResponseDTO } from "../../../types/api/audit";
import { GraphNodeRead } from "../../../types/api/graph";

// Import existing frontend types and mocks
import { DashboardData, DASHBOARD_DATA } from "../../dashboard/constants/dashboardData";
import { AlertData } from "../../dashboard/constants/alerts";
import { DocumentData } from "../../dashboard/constants/recentDocumentsData";

export const dashboardAdapter = {
  adaptDashboardData(
    alertsRes: AlertsResponseDTO | null,
    mortalityRes: MortalityResponseDTO | null,
    documentsRes: DocumentsResponseDTO | null,
    auditRes: AuditLogsResponseDTO | null,
    graphRes: GraphNodeRead[] | null,
    mockAiBrief: any,
    mockQueries: any[]
  ): DashboardData {
    // Clone base mock data so we don't mutate the constant
    const dashboard: DashboardData = JSON.parse(JSON.stringify(DASHBOARD_DATA));

    // --- ALERTS & KPI: Contradictions ---
    if (alertsRes) {
      const backendAlerts = alertsRes.alerts || alertsRes.data?.alerts || [];
      const mappedAlerts: AlertData[] = backendAlerts.map(a => {
        // Map severity carefully
        const s = (a.severity || "").toLowerCase();
        let severity: "Critical" | "High" | "Medium" | "Low" = "Low";
        if (s === "critical") severity = "Critical";
        if (s === "high") severity = "High";
        if (s === "medium" || s === "warning") severity = "Medium";
        
        return {
          ...a, // preserve extra fields
          id: a.id ? (typeof a.id === "string" ? parseInt(a.id, 10) || Math.floor(Math.random() * 1000) : a.id) : Math.floor(Math.random() * 1000),
          title: a.title || "Unknown Alert",
          severity: severity,
          description: a.message || a.description || "",
          asset: (a as any).asset || "General",
          timestamp: (a as any).timestamp || new Date().toISOString(),
          status: (a as any).status || "Active",
        } as AlertData;
      });
      
      dashboard.workspace.proactiveAlerts.alerts = mappedAlerts;
      dashboard.workspace.proactiveAlerts.criticalCount = mappedAlerts.filter(a => a.severity === "Critical").length;

      // Update KPI
      const activeContradictionsKpi = dashboard.kpis.find(k => k.id === "kpi-2");
      if (activeContradictionsKpi) {
        activeContradictionsKpi.value = mappedAlerts.length.toString();
      }
    }

    // --- MORTALITY & KPI: Mortality ---
    if (mortalityRes) {
      const mortalityData = mortalityRes.data || mortalityRes;
      const score = mortalityData.score ?? mortalityData.mortality_score ?? 0;
      
      const mortalityKpi = dashboard.kpis.find(k => k.id === "kpi-4");
      if (mortalityKpi) {
        mortalityKpi.value = `${score}%`;
      }
    }

    // --- RECENT DOCUMENTS ---
    if (documentsRes) {
      const backendDocs = documentsRes.items || (Array.isArray(documentsRes.data) ? documentsRes.data : documentsRes.data?.items) || [];
      const mappedDocs: DocumentData[] = backendDocs.map(d => {
        const isCompleted = (d.status || "").toLowerCase() === "completed";
        return {
          ...d,
          id: d.id,
          title: d.file_name || d.filename || "Untitled Document",
          fileName: d.file_name || d.filename || "document.pdf",
          documentType: (d.classification || "Report") as any,
          asset: "General",
          uploadedBy: "System",
          uploadedAt: d.created_at || new Date().toISOString(),
          lastModified: d.created_at || new Date().toISOString(),
          status: (d.status || "Processed") as any,
          version: "v1.0",
          fileSize: "Unknown",
          pages: 1,
          confidence: Math.round((d.classification_confidence || d.confidence_score || (isCompleted ? 0.95 : 0)) * 100),
          tags: [],
          summary: "",
          keyHighlights: [],
          revisionHistory: [],
          relatedEntities: [],
          complianceReferences: [],
          processingTimeline: (d.processing_events || []).map(evt => ({ timestamp: new Date().toISOString(), action: evt })),
          aiInsights: [],
          suggestedActions: [],
          owner: "System",
          department: "General",
          approvalStatus: "Approved"
        };
      });

      dashboard.bottomRow.recentDocuments.documents = mappedDocs;
      
      const docsKpi = dashboard.kpis.find(k => k.id === "kpi-5");
      if (docsKpi) {
        docsKpi.value = mappedDocs.length.toString();
      }
    }

    // --- SYSTEM HEALTH (Audit Logs) ---
    if (auditRes) {
      const backendLogs = auditRes.items || auditRes.data?.items || [];
      if (backendLogs.length > 0) {
        // Find existing health modules to preserve structure, or create defaults
        dashboard.bottomRow.systemHealth.services = backendLogs.slice(0, 4).map((log, index) => {
          const defaultModule = DASHBOARD_DATA.bottomRow.systemHealth.services[index] || DASHBOARD_DATA.bottomRow.systemHealth.services[0];
          return {
            ...defaultModule,
            id: log.id || `sys-${index}`,
            name: log.action || "System Process",
            status: "Operational",
            lastChecked: log.created_at,
          };
        });
      }
    }

    // --- KNOWLEDGE GRAPH OVERVIEW ---
    if (graphRes) {
      // The Graph preview loads nodes dynamically right now, but if it required them here we would pass them.
    }

    // --- MOCKED FALLBACKS ---
    if (mockAiBrief) {
      dashboard.workspace.aiDecisionBrief.currentBrief = mockAiBrief;
    }
    
    if (mockQueries) {
      dashboard.bottomRow.recentQueries.queries = mockQueries;
    }

    return dashboard;
  }
};

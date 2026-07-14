import { ReportRead } from "@/types/api/reports";
import { IntelligenceReport, ReportVersion } from "../constants/reportsData";

export const reportAdapter = {
  adaptReportList(backendReports: ReportRead[]): IntelligenceReport[] {
    return backendReports.map(this.adaptReport);
  },

  adaptReport(backendReport: ReportRead): IntelligenceReport {
    // Map backend status to frontend status
    let status: IntelligenceReport["status"] = "Draft";
    const rawStatus = (backendReport.status || "").toLowerCase();
    if (rawStatus === "completed" || rawStatus === "published") status = "Published";
    else if (rawStatus === "queued") status = "queued";
    else if (rawStatus === "processing") status = "processing";
    else if (rawStatus === "failed") status = "failed";
    else if (rawStatus === "cancelled") status = "cancelled";

    // Placeholder data for complex visual blocks because backend does not currently provide them.
    // We explicitly avoid faking business intelligence. We provide safe visual defaults.
    
    const defaultHistory: ReportVersion[] = [
      {
        version: "v1.0",
        generatedDate: backendReport.created_at,
        generatedBy: backendReport.created_by_id || "System",
        reviewedBy: "System",
        approvedBy: "System",
        changesSinceLast: "Initial Generation"
      }
    ];

    return {
      id: backendReport.id,
      title: backendReport.title,
      reportType: (backendReport.report_type || "Cross-functional Intelligence Report") as any,
      category: "Operations",
      status: status,
      generatedBy: backendReport.created_by_id || "System",
      generatedAt: backendReport.created_at,
      timeRange: "Custom",
      department: "General Operations",
      
      // Placeholders strictly typed without faking intelligence:
      confidence: {
        aiConfidence: 0,
        evidenceConfidence: 0,
        knowledgeCoverage: 0,
        dataFreshness: 0,
        reasoningConfidence: 0
      },
      narrative: {
        whatHappened: "Detailed narrative currently unavailable from backend.",
        whyItHappened: "Causal analysis pending.",
        operationalImpact: "Impact assessment pending.",
        whatNext: "Action items pending.",
        costOfInaction: "Risk assessment pending."
      },
      findings: [],
      charts: [],
      evidence: [],
      affectedAssets: [],
      decisionPanel: {
        immediateActions: [],
        shortTermActions: [],
        longTermImprovements: [],
        escalationRequired: false
      },
      knowledgeInsights: [],
      history: defaultHistory,
      
      // Preserved Backend Provenance
      backendMetadata: {
        backendId: backendReport.id,
        originalPayload: backendReport,
        endpointOrigin: "/api/v1/reports",
        fetchedAt: new Date().toISOString(),
        adapterVersion: "1.0.0"
      }
    };
  }
};

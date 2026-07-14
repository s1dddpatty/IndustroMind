import { reportRepository } from "../repositories/reportRepository";
import { reportAdapter } from "../adapters/reportAdapter";
import { IntelligenceReport, MOCK_INTELLIGENCE_REPORTS } from "../constants/reportsData";
import { ReportCreate } from "@/types/api/reports";
import { APP_MODE, getDemoLatency } from "@/features/shared/config/appMode";

let cachedReports: IntelligenceReport[] | null = null;
let cachedTotal: number = 0;

export const reportService = {
  /**
   * Fetches the report list. Uses cache if available.
   */
  async getReports(forceRefresh = false, page = 1, pageSize = 50, signal?: AbortSignal) {
    if (!forceRefresh && cachedReports !== null) {
      return { reports: cachedReports, total: cachedTotal };
    }

    if (APP_MODE === "DEMO") {
      await getDemoLatency();
      cachedReports = [...MOCK_INTELLIGENCE_REPORTS];
      cachedTotal = MOCK_INTELLIGENCE_REPORTS.length;
      return { reports: cachedReports, total: cachedTotal };
    }

    try {
      const res = await reportRepository.listReports(page, pageSize, undefined, signal);
      const adapted = reportAdapter.adaptReportList(res.data); // data is T[]
      
      // Sort so newest is first (backend should do this, but just in case)
      adapted.sort((a, b) => new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime());
      
      cachedReports = adapted;
      cachedTotal = res.pagination?.total || adapted.length;
      
      return { reports: cachedReports, total: cachedTotal };
    } catch (error) {
      if (APP_MODE === "AUTO") {
        console.warn("Backend unreachable, falling back to DEMO mode for reports.");
        cachedReports = [...MOCK_INTELLIGENCE_REPORTS];
        cachedTotal = MOCK_INTELLIGENCE_REPORTS.length;
        return { reports: cachedReports, total: cachedTotal };
      }
      throw error;
    }
  },

  /**
   * Generates a new report. It detects if the backend returns a synchronous completion
   * or a queued job, mapping it accordingly via the Adapter.
   * Incremental Cache Update: Appends the new report without wiping existing cache.
   */
  async generateReport(title: string, reportType: string, signal?: AbortSignal) {
    if (APP_MODE === "DEMO") {
      await getDemoLatency(800, 1500);
      const mockReport: any = {
        id: `rep-${Date.now()}`,
        title,
        reportType: reportType as any,
        status: "Published",
        generatedAt: new Date().toISOString(),
        generatedBy: "Demo User",
      };
      if (cachedReports) {
        cachedReports = [mockReport, ...cachedReports];
        cachedTotal += 1;
      }
      return mockReport;
    }

    try {
      const payload: ReportCreate = {
        title,
        report_type: reportType,
        format: "pdf",
        parameters: {}
      };

      const res = await reportRepository.createReport(payload, signal);
      const newReport = reportAdapter.adaptReport(res.data);
      
      // Fallback detection: if backend returns 'Draft' but it's a creation response,
      // we assume it's queued for processing.
      if (newReport.status === "Draft") {
        newReport.status = "queued";
      }

      // Safely incrementally update cache
      if (cachedReports) {
        cachedReports = [newReport, ...cachedReports];
        cachedTotal += 1;
      }

      return newReport;
    } catch (error) {
      if (APP_MODE === "AUTO") {
        console.warn("Backend unreachable, simulating DEMO mode report generation.");
        const mockReport: any = {
          id: `rep-${Date.now()}`,
          title,
          reportType: reportType as any,
          status: "Published",
          generatedAt: new Date().toISOString(),
          generatedBy: "Demo User",
        };
        if (cachedReports) {
          cachedReports = [mockReport, ...cachedReports];
          cachedTotal += 1;
        }
        return mockReport;
      }
      throw error;
    }
  },

  /**
   * Refreshes a single report's status via polling, updating it in the cache incrementally.
   */
  async refreshReportStatus(reportId: string, signal?: AbortSignal) {
    if (APP_MODE === "DEMO") {
      await getDemoLatency(200, 400);
      return cachedReports?.find(r => r.id === reportId);
    }
    try {
      const res = await reportRepository.getReport(reportId, signal);
      const updatedReport = reportAdapter.adaptReport(res.data);
      
      if (cachedReports) {
        cachedReports = cachedReports.map(r => r.id === reportId ? updatedReport : r);
      }
      
      return updatedReport;
    } catch (error) {
      if (APP_MODE === "AUTO") {
        return cachedReports?.find(r => r.id === reportId);
      }
      throw error;
    }
  },

  /**
   * Manually invalidate the full cache
   */
  clearCache() {
    cachedReports = null;
    cachedTotal = 0;
  }
};

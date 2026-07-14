import { apiClient } from "@/lib/api/client";
import { ReportRead, ReportCreate } from "@/types/api/reports";
import { PaginatedResponse, ApiResponse } from "@/types/api/common";

export const reportRepository = {
  async listReports(page: number = 1, pageSize: number = 20, reportType?: string, signal?: AbortSignal): Promise<PaginatedResponse<ReportRead>> {
    const params: Record<string, any> = { page, page_size: pageSize };
    if (reportType) params.report_type = reportType;
    
    const response = await apiClient.get<PaginatedResponse<ReportRead>>("/api/v1/reports/", { 
      params,
      signal 
    });
    return response.data;
  },

  async getReport(reportId: string, signal?: AbortSignal): Promise<ApiResponse<ReportRead>> {
    const response = await apiClient.get<ApiResponse<ReportRead>>(`/api/v1/reports/${reportId}`, { signal });
    return response.data;
  },

  async createReport(payload: ReportCreate, signal?: AbortSignal): Promise<ApiResponse<ReportRead>> {
    const response = await apiClient.post<ApiResponse<ReportRead>>("/api/v1/reports/", payload, { signal });
    return response.data;
  }
};

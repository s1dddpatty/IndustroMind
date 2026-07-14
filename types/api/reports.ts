import { PaginatedResponse, ApiResponse } from "./common";

export interface ReportRead {
  id: string;
  title: string;
  report_type: string;
  format: string;
  status: string;
  parameters?: string | null;
  file_path?: string | null;
  error_message?: string | null;
  organization_id: string;
  created_by_id?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ReportCreate {
  title: string;
  report_type: string;
  format?: string;
  parameters?: Record<string, any> | null;
}

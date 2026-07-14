import { useState, useEffect, useCallback } from "react";
import { reportService } from "../services/reportService";
import { IntelligenceReport, REPORT_STATS } from "../constants/reportsData";
import { usePolling } from "@/lib/hooks/usePolling";

export function useReports() {
  const [reports, setReports] = useState<IntelligenceReport[]>([]);
  const [stats, setStats] = useState(REPORT_STATS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Check if any reports are actively generating
  const generatingReports = reports.filter(r => r.status === "queued" || r.status === "processing");
  const isPolling = generatingReports.length > 0;

  const fetchReports = useCallback(async (forceRefresh = false) => {
    try {
      if (forceRefresh) setLoading(true);
      const data = await reportService.getReports(forceRefresh);
      setReports([...data.reports]); // new array reference to trigger re-render
      
      // Update stats based on real data
      setStats({
        ...REPORT_STATS,
        generatedToday: data.reports.length,
        scheduledReports: 0,
        pendingApproval: data.reports.filter(r => r.status === "Pending Approval").length,
        criticalReports: 0,
        aiGeneratedBriefs: data.reports.length,
      });
      setError(null);
    } catch (err: any) {
      setError(err);
      console.error("Failed to fetch reports:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial Load
  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  // Use the platform-wide polling hook
  usePolling(async (signal) => {
    if (generatingReports.length === 0) return;
    
    // Refresh only the reports that are currently generating
    const promises = generatingReports.map(r => 
      reportService.refreshReportStatus(r.id, signal)
    );
    
    await Promise.allSettled(promises);
    
    // Sync React state with the updated cache
    const updatedData = await reportService.getReports(false);
    setReports([...updatedData.reports]);
    
  }, { 
    enabled: isPolling, 
    interval: 3000 
  });

  const generateReport = async (title: string, reportType: string) => {
    try {
      // Create it via backend
      const newReport = await reportService.generateReport(title, reportType);
      
      // Resync state from cache (which now has the appended new report)
      const data = await reportService.getReports(false);
      setReports([...data.reports]);
      
      return newReport;
    } catch (err: any) {
      console.error("Failed to generate report:", err);
      throw err;
    }
  };

  return {
    reports,
    stats,
    loading,
    error,
    refresh: () => fetchReports(true),
    generateReport
  };
}

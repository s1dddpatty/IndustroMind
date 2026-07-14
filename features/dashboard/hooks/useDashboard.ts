import { useState, useEffect, useCallback } from "react";
import { DashboardData } from "../constants/dashboardData";
import { dashboardService } from "../services/dashboardService";

export function useDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const liveData = await dashboardService.getDashboardData();
      setData(liveData);
    } catch (err) {
      console.error("Dashboard failed to load entirely", err);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    data,
    isLoading,
    error,
    refresh: fetchDashboardData
  };
}

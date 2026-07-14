import { useState, useCallback, useEffect, useRef } from "react";
import { integrityService, IntegrityData } from "../services/integrityService";
import { ComplianceRule, COMPLIANCE_STATS } from "../constants/complianceData";

export function useIntegrity() {
  const [data, setData] = useState<IntegrityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchIntegrityData = useCallback(async (forceRefresh = false) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      if (forceRefresh || !data) {
        setLoading(true);
      }
      setError(null);
      
      const result = await integrityService.fetchIntegrityData(forceRefresh, abortControllerRef.current.signal);
      setData(result);
    } catch (err: any) {
      if (err.name === 'CanceledError' || err.name === 'AbortError') return;
      setError(err instanceof Error ? err : new Error(String(err)));
      console.error("Failed to fetch knowledge integrity data:", err);
    } finally {
      setLoading(false);
    }
  }, [data]);

  useEffect(() => {
    fetchIntegrityData();
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchIntegrityData]);

  const runScan = useCallback(async () => {
    try {
      setLoading(true);
      await integrityService.runScan("demo-org"); // Hardcoded for now
      // Re-fetch data which is now guaranteed to miss the cache
      await fetchIntegrityData(true);
    } catch (err: any) {
      setError(err instanceof Error ? err : new Error(String(err)));
      console.error("Failed to run integrity scan:", err);
      setLoading(false);
    }
  }, [fetchIntegrityData]);

  return {
    rules: data?.rules || [],
    stats: data?.stats || COMPLIANCE_STATS,
    loading,
    error,
    refresh: () => fetchIntegrityData(true),
    runScan
  };
}

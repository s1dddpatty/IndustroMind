import { useEffect, useRef, useCallback } from "react";

interface UsePollingOptions {
  interval?: number;
  enabled?: boolean;
}

/**
 * Reusable polling hook for long-running backend workflows.
 * Ensures no overlapping requests, prevents duplicate instances,
 * and automatically stops when unmounted or disabled.
 * 
 * Includes intelligent optimizations:
 * - Pauses when the browser tab is hidden
 * - Resumes automatically when tab becomes active
 * - Aborts outstanding requests on unmount via AbortSignal
 */
export function usePolling(
  callback: (signal: AbortSignal) => Promise<void>,
  options: UsePollingOptions = {}
) {
  const { interval = 3000, enabled = false } = options;
  const isPollingRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const poll = useCallback(async () => {
    // Prevent overlapping requests or disabled polling
    if (isPollingRef.current || !enabled) return;
    
    // Pause polling if the tab is hidden (saves backend traffic)
    if (typeof document !== 'undefined' && document.visibilityState === 'hidden') {
      timeoutRef.current = setTimeout(poll, interval);
      return;
    }
    
    isPollingRef.current = true;
    abortControllerRef.current = new AbortController();
    
    try {
      await callback(abortControllerRef.current.signal);
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error("Polling callback failed:", error);
      }
    } finally {
      isPollingRef.current = false;
      // Schedule next poll if still enabled
      if (enabled) {
        timeoutRef.current = setTimeout(poll, interval);
      }
    }
  }, [callback, enabled, interval]);

  useEffect(() => {
    if (enabled) {
      poll();
    }
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      isPollingRef.current = false;
    };
  }, [enabled, poll]);
  
  // Re-trigger polling if tab becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && enabled && !isPollingRef.current) {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        poll();
      }
    };
    
    if (typeof document !== 'undefined') {
      document.addEventListener("visibilitychange", handleVisibilityChange);
      return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
    }
  }, [enabled, poll]);
}

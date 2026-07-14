import { useState, useCallback, useEffect, useRef } from "react";
import { KgData, KgNode } from "../constants/graphData";
import { graphService } from "../services/graphService";

export function useKnowledgeGraph() {
  const [graphData, setGraphData] = useState<KgData | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchGraphData = useCallback(async (silent = false) => {
    if (!silent) setIsLoading(true);
    setError(null);
    
    // Prevent duplicate concurrent requests by aborting previous if still pending
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      const data = await graphService.fetchGraph(silent ? false : true, abortControllerRef.current.signal);
      setGraphData(data);
    } catch (err: any) {
      if (err.name === 'CanceledError' || err.name === 'AbortError') return;
      console.error("Failed to load Knowledge Graph", err);
      if (!silent) setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      if (!silent) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGraphData();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchGraphData]);

  const selectedNode = selectedNodeId && graphData 
    ? graphData.nodes.find(n => n.id === selectedNodeId) || null 
    : null;

  return {
    graph: graphData,
    selectedNode,
    stats: graphData?.analytics || null,
    loading: isLoading,
    error,
    refresh: () => fetchGraphData(true), // forceRefresh=true
    selectNode: (id: string | null) => setSelectedNodeId(id)
  };
}

import { useState, useCallback, useMemo, useEffect } from "react";
import { DocumentData } from "../../dashboard/constants/recentDocumentsData";
import { documentService } from "../services/documentService";
import { graphService } from "@/features/knowledge-graph/services/graphService";
import { usePolling } from "../../../lib/hooks/usePolling";

export function useDocuments() {
  const [documents, setDocuments] = useState<DocumentData[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchDocuments = useCallback(async (silent = false, signal?: AbortSignal) => {
    if (!silent) setIsLoading(true);
    setError(null);
    try {
      const liveData = await documentService.fetchDocuments(signal);
      setDocuments(liveData);
    } catch (err: any) {
      if (err.name === 'CanceledError' || err.name === 'AbortError') return;
      console.error("Failed to load documents", err);
      if (!silent) setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      if (!silent) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);


  const uploadDocument = useCallback(async (file: File) => {
    setIsUploading(true);
    setError(null);
    try {
      await documentService.uploadDocument(file);
      graphService.clearCache();
      if (typeof window !== "undefined") window.dispatchEvent(new Event("documentsUpdated"));
      await fetchDocuments(true); // silent refresh
    } catch (err) {
      console.error("Upload failed", err);
      throw err;
    } finally {
      setIsUploading(false);
    }
  }, [fetchDocuments]);

  const deleteDocument = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      await documentService.deleteDocument(id);
      graphService.clearCache();
      if (typeof window !== "undefined") window.dispatchEvent(new Event("documentsUpdated"));
      await fetchDocuments(false);
    } catch (err) {
      console.error("Delete failed", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [fetchDocuments]);

  const clearAllDocuments = useCallback(async () => {
    setIsLoading(true);
    try {
      await documentService.clearAllDocuments();
      graphService.clearCache();
      if (typeof window !== "undefined") window.dispatchEvent(new Event("documentsUpdated"));
      await fetchDocuments(false);
    } catch (err) {
      console.error("Clear all failed", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [fetchDocuments]);

  // Determine if any document is processing
  const hasProcessingDocs = useMemo(() => {
    if (!documents) return false;
    return documents.some(d => {
      const status = d.status.toLowerCase();
      return ["processing", "pending", "queued", "ocr", "classifying"].includes(status);
    });
  }, [documents]);

  // Activate polling if there are processing docs
  usePolling((signal) => fetchDocuments(true, signal), {
    enabled: hasProcessingDocs,
    interval: 3000
  });

  return {
    documents,
    isLoading,
    isUploading,
    error,
    refresh: () => fetchDocuments(false),
    uploadDocument,
    deleteDocument,
    clearAllDocuments
  };
}

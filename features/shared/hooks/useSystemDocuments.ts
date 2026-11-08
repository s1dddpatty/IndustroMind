"use client";

import { useState, useEffect, useCallback } from "react";
import { documentRepository } from "@/features/documents/repositories/documentRepository";

export function useSystemDocuments() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDocs = useCallback(() => {
    let isMounted = true;
    documentRepository.getDocuments()
      .then((res: any) => {
        if (!isMounted) return;
        const items = res?.items || (Array.isArray(res?.data) ? res.data : (res?.data as any)?.items || (res?.data as any)?.documents) || [];
        setDocuments(items);
      })
      .catch((err) => {
        if (!isMounted) return;
        setDocuments([]);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    const cleanup = fetchDocs();
    const handleUpdate = () => {
      fetchDocs();
    };
    window.addEventListener("documentsUpdated", handleUpdate);
    return () => {
      cleanup?.();
      window.removeEventListener("documentsUpdated", handleUpdate);
    };
  }, [fetchDocs]);

  return {
    hasDocuments: documents.length > 0,
    documents,
    count: documents.length,
    isLoading
  };
}


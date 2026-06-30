"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { DocumentsWorkspace } from "@/features/dashboard/components/DocumentsWorkspace";
import { DocumentDetailWorkspace } from "@/features/dashboard/components/DocumentDetailWorkspace";
import { DocumentUploadExperience } from "@/features/dashboard/components/DocumentUploadExperience";
import { DASHBOARD_DATA } from "@/features/dashboard/constants/dashboardData";

export type DocumentView = "list" | "detail" | "upload";

export function DocumentsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [view, setView] = useState<DocumentView>("list");
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);

  useEffect(() => {
    if (searchParams.get("action") === "upload") {
      setView("upload");
    }
  }, [searchParams]);

  return (
    <div className="flex-1 min-h-0 w-full relative flex flex-col">
      <AnimatePresence mode="wait">
        {view === "list" && (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 12, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.99 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="flex-1 min-h-0 flex flex-col overflow-y-auto overflow-x-hidden hide-scrollbar"
          >
            <DocumentsWorkspace
              data={DASHBOARD_DATA.bottomRow.recentDocuments.documents}
              onBack={() => router.push("/demo")}
              onSelectDocument={(id) => {
                setSelectedDocumentId(id);
                setView("detail");
              }}
              onUpload={() => setView("upload")}
            />
          </motion.div>
        )}

        {view === "detail" && selectedDocumentId && (
          <motion.div
            key="detail"
            initial={{ opacity: 0, y: 12, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.99 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="flex-1 min-h-0 flex flex-col overflow-y-auto overflow-x-hidden hide-scrollbar"
          >
            <DocumentDetailWorkspace
              documentId={selectedDocumentId}
              documents={DASHBOARD_DATA.bottomRow.recentDocuments.documents}
              onBack={() => setView("list")}
            />
          </motion.div>
        )}

        {view === "upload" && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 12, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.99 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="flex-1 min-h-0 flex flex-col overflow-y-auto overflow-x-hidden hide-scrollbar"
          >
            <DocumentUploadExperience
              onComplete={() => setView("list")}
              onCancel={() => {
                if (searchParams.get("action") === "upload") {
                  router.push("/demo");
                } else {
                  setView("list");
                }
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

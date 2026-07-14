"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { DocumentsWorkspace } from "@/features/dashboard/components/DocumentsWorkspace";
import { DocumentDetailWorkspace } from "@/features/dashboard/components/DocumentDetailWorkspace";
import { DocumentUploadExperience } from "@/features/dashboard/components/DocumentUploadExperience";
import { useDocuments } from "../hooks/useDocuments";
import { Loader2 } from "lucide-react";
import { Skeleton } from "@/features/shared/components/ui/Skeleton";
import { useToast } from "@/features/shared/components/ui/ToastProvider";

export type DocumentView = "list" | "detail" | "upload";

export function DocumentsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  const { documents, isLoading, isUploading, uploadDocument } = useDocuments();
  
  const [view, setView] = useState<DocumentView>("list");
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);
  const [pendingUploadFile, setPendingUploadFile] = useState<File | null>(null);

  useEffect(() => {
    if (searchParams.get("action") === "upload") {
      setView("upload");
    }
  }, [searchParams]);

  return (
    <div className="flex-1 min-h-0 w-full relative flex flex-col">
      <AnimatePresence mode="wait">
        {isLoading && !documents ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col w-full h-full pb-8 p-4"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Skeleton className="w-11 h-11" rounded="xl" />
                <div>
                  <Skeleton className="w-48 h-8 mb-1" rounded="md" />
                  <Skeleton className="w-64 h-4" rounded="md" />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Skeleton className="h-[88px]" rounded="xl" />
              <Skeleton className="h-[88px]" rounded="xl" />
              <Skeleton className="h-[88px]" rounded="xl" />
              <Skeleton className="h-[88px]" rounded="xl" />
            </div>
            <div className="flex-1 rounded-2xl bg-slate-900/40 border border-slate-800/50 p-4 flex flex-col gap-4">
              <Skeleton className="w-full h-12" rounded="md" />
              <Skeleton className="w-full h-16" rounded="md" />
              <Skeleton className="w-full h-16" rounded="md" />
              <Skeleton className="w-full h-16" rounded="md" />
            </div>
          </motion.div>
        ) : view === "list" && (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 12, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.99 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="flex-1 min-h-0 flex flex-col overflow-y-auto overflow-x-hidden hide-scrollbar"
          >
            <DocumentsWorkspace
              data={documents || []}
              onBack={() => router.push("/demo")}
              onSelectDocument={(id) => {
                setSelectedDocumentId(id);
                setView("detail");
              }}
              onUpload={(file) => {
                setPendingUploadFile(file);
                setView("upload");
                // The actual upload will be triggered by DocumentUploadExperience or here.
                // We'll trigger it concurrently so the UI animation runs while backend processes.
                uploadDocument(file).catch(err => {
                  console.error("Upload failed in page", err);
                });
              }}
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
              documents={documents || []}
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
              onComplete={() => {
                setView("list");
                setPendingUploadFile(null);
              }}
              onCancel={() => {
                setPendingUploadFile(null);
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

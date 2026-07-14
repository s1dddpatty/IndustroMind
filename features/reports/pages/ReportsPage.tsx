"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ReportListWorkspace } from "@/features/reports/components/ReportListWorkspace";
import { ReportDetailWorkspace } from "@/features/reports/components/ReportDetailWorkspace";
import { ReportGenerationWorkspace } from "@/features/reports/components/ReportGenerationWorkspace";
import { useReports } from "../hooks/useReports";
import { Loader2, FileBarChart } from "lucide-react";
import { Skeleton } from "@/features/shared/components/ui/Skeleton";
import { EmptyState } from "@/features/shared/components/ui/EmptyState";
import { useToast } from "@/features/shared/components/ui/ToastProvider";

export type ReportView = "list" | "generation" | "detail";

export function ReportsPage() {
  const [view, setView] = useState<ReportView>("list");
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  const { reports, stats, loading, generateReport } = useReports();

  const { toast } = useToast();

  const handleSelectReport = (id: string) => {
    setSelectedReportId(id);
    setView("detail");
  };

  const handleBackToList = () => {
    setView("list");
  };

  const handleGenerateReport = async () => {
    // Generate a default report. In a real scenario, this would come from a form.
    try {
      toast("info", "Generating report...");
      const newReport = await generateReport("Comprehensive Plant Operations Report", "Cross-functional Intelligence Report");
      setSelectedReportId(newReport.id);
      
      // If it's synchronously completed, jump straight to detail.
      if (newReport.status === "Published" || newReport.status === "completed") {
        toast("success", "Report generated successfully");
        setView("detail");
      } else {
        // Otherwise, it's queued or processing, so show generation screen
        setView("generation");
      }
    } catch (e: any) {
      console.error(e);
      toast("error", e.message || "Failed to generate report");
    }
  };

  const handleGenerationComplete = (id: string) => {
    setSelectedReportId(id);
    setView("detail");
  };

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
            {loading && reports.length === 0 ? (
              <div className="flex flex-col w-full h-full pb-8">
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
              </div>
            ) : (
              <ReportListWorkspace 
                reports={reports}
                stats={stats}
                loading={loading}
                onSelectReport={handleSelectReport} 
                onGenerateReport={handleGenerateReport} 
              />
            )}
          </motion.div>
        )}

        {view === "generation" && (
          <motion.div
            key="generation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex-1 min-h-0 flex flex-col overflow-y-auto overflow-x-hidden hide-scrollbar"
          >
            <ReportGenerationWorkspace 
              reportId={selectedReportId!}
              reports={reports}
              onComplete={() => setView("detail")} 
            />
          </motion.div>
        )}

        {view === "detail" && selectedReportId && (
          <motion.div
            key="detail"
            initial={{ opacity: 0, y: 12, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.99 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="flex-1 min-h-0 flex flex-col overflow-y-auto overflow-x-hidden hide-scrollbar"
          >
            <ReportDetailWorkspace 
              reportId={selectedReportId} 
              reports={reports}
              onBack={handleBackToList} 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

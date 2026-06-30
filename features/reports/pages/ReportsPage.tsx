"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ReportListWorkspace } from "@/features/reports/components/ReportListWorkspace";
import { ReportDetailWorkspace } from "@/features/reports/components/ReportDetailWorkspace";
import { ReportGenerationWorkspace } from "@/features/reports/components/ReportGenerationWorkspace";

export type ReportView = "list" | "generation" | "detail";

export function ReportsPage() {
  const [view, setView] = useState<ReportView>("list");
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  const handleSelectReport = (id: string) => {
    setSelectedReportId(id);
    setView("detail");
  };

  const handleBackToList = () => {
    setView("list");
  };

  const handleGenerateReport = () => {
    setView("generation");
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
            <ReportListWorkspace 
              onSelectReport={handleSelectReport} 
              onGenerateReport={handleGenerateReport} 
            />
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
            <ReportGenerationWorkspace onComplete={() => handleGenerationComplete("rep-001")} />
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
            <ReportDetailWorkspace reportId={selectedReportId} onBack={handleBackToList} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

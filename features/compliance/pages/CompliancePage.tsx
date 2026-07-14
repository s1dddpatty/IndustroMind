"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ComplianceListWorkspace } from "@/features/compliance/components/ComplianceListWorkspace";
import { ComplianceDetailWorkspace } from "@/features/compliance/components/ComplianceDetailWorkspace";
import { useIntegrity } from "../hooks/useIntegrity";
import { Loader2 } from "lucide-react";
import { Skeleton } from "@/features/shared/components/ui/Skeleton";
import { useToast } from "@/features/shared/components/ui/ToastProvider";

export type ComplianceView = "list" | "detail";

export function CompliancePage() {
  const [view, setView] = useState<ComplianceView>("list");
  const [selectedRuleId, setSelectedRuleId] = useState<string | null>(null);
  const { toast } = useToast();
  
  const { rules, stats, loading, runScan } = useIntegrity();

  const handleRunScan = async () => {
    try {
      toast("info", "Starting compliance scan...");
      await runScan();
      toast("success", "Scan completed successfully");
    } catch (e: any) {
      toast("error", "Scan failed", e.message);
    }
  };

  const handleSelectRule = (id: string) => {
    setSelectedRuleId(id);
    setView("detail");
  };

  const handleBackToList = () => {
    setView("list");
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
            {loading && rules.length === 0 ? (
              <div className="flex flex-col w-full h-full pb-8 p-4">
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
              <ComplianceListWorkspace 
                rules={rules}
                stats={stats}
                loading={loading}
                onSelectRule={handleSelectRule} 
                onRunScan={handleRunScan}
              />
            )}
          </motion.div>
        )}

        {view === "detail" && selectedRuleId && (
          <motion.div
            key="detail"
            initial={{ opacity: 0, y: 12, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.99 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="flex-1 min-h-0 flex flex-col overflow-y-auto overflow-x-hidden hide-scrollbar"
          >
            <ComplianceDetailWorkspace 
              ruleId={selectedRuleId} 
              rules={rules}
              onBack={handleBackToList} 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

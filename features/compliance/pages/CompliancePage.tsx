"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ComplianceListWorkspace } from "@/features/compliance/components/ComplianceListWorkspace";
import { ComplianceDetailWorkspace } from "@/features/compliance/components/ComplianceDetailWorkspace";

export type ComplianceView = "list" | "detail";

export function CompliancePage() {
  const [view, setView] = useState<ComplianceView>("list");
  const [selectedRuleId, setSelectedRuleId] = useState<string | null>(null);

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
            <ComplianceListWorkspace onSelectRule={handleSelectRule} />
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
            <ComplianceDetailWorkspace ruleId={selectedRuleId} onBack={handleBackToList} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

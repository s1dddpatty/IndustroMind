"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExpertKnowledgeListWorkspace } from "@/features/expert-knowledge/components/ExpertKnowledgeListWorkspace";
import { ExpertKnowledgeDetailWorkspace } from "@/features/expert-knowledge/components/ExpertKnowledgeDetailWorkspace";

export type ExpertKnowledgeView = "list" | "detail";

export function ExpertKnowledgePage() {
  const [view, setView] = useState<ExpertKnowledgeView>("list");
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);

  const handleSelectArticle = (id: string) => {
    setSelectedArticleId(id);
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
            <ExpertKnowledgeListWorkspace onSelectArticle={handleSelectArticle} />
          </motion.div>
        )}

        {view === "detail" && selectedArticleId && (
          <motion.div
            key="detail"
            initial={{ opacity: 0, y: 12, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.99 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="flex-1 min-h-0 flex flex-col overflow-y-auto overflow-x-hidden hide-scrollbar"
          >
            <ExpertKnowledgeDetailWorkspace articleId={selectedArticleId} onBack={handleBackToList} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

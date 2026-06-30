"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AssetListWorkspace } from "@/features/assets/components/AssetListWorkspace";
import { AssetDetailWorkspace } from "@/features/assets/components/AssetDetailWorkspace";

export type AssetView = "list" | "detail";

export function AssetsPage() {
  const [view, setView] = useState<AssetView>("list");
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);

  const handleSelectAsset = (id: string) => {
    setSelectedAssetId(id);
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
            <AssetListWorkspace onSelectAsset={handleSelectAsset} />
          </motion.div>
        )}

        {view === "detail" && selectedAssetId && (
          <motion.div
            key="detail"
            initial={{ opacity: 0, y: 12, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.99 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="flex-1 min-h-0 flex flex-col overflow-y-auto overflow-x-hidden hide-scrollbar"
          >
            <AssetDetailWorkspace assetId={selectedAssetId} onBack={handleBackToList} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

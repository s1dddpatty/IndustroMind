"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useKnowledgeGraph } from "../hooks/useKnowledgeGraph";
import { KnowledgeAnalyticsRow } from "../components/KnowledgeAnalyticsRow";
import { GraphFiltersPanel } from "../components/GraphFiltersPanel";
import { GraphCanvas } from "../components/GraphCanvas";
import { NodeDetailPanel } from "../components/NodeDetailPanel";
import { useTheme } from "@/hooks/useTheme";
import { DESIGN_TOKENS } from "@/constants/design";
import { Skeleton } from "@/features/shared/components/ui/Skeleton";
import { ErrorState } from "@/features/shared/components/ui/ErrorState";

export function KnowledgeGraphPage() {
  const { theme } = useTheme();
  const tokens = DESIGN_TOKENS[theme];
  const { graph, selectedNode, stats, loading, error, refresh, selectNode } = useKnowledgeGraph();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeNodeTypes, setActiveNodeTypes] = useState<Set<string>>(new Set());
  const [activeRelTypes, setActiveRelTypes] = useState<Set<string>>(new Set());

  // Initialize filters once data is loaded
  useEffect(() => {
    if (graph) {
      setActiveNodeTypes(new Set(Array.from(new Set(graph.nodes.map(n => n.category)))));
      setActiveRelTypes(new Set(Array.from(new Set(graph.edges.map(e => e.relationship)))));
    }
  }, [graph]);

  const toggleNodeType = (id: string) => {
    const next = new Set(activeNodeTypes);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setActiveNodeTypes(next);
    
    if (selectedNode) {
      if (next.has(selectedNode.category) === false) {
        selectNode(null);
      }
    }
  };

  const toggleRelType = (id: string) => {
    const next = new Set(activeRelTypes);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setActiveRelTypes(next);
  };

  const filteredNodes = useMemo(() => {
    if (!graph) return [];
    return graph.nodes.filter(n => activeNodeTypes.has(n.category));
  }, [graph, activeNodeTypes]);

  const filteredEdges = useMemo(() => {
    if (!graph) return [];
    return graph.edges.filter(e => {
      const sourceId = typeof e.source === 'object' ? (e.source as any).id : e.source;
      const targetId = typeof e.target === 'object' ? (e.target as any).id : e.target;
      
      const isSourceVisible = filteredNodes.some(n => n.id === sourceId);
      const isTargetVisible = filteredNodes.some(n => n.id === targetId);
      
      return isSourceVisible && isTargetVisible && activeRelTypes.has(e.relationship);
    });
  }, [graph, activeRelTypes, filteredNodes]);

  return (
    <div className="flex flex-col w-full h-full min-h-0">
      <div className="shrink-0 mb-4">
        {stats && (
          <KnowledgeAnalyticsRow analytics={stats} />
        )}
      </div>

      <div className={`flex-1 min-h-0 flex bg-slate-950 rounded-2xl border ${tokens.card.border} overflow-hidden shadow-2xl relative`}>
        
        <GraphFiltersPanel 
          searchQuery={searchQuery} 
          onSearch={setSearchQuery} 
          activeNodes={activeNodeTypes}
          activeRels={activeRelTypes}
          onToggleNode={toggleNodeType}
          onToggleRel={toggleRelType}
        />

        <div className="flex-1 relative min-h-0 bg-[#0A0F16]">
          {loading && !graph ? (
            <div className="absolute inset-0 flex flex-col p-4 bg-[#0A0F16]/50 backdrop-blur-sm z-20 gap-4">
              <Skeleton className="w-full h-full" rounded="xl" />
            </div>
          ) : error ? (
            <div className="absolute inset-0 flex items-center justify-center bg-[#0A0F16] z-20 p-8">
              <ErrorState title="Graph Rendering Failed" message={error.message || "Failed to load Knowledge Graph data."} onRetry={refresh} />
            </div>
          ) : (
            <GraphCanvas 
              nodes={filteredNodes}
              edges={filteredEdges}
              searchQuery={searchQuery}
              selectedNodeId={selectedNode?.id || null}
              onSelectNode={selectNode}
            />
          )}
        </div>

        {selectedNode && (
          <NodeDetailPanel 
            node={selectedNode}
            edges={filteredEdges}
            onClose={() => selectNode(null)}
          />
        )}

      </div>
    </div>
  );
}

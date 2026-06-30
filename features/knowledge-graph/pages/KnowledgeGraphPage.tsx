"use client";

import React, { useState, useMemo } from "react";
import { MOCK_KG_DATA } from "../constants/graphData";
import { KnowledgeAnalyticsRow } from "../components/KnowledgeAnalyticsRow";
import { GraphFiltersPanel } from "../components/GraphFiltersPanel";
import { GraphCanvas } from "../components/GraphCanvas";
import { NodeDetailPanel } from "../components/NodeDetailPanel";
import { useTheme } from "@/hooks/useTheme";
import { DESIGN_TOKENS } from "@/constants/design";

export function KnowledgeGraphPage() {
  const { theme } = useTheme();
  const tokens = DESIGN_TOKENS[theme];

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // Initialize filter state with all unique categories and relationship types
  const allNodeTypes = Array.from(new Set(MOCK_KG_DATA.nodes.map(n => n.category)));
  const allRelTypes = Array.from(new Set(MOCK_KG_DATA.edges.map(e => e.relationship)));

  const [activeNodeTypes, setActiveNodeTypes] = useState<Set<string>>(new Set(allNodeTypes));
  const [activeRelTypes, setActiveRelTypes] = useState<Set<string>>(new Set(allRelTypes));

  const toggleNodeType = (id: string) => {
    const next = new Set(activeNodeTypes);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setActiveNodeTypes(next);
    
    // Clear selection if selected node is filtered out
    if (selectedNodeId) {
      const node = MOCK_KG_DATA.nodes.find(n => n.id === selectedNodeId);
      if (node && (next.has(id) === false && node.category === id)) {
        setSelectedNodeId(null);
      }
    }
  };

  const toggleRelType = (id: string) => {
    const next = new Set(activeRelTypes);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setActiveRelTypes(next);
  };

  // Derive visible graph data
  const filteredNodes = useMemo(() => {
    return MOCK_KG_DATA.nodes.filter(n => activeNodeTypes.has(n.category));
  }, [activeNodeTypes]);

  const filteredEdges = useMemo(() => {
    // Only show edges where BOTH source and target are visible, AND the relationship type is active
    return MOCK_KG_DATA.edges.filter(e => {
      // Depending on if the edge has been mutated by react-force-graph yet, source/target might be objects
      const sourceId = typeof e.source === 'object' ? (e.source as any).id : e.source;
      const targetId = typeof e.target === 'object' ? (e.target as any).id : e.target;
      
      const isSourceVisible = filteredNodes.some(n => n.id === sourceId);
      const isTargetVisible = filteredNodes.some(n => n.id === targetId);
      
      return isSourceVisible && isTargetVisible && activeRelTypes.has(e.relationship);
    });
  }, [activeRelTypes, filteredNodes]);

  const selectedNode = selectedNodeId ? MOCK_KG_DATA.nodes.find(n => n.id === selectedNodeId) : null;

  return (
    <div className="flex flex-col w-full h-full min-h-0">
      
      <div className="shrink-0 mb-4">
        <KnowledgeAnalyticsRow analytics={MOCK_KG_DATA.analytics} />
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

        <GraphCanvas 
          nodes={filteredNodes}
          edges={filteredEdges}
          searchQuery={searchQuery}
          selectedNodeId={selectedNodeId}
          onSelectNode={setSelectedNodeId}
        />

        {selectedNode && (
          <NodeDetailPanel 
            node={selectedNode}
            edges={filteredEdges} // Pass filtered edges to inspector
            onClose={() => setSelectedNodeId(null)}
          />
        )}

      </div>
    </div>
  );
}

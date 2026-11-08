"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useTheme } from "@/hooks/useTheme";
import { DESIGN_TOKENS } from "@/constants/design";
import { ArrowLeft, Search, Filter, Network } from "lucide-react";
import { GraphData, GraphNode, GraphEdge, NodeType, NodeStatus, KNOWLEDGE_GRAPH_DATA } from "../constants/knowledgeGraphData";
import { graphService } from "@/features/knowledge-graph/services/graphService";
import { ForceGraphRenderer } from "./ForceGraphRenderer";
import { GraphNodeDetail } from "./GraphNodeDetail";
import { useSystemDocuments } from "@/features/shared/hooks/useSystemDocuments";

interface KnowledgeGraphWorkspaceProps {
  onBack: () => void;
}

export function KnowledgeGraphWorkspace({ onBack }: KnowledgeGraphWorkspaceProps) {
  const { hasDocuments } = useSystemDocuments();
  const [liveData, setLiveData] = useState<GraphData | null>(null);

  const loadGraph = useCallback((force = false) => {
    let isMounted = true;
    graphService.fetchGraph(force).then(res => {
      if (!isMounted) return;
      if (!res || !res.nodes.length) {
        setLiveData({ nodes: [], links: [] });
        return;
      }
      const mappedNodes: GraphNode[] = res.nodes.map(n => ({
        id: n.id,
        label: n.label,
        type: (n.category as NodeType) || "Equipment",
        status: (n.status as NodeStatus) || "Healthy",
        description: n.aiSummary || "",
        confidence: n.health?.confidence,
        health: n.health?.coverage,
        priority: n.status === "Critical" ? "Critical" : n.status === "Warning" ? "High" : "Low",
      }));
      const mappedLinks: GraphEdge[] = res.edges.map(e => ({
        id: e.id,
        source: typeof e.source === "object" ? (e.source as any).id : e.source,
        target: typeof e.target === "object" ? (e.target as any).id : e.target,
        relationship: e.relationship,
      }));
      setLiveData({ nodes: mappedNodes, links: mappedLinks });
    }).catch(err => {
      console.warn("Could not load live graph data for workspace:", err);
      setLiveData({ nodes: [], links: [] });
    });
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    loadGraph(true);
    const handleUpdate = () => loadGraph(true);
    window.addEventListener("documentsUpdated", handleUpdate);
    return () => {
      window.removeEventListener("documentsUpdated", handleUpdate);
    };
  }, [loadGraph]);

  const data: GraphData = hasDocuments ? (liveData || { nodes: [], links: [] }) : { nodes: [], links: [] };
  const { theme } = useTheme();
  const tokens = DESIGN_TOKENS[theme];
  
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Set<NodeType>>(new Set());
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);

  const handleFilterToggle = (type: NodeType) => {
    setActiveFilters(prev => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  };

  const filteredData = useMemo(() => {
    if (activeFilters.size === 0 && !searchQuery) return data;
    
    const lowerQuery = searchQuery.toLowerCase();
    
    // Filter nodes
    const filteredNodes = data.nodes.filter(node => {
      const matchesSearch = !searchQuery || node.label.toLowerCase().includes(lowerQuery);
      const matchesFilter = activeFilters.size === 0 || activeFilters.has(node.type);
      return matchesSearch && matchesFilter;
    });
    
    const nodeIds = new Set(filteredNodes.map(n => n.id));
    
    // Filter links (only include links where both source and target exist in filtered nodes)
    const filteredLinks = data.links.filter(link => {
      const sId = typeof link.source === 'object' ? (link.source as any).id : link.source;
      const tId = typeof link.target === 'object' ? (link.target as any).id : link.target;
      return nodeIds.has(sId) && nodeIds.has(tId);
    });
    
    return { nodes: filteredNodes, links: filteredLinks };
  }, [data, activeFilters, searchQuery]);

  return (
    <div 
      className="flex flex-col w-full pb-8"
    >
      {/* Header Area */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 -ml-2 rounded-lg hover:bg-slate-800/50 transition-colors text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className={`text-2xl font-bold ${tokens.text.primary}`}>Knowledge Graph</h1>
            <p className={`${tokens.text.secondary} text-sm mt-1`}>Explore connected assets, risks, and procedures</p>
          </div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <div className="relative flex-[2]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search nodes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-9 pr-4 py-2 bg-slate-900 border ${tokens.card.border} rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-brand`}
          />
        </div>
        <div className="flex-[3] flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
          <Filter className="w-4 h-4 text-slate-400 mr-2 flex-shrink-0" />
          {(["Equipment", "Document", "Procedure", "Risk", "Sensor"] as NodeType[]).map(type => (
            <button
              key={type}
              onClick={() => handleFilterToggle(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap
                ${activeFilters.has(type) 
                  ? 'bg-slate-700 border-slate-600 text-white' 
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-300'}`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Main Graph Area */}
      {filteredData.nodes.length === 0 ? (
        <div className={`w-full h-[600px] flex flex-col items-center justify-center rounded-xl border ${tokens.card.border} ${tokens.card.background} text-slate-500`}>
          <Network className="w-12 h-12 mb-3 opacity-30 text-emerald-500" />
          <p className="text-base font-medium text-slate-300">No Knowledge Graph Entities</p>
          <p className="text-sm text-slate-500 mt-1">Upload a compliance or engineering document to populate the knowledge graph.</p>
        </div>
      ) : (
        <div className={`w-full h-[700px] relative rounded-xl border ${tokens.card.border} ${tokens.card.background} shadow-sm overflow-hidden`}>
          <ForceGraphRenderer 
            data={filteredData} 
            interactive={true} 
            onNodeClick={setSelectedNode} 
            selectedNodeId={selectedNode?.id} 
          />
          
          {/* Node Detail Slide-in Panel */}
          <GraphNodeDetail 
            node={selectedNode} 
            onClose={() => setSelectedNode(null)} 
          />
        </div>
      )}
    </div>
  );
}

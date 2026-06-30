"use client";

import React from "react";
import { useTheme } from "@/hooks/useTheme";
import { DESIGN_TOKENS } from "@/constants/design";
import { Search, Filter, Box, FileText, Settings, ShieldCheck, Users, AlertTriangle, BrainCircuit, Activity } from "lucide-react";

interface GraphFiltersPanelProps {
  onSearch: (query: string) => void;
  searchQuery: string;
  activeNodes: Set<string>;
  activeRels: Set<string>;
  onToggleNode: (id: string) => void;
  onToggleRel: (id: string) => void;
}

export function GraphFiltersPanel({ 
  onSearch, 
  searchQuery, 
  activeNodes, 
  activeRels, 
  onToggleNode, 
  onToggleRel 
}: GraphFiltersPanelProps) {
  const { theme } = useTheme();
  const tokens = DESIGN_TOKENS[theme];

  const nodeTypes = [
    { id: "Equipment", label: "Equipment", icon: Box, color: "text-emerald-500" },
    { id: "Procedure", label: "Procedures & SOPs", icon: Settings, color: "text-blue-500" },
    { id: "Document", label: "Documents & Manuals", icon: FileText, color: "text-purple-500" },
    { id: "Compliance", label: "Compliance Rules", icon: ShieldCheck, color: "text-orange-500" },
    { id: "Personnel", label: "Personnel", icon: Users, color: "text-yellow-500" },
    { id: "Alert", label: "System Alerts", icon: AlertTriangle, color: "text-red-500" },
    { id: "AIInsight", label: "AI Insights", icon: BrainCircuit, color: "text-cyan-500" },
  ];

  const relTypes = [
    "Governed By",
    "Supported By",
    "Predicts For",
    "Must Comply With",
    "Based On Evidence",
    "Maintained By"
  ];

  return (
    <div className={`w-72 shrink-0 flex flex-col h-full bg-slate-900/40 border-r ${tokens.card.border} p-5 overflow-y-auto hide-scrollbar`}>
      
      <div className="mb-8">
        <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <Search className="w-4 h-4 text-slate-400" />
          Semantic Search
        </h2>
        <div className={`relative flex items-center bg-slate-950 rounded-xl border ${tokens.card.border}`}>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="e.g. 'bearing' highlights all related nodes..." 
            className="w-full bg-transparent border-none text-sm text-white focus:outline-none focus:ring-0 py-2.5 px-3"
          />
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          Node Categories
        </h2>
        <div className="flex flex-col gap-2">
          {nodeTypes.map(node => (
            <label key={node.id} className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={activeNodes.has(node.id)}
                onChange={() => onToggleNode(node.id)}
                className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-brand focus:ring-brand focus:ring-offset-slate-900"
              />
              <node.icon className={`w-4 h-4 ${node.color} opacity-80 group-hover:opacity-100 transition-opacity`} />
              <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">{node.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <Activity className="w-4 h-4 text-slate-400" />
          Relationship Types
        </h2>
        <div className="flex flex-col gap-2">
          {relTypes.map(rel => (
            <label key={rel} className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={activeRels.has(rel)}
                onChange={() => onToggleRel(rel)}
                className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-brand focus:ring-brand focus:ring-offset-slate-900"
              />
              <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">{rel}</span>
            </label>
          ))}
        </div>
      </div>
      
    </div>
  );
}

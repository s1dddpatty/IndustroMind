"use client";

import React from "react";
import { KgNode, KgEdge, MOCK_EVIDENCE_CHAIN } from "../constants/graphData";
import { useTheme } from "@/hooks/useTheme";
import { DESIGN_TOKENS } from "@/constants/design";
import { 
  X, ShieldCheck, AlertTriangle, Info, Clock, 
  ExternalLink, BrainCircuit, Activity, Network, FileText, CheckCircle2, ChevronRight
} from "lucide-react";

interface NodeDetailPanelProps {
  node: KgNode;
  edges: KgEdge[];
  onClose: () => void;
}

export function NodeDetailPanel({ node, edges, onClose }: NodeDetailPanelProps) {
  const { theme } = useTheme();
  const tokens = DESIGN_TOKENS[theme];

  const incomingEdges = edges.filter(e => e.target === node.id);
  const outgoingEdges = edges.filter(e => e.source === node.id);
  
  // Status mapping
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Healthy": return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
      case "Warning": return "text-amber-500 bg-amber-500/10 border-amber-500/20";
      case "Critical": return "text-red-500 bg-red-500/10 border-red-500/20";
      case "Contradiction": return "text-purple-500 bg-purple-500/10 border-purple-500/20";
      case "Incomplete": return "text-slate-400 bg-slate-500/10 border-slate-500/20";
      default: return "text-blue-500 bg-blue-500/10 border-blue-500/20";
    }
  };

  return (
    <div className={`w-[400px] shrink-0 flex flex-col h-full bg-slate-900/60 border-l ${tokens.card.border} relative overflow-hidden backdrop-blur-sm`}>
      
      {/* Header */}
      <div className={`p-5 border-b ${tokens.card.border} bg-slate-900/80 sticky top-0 z-10`}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex gap-2 items-center flex-wrap">
            <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(node.status)}`}>
              {node.status}
            </span>
            <span className="px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border border-slate-700 bg-slate-800 text-slate-300">
              {node.category}
            </span>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>
        <h2 className="text-xl font-bold text-white mb-2">{node.label}</h2>
        <p className="text-sm text-slate-300 leading-relaxed font-medium">
          {node.aiSummary}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto hide-scrollbar p-5 space-y-8 pb-20">
        
        {/* Actionable Knowledge Health */}
        <section>
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-500" />
            Knowledge Health
          </h3>
          
          <div className={`p-4 rounded-xl border ${tokens.card.border} bg-slate-950/50 mb-4`}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Completeness Score</span>
              <span className="text-sm font-bold text-emerald-500">{node.health.completeness}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${node.health.completeness}%` }} />
            </div>
          </div>

          <div className="flex flex-col gap-2 mb-4">
            {node.health.checks.map((check, i) => (
              <div key={i} className="flex items-center gap-3">
                {check.status === "Present" ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                )}
                <span className={`text-sm font-medium ${check.status === "Present" ? 'text-slate-300' : 'text-amber-500'}`}>
                  {check.label}
                </span>
                <span className="ml-auto text-[10px] font-bold uppercase tracking-wider text-slate-500">{check.status}</span>
              </div>
            ))}
          </div>

          {node.health.aiRecommendations.length > 0 && (
            <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex gap-3 mt-4">
              <BrainCircuit className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold text-cyan-500 uppercase tracking-wider">AI Recommendations</span>
                <ul className="text-sm text-cyan-500/90 font-medium leading-relaxed list-disc list-inside">
                  {node.health.aiRecommendations.map((rec, i) => <li key={i}>{rec}</li>)}
                </ul>
              </div>
            </div>
          )}
        </section>

        {/* Explainable Relationships */}
        <section>
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <Network className="w-4 h-4 text-blue-500" />
            Relationship Reasoning
          </h3>
          <div className="flex flex-col gap-4">
            {[...outgoingEdges, ...incomingEdges].map(edge => {
              const isOutgoing = edge.source === node.id;
              const connectedNodeId = isOutgoing ? edge.target : edge.source;
              
              return (
                <div key={edge.id} className={`p-4 rounded-xl border ${tokens.card.border} bg-slate-900/50`}>
                  <div className="flex items-center gap-2 mb-2 text-sm font-bold text-white">
                    <span className="text-blue-400">{isOutgoing ? 'To:' : 'From:'}</span>
                    <span>{connectedNodeId}</span>
                  </div>
                  <div className="inline-flex items-center px-2 py-1 rounded bg-slate-800 text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-3">
                    {edge.relationship}
                  </div>
                  <p className="text-sm text-slate-400 font-medium leading-relaxed">
                    "{edge.reasoning}"
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* AI Evidence Chain (GraphRAG) */}
        {node.id === "P-201" && (
          <section>
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-purple-500" />
              GraphRAG Evidence Chain
            </h3>
            <div className={`p-4 rounded-xl border border-purple-500/20 bg-purple-500/5`}>
              <div className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-3">Recent AI Query</div>
              <div className="text-sm font-medium text-white mb-4">"{MOCK_EVIDENCE_CHAIN.question}"</div>
              
              <div className="flex flex-col gap-0">
                {MOCK_EVIDENCE_CHAIN.steps.map((step, i) => (
                  <div key={step.id} className="flex items-start gap-3 relative pb-4">
                    {i !== MOCK_EVIDENCE_CHAIN.steps.length - 1 && (
                      <div className="absolute left-[11px] top-6 bottom-0 w-0.5 bg-slate-800" />
                    )}
                    <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 mt-0.5 relative z-10">
                      <ChevronRight className="w-3 h-3 text-slate-400" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-purple-400 mb-0.5">{step.entity}</div>
                      <div className="text-sm text-slate-300 font-medium">{step.action}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-2 pt-3 border-t border-purple-500/20">
                <div className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-2">Conclusion</div>
                <div className="text-sm text-slate-200 font-medium leading-relaxed">
                  {MOCK_EVIDENCE_CHAIN.conclusion}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Activity Timeline */}
        <section>
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" />
            Activity Timeline
          </h3>
          <div className="flex flex-col gap-4">
            {node.timeline.map((event) => (
              <div key={event.id} className="flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-300">{event.type}</span>
                  <span className="text-[10px] text-slate-500 font-medium">{event.date}</span>
                </div>
                <span className="text-sm text-slate-400 font-medium">{event.description}</span>
              </div>
            ))}
          </div>
        </section>

      </div>
      
      {/* Quick Actions Footer */}
      <div className={`p-4 border-t ${tokens.card.border} bg-slate-900/90 backdrop-blur-md sticky bottom-0 z-10`}>
        <div className="grid grid-cols-2 gap-2">
          <button className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors text-xs font-bold">
            <BrainCircuit className="w-4 h-4" /> Ask Assistant
          </button>
          <button className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-blue-500/10 text-blue-500 border border-blue-500/20 hover:bg-blue-500/20 transition-colors text-xs font-bold">
            <FileText className="w-4 h-4" /> View Docs
          </button>
        </div>
      </div>

    </div>
  );
}

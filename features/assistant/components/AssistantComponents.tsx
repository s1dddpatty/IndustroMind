"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "@/hooks/useTheme";
import { DESIGN_TOKENS } from "@/constants/design";
import { 
  AiReasoningStep, 
  EvidenceItem, 
  GraphNodeRef, 
  ComplianceImpact, 
  ActionRecommendation 
} from "../constants/assistantData";
import { 
  CheckCircle2, Loader2, FileText, Database, ShieldAlert, AlertTriangle, 
  ArrowRight, Link as LinkIcon, Network, CheckSquare, Settings, Play, ChevronDown, ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// -----------------------------------------------------
// Collapsible Card Wrapper
// -----------------------------------------------------
function CollapsibleSection({ title, icon: Icon, defaultOpen = true, children, color = "emerald" }: { title: string, icon: React.ElementType, defaultOpen?: boolean, children: React.ReactNode, color?: "emerald" | "amber" | "red" | "blue" | "purple" }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const { theme } = useTheme();
  const tokens = DESIGN_TOKENS[theme];
  
  const colorMap = {
    emerald: "text-emerald-500",
    amber: "text-amber-500",
    red: "text-red-500",
    blue: "text-blue-500",
    purple: "text-purple-500"
  };

  return (
    <div className={`rounded-xl border ${tokens.card.border} bg-slate-900/40 overflow-hidden`}>
      <div 
        className="flex items-center justify-between p-3 cursor-pointer hover:bg-slate-800/40 transition-colors select-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          <Icon className={`w-4 h-4 ${colorMap[color]}`} />
          <h3 className={`text-sm font-bold ${tokens.text.primary} uppercase tracking-wide`}>{title}</h3>
        </div>
        {isOpen ? <ChevronDown className="w-4 h-4 text-slate-500" /> : <ChevronRight className="w-4 h-4 text-slate-500" />}
      </div>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-4 pt-0 border-t border-slate-800/50 mt-1">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// -----------------------------------------------------
// Reasoning Trace
// -----------------------------------------------------
export function ReasoningTrace({ steps }: { steps: AiReasoningStep[] }) {
  const { theme } = useTheme();
  const tokens = DESIGN_TOKENS[theme];

  return (
    <div className={`p-4 rounded-xl border border-blue-500/20 bg-blue-500/5 mb-4`}>
      <h3 className={`text-xs font-bold text-blue-400 uppercase tracking-widest mb-3 flex items-center gap-2`}>
        <Settings className="w-3.5 h-3.5" /> AI Reasoning Trace
      </h3>
      <div className="space-y-3">
        {steps.map((step, idx) => (
          <div key={step.id} className="flex gap-3">
            <div className="flex flex-col items-center mt-0.5">
              {step.status === "completed" ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              ) : step.status === "active" ? (
                <Loader2 className="w-4 h-4 text-blue-500 animate-spin shrink-0" />
              ) : (
                <div className="w-4 h-4 rounded-full border border-slate-600 shrink-0" />
              )}
              {idx < steps.length - 1 && <div className="w-px h-full bg-slate-700 my-1"></div>}
            </div>
            <div className="pb-3">
              <span className={`text-sm font-medium ${step.status === 'pending' ? 'text-slate-500' : tokens.text.primary}`}>
                {step.message}
              </span>
              {step.status === "completed" && (
                <span className="ml-2 text-[10px] font-mono text-slate-500">{step.durationMs}ms</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// -----------------------------------------------------
// Executive Summary
// -----------------------------------------------------
export function ExecutiveSummaryCard({ summary, confidence }: { summary: string, confidence: number }) {
  return (
    <div className={`p-5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 mb-4 flex gap-4`}>
      <div className="shrink-0 flex flex-col items-center justify-center p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 h-fit">
        <span className="text-xl font-bold text-emerald-500">{confidence}%</span>
        <span className="text-[9px] uppercase font-bold text-emerald-500/70 tracking-wider mt-1">Confidence</span>
      </div>
      <div>
        <h3 className={`text-xs font-bold text-emerald-500 uppercase tracking-widest mb-2`}>Executive Summary</h3>
        <p className="text-sm text-slate-200 leading-relaxed font-medium">{summary}</p>
      </div>
    </div>
  );
}

// -----------------------------------------------------
// Evidence Cards
// -----------------------------------------------------
export function EvidenceCardList({ evidence }: { evidence: EvidenceItem[] }) {
  const { theme } = useTheme();
  const tokens = DESIGN_TOKENS[theme];

  return (
    <CollapsibleSection title="Source Attribution & Evidence" icon={FileText} color="blue">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
        {evidence.map(ev => (
          <div key={ev.id} className={`p-3 rounded-lg border ${tokens.card.border} bg-slate-800/30 hover:bg-slate-800/60 cursor-pointer transition-colors group flex flex-col`}>
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-bold text-slate-200 group-hover:text-blue-400 transition-colors line-clamp-1">{ev.title}</span>
              </div>
              <span className="text-[10px] font-medium bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/20">{ev.type}</span>
            </div>
            <p className="text-xs text-slate-400 italic mb-2 line-clamp-2">"{ev.excerpt}"</p>
            <div className="mt-auto flex items-center justify-between text-[10px] text-slate-500 font-medium">
              <span>{ev.pageOrSection || "Extracted"}</span>
              <span className="text-emerald-500/70">{ev.confidence}% Match</span>
            </div>
          </div>
        ))}
      </div>
    </CollapsibleSection>
  );
}

// -----------------------------------------------------
// Graph RAG Visualizer
// -----------------------------------------------------
export function GraphRagVisualizer({ nodes }: { nodes: GraphNodeRef[] }) {
  const { theme } = useTheme();
  const tokens = DESIGN_TOKENS[theme];

  const getColor = (type: string, status?: string) => {
    if (status === "Critical") return "border-red-500 text-red-500 bg-red-500/10";
    if (status === "Warning") return "border-amber-500 text-amber-500 bg-amber-500/10";
    if (type === "Equipment") return "border-blue-500 text-blue-500 bg-blue-500/10";
    if (type === "Regulation") return "border-purple-500 text-purple-500 bg-purple-500/10";
    return "border-slate-500 text-slate-400 bg-slate-800";
  };

  return (
    <CollapsibleSection title="Knowledge Graph Context" icon={Network} color="purple">
      <div className="flex flex-wrap items-center gap-2 mt-3 p-4 rounded-lg bg-slate-950/50 border border-slate-800/50">
        {nodes.map((node, idx) => (
          <React.Fragment key={node.id}>
            <div className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 cursor-pointer hover:shadow-lg transition-shadow ${getColor(node.type, node.status)}`}>
              <Database className="w-3 h-3" />
              {node.label}
            </div>
            {idx < nodes.length - 1 && (
              <div className="flex items-center text-slate-600">
                <div className="w-4 h-px bg-slate-600"></div>
                <LinkIcon className="w-3 h-3 mx-1" />
                <div className="w-4 h-px bg-slate-600"></div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </CollapsibleSection>
  );
}

// -----------------------------------------------------
// Compliance Impact
// -----------------------------------------------------
export function ComplianceRiskList({ impacts }: { impacts: ComplianceImpact[] }) {
  const { theme } = useTheme();
  const tokens = DESIGN_TOKENS[theme];

  return (
    <CollapsibleSection title="Compliance & Safety Impact" icon={ShieldAlert} color="red">
      <div className="flex flex-col gap-3 mt-3">
        {impacts.map(impact => (
          <div key={impact.id} className={`p-3 rounded-lg border ${impact.status === 'Violation' ? 'border-red-500/30 bg-red-500/10' : 'border-amber-500/30 bg-amber-500/10'}`}>
            <div className="flex items-center gap-2 mb-1">
              <ShieldAlert className={`w-4 h-4 ${impact.status === 'Violation' ? 'text-red-500' : 'text-amber-500'}`} />
              <span className={`text-sm font-bold ${impact.status === 'Violation' ? 'text-red-400' : 'text-amber-400'}`}>{impact.standard}: {impact.rule}</span>
              <span className={`ml-auto text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${impact.status === 'Violation' ? 'bg-red-500 text-white' : 'bg-amber-500 text-white'}`}>
                {impact.status}
              </span>
            </div>
            <p className="text-xs text-slate-300 ml-6">{impact.description}</p>
          </div>
        ))}
      </div>
    </CollapsibleSection>
  );
}

// -----------------------------------------------------
// Recommendations
// -----------------------------------------------------
export function RecommendationsList({ recommendations }: { recommendations: ActionRecommendation[] }) {
  const { theme } = useTheme();
  const tokens = DESIGN_TOKENS[theme];

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case "Critical": return "text-red-500 border-red-500/20 bg-red-500/10";
      case "High": return "text-amber-500 border-amber-500/20 bg-amber-500/10";
      case "Medium": return "text-blue-500 border-blue-500/20 bg-blue-500/10";
      default: return "text-emerald-500 border-emerald-500/20 bg-emerald-500/10";
    }
  };

  return (
    <CollapsibleSection title="Recommended Actions" icon={CheckSquare} color="amber">
      <div className="flex flex-col gap-2 mt-3">
        {recommendations.map(rec => (
          <div key={rec.id} className={`p-3 rounded-lg border ${tokens.card.border} bg-slate-800/30 flex items-center justify-between group`}>
            <div className="flex items-center gap-3">
              <div className={`p-1.5 rounded-md border ${getPriorityColor(rec.priority)}`}>
                <Play className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors">{rec.description}</p>
                {rec.targetAsset && <p className="text-[10px] text-slate-500 mt-0.5 font-medium">Target: {rec.targetAsset}</p>}
              </div>
            </div>
            <button className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-xs font-bold hover:bg-emerald-500/20 transition-colors opacity-0 group-hover:opacity-100">
              Execute
            </button>
          </div>
        ))}
      </div>
    </CollapsibleSection>
  );
}

// -----------------------------------------------------
// Follow-up Suggestions
// -----------------------------------------------------
export function FollowUpSuggestions({ suggestions, onClick }: { suggestions: string[], onClick: (q: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-800/50">
      <span className="w-full text-xs font-bold text-slate-500 uppercase mb-1">Suggested Follow-ups</span>
      {suggestions.map((s, idx) => (
        <button 
          key={idx}
          onClick={() => onClick(s)}
          className="px-3 py-1.5 rounded-full border border-slate-700 bg-slate-800/50 hover:bg-slate-700 hover:border-slate-500 text-xs text-slate-300 transition-colors"
        >
          {s}
        </button>
      ))}
    </div>
  );
}

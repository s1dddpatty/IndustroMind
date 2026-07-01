"use client";

import React from "react";
import { useTheme } from "@/hooks/useTheme";
import { DESIGN_TOKENS } from "@/constants/design";
import { motion, AnimatePresence } from "framer-motion";
import { GraphNode } from "../constants/knowledgeGraphData";
import { X, FileText, CheckCircle2, ShieldAlert, Cpu } from "lucide-react";

interface GraphNodeDetailProps {
  node: GraphNode | null;
  onClose: () => void;
}

export function GraphNodeDetail({ node, onClose }: GraphNodeDetailProps) {
  const { theme } = useTheme();
  const tokens = DESIGN_TOKENS[theme];

  return (
    <AnimatePresence>
      {node && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className={`absolute top-0 right-0 w-80 h-full border-l max-lg:w-full max-lg:h-[50%] max-lg:bottom-0 max-lg:top-auto max-lg:border-l-0 max-lg:border-t max-lg:rounded-t-2xl ${tokens.card.border} ${tokens.card.background} bg-opacity-95 backdrop-blur-md shadow-2xl flex flex-col z-30`}
        >
          <div className="flex items-center justify-between p-4 border-b border-slate-800/50">
            <h2 className={`font-bold ${tokens.text.primary}`}>{node.label}</h2>
            <button onClick={onClose} className="p-1 rounded hover:bg-slate-800/50 text-slate-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            <section>
              <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Type</div>
              <div className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-slate-800 text-slate-300">
                {node.type}
              </div>
            </section>
            
            <section>
              <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Status</div>
              <div className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium
                ${node.status === 'Healthy' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : ''}
                ${node.status === 'Warning' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : ''}
                ${node.status === 'Critical' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : ''}
                ${node.status === 'Offline' ? 'bg-slate-500/10 text-slate-400 border border-slate-500/20' : ''}
                ${node.status === 'AI recommendation' ? 'bg-cyan-500/10 text-cyan-500 border border-cyan-500/20' : ''}
                ${node.status === 'Recently Updated' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' : ''}
              `}>
                {node.status}
              </div>
            </section>

            {node.description && (
              <section>
                <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">Description</div>
                <p className={`text-sm ${tokens.text.primary}`}>{node.description}</p>
              </section>
            )}
            
            {node.riskScore !== undefined && (
              <section>
                <div className="text-xs text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1"><ShieldAlert className="w-3 h-3"/> Risk Score</div>
                <div className="text-xl font-semibold text-red-500">{node.riskScore}/100</div>
              </section>
            )}

            {node.confidence !== undefined && (
              <section>
                <div className="text-xs text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1"><Cpu className="w-3 h-3"/> AI Confidence</div>
                <div className="text-xl font-semibold text-cyan-500">{node.confidence}%</div>
              </section>
            )}
            
            <section>
              <div className="text-xs text-slate-500 uppercase tracking-wider mb-3">Actions</div>
              <div className="space-y-2">
                <button 
                  onClick={() => alert(`[DEMO]: Requesting document payload for ${node.label}...`)}
                  className={`w-full py-2 px-3 rounded-lg border ${tokens.card.border} text-sm ${tokens.text.primary} hover:bg-slate-800/50 transition-colors flex items-center gap-2`}
                >
                  <FileText className="w-4 h-4 text-slate-400" /> Open Document
                </button>
                <button 
                  onClick={() => alert(`[DEMO]: Loading Standard Operating Procedures for ${node.type} ${node.label}...`)}
                  className={`w-full py-2 px-3 rounded-lg border ${tokens.card.border} text-sm ${tokens.text.primary} hover:bg-slate-800/50 transition-colors flex items-center gap-2`}
                >
                  <CheckCircle2 className="w-4 h-4 text-slate-400" /> View SOPs
                </button>
              </div>
            </section>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

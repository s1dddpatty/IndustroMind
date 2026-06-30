"use client";

import React from "react";
import { KgAnalytics } from "../constants/graphData";
import { useTheme } from "@/hooks/useTheme";
import { DESIGN_TOKENS } from "@/constants/design";
import { 
  ShieldCheck, AlertTriangle, Link as LinkIcon, 
  GitMerge, Server, Lightbulb
} from "lucide-react";

interface KnowledgeAnalyticsRowProps {
  analytics: KgAnalytics;
}

export function KnowledgeAnalyticsRow({ analytics }: KnowledgeAnalyticsRowProps) {
  const { theme } = useTheme();
  const tokens = DESIGN_TOKENS[theme];

  const metrics = [
    {
      label: "Knowledge Integrity",
      value: `${analytics.knowledgeIntegrity}%`,
      icon: ShieldCheck,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20"
    },
    {
      label: "Coverage vs Assets",
      value: `${analytics.knowledgeCoverage}%`,
      icon: Server,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20"
    },
    {
      label: "Total Entities & Edges",
      value: `${(analytics.totalNodes / 1000).toFixed(1)}k / ${(analytics.totalRelationships / 1000).toFixed(1)}k`,
      icon: GitMerge,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20"
    },
    {
      label: "Missing / Orphans",
      value: `${analytics.missingRelationships} / ${analytics.orphanNodes}`,
      icon: LinkIcon,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20"
    },
    {
      label: "Active Contradictions",
      value: analytics.contradictionsDetected,
      icon: AlertTriangle,
      color: "text-red-500",
      bg: "bg-red-500/10",
      border: "border-red-500/20"
    },
    {
      label: "AI Suggestions",
      value: analytics.aiSuggestedImprovements,
      icon: Lightbulb,
      color: "text-cyan-500",
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/20"
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {metrics.map((metric, i) => (
        <div key={i} className={`p-4 rounded-xl border ${tokens.card.border} bg-slate-900/40 flex flex-col`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{metric.label}</span>
            <div className={`w-8 h-8 rounded-lg ${metric.bg} ${metric.border} border flex items-center justify-center shrink-0`}>
              <metric.icon className={`w-4 h-4 ${metric.color}`} />
            </div>
          </div>
          <div className="text-2xl font-bold text-white mt-auto">{metric.value}</div>
        </div>
      ))}
    </div>
  );
}

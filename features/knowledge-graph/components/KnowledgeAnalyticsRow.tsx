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

  const formatCount = (count: number) => {
    if (!count) return "0";
    if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
    return count.toString();
  };

  const isZero = analytics.totalNodes === 0;

  const metrics = [
    {
      label: "Knowledge Integrity",
      value: isZero ? "0%" : `${analytics.knowledgeIntegrity}%`,
      icon: ShieldCheck,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20"
    },
    {
      label: "Coverage vs Assets",
      value: isZero ? "0%" : `${analytics.knowledgeCoverage}%`,
      icon: Server,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20"
    },
    {
      label: "Total Entities & Edges",
      value: `${formatCount(analytics.totalNodes)} / ${formatCount(analytics.totalRelationships)}`,
      icon: GitMerge,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20"
    },
    {
      label: "Missing / Orphans",
      value: isZero ? "0 / 0" : `${analytics.missingRelationships} / ${analytics.orphanNodes}`,
      icon: LinkIcon,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20"
    },
    {
      label: "Active Contradictions",
      value: isZero ? "0" : analytics.contradictionsDetected,
      icon: AlertTriangle,
      color: "text-red-500",
      bg: "bg-red-500/10",
      border: "border-red-500/20"
    },
    {
      label: "Drift Status",
      value: isZero ? "Idle" : "Monitored",
      icon: Lightbulb,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20"
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
      {metrics.map((m, idx) => {
        const Icon = m.icon;
        return (
          <div 
            key={idx}
            className={`p-3 rounded-xl border ${tokens.card.border} ${tokens.card.background} flex flex-col justify-between`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] text-slate-400 font-medium truncate">{m.label}</span>
              <div className={`p-1 rounded-md ${m.bg} ${m.border} border`}>
                <Icon className={`w-3.5 h-3.5 ${m.color}`} />
              </div>
            </div>
            <span className={`text-base font-bold ${tokens.text.primary}`}>
              {m.value}
            </span>
          </div>
        );
      })}
    </div>
  );
}

"use client";

import React from "react";
import { useTheme } from "@/hooks/useTheme";
import { DESIGN_TOKENS } from "@/constants/design";
import { AiDecisionBrief as BriefType } from "../constants/aiDecisionBriefData";
import { ArrowRight, CheckCircle2, FileText, Sparkles, Clock } from "lucide-react";

const formatRelativeTime = (isoString: string) => {
  const date = new Date(isoString);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);
  if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  return `${Math.floor(diffInHours / 24)} day${Math.floor(diffInHours / 24) > 1 ? 's' : ''} ago`;
};

interface AIDecisionBriefProps {
  data: {
    title: string;
    currentBrief: BriefType;
  };
  onExpand?: () => void;
  onGenerate?: () => void;
  className?: string;
}

export function AIDecisionBrief({ data, onExpand, onGenerate, className = "" }: AIDecisionBriefProps) {
  const { theme } = useTheme();
  const tokens = DESIGN_TOKENS[theme];
  const brief = data.currentBrief;

  // Ensure max 3 bullets to preserve dashboard layout lock
  const displayBullets = brief.previewBullets.slice(0, 3);

  return (
    <div className={`${className} flex flex-col hover:-translate-y-0.5 transition-transform duration-300`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3 z-10">
        <h2 className={`text-lg font-bold flex items-center gap-2 ${tokens.text.primary}`}>
          <Sparkles className="w-5 h-5 text-emerald-500" />
          {data.title}
        </h2>
        <button 
          onClick={onGenerate}
          className="flex items-center gap-1.5 text-[13px] font-medium text-emerald-500 hover:text-emerald-400 transition-colors group"
        >
          Generate New <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Brief Preview Content */}
      <div className="flex flex-col flex-1 min-h-0">
        <div className="mb-3">
          <h3 className={`text-[15px] font-bold ${tokens.text.primary}`}>{brief.title}</h3>
          <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
            <Clock className="w-3.5 h-3.5" /> Generated {formatRelativeTime(brief.createdAt)}
          </p>
        </div>

        {/* Checklist */}
        <div className="flex-1 space-y-2 min-h-0 max-lg:min-h-none overflow-hidden max-lg:overflow-visible">
          {displayBullets.map((bullet, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span className={`text-[13px] leading-tight ${tokens.text.secondary} line-clamp-1`}>{bullet}</span>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-auto pt-3">
          <button 
            onClick={onExpand}
            className={`w-full py-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 text-emerald-500 hover:bg-emerald-500/10 transition-colors flex items-center justify-center gap-2 text-[13px] font-medium group`}
          >
            <FileText className="w-4 h-4" />
            View Full Brief
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}

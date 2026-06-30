"use client";

import React from "react";
import { useTheme } from "@/hooks/useTheme";
import { DESIGN_TOKENS } from "@/constants/design";
import { WorkspaceSectionData } from "../constants/dashboardData";
import { ArrowRight, Bot } from "lucide-react";
import { Query } from "../constants/recentQueriesData";

interface RecentQueriesProps {
  data: WorkspaceSectionData & { queries?: Query[] };
  onExpand?: () => void;
  className?: string;
}

// Simple helper to format relative time for the preview card
function getRelativeTime(isoString: string) {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHrs = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHrs / 24);

  if (diffDays > 0) return diffDays === 1 ? "Yesterday" : `${diffDays}d ago`;
  if (diffHrs > 0) return `${diffHrs}h ago`;
  return `${diffMins}m ago`;
}

export function RecentQueries({ data, onExpand, className = "" }: RecentQueriesProps) {
  const { theme } = useTheme();
  const tokens = DESIGN_TOKENS[theme];
  const queries = data.queries?.slice(0, 3) || [];

  return (
    <div className={`${className} flex flex-col`}>
      <div className="flex items-center justify-between mb-2">
        <h2 className={`text-lg font-bold ${tokens.text.primary}`}>{data.title}</h2>
        <button 
          onClick={onExpand}
          className={`flex items-center gap-1 text-[13px] font-medium text-emerald-500 hover:text-emerald-400 transition-colors`}
        >
          View all <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
      
      <div className="flex-1 flex flex-col space-y-2 min-h-0 overflow-hidden mt-1">
        {queries.map((query) => (
          <div 
            key={query.id} 
            className="flex items-start gap-2.5 group cursor-pointer"
            onClick={onExpand}
          >
            <div className={`mt-0.5 p-1 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shrink-0`}>
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-[13px] font-semibold ${tokens.text.primary} truncate group-hover:text-emerald-400 transition-colors`}>
                {query.question}
              </p>
              <div className="flex items-center justify-between mt-0.5">
                <span className={`text-[10px] ${tokens.text.secondary}`}>{query.department}</span>
                <span className={`text-[11px] text-slate-500`}>{getRelativeTime(query.timestamp)}</span>
              </div>
            </div>
          </div>
        ))}
        {queries.length === 0 && (
          <div className="flex-1 flex items-center justify-center text-sm text-slate-500">
            No recent queries found.
          </div>
        )}
      </div>
    </div>
  );
}

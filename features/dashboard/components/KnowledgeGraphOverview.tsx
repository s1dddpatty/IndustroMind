"use client";

import React from "react";
import { useTheme } from "@/hooks/useTheme";
import { DESIGN_TOKENS } from "@/constants/design";
import { KnowledgeGraphData } from "../constants/dashboardData";
import { ForceGraphRenderer } from "./ForceGraphRenderer";
import { ArrowRight } from "lucide-react";

interface KnowledgeGraphOverviewProps {
  data: KnowledgeGraphData;
  className?: string;
  onExpand?: () => void;
}

export function KnowledgeGraphOverview({ data, className = "", onExpand }: KnowledgeGraphOverviewProps) {
  const { theme } = useTheme();
  const tokens = DESIGN_TOKENS[theme];

  return (
    <div className={`${className} flex flex-col`}>
      <div className="flex items-center justify-between mb-2 z-10">
        <h2 className={`text-lg font-bold ${tokens.text.primary}`}>{data.title}</h2>
        <button 
          onClick={() => {
            console.log("View Graph clicked");
            if (onExpand) onExpand();
          }}
          className="flex items-center gap-1.5 text-sm font-medium text-brand hover:text-brand/80 transition-colors"
        >
          View Graph <ArrowRight className="w-4 h-4" />
        </button>
      </div>
      
      <div className="flex-1 relative -mx-6 -mb-4 overflow-hidden rounded-b-xl border-t border-slate-800/50">
        <div className="absolute inset-0 pointer-events-none z-10 bg-gradient-to-b from-transparent to-slate-950/80" />
        <ForceGraphRenderer data={data.graph} interactive={false} />
        
        {/* Legend */}
        <div className="absolute bottom-2 left-0 right-0 z-20 flex justify-center gap-4 px-4">
          <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500"></span><span className="text-xs text-slate-400">Equipment</span></div>
          <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-violet-500"></span><span className="text-xs text-slate-400">Document</span></div>
          <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500"></span><span className="text-xs text-slate-400">Procedure</span></div>
          <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500"></span><span className="text-xs text-slate-400">Risk</span></div>
        </div>
      </div>
    </div>
  );
}

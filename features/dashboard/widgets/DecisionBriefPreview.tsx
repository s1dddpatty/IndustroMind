"use client";

import { ArrowRight, CheckCircle2, FileText } from "lucide-react";
import { Card } from "@/features/shared/components/ui/Card";
import { useDashboard } from "../hooks/useDashboard";
import { DESIGN } from "@/features/shared/constants/design";

export function DecisionBriefPreview() {
  const { decisionBrief } = useDashboard();

  return (
    <Card className="h-full w-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white">AI Decision Brief</h3>
        <button className="text-xs font-bold text-brand-light flex items-center gap-1 group">
          Generate New
          <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="flex-1 bg-[#1A1A1D] rounded-2xl border border-[#2A2A30] p-5 flex flex-col">
        <div className="mb-4">
          <h4 className="text-sm font-bold text-white mb-1">{decisionBrief.title}</h4>
          <p className="text-xs text-gray-500">Generated {decisionBrief.generatedAgo}</p>
        </div>

        <div className="space-y-3 mb-6 flex-1">
          {decisionBrief.items.map((item: any, idx: number) => (
            <div key={idx} className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-brand-primary shrink-0 mt-0.5" />
              <span className="text-sm text-gray-300 leading-snug">{item.text}</span>
            </div>
          ))}
        </div>

        <button className="w-full mt-auto flex items-center justify-center gap-2 rounded-xl border border-gray-700 bg-gray-800/50 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gray-700 hover:border-gray-600">
          <FileText className="h-4 w-4 text-brand-primary" />
          View Full Brief
          <ArrowRight className="h-4 w-4 ml-1 text-gray-400" />
        </button>
      </div>
    </Card>
  );
}

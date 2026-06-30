"use client";

import { FileText, ArrowRight } from "lucide-react";
import { Card } from "@/features/shared/components/ui/Card";
import { useDashboard } from "../hooks/useDashboard";
import { DESIGN } from "@/features/shared/constants/design";

export function RecentDocuments() {
  const { documents } = useDashboard();

  return (
    <Card className="h-full w-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-white">Recent Documents</h3>
        <button className="text-[10px] font-bold text-brand-light flex items-center gap-1 group uppercase tracking-wider">
          View all
          <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2">
        {documents.map((doc: any) => (
          <div key={doc.id} className="group flex gap-3 p-2 -mx-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
            <div className="h-8 w-8 rounded bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
              <FileText className="h-4 w-4 text-red-400" />
              <span className="absolute text-[6px] font-bold text-red-400 mt-5 bg-red-950 px-1 rounded-sm">PDF</span>
            </div>
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <div className="flex items-center justify-between">
                <h4 className="text-[13px] font-semibold text-white truncate pr-2">{doc.title}</h4>
                <span className="text-[10px] text-gray-500 shrink-0">{doc.timeAgo}</span>
              </div>
              <div className="flex items-center justify-between mt-0.5">
                <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
                  <span>{doc.type}</span>
                  <span>•</span>
                  <span>{doc.context}</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-medium text-brand-primary">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
                  {doc.status}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

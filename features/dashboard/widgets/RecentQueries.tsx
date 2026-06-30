"use client";

import { MessageSquare, ArrowRight } from "lucide-react";
import { Card } from "@/features/shared/components/ui/Card";
import { useDashboard } from "../hooks/useDashboard";
import { DESIGN } from "@/features/shared/constants/design";

export function RecentQueries() {
  const { queries } = useDashboard();

  return (
    <Card className="h-full w-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-white">Recent Queries</h3>
        <button className="text-[10px] font-bold text-brand-light flex items-center gap-1 group uppercase tracking-wider">
          View all
          <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2">
        {queries.map((q: any) => (
          <div key={q.id} className="group flex gap-3 p-2 -mx-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
            <div className="mt-0.5 text-gray-500 group-hover:text-gray-400 transition-colors">
              <MessageSquare className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <div className="flex items-center justify-between">
                <h4 className="text-[13px] font-medium text-gray-300 truncate pr-2 group-hover:text-white transition-colors">{q.query}</h4>
                <span className="text-[10px] text-gray-500 shrink-0">{q.timeAgo}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

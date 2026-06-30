"use client";

import React from "react";
import { useTheme } from "@/hooks/useTheme";
import { DESIGN_TOKENS } from "@/constants/design";
import { ArrowRight } from "lucide-react";
import { AlertCard } from "./AlertCard";
import { ProactiveAlertsData } from "../constants/dashboardData";

interface ProactiveAlertsProps {
  data: ProactiveAlertsData;
  className?: string;
  onExpand?: () => void;
}

export function ProactiveAlerts({ data, className = "", onExpand }: ProactiveAlertsProps) {
  const { theme } = useTheme();
  const tokens = DESIGN_TOKENS[theme];

  return (
    <div className={`${className} flex flex-col`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h2 className={`text-lg font-bold ${tokens.text.primary}`}>{data.title}</h2>
        <div className="px-2.5 py-0.5 rounded-full bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-400 text-xs font-medium border border-red-200 dark:border-red-900/50">
          {data.criticalCount} Critical
        </div>
      </div>

      {/* Alert List */}
      <div className="flex flex-col flex-1">
        {data.alerts.slice(0, 2).map((alert, index) => (
          <AlertCard 
            key={alert.id}
            alert={alert}
            className={index !== 0 ? `border-t ${tokens.card.border}` : ""}
          />
        ))}
      </div>

      {/* Footer */}
      <div className="mt-auto pt-2 flex justify-end">
        <button 
          onClick={onExpand}
          className={`flex items-center gap-1.5 text-[13px] font-medium ${tokens.text.brand} hover:opacity-80 transition-opacity`}
        >
          View all alerts <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

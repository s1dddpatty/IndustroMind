"use client";

import React from "react";
import { AlertTriangle, ChevronRight } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { DESIGN_TOKENS } from "@/constants/design";
import { AlertData } from "../constants/alerts";
import { SeverityBadge, Severity } from "./SeverityBadge";

interface AlertCardProps {
  alert: AlertData;
  onClick?: () => void;
  className?: string;
}

export const AlertCard = React.memo(function AlertCard({ alert, onClick, className = "" }: AlertCardProps) {
  const { theme } = useTheme();
  const tokens = DESIGN_TOKENS[theme];

  let iconColor = "";
  let iconBg = "";

  switch (alert.severity) {
    case "Critical":
      iconColor = "text-red-600 dark:text-red-500";
      iconBg = "bg-red-100 dark:bg-red-500/10";
      break;
    case "High":
      iconColor = "text-orange-600 dark:text-orange-500";
      iconBg = "bg-orange-100 dark:bg-orange-500/10";
      break;
    case "Medium":
      iconColor = "text-amber-600 dark:text-amber-500";
      iconBg = "bg-amber-100 dark:bg-amber-500/10";
      break;
    case "Low":
      iconColor = "text-blue-600 dark:text-blue-500";
      iconBg = "bg-blue-100 dark:bg-blue-500/10";
      break;
    default:
      iconColor = "text-slate-600 dark:text-slate-500";
      iconBg = "bg-slate-100 dark:bg-slate-500/10";
  }

  return (
    <div 
      onClick={onClick}
      className={`py-2.5 flex items-start gap-3 group ${onClick ? "cursor-pointer hover:bg-slate-800/20 rounded-lg px-2 -mx-2" : ""} transition-colors ${className}`}
    >
      {/* Icon */}
      <div className={`flex items-center justify-center w-8 h-8 rounded-xl ${iconBg} flex-shrink-0 mt-0.5`}>
        <AlertTriangle className={`w-4 h-4 ${iconColor}`} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col">
        <span className={`text-[13px] font-bold ${tokens.text.primary} truncate mb-0.5`}>
          {alert.title}
        </span>
        <p className={`text-[11px] ${tokens.text.secondary} leading-relaxed line-clamp-2 mb-1 whitespace-pre-line`}>
          {alert.description}
        </p>
        <span className={`text-[10px] text-slate-500 dark:text-slate-400`}>
          {alert.asset} • {alert.timestamp}
        </span>
      </div>

      {/* Right: Badge & Chevron */}
      <div className="flex flex-col items-end gap-1.5 ml-2 flex-shrink-0">
        <SeverityBadge severity={alert.severity as Severity} />
        {onClick && (
          <ChevronRight className={`w-4 h-4 text-slate-400 group-hover:text-slate-300 transition-colors mt-2`} />
        )}
      </div>
    </div>
  );
});

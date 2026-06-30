"use client";

import React from "react";

export type Severity = "Critical" | "High" | "Medium" | "Low";

interface SeverityBadgeProps {
  severity: Severity;
  className?: string;
}

export function SeverityBadge({ severity, className = "" }: SeverityBadgeProps) {
  let badgeClasses = "";

  switch (severity) {
    case "Critical":
      badgeClasses = "bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400";
      break;
    case "High":
      badgeClasses = "bg-orange-100 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400";
      break;
    case "Medium":
      badgeClasses = "bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400";
      break;
    case "Low":
      badgeClasses = "bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400";
      break;
    default:
      badgeClasses = "bg-slate-100 dark:bg-slate-500/10 text-slate-700 dark:text-slate-400";
  }

  return (
    <div className={`px-2 py-0.5 rounded-md text-[10px] font-medium ${badgeClasses} ${className}`}>
      {severity}
    </div>
  );
}

"use client";

import React from "react";
import { useTheme } from "@/hooks/useTheme";
import { DESIGN_TOKENS } from "@/constants/design";

import { RecentDocuments } from "./RecentDocuments";
import { RecentQueries } from "./RecentQueries";
import { SystemHealth } from "./SystemHealth";
import { DashboardBottomRowData } from "../constants/dashboardData";

interface BottomRowProps {
  data: DashboardBottomRowData;
  onExpandDocuments?: () => void;
  onExpandQueries?: () => void;
  onExpandHealth?: () => void;
}

export function BottomRow({ data, onExpandDocuments, onExpandQueries, onExpandHealth }: BottomRowProps) {
  const { theme } = useTheme();
  const tokens = DESIGN_TOKENS[theme];
  
  const cardBaseClasses = `relative rounded-2xl border ${tokens.card.border} ${tokens.card.background} shadow-sm overflow-hidden transition-colors duration-200 px-6 py-5 flex flex-col flex-1 min-h-0`;


  return (
    <div className="w-full flex flex-col lg:flex-row gap-5 items-stretch shrink-0">
      {/* Left Card: Recent Documents */}
      <RecentDocuments data={data.recentDocuments} onExpand={onExpandDocuments} className={cardBaseClasses} />

      {/* Center Card: Recent Queries */}
      <RecentQueries data={data.recentQueries} onExpand={onExpandQueries} className={cardBaseClasses} />

      {/* Right Card: System Health */}
      <SystemHealth data={data.systemHealth} onExpand={onExpandHealth} className={cardBaseClasses} />
    </div>
  );
}

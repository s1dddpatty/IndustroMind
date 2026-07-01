"use client";

import React from "react";
import { useTheme } from "@/hooks/useTheme";
import { DESIGN_TOKENS } from "@/constants/design";

import { ProactiveAlerts } from "./ProactiveAlerts";
import { KnowledgeGraphOverview } from "./KnowledgeGraphOverview";
import { AIDecisionBrief } from "./AIDecisionBrief";
import { DashboardWorkspaceData } from "../constants/dashboardData";

interface WorkspaceRowProps {
  data: DashboardWorkspaceData;
  onExpand?: () => void;
  onExpandGraph?: () => void;
  onExpandBrief?: () => void;
  onGenerateBrief?: () => void;
}

export function WorkspaceRow({ data, onExpand, onExpandGraph, onExpandBrief, onGenerateBrief }: WorkspaceRowProps) {
  const { theme } = useTheme();
  const tokens = DESIGN_TOKENS[theme];
  
  const cardBaseClasses = `relative rounded-2xl border ${tokens.card.border} ${tokens.card.background} shadow-sm overflow-hidden transition-colors duration-200 px-6 py-2 flex flex-col min-h-0 max-lg:min-h-[400px] max-lg:h-auto`;

  return (
    <div className="w-full flex flex-col lg:flex-row gap-5 items-stretch flex-1 min-h-0">
      {/* Left Card: Proactive Alerts */}
      <ProactiveAlerts data={data.proactiveAlerts} onExpand={onExpand} className={`${cardBaseClasses} flex-[3]`} />

      {/* Center Card: Knowledge Graph Overview */}
      <KnowledgeGraphOverview data={data.knowledgeGraph} onExpand={onExpandGraph} className={`${cardBaseClasses} flex-[4]`} />

      {/* Right Card: AI Decision Brief */}
      <AIDecisionBrief 
        data={data.aiDecisionBrief} 
        onExpand={onExpandBrief}
        onGenerate={onGenerateBrief}
        className={`${cardBaseClasses} flex-[3]`} 
      />
    </div>
  );
}

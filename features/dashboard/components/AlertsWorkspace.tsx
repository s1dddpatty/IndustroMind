"use client";

import React from "react";
import { useTheme } from "@/hooks/useTheme";
import { DESIGN_TOKENS } from "@/constants/design";
import { AlertData } from "../constants/alerts";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { AlertSearch } from "./AlertSearch";
import { AlertFilters } from "./AlertFilters";
import { AlertCard } from "./AlertCard";

interface AlertsWorkspaceProps {
  alerts: AlertData[];
  onBack: () => void;
  onSelectAlert: (id: number) => void;
}

export function AlertsWorkspace({ alerts, onBack, onSelectAlert }: AlertsWorkspaceProps) {
  const { theme } = useTheme();
  const tokens = DESIGN_TOKENS[theme];

  return (
    <div className="flex flex-col w-full pb-8">
      {/* Header Area */}
      <div className="flex items-center gap-4 mb-5">
        <button 
          onClick={onBack}
          className="p-2 -ml-2 rounded-lg hover:bg-slate-800/50 transition-colors text-slate-400 hover:text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className={`text-2xl font-bold ${tokens.text.primary}`}>Proactive Alerts</h1>
          <p className={`${tokens.text.secondary} text-sm mt-1`}>Showing {alerts.length} active alerts</p>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <AlertSearch />
        <AlertFilters />
      </div>

      {/* Alert List */}
      <div className={`w-full rounded-xl border ${tokens.card.border} ${tokens.card.background} p-4 shadow-sm`}>
        <div className="flex flex-col space-y-1">
          {alerts.map((alert) => (
            <AlertCard 
              key={alert.id} 
              alert={alert}
              onClick={() => onSelectAlert(alert.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

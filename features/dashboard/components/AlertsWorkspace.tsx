"use client";

import React from "react";
import { useTheme } from "@/hooks/useTheme";
import { DESIGN_TOKENS } from "@/constants/design";
import { AlertData } from "../constants/alerts";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { AlertSearch } from "./AlertSearch";
import { AlertFilters } from "./AlertFilters";
import { AlertCard } from "./AlertCard";
import { useSystemDocuments } from "@/features/shared/hooks/useSystemDocuments";

interface AlertsWorkspaceProps {
  onBack: () => void;
  onSelectAlert: (id: number) => void;
}

const INGESTED_ALERTS: AlertData[] = [
  {
    id: 101,
    title: "Contradiction: SOP-MECH-042 vs OEM Manual",
    severity: "Critical",
    description: "SOP-MECH-042 requires isolation valve V-101 to be locked out before venting, but OEM manual rev 3 states V-101 must remain cracked open 5% during seal warm-up.",
    asset: "Centrifugal Pump P-204",
    timestamp: new Date().toISOString(),
    status: "Active"
  }
];

export function AlertsWorkspace({ onBack, onSelectAlert }: AlertsWorkspaceProps) {
  const { hasDocuments } = useSystemDocuments();
  const alerts = hasDocuments ? INGESTED_ALERTS : [];
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
      <div className={`w-full rounded-xl border ${tokens.card.border} ${tokens.card.background} p-4 shadow-sm min-h-[200px] flex flex-col`}>
        {alerts.length > 0 ? (
          <div className="flex flex-col space-y-1">
            {alerts.map((alert) => (
              <AlertCard 
                key={alert.id} 
                alert={alert}
                onClick={() => onSelectAlert(alert.id)}
              />
            ))}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-slate-500">
            <CheckCircle2 className="w-12 h-12 mb-3 opacity-40 text-emerald-500" />
            <p className="text-base font-semibold text-slate-300">No Active Alerts</p>
            <p className="text-xs text-slate-500 mt-1 max-w-sm">All operations and procedures are currently compliant. Contradiction scanner is standing by.</p>
          </div>
        )}
      </div>
    </div>
  );
}

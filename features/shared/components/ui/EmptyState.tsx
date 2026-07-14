"use client";

import React from "react";
import { useTheme } from "@/hooks/useTheme";
import { DESIGN_TOKENS } from "@/constants/design";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  const { theme } = useTheme();
  const tokens = DESIGN_TOKENS[theme];

  return (
    <div className={`w-full h-full min-h-[300px] flex flex-col items-center justify-center p-8 text-center rounded-2xl border border-dashed ${tokens.card.border} bg-slate-900/10`}>
      <div className="w-16 h-16 rounded-2xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-center mb-6">
        <Icon className="w-8 h-8 text-slate-500" />
      </div>
      <h3 className={`text-lg font-bold ${tokens.text.primary} mb-2`}>{title}</h3>
      <p className={`text-sm ${tokens.text.secondary} max-w-sm mb-6 leading-relaxed`}>{description}</p>
      
      {action && (
        <button 
          onClick={action.onClick}
          className={`px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-bold shadow-lg shadow-emerald-500/20 transition-all active:scale-95 flex items-center gap-2`}
        >
          <Icon className="w-4 h-4" /> {action.label}
        </button>
      )}
    </div>
  );
}

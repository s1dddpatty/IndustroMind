"use client";

import React from "react";
import { useTheme } from "@/hooks/useTheme";
import { DESIGN_TOKENS } from "@/constants/design";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ title = "Something went wrong", message, onRetry }: ErrorStateProps) {
  const { theme } = useTheme();
  const tokens = DESIGN_TOKENS[theme];

  return (
    <div className={`w-full p-6 rounded-2xl border border-red-500/20 bg-red-500/5 flex flex-col items-center justify-center text-center`}>
      <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
        <AlertTriangle className="w-6 h-6 text-red-500" />
      </div>
      <h3 className={`text-base font-bold text-red-400 mb-2`}>{title}</h3>
      <p className={`text-sm ${tokens.text.secondary} max-w-md mb-6`}>{message}</p>
      
      {onRetry && (
        <button 
          onClick={onRetry}
          className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-sm font-bold transition-all active:scale-95 flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" /> Try Again
        </button>
      )}
    </div>
  );
}

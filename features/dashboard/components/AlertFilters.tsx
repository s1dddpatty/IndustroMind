"use client";

import React from "react";
import { Filter, ArrowUpDown } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { DESIGN_TOKENS } from "@/constants/design";

export function AlertFilters() {
  const { theme } = useTheme();
  const tokens = DESIGN_TOKENS[theme];

  return (
    <div className="flex gap-2">
      <button className={`flex items-center gap-1.5 px-3 py-1.5 border ${tokens.card.border} rounded-lg text-sm font-medium ${tokens.text.secondary} hover:bg-slate-800/50 transition-colors`}>
        <Filter className="w-4 h-4" /> Filter
      </button>
      <button className={`flex items-center gap-1.5 px-3 py-1.5 border ${tokens.card.border} rounded-lg text-sm font-medium ${tokens.text.secondary} hover:bg-slate-800/50 transition-colors`}>
        <ArrowUpDown className="w-4 h-4" /> Sort
      </button>
    </div>
  );
}

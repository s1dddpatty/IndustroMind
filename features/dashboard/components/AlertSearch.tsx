"use client";

import React from "react";
import { Search } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { DESIGN_TOKENS } from "@/constants/design";

export function AlertSearch() {
  const { theme } = useTheme();
  const tokens = DESIGN_TOKENS[theme];

  return (
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
      <input 
        type="text" 
        placeholder="Search alerts..." 
        className={`w-full pl-9 pr-4 py-1.5 bg-transparent border ${tokens.card.border} rounded-lg text-sm ${tokens.text.primary} focus:outline-none focus:ring-1 focus:ring-emerald-500`}
      />
    </div>
  );
}

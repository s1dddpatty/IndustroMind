"use client";

import React, { memo } from "react";
import { Building2, ChevronDown } from "lucide-react";
import { DESIGN_TOKENS } from "@/constants/design";
import { useTheme } from "@/hooks/useTheme";

export const PlantSelector = memo(function PlantSelector() {
  const { theme } = useTheme();
  const navTokens = DESIGN_TOKENS[theme].navigation;

  return (
    <button 
      aria-label="Select Plant"
      className={`flex items-center gap-2 px-2 py-1.5 rounded-lg bg-transparent border-none ${navTokens.hover} shrink-0 transition-colors duration-200`}
    >
      <div className={`p-1 rounded ${navTokens.muted} transition-colors duration-200`}>
        <Building2 className="h-4 w-4" />
      </div>
      <div className="flex flex-col items-start justify-center text-left">
        <span className={`text-xs font-bold ${navTokens.text} leading-none mb-1 transition-colors duration-200`}>Sample Plant</span>
        <span className={`text-[10px] ${navTokens.muted} leading-none transition-colors duration-200`}>Steel Manufacturing</span>
      </div>
      <ChevronDown className={`h-4 w-4 ${navTokens.muted} ml-1 transition-colors duration-200`} />
    </button>
  );
});

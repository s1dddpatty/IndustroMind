"use client";

import React, { memo } from "react";
import { HelpCircle } from "lucide-react";
import { DESIGN_TOKENS } from "@/constants/design";
import { useTheme } from "@/hooks/useTheme";

export const HelpButton = memo(function HelpButton() {
  const { theme } = useTheme();
  const navTokens = DESIGN_TOKENS[theme].navigation;

  return (
    <button 
      aria-label="Help"
      className={`flex items-center justify-center h-10 w-10 rounded-full border ${navTokens.border} ${navTokens.muted} ${navTokens.hover} shrink-0 transition-colors duration-200`}
    >
      <HelpCircle className="h-4 w-4" />
    </button>
  );
});

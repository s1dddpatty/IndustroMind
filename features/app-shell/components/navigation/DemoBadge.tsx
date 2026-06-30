"use client";

import React, { memo } from "react";
import { DESIGN_TOKENS } from "@/constants/design";
import { useTheme } from "@/hooks/useTheme";

export const DemoBadge = memo(function DemoBadge() {
  const { theme } = useTheme();
  const navTokens = DESIGN_TOKENS[theme].navigation;

  return (
    <div className={`flex items-center justify-center px-4 py-2 rounded-full border border-brand/20 bg-brand/10 ${navTokens.accent} text-xs font-bold leading-none shrink-0 transition-colors duration-200`}>
      DEMO MODE
    </div>
  );
});

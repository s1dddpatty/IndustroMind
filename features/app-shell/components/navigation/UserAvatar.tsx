"use client";

import React, { memo } from "react";
import { DESIGN_TOKENS } from "@/constants/design";
import { useTheme } from "@/hooks/useTheme";

export const UserAvatar = memo(function UserAvatar() {
  const { theme } = useTheme();
  const navTokens = DESIGN_TOKENS[theme].navigation;

  return (
    <button 
      aria-label="User Profile"
      className={`flex items-center justify-center w-12 h-12 rounded-full ${navTokens.activeBg} text-white text-sm font-bold shrink-0 transition-colors duration-200`}
    >
      AD
    </button>
  );
});

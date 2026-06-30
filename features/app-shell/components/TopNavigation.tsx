"use client";

import React, { memo } from "react";
import { DESIGN_TOKENS } from "@/constants/design";
import { useTheme } from "@/hooks/useTheme";
import { DemoBadge } from "./navigation/DemoBadge";
import { PlantSelector } from "./navigation/PlantSelector";
import { SearchBar } from "./navigation/SearchBar";
import { NotificationButton } from "./navigation/NotificationButton";

export const TopNavigation = memo(function TopNavigation() {
  const { theme } = useTheme();
  const navTokens = DESIGN_TOKENS[theme].navigation;

  return (
    <header className={`flex items-center justify-between px-8 h-[72px] w-full ${navTokens.headerBg} border-b ${navTokens.headerBorder} shrink-0 transition-colors duration-200`}>
      
      {/* Left Group */}
      <div className="flex items-center gap-5">
        <DemoBadge />
        <PlantSelector />
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Center */}
      <div className="flex items-center justify-center">
        <SearchBar />
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right Group */}
      <div className="flex items-center gap-4">
        <NotificationButton />
      </div>

    </header>
  );
});

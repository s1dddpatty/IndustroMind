"use client";

import React, { memo } from "react";
import { Menu } from "lucide-react";
import { DESIGN_TOKENS } from "@/constants/design";
import { useTheme } from "@/hooks/useTheme";
import { DemoBadge } from "./navigation/DemoBadge";
import { PlantSelector } from "./navigation/PlantSelector";
import { SearchBar } from "./navigation/SearchBar";
import { NotificationButton } from "./navigation/NotificationButton";
import { useAppShell } from "../hooks/useAppShell";

export const TopNavigation = memo(function TopNavigation() {
  const { theme } = useTheme();
  const navTokens = DESIGN_TOKENS[theme].navigation;
  const { toggleMobileSidebar } = useAppShell();

  return (
    <header className={`flex items-center justify-between px-8 max-md:px-4 h-[72px] w-full ${navTokens.headerBg} border-b ${navTokens.headerBorder} shrink-0 transition-colors duration-200`}>
      
      {/* Left Group */}
      <div className="flex items-center gap-5 max-md:gap-3">
        <button 
          onClick={toggleMobileSidebar}
          className={`hidden max-lg:flex p-2 -ml-2 rounded-lg ${navTokens.muted} ${navTokens.hover} transition-colors`}
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="max-md:hidden">
          <DemoBadge />
        </div>
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

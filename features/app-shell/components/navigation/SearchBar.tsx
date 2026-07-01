"use client";

import React, { memo } from "react";
import { Search, Command } from "lucide-react";
import { DESIGN_TOKENS } from "@/constants/design";
import { useTheme } from "@/hooks/useTheme";

export const SearchBar = memo(function SearchBar() {
  const { theme } = useTheme();
  const navTokens = DESIGN_TOKENS[theme].navigation;

  return (
    <div className="relative flex items-center flex-1 w-full min-w-[380px] max-w-[480px] max-md:min-w-0 max-md:max-w-[40px] transition-all overflow-hidden group">
      <div className="absolute left-4 max-md:left-3 flex items-center justify-center pointer-events-none">
        <Search className={`h-4 w-4 ${navTokens.muted} transition-colors duration-200`} />
      </div>
      <input
        type="text"
        aria-label="Search"
        className={`w-full h-11 ${navTokens.searchBg} ${navTokens.searchBorder} ${navTokens.text} text-sm rounded-full pl-11 pr-12 max-md:pr-4 focus:outline-none focus:ring-1 ${navTokens.searchFocus} transition-colors duration-200 ${navTokens.searchPlaceholder}`}
        placeholder="Search everything..."
      />
      <div className="absolute right-4 flex items-center justify-center pointer-events-none max-md:hidden">
        <div className={`flex items-center gap-1 text-[10px] font-medium ${navTokens.muted} ${navTokens.kbdBg} px-1.5 py-0.5 rounded border ${navTokens.kbdBorder} transition-colors duration-200`}>
          <Command className="h-3 w-3" />
          <span>K</span>
        </div>
      </div>
    </div>
  );
});

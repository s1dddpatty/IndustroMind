"use client";

import { ReactNode, useMemo } from "react";
import { ThemeContext } from "@/contexts/theme-context";

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  // Hardcoded to dark for the enterprise application
  const contextValue = useMemo(() => ({
    theme: "dark" as const,
    setTheme: () => {},
    toggleTheme: () => {}
  }), []);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface AppShellContextType {
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (isOpen: boolean) => void;
  toggleMobileSidebar: () => void;
}

const AppShellContext = createContext<AppShellContextType | undefined>(undefined);

export function AppShellProvider({ children }: { children: ReactNode }) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(prev => !prev);
  };

  return (
    <AppShellContext.Provider value={{ isMobileSidebarOpen, setIsMobileSidebarOpen, toggleMobileSidebar }}>
      {children}
    </AppShellContext.Provider>
  );
}

export function useAppShell() {
  const context = useContext(AppShellContext);
  if (context === undefined) {
    throw new Error("useAppShell must be used within an AppShellProvider");
  }
  return context;
}

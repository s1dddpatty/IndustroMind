"use client";

import { createContext, useContext, ReactNode } from "react";

// The generic interface that the Dashboard expects
export interface DashboardData {
  kpis: any[];
  alerts: any[];
  graph: any;
  decisionBrief: any;
  documents: any[];
  queries: any[];
  systemHealth: any;
}

const DashboardContext = createContext<DashboardData | undefined>(undefined);

// This provider is used to inject whatever implementation (Demo vs Real API) into the Dashboard
export function DashboardAdapterProvider({ children, adapter }: { children: ReactNode, adapter: DashboardData }) {
  return (
    <DashboardContext.Provider value={adapter}>
      {children}
    </DashboardContext.Provider>
  );
}

// Widgets call this hook without knowing if it's Demo or Production
export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error("useDashboard must be used within a DashboardAdapterProvider");
  }
  return context;
}

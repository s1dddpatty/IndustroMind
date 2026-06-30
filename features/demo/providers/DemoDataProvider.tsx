"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { 
  demoKpis, 
  demoAlerts, 
  demoGraph, 
  demoDecisionBrief, 
  demoDocuments, 
  demoQueries, 
  demoSystemHealth 
} from "../data";

// The context type represents all the state our demo provides
interface DemoDataContextType {
  kpis: typeof demoKpis;
  alerts: typeof demoAlerts;
  graph: typeof demoGraph;
  decisionBrief: typeof demoDecisionBrief;
  documents: typeof demoDocuments;
  queries: typeof demoQueries;
  systemHealth: typeof demoSystemHealth;
}

const DemoDataContext = createContext<DemoDataContextType | undefined>(undefined);

// In demo mode, we just pass the static imported data down
// In a real application, this might fetch from an API and hold state
const DEMO_DATA_VALUE: DemoDataContextType = {
  kpis: demoKpis,
  alerts: demoAlerts,
  graph: demoGraph,
  decisionBrief: demoDecisionBrief,
  documents: demoDocuments,
  queries: demoQueries,
  systemHealth: demoSystemHealth,
};

export function DemoDataProvider({ children }: { children: ReactNode }) {
  return (
    <DemoDataContext.Provider value={DEMO_DATA_VALUE}>
      {children}
    </DemoDataContext.Provider>
  );
}

export function useDemoData() {
  const context = useContext(DemoDataContext);
  if (context === undefined) {
    throw new Error("useDemoData must be used within a DemoDataProvider");
  }
  return context;
}

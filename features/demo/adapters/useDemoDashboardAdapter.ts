import { useDemoData } from "../providers/DemoDataProvider";
import { DashboardData } from "@/features/dashboard/hooks/useDashboard";

export function useDemoDashboardAdapter(): DashboardData {
  const data = useDemoData();
  
  // In a more complex scenario, this adapter would map the raw data format
  // from the demo provider into the exact format the dashboard expects.
  // Since we designed the demo data specifically for this dashboard, it matches 1:1.
  
  return {
    kpis: data.kpis,
    alerts: data.alerts,
    graph: data.graph,
    decisionBrief: data.decisionBrief,
    documents: data.documents,
    queries: data.queries,
    systemHealth: data.systemHealth
  };
}

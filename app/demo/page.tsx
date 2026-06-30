"use client";

import { DashboardPage } from "@/features/dashboard/pages/DashboardPage";
import { DashboardAdapterProvider } from "@/features/dashboard/hooks/useDashboard";
import { useDemoDashboardAdapter } from "@/features/demo/adapters/useDemoDashboardAdapter";

export default function DemoDashboardRoute() {
  const adapter = useDemoDashboardAdapter();

  return (
    <DashboardAdapterProvider adapter={adapter}>
      <DashboardPage />
    </DashboardAdapterProvider>
  );
}

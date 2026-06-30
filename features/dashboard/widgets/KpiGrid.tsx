"use client";

import { useDashboard } from "../hooks/useDashboard";
import { StatCard } from "@/features/shared/components/StatCard";
import { DESIGN } from "@/features/shared/constants/design";

export function KpiGrid() {
  const { kpis } = useDashboard();

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5`}>
      {kpis.map((kpi) => (
        <StatCard 
          key={kpi.id}
          title={kpi.title}
          value={kpi.value}
          icon={kpi.icon}
          iconColorClass={kpi.iconColorClass}
          trend={kpi.trend}
          sparklineData={kpi.sparklineData}
        />
      ))}
    </div>
  );
}

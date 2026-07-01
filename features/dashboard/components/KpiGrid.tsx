import React from "react";
import { ShieldCheck, TriangleAlert, FileWarning, Activity, FileText } from "lucide-react";
import { KpiCard } from "./KpiCard";
import { KpiData } from "../constants/dashboardData";

const ICON_MAP: Record<string, React.ElementType> = {
  ShieldCheck,
  TriangleAlert,
  FileWarning,
  Activity,
  FileText
};

interface KpiGridProps {
  kpis: KpiData[];
}

export function KpiGrid({ kpis }: KpiGridProps) {
  return (
    <div className="w-full shrink-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 max-md:gap-5">
      {kpis.map((kpi) => {
        const IconComponent = ICON_MAP[kpi.iconName] || Activity;
        return (
          <KpiCard
            key={kpi.id}
            title={kpi.title}
            value={kpi.value}
            icon={IconComponent}
            color={kpi.color}
            trend={{
              value: kpi.trend.value,
              direction: kpi.trend.direction,
              text: kpi.trend.text,
              color: kpi.trend.colorOverride,
            }}
            sparklineData={kpi.sparklineData}
          />
        );
      })}
    </div>
  );
}

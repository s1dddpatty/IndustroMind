"use client";

import { CheckCircle2 } from "lucide-react";
import { Card } from "@/features/shared/components/ui/Card";
import { useDashboard } from "../hooks/useDashboard";
import { DESIGN } from "@/features/shared/constants/design";

export function SystemHealthOverview() {
  const { systemHealth } = useDashboard();

  return (
    <Card className="h-full w-full flex flex-col">
      <h3 className="text-sm font-bold text-white mb-4">System Health</h3>

      <div className="flex flex-1 items-center gap-6">
        
        {/* Services List */}
        <div className="flex-1 space-y-3">
          {systemHealth.services.map((service: any) => (
            <div key={service.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-brand-primary" />
                <span className="text-[11px] font-medium text-gray-300">{service.name}</span>
              </div>
              <span className="text-[10px] font-bold text-brand-primary/80">{service.status}</span>
            </div>
          ))}
        </div>

        {/* Health Gauge */}
        <div className="w-[45%] flex flex-col items-center justify-center shrink-0">
          <div className="relative w-20 h-20 flex items-center justify-center">
            {/* Background ring */}
            <svg className="absolute inset-0 w-full h-full transform -rotate-90">
              <circle cx="40" cy="40" r="36" className="stroke-gray-800" strokeWidth="6" fill="none" />
              {/* Foreground ring */}
              <circle 
                cx="40" 
                cy="40" 
                r="36" 
                className="stroke-brand-primary" 
                strokeWidth="6" 
                fill="none" 
                strokeDasharray={`${2 * Math.PI * 36}`}
                strokeDashoffset={`${2 * Math.PI * 36 * (1 - systemHealth.overallHealth / 100)}`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute text-xl font-bold text-white">{systemHealth.overallHealth}%</div>
          </div>
          <span className="text-[10px] text-gray-500 mt-2 font-medium">System Health</span>
        </div>

      </div>
    </Card>
  );
}

"use client";

import { AlertTriangle, ArrowRight } from "lucide-react";
import { Card } from "@/features/shared/components/ui/Card";
import { Badge } from "@/features/shared/components/ui/Badge";
import { useDashboard } from "../hooks/useDashboard";
import { DESIGN } from "@/features/shared/constants/design";

export function AlertFeed() {
  const { alerts } = useDashboard();
  const criticalCount = alerts.filter(a => a.priority === "Critical").length;

  return (
    <Card className="h-full w-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white">Proactive Alerts</h3>
        {criticalCount > 0 && (
          <Badge variant="danger">{criticalCount} Critical</Badge>
        )}
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2 min-h-0">
        {alerts.map((alert) => (
          <div key={alert.id} className="group relative flex gap-3 p-3 h-[72px] -mx-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
            <div className="mt-0.5 shrink-0">
              {alert.priority === "Critical" && <AlertTriangle className="h-5 w-5 text-red-400" />}
              {alert.priority === "High" && <AlertTriangle className="h-5 w-5 text-orange-400" />}
              {alert.priority === "Medium" && <AlertTriangle className="h-5 w-5 text-yellow-400" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-sm font-semibold text-white truncate pr-2">{alert.title}</h4>
                <Badge 
                  variant={alert.priority === 'Critical' ? 'danger' : alert.priority === 'High' ? 'warning' : 'default'}
                >
                  {alert.priority}
                </Badge>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed mb-2 line-clamp-2">
                {alert.description}
              </p>
              <div className="flex items-center gap-2 text-[10px] font-medium text-gray-500">
                <span>{alert.context}</span>
                <span>•</span>
                <span>{alert.timeAgo}</span>
              </div>
            </div>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-white" />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-800 text-right">
        <button className="text-xs font-bold text-brand-light flex items-center gap-1 ml-auto group">
          View all alerts
          <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </Card>
  );
}

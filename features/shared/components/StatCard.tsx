import { LucideIcon, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card } from "./ui/Card";
import { DESIGN } from "@/features/shared/constants/design";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
    direction: "up" | "down";
  };
  iconColorClass?: string;
  sparklineData?: number[];
}

export function StatCard({ title, value, icon: Icon, trend, iconColorClass = "text-gray-400", sparklineData }: StatCardProps) {
  return (
    <Card className="flex flex-col gap-2 justify-between max-h-[120px] w-full">
      <div className="flex items-center gap-2">
        <div className={`flex h-7 w-7 items-center justify-center rounded-md bg-gray-800/50 ${iconColorClass}`}>
          <Icon className="h-4 w-4" />
        </div>
        <h3 className="text-xs font-semibold text-gray-400">{title}</h3>
      </div>
      
      <div className="flex items-end justify-between">
        <div>
          <div className="text-2xl font-bold text-white leading-none">{value}</div>
          {trend && (
            <div className={`mt-1.5 flex items-center gap-1 text-[10px] font-bold ${trend.direction === 'up' ? 'text-green-400' : 'text-red-400'}`}>
              {trend.direction === 'up' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
              <span>{Math.abs(trend.value)}%</span>
              <span className="text-gray-500 font-medium">{trend.label}</span>
            </div>
          )}
        </div>
        
        {/* Simple CSS-based sparkline for the demo (to avoid heavy D3/ChartJS deps) */}
        {sparklineData && (
          <div className="flex items-end gap-1 h-8 opacity-70">
            {sparklineData.map((val, idx) => (
              <div 
                key={idx} 
                className={`w-1 rounded-t-sm ${trend?.direction === 'up' ? 'bg-green-500' : trend?.direction === 'down' ? 'bg-red-500' : 'bg-brand-primary'}`} 
                style={{ height: `${Math.max(20, (val / Math.max(...sparklineData)) * 100)}%` }} 
              />
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}

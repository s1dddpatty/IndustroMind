"use client";

import React from "react";
import { useTheme } from "@/hooks/useTheme";
import { DESIGN_TOKENS } from "@/constants/design";
import { ArrowUpRight, ArrowDownRight, ArrowUp, ArrowDown } from "lucide-react";

export interface KpiCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: "green" | "red" | "orange" | "purple" | "blue";
  trend: {
    value: string;
    direction: "up" | "down";
    text: string;
    color?: "green" | "red" | "orange" | "purple" | "blue"; // Overrides default color
  };
  sparklineData: number[];
}

function generateSparklinePath(data: number[], width: number, height: number): string {
  if (!data || data.length === 0) return "";
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min === 0 ? 1 : max - min;
  
  const step = width / (data.length - 1);
  return data.map((value, index) => {
    const x = index * step;
    const y = height - ((value - min) / range) * height;
    return `${index === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(" ");
}

const colorStyles = {
  green: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-600 dark:text-emerald-400",
    stroke: "stroke-emerald-500",
    fill: "fill-emerald-500/10",
  },
  red: {
    bg: "bg-red-500/10",
    text: "text-red-600 dark:text-red-400",
    stroke: "stroke-red-500",
    fill: "fill-red-500/10",
  },
  orange: {
    bg: "bg-orange-500/10",
    text: "text-orange-600 dark:text-orange-400",
    stroke: "stroke-orange-500",
    fill: "fill-orange-500/10",
  },
  purple: {
    bg: "bg-purple-500/10",
    text: "text-purple-600 dark:text-purple-400",
    stroke: "stroke-purple-500",
    fill: "fill-purple-500/10",
  },
  blue: {
    bg: "bg-blue-500/10",
    text: "text-blue-600 dark:text-blue-400",
    stroke: "stroke-blue-500",
    fill: "fill-blue-500/10",
  },
};

export const KpiCard = React.memo(function KpiCard({ title, value, icon: Icon, color, trend, sparklineData }: KpiCardProps) {
  const { theme } = useTheme();
  const tokens = DESIGN_TOKENS[theme];
  
  const mainStyle = colorStyles[color];
  const trendStyle = colorStyles[trend.color || color];
  const TrendIcon = trend.direction === "up" ? ArrowUp : ArrowDown;

  return (
    <div className={`relative w-full rounded-2xl border ${tokens.card.border} ${tokens.card.background} shadow-sm overflow-hidden transition-colors duration-200 px-5 py-2.5 flex flex-col justify-between`}>
      {/* Top: Icon + Title */}
      <div className="flex items-center gap-3 mb-1">
        <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${mainStyle.bg}`}>
          <Icon className={`h-4 w-4 ${mainStyle.text}`} />
        </div>
        <span className={`text-sm font-medium ${tokens.text.secondary} truncate`}>
          {title}
        </span>
      </div>

      {/* Middle: Value */}
      <div className="mb-1">
        <span className={`text-[28px] font-bold ${tokens.text.primary} leading-none tracking-tight`}>
          {value}
        </span>
      </div>

      {/* Bottom: Trend & Sparkline */}
      <div className="flex items-end justify-between mt-auto">
        <div className="flex items-center gap-1.5">
          <div className={`flex items-center font-semibold text-xs ${trendStyle.text}`}>
            <TrendIcon className="h-3 w-3 mr-0.5" strokeWidth={3} />
            {trend.value}
          </div>
          <span className="text-[10px] text-slate-500 truncate">
            {trend.text}
          </span>
        </div>
        
        {/* Dynamic Sparkline SVG */}
        <div className="w-12 h-6 opacity-80">
          {sparklineData && sparklineData.length > 0 && (() => {
            const strokePath = generateSparklinePath(sparklineData, 48, 16);
            const fillPath = `${strokePath} L 48 16 L 0 16 Z`;
            
            const min = Math.min(...sparklineData);
            const max = Math.max(...sparklineData);
            const range = max - min === 0 ? 1 : max - min;
            const lastY = 16 - ((sparklineData[sparklineData.length - 1] - min) / range) * 16;

            return (
              <svg viewBox="0 0 48 16" className="w-full h-full overflow-visible">
                <path d={fillPath} className={mainStyle.fill} stroke="none" />
                <path d={strokePath} className={mainStyle.stroke} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                {/* End point dot */}
                <circle cx="48" cy={lastY} r="2" className={mainStyle.stroke} fill="currentColor" />
              </svg>
            );
          })()}
        </div>
      </div>
    </div>
  );
});

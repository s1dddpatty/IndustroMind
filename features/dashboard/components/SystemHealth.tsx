"use client";

import React from "react";
import { useTheme } from "@/hooks/useTheme";
import { DESIGN_TOKENS } from "@/constants/design";
import { WorkspaceSectionData } from "../constants/dashboardData";
import { SystemModule, calculateOverallSystemHealth } from "../constants/systemHealthData";
import { Activity, CheckCircle2, AlertTriangle, XCircle, Wrench, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface SystemHealthProps {
  data: WorkspaceSectionData & { services?: SystemModule[] };
  onExpand?: () => void;
  className?: string;
}

export function SystemHealth({ data, onExpand, className = "" }: SystemHealthProps) {
  const { theme } = useTheme();
  const tokens = DESIGN_TOKENS[theme];
  
  const services = data.services || [];
  const topServices = services.slice(0, 3);
  const overallHealth = calculateOverallSystemHealth(services);
  
  // Circle math
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overallHealth / 100) * circumference;

  const getStatusIcon = (status: string) => {
    switch(status) {
      case "Healthy": 
      case "Operational": return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />;
      case "Warning": 
      case "Degraded": return <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />;
      case "Critical": 
      case "Offline": return <XCircle className="w-3.5 h-3.5 text-red-500" />;
      default: return <Wrench className="w-3.5 h-3.5 text-blue-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case "Healthy": 
      case "Operational": return "text-emerald-500";
      case "Warning": 
      case "Degraded": return "text-amber-500";
      case "Critical": 
      case "Offline": return "text-red-500";
      default: return "text-blue-500";
    }
  };

  return (
    <div 
      className={`${className} flex flex-col cursor-pointer group`}
      onClick={onExpand}
    >
      <div className="flex items-center justify-between mb-2">
        <h2 className={`text-lg font-bold ${tokens.text.primary}`}>{data.title}</h2>
        <div className="flex items-center gap-1 text-[13px] font-medium text-emerald-500 group-hover:text-emerald-400 transition-colors">
          View all <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
      
      <div className="flex-1 flex items-center justify-between mt-1 min-h-0 overflow-hidden">
        
        {/* Left: Services List */}
        <div className="flex-1 flex flex-col space-y-2 min-w-0 pr-4">
          {topServices.map(service => (
            <div key={service.id} className="flex items-center justify-between min-w-0">
              <div className="flex items-center gap-2 min-w-0">
                <div className="shrink-0">{getStatusIcon(service.status)}</div>
                <span className={`text-[13px] font-semibold ${tokens.text.primary} truncate group-hover:text-emerald-400 transition-colors`}>
                  {service.name}
                </span>
              </div>
              <span className={`text-[10px] font-medium shrink-0 ml-2 ${getStatusColor(service.status)}`}>
                {service.status}
              </span>
            </div>
          ))}
        </div>

        {/* Right: Circular Progress */}
        <div className="shrink-0 relative flex items-center justify-center w-24 h-24">
          <svg className="w-full h-full transform -rotate-90">
            <circle 
              cx="48" cy="48" r={radius} 
              stroke="currentColor" strokeWidth="6" fill="none" 
              className="text-slate-800" 
            />
            <motion.circle 
              cx="48" cy="48" r={radius} 
              stroke="currentColor" strokeWidth="6" fill="none" 
              className="text-emerald-500" 
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-xl font-bold ${tokens.text.primary}`}>{overallHealth}%</span>
            <span className="text-[9px] text-slate-500 uppercase tracking-wider font-semibold">Health</span>
          </div>
        </div>

      </div>
    </div>
  );
}

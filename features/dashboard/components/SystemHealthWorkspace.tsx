"use client";

import React, { useState, useMemo } from "react";
import { useTheme } from "@/hooks/useTheme";
import { DESIGN_TOKENS } from "@/constants/design";
import { SystemModule, calculateOverallSystemHealth } from "../constants/systemHealthData";
import { ArrowLeft, RefreshCw, Search, Filter, Activity, Server, Cpu, Database, Cloud, Shield, CheckCircle2, AlertTriangle, XCircle, Wrench, Clock, Zap } from "lucide-react";

interface SystemHealthWorkspaceProps {
  services: SystemModule[];
  onBack: () => void;
  onSelectService: (id: string) => void;
}

export function SystemHealthWorkspace({ services, onBack, onSelectService }: SystemHealthWorkspaceProps) {
  const { theme } = useTheme();
  const tokens = DESIGN_TOKENS[theme];
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("All");
  
  const overallHealth = calculateOverallSystemHealth(services);
  const healthyCount = services.filter(s => s.status === "Healthy" || s.status === "Operational").length;
  const warningCount = services.filter(s => s.status === "Warning" || s.status === "Degraded").length;
  const criticalCount = services.filter(s => s.status === "Critical" || s.status === "Offline").length;
  
  const avgResponseTime = Math.round(services.reduce((acc, curr) => acc + curr.responseTime, 0) / (services.length || 1));
  const avgCpu = Math.round(services.reduce((acc, curr) => acc + curr.cpuUsage, 0) / (services.length || 1));

  const filteredServices = useMemo(() => {
    return services.filter(s => {
      const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            s.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === "All" || s.category === filterCategory || s.status === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [services, searchTerm, filterCategory]);

  const getStatusIcon = (status: string) => {
    switch(status) {
      case "Healthy": 
      case "Operational": return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case "Warning": 
      case "Degraded": return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case "Critical": 
      case "Offline": return <XCircle className="w-5 h-5 text-red-500" />;
      default: return <Wrench className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="flex flex-col w-full pb-8">
      {/* Header Area */}
      <div className="flex flex-col gap-6 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="p-2 -ml-2 rounded-lg hover:bg-slate-800/50 transition-colors text-slate-400 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className={`text-2xl font-bold flex items-center gap-3 ${tokens.text.primary}`}>
                <Activity className="w-6 h-6 text-emerald-500" />
                Operations Center
              </h1>
              <div className="flex items-center gap-2 mt-1.5 text-xs text-emerald-500 font-medium bg-emerald-500/10 px-2 py-0.5 rounded-full w-fit border border-emerald-500/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Live Sync Active
              </div>
            </div>
          </div>
          <button className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 border ${tokens.card.border} text-sm font-medium transition-colors`}>
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* Quick Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <div className={`p-4 rounded-xl border ${tokens.card.border} bg-slate-900/50`}>
            <div className="text-sm text-slate-400 mb-1">Overall Health</div>
            <div className="text-2xl font-bold text-emerald-500">{overallHealth}%</div>
          </div>
          <div className={`p-4 rounded-xl border ${tokens.card.border} bg-slate-900/50`}>
            <div className="text-sm text-slate-400 mb-1">Services</div>
            <div className="text-2xl font-bold">{services.length}</div>
          </div>
          <div className={`p-4 rounded-xl border ${tokens.card.border} bg-slate-900/50`}>
            <div className="text-sm text-slate-400 mb-1">Healthy</div>
            <div className="text-2xl font-bold text-emerald-500">{healthyCount}</div>
          </div>
          <div className={`p-4 rounded-xl border border-amber-500/30 bg-amber-500/5`}>
            <div className="text-sm text-amber-500/80 mb-1">Warnings</div>
            <div className="text-2xl font-bold text-amber-500">{warningCount}</div>
          </div>
          <div className={`p-4 rounded-xl border ${tokens.card.border} bg-slate-900/50`}>
            <div className="text-sm text-slate-400 mb-1">Avg Response</div>
            <div className="text-2xl font-bold text-blue-500">{avgResponseTime}ms</div>
          </div>
          <div className={`p-4 rounded-xl border ${tokens.card.border} bg-slate-900/50`}>
            <div className="text-sm text-slate-400 mb-1">Avg CPU</div>
            <div className="text-2xl font-bold text-purple-500">{avgCpu}%</div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-3">
          <div className={`flex-1 max-w-md relative flex items-center bg-slate-900/50 rounded-lg border ${tokens.card.border}`}>
            <Search className="w-4 h-4 text-slate-400 absolute left-3" />
            <input 
              type="text" 
              placeholder="Search services..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent border-none text-sm text-white focus:outline-none focus:ring-0 py-2.5 pl-9 pr-4"
            />
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto pb-1 hide-scrollbar">
            {["All", "Healthy", "Warning", "Critical", "Infrastructure", "AI", "Processing"].map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  filterCategory === cat 
                    ? "bg-emerald-500 text-white" 
                    : `bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 border ${tokens.card.border}`
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredServices.map(service => (
          <div 
            key={service.id}
            onClick={() => onSelectService(service.id)}
            className={`p-5 rounded-xl border ${tokens.card.border} ${tokens.card.background} shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group flex flex-col`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-slate-800/50 border ${tokens.card.border}`}>
                  {service.category === "AI" && <Zap className="w-5 h-5 text-emerald-500" />}
                  {service.category === "Infrastructure" && <Server className="w-5 h-5 text-blue-500" />}
                  {service.category === "Processing" && <Cpu className="w-5 h-5 text-purple-500" />}
                  {service.category === "Knowledge" && <Database className="w-5 h-5 text-indigo-500" />}
                  {service.category === "Security" && <Shield className="w-5 h-5 text-amber-500" />}
                </div>
                <div>
                  <h3 className={`font-semibold ${tokens.text.primary} group-hover:text-emerald-400 transition-colors line-clamp-1`}>{service.name}</h3>
                  <span className={`text-[11px] font-medium px-1.5 py-0.5 rounded bg-slate-800 text-slate-300`}>
                    {service.category}
                  </span>
                </div>
              </div>
              <div className="shrink-0">
                {getStatusIcon(service.status)}
              </div>
            </div>
            
            <p className="text-xs text-slate-400 line-clamp-2 mb-4 flex-1">
              {service.description}
            </p>
            
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-800/50">
              <div>
                <div className="text-[10px] text-slate-500 uppercase font-semibold mb-1">Health</div>
                <div className="text-sm font-bold text-white flex items-center gap-1">
                  {service.healthScore}%
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 uppercase font-semibold mb-1">CPU</div>
                <div className="text-sm font-bold text-white">
                  {service.cpuUsage}%
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 uppercase font-semibold mb-1">Memory</div>
                <div className="text-sm font-bold text-white">
                  {service.memoryUsage}%
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 uppercase font-semibold mb-1">Latency</div>
                <div className="text-sm font-bold text-white">
                  {service.latency}ms
                </div>
              </div>
            </div>
            
            {(service.warningCount > 0 || service.criticalCount > 0) && (
              <div className="mt-4 pt-3 border-t border-slate-800/50 flex items-center gap-3">
                {service.criticalCount > 0 && (
                  <span className="text-xs font-semibold text-red-500 flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5" /> {service.criticalCount} Critical
                  </span>
                )}
                {service.warningCount > 0 && (
                  <span className="text-xs font-semibold text-amber-500 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> {service.warningCount} Warnings
                  </span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

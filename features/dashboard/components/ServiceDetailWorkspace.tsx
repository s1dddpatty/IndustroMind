"use client";

import React from "react";
import { useTheme } from "@/hooks/useTheme";
import { DESIGN_TOKENS } from "@/constants/design";
import { SystemModule, MOCK_SYSTEM_HEALTH } from "../constants/systemHealthData";
import { ArrowLeft, RefreshCw, Activity, Server, Cpu, Database, Cloud, Shield, CheckCircle2, AlertTriangle, XCircle, Wrench, Zap, TrendingUp, Clock, AlertCircle, Network, ShieldAlert } from "lucide-react";
import { SparklineChart, DependencyGraph, IncidentHistoryList, ServiceActionsBar } from "./service-detail/ServiceDetailComponents";

interface ServiceDetailWorkspaceProps {
  serviceId: string;
  onBack: () => void;
}

export function ServiceDetailWorkspace({ serviceId, onBack }: ServiceDetailWorkspaceProps) {
  const services = MOCK_SYSTEM_HEALTH;
  const { theme } = useTheme();
  const tokens = DESIGN_TOKENS[theme];
  
  const service = services.find(s => s.id === serviceId) || services[0];

  const getStatusIcon = (status: string, className = "w-5 h-5") => {
    switch(status) {
      case "Healthy": 
      case "Operational": return <CheckCircle2 className={`${className} text-emerald-500`} />;
      case "Warning": 
      case "Degraded": return <AlertTriangle className={`${className} text-amber-500`} />;
      case "Critical": 
      case "Offline": return <XCircle className={`${className} text-red-500`} />;
      default: return <Wrench className={`${className} text-blue-500`} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case "Healthy": 
      case "Operational": return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
      case "Warning": 
      case "Degraded": return "text-amber-500 bg-amber-500/10 border-amber-500/20";
      case "Critical": 
      case "Offline": return "text-red-500 bg-red-500/10 border-red-500/20";
      default: return "text-blue-500 bg-blue-500/10 border-blue-500/20";
    }
  };

  return (
    <div className="flex flex-col w-full pb-8">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 -ml-2 rounded-lg hover:bg-slate-800/50 transition-colors text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className={`text-sm font-medium ${tokens.text.secondary}`}>Operations Center / {service.category}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-3xl font-bold flex items-center gap-3 ${tokens.text.primary}`}>
              {service.name}
            </h1>
            <div className="flex items-center gap-4 mt-3">
              <span className={`px-2.5 py-1 rounded-md text-xs font-bold border flex items-center gap-1.5 ${getStatusColor(service.status)}`}>
                {getStatusIcon(service.status, "w-3.5 h-3.5")}
                {service.status}
              </span>
              <span className="text-sm font-medium text-slate-400 border-l border-slate-700 pl-4">
                v{service.version}
              </span>
              <span className="text-sm font-medium text-slate-400 border-l border-slate-700 pl-4 flex items-center gap-1.5">
                <Clock className="w-4 h-4" /> Uptime {service.uptime}%
              </span>
            </div>
          </div>
          <button className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 border ${tokens.card.border} text-sm font-medium transition-colors`}>
            <RefreshCw className="w-4 h-4" />
            Sync Metrics
          </button>
        </div>
      </div>

      {/* Main Grid: Grafana-style Modularity */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (Quick Vitals) */}
        <div className="lg:col-span-3 space-y-4">
          <div className={`p-5 rounded-xl border ${tokens.card.border} bg-slate-900/50 flex flex-col items-center justify-center py-8 text-center`}>
            <div className="text-sm text-slate-400 font-semibold mb-2">Overall Health Score</div>
            <div className={`text-5xl font-bold ${service.healthScore > 90 ? 'text-emerald-500' : service.healthScore > 75 ? 'text-amber-500' : 'text-red-500'}`}>
              {service.healthScore}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className={`p-4 rounded-xl border ${tokens.card.border} bg-slate-900/50`}>
              <Cpu className="w-4 h-4 text-purple-500 mb-2" />
              <div className="text-[10px] text-slate-500 uppercase font-semibold">CPU</div>
              <div className="text-xl font-bold">{service.cpuUsage}%</div>
            </div>
            <div className={`p-4 rounded-xl border ${tokens.card.border} bg-slate-900/50`}>
              <Database className="w-4 h-4 text-blue-500 mb-2" />
              <div className="text-[10px] text-slate-500 uppercase font-semibold">Memory</div>
              <div className="text-xl font-bold">{service.memoryUsage}%</div>
            </div>
            <div className={`p-4 rounded-xl border ${tokens.card.border} bg-slate-900/50`}>
              <Activity className="w-4 h-4 text-emerald-500 mb-2" />
              <div className="text-[10px] text-slate-500 uppercase font-semibold">Latency</div>
              <div className="text-xl font-bold">{service.latency}ms</div>
            </div>
            <div className={`p-4 rounded-xl border ${tokens.card.border} bg-slate-900/50`}>
              <Network className="w-4 h-4 text-indigo-500 mb-2" />
              <div className="text-[10px] text-slate-500 uppercase font-semibold">Queue</div>
              <div className="text-xl font-bold">{service.queueLength}</div>
            </div>
          </div>

          {(service.warningCount > 0 || service.criticalCount > 0) && (
            <div className={`p-4 rounded-xl border border-red-500/30 bg-red-500/10`}>
              <h3 className="text-sm font-semibold text-red-500 mb-2 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4" /> Active Alerts
              </h3>
              <div className="space-y-1 text-sm font-medium">
                {service.criticalCount > 0 && <div className="text-red-400">{service.criticalCount} Critical issues</div>}
                {service.warningCount > 0 && <div className="text-amber-400">{service.warningCount} Warnings</div>}
              </div>
            </div>
          )}
        </div>

        {/* Middle Section (Charts & History) */}
        <div className="lg:col-span-6 space-y-6">
          
          <div className="grid grid-cols-2 gap-4">
            <div className={`p-5 rounded-xl border ${tokens.card.border} bg-slate-900/50 flex flex-col`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-sm font-semibold ${tokens.text.primary}`}>CPU Trend</h3>
                <span className="text-xs text-slate-500 font-medium">Last 2 Hours</span>
              </div>
              <div className="flex-1 mt-auto">
                <SparklineChart data={service.history.cpu} color="purple" height={80} />
              </div>
            </div>

            <div className={`p-5 rounded-xl border ${tokens.card.border} bg-slate-900/50 flex flex-col`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-sm font-semibold ${tokens.text.primary}`}>Latency Trend</h3>
                <span className="text-xs text-slate-500 font-medium">Last 2 Hours</span>
              </div>
              <div className="flex-1 mt-auto">
                <SparklineChart data={service.history.latency} color="blue" height={80} />
              </div>
            </div>
          </div>

          <div className={`p-5 rounded-xl border ${tokens.card.border} bg-slate-900/50 flex flex-col`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-sm font-semibold ${tokens.text.primary}`}>Request Volume</h3>
              <div className="text-xl font-bold text-emerald-500">{service.history.requests[0]?.value} <span className="text-xs text-slate-400 font-medium uppercase">req/s</span></div>
            </div>
            <div className="flex-1 mt-4">
              <SparklineChart data={service.history.requests} color="emerald" height={100} />
            </div>
          </div>

          <div>
            <h3 className={`text-sm font-bold ${tokens.text.primary} mb-3 flex items-center gap-2 uppercase tracking-wide`}>
              Incident History
            </h3>
            <IncidentHistoryList incidents={service.incidents} />
          </div>

        </div>

        {/* Right Sidebar (Metadata & Dependencies) */}
        <div className="lg:col-span-3 space-y-6">
          
          <ServiceActionsBar />

          <div className={`p-5 rounded-xl border ${tokens.card.border} bg-slate-900/50 text-sm`}>
            <h3 className={`font-semibold ${tokens.text.primary} mb-4`}>Service Metadata</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between border-b border-slate-800/50 pb-2">
                <span className="text-slate-500 font-medium">Owner</span>
                <span className="text-white font-medium">{service.owner}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/50 pb-2">
                <span className="text-slate-500 font-medium">Environment</span>
                <span className="text-blue-400 font-medium">{service.environment}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/50 pb-2">
                <span className="text-slate-500 font-medium">Last Checked</span>
                <span className="text-white font-medium">{new Date(service.lastChecked).toLocaleTimeString()}</span>
              </div>
              <div className="flex justify-between pb-1">
                <span className="text-slate-500 font-medium">Last Deploy</span>
                <span className="text-white font-medium">{new Date(service.lastDeployment).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <DependencyGraph dependencies={service.dependencies} currentName={service.name} />

        </div>
      </div>
    </div>
  );
}

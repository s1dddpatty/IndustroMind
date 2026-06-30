import React from "react";
import { useTheme } from "@/hooks/useTheme";
import { DESIGN_TOKENS } from "@/constants/design";
import { DataPoint, DependencyReference, IncidentRecord } from "../../constants/systemHealthData";
import { Activity, Clock, Server, Terminal, AlertTriangle, ArrowRight, ShieldAlert, Wrench, RefreshCw, FileText, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

// -----------------------------------------
// Mini Chart Renderer
// -----------------------------------------
export function SparklineChart({ data, color = "emerald", height = 60 }: { data: DataPoint[], color?: "emerald" | "blue" | "purple" | "red", height?: number }) {
  if (!data || data.length === 0) return <div className="h-full flex items-center justify-center text-xs text-slate-500">No data</div>;
  
  const values = data.map(d => d.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  
  const colorMap = {
    emerald: "text-emerald-500",
    blue: "text-blue-500",
    purple: "text-purple-500",
    red: "text-red-500"
  };

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((d.value - min) / range) * 100;
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg className="w-full overflow-visible" style={{ height: `${height}px` }} preserveAspectRatio="none" viewBox="0 0 100 100">
      <polyline
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
        className={colorMap[color]}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

// -----------------------------------------
// Dependency Graph
// -----------------------------------------
export function DependencyGraph({ dependencies, currentName }: { dependencies: DependencyReference[], currentName: string }) {
  const { theme } = useTheme();
  const tokens = DESIGN_TOKENS[theme];

  const upstreams = dependencies.filter(d => d.type === "upstream");
  const downstreams = dependencies.filter(d => d.type === "downstream");

  return (
    <div className={`p-5 rounded-xl border ${tokens.card.border} bg-slate-900/50`}>
      <h3 className={`text-sm font-semibold ${tokens.text.primary} mb-4 flex items-center gap-2`}>
        <Activity className="w-4 h-4 text-blue-500" /> System Dependencies
      </h3>
      
      <div className="flex flex-col items-center gap-2">
        {upstreams.map(u => (
          <div key={u.id} className="flex flex-col items-center">
            <div className={`px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-xs font-medium cursor-pointer hover:border-emerald-500/50 transition-colors`}>
              {u.name}
            </div>
            <div className="h-4 w-px bg-slate-700 my-1"></div>
          </div>
        ))}
        
        <div className={`px-4 py-2 rounded-xl border-2 border-emerald-500/30 bg-emerald-500/10 text-sm font-bold text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.15)]`}>
          {currentName}
        </div>

        {downstreams.map(d => (
          <div key={d.id} className="flex flex-col items-center">
            <div className="h-4 w-px bg-slate-700 my-1"></div>
            <div className={`px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-xs font-medium cursor-pointer hover:border-emerald-500/50 transition-colors`}>
              {d.name}
            </div>
          </div>
        ))}

        {dependencies.length === 0 && (
          <span className="text-xs text-slate-500">No dependencies registered.</span>
        )}
      </div>
    </div>
  );
}

// -----------------------------------------
// Incident History List
// -----------------------------------------
export function IncidentHistoryList({ incidents }: { incidents: IncidentRecord[] }) {
  const { theme } = useTheme();
  const tokens = DESIGN_TOKENS[theme];

  if (incidents.length === 0) {
    return (
      <div className={`p-5 rounded-xl border ${tokens.card.border} bg-slate-900/50 flex flex-col items-center justify-center py-8`}>
        <CheckCircle2 className="w-8 h-8 text-emerald-500/50 mb-2" />
        <p className="text-sm text-slate-400 font-medium">No recent incidents</p>
      </div>
    );
  }

  return (
    <div className={`rounded-xl border ${tokens.card.border} bg-slate-900/50 overflow-hidden`}>
      <div className="flex flex-col divide-y divide-slate-800/50">
        {incidents.map(inc => (
          <div key={inc.id} className="p-4 flex gap-4 hover:bg-slate-800/30 transition-colors cursor-pointer">
            <div className="shrink-0 mt-0.5">
              {inc.type === "Incident" && <ShieldAlert className="w-4 h-4 text-red-500" />}
              {inc.type === "Maintenance" && <Wrench className="w-4 h-4 text-blue-500" />}
              {inc.type === "Deployment" && <Server className="w-4 h-4 text-purple-500" />}
              {inc.type === "Recovery" && <Activity className="w-4 h-4 text-emerald-500" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className={`text-sm font-semibold ${tokens.text.primary}`}>{inc.title}</span>
                <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${inc.status === 'Resolved' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                  {inc.status}
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-2 line-clamp-2">{inc.description}</p>
              <div className="flex items-center gap-3 text-[10px] text-slate-500 font-medium">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {new Date(inc.timestamp).toLocaleString()}
                </span>
                {inc.resolvedAt && (
                  <span className="flex items-center gap-1 text-emerald-500/70">
                    Recovered at {new Date(inc.resolvedAt).toLocaleTimeString()}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// -----------------------------------------
// Action Buttons
// -----------------------------------------
export function ServiceActionsBar() {
  const { theme } = useTheme();
  const tokens = DESIGN_TOKENS[theme];

  const actions = [
    { label: "View Logs", icon: Terminal, color: "text-blue-400" },
    { label: "Open Metrics", icon: Activity, color: "text-emerald-400" },
    { label: "Restart Service", icon: RefreshCw, color: "text-amber-400" },
    { label: "Related Alerts", icon: AlertTriangle, color: "text-red-400" },
    { label: "Related Docs", icon: FileText, color: "text-slate-300" }
  ];

  return (
    <div className={`p-4 rounded-xl border ${tokens.card.border} bg-slate-900/50 flex flex-col gap-2`}>
      <h3 className={`text-sm font-semibold ${tokens.text.primary} mb-2`}>Quick Actions</h3>
      {actions.map((action, i) => (
        <button key={i} className="flex items-center justify-between p-2 rounded hover:bg-slate-800/50 transition-colors text-sm text-slate-300 hover:text-white group">
          <span className="flex items-center gap-2">
            <action.icon className={`w-4 h-4 ${action.color}`} />
            {action.label}
          </span>
          <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      ))}
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import { DESIGN_TOKENS } from "@/constants/design";
import { ComplianceRule, COMPLIANCE_STATS } from "../constants/complianceData";
import { 
  ShieldCheck, 
  Search, 
  Filter, 
  Download, 
  ChevronRight, 
  AlertTriangle,
  FileText,
  Activity,
  BrainCircuit
} from "lucide-react";

interface ComplianceListWorkspaceProps {
  rules: ComplianceRule[];
  stats: typeof COMPLIANCE_STATS;
  loading: boolean;
  onSelectRule: (id: string) => void;
  onRunScan: () => void;
}

export function ComplianceListWorkspace({ rules, stats, loading, onSelectRule, onRunScan }: ComplianceListWorkspaceProps) {
  const { theme } = useTheme();
  const tokens = DESIGN_TOKENS[theme];
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRules = rules.filter(r => 
    r.regulationId.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.regulationName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col w-full h-full pb-8">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl bg-orange-500/10 text-orange-500`}>
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Compliance Intelligence</h1>
            <p className={`text-sm ${tokens.text.secondary}`}>AI-Powered Operational Audit & Risk</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className={`relative flex items-center bg-slate-900/50 rounded-xl border ${tokens.card.border}`}>
            <Search className="w-4 h-4 text-slate-400 absolute left-3" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search regulations..." 
              className="w-64 bg-transparent border-none text-sm text-white focus:outline-none focus:ring-0 py-2 pl-9 pr-3"
            />
          </div>
          <button className={`p-2 rounded-xl bg-slate-900/50 border ${tokens.card.border} hover:bg-slate-800 transition-colors text-slate-300`}>
            <Filter className="w-4 h-4" />
          </button>
          <button className={`p-2 rounded-xl bg-slate-900/50 border ${tokens.card.border} hover:bg-slate-800 transition-colors text-slate-300`}>
            <Download className="w-4 h-4" />
          </button>
          <button 
            onClick={onRunScan}
            disabled={loading}
            className={`px-4 py-2 rounded-xl bg-orange-500 text-slate-950 font-bold hover:bg-orange-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-[0_0_20px_rgba(249,115,22,0.3)]`}
          >
            {loading ? <Activity className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
            {loading ? "Scanning..." : "Run Integrity Scan"}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Overall Compliance", value: `${stats.overallScore}%`, icon: ShieldCheck, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "Open Violations", value: stats.openViolations, icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-500/10" },
          { label: "Critical Risk", value: stats.criticalViolations, icon: Activity, color: "text-red-500", bg: "bg-red-500/10" },
          { label: "Knowledge Coverage", value: `${stats.knowledgeCoverage}%`, icon: BrainCircuit, color: "text-cyan-500", bg: "bg-cyan-500/10" },
        ].map((stat, i) => (
          <div key={i} className={`p-5 rounded-2xl bg-slate-900/40 border ${tokens.card.border} flex items-center gap-4`}>
            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div>
              <p className={`text-xs font-medium ${tokens.text.secondary}`}>{stat.label}</p>
              <p className="text-xl font-bold text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Enterprise Table */}
      <div className={`flex-1 rounded-2xl bg-slate-900/40 border ${tokens.card.border} overflow-hidden flex flex-col`}>
        <div className={`max-md:hidden grid grid-cols-12 gap-4 p-4 border-b ${tokens.card.border} bg-slate-900/80 text-xs font-semibold ${tokens.text.secondary} uppercase tracking-wider`}>
          <div className="col-span-4">Regulation</div>
          <div className="col-span-2">Status & Severity</div>
          <div className="col-span-2">Score & Risk</div>
          <div className="col-span-2">Evidence Coverage</div>
          <div className="col-span-1">Impact</div>
          <div className="col-span-1 text-right">Actions</div>
        </div>

        <div className="flex-1 overflow-y-auto hide-scrollbar">
          {filteredRules.map((rule) => (
            <div 
              key={rule.id} 
              onClick={() => onSelectRule(rule.id)}
              className={`grid grid-cols-12 max-md:flex max-md:flex-col max-md:relative gap-4 max-md:gap-3 p-4 max-md:p-5 border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors cursor-pointer max-md:items-start items-center group`}
            >
              
              {/* Regulation Identity */}
              <div className="col-span-4 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                    rule.standard === 'OSHA' ? 'bg-orange-500/10 text-orange-400' :
                    rule.standard === 'API' ? 'bg-blue-500/10 text-blue-400' :
                    'bg-purple-500/10 text-purple-400'
                  }`}>
                    {rule.standard}
                  </span>
                  <h3 className="text-sm font-bold text-white group-hover:text-orange-400 transition-colors">{rule.regulationId}</h3>
                </div>
                <p className={`text-xs ${tokens.text.secondary} truncate pr-4`}>{rule.regulationName}</p>
              </div>

              {/* Status & Severity */}
              <div className="col-span-2 flex flex-col gap-1.5 justify-center">
                <div className="flex items-center gap-2">
                  <span className={`relative flex h-2 w-2`}>
                    {rule.status === "Non-Compliant" && (
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    )}
                    <span className={`relative inline-flex rounded-full h-2 w-2 ${
                      rule.status === "Compliant" ? "bg-emerald-500" :
                      rule.status === "Warning" ? "bg-amber-500" : "bg-red-500"
                    }`}></span>
                  </span>
                  <span className={`text-[11px] font-bold uppercase ${
                    rule.status === "Compliant" ? "text-emerald-500" :
                    rule.status === "Warning" ? "text-amber-500" : "text-red-500"
                  }`}>{rule.status}</span>
                </div>
                <div>
                  <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded border ${
                    rule.severity === 'Critical' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                    rule.severity === 'High' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' :
                    'bg-amber-500/10 text-amber-500 border-amber-500/20'
                  }`}>
                    {rule.severity}
                  </span>
                </div>
              </div>

              {/* Score & Risk */}
              <div className="col-span-2 flex flex-col gap-2 justify-center">
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden flex">
                    <div 
                      className={`h-full ${rule.complianceScore > 80 ? 'bg-emerald-500' : rule.complianceScore > 50 ? 'bg-amber-500' : 'bg-red-500'}`} 
                      style={{ width: `${rule.complianceScore}%` }} 
                    />
                  </div>
                  <span className={`text-[11px] font-bold ${rule.complianceScore > 80 ? 'text-emerald-400' : rule.complianceScore > 50 ? 'text-amber-400' : 'text-red-400'}`}>{rule.complianceScore}%</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className={`text-[10px] uppercase font-medium ${tokens.text.secondary}`}>Risk:</span>
                  <span className={`text-[11px] font-bold ${rule.riskScore > 70 ? 'text-red-500' : rule.riskScore > 30 ? 'text-amber-500' : 'text-emerald-500'}`}>
                    {rule.riskScore}
                  </span>
                </div>
              </div>

              {/* Evidence Coverage */}
              <div className="col-span-2 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-1">
                  <FileText className={`w-3.5 h-3.5 ${rule.evidenceCompleteness > 90 ? 'text-emerald-500' : rule.evidenceCompleteness > 60 ? 'text-amber-500' : 'text-red-500'}`} />
                  <span className={`text-[11px] font-bold text-white`}>{rule.evidenceCompleteness}% Found</span>
                </div>
                <span className={`text-[10px] ${tokens.text.secondary}`}>Conf: {rule.evaluationConfidence}%</span>
              </div>

              {/* Impact */}
              <div className="col-span-1 flex flex-col justify-center gap-1 text-[10px] uppercase font-bold">
                <div className="flex items-center gap-1.5">
                  <span className={`${rule.impact.safety === 'High' ? 'text-red-500' : rule.impact.safety === 'Medium' ? 'text-amber-500' : tokens.text.secondary}`}>S: {rule.impact.safety}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`${rule.impact.operational === 'High' ? 'text-red-500' : rule.impact.operational === 'Medium' ? 'text-amber-500' : tokens.text.secondary}`}>O: {rule.impact.operational}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="col-span-1 flex justify-end max-md:absolute max-md:top-5 max-md:right-5">
                <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-orange-400 transition-colors" />
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

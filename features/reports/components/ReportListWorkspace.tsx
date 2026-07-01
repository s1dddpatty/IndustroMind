"use client";

import React, { useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import { DESIGN_TOKENS } from "@/constants/design";
import { MOCK_INTELLIGENCE_REPORTS, REPORT_STATS } from "../constants/reportsData";
import { 
  Search, Filter, Download, ChevronRight, FileBarChart, 
  Sparkles, BrainCircuit, Activity, Clock, CheckCircle2, ShieldAlert
} from "lucide-react";

interface ReportListWorkspaceProps {
  onSelectReport: (id: string) => void;
  onGenerateReport: () => void;
}

export function ReportListWorkspace({ onSelectReport, onGenerateReport }: ReportListWorkspaceProps) {
  const { theme } = useTheme();
  const tokens = DESIGN_TOKENS[theme];
  const [searchQuery, setSearchQuery] = useState("");

  const filteredReports = MOCK_INTELLIGENCE_REPORTS.filter(r => 
    r.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col w-full h-full pb-8">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl bg-pink-500/10 text-pink-500`}>
            <FileBarChart className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Executive Reports</h1>
            <p className={`text-sm ${tokens.text.secondary}`}>AI-Generated Operational Intelligence</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className={`relative flex items-center bg-slate-900/50 rounded-xl border ${tokens.card.border}`}>
            <Search className="w-4 h-4 text-slate-400 absolute left-3" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reports..." 
              className="w-64 bg-transparent border-none text-sm text-white focus:outline-none focus:ring-0 py-2 pl-9 pr-3"
            />
          </div>
          
          <button 
            onClick={onGenerateReport}
            className={`px-4 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-sm font-bold text-white hover:from-pink-500 hover:to-purple-500 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(236,72,153,0.3)]`}
          >
            <Sparkles className="w-4 h-4" />
            Generate Intelligence
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Generated Today", value: REPORT_STATS.generatedToday, icon: Activity, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "Pending Approval", value: REPORT_STATS.pendingApproval, icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
          { label: "Critical Findings", value: REPORT_STATS.criticalReports, icon: ShieldAlert, color: "text-red-500", bg: "bg-red-500/10" },
          { label: "AI Briefs Created", value: REPORT_STATS.aiGeneratedBriefs, icon: BrainCircuit, color: "text-pink-500", bg: "bg-pink-500/10" },
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
          <div className="col-span-4">Report Details</div>
          <div className="col-span-2">Department & Time</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-3">AI Confidence</div>
          <div className="col-span-1 text-right">Actions</div>
        </div>

        <div className="flex-1 overflow-y-auto hide-scrollbar">
          {filteredReports.map((report) => (
            <div 
              key={report.id} 
              onClick={() => onSelectReport(report.id)}
              className={`grid grid-cols-12 max-md:flex max-md:flex-col max-md:relative gap-4 max-md:gap-3 p-4 max-md:p-5 border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors cursor-pointer max-md:items-start items-center group`}
            >
              
              {/* Report Details */}
              <div className="col-span-4 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-slate-800 ${tokens.text.primary}`}>
                    {report.category}
                  </span>
                  <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-pink-500/10 text-pink-400`}>
                    {report.reportType}
                  </span>
                </div>
                <h3 className="text-[13px] font-bold text-white group-hover:text-pink-400 transition-colors line-clamp-2">{report.title}</h3>
                <span className={`text-[10px] ${tokens.text.secondary} mt-0.5`}>By: {report.generatedBy}</span>
              </div>

              {/* Department & Time */}
              <div className="col-span-2 flex flex-col justify-center gap-1.5">
                <span className={`text-[11px] font-medium text-slate-300`}>{report.department}</span>
                <span className={`text-[10px] ${tokens.text.secondary}`}>{report.timeRange}</span>
              </div>

              {/* Status */}
              <div className="col-span-2 flex flex-col justify-center">
                <div className="flex items-center gap-2">
                  <span className={`relative flex h-2 w-2`}>
                    <span className={`relative inline-flex rounded-full h-2 w-2 ${
                      report.status === "Published" ? "bg-emerald-500" :
                      report.status === "Pending Approval" ? "bg-amber-500" : "bg-slate-500"
                    }`}></span>
                  </span>
                  <span className={`text-[11px] font-bold uppercase ${
                    report.status === "Published" ? "text-emerald-500" :
                    report.status === "Pending Approval" ? "text-amber-500" : "text-slate-500"
                  }`}>{report.status}</span>
                </div>
              </div>

              {/* Confidence */}
              <div className="col-span-3 flex flex-col gap-2 justify-center">
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden flex">
                    <div 
                      className={`h-full ${report.confidence.aiConfidence > 90 ? 'bg-emerald-500' : 'bg-amber-500'}`} 
                      style={{ width: `${report.confidence.aiConfidence}%` }} 
                    />
                  </div>
                  <span className={`text-[11px] font-bold ${report.confidence.aiConfidence > 90 ? 'text-emerald-400' : 'text-amber-400'}`}>Overall: {report.confidence.aiConfidence}%</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className={`text-[10px] uppercase font-medium ${tokens.text.secondary}`}>Evidence Conf:</span>
                  <span className={`text-[11px] font-bold text-white`}>
                    {report.confidence.evidenceConfidence}%
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="col-span-1 flex justify-end max-md:absolute max-md:top-5 max-md:right-5">
                <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-pink-400 transition-colors" />
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

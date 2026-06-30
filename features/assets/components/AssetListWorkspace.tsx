"use client";

import React, { useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import { DESIGN_TOKENS } from "@/constants/design";
import { MOCK_ASSETS, ASSET_STATS, Asset } from "../constants/assetData";
import { 
  Server, 
  Search, 
  Filter, 
  Download, 
  ChevronRight, 
  Activity, 
  AlertTriangle,
  BrainCircuit,
  FileText,
  ShieldCheck
} from "lucide-react";

interface AssetListWorkspaceProps {
  onSelectAsset: (id: string) => void;
}

export function AssetListWorkspace({ onSelectAsset }: AssetListWorkspaceProps) {
  const { theme } = useTheme();
  const tokens = DESIGN_TOKENS[theme];
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAssets = MOCK_ASSETS.filter(a => 
    a.assetName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    a.assetTag.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col w-full h-full pb-8">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500`}>
            <Server className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Asset Intelligence Hub</h1>
            <p className={`text-sm ${tokens.text.secondary}`}>Unified Asset & Operations Brain</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className={`relative flex items-center bg-slate-900/50 rounded-xl border ${tokens.card.border}`}>
            <Search className="w-4 h-4 text-slate-400 absolute left-3" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search assets..." 
              className="w-64 bg-transparent border-none text-sm text-white focus:outline-none focus:ring-0 py-2 pl-9 pr-3"
            />
          </div>
          <button className={`p-2 rounded-xl bg-slate-900/50 border ${tokens.card.border} hover:bg-slate-800 transition-colors text-slate-300`}>
            <Filter className="w-4 h-4" />
          </button>
          <button className={`p-2 rounded-xl bg-slate-900/50 border ${tokens.card.border} hover:bg-slate-800 transition-colors text-slate-300`}>
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Assets", value: ASSET_STATS.total, icon: Server, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Healthy Assets", value: ASSET_STATS.healthy, icon: Activity, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "Critical Assets", value: ASSET_STATS.critical, icon: ShieldCheck, color: "text-orange-500", bg: "bg-orange-500/10" },
          { label: "High Risk", value: ASSET_STATS.highRisk, icon: AlertTriangle, color: "text-red-500", bg: "bg-red-500/10" },
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

      {/* Hybrid Rich Table */}
      <div className={`flex-1 rounded-2xl bg-slate-900/40 border ${tokens.card.border} overflow-hidden flex flex-col`}>
        <div className={`grid grid-cols-12 gap-4 p-4 border-b ${tokens.card.border} bg-slate-900/80 text-xs font-semibold ${tokens.text.secondary} uppercase tracking-wider`}>
          <div className="col-span-3">Asset</div>
          <div className="col-span-2">Health & Risk</div>
          <div className="col-span-2">Operational State</div>
          <div className="col-span-2">Knowledge Coverage</div>
          <div className="col-span-2">AI Intelligence</div>
          <div className="col-span-1 text-right">Actions</div>
        </div>

        <div className="flex-1 overflow-y-auto hide-scrollbar">
          {filteredAssets.map((asset) => (
            <div 
              key={asset.id} 
              onClick={() => onSelectAsset(asset.id)}
              className={`grid grid-cols-12 gap-4 p-4 border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors cursor-pointer items-center group`}
            >
              
              {/* Asset Identity */}
              <div className="col-span-3 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-slate-700/50 ${
                  asset.criticality === "Critical" ? "bg-red-500/10 text-red-500" :
                  asset.criticality === "High" ? "bg-orange-500/10 text-orange-500" :
                  "bg-blue-500/10 text-blue-500"
                }`}>
                  <Server className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">{asset.assetTag}</h3>
                  <p className={`text-xs ${tokens.text.secondary} truncate pr-4`}>{asset.assetName}</p>
                </div>
              </div>

              {/* Health & Risk */}
              <div className="col-span-2 flex flex-col gap-1.5 justify-center">
                <div className="flex items-center gap-2">
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden flex">
                    <div 
                      className={`h-full ${asset.healthScore > 80 ? 'bg-emerald-500' : asset.healthScore > 50 ? 'bg-amber-500' : 'bg-red-500'}`} 
                      style={{ width: `${asset.healthScore}%` }} 
                    />
                  </div>
                  <span className={`text-xs font-medium w-8 ${asset.healthScore > 80 ? 'text-emerald-400' : asset.healthScore > 50 ? 'text-amber-400' : 'text-red-400'}`}>{asset.healthScore}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-md ${
                    asset.riskScore > 75 ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 
                    asset.riskScore > 30 ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 
                    'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  }`}>
                    Risk {asset.riskScore}
                  </span>
                </div>
              </div>

              {/* Operational State */}
              <div className="col-span-2 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-1">
                  <span className="relative flex h-2 w-2">
                    {asset.operationalState === "Running" && (
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    )}
                    <span className={`relative inline-flex rounded-full h-2 w-2 ${
                      asset.operationalState === "Running" ? "bg-emerald-500" :
                      asset.operationalState === "Standby" ? "bg-amber-500" : "bg-red-500"
                    }`}></span>
                  </span>
                  <span className={`text-xs font-medium ${tokens.text.primary}`}>{asset.operationalState}</span>
                </div>
                <span className={`text-[11px] ${tokens.text.secondary}`}>RUL: {asset.remainingUsefulLife}</span>
              </div>

              {/* Knowledge Coverage */}
              <div className="col-span-2 flex items-center gap-3">
                <div className={`relative flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                  asset.knowledgeCoverage.overallScore > 90 ? 'border-emerald-500/30' : 
                  asset.knowledgeCoverage.overallScore > 70 ? 'border-amber-500/30' : 
                  'border-red-500/30'
                }`}>
                  <span className="text-[10px] font-bold text-white">{asset.knowledgeCoverage.overallScore}</span>
                  <svg className="absolute inset-0 w-full h-full -rotate-90">
                    <circle cx="14" cy="14" r="14" fill="none" strokeWidth="2" stroke="currentColor" strokeDasharray="88" strokeDashoffset={88 - (88 * asset.knowledgeCoverage.overallScore) / 100} className={
                      asset.knowledgeCoverage.overallScore > 90 ? 'text-emerald-500' : 
                      asset.knowledgeCoverage.overallScore > 70 ? 'text-amber-500' : 
                      'text-red-500'
                    } />
                  </svg>
                </div>
                <div className="flex -space-x-1">
                  <div className="w-5 h-5 rounded bg-slate-800 border border-slate-700 flex items-center justify-center" title="SOPs Linked">
                    <FileText className={`w-3 h-3 ${asset.knowledgeCoverage.sopsLinked ? 'text-emerald-500' : 'text-slate-500'}`} />
                  </div>
                  <div className="w-5 h-5 rounded bg-slate-800 border border-slate-700 flex items-center justify-center" title="Compliance Mapped">
                    <ShieldCheck className={`w-3 h-3 ${asset.knowledgeCoverage.complianceMapped ? 'text-emerald-500' : 'text-slate-500'}`} />
                  </div>
                </div>
              </div>

              {/* AI Intelligence */}
              <div className="col-span-2 flex items-center">
                {asset.aiRecommendations.length > 0 ? (
                  <div className="flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 px-2 py-1 rounded-md">
                    <BrainCircuit className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="text-[11px] font-bold text-cyan-400">{asset.aiRecommendations.length} Recs</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 bg-slate-800/50 px-2 py-1 rounded-md">
                    <BrainCircuit className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-[11px] font-medium text-slate-500">Stable</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="col-span-1 flex justify-end">
                <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-emerald-400 transition-colors" />
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

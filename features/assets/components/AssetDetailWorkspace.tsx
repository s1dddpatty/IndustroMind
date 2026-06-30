"use client";

import React from "react";
import { useTheme } from "@/hooks/useTheme";
import { DESIGN_TOKENS } from "@/constants/design";
import { MOCK_ASSETS, Asset } from "../constants/assetData";
import { 
  ArrowLeft, Server, Activity, BrainCircuit, FileText, 
  ShieldCheck, AlertTriangle, Network, Wrench, Clock,
  CheckCircle2, XCircle, Info
} from "lucide-react";
import { useRouter } from "next/navigation";

interface AssetDetailWorkspaceProps {
  assetId: string;
  onBack: () => void;
}

export function AssetDetailWorkspace({ assetId, onBack }: AssetDetailWorkspaceProps) {
  const { theme } = useTheme();
  const tokens = DESIGN_TOKENS[theme];
  const router = useRouter();

  const asset = MOCK_ASSETS.find(a => a.id === assetId);

  if (!asset) return null;

  const healthColor = asset.healthScore > 80 ? 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' : 
                      asset.healthScore > 50 ? 'text-amber-500 bg-amber-500/10 border-amber-500/20' : 
                      'text-red-500 bg-red-500/10 border-red-500/20';

  return (
    <div className="flex flex-col w-full pb-12">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={onBack}
          className="p-2 -ml-2 rounded-lg hover:bg-slate-800/50 transition-colors text-slate-400 hover:text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className={`text-sm font-medium ${tokens.text.secondary}`}>Back to Asset Intelligence Hub</span>
      </div>

      {/* Asset Identity Banner */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 rounded-2xl bg-slate-900/60 border ${tokens.card.border} mb-6`}>
        <div className="flex items-center gap-5">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border ${healthColor}`}>
            <Server className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-bold text-white tracking-tight">{asset.assetTag}</h1>
              <span className={`px-2.5 py-1 text-xs font-bold uppercase rounded-md border ${
                asset.criticality === "Critical" ? "bg-red-500/10 text-red-500 border-red-500/20" :
                asset.criticality === "High" ? "bg-orange-500/10 text-orange-500 border-orange-500/20" :
                "bg-blue-500/10 text-blue-500 border-blue-500/20"
              }`}>
                {asset.criticality} Criticality
              </span>
            </div>
            <p className={`text-sm font-medium ${tokens.text.secondary}`}>{asset.assetName} &bull; {asset.manufacturer} {asset.model}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={() => router.push("/demo/knowledge-graph")} className={`px-4 py-2 rounded-xl bg-slate-800 border ${tokens.card.border} text-sm font-medium text-white hover:bg-slate-700 transition-colors flex items-center gap-2`}>
            <Network className="w-4 h-4 text-emerald-400" />
            View in Graph
          </button>
          <button onClick={() => router.push("/demo/decision-assistant")} className={`px-4 py-2 rounded-xl bg-emerald-500 text-sm font-bold text-slate-950 hover:bg-emerald-400 transition-colors flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)]`}>
            <BrainCircuit className="w-4 h-4" />
            Ask Decision Assistant
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Section 1: Executive AI Summary */}
          <div className={`p-6 rounded-2xl bg-gradient-to-br from-cyan-950/30 to-slate-900/60 border border-cyan-500/20 relative overflow-hidden group`}>
            <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500/50" />
            <h2 className="text-sm font-bold text-cyan-400 mb-3 flex items-center gap-2">
              <BrainCircuit className="w-5 h-5" />
              Executive AI Summary
            </h2>
            <p className="text-[15px] leading-relaxed text-slate-300 font-medium">
              {asset.executiveAiSummary}
            </p>
          </div>

          {/* Section 2: Operational Health */}
          <div className={`p-6 rounded-2xl bg-slate-900/40 border ${tokens.card.border}`}>
            <h2 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-500" />
              Operational Health
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex flex-col p-4 rounded-xl bg-slate-950/50 border border-slate-800/50">
                <span className={`text-[11px] uppercase font-bold mb-1 ${tokens.text.secondary}`}>Health Score</span>
                <span className="text-2xl font-bold text-white">{asset.healthScore}%</span>
              </div>
              <div className="flex flex-col p-4 rounded-xl bg-slate-950/50 border border-slate-800/50">
                <span className={`text-[11px] uppercase font-bold mb-1 ${tokens.text.secondary}`}>Risk Score</span>
                <span className={`text-2xl font-bold ${asset.riskScore > 70 ? 'text-red-500' : 'text-amber-500'}`}>{asset.riskScore}</span>
              </div>
              <div className="flex flex-col p-4 rounded-xl bg-slate-950/50 border border-slate-800/50">
                <span className={`text-[11px] uppercase font-bold mb-1 ${tokens.text.secondary}`}>Failure Prob.</span>
                <span className={`text-2xl font-bold ${asset.failureProbability > 50 ? 'text-red-500' : 'text-emerald-500'}`}>{asset.failureProbability}%</span>
              </div>
              <div className="flex flex-col p-4 rounded-xl bg-slate-950/50 border border-slate-800/50">
                <span className={`text-[11px] uppercase font-bold mb-1 ${tokens.text.secondary}`}>Useful Life</span>
                <span className="text-2xl font-bold text-white">{asset.remainingUsefulLife}</span>
              </div>
            </div>
          </div>

          {/* Section 5: Maintenance Timeline */}
          <div className={`p-6 rounded-2xl bg-slate-900/40 border ${tokens.card.border}`}>
            <h2 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-500" />
              Maintenance & Intelligence Timeline
            </h2>
            <div className="relative border-l border-slate-700/50 ml-4 space-y-6 pb-2">
              {asset.maintenanceTimeline.map((evt, idx) => (
                <div key={evt.id} className="relative pl-6">
                  <div className={`absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full ring-4 ring-slate-900 ${
                    evt.type === 'AI Recommendation' ? 'bg-cyan-500' :
                    evt.type === 'Failure' || evt.status === 'Critical' ? 'bg-red-500' :
                    evt.type === 'Inspection' ? 'bg-amber-500' : 'bg-emerald-500'
                  }`} />
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-xs font-bold text-slate-400">{evt.date}</span>
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md ${
                      evt.type === 'AI Recommendation' ? 'bg-cyan-500/10 text-cyan-400' :
                      'bg-slate-800 text-slate-300'
                    }`}>{evt.type}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1">{evt.title}</h3>
                  <p className={`text-[13px] ${tokens.text.secondary}`}>{evt.description}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column */}
        <div className="space-y-6">

          {/* Section 7: AI Recommendations */}
          <div className={`p-5 rounded-2xl bg-slate-900/40 border ${tokens.card.border}`}>
            <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              AI Recommendations
            </h2>
            {asset.aiRecommendations.length > 0 ? (
              <div className="space-y-3">
                {asset.aiRecommendations.map(rec => (
                  <div key={rec.id} className="p-3 bg-slate-950/50 rounded-xl border border-slate-800/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[13px] font-bold text-white">{rec.action}</span>
                      <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                        rec.priority === 'High' ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-500'
                      }`}>{rec.priority}</span>
                    </div>
                    <p className={`text-[11px] ${tokens.text.secondary} mb-2`}>{rec.reason}</p>
                    <div className="flex items-center gap-1.5 text-[10px] font-medium text-emerald-500">
                      <Clock className="w-3 h-3" />
                      {rec.timeframe}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 flex items-center justify-center border border-dashed border-slate-700/50 rounded-xl">
                <span className={`text-xs ${tokens.text.secondary}`}>No active recommendations</span>
              </div>
            )}
          </div>

          {/* Section 3: Knowledge Coverage */}
          <div className={`p-5 rounded-2xl bg-slate-900/40 border ${tokens.card.border}`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Network className="w-4 h-4 text-purple-500" />
                Knowledge Coverage
              </h2>
              <span className="text-lg font-bold text-white">{asset.knowledgeCoverage.overallScore}%</span>
            </div>
            <div className="space-y-2">
              <CoverageItem label="SOPs Linked" status={asset.knowledgeCoverage.sopsLinked} />
              <CoverageItem label="Datasheet Available" status={asset.knowledgeCoverage.datasheetLinked} />
              <CoverageItem label="Inspection Reports" status={asset.knowledgeCoverage.inspectionReportsAvailable} />
              <CoverageItem label="Maintenance History" status={asset.knowledgeCoverage.maintenanceHistoryAvailable} />
              <CoverageItem label="Compliance Mapped" status={asset.knowledgeCoverage.complianceMapped} />
              <CoverageItem label="Spare Parts Docs" status={!asset.knowledgeCoverage.sparePartsDocumentationMissing} />
            </div>
          </div>

          {/* Section 6: Compliance */}
          <div className={`p-5 rounded-2xl bg-slate-900/40 border ${tokens.card.border}`}>
            <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-orange-500" />
              Compliance
            </h2>
            <div className="space-y-3">
              {asset.compliance.map(comp => (
                <div key={comp.id} className="p-3 bg-slate-950/50 rounded-xl border border-slate-800/50">
                  <div className="flex items-start justify-between mb-1">
                    <span className="text-[13px] font-bold text-white leading-tight">{comp.regulation}</span>
                    <span className="flex items-center gap-1">
                      {comp.status === 'Compliant' ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                      )}
                    </span>
                  </div>
                  <p className={`text-[11px] ${tokens.text.secondary} line-clamp-2`}>{comp.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Related Knowledge */}
          <div className={`p-5 rounded-2xl bg-slate-900/40 border ${tokens.card.border}`}>
            <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-500" />
              Related Knowledge
            </h2>
            <div className="space-y-2">
              {asset.relatedKnowledge.map(rk => (
                <div key={rk.id} className="flex items-center justify-between p-2.5 bg-slate-950/50 rounded-lg hover:bg-slate-800/50 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-md bg-slate-800">
                      {rk.type === 'Document' || rk.type === 'SOP' ? <FileText className="w-3.5 h-3.5 text-blue-400" /> :
                       rk.type === 'AI Brief' ? <BrainCircuit className="w-3.5 h-3.5 text-cyan-400" /> :
                       rk.type === 'Alert' ? <AlertTriangle className="w-3.5 h-3.5 text-red-400" /> :
                       <ShieldCheck className="w-3.5 h-3.5 text-orange-400" />}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[12px] font-medium text-slate-200 group-hover:text-emerald-400 transition-colors">{rk.title}</span>
                      <span className={`text-[10px] ${tokens.text.secondary}`}>{rk.type} &bull; {rk.relevanceScore}% Match</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

function CoverageItem({ label, status }: { label: string, status: boolean }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-[13px] font-medium text-slate-300">{label}</span>
      {status ? (
        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
      ) : (
        <XCircle className="w-4 h-4 text-slate-600" />
      )}
    </div>
  );
}

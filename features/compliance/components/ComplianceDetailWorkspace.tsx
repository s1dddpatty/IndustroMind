"use client";

import React from "react";
import { useTheme } from "@/hooks/useTheme";
import { DESIGN_TOKENS } from "@/constants/design";
import { MOCK_COMPLIANCE_RULES, ComplianceRule } from "../constants/complianceData";
import { 
  ArrowLeft, ShieldCheck, Activity, BrainCircuit, FileText, 
  AlertTriangle, Network, Clock, CheckCircle2, XCircle, 
  Server, Calendar
} from "lucide-react";
import { useRouter } from "next/navigation";

interface ComplianceDetailWorkspaceProps {
  ruleId: string;
  onBack: () => void;
}

export function ComplianceDetailWorkspace({ ruleId, onBack }: ComplianceDetailWorkspaceProps) {
  const { theme } = useTheme();
  const tokens = DESIGN_TOKENS[theme];
  const router = useRouter();

  const rule = MOCK_COMPLIANCE_RULES.find(r => r.id === ruleId);
  if (!rule) return null;

  const statusColor = rule.status === "Compliant" ? 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' : 
                      rule.status === "Warning" ? 'text-amber-500 bg-amber-500/10 border-amber-500/20' : 
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
        <span className={`text-sm font-medium ${tokens.text.secondary}`}>Back to Compliance Intelligence</span>
      </div>

      {/* Regulation Identity Banner */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 rounded-2xl bg-slate-900/60 border ${tokens.card.border} mb-6`}>
        <div className="flex items-center gap-5">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border ${statusColor}`}>
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-slate-800 text-slate-300`}>
                {rule.standard}
              </span>
              <h1 className="text-3xl font-bold text-white tracking-tight">{rule.regulationId}</h1>
            </div>
            <p className={`text-sm font-medium ${tokens.text.secondary}`}>{rule.regulationName}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={() => router.push("/demo/knowledge-graph")} className={`px-4 py-2 rounded-xl bg-slate-800 border ${tokens.card.border} text-sm font-medium text-white hover:bg-slate-700 transition-colors flex items-center gap-2`}>
            <Network className="w-4 h-4 text-orange-400" />
            View Graph Evidence
          </button>
          <button onClick={() => router.push("/demo/decision-assistant")} className={`px-4 py-2 rounded-xl bg-orange-500 text-sm font-bold text-slate-950 hover:bg-orange-400 transition-colors flex items-center gap-2 shadow-[0_0_20px_rgba(249,115,22,0.3)]`}>
            <BrainCircuit className="w-4 h-4" />
            Ask Decision Assistant
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Section 1: Executive AI Summary & Impact */}
          <div className={`p-6 rounded-2xl bg-gradient-to-br from-orange-950/30 to-slate-900/60 border border-orange-500/20 relative overflow-hidden group`}>
            <div className="absolute top-0 left-0 w-1 h-full bg-orange-500/50" />
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <h2 className="text-sm font-bold text-orange-400 mb-3 flex items-center gap-2">
                  <BrainCircuit className="w-5 h-5" />
                  Executive AI Summary
                </h2>
                <p className="text-[15px] leading-relaxed text-slate-300 font-medium mb-4">
                  {rule.executiveAiSummary}
                </p>
                <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800/50">
                  <h3 className="text-[11px] uppercase font-bold text-slate-400 mb-2">AI Reasoning</h3>
                  <p className="text-[13px] text-slate-300">{rule.aiReasoning}</p>
                </div>
              </div>
              <div className="w-full md:w-48 shrink-0 flex flex-col gap-2">
                <h3 className="text-[11px] uppercase font-bold text-slate-400 mb-1">Impact Analysis</h3>
                <ImpactRow label="Safety" level={rule.impact.safety} />
                <ImpactRow label="Operational" level={rule.impact.operational} />
                <ImpactRow label="Financial" level={rule.impact.financial} />
                <ImpactRow label="Environmental" level={rule.impact.environmental} />
              </div>
            </div>
          </div>

          {/* Section 2: Continuous Monitoring Overview */}
          <div className={`p-6 rounded-2xl bg-slate-900/40 border ${tokens.card.border}`}>
            <h2 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-500" />
              Continuous Monitoring Status
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="flex flex-col p-4 rounded-xl bg-slate-950/50 border border-slate-800/50">
                <span className={`text-[11px] uppercase font-bold mb-1 ${tokens.text.secondary}`}>Compliance Score</span>
                <span className={`text-2xl font-bold ${rule.complianceScore > 80 ? 'text-emerald-500' : rule.complianceScore > 50 ? 'text-amber-500' : 'text-red-500'}`}>{rule.complianceScore}%</span>
              </div>
              <div className="flex flex-col p-4 rounded-xl bg-slate-950/50 border border-slate-800/50">
                <span className={`text-[11px] uppercase font-bold mb-1 ${tokens.text.secondary}`}>Risk Score</span>
                <span className={`text-2xl font-bold ${rule.riskScore > 70 ? 'text-red-500' : 'text-amber-500'}`}>{rule.riskScore}</span>
              </div>
              <div className="flex flex-col p-4 rounded-xl bg-slate-950/50 border border-slate-800/50">
                <span className={`text-[11px] uppercase font-bold mb-1 ${tokens.text.secondary}`}>AI Confidence</span>
                <span className="text-2xl font-bold text-white">{rule.evaluationConfidence}%</span>
              </div>
              <div className="flex flex-col p-4 rounded-xl bg-slate-950/50 border border-slate-800/50">
                <span className={`text-[11px] uppercase font-bold mb-1 ${tokens.text.secondary}`}>Evidence Freshness</span>
                <span className={`text-lg font-bold mt-1 ${rule.evidenceFreshness === 'Fresh' ? 'text-emerald-500' : 'text-amber-500'}`}>{rule.evidenceFreshness}</span>
              </div>
            </div>
            <div className="flex items-center gap-6 px-4 py-3 bg-slate-950/50 rounded-xl border border-slate-800/50">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span className={`text-xs ${tokens.text.secondary}`}>Last Evaluated: <strong className="text-white ml-1">{new Date(rule.lastEvaluated).toLocaleString()}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" />
                <span className={`text-xs ${tokens.text.secondary}`}>Next Scan: <strong className="text-white ml-1">{new Date(rule.nextScheduledEvaluation).toLocaleString()}</strong></span>
              </div>
            </div>
          </div>

          {/* Section 6: Violation Timeline */}
          <div className={`p-6 rounded-2xl bg-slate-900/40 border ${tokens.card.border}`}>
            <h2 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-500" />
              Compliance Timeline
            </h2>
            <div className="relative border-l border-slate-700/50 ml-4 space-y-6 pb-2">
              {rule.timeline.map((evt) => (
                <div key={evt.id} className="relative pl-6">
                  <div className={`absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full ring-4 ring-slate-900 ${
                    evt.type === 'Alert Generated' ? 'bg-orange-500' :
                    evt.type === 'Violation Detected' || evt.status === 'Critical' ? 'bg-red-500' :
                    evt.type === 'Inspection' || evt.type === 'Verification' ? 'bg-emerald-500' : 'bg-blue-500'
                  }`} />
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-xs font-bold text-slate-400">{evt.date}</span>
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md ${
                      evt.status === 'Critical' ? 'bg-red-500/10 text-red-400' :
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
              AI Required Actions
            </h2>
            {rule.aiRecommendations.length > 0 ? (
              <div className="space-y-3">
                {rule.aiRecommendations.map(rec => (
                  <div key={rec.id} className="p-4 bg-slate-950/50 rounded-xl border border-slate-800/50 group hover:border-amber-500/30 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                        rec.priority === 'Critical' ? 'bg-red-500/10 text-red-500' : 
                        rec.priority === 'High' ? 'bg-orange-500/10 text-orange-500' : 'bg-amber-500/10 text-amber-500'
                      }`}>{rec.priority}</span>
                      <span className={`text-[10px] font-medium ${tokens.text.secondary}`}>{rec.type}</span>
                    </div>
                    <span className="block text-[13px] font-bold text-white mb-1">{rec.action}</span>
                    <p className={`text-[11px] ${tokens.text.secondary}`}>{rec.reason}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 flex items-center justify-center border border-dashed border-slate-700/50 rounded-xl">
                <span className={`text-xs ${tokens.text.secondary}`}>No required actions pending.</span>
              </div>
            )}
          </div>

          {/* Section 4: Affected Assets */}
          <div className={`p-5 rounded-2xl bg-slate-900/40 border ${tokens.card.border}`}>
            <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <Server className="w-4 h-4 text-blue-500" />
              Affected Assets
            </h2>
            <div className="space-y-2">
              {rule.affectedAssets.map(asset => (
                <div key={asset.id} onClick={() => router.push("/demo/assets")} className="flex items-center justify-between p-3 bg-slate-950/50 rounded-xl hover:bg-slate-800/80 border border-slate-800/50 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-md bg-blue-500/10 text-blue-400">
                      <Server className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[13px] font-bold text-slate-200 group-hover:text-blue-400 transition-colors">{asset.assetTag}</span>
                      <span className={`text-[11px] ${tokens.text.secondary}`}>{asset.assetName}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Evidence Center */}
          <div className={`p-5 rounded-2xl bg-slate-900/40 border ${tokens.card.border}`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-500" />
                Evidence Center
              </h2>
              <span className={`text-xs font-bold ${rule.evidenceCompleteness === 100 ? 'text-emerald-500' : 'text-amber-500'}`}>{rule.evidenceCompleteness}% Found</span>
            </div>
            <div className="space-y-2">
              {rule.evidence.map(ev => (
                <div key={ev.id} onClick={() => router.push("/demo/documents")} className="flex items-center justify-between p-3 bg-slate-950/50 rounded-xl hover:bg-slate-800/80 border border-slate-800/50 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                      <span className="text-[12px] font-bold text-slate-200 group-hover:text-emerald-400 transition-colors line-clamp-1">{ev.title}</span>
                      <span className={`text-[10px] font-medium ${tokens.text.secondary}`}>{ev.type} &bull; {ev.date}</span>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold ${tokens.text.primary}`}>{ev.relevanceScore}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Knowledge Coverage */}
          <div className={`p-5 rounded-2xl bg-slate-900/40 border ${tokens.card.border}`}>
            <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <Network className="w-4 h-4 text-purple-500" />
              Graph Knowledge Coverage
            </h2>
            <div className="space-y-2">
              <CoverageItem label="Regulation Mapped" status={rule.knowledgeCoverage.regulationMapped} />
              <CoverageItem label="SOPs Linked" status={rule.knowledgeCoverage.sopsLinked} />
              <CoverageItem label="Assets Linked" status={rule.knowledgeCoverage.assetsLinked} />
              <CoverageItem label="Inspection Available" status={rule.knowledgeCoverage.inspectionAvailable} />
              <CoverageItem label="Maintenance Evidence" status={rule.knowledgeCoverage.maintenanceEvidenceAvailable} />
              {rule.knowledgeCoverage.missingApproval && <CoverageItem label="Missing Approval" status={false} isError />}
              {rule.knowledgeCoverage.missingInspection && <CoverageItem label="Missing Inspection" status={false} isError />}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

function CoverageItem({ label, status, isError }: { label: string, status: boolean, isError?: boolean }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className={`text-[13px] font-medium ${isError ? 'text-red-400' : 'text-slate-300'}`}>{label}</span>
      {status ? (
        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
      ) : (
        <XCircle className={`w-4 h-4 ${isError ? 'text-red-500' : 'text-slate-600'}`} />
      )}
    </div>
  );
}

function ImpactRow({ label, level }: { label: string, level: string }) {
  const color = level === 'High' || level === 'Critical' ? 'text-red-500' : 
                level === 'Medium' ? 'text-amber-500' : 
                level === 'Low' ? 'text-emerald-500' : 'text-slate-500';
  
  return (
    <div className="flex items-center justify-between py-1 border-b border-slate-800/50 last:border-0">
      <span className={`text-[12px] font-medium text-slate-300`}>{label}</span>
      <span className={`text-[11px] font-bold uppercase ${color}`}>{level}</span>
    </div>
  );
}

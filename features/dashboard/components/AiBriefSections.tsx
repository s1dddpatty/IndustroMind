"use client";

import React from "react";
import { useTheme } from "@/hooks/useTheme";
import { DESIGN_TOKENS } from "@/constants/design";
import { 
  AiDecisionBrief, 
  OperationalRisk, 
  ComplianceIssue, 
  MaintenanceAction, 
  AiSuggestedAction, 
  HumanDecision 
} from "../constants/aiDecisionBriefData";
import { AlertTriangle, CheckCircle, Clock, ShieldAlert, Zap, Wrench, Navigation, CheckCircle2 } from "lucide-react";

// --- Base Reusable Section Card ---
function SectionCard({ title, icon: Icon, children }: { title: string, icon: any, children: React.ReactNode }) {
  const { theme } = useTheme();
  const tokens = DESIGN_TOKENS[theme];
  return (
    <div className={`bg-slate-900/50 rounded-xl border ${tokens.card.border} p-5 flex flex-col`}>
      <h3 className={`text-sm font-semibold flex items-center gap-2 mb-4 ${tokens.text.primary}`}>
        <Icon className="w-4 h-4 text-emerald-500" /> {title}
      </h3>
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}

// --- Modular Sections ---

export function ExecutiveSummarySection({ summary }: { summary: string }) {
  const { theme } = useTheme();
  const tokens = DESIGN_TOKENS[theme];
  return (
    <SectionCard title="Executive Summary" icon={CheckCircle2}>
      <p className={`text-sm leading-relaxed ${tokens.text.secondary}`}>{summary}</p>
    </SectionCard>
  );
}

export function OperationalRisksSection({ risks }: { risks: OperationalRisk[] }) {
  const { theme } = useTheme();
  const tokens = DESIGN_TOKENS[theme];
  if (!risks.length) return <SectionCard title="Operational Risks" icon={AlertTriangle}><p className="text-sm text-slate-500">No active risks detected.</p></SectionCard>;
  return (
    <SectionCard title="Operational Risks" icon={AlertTriangle}>
      <div className="space-y-3">
        {risks.map(r => (
          <div key={r.id} className="flex flex-col gap-1 p-3 rounded-lg bg-slate-800/30 border border-slate-700/50">
            <div className="flex items-center justify-between">
              <span className={`text-sm font-medium ${tokens.text.primary}`}>{r.title}</span>
              <span className={`text-[10px] uppercase px-2 py-0.5 rounded font-bold ${r.severity === 'High' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : r.severity === 'Medium' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-blue-500/10 text-blue-500 border border-blue-500/20'}`}>{r.severity}</span>
            </div>
            <p className="text-xs text-slate-400">{r.description}</p>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

export function ComplianceSummarySection({ issues }: { issues: ComplianceIssue[] }) {
  const { theme } = useTheme();
  const tokens = DESIGN_TOKENS[theme];
  if (!issues.length) return <SectionCard title="Compliance Summary" icon={ShieldAlert}><p className="text-sm text-slate-500">All systems compliant.</p></SectionCard>;
  return (
    <SectionCard title="Compliance Summary" icon={ShieldAlert}>
      <div className="space-y-3">
        {issues.map(c => (
          <div key={c.id} className="flex gap-2 items-start p-2.5 rounded-lg bg-slate-800/30 border border-slate-700/50">
            <div className={`w-2 h-2 mt-1.5 rounded-full ${c.status === 'Violation' ? 'bg-red-500' : c.status === 'Warning' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
            <div>
              <span className={`text-xs font-medium uppercase ${c.status === 'Violation' ? 'text-red-500' : c.status === 'Warning' ? 'text-amber-500' : 'text-emerald-500'}`}>{c.status}</span>
              <p className={`text-xs mt-0.5 ${tokens.text.secondary}`}>{c.details}</p>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

export function MaintenanceRecommendationsSection({ actions }: { actions: MaintenanceAction[] }) {
  const { theme } = useTheme();
  const tokens = DESIGN_TOKENS[theme];
  if (!actions.length) return <SectionCard title="Maintenance Recommendations" icon={Wrench}><p className="text-sm text-slate-500">No pending maintenance.</p></SectionCard>;
  return (
    <SectionCard title="Maintenance Recommendations" icon={Wrench}>
      <div className="space-y-2">
        {actions.map(m => (
          <div key={m.id} className="text-sm">
            <span className={`font-medium ${tokens.text.primary}`}>{m.asset}</span>
            <span className="text-slate-500 mx-2">—</span>
            <span className={`${tokens.text.secondary}`}>{m.action}</span>
            {m.priority === 'Urgent' && <span className="ml-2 text-[10px] text-red-500 uppercase font-bold">Urgent</span>}
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

export function InspectionPrioritiesSection({ priorities }: { priorities: string[] }) {
  const { theme } = useTheme();
  const tokens = DESIGN_TOKENS[theme];
  if (!priorities.length) return <SectionCard title="Inspection Priorities" icon={Navigation}><p className="text-sm text-slate-500">No inspections required.</p></SectionCard>;
  return (
    <SectionCard title="Inspection Priorities" icon={Navigation}>
      <ul className="list-disc pl-4 space-y-1">
        {priorities.map((p, i) => <li key={i} className={`text-sm ${tokens.text.secondary}`}>{p}</li>)}
      </ul>
    </SectionCard>
  );
}

export function AiSuggestedActionsSection({ actions }: { actions: AiSuggestedAction[] }) {
  const { theme } = useTheme();
  const tokens = DESIGN_TOKENS[theme];
  if (!actions.length) return <SectionCard title="AI Suggested Actions" icon={Zap}><p className="text-sm text-slate-500">No suggestions available.</p></SectionCard>;
  return (
    <SectionCard title="AI Suggested Actions" icon={Zap}>
      <div className="space-y-3">
        {actions.map(a => (
          <div key={a.id} className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-lg">
            <div className="text-sm font-medium text-emerald-400 mb-1">{a.action}</div>
            <div className="text-xs text-emerald-500/70">Impact: {a.impact}</div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

export function PredictedBottlenecksSection({ bottlenecks }: { bottlenecks: string[] }) {
  const { theme } = useTheme();
  const tokens = DESIGN_TOKENS[theme];
  if (!bottlenecks.length) return <SectionCard title="Predicted Bottlenecks" icon={Clock}><p className="text-sm text-slate-500">Flow is optimal.</p></SectionCard>;
  return (
    <SectionCard title="Predicted Bottlenecks" icon={Clock}>
      <ul className="space-y-2">
        {bottlenecks.map((b, i) => (
          <li key={i} className={`text-sm flex gap-2 ${tokens.text.secondary}`}>
            <span className="text-amber-500 font-bold">•</span> {b}
          </li>
        ))}
      </ul>
    </SectionCard>
  );
}

export function RequiredHumanDecisionsSection({ decisions }: { decisions: HumanDecision[] }) {
  const { theme } = useTheme();
  const tokens = DESIGN_TOKENS[theme];
  if (!decisions.length) return <SectionCard title="Required Human Decisions" icon={CheckCircle}><p className="text-sm text-slate-500">No pending approvals.</p></SectionCard>;
  return (
    <SectionCard title="Required Human Decisions" icon={CheckCircle}>
      <div className="space-y-3">
        {decisions.map(d => (
          <div key={d.id} className="flex flex-col gap-1.5 p-3 bg-slate-800/40 border border-slate-700/50 rounded-lg">
            <div className={`text-sm font-medium ${tokens.text.primary}`}>{d.decision}</div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">Deadline: {d.deadline}</span>
              <button className="text-xs bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1 rounded transition-colors">Approve</button>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

"use client";

import React from "react";
import { useTheme } from "@/hooks/useTheme";
import { DESIGN_TOKENS } from "@/constants/design";
import { MOCK_KNOWLEDGE_ARTICLES } from "../constants/expertKnowledgeData";
import { 
  ArrowLeft, Users, BrainCircuit, AlertTriangle, Lightbulb, 
  CheckCircle2, Server, GitCommit, Search, GitPullRequest, ShieldAlert, Zap
} from "lucide-react";
import { useRouter } from "next/navigation";

interface ExpertKnowledgeDetailWorkspaceProps {
  articleId: string;
  onBack: () => void;
}

export function ExpertKnowledgeDetailWorkspace({ articleId, onBack }: ExpertKnowledgeDetailWorkspaceProps) {
  const { theme } = useTheme();
  const tokens = DESIGN_TOKENS[theme];
  const router = useRouter();

  const article = MOCK_KNOWLEDGE_ARTICLES.find(a => a.id === articleId);
  if (!article) return null;

  return (
    <div className="flex flex-col w-full pb-12">
      {/* Header Navigation */}
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={onBack}
          className="p-2 -ml-2 rounded-lg hover:bg-slate-800/50 transition-colors text-slate-400 hover:text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className={`text-sm font-medium ${tokens.text.secondary}`}>Back to Expert Knowledge</span>
      </div>

      {/* Hero Banner */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 rounded-2xl bg-slate-900/60 border ${tokens.card.border} mb-6 relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
        
        <div className="flex items-center gap-5 relative z-10">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border bg-purple-500/10 border-purple-500/20 text-purple-500`}>
            <Lightbulb className="w-8 h-8" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-slate-800 ${tokens.text.primary}`}>
                {article.category}
              </span>
              <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded border border-purple-500/20 bg-purple-500/10 text-purple-400 flex items-center gap-1`}>
                <Users className="w-3 h-3" />
                {article.sourceType}
              </span>
              <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded border ${
                article.maturity === 'Widely Adopted' || article.maturity === 'Operational' ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400' : 'border-amber-500/20 bg-amber-500/10 text-amber-400'
              }`}>
                {article.maturity}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">{article.title}</h1>
          </div>
        </div>

        <div className="flex items-center gap-4 relative z-10">
          <button onClick={() => router.push("/demo/knowledge-graph")} className={`px-4 py-2 rounded-xl bg-slate-800 border ${tokens.card.border} text-sm font-medium text-white hover:bg-slate-700 transition-colors flex items-center gap-2`}>
            <Search className="w-4 h-4 text-purple-400" />
            Explore in Graph
          </button>
          <button onClick={() => router.push("/demo/decision-assistant")} className={`px-4 py-2 rounded-xl bg-purple-600 text-sm font-bold text-white hover:bg-purple-500 transition-colors flex items-center gap-2 shadow-[0_0_20px_rgba(147,51,234,0.3)]`}>
            <BrainCircuit className="w-4 h-4" />
            Ask Assistant
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left/Main Column - The Tacit Knowledge */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          
          {/* Section 1: Executive AI Summary & Knowledge Impact */}
          <div className={`p-6 rounded-2xl bg-gradient-to-br from-purple-950/30 to-slate-900/60 border border-purple-500/20 relative overflow-hidden group`}>
            <div className="absolute top-0 left-0 w-1 h-full bg-purple-500/50" />
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <h2 className="text-sm font-bold text-purple-400 mb-3 flex items-center gap-2">
                  <BrainCircuit className="w-5 h-5" />
                  Executive AI Summary
                </h2>
                <p className="text-[15px] leading-relaxed text-slate-300 font-medium mb-0">
                  {article.executiveAiSummary}
                </p>
              </div>
              <div className="w-full md:w-56 shrink-0 flex flex-col gap-2 bg-slate-950/50 p-4 rounded-xl border border-slate-800/50">
                <h3 className="text-[11px] uppercase font-bold text-slate-400 mb-2">Operational Impact</h3>
                <ImpactRow label="Safety" level={article.impact.safety} />
                <ImpactRow label="Reliability" level={article.impact.reliability} />
                <ImpactRow label="Production" level={article.impact.production} />
              </div>
            </div>
          </div>

          {/* Section 2: Structured Tacit Knowledge */}
          <div className={`p-6 rounded-2xl bg-slate-900/40 border ${tokens.card.border}`}>
            <h2 className="text-lg font-bold text-white mb-6">Expert Knowledge Details</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className={`text-[11px] uppercase font-bold text-purple-400 mb-2`}>Overview</h3>
                <p className={`text-[14px] text-slate-300 leading-relaxed`}>{article.content.overview}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className={`text-[11px] uppercase font-bold text-purple-400 mb-2`}>Technical Details</h3>
                  <p className={`text-[13px] ${tokens.text.secondary} leading-relaxed`}>{article.content.technicalDetails}</p>
                </div>
                <div>
                  <h3 className={`text-[11px] uppercase font-bold text-purple-400 mb-2`}>Operational Context</h3>
                  <p className={`text-[13px] ${tokens.text.secondary} leading-relaxed`}>{article.content.operationalContext}</p>
                </div>
              </div>

              {/* High-value structural blocks */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {article.content.fieldTricks.length > 0 && (
                  <ContentBlock title="Field Tricks & Heuristics" items={article.content.fieldTricks} icon={Zap} color="text-amber-400" bg="bg-amber-500/10" border="border-amber-500/20" />
                )}
                {article.content.failureSymptoms.length > 0 && (
                  <ContentBlock title="Failure Symptoms" items={article.content.failureSymptoms} icon={AlertTriangle} color="text-red-400" bg="bg-red-500/10" border="border-red-500/20" />
                )}
                {article.content.commonMistakes.length > 0 && (
                  <ContentBlock title="Common Mistakes" items={article.content.commonMistakes} icon={ShieldAlert} color="text-orange-400" bg="bg-orange-500/10" border="border-orange-500/20" />
                )}
                {article.content.lessonsLearned.length > 0 && (
                  <ContentBlock title="Lessons Learned" items={article.content.lessonsLearned} icon={CheckCircle2} color="text-blue-400" bg="bg-blue-500/10" border="border-blue-500/20" />
                )}
              </div>
            </div>
          </div>

          {/* Section 6: Knowledge Evolution & Operational Timeline */}
          <div className={`p-6 rounded-2xl bg-slate-900/40 border ${tokens.card.border}`}>
            <h2 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
              <GitPullRequest className="w-5 h-5 text-blue-500" />
              Knowledge Evolution
            </h2>
            <div className="relative border-l border-slate-700/50 ml-4 space-y-6 pb-2">
              {article.timeline.map((evt) => (
                <div key={evt.id} className="relative pl-6">
                  <div className={`absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full ring-4 ring-slate-900 ${
                    evt.type === 'Created' || evt.type === 'Updated' ? 'bg-blue-500' :
                    evt.type === 'Validated' || evt.type === 'Reviewed' ? 'bg-emerald-500' : 
                    evt.type === 'Referenced by AI' ? 'bg-purple-500' : 'bg-orange-500'
                  }`} />
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-xs font-bold text-slate-400">{evt.date}</span>
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300`}>{evt.type}</span>
                  </div>
                  <p className={`text-[13px] ${tokens.text.secondary}`}>{evt.description}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column - Validation, Evidence & Insights */}
        <div className="space-y-6">

          {/* Section 3: Maturity, Provenance & Related Experts */}
          <div className={`p-5 rounded-2xl bg-slate-900/40 border ${tokens.card.border}`}>
            <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Provenance & Validation
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-950/50 rounded-xl border border-slate-800/50">
                <span className={`text-[11px] uppercase font-bold text-slate-400`}>Knowledge Score</span>
                <span className={`text-lg font-bold ${article.knowledgeScore > 90 ? 'text-emerald-500' : 'text-amber-500'}`}>{article.knowledgeScore}</span>
              </div>
              <div>
                <h3 className={`text-[10px] uppercase font-bold text-slate-500 mb-2`}>Contributors</h3>
                <div className="space-y-2">
                  {article.experts.map((exp, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-slate-800/30">
                      <div className="flex flex-col">
                        <span className="text-[12px] font-bold text-slate-200">{exp.name}</span>
                        <span className="text-[10px] text-slate-400">{exp.role}</span>
                      </div>
                      <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded ${
                        exp.type === 'Primary Expert' ? 'bg-purple-500/10 text-purple-400' : 'bg-slate-700 text-slate-300'
                      }`}>{exp.type}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 7: Knowledge Gaps & AI Insights */}
          <div className={`p-5 rounded-2xl bg-slate-900/40 border ${tokens.card.border}`}>
            <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-cyan-500" />
              Neuro-Symbolic Insights
            </h2>
            <div className="space-y-4">
              {article.aiInsights.map((insight, i) => (
                <div key={i} className="p-3 bg-cyan-500/5 border border-cyan-500/20 rounded-xl">
                  <p className="text-[12px] font-medium text-cyan-100/80 leading-relaxed">
                    <strong className="text-cyan-400 block mb-1">{insight.split(':')[0]}:</strong>
                    {insight.split(':')[1]}
                  </p>
                </div>
              ))}
              
              {article.knowledgeGaps.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-800/50">
                  <h3 className={`text-[10px] uppercase font-bold text-amber-500 mb-2 flex items-center gap-1`}><AlertTriangle className="w-3 h-3"/> Identified Gaps</h3>
                  <ul className="space-y-2">
                    {article.knowledgeGaps.map((gap, i) => (
                      <li key={i} className="text-[11px] text-amber-200/70 flex items-start gap-2">
                        <span className="text-amber-500/50 mt-0.5">•</span>
                        {gap}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Section 5: Applicable Assets */}
          <div className={`p-5 rounded-2xl bg-slate-900/40 border ${tokens.card.border}`}>
            <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <Server className="w-4 h-4 text-blue-500" />
              Applicable Assets
            </h2>
            <div className="space-y-2">
              {article.applicableAssets.map(asset => (
                <div key={asset.id} onClick={() => router.push("/demo/assets")} className="flex items-center justify-between p-3 bg-slate-950/50 rounded-xl hover:bg-slate-800/80 border border-slate-800/50 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-md bg-blue-500/10 text-blue-400">
                      <Server className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[13px] font-bold text-slate-200 group-hover:text-blue-400 transition-colors">{asset.tag}</span>
                      <span className={`text-[11px] ${tokens.text.secondary}`}>{asset.name}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 8: Knowledge Reuse Metrics */}
          <div className={`p-5 rounded-2xl bg-slate-900/40 border ${tokens.card.border}`}>
            <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <GitCommit className="w-4 h-4 text-orange-500" />
              Knowledge Reuse
            </h2>
            <div className="grid grid-cols-2 gap-2">
              <MetricBox label="Queries" val={article.reuseMetrics.referencedByPreviousQueries} />
              <MetricBox label="Decision Asst" val={article.reuseMetrics.referencedByDecisionAssistant} />
              <MetricBox label="AI Briefs" val={article.reuseMetrics.referencedByAiBriefs} />
              <MetricBox label="Maint Plans" val={article.reuseMetrics.referencedByMaintenancePlans} />
            </div>
          </div>

        </div>

      </div>
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

function ContentBlock({ title, items, icon: Icon, color, bg, border }: { title: string, items: string[], icon: any, color: string, bg: string, border: string }) {
  return (
    <div className={`p-4 rounded-xl bg-slate-950/50 border ${border} border-opacity-50`}>
      <h3 className={`text-[11px] uppercase font-bold ${color} mb-3 flex items-center gap-1.5`}>
        <div className={`p-1 rounded ${bg}`}><Icon className={`w-3 h-3 ${color}`} /></div>
        {title}
      </h3>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className={`text-[12px] text-slate-300 leading-relaxed flex items-start gap-2`}>
            <span className={`${color} mt-0.5 opacity-50`}>•</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function MetricBox({ label, val }: { label: string, val: number }) {
  return (
    <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800/50 flex flex-col items-center justify-center text-center">
      <span className="text-xl font-bold text-white mb-1">{val}</span>
      <span className="text-[9px] uppercase font-bold text-slate-500">{label}</span>
    </div>
  )
}

"use client";

import React, { useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import { DESIGN_TOKENS } from "@/constants/design";
import { MOCK_KNOWLEDGE_ARTICLES, EXPERT_KNOWLEDGE_STATS } from "../constants/expertKnowledgeData";
import { 
  Search, Filter, Download, ChevronRight, Users, 
  Lightbulb, BrainCircuit, Activity, BookOpen, AlertTriangle
} from "lucide-react";

interface ExpertKnowledgeListWorkspaceProps {
  onSelectArticle: (id: string) => void;
}

export function ExpertKnowledgeListWorkspace({ onSelectArticle }: ExpertKnowledgeListWorkspaceProps) {
  const { theme } = useTheme();
  const tokens = DESIGN_TOKENS[theme];
  const [searchQuery, setSearchQuery] = useState("");

  const filteredArticles = MOCK_KNOWLEDGE_ARTICLES.filter(a => 
    a.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col w-full h-full pb-8">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl bg-purple-500/10 text-purple-500`}>
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Expert Knowledge</h1>
            <p className={`text-sm ${tokens.text.secondary}`}>Organizational Knowledge Preservation</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className={`relative flex items-center bg-slate-900/50 rounded-xl border ${tokens.card.border}`}>
            <Search className="w-4 h-4 text-slate-400 absolute left-3" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tacit knowledge..." 
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
          { label: "Total Articles", value: EXPERT_KNOWLEDGE_STATS.totalArticles, icon: BookOpen, color: "text-purple-500", bg: "bg-purple-500/10" },
          { label: "Validated", value: EXPERT_KNOWLEDGE_STATS.validated, icon: Lightbulb, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "Lessons Learned", value: EXPERT_KNOWLEDGE_STATS.lessonsLearned, icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-500/10" },
          { label: "AI Insights", value: EXPERT_KNOWLEDGE_STATS.aiGeneratedInsights, icon: BrainCircuit, color: "text-cyan-500", bg: "bg-cyan-500/10" },
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
          <div className="col-span-4">Knowledge Topic & Source</div>
          <div className="col-span-2">Maturity</div>
          <div className="col-span-2">Contributors</div>
          <div className="col-span-3">Confidence & Usage</div>
          <div className="col-span-1 text-right">Actions</div>
        </div>

        <div className="flex-1 overflow-y-auto hide-scrollbar">
          {filteredArticles.map((article) => (
            <div 
              key={article.id} 
              onClick={() => onSelectArticle(article.id)}
              className={`grid grid-cols-12 max-md:flex max-md:flex-col max-md:relative gap-4 max-md:gap-3 p-4 max-md:p-5 border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors cursor-pointer max-md:items-start items-center group`}
            >
              
              {/* Topic Identity */}
              <div className="col-span-4 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-slate-800 ${tokens.text.primary}`}>
                    {article.category}
                  </span>
                  <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400`}>
                    {article.sourceType}
                  </span>
                </div>
                <h3 className="text-[13px] font-bold text-white group-hover:text-purple-400 transition-colors line-clamp-2">{article.title}</h3>
              </div>

              {/* Maturity */}
              <div className="col-span-2 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`relative flex h-2 w-2`}>
                    {article.maturity === "Widely Adopted" && (
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    )}
                    <span className={`relative inline-flex rounded-full h-2 w-2 ${
                      article.maturity === "Widely Adopted" || article.maturity === "Operational" ? "bg-emerald-500" :
                      article.maturity === "Validated" ? "bg-blue-500" :
                      article.maturity === "Under Review" ? "bg-amber-500" : "bg-slate-500"
                    }`}></span>
                  </span>
                  <span className={`text-[11px] font-bold uppercase ${
                    article.maturity === "Widely Adopted" || article.maturity === "Operational" ? "text-emerald-500" :
                    article.maturity === "Validated" ? "text-blue-500" :
                    article.maturity === "Under Review" ? "text-amber-500" : "text-slate-500"
                  }`}>{article.maturity}</span>
                </div>
                <span className={`text-[10px] ${tokens.text.secondary}`}>Ver {article.versions[0]?.versionNumber}.0</span>
              </div>

              {/* Contributors */}
              <div className="col-span-2 flex flex-col justify-center gap-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-medium text-slate-300 truncate">{article.experts.find(e => e.type === "Primary Expert")?.name}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`text-[9px] uppercase font-bold text-slate-500`}>+ {article.experts.length - 1} more</span>
                </div>
              </div>

              {/* Confidence & Usage */}
              <div className="col-span-3 flex flex-col gap-2 justify-center">
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden flex">
                    <div 
                      className={`h-full ${article.knowledgeScore > 90 ? 'bg-emerald-500' : article.knowledgeScore > 70 ? 'bg-blue-500' : 'bg-amber-500'}`} 
                      style={{ width: `${article.knowledgeScore}%` }} 
                    />
                  </div>
                  <span className={`text-[11px] font-bold ${article.knowledgeScore > 90 ? 'text-emerald-400' : article.knowledgeScore > 70 ? 'text-blue-400' : 'text-amber-400'}`}>Score: {article.knowledgeScore}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className={`text-[10px] ${tokens.text.secondary}`}>
                    <strong className="text-white">{article.usageFrequency}</strong> uses &bull; <strong className={`${article.aiConfidence > 90 ? 'text-cyan-400' : 'text-slate-400'}`}>AI Conf: {article.aiConfidence}%</strong>
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="col-span-1 flex justify-end max-md:absolute max-md:top-5 max-md:right-5">
                <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-purple-400 transition-colors" />
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

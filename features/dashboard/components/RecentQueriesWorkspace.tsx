"use client";

import React, { useState, useMemo } from "react";
import { useTheme } from "@/hooks/useTheme";
import { DESIGN_TOKENS } from "@/constants/design";
import { Query, MOCK_RECENT_QUERIES } from "../constants/recentQueriesData";
import { ArrowLeft, Search, Filter, ArrowUpDown, Bot, Clock, Brain, Activity, MessageSquare } from "lucide-react";

interface RecentQueriesWorkspaceProps {
  onBack: () => void;
  onSelectQuery: (id: string) => void;
}

export function RecentQueriesWorkspace({ onBack, onSelectQuery }: RecentQueriesWorkspaceProps) {
  const queries = MOCK_RECENT_QUERIES;
  const { theme } = useTheme();
  const tokens = DESIGN_TOKENS[theme];
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDept, setFilterDept] = useState<string>("All");

  const filteredQueries = useMemo(() => {
    return queries.filter(q => {
      const matchesSearch = q.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            q.responseSummary.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            q.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesDept = filterDept === "All" || q.department === filterDept;
      return matchesSearch && matchesDept;
    });
  }, [queries, searchTerm, filterDept]);

  return (
    <div className="flex flex-col w-full pb-8">
      {/* Header Area */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="p-2 -ml-2 rounded-lg hover:bg-slate-800/50 transition-colors text-slate-400 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className={`text-2xl font-bold flex items-center gap-2 ${tokens.text.primary}`}>
                <MessageSquare className="w-6 h-6 text-emerald-500" />
                AI Conversation History
              </h1>
              <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                <span>Today's queries: 4</span>
                <span>•</span>
                <span>Avg Confidence: 93%</span>
                <span>•</span>
                <span>Avg Response: 4.8s</span>
              </div>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-3 flex-1 max-w-xl">
            <div className={`flex-1 relative flex items-center bg-slate-900/50 rounded-lg border ${tokens.card.border}`}>
              <Search className="w-4 h-4 text-slate-400 absolute left-3" />
              <input 
                type="text" 
                placeholder="Search questions, responses, tags..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent border-none text-sm text-white focus:outline-none focus:ring-0 py-2 pl-9 pr-4 placeholder-slate-500"
              />
            </div>
            <select 
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
              className={`py-2 px-3 rounded-lg bg-slate-900/50 border ${tokens.card.border} text-sm text-slate-300 focus:outline-none`}
            >
              <option value="All">All Departments</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Operations">Operations</option>
              <option value="Engineering">Engineering</option>
              <option value="Compliance">Compliance</option>
            </select>
            <button className={`p-2 rounded-lg bg-slate-900/50 border ${tokens.card.border} text-slate-400 hover:text-white transition-colors`}>
              <Filter className="w-4 h-4" />
            </button>
            <button className={`p-2 rounded-lg bg-slate-900/50 border ${tokens.card.border} text-slate-400 hover:text-white transition-colors`}>
              <ArrowUpDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main List Body */}
      <div className={`w-full rounded-xl border ${tokens.card.border} ${tokens.card.background} shadow-sm overflow-hidden`}>
        <div className="flex flex-col divide-y divide-slate-800/50">
          {filteredQueries.map((query) => (
            <div 
              key={query.id}
              onClick={() => onSelectQuery(query.id)}
              className="p-5 hover:bg-slate-800/20 transition-colors cursor-pointer group flex gap-4"
            >
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center shrink-0 mt-1">
                <Bot className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h3 className={`text-base font-semibold ${tokens.text.primary} truncate group-hover:text-emerald-400 transition-colors`}>
                    {query.question}
                  </h3>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-300`}>
                      {query.department}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-slate-500">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(query.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>
                
                <p className={`text-sm ${tokens.text.secondary} line-clamp-2 mb-3 leading-relaxed`}>
                  {query.responseSummary}
                </p>
                
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Brain className="w-3.5 h-3.5 text-emerald-500/70" />
                    Confidence: {query.confidence}%
                  </span>
                  <span className="flex items-center gap-1">
                    <Activity className="w-3.5 h-3.5 text-blue-500/70" />
                    {query.processingTime}
                  </span>
                  <span>
                    {query.relatedDocuments.length + query.relatedAssets.length + query.relatedSops.length} References
                  </span>
                  <div className="flex gap-2 ml-2">
                    {query.tags.map(tag => (
                      <span key={tag} className="text-[10px] font-medium text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredQueries.length === 0 && (
            <div className="p-12 text-center text-slate-500">
              <Bot className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p className="text-sm">No conversations found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

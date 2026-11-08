"use client";

import React, { useState, useMemo } from "react";
import { useTheme } from "@/hooks/useTheme";
import { DESIGN_TOKENS } from "@/constants/design";
import { Query } from "../constants/recentQueriesData";
import { ArrowLeft, Search, Filter, Bot, Clock, Brain, MessageSquare, HelpCircle } from "lucide-react";
import { useSystemDocuments } from "@/features/shared/hooks/useSystemDocuments";

interface RecentQueriesWorkspaceProps {
  onBack: () => void;
  onSelectQuery: (id: string) => void;
}

const INGESTED_QUERIES: Query[] = [
  {
    id: "qry-p204",
    question: "Is Pump P-204 safe to restart under SOP-MECH-042?",
    timestamp: new Date().toISOString(),
    responseSummary: "Centrifugal pump P-204 is restricted from restart due to a critical contradiction between SOP-MECH-042 suction valve LOTO requirements and OEM mechanical seal flush specifications.",
    confidence: 98,
    responseTime: 3.2,
    domain: "Safety",
    department: "Operations",
    status: "Flagged",
    user: "Plant Administrator",
    tags: ["P-204", "SOP-MECH-042", "Contradiction"],
    aiReasoning: "Cross-correlated SOP-MECH-042 section 3 against Flowserve Durco Mark 3 OEM manual rev 3. Suction valve V-101 closed state prevents seal MS-204 barrier fluid flush.",
    messages: [
      { id: "msg-1", role: "user", content: "Is Pump P-204 safe to restart under SOP-MECH-042?", timestamp: new Date().toISOString() },
      { id: "msg-2", role: "ai", content: "Pump P-204 is in a restricted state. AI detected a critical contradiction between LOTO suction isolation and OEM mechanical seal flush requirements.", timestamp: new Date().toISOString() }
    ],
    relatedEntities: [
      { id: "ast-p204", type: "Asset", title: "Centrifugal Pump P-204", identifier: "P-204" }
    ],
    recommendedActions: [
      { id: "act-1", title: "Authorize SOP-MECH-042 revision 3.3 bypass exception", priority: "High" }
    ]
  }
];

export function RecentQueriesWorkspace({ onBack, onSelectQuery }: RecentQueriesWorkspaceProps) {
  const { hasDocuments } = useSystemDocuments();
  const queries = hasDocuments ? INGESTED_QUERIES : [];
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
                <span>Total queries: {queries.length}</span>
                <span>•</span>
                <span>Avg Confidence: {queries.length > 0 ? "98%" : "0%"}</span>
                <span>•</span>
                <span>Avg Response: {queries.length > 0 ? "3.2s" : "0.0s"}</span>
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
                placeholder="Search queries, tags, or responses..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent border-none text-sm text-white focus:outline-none focus:ring-0 py-2 pl-9 pr-4 placeholder-slate-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Query List */}
      <div className={`w-full rounded-xl border ${tokens.card.border} ${tokens.card.background} p-4 shadow-sm min-h-[220px] flex flex-col`}>
        {filteredQueries.length > 0 ? (
          <div className="flex flex-col space-y-3">
            {filteredQueries.map((query) => (
              <div 
                key={query.id} 
                onClick={() => onSelectQuery(query.id)}
                className="p-4 rounded-lg bg-slate-900/40 hover:bg-slate-800/50 transition-colors cursor-pointer border border-slate-800/60"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-white">{query.question}</span>
                  <span className="text-xs text-slate-500">{new Date(query.timestamp).toLocaleTimeString()}</span>
                </div>
                <p className="text-xs text-slate-400 line-clamp-2">{query.responseSummary}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-slate-500">
            <HelpCircle className="w-12 h-12 mb-3 opacity-40 text-emerald-500" />
            <p className="text-base font-semibold text-slate-300">No Query History Recorded</p>
            <p className="text-xs text-slate-500 mt-1 max-w-sm">No operational queries have been asked yet. Use the Decision Assistant to explore plant telemetry and SOPs.</p>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import { DESIGN_TOKENS } from "@/constants/design";
import { 
  TimelineEvent, 
  ReferenceItem, 
  ChatMessage, 
  AiResponseSection, 
  Query 
} from "../../constants/recentQueriesData";
import { 
  CheckCircle2, Clock, Check, FileText, Activity, AlertTriangle, 
  Share2, Download, Copy, Brain, ChevronDown, ChevronRight, User 
} from "lucide-react";

// --- CONVERSATION HEADER ---
export function ConversationHeader({ title, status }: { title: string, status: string }) {
  const { theme } = useTheme();
  const tokens = DESIGN_TOKENS[theme];
  
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className={`text-2xl font-bold ${tokens.text.primary}`}>{title}</h2>
      <div className="flex items-center gap-2">
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
          status === "Complete" ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : 
          "bg-amber-500/10 text-amber-500 border border-amber-500/20"
        }`}>
          {status}
        </span>
      </div>
    </div>
  );
}

// --- CONVERSATION TIMELINE ---
export function ConversationTimeline({ timeline }: { timeline: TimelineEvent[] }) {
  const { theme } = useTheme();
  const tokens = DESIGN_TOKENS[theme];

  return (
    <div className={`p-4 rounded-xl border ${tokens.card.border} bg-slate-900/30`}>
      <h4 className={`text-xs font-semibold ${tokens.text.secondary} uppercase tracking-wider mb-4`}>Processing Timeline</h4>
      <div className="space-y-4">
        {timeline.map((event, idx) => (
          <div key={event.id} className="flex gap-3 relative">
            {idx !== timeline.length - 1 && (
              <div className="absolute left-[9px] top-6 bottom-[-16px] w-[2px] bg-slate-800" />
            )}
            <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 z-10 ${
              event.status === "completed" ? "bg-emerald-500/20 text-emerald-500" : 
              event.status === "in-progress" ? "bg-amber-500/20 text-amber-500 animate-pulse" : 
              "bg-slate-800 text-slate-500"
            }`}>
              {event.status === "completed" ? <Check className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
            </div>
            <div className="flex-1 min-w-0 mt-0.5">
              <p className={`text-sm ${tokens.text.primary}`}>{event.label}</p>
              <p className="text-[10px] text-slate-500">{new Date(event.timestamp).toLocaleTimeString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- CONVERSATION MESSAGE ---
export function ConversationMessage({ message }: { message: ChatMessage }) {
  const { theme } = useTheme();
  const tokens = DESIGN_TOKENS[theme];
  const isAi = message.role === "ai";

  return (
    <div className={`flex gap-4 p-4 rounded-xl ${isAi ? `bg-slate-800/30 border ${tokens.card.border}` : ""}`}>
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
        isAi ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : 
        "bg-slate-800 text-slate-400"
      }`}>
        {isAi ? <Brain className="w-4 h-4" /> : <User className="w-4 h-4" />}
      </div>
      <div className="flex-1 min-w-0 pt-1">
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-sm font-semibold ${tokens.text.primary}`}>{isAi ? "IndustroMind AI" : "You"}</span>
          <span className="text-xs text-slate-500">{new Date(message.timestamp).toLocaleTimeString()}</span>
        </div>
        <div className={`text-sm ${tokens.text.primary} leading-relaxed whitespace-pre-wrap`}>
          {message.content}
        </div>
      </div>
    </div>
  );
}

// --- AI RESPONSE RENDERER ---
export function AiResponseRenderer({ sections }: { sections: AiResponseSection[] }) {
  const { theme } = useTheme();
  const tokens = DESIGN_TOKENS[theme];

  return (
    <div className="space-y-6 mt-6">
      {sections.map((section, idx) => (
        <div key={idx} className={`p-5 rounded-xl border ${tokens.card.border} ${tokens.card.background}`}>
          <h3 className={`text-sm font-bold ${tokens.text.primary} mb-3 flex items-center gap-2`}>
            {section.type === "ExecutiveSummary" && <Brain className="w-4 h-4 text-emerald-500" />}
            {section.type === "OperationalRisks" && <AlertTriangle className="w-4 h-4 text-red-500" />}
            {section.type === "RecommendedActions" && <CheckCircle2 className="w-4 h-4 text-blue-500" />}
            {section.title}
          </h3>
          <p className={`text-sm ${tokens.text.secondary} leading-relaxed mb-3`}>{section.content}</p>
          {section.items && section.items.length > 0 && (
            <ul className="space-y-2 mt-3 pl-1">
              {section.items.map((item, i) => (
                <li key={i} className="flex gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <span className={`text-sm ${tokens.text.primary}`}>{item}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}

// --- REFERENCES PANEL ---
export function ReferencesPanel({ title, items, icon: Icon }: { title: string, items: ReferenceItem[], icon: React.ElementType }) {
  const { theme } = useTheme();
  const tokens = DESIGN_TOKENS[theme];

  if (!items || items.length === 0) return null;

  return (
    <div className="mb-6">
      <h4 className={`text-xs font-semibold ${tokens.text.secondary} uppercase tracking-wider mb-3 flex items-center gap-2`}>
        <Icon className="w-3.5 h-3.5" />
        {title} ({items.length})
      </h4>
      <div className="space-y-2">
        {items.map(item => (
          <button key={item.id} className={`w-full flex items-center justify-between p-3 rounded-lg border ${tokens.card.border} bg-slate-900/40 hover:bg-slate-800/60 transition-colors text-left group`}>
            <div className="flex items-center gap-3 truncate">
              <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-slate-400" />
              </div>
              <div className="truncate">
                <p className={`text-sm font-medium ${tokens.text.primary} truncate group-hover:text-emerald-400 transition-colors`}>{item.title}</p>
                {item.identifier && <p className="text-[10px] text-slate-500">{item.identifier}</p>}
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-emerald-500" />
          </button>
        ))}
      </div>
    </div>
  );
}

// --- METADATA PANEL ---
export function MetadataPanel({ query }: { query: Query }) {
  const { theme } = useTheme();
  const tokens = DESIGN_TOKENS[theme];

  return (
    <div className={`p-4 rounded-xl border ${tokens.card.border} ${tokens.card.background} mb-6`}>
      <h4 className={`text-xs font-semibold ${tokens.text.secondary} uppercase tracking-wider mb-4`}>Query Details</h4>
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">User</span>
          <span className={tokens.text.primary}>{query.user}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">Department</span>
          <span className={tokens.text.primary}>{query.department}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">Processing Time</span>
          <span className={tokens.text.primary}>{query.processingTime}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">Timestamp</span>
          <span className={tokens.text.primary}>{new Date(query.timestamp).toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">Session ID</span>
          <span className="text-slate-600 font-mono text-xs">{query.sessionId}</span>
        </div>
      </div>
    </div>
  );
}

// --- CONFIDENCE CARD ---
export function ConfidenceCard({ confidence, explanation }: { confidence: number, explanation: string }) {
  const { theme } = useTheme();
  const tokens = DESIGN_TOKENS[theme];
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`rounded-xl border ${tokens.card.border} overflow-hidden mb-6`}>
      <div 
        className="p-4 bg-slate-900/50 flex items-center justify-between cursor-pointer hover:bg-slate-800/50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-8 h-8">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="3" fill="none" className="text-slate-800" />
              <circle 
                cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="3" fill="none" 
                className="text-emerald-500" 
                strokeDasharray={`${(confidence / 100) * 88} 88`} 
              />
            </svg>
            <span className="absolute text-[10px] font-bold text-white">{confidence}%</span>
          </div>
          <span className={`text-sm font-medium ${tokens.text.primary}`}>AI Confidence Score</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${expanded ? "rotate-180" : ""}`} />
      </div>
      {expanded && (
        <div className={`p-4 border-t ${tokens.card.border} bg-slate-900/20`}>
          <p className={`text-sm ${tokens.text.secondary} leading-relaxed`}>{explanation}</p>
        </div>
      )}
    </div>
  );
}

// --- ACTIONS BAR ---
export function ActionsBar() {
  const { theme } = useTheme();
  const tokens = DESIGN_TOKENS[theme];

  return (
    <div className="flex gap-2">
      <button className={`flex-1 py-2 flex items-center justify-center gap-2 rounded-lg border ${tokens.card.border} bg-slate-900/50 hover:bg-slate-800 transition-colors text-sm font-medium text-slate-300`}>
        <Copy className="w-4 h-4" /> Copy
      </button>
      <button className={`flex-1 py-2 flex items-center justify-center gap-2 rounded-lg border ${tokens.card.border} bg-slate-900/50 hover:bg-slate-800 transition-colors text-sm font-medium text-slate-300`}>
        <Download className="w-4 h-4" /> PDF
      </button>
      <button className={`flex-1 py-2 flex items-center justify-center gap-2 rounded-lg border ${tokens.card.border} bg-slate-900/50 hover:bg-slate-800 transition-colors text-sm font-medium text-slate-300`}>
        <Share2 className="w-4 h-4" /> Share
      </button>
    </div>
  );
}

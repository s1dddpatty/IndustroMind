"use client";

import React from "react";
import { useTheme } from "@/hooks/useTheme";
import { DESIGN_TOKENS } from "@/constants/design";
import { Query } from "../constants/recentQueriesData";
import { ArrowLeft, FileText, Share2, Download, Copy, Brain, Link, Activity } from "lucide-react";
import { 
  ConversationHeader, 
  ConversationTimeline, 
  ConversationMessage, 
  AiResponseRenderer, 
  ReferencesPanel, 
  MetadataPanel, 
  ConfidenceCard, 
  ActionsBar 
} from "./query-detail/QueryDetailComponents";

interface QueryDetailWorkspaceProps {
  queryId: string;
  queries: Query[];
  onBack: () => void;
}

export function QueryDetailWorkspace({ queryId, queries, onBack }: QueryDetailWorkspaceProps) {
  const { theme } = useTheme();
  const tokens = DESIGN_TOKENS[theme];
  
  const query = queries.find(q => q.id === queryId) || queries[0];

  return (
    <div className="flex flex-col w-full pb-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={onBack}
          className="p-2 -ml-2 rounded-lg hover:bg-slate-800/50 transition-colors text-slate-400 hover:text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className={`text-sm font-medium ${tokens.text.secondary}`}>Back to Queries</span>
      </div>

      <ConversationHeader title={query.question} status={query.status} />

      {/* Main Grid */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (Main Chat & Response) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Chat History */}
          <div className="space-y-4">
            {query.conversation.map(msg => (
              <ConversationMessage key={msg.id} message={msg} />
            ))}
          </div>

          {/* Structured AI Response */}
          <AiResponseRenderer sections={query.structuredResponse} />
          
        </div>

        {/* Right Column (Sidebar) */}
        <div className="space-y-0">
          
          <MetadataPanel query={query} />
          <ConfidenceCard confidence={query.confidence} explanation={query.confidenceExplanation} />
          
          <div className={`p-5 rounded-xl border ${tokens.card.border} ${tokens.card.background} mb-6`}>
            <ReferencesPanel title="Documents" items={query.relatedDocuments} icon={FileText} />
            <ReferencesPanel title="SOPs" items={query.relatedSops} icon={FileText} />
            <ReferencesPanel title="Assets" items={query.relatedAssets} icon={Activity} />
            <ReferencesPanel title="Alerts" items={query.relatedAlerts} icon={Activity} />
            <ReferencesPanel title="Knowledge Nodes" items={query.knowledgeNodes} icon={Link} />
          </div>

          <ConversationTimeline timeline={query.timeline} />

          <div className="mt-6">
            <ActionsBar />
          </div>

        </div>
      </div>
    </div>
  );
}


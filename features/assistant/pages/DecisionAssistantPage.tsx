"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useTheme } from "@/hooks/useTheme";
import { DESIGN_TOKENS } from "@/constants/design";
import { 
  MOCK_CONVERSATIONS, 
  ASSISTANT_PROMPTS, 
  ChatConversation, 
  ChatMessage 
} from "../constants/assistantData";
import { 
  Bot, User, Send, Paperclip, Mic, Plus, MessageSquare, Search, SearchCode, 
  Clock, Pin, FileText, Activity, Loader2
} from "lucide-react";
import { 
  ReasoningTrace, ExecutiveSummaryCard, EvidenceCardList, 
  GraphRagVisualizer, ComplianceRiskList, RecommendationsList, 
  FollowUpSuggestions 
} from "../components/AssistantComponents";
import { motion } from "framer-motion";

export type ConversationMode = 
  | "General"
  | "Asset Analysis"
  | "Compliance Analysis"
  | "Document Analysis"
  | "Knowledge Capture"
  | "Executive Reporting"
  | "Knowledge Graph Exploration"
  | "Root Cause Investigation";

export interface AssistantContext {
  sourceModule?: string;
  conversationMode?: ConversationMode;
  selectedAsset?: string;
  selectedDocument?: string;
  selectedComplianceRule?: string;
  selectedKnowledgeArticle?: string;
  selectedReport?: string;
  selectedGraphNode?: string;
}

function ContextBanner({ context }: { context: AssistantContext }) {
  const { theme } = useTheme();
  const tokens = DESIGN_TOKENS[theme];

  // Determine what specific item to show
  const specificContext = 
    context.selectedAsset ? { label: "Asset", value: context.selectedAsset } :
    context.selectedComplianceRule ? { label: "Compliance Rule", value: context.selectedComplianceRule } :
    context.selectedDocument ? { label: "Document", value: context.selectedDocument } :
    context.selectedReport ? { label: "Report", value: context.selectedReport } :
    context.selectedKnowledgeArticle ? { label: "Knowledge Article", value: context.selectedKnowledgeArticle } :
    context.selectedGraphNode ? { label: "Graph Node", value: context.selectedGraphNode } : null;

  if (!context.sourceModule && !specificContext) return null;

  return (
    <div className={`mb-6 p-4 rounded-xl border ${tokens.card.border} bg-slate-800/30 flex items-start sm:items-center justify-between gap-4 flex-col sm:flex-row`}>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
          <Activity className="w-4 h-4 text-emerald-500" />
        </div>
        <div>
          <h4 className={`text-[11px] uppercase tracking-wider font-bold text-slate-500 mb-0.5`}>Current Context</h4>
          <div className="flex items-center gap-2 text-sm">
            {specificContext ? (
              <>
                <span className={`font-semibold ${tokens.text.primary}`}>{specificContext.label}:</span>
                <span className="text-emerald-400 font-medium">{specificContext.value}</span>
              </>
            ) : (
              <span className={`font-semibold ${tokens.text.primary}`}>General Conversation</span>
            )}
          </div>
        </div>
      </div>
      
      {context.sourceModule && (
        <div className="flex items-center gap-2 text-[11px] font-medium text-slate-400 bg-slate-900/50 px-2.5 py-1 rounded-md border border-slate-700/50 shrink-0">
          Source: <span className="text-slate-300">{context.sourceModule}</span>
        </div>
      )}
    </div>
  );
}

function DecisionAssistantContent() {
  const { theme } = useTheme();
  const tokens = DESIGN_TOKENS[theme];

  const searchParams = useSearchParams();
  const context: AssistantContext = {
    sourceModule: searchParams.get("sourceModule") || undefined,
    conversationMode: (searchParams.get("conversationMode") as ConversationMode) || undefined,
    selectedAsset: searchParams.get("selectedAsset") || undefined,
    selectedDocument: searchParams.get("selectedDocument") || undefined,
    selectedComplianceRule: searchParams.get("selectedComplianceRule") || undefined,
    selectedKnowledgeArticle: searchParams.get("selectedKnowledgeArticle") || undefined,
    selectedReport: searchParams.get("selectedReport") || undefined,
    selectedGraphNode: searchParams.get("selectedGraphNode") || undefined,
  };

  const [conversations, setConversations] = useState<ChatConversation[]>(MOCK_CONVERSATIONS);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  const activeConversation = conversations.find(c => c.id === activeConversationId);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConversation?.messages, isTyping]);

  const handleSendMessage = (text: string = inputValue) => {
    if (!text.trim()) return;
    
    // In a real app, this would create a new conversation if none exists,
    // push the user message, set isTyping(true), and then stream the AI response.
    // For this mockup, we'll just simulate typing and clear the input.
    setInputValue("");
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
    }, 1500);
  };

  const handleNewConversation = () => {
    setActiveConversationId(null);
    setInputValue("");
  };

  return (
    <div className="flex flex-1 min-h-0 w-full">
      
      {/* Left Sidebar: History */}
      <div className={`w-72 shrink-0 flex flex-col border-r ${tokens.card.border} pr-4 mr-4`}>
        <button 
          onClick={handleNewConversation}
          className="w-full flex items-center justify-between p-3 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors font-bold text-sm mb-6"
        >
          New Conversation <Plus className="w-4 h-4" />
        </button>

        <div className={`relative flex items-center bg-slate-900/50 rounded-lg border ${tokens.card.border} mb-6`}>
          <Search className="w-4 h-4 text-slate-400 absolute left-3" />
          <input 
            type="text" 
            placeholder="Search history..." 
            className="w-full bg-transparent border-none text-sm text-white focus:outline-none focus:ring-0 py-2 pl-9 pr-4"
          />
        </div>

        <div className="flex-1 overflow-y-auto hide-scrollbar flex flex-col gap-6">
          
          {/* Pinned */}
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
              <Pin className="w-3.5 h-3.5" /> Pinned
            </h3>
            <div className="flex flex-col gap-1">
              {conversations.filter(c => c.pinned).map(conv => (
                <div 
                  key={conv.id}
                  onClick={() => setActiveConversationId(conv.id)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${activeConversationId === conv.id ? 'bg-slate-800 border border-slate-700' : 'hover:bg-slate-800/50 border border-transparent'}`}
                >
                  <div className="text-sm font-semibold text-slate-200 line-clamp-1">{conv.title}</div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[10px] text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded">{conv.department}</span>
                    <span className="text-[10px] text-slate-500">{new Date(conv.timestamp).toLocaleDateString('en-US', { timeZone: 'UTC' })}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent */}
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5" /> Recent
            </h3>
            <div className="flex flex-col gap-1">
              {conversations.filter(c => !c.pinned).map(conv => (
                <div 
                  key={conv.id}
                  onClick={() => setActiveConversationId(conv.id)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${activeConversationId === conv.id ? 'bg-slate-800 border border-slate-700' : 'hover:bg-slate-800/50 border border-transparent'}`}
                >
                  <div className="text-sm font-semibold text-slate-200 line-clamp-1">{conv.title}</div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[10px] text-blue-500 bg-blue-500/10 px-1.5 py-0.5 rounded">{conv.department}</span>
                    <span className="text-[10px] text-slate-500">{new Date(conv.timestamp).toLocaleDateString('en-US', { timeZone: 'UTC' })}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Center Canvas */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-900/20 rounded-2xl border border-slate-800/50 relative overflow-hidden">
        
        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 pb-32 hide-scrollbar">
          
          <div className="max-w-4xl mx-auto">
            <ContextBanner context={context} />
          </div>

          {!activeConversationId ? (
            <div className="flex flex-col items-center justify-center h-full max-w-3xl mx-auto text-center mt-[-40px]">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6">
                <SearchCode className="w-8 h-8 text-emerald-500" />
              </div>
              <h2 className={`text-2xl font-bold ${tokens.text.primary} mb-3`}>Industrial Knowledge Assistant</h2>
              <p className={`text-sm ${tokens.text.secondary} mb-12 max-w-xl leading-relaxed`}>
                Ask operational, maintenance, compliance and engineering questions. Answers are securely reasoned across your entire plant's knowledge graph, SOPs, and telemetry.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full text-left">
                {ASSISTANT_PROMPTS.map((prompt, idx) => (
                  <button 
                    key={idx}
                    onClick={() => handleSendMessage(prompt)}
                    className={`p-4 rounded-xl border ${tokens.card.border} bg-slate-900/50 hover:bg-slate-800 hover:border-emerald-500/30 transition-all text-sm text-slate-300 font-medium group flex items-start gap-3`}
                  >
                    <MessageSquare className="w-4 h-4 text-emerald-500/50 mt-0.5 group-hover:text-emerald-500 transition-colors shrink-0" />
                    <span>{prompt}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto flex flex-col gap-8">
              {activeConversation?.messages.map((msg) => (
                <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  
                  {msg.role === 'assistant' && (
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 mt-1">
                      <Bot className="w-5 h-5 text-emerald-500" />
                    </div>
                  )}

                  <div className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    
                    {msg.role === 'user' ? (
                      <div className="px-5 py-3.5 rounded-2xl bg-slate-800 text-slate-200 text-sm font-medium leading-relaxed">
                        {msg.content}
                      </div>
                    ) : (
                      <div className="w-full flex flex-col gap-2">
                        
                        {/* 1. Reasoning Trace */}
                        {msg.reasoningSteps && msg.reasoningSteps.length > 0 && (
                          <ReasoningTrace steps={msg.reasoningSteps} />
                        )}

                        {/* 2. Executive Summary & Confidence */}
                        {msg.executiveSummary && (
                          <ExecutiveSummaryCard summary={msg.executiveSummary} confidence={msg.confidenceScore || 0} />
                        )}

                        {/* 3. Main Text Answer */}
                        {msg.content && (
                          <div className="text-sm text-slate-300 leading-relaxed font-medium px-2 py-1 mb-2">
                            {msg.content}
                          </div>
                        )}

                        {/* 4. Rich Components */}
                        {msg.evidence && msg.evidence.length > 0 && (
                          <EvidenceCardList evidence={msg.evidence} />
                        )}
                        
                        {msg.graphNodes && msg.graphNodes.length > 0 && (
                          <GraphRagVisualizer nodes={msg.graphNodes} />
                        )}
                        
                        {msg.complianceImpacts && msg.complianceImpacts.length > 0 && (
                          <ComplianceRiskList impacts={msg.complianceImpacts} />
                        )}
                        
                        {msg.recommendations && msg.recommendations.length > 0 && (
                          <RecommendationsList recommendations={msg.recommendations} />
                        )}

                        {/* 5. Follow Up */}
                        {msg.followUpQuestions && msg.followUpQuestions.length > 0 && (
                          <FollowUpSuggestions 
                            suggestions={msg.followUpQuestions} 
                            onClick={(q) => handleSendMessage(q)} 
                          />
                        )}
                        
                      </div>
                    )}
                  </div>

                  {msg.role === 'user' && (
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0 mt-1">
                      <User className="w-5 h-5 text-blue-500" />
                    </div>
                  )}

                </div>
              ))}
              
              {isTyping && (
                <div className="flex gap-4 justify-start">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 mt-1">
                    <Loader2 className="w-5 h-5 text-emerald-500 animate-spin" />
                  </div>
                  <div className="flex items-center px-4 py-3 text-sm font-medium text-emerald-500/70">
                    Querying Knowledge Graph and analyzing documents...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
          
        </div>

        {/* Input Area */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-900 via-slate-900 to-transparent">
          <div className="max-w-4xl mx-auto relative">
            <div className={`p-2 rounded-2xl bg-slate-950 border ${tokens.card.border} shadow-2xl flex items-end gap-2`}>
              <button className="p-3 text-slate-400 hover:text-white transition-colors shrink-0 rounded-xl hover:bg-slate-800">
                <Paperclip className="w-5 h-5" />
              </button>
              
              <textarea 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Ask about assets, procedures, compliance, or historical data..."
                className="flex-1 bg-transparent border-none text-sm text-white focus:outline-none focus:ring-0 py-3.5 resize-none max-h-32 min-h-[50px] placeholder-slate-600 font-medium"
                rows={1}
              />
              
              <button className="p-3 text-slate-400 hover:text-white transition-colors shrink-0 rounded-xl hover:bg-slate-800">
                <Mic className="w-5 h-5" />
              </button>
              <button 
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim()}
                className={`p-3 shrink-0 rounded-xl flex items-center justify-center transition-colors ${
                  inputValue.trim() 
                    ? 'bg-emerald-500 text-white hover:bg-emerald-400' 
                    : 'bg-slate-800 text-slate-500'
                }`}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <div className="text-center mt-3 text-[10px] text-slate-600 font-medium tracking-wide">
              AI responses may contain errors. Please verify critical decisions against raw documentation or human review.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export function DecisionAssistantPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-1 items-center justify-center min-h-0 w-full">
        <Loader2 className="w-6 h-6 text-emerald-500 animate-spin" />
      </div>
    }>
      <DecisionAssistantContent />
    </Suspense>
  );
}

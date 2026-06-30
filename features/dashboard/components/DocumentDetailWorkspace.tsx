"use client";

import React from "react";
import { useTheme } from "@/hooks/useTheme";
import { DESIGN_TOKENS } from "@/constants/design";
import { DocumentData } from "../constants/recentDocumentsData";
import { motion } from "framer-motion";
import { 
  ArrowLeft, FileText, Download, Share2, ExternalLink, 
  Clock, ShieldCheck, Sparkles, Tag, GitCommit, Link as LinkIcon, AlertTriangle
} from "lucide-react";

interface DocumentDetailWorkspaceProps {
  documentId: string;
  documents: DocumentData[];
  onBack: () => void;
}

const formatDate = (isoString: string) => {
  const d = new Date(isoString);
  return d.toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });
};

export function DocumentDetailWorkspace({ documentId, documents, onBack }: DocumentDetailWorkspaceProps) {
  const { theme } = useTheme();
  const tokens = DESIGN_TOKENS[theme];
  
  const doc = documents.find(d => d.id === documentId);
  
  if (!doc) return <div className="p-6 text-white">Document not found.</div>;

  return (
    <div className="flex flex-col w-full pb-8">
      {/* Header Area */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-start gap-4">
          <button 
            onClick={onBack}
            className="p-2 -ml-2 rounded-lg hover:bg-slate-800/50 transition-colors text-slate-400 hover:text-white mt-1"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div className="flex gap-4">
            <div className="w-14 h-16 bg-slate-800 rounded-lg flex flex-col items-center justify-center shrink-0 border border-slate-700 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-4 h-4 bg-slate-700 border-b border-l border-slate-600 rounded-bl" />
              <span className="text-xs font-bold mt-1 text-red-500">PDF</span>
            </div>
            <div>
              <h1 className={`text-2xl font-bold ${tokens.text.primary}`}>{doc.title}</h1>
              <p className={`text-sm ${tokens.text.secondary} mt-1`}>{doc.fileName}</p>
              
              <div className="flex items-center gap-4 mt-3">
                <span className="px-2.5 py-1 rounded text-xs font-medium bg-slate-800 text-slate-300">
                  {doc.documentType}
                </span>
                <span className="px-2.5 py-1 rounded text-xs font-medium bg-emerald-500/10 text-emerald-400">
                  Version {doc.version}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-slate-400">
                  <div className={`w-2 h-2 rounded-full ${doc.status === 'Processed' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                  {doc.status}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button className={`px-4 py-2 rounded-lg border ${tokens.card.border} text-slate-300 hover:bg-slate-800/50 transition-colors flex items-center gap-2 text-sm font-medium`}>
            <Share2 className="w-4 h-4" /> Share
          </button>
          <button className={`px-4 py-2 rounded-lg border ${tokens.card.border} text-slate-300 hover:bg-slate-800/50 transition-colors flex items-center gap-2 text-sm font-medium`}>
            <Download className="w-4 h-4" /> Download
          </button>
          <button className="px-4 py-2 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-colors flex items-center gap-2 text-sm font-medium">
            <ExternalLink className="w-4 h-4" /> Open Original
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6 pb-6">
        
        {/* Left Column (Main Document Data) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* AI Summary Panel */}
          <div className={`rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-6`}>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-emerald-500" />
              <h2 className="text-lg font-semibold text-emerald-500">AI Executive Summary</h2>
              <div className="ml-auto flex items-center gap-1.5 text-xs font-medium text-emerald-500/70 bg-emerald-500/10 px-2 py-1 rounded">
                <ShieldCheck className="w-3.5 h-3.5" /> {doc.confidence}% Confidence
              </div>
            </div>
            <p className={`text-sm leading-relaxed ${tokens.text.primary}`}>
              {doc.summary}
            </p>
            {doc.keyHighlights.length > 0 && (
              <div className="mt-5 space-y-2">
                <h3 className="text-sm font-medium text-slate-300 mb-3">Key Extracted Highlights</h3>
                {doc.keyHighlights.map((highlight, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <span className={`text-sm ${tokens.text.secondary}`}>{highlight}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* AI Insights & Actions */}
          {(doc.aiInsights.length > 0 || doc.suggestedActions.length > 0) && (
            <div className={`rounded-xl border ${tokens.card.border} ${tokens.card.background} p-6`}>
              <h2 className={`text-base font-semibold ${tokens.text.primary} mb-5`}>AI Analysis & Recommendations</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-slate-400 mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Detected Insights
                  </h3>
                  <div className="space-y-3">
                    {doc.aiInsights.map((insight, idx) => (
                      <div key={idx} className="p-3 rounded-lg bg-slate-800/50 text-sm text-slate-300 border border-slate-700/50">
                        {insight}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-400 mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" /> Suggested Actions
                  </h3>
                  <div className="space-y-3">
                    {doc.suggestedActions.map((action, idx) => (
                      <div key={idx} className="p-3 rounded-lg border border-amber-500/20 bg-amber-500/5 flex items-start justify-between gap-2">
                        <span className="text-sm text-slate-300">{action.action}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase shrink-0 ${
                          action.priority === 'High' ? 'bg-red-500/10 text-red-400' :
                          action.priority === 'Medium' ? 'bg-amber-500/10 text-amber-400' : 'bg-blue-500/10 text-blue-400'
                        }`}>
                          {action.priority}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Knowledge Graph Relationships */}
          <div className={`rounded-xl border ${tokens.card.border} ${tokens.card.background} p-6`}>
            <div className="flex items-center justify-between mb-5">
              <h2 className={`text-base font-semibold ${tokens.text.primary}`}>Knowledge Graph Relationships</h2>
              <button className="text-xs text-emerald-500 hover:text-emerald-400 font-medium">View in Graph →</button>
            </div>
            
            {doc.relatedEntities.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {doc.relatedEntities.map((entity, idx) => (
                  <div key={idx} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50">
                    <LinkIcon className="w-3.5 h-3.5 text-slate-400" />
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block">{entity.type}</span>
                      <span className="text-sm font-medium text-slate-200">{entity.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">No extracted entities mapped to the knowledge graph yet.</p>
            )}
          </div>
          
          {/* Revision History */}
          <div className={`rounded-xl border ${tokens.card.border} ${tokens.card.background} p-6`}>
            <h2 className={`text-base font-semibold ${tokens.text.primary} mb-5`}>Revision History</h2>
            {doc.revisionHistory.length > 0 ? (
              <div className="space-y-4">
                {doc.revisionHistory.map((rev, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700">
                      <GitCommit className="w-4 h-4 text-slate-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-200">{rev.version}</span>
                        <span className="text-xs text-slate-500">• {formatDate(rev.createdAt)}</span>
                      </div>
                      <p className="text-sm text-slate-400 mt-1">{rev.changes}</p>
                      <p className="text-xs text-slate-500 mt-1">Author: {rev.createdBy}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">Initial version. No prior revisions recorded.</p>
            )}
          </div>
          
        </div>

        {/* Right Column (Metadata & Details) */}
        <div className="space-y-6">
          
          <div className={`rounded-xl border ${tokens.card.border} ${tokens.card.background} p-6`}>
            <h3 className={`text-sm font-semibold ${tokens.text.primary} mb-4`}>Document Details</h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-slate-500 mb-1">Owner</p>
                <p className="text-sm text-slate-200">{doc.owner}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Department</p>
                <p className="text-sm text-slate-200">{doc.department}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Uploaded By</p>
                <p className="text-sm text-slate-200">{doc.uploadedBy} on {formatDate(doc.uploadedAt)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Last Modified</p>
                <p className="text-sm text-slate-200">{formatDate(doc.lastModified)}</p>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mb-1">File Size</p>
                  <p className="text-sm text-slate-200">{doc.fileSize}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Pages</p>
                  <p className="text-sm text-slate-200">{doc.pages}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-slate-800/50">
              <h3 className={`text-sm font-semibold ${tokens.text.primary} mb-3`}>Tags</h3>
              <div className="flex flex-wrap gap-2">
                {doc.tags.map(tag => (
                  <span key={tag} className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 text-xs font-medium text-slate-300">
                    <Tag className="w-3 h-3 text-slate-500" /> {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          <div className={`rounded-xl border ${tokens.card.border} ${tokens.card.background} p-6`}>
            <h3 className={`text-sm font-semibold ${tokens.text.primary} mb-4`}>Compliance & Approval</h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-slate-500 mb-1">Approval Status</p>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${doc.approvalStatus === 'Approved' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                  <span className="text-sm text-slate-200">{doc.approvalStatus}</span>
                </div>
              </div>
              {doc.expiryDate && (
                <div>
                  <p className="text-xs text-slate-500 mb-1">Expiry Date</p>
                  <p className="text-sm text-slate-200">{formatDate(doc.expiryDate)}</p>
                </div>
              )}
              {doc.complianceReferences.length > 0 && (
                <div>
                  <p className="text-xs text-slate-500 mb-2">Compliance References</p>
                  <div className="space-y-1.5">
                    {doc.complianceReferences.map(ref => (
                      <div key={ref} className="text-xs text-slate-300 px-2.5 py-1.5 rounded border border-slate-700 bg-slate-800/50">
                        {ref}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {doc.processingTimeline.length > 0 && (
            <div className={`rounded-xl border ${tokens.card.border} ${tokens.card.background} p-6`}>
              <h3 className={`text-sm font-semibold ${tokens.text.primary} mb-4`}>Processing Timeline</h3>
              <div className="relative border-l border-slate-700 ml-2 space-y-4 pb-2">
                {doc.processingTimeline.map((step, idx) => (
                  <div key={idx} className="relative pl-5">
                    <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-slate-400 border-2 border-slate-900" />
                    <p className="text-sm text-slate-200">{step.action}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{formatDate(step.timestamp)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import { useTheme } from "@/hooks/useTheme";
import { DESIGN_TOKENS } from "@/constants/design";
import { DocumentData } from "../constants/recentDocumentsData";
import { ArrowRight, FileText } from "lucide-react";

interface RecentDocumentsProps {
  data: {
    title: string;
    documents: DocumentData[];
  };
  onExpand?: () => void;
  className?: string;
}

const formatRelativeTime = (isoString: string) => {
  const date = new Date(isoString);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  return `${Math.floor(diffInHours / 24)}d ago`;
};

export function RecentDocuments({ data, onExpand, className = "" }: RecentDocumentsProps) {
  const { theme } = useTheme();
  const tokens = DESIGN_TOKENS[theme];

  const recentDocs = data.documents.slice(0, 2);

  return (
    <div className={`${className} flex flex-col`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h2 className={`text-lg font-bold ${tokens.text.primary}`}>{data.title}</h2>
        <button 
          onClick={onExpand}
          className="flex items-center gap-1 text-[13px] font-medium text-emerald-500 hover:text-emerald-400 transition-colors"
        >
          View all <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* List */}
      <div className="flex-1 flex flex-col space-y-2 min-h-0 overflow-hidden">
        {recentDocs.map((doc) => (
          <div key={doc.id} className="flex items-center justify-between group">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-9 bg-slate-100 dark:bg-slate-800 rounded flex flex-col items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-slate-200 dark:bg-slate-700 border-b border-l border-slate-300 dark:border-slate-600 rounded-bl" />
                <span className="text-[8px] font-bold mt-1 text-red-500">PDF</span>
              </div>
              <div className="min-w-0">
                <p className={`text-[13px] font-semibold truncate ${tokens.text.primary}`}>{doc.fileName}</p>
                <p className={`text-[10px] truncate ${tokens.text.secondary}`}>
                  {doc.documentType} &bull; {doc.asset}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end shrink-0 ml-2">
              <span className={`text-[11px] ${tokens.text.secondary}`}>{formatRelativeTime(doc.uploadedAt)}</span>
              <div className="flex items-center gap-1 mt-0.5">
                <div className={`w-1.5 h-1.5 rounded-full ${doc.status === 'Processed' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                <span className={`text-[10px] text-slate-400`}>{doc.status}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

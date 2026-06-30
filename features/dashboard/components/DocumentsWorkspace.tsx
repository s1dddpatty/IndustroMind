"use client";

import React, { useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import { DESIGN_TOKENS } from "@/constants/design";
import { DocumentData } from "../constants/recentDocumentsData";
import { motion } from "framer-motion";
import { 
  ArrowLeft, FileText, Search, Filter, ArrowUpDown, 
  Upload, MoreVertical, Download, ExternalLink, Share2
} from "lucide-react";

interface DocumentsWorkspaceProps {
  data: DocumentData[];
  onBack: () => void;
  onSelectDocument: (id: string) => void;
  onUpload?: () => void;
}

const formatDate = (isoString: string) => {
  const d = new Date(isoString);
  return d.toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

export function DocumentsWorkspace({ data, onBack, onSelectDocument, onUpload }: DocumentsWorkspaceProps) {
  const { theme } = useTheme();
  const tokens = DESIGN_TOKENS[theme];
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("All");

  const filteredDocs = data.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          doc.fileName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "All" || doc.documentType === filterType;
    return matchesSearch && matchesType;
  });

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
                <FileText className="w-6 h-6 text-emerald-500" />
                Document Center
              </h1>
              <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                <span>Sample Plant</span>
                <span>•</span>
                <span>{data.length} Total Documents</span>
                <span>•</span>
                <span className="text-emerald-500">Live Sync Active</span>
              </div>
            </div>
          </div>
          
          <button 
            onClick={onUpload}
            className="px-4 py-2 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-colors flex items-center gap-2 text-sm font-medium"
          >
            <Upload className="w-4 h-4" /> Upload Document
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-3 flex-1 max-w-xl">
            <div className={`flex-1 relative flex items-center bg-slate-900/50 rounded-lg border ${tokens.card.border}`}>
              <Search className="w-4 h-4 text-slate-400 absolute left-3" />
              <input 
                type="text" 
                placeholder="Search documents, assets, or content..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent border-none text-sm text-white focus:outline-none focus:ring-0 py-2 pl-9 pr-4 placeholder-slate-500"
              />
            </div>
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className={`py-2 px-3 rounded-lg bg-slate-900/50 border ${tokens.card.border} text-sm text-slate-300 focus:outline-none`}
            >
              <option value="All">All Types</option>
              <option value="SOP">SOP</option>
              <option value="Datasheet">Datasheet</option>
              <option value="Checklist">Checklist</option>
              <option value="Report">Report</option>
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
      <div className={`w-full rounded-xl border ${tokens.card.border} ${tokens.card.background} shadow-sm`}>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className={`border-b ${tokens.card.border} text-xs uppercase tracking-wider text-slate-500 bg-slate-900/30`}>
              <th className="px-6 py-4 font-medium">Document</th>
              <th className="px-6 py-4 font-medium">Asset / Type</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Modified</th>
              <th className="px-6 py-4 font-medium">Owner</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {filteredDocs.map((doc) => (
              <tr 
                key={doc.id} 
                onClick={() => onSelectDocument(doc.id)}
                className="hover:bg-slate-800/20 transition-colors cursor-pointer group"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-12 bg-slate-800 rounded flex flex-col items-center justify-center shrink-0 border border-slate-700 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-3 h-3 bg-slate-700 border-b border-l border-slate-600 rounded-bl" />
                      <span className="text-[10px] font-bold mt-1 text-red-500">PDF</span>
                    </div>
                    <div>
                      <p className={`text-sm font-semibold ${tokens.text.primary}`}>{doc.title}</p>
                      <p className={`text-xs ${tokens.text.secondary} mt-0.5`}>{doc.fileName}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className={`text-sm ${tokens.text.primary}`}>{doc.asset}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-300">
                      {doc.documentType}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-400">
                      v{doc.version}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      doc.status === 'Processed' ? 'bg-emerald-500' : 
                      doc.status === 'Review Required' ? 'bg-amber-500' : 'bg-slate-500'
                    }`} />
                    <span className={`text-sm ${tokens.text.primary}`}>{doc.status}</span>
                  </div>
                  {doc.confidence > 0 && (
                    <p className="text-xs text-slate-500 mt-1">AI Confidence: {doc.confidence}%</p>
                  )}
                </td>
                <td className="px-6 py-4">
                  <p className={`text-sm ${tokens.text.primary}`}>{formatDate(doc.lastModified)}</p>
                  <p className={`text-xs ${tokens.text.secondary} mt-1`}>{doc.fileSize} • {doc.pages} pages</p>
                </td>
                <td className="px-6 py-4">
                  <p className={`text-sm ${tokens.text.primary}`}>{doc.owner}</p>
                  <p className={`text-xs ${tokens.text.secondary} mt-1`}>{doc.department}</p>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-700 transition-colors" onClick={(e) => e.stopPropagation()}>
                      <ExternalLink className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-700 transition-colors" onClick={(e) => e.stopPropagation()}>
                      <Download className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-700 transition-colors" onClick={(e) => e.stopPropagation()}>
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-700 transition-colors" onClick={(e) => e.stopPropagation()}>
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredDocs.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                  No documents found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

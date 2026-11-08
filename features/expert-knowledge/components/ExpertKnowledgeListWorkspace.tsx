"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/hooks/useTheme";
import { DESIGN_TOKENS } from "@/constants/design";
import { ExpertKnowledgeArticle } from "../constants/expertKnowledgeData";
import { useSystemDocuments } from "@/features/shared/hooks/useSystemDocuments";
import {
  Search, Filter, Download, ChevronRight, Users,
  Lightbulb, BrainCircuit, Activity, BookOpen, AlertTriangle, Upload
} from "lucide-react";

interface ExpertKnowledgeListWorkspaceProps {
  onSelectArticle: (id: string) => void;
}

const INGESTED_EXPERT_ARTICLES: ExpertKnowledgeArticle[] = [
  {
    id: "ek-sop-042",
    title: "SOP-MECH-042 Mechanical Seal Warm-Up Bypass Clause",
    category: "Mechanical",
    sourceType: "Senior Engineer Experience",
    maturity: "Validated",
    experts: [
      { name: "Robert Chen", role: "Principal Mechanical Engineer", department: "Mechanical Reliability", type: "Primary Expert" }
    ],
    knowledgeScore: 96,
    confidence: 98,
    aiConfidence: 96,
    completeness: 94,
    evidenceCoverage: 96,
    usageFrequency: 142,
    reviewFreshness: "Fresh",
    knowledgeHealth: "Excellent",
    executiveAiSummary: "Heuristic captured from SOP-MECH-042: Suction valve V-101 must not be locked 100% closed during seal warm-up flush to prevent thermal shock and dry-run damage on MS-204 cartridge seals.",
    content: {
      overview: "Standard operating procedure isolation nuance for centrifugal pump P-204.",
      technicalDetails: "Flowserve mechanical seal MS-204 requires barrier fluid circulation at 15 psi differential prior to complete suction isolation.",
      operationalContext: "Centrifugal pump P-204 unit 3 hydrocarbon processing.",
      fieldTricks: ["Crack valve V-101 by 5% during initial 10-minute flush."],
      failureSymptoms: ["Audible squeal from inboard seal face during cold startup."],
      commonMistakes: ["Applying full LOTO isolation before seal chamber pressure drops to ambient."],
      lessonsLearned: ["Dry-running the seal for more than 45 seconds causes immediate micro-fracturing of carbon faces."],
      knownLimitations: ["Applies only to Durco Mark 3 pumps with API Plan 53A seal pots."]
    },
    impact: {
      safety: "High",
      operational: "High",
      reliability: "High",
      maintenance: "Medium",
      production: "High",
      environmental: "Medium",
      description: "Prevents hazardous hydrocarbon leaks and catastrophic seal blowouts during pump isolation."
    },
    knowledgeGaps: [],
    aiInsights: ["AI cross-referenced Flowserve OEM manual and flagged discrepancy in SOP-MECH-042."],
    applicableAssets: [
      { id: "ast-p204", tag: "P-204", name: "Centrifugal Pump P-204" }
    ],
    supportingEvidence: [
      { id: "ev-1", title: "SOP-MECH-042 Revision 3.2", type: "SOP", relevanceScore: 98 }
    ],
    timeline: [
      { id: "tl-1", date: "2026-11-07", type: "Validated", description: "Extracted from SOP-MECH-042 during document processing." }
    ],
    versions: [
      { versionNumber: 1, date: "2026-11-07", whatChanged: "Initial extraction", whyChanged: "Document ingested", approvedBy: "Reliability Lead", affectedAssets: ["P-204"] }
    ],
    reuseMetrics: {
      referencedByDecisionAssistant: 34,
      referencedByAiBriefs: 12,
      referencedByCompliance: 8,
      referencedByMaintenancePlans: 15,
      referencedBySopUpdates: 3,
      referencedByPreviousQueries: 28
    },
    lastUpdated: "2026-11-07",
    tags: ["P-204", "SOP-MECH-042", "Mechanical-Seal", "LOTO"]
  },
  {
    id: "ek-inc-2023-09",
    title: "Incident INC-2023-09: Premature Valve Bleed Prevention Heuristic",
    category: "Safety",
    sourceType: "Incident Investigation",
    maturity: "Operational",
    experts: [
      { name: "Alice Fernandez", role: "Lead Safety Auditor", department: "HSE", type: "Primary Expert" }
    ],
    knowledgeScore: 92,
    confidence: 95,
    aiConfidence: 94,
    completeness: 90,
    evidenceCoverage: 92,
    usageFrequency: 84,
    reviewFreshness: "Fresh",
    knowledgeHealth: "Good",
    executiveAiSummary: "Root cause heuristic from Incident INC-2023-09: Premature opening of discharge valve V-102 before line pressure bleed caused back-pressure surge and flange distortion.",
    content: {
      overview: "Safety investigation findings on centrifugal pump P-204 discharge header.",
      technicalDetails: "Residual pressure in discharge line exceeded 280 psi when technician cracked V-102 bleed cock.",
      operationalContext: "High-pressure hydrocarbon service in Unit 3.",
      fieldTricks: ["Always verify double-block bleed gauge reads 0 psi before touching bleed cock."],
      failureSymptoms: ["Sudden gauge flutter or hiss from packing gland."],
      commonMistakes: ["Relying on upstream valve handle position rather than pressure gauge verification."],
      lessonsLearned: ["Never crack bleed valves without full PPE and verifying zero energy state."],
      knownLimitations: ["Mandatory for all 300# and 600# class lines."]
    },
    impact: {
      safety: "High",
      operational: "Medium",
      reliability: "High",
      maintenance: "Low",
      production: "Medium",
      environmental: "Low",
      description: "Prevents high-pressure gas release and maintenance personnel injury."
    },
    knowledgeGaps: [],
    aiInsights: ["Referenced directly in SOP-MECH-042 section 4 as historical incident precedent."],
    applicableAssets: [
      { id: "ast-p204", tag: "P-204", name: "Centrifugal Pump P-204" },
      { id: "ast-v102", tag: "V-102", name: "Discharge Valve V-102" }
    ],
    supportingEvidence: [
      { id: "ev-2", title: "Incident Report INC-2023-09", type: "Document", relevanceScore: 96 }
    ],
    timeline: [
      { id: "tl-2", date: "2026-11-07", type: "Created", description: "Extracted from historical incident citation in SOP-MECH-042." }
    ],
    versions: [
      { versionNumber: 1, date: "2026-11-07", whatChanged: "Initial creation", whyChanged: "Document ingested", approvedBy: "HSE Lead", affectedAssets: ["P-204", "V-102"] }
    ],
    reuseMetrics: {
      referencedByDecisionAssistant: 18,
      referencedByAiBriefs: 6,
      referencedByCompliance: 4,
      referencedByMaintenancePlans: 8,
      referencedBySopUpdates: 2,
      referencedByPreviousQueries: 14
    },
    lastUpdated: "2026-11-07",
    tags: ["INC-2023-09", "Safety", "Bleed-Verification", "V-102"]
  }
];

export function ExpertKnowledgeListWorkspace({ onSelectArticle }: ExpertKnowledgeListWorkspaceProps) {
  const router = useRouter();
  const { theme } = useTheme();
  const tokens = DESIGN_TOKENS[theme];
  const [searchQuery, setSearchQuery] = useState("");
  const { hasDocuments } = useSystemDocuments();

  const currentArticles = hasDocuments ? INGESTED_EXPERT_ARTICLES : [];
  const totalArticles = currentArticles.length;
  const validated = currentArticles.filter(a => a.maturity === "Validated" || a.maturity === "Operational").length;
  const lessonsLearned = currentArticles.filter(a => a.sourceType === "Incident Investigation").length;
  const aiInsights = currentArticles.length;

  const filteredArticles = currentArticles.filter(a =>
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
          <button 
            onClick={() => window.print()}
            title="Export Expert Knowledge Catalog"
            className={`p-2 rounded-xl bg-slate-900/50 border ${tokens.card.border} hover:bg-slate-800 transition-colors text-slate-300 cursor-pointer`}
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Articles", value: totalArticles, icon: BookOpen, color: "text-purple-500", bg: "bg-purple-500/10" },
          { label: "Validated", value: validated, icon: Lightbulb, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "Lessons Learned", value: lessonsLearned, icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-500/10" },
          { label: "AI Insights", value: aiInsights, icon: BrainCircuit, color: "text-cyan-500", bg: "bg-cyan-500/10" },
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
      <div className={`flex-1 rounded-2xl bg-slate-900/40 border ${tokens.card.border} overflow-hidden flex flex-col min-h-[300px]`}>
        <div className={`max-md:hidden grid grid-cols-12 gap-4 p-4 border-b ${tokens.card.border} bg-slate-900/80 text-xs font-semibold ${tokens.text.secondary} uppercase tracking-wider`}>
          <div className="col-span-4">Knowledge Topic & Source</div>
          <div className="col-span-2">Maturity</div>
          <div className="col-span-2">Contributors</div>
          <div className="col-span-3">Confidence & Usage</div>
          <div className="col-span-1 text-right">Actions</div>
        </div>

        <div className="flex-1 overflow-y-auto hide-scrollbar flex flex-col">
          {filteredArticles.length > 0 ? (
            filteredArticles.map((article) => (
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
                  <h3 className="text-sm font-bold text-white group-hover:text-purple-400 transition-colors line-clamp-1">{article.title}</h3>
                </div>

                {/* Maturity */}
                <div className="col-span-2 flex flex-col justify-center gap-1">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${article.maturity === "Validated" ? "bg-emerald-500" :
                        article.maturity === "Operational" ? "bg-blue-500" : "bg-purple-500"
                      }`} />
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">{article.maturity}</span>
                  </div>
                  <span className={`text-[10px] ${tokens.text.secondary}`}>Ver 1.0</span>
                </div>

                {/* Contributors */}
                <div className="col-span-2 flex flex-col justify-center">
                  <span className="text-xs font-semibold text-slate-200">{article.experts[0]?.name || "System AI"}</span>
                  <span className={`text-[10px] ${tokens.text.secondary}`}>Mechanical Reliability</span>
                </div>

                {/* Confidence & Usage */}
                <div className="col-span-3 flex flex-col justify-center gap-1.5">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div className="h-full bg-emerald-500" style={{ width: `${article.confidence}%` }} />
                    </div>
                    <span className="text-xs font-semibold text-slate-300">Score: {article.confidence}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px]">
                    <span className="text-slate-400">{article.usageFrequency} uses</span>
                    <span className="text-slate-600">&bull;</span>
                    <span className="text-emerald-400 font-medium">AI Conf: {article.aiConfidence}%</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="col-span-1 flex items-center justify-end">
                  <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-purple-400 transition-colors" />
                </div>

              </div>
            ))
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-slate-500">
              <Users className="w-12 h-12 mb-3 opacity-40 text-purple-500" />
              <p className="text-base font-semibold text-slate-300">No Expert Knowledge Captured Yet</p>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mb-5">
                Organizational memory is currently empty. Upload SOP documents, incident investigations, or interview transcripts to capture tacit expert heuristics.
              </p>
              <button
                onClick={() => router.push("/demo/documents?action=upload")}
                className="px-4 py-2 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-500 transition-colors flex items-center gap-2 text-xs"
              >
                <Upload className="w-3.5 h-3.5" /> Upload Industrial Document
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

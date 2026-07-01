"use client";

import React from "react";
import { useTheme } from "@/hooks/useTheme";
import { DESIGN_TOKENS } from "@/constants/design";
import { AiDecisionBrief } from "../constants/aiDecisionBriefData";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Sparkles, Download, Share2, Clock, MapPin, ShieldCheck } from "lucide-react";
import { AiGenerationExperience } from "./AiGenerationExperience";
import {
  ExecutiveSummarySection,
  OperationalRisksSection,
  ComplianceSummarySection,
  MaintenanceRecommendationsSection,
  InspectionPrioritiesSection,
  AiSuggestedActionsSection,
  PredictedBottlenecksSection,
  RequiredHumanDecisionsSection
} from "./AiBriefSections";

const formatDate = (isoString: string) => {
  const d = new Date(isoString);
  return d.toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: false });
};

interface AiBriefWorkspaceProps {
  brief: AiDecisionBrief;
  isGenerating: boolean;
  onBack: () => void;
  onGenerateNew: () => void;
}

export function AiBriefWorkspace({ brief, isGenerating, onBack, onGenerateNew }: AiBriefWorkspaceProps) {
  const { theme } = useTheme();
  const tokens = DESIGN_TOKENS[theme];

  return (
    <div className="flex flex-col w-full pb-8">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            disabled={isGenerating}
            className="p-2 -ml-2 rounded-lg hover:bg-slate-800/50 transition-colors text-slate-400 hover:text-white disabled:opacity-50 shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="min-w-0">
            <h1 className={`text-xl md:text-2xl font-bold flex items-center gap-2 ${tokens.text.primary} truncate`}>
              <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-emerald-500 shrink-0" />
              <span className="truncate">AI Decision Brief</span>
            </h1>
            {!isGenerating && (
              <div className="flex flex-wrap items-center gap-3 md:gap-4 mt-2 text-xs text-slate-400">
                <span className="flex items-center gap-1 shrink-0"><Clock className="w-3.5 h-3.5" /> {formatDate(brief.createdAt)}</span>
                <span className="flex items-center gap-1 shrink-0"><MapPin className="w-3.5 h-3.5" /> {brief.plantId}</span>
                <span className="flex items-center gap-1 shrink-0"><ShieldCheck className="w-3.5 h-3.5" /> Conf: <strong className="text-emerald-500">{brief.confidenceScore}%</strong></span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        {!isGenerating && (
          <div className="flex flex-wrap items-center gap-2 md:gap-3 pl-10 md:pl-0">
            <button 
              onClick={() => alert("[DEMO]: Exporting PDF...")}
              className={`px-3 md:px-4 py-2 rounded-lg border ${tokens.card.border} ${tokens.text.secondary} hover:bg-slate-800/50 transition-colors flex items-center gap-2 text-xs md:text-sm font-medium`}
            >
              <Download className="w-4 h-4" /> <span className="max-sm:hidden">Export PDF</span>
            </button>
            <button 
              onClick={() => alert("[DEMO]: Opening sharing options...")}
              className={`px-3 md:px-4 py-2 rounded-lg border ${tokens.card.border} ${tokens.text.secondary} hover:bg-slate-800/50 transition-colors flex items-center gap-2 text-xs md:text-sm font-medium`}
            >
              <Share2 className="w-4 h-4" /> <span className="max-sm:hidden">Share</span>
            </button>
            <button 
              onClick={onGenerateNew}
              className="px-3 md:px-4 py-2 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-colors flex items-center gap-2 text-xs md:text-sm font-medium flex-1 sm:flex-none justify-center"
            >
              <Sparkles className="w-4 h-4" /> Generate New
            </button>
          </div>
        )}
      </div>

      {/* Main Body */}
      <div className={`w-full rounded-xl border ${tokens.card.border} ${tokens.card.background} p-6 shadow-sm`}>
        <AnimatePresence mode="wait">
          {isGenerating ? (
            <AiGenerationExperience key="generating" />
          ) : (
            <motion.div
              key={brief.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              {/* Left Column (Main Info) */}
              <div className="lg:col-span-2 space-y-6">
                <ExecutiveSummarySection summary={brief.executiveSummary} />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <OperationalRisksSection risks={brief.operationalRisks} />
                  <ComplianceSummarySection issues={brief.complianceSummary} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <MaintenanceRecommendationsSection actions={brief.maintenanceRecommendations} />
                  <InspectionPrioritiesSection priorities={brief.inspectionPriorities} />
                </div>
              </div>

              {/* Right Column (AI Actions & Decisions) */}
              <div className="space-y-6">
                <AiSuggestedActionsSection actions={brief.aiSuggestedActions} />
                <PredictedBottlenecksSection bottlenecks={brief.predictedBottlenecks} />
                <RequiredHumanDecisionsSection decisions={brief.requiredHumanDecisions} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

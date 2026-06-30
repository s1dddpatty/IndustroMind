"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "@/hooks/useTheme";
import { DESIGN_TOKENS } from "@/constants/design";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, FileText, Loader2, UploadCloud, 
  ShieldCheck, FileSearch, Sparkles, Link as LinkIcon
} from "lucide-react";

interface DocumentUploadExperienceProps {
  onComplete: () => void;
  onCancel: () => void;
}

const UPLOAD_STAGES = [
  { id: "upload", label: "Uploading document...", icon: UploadCloud, durationMs: 1500 },
  { id: "scan", label: "Virus scan & security check...", icon: ShieldCheck, durationMs: 1200 },
  { id: "extract", label: "Extracting text & metadata...", icon: FileText, durationMs: 1800 },
  { id: "ocr", label: "Running OCR & vision models...", icon: FileSearch, durationMs: 2200 },
  { id: "entities", label: "Extracting entities & relations...", icon: Sparkles, durationMs: 2000 },
  { id: "kg", label: "Linking to Knowledge Graph...", icon: LinkIcon, durationMs: 1800 },
  { id: "compliance", label: "Validating compliance rules...", icon: ShieldCheck, durationMs: 2000 },
  { id: "summary", label: "Generating AI summary...", icon: Sparkles, durationMs: 2500 }
];

export function DocumentUploadExperience({ onComplete, onCancel }: DocumentUploadExperienceProps) {
  const { theme } = useTheme();
  const tokens = DESIGN_TOKENS[theme];
  
  const [currentStageIndex, setCurrentStageIndex] = useState(-1);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Start sequence
    let isMounted = true;
    let currentIdx = 0;
    
    const runNextStage = () => {
      if (!isMounted) return;
      if (currentIdx >= UPLOAD_STAGES.length) {
        // All done
        setTimeout(() => {
          if (isMounted) onComplete();
        }, 800);
        return;
      }

      setCurrentStageIndex(currentIdx);
      const stage = UPLOAD_STAGES[currentIdx];
      
      // Update overall progress roughly based on stage index
      const targetProgress = Math.round(((currentIdx + 1) / UPLOAD_STAGES.length) * 100);
      setProgress(targetProgress);

      setTimeout(() => {
        currentIdx++;
        runNextStage();
      }, stage.durationMs);
    };

    // Small delay before starting
    const startTimer = setTimeout(() => {
      runNextStage();
    }, 500);

    return () => {
      isMounted = false;
      clearTimeout(startTimer);
    };
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full max-w-2xl mx-auto p-8">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`w-full bg-slate-900/80 backdrop-blur-xl border ${tokens.card.border} rounded-2xl p-8 shadow-2xl relative overflow-hidden`}
      >
        {/* Progress Background */}
        <div 
          className="absolute left-0 top-0 bottom-0 bg-emerald-500/5 transition-all duration-1000 ease-out z-0" 
          style={{ width: `${progress}%` }}
        />
        
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-20 h-20 bg-slate-800 rounded-2xl flex items-center justify-center border border-slate-700 mb-6 relative">
            <AnimatePresence mode="wait">
              {currentStageIndex >= UPLOAD_STAGES.length ? (
                <motion.div
                  key="done"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-[0_0_20px_rgba(16,185,129,0.4)]"
                >
                  <CheckCircle2 className="w-6 h-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="loading"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-2xl border-2 border-transparent border-t-emerald-500 opacity-50"
                />
              )}
            </AnimatePresence>
            {currentStageIndex < UPLOAD_STAGES.length && (
              <FileText className="w-8 h-8 text-slate-400" />
            )}
          </div>
          
          <h2 className={`text-xl font-bold ${tokens.text.primary} mb-2 text-center`}>
            {currentStageIndex >= UPLOAD_STAGES.length ? "Processing Complete" : "Processing Document"}
          </h2>
          
          <div className="w-full mt-8 space-y-4">
            {UPLOAD_STAGES.map((stage, idx) => {
              const status = idx < currentStageIndex ? "completed" : idx === currentStageIndex ? "running" : "pending";
              const Icon = stage.icon;
              
              if (idx > currentStageIndex + 1 && status === "pending") return null; // Only show current and next
              if (idx < currentStageIndex - 2 && status === "completed") return null; // Hide too old ones

              return (
                <motion.div 
                  key={stage.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex items-center gap-4 p-3 rounded-lg border transition-colors ${
                    status === "running" ? "bg-slate-800/80 border-emerald-500/30" :
                    status === "completed" ? "bg-emerald-500/5 border-emerald-500/10" :
                    "bg-transparent border-transparent opacity-50"
                  }`}
                >
                  <div className="w-6 flex justify-center shrink-0">
                    {status === "completed" ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    ) : status === "running" ? (
                      <Loader2 className="w-5 h-5 text-emerald-500 animate-spin" />
                    ) : (
                      <Icon className="w-4 h-4 text-slate-500" />
                    )}
                  </div>
                  <span className={`text-sm font-medium ${
                    status === "completed" ? "text-slate-300" :
                    status === "running" ? "text-emerald-400" :
                    "text-slate-500"
                  }`}>
                    {stage.label}
                  </span>
                </motion.div>
              );
            })}
          </div>

          <div className="w-full mt-8 pt-6 border-t border-slate-800/50 flex justify-between items-center">
            <span className="text-xs text-slate-500 font-mono">{progress}% Complete</span>
            {currentStageIndex < UPLOAD_STAGES.length && (
              <button 
                onClick={onCancel}
                className="text-xs text-slate-400 hover:text-white transition-colors"
              >
                Cancel Processing
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

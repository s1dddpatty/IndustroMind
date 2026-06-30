"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "@/hooks/useTheme";
import { DESIGN_TOKENS } from "@/constants/design";
import { motion } from "framer-motion";
import { Loader2, Sparkles, Database, ShieldCheck, FileText, CheckCircle2, Activity, Zap } from "lucide-react";
import { GENERATION_STEPS } from "../services/aiBriefService";

export function AiGenerationExperience() {
  const { theme } = useTheme();
  const tokens = DESIGN_TOKENS[theme];
  
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    if (currentStepIndex >= GENERATION_STEPS.length) return;
    
    const step = GENERATION_STEPS[currentStepIndex];
    const timer = setTimeout(() => {
      setCurrentStepIndex(prev => prev + 1);
    }, step.durationMs);

    return () => clearTimeout(timer);
  }, [currentStepIndex]);

  const currentStep = GENERATION_STEPS[Math.min(currentStepIndex, GENERATION_STEPS.length - 1)];
  const progressPercent = Math.min(((currentStepIndex + 1) / GENERATION_STEPS.length) * 100, 100);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center w-full h-full min-h-[500px]"
    >
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full animate-pulse" />
        <div className={`relative bg-slate-900 border ${tokens.card.border} p-6 rounded-2xl shadow-xl`}>
          <Sparkles className="w-12 h-12 text-emerald-500 animate-pulse" />
        </div>
      </div>

      <h2 className={`text-2xl font-bold mb-2 ${tokens.text.primary}`}>Generating AI Decision Brief</h2>
      
      <div className="flex items-center gap-3 mb-8 h-8">
        <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
        <motion.p 
          key={currentStep.message}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-sm ${tokens.text.secondary}`}
        >
          {currentStep.message}
        </motion.p>
      </div>

      {/* Progress Bar */}
      <div className="w-64 h-2 bg-slate-800 rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-emerald-500"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ ease: "linear", duration: 0.2 }}
        />
      </div>

      <div className="mt-8 grid grid-cols-4 gap-4 text-slate-600">
        <Database className={`w-5 h-5 ${currentStepIndex > 1 ? 'text-emerald-500' : ''} transition-colors`} />
        <ShieldCheck className={`w-5 h-5 ${currentStepIndex > 4 ? 'text-emerald-500' : ''} transition-colors`} />
        <Activity className={`w-5 h-5 ${currentStepIndex > 6 ? 'text-emerald-500' : ''} transition-colors`} />
        <Zap className={`w-5 h-5 ${currentStepIndex > 8 ? 'text-emerald-500' : ''} transition-colors`} />
      </div>
    </motion.div>
  );
}

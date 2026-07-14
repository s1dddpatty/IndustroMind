"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BrainCircuit, Database, FileText, Network, CheckCircle2, Server, ShieldAlert, BookOpen, LineChart, Cpu } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { DESIGN_TOKENS } from "@/constants/design";

import { IntelligenceReport } from "../constants/reportsData";

interface ReportGenerationWorkspaceProps {
  reportId: string;
  reports: IntelligenceReport[];
  onComplete: () => void;
}

const GENERATION_STEPS = [
  { id: 1, text: "Collecting Plant Telemetry...", icon: Database },
  { id: 2, text: "Traversing Knowledge Graph...", icon: Network },
  { id: 3, text: "Analyzing Maintenance History...", icon: Server },
  { id: 4, text: "Evaluating Compliance Rules...", icon: ShieldAlert },
  { id: 5, text: "Correlating Expert Knowledge...", icon: BookOpen },
  { id: 6, text: "Synthesizing Executive Narrative...", icon: FileText },
  { id: 7, text: "Preparing Decision Analytics...", icon: LineChart },
  { id: 8, text: "Finalizing Intelligence Report...", icon: CheckCircle2 }
];

export function ReportGenerationWorkspace({ reportId, reports, onComplete }: ReportGenerationWorkspaceProps) {
  const { theme } = useTheme();
  const tokens = DESIGN_TOKENS[theme];
  
  const report = reports.find(r => r.id === reportId);
  const isCompleted = report?.status === "Published" || report?.status === "completed";
  
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  // Fast-track if completed immediately
  useEffect(() => {
    if (isCompleted) {
      setProgress(100);
      setCurrentStep(GENERATION_STEPS.length - 1);
      const timer = setTimeout(() => onComplete(), 500);
      return () => clearTimeout(timer);
    }
  }, [isCompleted, onComplete]);

  useEffect(() => {
    if (isCompleted) return;

    // Simulate progress while waiting for backend polling
    // Hold at 95% if backend is still processing
    const totalTime = 12000; // Stretch to 12s for long polls
    const stepTime = totalTime / GENERATION_STEPS.length;
    
    let currentProgress = 0;
    const progressInterval = setInterval(() => {
      currentProgress += (95 / (totalTime / 50));
      if (currentProgress > 95) currentProgress = 95;
      setProgress(currentProgress);
    }, 50);

    const stepInterval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= GENERATION_STEPS.length - 2) {
          return GENERATION_STEPS.length - 2; // hold on the second to last step
        }
        return prev + 1;
      });
    }, stepTime);

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
    };
  }, [isCompleted]);

  return (
    <div className="flex-1 w-full flex items-center justify-center p-8">
      <div className={`w-full max-w-2xl p-8 rounded-3xl bg-slate-900/80 border ${tokens.card.border} flex flex-col items-center text-center relative overflow-hidden shadow-2xl`}>
        
        {/* Animated Glow Background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="w-96 h-96 bg-pink-500 rounded-full blur-[100px]"
          />
          <motion.div 
            animate={{ 
              scale: [1.2, 1, 1.2],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="w-96 h-96 bg-purple-500 rounded-full blur-[100px] absolute mix-blend-screen"
          />
        </div>

        <div className="relative z-10 w-full flex flex-col items-center">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="relative w-24 h-24 mb-8"
          >
            <div className="absolute inset-0 border-4 border-slate-800 rounded-full" />
            <div 
              className="absolute inset-0 border-4 border-transparent border-t-pink-500 border-r-purple-500 rounded-full" 
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <Cpu className="w-8 h-8 text-white" />
            </div>
          </motion.div>

          <h2 className="text-2xl font-bold text-white mb-2">Neuro-Symbolic Synthesis</h2>
          <p className={`text-sm ${tokens.text.secondary} mb-12`}>Generating Executive Intelligence Report...</p>

          {/* Current Step Animation */}
          <div className="h-16 w-full flex justify-center items-center mb-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-3 text-pink-400"
              >
                {React.createElement(GENERATION_STEPS[currentStep].icon, { className: "w-5 h-5" })}
                <span className="text-base font-bold tracking-wide">{GENERATION_STEPS[currentStep].text}</span>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-pink-500 to-purple-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: "linear", duration: 0.1 }}
            />
          </div>
          
          <div className="w-full flex justify-between mt-3">
            <span className={`text-[10px] uppercase font-bold text-slate-500`}>GraphRAG Pipeline</span>
            <span className={`text-[10px] uppercase font-bold text-slate-500`}>{Math.round(progress)}%</span>
          </div>

        </div>
      </div>
    </div>
  );
}

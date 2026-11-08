"use client";

import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "@/hooks/useTheme";
import { DESIGN_TOKENS } from "@/constants/design";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, FileText, Loader2, UploadCloud, 
  ShieldCheck, FileSearch, Sparkles, Link as LinkIcon,
  AlertCircle, ArrowRight, ArrowLeft
} from "lucide-react";

interface DocumentUploadExperienceProps {
  initialFile?: File | null;
  onUploadFile?: (file: File) => Promise<void>;
  onComplete: () => void;
  onCancel: () => void;
}

const UPLOAD_STAGES = [
  { id: "upload", label: "Uploading document to industrial vault...", icon: UploadCloud, durationMs: 800 },
  { id: "extract", label: "Extracting text & PDF structure (PyPDF / OCR)...", icon: FileText, durationMs: 900 },
  { id: "entities", label: "Extracting equipment, procedures & risks...", icon: Sparkles, durationMs: 1000 },
  { id: "kg", label: "Linking entities into 2D Knowledge Graph...", icon: LinkIcon, durationMs: 900 },
  { id: "integrity", label: "Running neuro-symbolic contradiction scan...", icon: ShieldCheck, durationMs: 900 },
  { id: "summary", label: "Generating executive decision brief...", icon: Sparkles, durationMs: 700 }
];

export function DocumentUploadExperience({ initialFile, onUploadFile, onComplete, onCancel }: DocumentUploadExperienceProps) {
  const { theme } = useTheme();
  const tokens = DESIGN_TOKENS[theme];
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onUploadFileRef = useRef(onUploadFile);
  onUploadFileRef.current = onUploadFile;
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const [activeFile, setActiveFile] = useState<File | null>(initialFile || null);
  const [currentStageIndex, setCurrentStageIndex] = useState(-1);
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const activeFileRef = useRef<File | null>(null);

  const handleReset = () => {
    activeFileRef.current = null;
    setActiveFile(null);
    setIsProcessing(false);
    setIsFinished(false);
    setCurrentStageIndex(-1);
    setProgress(0);
    setErrorMessage(null);
  };

  // Helper to load sample PDF from /Sample_Compliance_Document.pdf
  const handleLoadSamplePdf = async () => {
    try {
      setErrorMessage(null);
      const res = await fetch("/Sample_Compliance_Document.pdf");
      if (!res.ok) throw new Error("Could not fetch sample document");
      const blob = await res.blob();
      const file = new File([blob], "Sample_Compliance_Document.pdf", { type: "application/pdf" });
      setActiveFile(file);
    } catch (e: any) {
      console.error("Failed to load sample PDF", e);
      setErrorMessage("Could not load sample PDF. Please select a file from your computer.");
    }
  };

  const handleFileChosen = (file: File) => {
    setErrorMessage(null);
    setActiveFile(file);
  };

  // Start processing when activeFile is set
  useEffect(() => {
    if (!activeFile) return;
    if (activeFileRef.current === activeFile && isProcessing) return;
    activeFileRef.current = activeFile;

    setIsProcessing(true);
    setErrorMessage(null);
    setCurrentStageIndex(0);
    setProgress(15);

    const executePipeline = async () => {
      try {
        const uploadPromise = onUploadFileRef.current 
          ? onUploadFileRef.current(activeFile) 
          : Promise.resolve();

        for (let i = 0; i < UPLOAD_STAGES.length; i++) {
          setCurrentStageIndex(i);
          const stage = UPLOAD_STAGES[i];
          const targetProgress = Math.min(95, Math.round(((i + 1) / UPLOAD_STAGES.length) * 100));
          setProgress(targetProgress);
          await new Promise((resolve) => setTimeout(resolve, stage.durationMs));
        }

        // Wait for backend upload to settle
        await uploadPromise;

        setIsFinished(true);
        setProgress(100);

        await new Promise((resolve) => setTimeout(resolve, 800));
        if (onCompleteRef.current) {
          onCompleteRef.current();
        }
      } catch (err: any) {
        console.error("Document pipeline failed:", err);
        setErrorMessage(err?.message || "Failed to process document on server.");
        setIsProcessing(false);
      }
    };

    executePipeline();
  }, [activeFile]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] w-full max-w-2xl mx-auto p-4 sm:p-8">
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`w-full bg-slate-900/90 backdrop-blur-xl border ${tokens.card.border} rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden`}
      >
        {/* Progress Background */}
        {isProcessing && (
          <div 
            className="absolute left-0 top-0 bottom-0 bg-emerald-500/10 transition-all duration-700 ease-out z-0 pointer-events-none" 
            style={{ width: `${progress}%` }}
          />
        )}
        
        <div className="relative z-10 flex flex-col items-center">
          {/* If no file chosen yet, show Dropzone and Sample document button */}
          {!activeFile && !isProcessing && (
            <div className="w-full flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
                <UploadCloud className="w-8 h-8" />
              </div>

              <h2 className={`text-xl font-bold ${tokens.text.primary} mb-1`}>
                Upload Industrial Document
              </h2>
              <p className="text-sm text-slate-400 max-w-md mb-6">
                Upload Standard Operating Procedures (SOPs), manuals, or regulations to run automated neuro-symbolic extraction and link to the Knowledge Graph.
              </p>

              {/* Drag and Drop Box */}
              <div 
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const file = e.dataTransfer.files?.[0];
                  if (file) handleFileChosen(file);
                }}
                className="w-full border-2 border-dashed border-slate-700 hover:border-emerald-500/50 hover:bg-slate-800/40 rounded-xl p-8 cursor-pointer transition-all flex flex-col items-center justify-center group mb-4"
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept=".pdf,.txt,.doc,.docx"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFileChosen(f);
                  }} 
                />
                <FileText className="w-10 h-10 text-slate-500 group-hover:text-emerald-400 transition-colors mb-2" />
                <p className="text-sm font-medium text-slate-300">
                  Click to select file or drag & drop here
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Supports PDF, DOCX, TXT up to 50MB
                </p>
              </div>

              {/* Quick Sample Button */}
              <div className="w-full flex flex-col items-center gap-2 pt-2 border-t border-slate-800">
                <span className="text-xs text-slate-500">Or test immediately with our pre-generated SOP:</span>
                <button
                  onClick={handleLoadSamplePdf}
                  type="button"
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                >
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  Load Sample Compliance Document (Pump P-204 SOP)
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {errorMessage && (
                <div className="w-full mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <button 
                onClick={onCancel}
                className="mt-6 text-xs text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
              </button>
            </div>
          )}

          {/* When file is active and processing */}
          {activeFile && (
            <div className="w-full flex flex-col items-center">
              <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center border border-slate-700 mb-4 relative">
                <AnimatePresence mode="wait">
                  {isFinished ? (
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
                      transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 rounded-2xl border-2 border-transparent border-t-emerald-500 opacity-70"
                    />
                  )}
                </AnimatePresence>
                {!isFinished && (
                  <FileText className="w-7 h-7 text-emerald-400" />
                )}
              </div>
              
              <h2 className={`text-lg font-bold ${tokens.text.primary} mb-1 text-center`}>
                {isFinished ? "Pipeline Processing Complete!" : "Processing Industrial Document"}
              </h2>
              <p className="text-xs text-emerald-400 font-mono mb-4 truncate max-w-sm">
                {activeFile.name}
              </p>
              
              <div className="w-full space-y-2.5">
                {UPLOAD_STAGES.map((stage, idx) => {
                  const status = idx < currentStageIndex || isFinished ? "completed" : idx === currentStageIndex ? "running" : "pending";
                  const Icon = stage.icon;
                  
                  return (
                    <motion.div 
                      key={stage.id}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`flex items-center gap-3 p-2.5 rounded-lg border transition-all ${
                        status === "running" ? "bg-slate-800/90 border-emerald-500/40 shadow-sm" :
                        status === "completed" ? "bg-emerald-500/5 border-emerald-500/15" :
                        "bg-transparent border-transparent opacity-40"
                      }`}
                    >
                      <div className="w-5 flex justify-center shrink-0">
                        {status === "completed" ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        ) : status === "running" ? (
                          <Loader2 className="w-4 h-4 text-emerald-500 animate-spin" />
                        ) : (
                          <Icon className="w-4 h-4 text-slate-500" />
                        )}
                      </div>
                      <span className={`text-xs font-medium ${
                        status === "completed" ? "text-slate-300" :
                        status === "running" ? "text-emerald-400 font-semibold" :
                        "text-slate-500"
                      }`}>
                        {stage.label}
                      </span>
                    </motion.div>
                  );
                })}
              </div>

              {errorMessage && (
                <div className="w-full mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="w-full mt-6 pt-4 border-t border-slate-800/50 flex justify-between items-center">
                <span className="text-xs text-slate-500 font-mono">{progress}% Complete</span>
                {!isFinished && !errorMessage && (
                  <button 
                    onClick={() => { handleReset(); onCancel(); }}
                    className="text-xs text-slate-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                )}
                {errorMessage && (
                  <button 
                    onClick={handleReset}
                    className="text-xs text-emerald-400 hover:underline font-semibold"
                  >
                    Try Again
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

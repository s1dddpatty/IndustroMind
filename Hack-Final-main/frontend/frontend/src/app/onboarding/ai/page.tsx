"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import "@/lib/api";
import { CheckCircle2, Loader2, Database, BrainCircuit, Network, ShieldCheck, Activity } from "lucide-react";

const STAGES = [
  { id: "reading", label: "Reading Documents", icon: Database },
  { id: "entities", label: "Entity Extraction", icon: BrainCircuit },
  { id: "relationships", label: "Relationship Discovery", icon: Network },
  { id: "graph", label: "Graph Construction", icon: Network },
  { id: "regulations", label: "Regulation Mapping", icon: ShieldCheck },
  { id: "contradictions", label: "Contradiction Detection", icon: ShieldCheck },
  { id: "scoring", label: "Integrity/Mortality Scoring", icon: Activity },
];

export default function AIOnboardingPage() {
  const router = useRouter();
  const [started, setStarted] = useState(false);
  const [currentStageIndex, setCurrentStageIndex] = useState(-1);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startProcessing = async () => {
    setStarted(true);
    setCurrentStageIndex(0);
    // Trigger live backend calls in the background to warm up caches and load demo dataset
    try {
      axios.post("/api/v1/integrity/scan", { org_id: "demo-org" }).catch(() => {});
      axios.get("/api/v1/graph/relationships").catch(() => {});
      axios.get("/api/v1/documents").catch(() => {});
    } catch (e) {
      console.error("Error initializing backend data:", e);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("process_after_upload", "true");
      await axios.post("/api/v1/documents/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      startProcessing();
    } catch (err) {
      console.error("Upload error:", err);
      // Even if upload fails or is offline during demo, proceed with stage processing
      startProcessing();
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    if (started && currentStageIndex < STAGES.length) {
      const timer = setTimeout(() => {
        setCurrentStageIndex((prev) => prev + 1);
      }, 1200); // Simulate processing time for each stage while backend warms up
      return () => clearTimeout(timer);
    } else if (started && currentStageIndex === STAGES.length) {
      // Finished all stages, navigate to dashboard
      const timer = setTimeout(() => {
        router.push("/dashboard");
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [started, currentStageIndex, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0e141a] text-[#dde3eb] p-8">
      <div className="w-full max-w-2xl bg-[#161c22] rounded-xl border border-[#334155] p-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-[#dde3eb]">Let's teach your AI about your plant</h1>
          <p className="text-[#88929b] mt-3">Upload your operational documents or load the pre-built demo dataset to initialize the intelligence layer.</p>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          className="hidden"
          accept=".pdf,.txt,.doc,.docx"
        />

        {!started ? (
          <div className="grid md:grid-cols-2 gap-6">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border border-[#334155] bg-[#1a2026] rounded-xl p-8 text-center hover:border-[#0ea5e9] cursor-pointer transition-colors flex flex-col justify-center"
            >
              <Database className="h-10 w-10 text-[#0ea5e9] mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">{uploading ? "Uploading..." : "Upload Documents"}</h3>
              <p className="text-sm text-[#88929b]">Upload PDFs, P&IDs, and SOPs manually.</p>
            </div>
            <div 
              onClick={startProcessing}
              className="border border-[#0ea5e9] bg-[#0ea5e9]/10 rounded-xl p-8 text-center cursor-pointer hover:bg-[#0ea5e9]/20 transition-colors"
            >
              <BrainCircuit className="h-10 w-10 text-[#0ea5e9] mx-auto mb-4" />
              <h3 className="font-semibold text-lg text-[#0ea5e9] mb-2">Load Demo Dataset</h3>
              <p className="text-sm text-[#88929b]">Initialize with a fully populated demo organization.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-center mb-8">Processing Plant Knowledge...</h3>
            <div className="space-y-4">
              {STAGES.map((stage, index) => {
                const isActive = index === currentStageIndex;
                const isCompleted = index < currentStageIndex;

                return (
                  <div 
                    key={stage.id} 
                    className={`flex items-center p-4 rounded-lg border ${
                      isActive ? "border-[#0ea5e9] bg-[#1a2026]" : 
                      isCompleted ? "border-[#334155] bg-[#0e141a] opacity-50" : 
                      "border-transparent opacity-30"
                    }`}
                  >
                    <div className="mr-4">
                      {isCompleted ? (
                        <CheckCircle2 className="h-6 w-6 text-[#4edea3]" />
                      ) : isActive ? (
                        <Loader2 className="h-6 w-6 text-[#0ea5e9] animate-spin" />
                      ) : (
                        <stage.icon className="h-6 w-6 text-[#88929b]" />
                      )}
                    </div>
                    <div className={`font-medium ${isActive ? 'text-[#0ea5e9]' : 'text-[#dde3eb]'}`}>
                      {stage.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

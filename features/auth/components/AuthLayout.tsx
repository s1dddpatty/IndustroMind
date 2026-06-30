"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Hexagon, BrainCircuit, Network, Server, ShieldCheck, BarChart3, Users } from "lucide-react";
import Link from "next/link";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const CAPABILITIES = [
  { id: 1, text: "AI Decision Assistant", icon: BrainCircuit },
  { id: 2, text: "Industrial Knowledge Graph", icon: Network },
  { id: 3, text: "Asset Intelligence", icon: Server },
  { id: 4, text: "Compliance Intelligence", icon: ShieldCheck },
  { id: 5, text: "Executive Reports", icon: BarChart3 },
  { id: 6, text: "Expert Knowledge Preservation", icon: Users }
];

export function AuthLayout({ children }: AuthLayoutProps) {
  const [activeCapability, setActiveCapability] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCapability((prev) => (prev + 1) % CAPABILITIES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex w-full min-h-screen bg-slate-950 overflow-hidden">
      
      {/* Left Branding Panel (Hidden on Mobile) */}
      <div className="hidden lg:flex w-[55%] relative flex-col justify-between p-12 overflow-hidden border-r border-slate-800">
        
        {/* Animated Background Graphics */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <motion.div 
            animate={{ 
              rotate: 360,
              scale: [1, 1.05, 1] 
            }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute -top-[20%] -left-[10%] w-[80%] h-[80%] border-[1px] border-slate-800/30 rounded-full opacity-50"
          />
          <motion.div 
            animate={{ 
              rotate: -360,
              scale: [1, 1.1, 1] 
            }}
            transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
            className="absolute top-[10%] -left-[20%] w-[100%] h-[100%] border-[1px] border-slate-800/20 rounded-full opacity-30"
          />
          
          {/* Subtle Glow */}
          <div className="absolute top-[20%] left-[20%] w-96 h-96 bg-brand/10 rounded-full blur-[120px]" />
        </div>

        {/* Header / Logo */}
        <div className="relative z-10 flex flex-col gap-2">
          <Link href="/" className="flex items-center gap-3">
            <Hexagon className="w-10 h-10 text-brand fill-current" />
            <span className="text-2xl font-extrabold text-white tracking-tight">IndustroMind</span>
          </Link>
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mt-2">
            AI Powered Industrial Intelligence
          </p>
        </div>

        {/* Central Value Proposition & Rotating Capabilities */}
        <div className="relative z-10 flex flex-col gap-8 max-w-lg">
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-[1.15] tracking-tight">
            Transform industrial knowledge into <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-cyan-400">operational intelligence.</span>
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed font-medium">
            Connect documents, assets, and compliance. Preserve expert knowledge. Deploy AI that reasons across your entire enterprise architecture.
          </p>
          
          {/* Rotating Capabilities */}
          <div className="h-12 flex items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCapability}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-900/50 border border-slate-800 backdrop-blur"
              >
                <CheckCircleIcon />
                <span className="text-[14px] font-bold text-slate-200">
                  {CAPABILITIES[activeCapability].text}
                </span>
                <div className="p-1.5 rounded-lg bg-brand/10 ml-2">
                  {React.createElement(CAPABILITIES[activeCapability].icon, { className: "w-4 h-4 text-brand" })}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10">
          <p className="text-[12px] font-medium text-slate-500">
            &copy; {new Date().getFullYear()} IndustroMind Inc. Enterprise Edition.
          </p>
        </div>

      </div>

      {/* Right Authentication Panel */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-6 sm:p-12 bg-slate-950 relative overflow-hidden">
        {/* Subtle right-side glow */}
        <div className="absolute top-[10%] right-[-10%] w-[500px] h-[500px] bg-cyan-900/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="w-full max-w-md relative z-10">
          <div className="lg:hidden flex items-center gap-2 mb-12 justify-center">
            <Hexagon className="w-8 h-8 text-brand fill-current" />
            <span className="text-xl font-extrabold text-white tracking-tight">IndustroMind</span>
          </div>
          
          {children}
        </div>
      </div>
    </div>
  );
}

function CheckCircleIcon() {
  return (
    <svg className="w-4 h-4 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6L9 17l-5-5"/>
    </svg>
  );
}

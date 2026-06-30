"use client";

import { motion } from "framer-motion";
import { ArrowRight, Terminal } from "lucide-react";

export default function FinalCtaSection() {
  return (
    <section 
      id="register" 
      className="relative flex flex-col items-center justify-center min-h-[85vh] bg-[#0A0A0B] py-24 px-6 overflow-hidden"
    >
      {/* 1. Subtle Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-light/10 rounded-full blur-[120px] pointer-events-none" />
      
      {/* 2. Low-opacity Network Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pattern-grid-lg pointer-events-none mix-blend-screen" />

      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center text-center">
        
        {/* Introductory Line */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8 flex items-center justify-center gap-3 text-[10px] md:text-[11px] font-bold tracking-[0.2em] text-gray-400 uppercase"
        >
          <span>Knowledge Connected</span>
          <span className="w-1 h-1 rounded-full bg-gray-700" />
          <span>Documents Understood</span>
          <span className="w-1 h-1 rounded-full bg-gray-700" />
          <span>Decisions Accelerated</span>
          <span className="w-1 h-1 rounded-full bg-gray-700" />
          <span>Operations Unified</span>
        </motion.div>

        {/* Main Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          className="text-[clamp(40px,5vw,64px)] font-extrabold tracking-tight text-white leading-[1.1] mb-6 max-w-3xl"
        >
          Bring every document, every expert and every operational decision into <span className="text-brand-light">one connected platform.</span>
        </motion.h2>

        {/* Supporting Paragraph */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-lg md:text-xl text-gray-400 leading-relaxed max-w-2xl mb-12"
        >
          IndustroMind unifies your enterprise knowledge into an AI-powered industrial intelligence platform designed to eliminate silos and empower safer, faster decisions.
        </motion.p>

        {/* Call to Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
        >
          <a
            href="/auth/register"
            className="group flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-brand-light px-8 py-4 text-sm font-bold text-brand-dark transition-all duration-300 hover:bg-white hover:scale-105 hover:shadow-[0_0_20px_rgba(82,183,136,0.3)]"
          >
            Start Building
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
          <a
            href="/demo"
            className="group flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-gray-700 bg-gray-900/50 px-8 py-4 text-sm font-bold text-white transition-all duration-300 hover:bg-gray-800 hover:border-gray-600"
          >
            <Terminal className="h-4 w-4 text-gray-400 group-hover:text-white transition-colors" />
            Request Enterprise Demo
          </a>
        </motion.div>

        {/* Subtle Divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="w-16 h-px bg-gray-800 my-10"
        />

        {/* Trust Statement */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
          className="flex flex-wrap items-center justify-center gap-3 text-xs font-semibold tracking-wide text-gray-500"
        >
          <span>Built for Industrial Operations</span>
          <span className="w-1 h-1 rounded-full bg-gray-800" />
          <span>Enterprise Ready</span>
          <span className="w-1 h-1 rounded-full bg-gray-800" />
          <span>AI You Can Trust</span>
        </motion.div>

      </div>
    </section>
  );
}

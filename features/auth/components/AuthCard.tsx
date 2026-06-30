"use client";

import React from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface AuthCardProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  submitLabel: string;
  isLoading?: boolean;
  footer?: React.ReactNode;
}

export function AuthCard({ title, subtitle, children, onSubmit, submitLabel, isLoading = false, footer }: AuthCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full flex flex-col"
    >
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white tracking-tight mb-2">{title}</h2>
        <p className="text-[14px] text-slate-400 font-medium">{subtitle}</p>
      </div>

      <div className="w-full p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl backdrop-blur-sm">
        <form onSubmit={onSubmit} className="flex flex-col gap-5 w-full">
          {children}
          
          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 w-full h-12 rounded-xl bg-brand hover:bg-brand-hover text-white text-[14px] font-bold shadow-[0_0_20px_rgba(14,165,233,0.3)] transition-all flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              submitLabel
            )}
          </button>
        </form>

        {footer && (
          <div className="mt-8">
            {footer}
          </div>
        )}
      </div>
    </motion.div>
  );
}

"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { DESIGN_TOKENS } from "@/constants/design";

type ToastType = "success" | "warning" | "error" | "info";

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastContextType {
  toast: (type: ToastType, title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const { theme } = useTheme();
  const tokens = DESIGN_TOKENS[theme];

  const addToast = useCallback((type: ToastType, title: string, message?: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, title, message }]);
    
    // Auto dismiss after 4 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
              className={`pointer-events-auto rounded-xl border ${tokens.card.border} shadow-2xl p-4 flex items-start gap-3 backdrop-blur-xl ${tokens.card.background}`}
            >
              <div className="shrink-0 mt-0.5">
                {toast.type === "success" && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                {toast.type === "warning" && <AlertTriangle className="w-5 h-5 text-amber-500" />}
                {toast.type === "error" && <XCircle className="w-5 h-5 text-red-500" />}
                {toast.type === "info" && <Info className="w-5 h-5 text-blue-500" />}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className={`text-sm font-bold ${tokens.text.primary}`}>{toast.title}</h4>
                {toast.message && <p className={`text-xs ${tokens.text.secondary} mt-0.5 line-clamp-2`}>{toast.message}</p>}
              </div>
              <button 
                onClick={() => removeToast(toast.id)}
                className="shrink-0 text-slate-500 hover:text-slate-300 transition-colors p-0.5 -mt-1 -mr-1"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

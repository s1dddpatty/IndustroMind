"use client";

import React, { memo, useState } from "react";
import { Bell, AlertTriangle, CheckCircle2, BrainCircuit } from "lucide-react";
import { DESIGN_TOKENS } from "@/constants/design";
import { useTheme } from "@/hooks/useTheme";
import { AnimatePresence, motion } from "framer-motion";
import { useSystemDocuments } from "@/features/shared/hooks/useSystemDocuments";

export const NotificationButton = memo(function NotificationButton() {
  const { theme } = useTheme();
  const navTokens = DESIGN_TOKENS[theme].navigation;
  const tokens = DESIGN_TOKENS[theme];
  
  const [isOpen, setIsOpen] = useState(false);
  const { hasDocuments } = useSystemDocuments();

  const notifications = hasDocuments ? [
    {
      id: "notif-1",
      type: "critical",
      title: "Contradiction Flagged",
      message: "SOP-MECH-042 LOTO clause conflicts with OEM Manual rev 3 on Valve V-101.",
      time: "Just now",
      icon: AlertTriangle,
      color: "text-red-500",
      bg: "bg-red-500/10"
    }
  ] : [];

  const unreadCount = notifications.length;

  return (
    <div className="relative">
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
      
      <button 
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`Notifications (${unreadCount} unread)`}
        className={`flex items-center justify-center relative h-10 w-10 rounded-full border ${navTokens.border} ${isOpen ? 'bg-slate-800' : ''} ${navTokens.muted} hover:bg-slate-800 shrink-0 transition-colors duration-200 z-50`}
      >
        <Bell className="h-4 w-4 text-slate-300" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-pink-500 text-[9px] font-bold text-white shadow-[0_0_0_2px] shadow-slate-950 transition-shadow">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
            className={`absolute top-full right-0 mt-3 w-80 rounded-2xl bg-slate-900 border ${tokens.card.border} shadow-2xl z-50 flex flex-col overflow-hidden origin-top-right`}
          >
            <div className="px-4 py-3 border-b border-slate-800/50 bg-slate-900/80 backdrop-blur flex items-center justify-between">
              <h3 className="text-[13px] font-bold text-white">Notifications</h3>
              <span className="text-[11px] text-slate-400">{unreadCount} active</span>
            </div>
            
            <div className="flex flex-col max-h-[400px] overflow-y-auto hide-scrollbar">
              {notifications.length > 0 ? (
                notifications.map((notif) => (
                  <div key={notif.id} className="flex gap-3 p-4 border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors cursor-pointer">
                    <div className={`p-2 rounded-xl h-8 w-8 shrink-0 flex items-center justify-center ${notif.bg} ${notif.color}`}>
                      <notif.icon className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[12px] font-bold text-slate-200">{notif.title}</span>
                      <span className={`text-[11px] ${tokens.text.secondary}`}>{notif.message}</span>
                      <span className={`text-[9px] font-medium text-slate-500 mt-1`}>{notif.time}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-slate-500">
                  <CheckCircle2 className="w-6 h-6 mx-auto mb-2 opacity-40 text-emerald-500" />
                  <p className="text-xs">No notifications.</p>
                  <p className="text-[10px] text-slate-600 mt-0.5">System alerts will appear here when documents are processed.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

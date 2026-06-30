"use client";

import React, { memo, useState } from "react";
import { Bell, AlertTriangle, CheckCircle2, BrainCircuit } from "lucide-react";
import { DESIGN_TOKENS } from "@/constants/design";
import { useTheme } from "@/hooks/useTheme";
import { AnimatePresence, motion } from "framer-motion";

const MOCK_NOTIFICATIONS = [
  {
    id: "notif-1",
    type: "critical",
    title: "Critical Alert",
    message: "Pump P-201 vibration exceeded threshold.",
    time: "2 min ago",
    icon: AlertTriangle,
    color: "text-red-500",
    bg: "bg-red-500/10"
  },
  {
    id: "notif-2",
    type: "compliance",
    title: "Compliance Reminder",
    message: "Inspection due tomorrow.",
    time: "15 min ago",
    icon: CheckCircle2,
    color: "text-orange-500",
    bg: "bg-orange-500/10"
  },
  {
    id: "notif-3",
    type: "ai",
    title: "AI Brief Generated",
    message: "Morning Executive Brief is ready.",
    time: "1 hour ago",
    icon: BrainCircuit,
    color: "text-pink-500",
    bg: "bg-pink-500/10"
  }
];

export const NotificationButton = memo(function NotificationButton() {
  const { theme } = useTheme();
  const navTokens = DESIGN_TOKENS[theme].navigation;
  const tokens = DESIGN_TOKENS[theme];
  
  const [isOpen, setIsOpen] = useState(false);

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
        aria-label="Notifications (3 unread)"
        className={`flex items-center justify-center relative h-10 w-10 rounded-full border ${navTokens.border} ${isOpen ? 'bg-slate-800' : ''} ${navTokens.muted} hover:bg-slate-800 shrink-0 transition-colors duration-200 z-50`}
      >
        <Bell className="h-4 w-4 text-slate-300" />
        <span className="absolute top-0 right-0 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-pink-500 text-[9px] font-bold text-white shadow-[0_0_0_2px] shadow-slate-950 transition-shadow">
          3
        </span>
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
            <div className="px-4 py-3 border-b border-slate-800/50 bg-slate-900/80 backdrop-blur">
              <h3 className="text-[13px] font-bold text-white">Notifications</h3>
            </div>
            
            <div className="flex flex-col max-h-[400px] overflow-y-auto hide-scrollbar">
              {MOCK_NOTIFICATIONS.map((notif) => (
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
              ))}
            </div>

            <button className="w-full py-3 text-[12px] font-bold text-pink-400 hover:text-pink-300 hover:bg-slate-800/50 transition-colors border-t border-slate-800/50">
              View All Notifications
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

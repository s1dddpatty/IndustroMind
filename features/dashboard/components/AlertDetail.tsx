"use client";

import React from "react";
import { useTheme } from "@/hooks/useTheme";
import { DESIGN_TOKENS } from "@/constants/design";
import { AlertData } from "../constants/alerts";
import { ArrowLeft, AlertTriangle, FileText, CheckCircle2, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { SeverityBadge, Severity } from "./SeverityBadge";

interface AlertDetailProps {
  alertId: number;
  alerts: AlertData[];
  onBack: () => void;
}

export function AlertDetail({ alertId, alerts, onBack }: AlertDetailProps) {
  const { theme } = useTheme();
  const tokens = DESIGN_TOKENS[theme];
  
  const alert = alerts.find(a => a.id === alertId) || alerts[0];

  let iconColor = "";
  let iconBg = "";

  switch (alert.severity) {
    case "Critical":
      iconColor = "text-red-600 dark:text-red-500";
      iconBg = "bg-red-100 dark:bg-red-500/10";
      break;
    case "High":
      iconColor = "text-orange-600 dark:text-orange-500";
      iconBg = "bg-orange-100 dark:bg-orange-500/10";
      break;
    case "Medium":
      iconColor = "text-amber-600 dark:text-amber-500";
      iconBg = "bg-amber-100 dark:bg-amber-500/10";
      break;
    default:
      iconColor = "text-slate-600 dark:text-slate-500";
      iconBg = "bg-slate-100 dark:bg-slate-500/10";
  }

  return (
    <div className="flex flex-col w-full pb-8">
      {/* Header Area */}
      <div className="flex items-center gap-4 mb-4">
        <button 
          onClick={onBack}
          className="p-2 -ml-2 rounded-lg hover:bg-slate-800/50 transition-colors text-slate-400 hover:text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className={`text-sm font-medium ${tokens.text.secondary}`}>Back to Alerts</span>
      </div>

      <div className="w-full pb-6">
        <div className={`p-6 rounded-2xl border ${tokens.card.border} ${tokens.card.background} shadow-sm`}>
          {/* Top Banner */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex gap-4">
              <div className={`flex items-center justify-center w-12 h-12 rounded-xl ${iconBg} flex-shrink-0 mt-1`}>
                <AlertTriangle className={`w-6 h-6 ${iconColor}`} />
              </div>
              <div>
                <h1 className={`text-2xl font-bold ${tokens.text.primary} mb-2`}>{alert.title}</h1>
                <div className="flex items-center gap-3">
                  <SeverityBadge severity={alert.severity as Severity} />
                  <span className={`text-sm text-slate-500 flex items-center gap-1.5`}>
                    <Clock className="w-4 h-4" /> {alert.timestamp} • {alert.asset}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <hr className={`border-t ${tokens.card.border} mb-6`} />

          {/* Details Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <section>
                <h3 className={`text-sm font-semibold ${tokens.text.secondary} uppercase tracking-wider mb-4`}>
                  Description
                </h3>
                <p className={`text-base ${tokens.text.primary} leading-relaxed whitespace-pre-line`}>
                  {alert.description}
                </p>
              </section>

              <section>
                <h3 className={`text-sm font-semibold ${tokens.text.secondary} uppercase tracking-wider mb-4`}>
                  Recommended Action
                </h3>
                <div className={`p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 flex items-start gap-3`}>
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <p className={`text-sm ${tokens.text.primary} leading-relaxed`}>
                    {alert.recommendedAction || "No specific action recommended at this time."}
                  </p>
                </div>
              </section>
            </div>

            <div className="space-y-6">
              <section>
                <h3 className={`text-sm font-semibold ${tokens.text.secondary} uppercase tracking-wider mb-4`}>
                  Related Documents
                </h3>
                <div className="space-y-3">
                  {alert.relatedDocuments && alert.relatedDocuments.length > 0 ? (
                    alert.relatedDocuments.map((doc) => (
                      <button key={doc.id} className={`w-full flex items-center gap-3 p-3 rounded-xl border ${tokens.card.border} hover:bg-slate-800/30 transition-colors text-left`}>
                        <FileText className="w-5 h-5 text-slate-400" />
                        <div>
                          <div className={`text-sm font-medium ${tokens.text.primary}`}>{doc.title}</div>
                          <div className={`text-xs ${tokens.text.secondary}`}>{doc.type}</div>
                        </div>
                      </button>
                    ))
                  ) : (
                    <p className={`text-sm ${tokens.text.secondary}`}>No related documents available.</p>
                  )}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { 
  FileText, 
  Eye, 
  Target, 
  ShieldCheck, 
  Lightbulb, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  CheckSquare,
  Wrench,
  Activity,
  CalendarDays,
  Check,
  Zap,
  Network
} from "lucide-react";

export default function DecisionBriefsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (isInView && phase === 0) {
      const runSequence = async () => {
        setPhase(1); // Document + Collecting updates
        await new Promise(r => setTimeout(r, 1800));
        
        setPhase(2); // Executive Summary
        await new Promise(r => setTimeout(r, 1200));
        
        setPhase(3); // Maintenance & Compliance
        await new Promise(r => setTimeout(r, 1000));
        
        setPhase(4); // Ops & Risks
        await new Promise(r => setTimeout(r, 1200));
        
        setPhase(5); // Recommendations
        await new Promise(r => setTimeout(r, 1500));
        
        setPhase(6); // Decision Readiness
      };
      runSequence();
    }
  }, [isInView, phase]);

  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <section id="decision-briefs" className="relative flex flex-col justify-center min-h-screen bg-[#FDFDFD] py-16 lg:py-24 overflow-hidden" ref={containerRef}>
      
      {/* Ambient background */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gray-100/60 rounded-full blur-[120px] pointer-events-none mix-blend-multiply" />

      <div className="relative mx-auto w-full max-w-[1400px] px-6 lg:px-8 flex flex-col items-center">
        
        {/* Header */}
        <div className="text-center max-w-3xl mb-12 lg:mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-sm font-semibold text-gray-700 shadow-sm mb-6"
          >
            <FileText className="h-4 w-4 text-brand-dark" />
            AI Decision Briefs
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-[clamp(32px,4vw,48px)] font-extrabold tracking-tight text-gray-900 leading-[1.1] mb-5"
          >
            Every operational decision begins with the <span className="text-brand-light">right information</span>.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-600 leading-relaxed"
          >
            Don&apos;t just monitor operations — optimize them. Decision Briefs synthesize complex industrial telemetry, knowledge graphs, and current conditions into actionable recommendations so you always know what to do next.
          </motion.p>
        </div>

        {/* Main Experience: Executive Document */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-4xl bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-200/60 p-6 sm:p-10 lg:p-12 mx-auto relative overflow-hidden ring-1 ring-black/5"
        >
          {/* Subtle Top Accent */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-dark via-brand-light to-gray-200" />
          
          {/* Document Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-gray-100 pb-8 mb-8">
            <div>
              <h3 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">Good Morning,</h3>
              <p className="text-xl font-medium text-gray-600">Operations Brief</p>
            </div>
            <div className="mt-4 md:mt-0 text-left md:text-right">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Generated</p>
              <div className="flex items-center gap-2 md:justify-end text-sm font-semibold text-gray-800">
                <Clock className="h-4 w-4 text-brand-light" />
                7:58 AM
              </div>
              <div className="flex items-center gap-2 md:justify-end text-xs text-gray-500 mt-1">
                <CalendarDays className="h-3.5 w-3.5" />
                {currentDate}
              </div>
            </div>
          </div>

          {/* Real-time generation indicator */}
          <AnimatePresence mode="wait">
            {phase === 1 && (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className="flex items-center gap-3 py-12 justify-center"
              >
                <div className="h-4 w-4 rounded-full border-2 border-gray-200 border-t-brand-light animate-spin" />
                <span className="text-sm font-medium text-gray-500">Collecting overnight operational updates...</span>
              </motion.div>
            )}
            
            {phase >= 2 && (
              <motion.div 
                key="content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="space-y-10"
              >
                {/* 1. Executive Summary */}
                <div>
                  <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">Today&apos;s Summary</h4>
                  <div className="bg-gray-50/50 rounded-2xl p-5 border border-gray-100">
                    <ul className="space-y-3">
                      <motion.li initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="flex items-start gap-3">
                        <div className="mt-1 flex-shrink-0 h-1.5 w-1.5 rounded-full bg-orange-400" />
                        <span className="text-sm text-gray-700 font-medium">2 items require attention</span>
                      </motion.li>
                      <motion.li initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="flex items-start gap-3">
                        <div className="mt-1 flex-shrink-0 h-1.5 w-1.5 rounded-full bg-green-500" />
                        <span className="text-sm text-gray-700 font-medium">No critical compliance violations</span>
                      </motion.li>
                      <motion.li initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="flex items-start gap-3">
                        <div className="mt-1 flex-shrink-0 h-1.5 w-1.5 rounded-full bg-brand-light" />
                        <span className="text-sm text-gray-700 font-medium">7 maintenance tasks completed</span>
                      </motion.li>
                      <motion.li initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="flex items-start gap-3">
                        <div className="mt-1 flex-shrink-0 h-1.5 w-1.5 rounded-full bg-brand-dark" />
                        <span className="text-sm text-gray-700 font-medium">Plant readiness: High</span>
                      </motion.li>
                      <motion.li initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="flex items-start gap-3">
                        <div className="mt-1 flex-shrink-0 h-1.5 w-1.5 rounded-full bg-blue-500" />
                        <span className="text-sm text-gray-700 font-medium">Primary recommendation: Review Pump P-2031 inspection</span>
                      </motion.li>
                    </ul>
                  </div>
                </div>

                {/* 2. Detailed Blocks (Grid) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                  {/* Maintenance */}
                  <AnimatePresence>
                    {phase >= 3 && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="flex items-center gap-2 mb-3">
                          <Wrench className="h-4 w-4 text-gray-400" />
                          <h4 className="text-[13px] font-bold text-gray-900">Maintenance</h4>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed pl-6 border-l-2 border-gray-100">
                          Overnight crew resolved issues on Compressor C-102. 3 low-priority work orders remain pending.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Compliance */}
                  <AnimatePresence>
                    {phase >= 3 && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                        <div className="flex items-center gap-2 mb-3">
                          <ShieldCheck className="h-4 w-4 text-gray-400" />
                          <h4 className="text-[13px] font-bold text-gray-900">Compliance</h4>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed pl-6 border-l-2 border-gray-100">
                          Prioritized by AI based on safety impact, production delays, and resource availability, so you&apos;re never guessing what to fix first.allowable thresholds.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Ops Status */}
                  <AnimatePresence>
                    {phase >= 4 && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="flex items-center gap-2 mb-3">
                          <Activity className="h-4 w-4 text-gray-400" />
                          <h4 className="text-[13px] font-bold text-gray-900">Operational Status</h4>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed pl-6 border-l-2 border-gray-100">
                          Line 1 running at 98% capacity. Scheduled shift change at 08:00 AM requires standard handover review.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Upcoming Risks */}
                  <AnimatePresence>
                    {phase >= 4 && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                        <div className="flex items-center gap-2 mb-3">
                          <AlertTriangle className="h-4 w-4 text-orange-500" />
                          <h4 className="text-[13px] font-bold text-gray-900">Upcoming Risks</h4>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed pl-6 border-l-2 border-orange-100">
                          Supply chain reports a 2-day delay on requested valve seals. Minor impact expected on next week&apos;s PM schedule.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* 3. Recommended Actions */}
                <AnimatePresence>
                  {phase >= 5 && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                      <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">Recommended Actions</h4>
                      <div className="space-y-2">
                        {[
                          "Review overdue inspection for Pump P-2031",
                          "Approve pending maintenance on C-102",
                          "Update SOP Revision 5 distribution list",
                          "Verify startup readiness for Line 2",
                          "Schedule valve inspection per API guidelines"
                        ].map((action, idx) => (
                          <motion.div 
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.15 }}
                            className="flex items-center gap-3 group cursor-pointer"
                          >
                            <div className="h-5 w-5 rounded border border-gray-300 bg-white flex items-center justify-center group-hover:border-brand-light transition-colors">
                              <Check className="h-3 w-3 text-transparent group-hover:text-brand-light/50 transition-colors" />
                            </div>
                            <span className="text-sm text-gray-700 font-medium group-hover:text-gray-900">{action}</span>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* 4. Decision Readiness */}
                <AnimatePresence>
                  {phase >= 6 && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-12 pt-6 border-t border-gray-100"
                    >
                      <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">Decision Readiness</h4>
                      <div className="bg-brand-dark rounded-2xl p-6 text-white grid grid-cols-1 md:grid-cols-3 gap-6 items-center shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-light/10 rounded-full blur-[30px]" />
                        
                        <div className="flex items-center gap-4 border-b md:border-b-0 md:border-r border-white/10 pb-4 md:pb-0 md:pr-4">
                          <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                            <CheckCircle2 className="h-5 w-5 text-green-400" />
                          </div>
                          <div>
                            <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">Status</p>
                            <p className="text-sm font-bold text-white">Plant Ready</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 border-b md:border-b-0 md:border-r border-white/10 pb-4 md:pb-0 md:pr-4">
                          <div className="h-10 w-10 rounded-full bg-brand-light/20 flex items-center justify-center shrink-0">
                            <Target className="h-5 w-5 text-brand-light" />
                          </div>
                          <div>
                            <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">Confidence</p>
                            <p className="text-sm font-bold text-white">96%</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                            <Network className="h-5 w-5 text-blue-400" />
                          </div>
                          <div>
                            <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">Generated From</p>
                            <p className="text-sm font-bold text-white">26 knowledge sources</p>
                          </div>
                        </div>

                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Bottom Strip: Value Props */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="w-full mt-12 lg:mt-16 bg-gray-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[1px] rounded-[2rem] overflow-hidden shadow-xl ring-1 ring-black/5 max-w-[1200px]"
        >
          {[
            { title: "Executive Visibility", desc: "Gain immediate situational awareness every morning.", icon: Eye },
            { title: "Actionable Intelligence", desc: "Transform raw data into concise, structured summaries.", icon: Zap },
            { title: "Prioritized Decisions", desc: "Focus strictly on items requiring human approval.", icon: CheckSquare },
            { title: "Grounded Recommendations", desc: "Every brief traces directly back to connected enterprise sources.", icon: Network }
          ].map((prop, i) => (
            <div key={i} className="bg-white p-6 xl:p-8 flex flex-col items-center justify-center text-center group transition-colors hover:bg-brand-light/[0.02]">
              <div className="flex h-10 w-10 mb-3 shrink-0 items-center justify-center rounded-full bg-brand-light/10 text-brand-dark ring-4 ring-white shadow-sm transition-transform duration-300 group-hover:scale-110">
                <prop.icon className="h-5 w-5" />
              </div>
              <h4 className="text-[13px] xl:text-sm font-bold text-gray-900 mb-1.5">{prop.title}</h4>
              <p className="text-[11px] xl:text-xs text-gray-500 leading-snug max-w-[200px]">{prop.desc}</p>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}

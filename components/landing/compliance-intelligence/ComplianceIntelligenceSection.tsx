"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Settings, 
  AlertTriangle,
  ArrowRight,
  Activity,
  FileCheck,
  Zap,
  Network,
  Search
} from "lucide-react";

export default function ComplianceIntelligenceSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (isInView && phase === 0) {
      const runSequence = async () => {
        setPhase(1); // Timeline appears
        await new Promise(r => setTimeout(r, 1000));
        
        setPhase(2); // Analysis started
        await new Promise(r => setTimeout(r, 800));
        
        // Scanning SOP
        setPhase(3); 
        await new Promise(r => setTimeout(r, 600));
        setPhase(4); // Passed
        await new Promise(r => setTimeout(r, 400));
        
        // Scanning Maintenance
        setPhase(5);
        await new Promise(r => setTimeout(r, 600));
        setPhase(6); // Passed
        await new Promise(r => setTimeout(r, 400));
        
        // Scanning API
        setPhase(7);
        await new Promise(r => setTimeout(r, 600));
        setPhase(8); // Passed
        await new Promise(r => setTimeout(r, 400));
        
        // Inspection Mismatch
        setPhase(9);
        await new Promise(r => setTimeout(r, 800));
        setPhase(10); // Mismatch Found
        await new Promise(r => setTimeout(r, 800));
        
        // Cross-referencing
        setPhase(11);
        await new Promise(r => setTimeout(r, 1000));
        setPhase(12); // Conflict Confirmed
        await new Promise(r => setTimeout(r, 1200));
        
        // Transition to full workspace & recommendations
        setPhase(13);
      };
      runSequence();
    }
  }, [isInView, phase]);

  return (
    <section id="compliance-intelligence" className="relative flex flex-col justify-center min-h-screen bg-white py-16 lg:py-24 overflow-hidden" ref={containerRef}>
      
      {/* Background Gradients */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-light/5 rounded-full blur-[100px] pointer-events-none mix-blend-multiply" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gray-100/80 rounded-full blur-[100px] pointer-events-none mix-blend-multiply" />

      <div className="relative mx-auto w-full max-w-[1400px] px-6 lg:px-8 flex flex-col items-center">
        
        {/* Header */}
        <div className="text-center max-w-3xl mb-12 lg:mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-sm font-semibold text-gray-700 shadow-sm mb-6"
          >
            <ShieldAlert className="h-4 w-4 text-orange-500" />
            Compliance Intelligence
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-[clamp(32px,4vw,48px)] font-extrabold tracking-tight text-gray-900 leading-[1.1] mb-5"
          >
            Stay ahead of <span className="text-brand-light">compliance risks</span> before they impact operations.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-600 leading-relaxed"
          >
            IndustroMind continuously monitors industrial documentation, maintenance history, procedures, standards and operational knowledge to detect conflicts, outdated information and compliance gaps before they become operational issues.
          </motion.p>
        </div>

        {/* Industrial Control Centre Workspace */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-[1fr_2.5fr_1.2fr] xl:grid-cols-[1fr_2.8fr_1.2fr] gap-6 lg:gap-8 items-stretch">
          
          {/* Left Panel: Timeline */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={phase >= 1 ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.6 }}
            className="bg-[#FAFAFA] rounded-[2rem] border border-gray-200/60 shadow-lg p-6 lg:p-8 flex flex-col h-full"
          >
            <div className="flex items-center gap-2.5 mb-8">
              <Activity className="h-5 w-5 text-gray-400" />
              <h3 className="text-sm font-bold text-gray-900">Activity Timeline</h3>
            </div>
            
            <div className="relative border-l-2 border-gray-200 ml-3 space-y-6 flex-1 pb-4">
              {/* Event 1 */}
              <div className="relative pl-6">
                <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-gray-300 ring-4 ring-[#FAFAFA]"></div>
                <p className="text-[10px] font-bold text-gray-400 mb-0.5">08:15</p>
                <p className="text-xs font-semibold text-gray-700">Maintenance completed</p>
              </div>
              
              {/* Event 2 */}
              <div className="relative pl-6">
                <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-gray-300 ring-4 ring-[#FAFAFA]"></div>
                <p className="text-[10px] font-bold text-gray-400 mb-0.5">09:40</p>
                <p className="text-xs font-semibold text-gray-700">SOP-204 updated</p>
              </div>

              {/* Event 3 */}
              <div className="relative pl-6">
                <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-gray-300 ring-4 ring-[#FAFAFA]"></div>
                <p className="text-[10px] font-bold text-gray-400 mb-0.5">10:20</p>
                <p className="text-xs font-semibold text-gray-700">API 610 revision published</p>
              </div>

              {/* Event 4 */}
              <div className="relative pl-6">
                <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-orange-400 ring-4 ring-[#FAFAFA]"></div>
                <p className="text-[10px] font-bold text-orange-500 mb-0.5">11:10</p>
                <p className="text-xs font-semibold text-gray-900">Inspection overdue</p>
              </div>

              {/* Event 5 (Animated) */}
              <AnimatePresence>
                {phase >= 2 && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative pl-6 pt-4"
                  >
                    <div className="absolute -left-[9px] top-5 h-4 w-4 rounded-full bg-brand-light ring-4 ring-[#FAFAFA]"></div>
                    <p className="text-[10px] font-bold text-brand-light mb-0.5">11:12</p>
                    <p className="text-xs font-semibold text-gray-900">Compliance analysis started</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Event 6 (Conflict) */}
              <AnimatePresence>
                {phase >= 12 && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative pl-6 pt-4"
                  >
                    <div className="absolute -left-[9px] top-5 h-4 w-4 rounded-full bg-red-500 ring-4 ring-[#FAFAFA] shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
                    <p className="text-[10px] font-bold text-red-500 mb-0.5">11:13</p>
                    <p className="text-xs font-semibold text-red-600">Conflict detected</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Centre Panel: Conflict Workspace */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={phase >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-[2rem] border border-gray-200 shadow-xl p-6 lg:p-8 flex flex-col h-[500px] lg:h-auto relative overflow-hidden ring-1 ring-black/5"
          >
            {/* Ambient Background */}
            <div className={`absolute inset-0 bg-gradient-to-b from-transparent to-gray-50/50 pointer-events-none transition-opacity duration-1000 ${phase >= 13 ? 'opacity-100' : 'opacity-0'}`} />

            <div className="flex justify-between items-center mb-6 relative z-10">
              <div className="flex items-center gap-3">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-500 ${phase >= 12 ? 'bg-red-100 text-red-600' : 'bg-brand-light/10 text-brand-dark'}`}>
                  {phase >= 12 ? <AlertTriangle className="h-4 w-4" /> : <Search className="h-4 w-4" />}
                </div>
                <h3 className="text-base font-bold text-gray-900">
                  {phase < 13 ? "Continuous Compliance Engine" : "Conflict Detection Workspace"}
                </h3>
              </div>
              {phase >= 13 && (
                <span className="inline-flex items-center rounded-full bg-red-50 px-2.5 py-1 text-[10px] font-bold text-red-700 ring-1 ring-inset ring-red-600/20">
                  Critical Risk
                </span>
              )}
            </div>

            {/* Live Scanning UI */}
            <AnimatePresence>
              {phase < 13 && (
                <motion.div 
                  exit={{ opacity: 0, filter: "blur(10px)" }}
                  className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full gap-4 relative z-10"
                >
                  {/* Step 1 */}
                  {phase >= 3 && (
                    <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100">
                      <div className="flex items-center gap-3">
                        <FileText className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-700">Checking SOP Revision</span>
                      </div>
                      {phase >= 4 ? (
                        <span className="text-xs font-bold text-brand-light flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5" /> Passed</span>
                      ) : (
                        <div className="h-4 w-4 rounded-full border-2 border-gray-200 border-t-brand-light animate-spin" />
                      )}
                    </div>
                  )}

                  {/* Step 2 */}
                  {phase >= 5 && (
                    <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100">
                      <div className="flex items-center gap-3">
                        <Settings className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-700">Checking Maintenance History</span>
                      </div>
                      {phase >= 6 ? (
                        <span className="text-xs font-bold text-brand-light flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5" /> Passed</span>
                      ) : (
                        <div className="h-4 w-4 rounded-full border-2 border-gray-200 border-t-brand-light animate-spin" />
                      )}
                    </div>
                  )}

                  {/* Step 3 */}
                  {phase >= 7 && (
                    <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100">
                      <div className="flex items-center gap-3">
                        <FileCheck className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-700">Checking API Standard</span>
                      </div>
                      {phase >= 8 ? (
                        <span className="text-xs font-bold text-brand-light flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5" /> Passed</span>
                      ) : (
                        <div className="h-4 w-4 rounded-full border-2 border-gray-200 border-t-brand-light animate-spin" />
                      )}
                    </div>
                  )}

                  {/* Step 4 */}
                  {phase >= 9 && (
                    <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100">
                      <div className="flex items-center gap-3">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-700">Checking Inspection Interval</span>
                      </div>
                      {phase >= 10 ? (
                        <span className="text-xs font-bold text-orange-500 flex items-center gap-1"><AlertTriangle className="h-3.5 w-3.5" /> Mismatch</span>
                      ) : (
                        <div className="h-4 w-4 rounded-full border-2 border-gray-200 border-t-brand-light animate-spin" />
                      )}
                    </div>
                  )}

                  {/* Step 5 */}
                  {phase >= 11 && (
                    <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100">
                      <div className="flex items-center gap-3">
                        <Network className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-700">Cross-referencing knowledge</span>
                      </div>
                      {phase >= 12 ? (
                        <span className="text-xs font-bold text-red-600 flex items-center gap-1"><ShieldAlert className="h-3.5 w-3.5" /> Conflict</span>
                      ) : (
                        <div className="h-4 w-4 rounded-full border-2 border-gray-200 border-t-brand-light animate-spin" />
                      )}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Final Conflict Workspace */}
            <AnimatePresence>
              {phase >= 13 && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="flex-1 w-full flex flex-col relative z-10"
                >
                  {/* SVG Connecting Lines between cards */}
                  <div className="absolute inset-0 pointer-events-none z-0 hidden lg:block">
                     <svg className="w-full h-full">
                       <motion.path 
                         d="M 120 70 C 120 150, 200 150, 300 220" 
                         fill="transparent" 
                         stroke="#E5E7EB" 
                         strokeWidth="2" 
                         strokeDasharray="4 4"
                         initial={{ pathLength: 0 }}
                         animate={{ pathLength: 1 }}
                         transition={{ duration: 1 }}
                       />
                       <motion.path 
                         d="M 400 70 C 400 150, 300 150, 300 220" 
                         fill="transparent" 
                         stroke="#E5E7EB" 
                         strokeWidth="2" 
                         strokeDasharray="4 4"
                         initial={{ pathLength: 0 }}
                         animate={{ pathLength: 1 }}
                         transition={{ duration: 1, delay: 0.2 }}
                       />
                     </svg>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 mb-6 relative z-10">
                    {/* Doc 1 */}
                    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Document</span>
                        <span className="text-[10px] font-bold text-brand-dark bg-brand-light/10 px-2 py-0.5 rounded-full">Rev 5</span>
                      </div>
                      <h4 className="text-sm font-bold text-gray-900 mb-1">SOP-204</h4>
                      <p className="text-xs text-gray-600">Requires: Valve inspection before startup.</p>
                    </div>

                    {/* Doc 2 */}
                    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">API Standard</span>
                        <span className="text-[10px] font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded-full">API 610</span>
                      </div>
                      <h4 className="text-sm font-bold text-gray-900 mb-1">Inspection Interval</h4>
                      <p className="text-xs text-gray-600">Mandatory interval: <span className="font-semibold text-gray-900">12 months</span>.</p>
                    </div>
                    
                    {/* Doc 3 */}
                    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm md:col-span-2 lg:w-1/2 lg:mx-auto">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Maintenance History</span>
                        <span className="text-[10px] font-bold text-orange-800 bg-orange-100 px-2 py-0.5 rounded-full">Outdated</span>
                      </div>
                      <h4 className="text-sm font-bold text-gray-900 mb-1">Last Inspected</h4>
                      <p className="text-xs text-orange-600 font-semibold">14 months ago</p>
                    </div>
                  </div>

                  {/* AI Analysis Result */}
                  <div className="mt-auto bg-red-50 border border-red-100 rounded-xl p-5 relative z-10 flex items-start gap-4">
                    <ShieldAlert className="h-6 w-6 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-red-900 mb-1">Conflict Detected</h4>
                      <p className="text-xs text-red-700 leading-relaxed">
                        Required inspection has exceeded the permitted interval by 2 months. Commencing startup procedure SOP-204 violates API 610 compliance.
                      </p>
                    </div>
                  </div>

                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Right Panel: Recommendations */}
          <AnimatePresence>
            {phase >= 13 && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1 }}
                className="bg-brand-dark rounded-[2rem] shadow-xl p-6 lg:p-8 flex flex-col h-full text-white"
              >
                <div className="flex items-center gap-2.5 mb-8">
                  <Zap className="h-5 w-5 text-brand-light" />
                  <h3 className="text-sm font-bold text-white">Recommended Action</h3>
                </div>

                <div className="flex-1 space-y-6">
                  {/* Resolution Steps */}
                  <div className="space-y-4">
                    <motion.div 
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.5 }}
                      className="flex gap-3 items-start"
                    >
                      <div className="h-5 w-5 rounded-full bg-brand-light/20 flex items-center justify-center shrink-0 mt-0.5">
                        <div className="h-2 w-2 rounded-full bg-brand-light" />
                      </div>
                      <p className="text-sm font-medium text-gray-200">Schedule immediate valve inspection</p>
                    </motion.div>
                    
                    <motion.div 
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.8 }}
                      className="flex gap-3 items-start"
                    >
                      <div className="h-5 w-5 rounded-full bg-brand-light/20 flex items-center justify-center shrink-0 mt-0.5">
                        <div className="h-2 w-2 rounded-full bg-brand-light" />
                      </div>
                      <p className="text-sm font-medium text-gray-200">Halt startup approval workflow</p>
                    </motion.div>
                    
                    <motion.div 
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 2.1 }}
                      className="flex gap-3 items-start"
                    >
                      <div className="h-5 w-5 rounded-full bg-brand-light/20 flex items-center justify-center shrink-0 mt-0.5">
                        <div className="h-2 w-2 rounded-full bg-brand-light" />
                      </div>
                      <p className="text-sm font-medium text-gray-200">Create corrective work order in EAM</p>
                    </motion.div>
                  </div>
                </div>

                {/* Footer Metrics */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2.5 }}
                  className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 gap-4"
                >
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Op. Impact</p>
                    <p className="text-xs font-bold text-white">Prevented Shutdown</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Confidence</p>
                    <p className="text-xs font-bold text-brand-light">98% (6 sources)</p>
                  </div>
                </motion.div>

                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 3 }}
                  className="mt-6 w-full py-3 px-4 bg-brand-light text-brand-dark font-bold text-xs rounded-xl hover:bg-white transition-colors"
                >
                  Execute Resolution
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* Bottom Strip: Value Props */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="w-full mt-12 lg:mt-16 bg-gray-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[1px] rounded-[2rem] overflow-hidden shadow-xl ring-1 ring-black/5"
        >
          {[
            { title: "Continuous Monitoring", desc: "Compliance is continuously evaluated in the background.", icon: Activity },
            { title: "Regulatory Alignment", desc: "Compare operations with applicable standards automatically.", icon: FileCheck },
            { title: "Conflict Detection", desc: "Identify inconsistencies before operational failures occur.", icon: AlertTriangle },
            { title: "Audit Readiness", desc: "Keep evidence organised for internal and regulatory audits.", icon: ShieldAlert }
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

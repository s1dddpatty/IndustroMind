"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { 
  BrainCircuit, 
  MessageSquareText, 
  Bot, 
  User, 
  Settings2, 
  AlertTriangle,
  Wrench,
  Workflow,
  CheckCircle2,
  BookOpen,
  Users,
  Lightbulb,
  Network,
  Activity
} from "lucide-react";

export default function ExpertKnowledgeSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (isInView && phase === 0) {
      const runSequence = async () => {
        setPhase(1); // AI asks question
        await new Promise(r => setTimeout(r, 1200));
        
        setPhase(2); // Equipment & Procedure cards appear (context from question)
        await new Promise(r => setTimeout(r, 1500));
        
        setPhase(3); // Operator Chunk 1
        await new Promise(r => setTimeout(r, 1200));
        
        setPhase(4); // Operator Chunk 2 + Op Parameter Card
        await new Promise(r => setTimeout(r, 1500));
        
        setPhase(5); // Operator Chunk 3 + Related Asset Card
        await new Promise(r => setTimeout(r, 1500));
        
        setPhase(6); // Operator Chunk 4 + Best Practice/Safety Card
        await new Promise(r => setTimeout(r, 1800));
        
        setPhase(7); // Graph Update Summary
      };
      runSequence();
    }
  }, [isInView, phase]);

  return (
    <section id="expert-knowledge" className="relative flex flex-col justify-center min-h-screen bg-white py-16 lg:py-24 overflow-hidden" ref={containerRef}>
      
      {/* Background Gradients */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-light/5 rounded-full blur-[100px] pointer-events-none mix-blend-multiply" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gray-50 rounded-full blur-[100px] pointer-events-none mix-blend-multiply" />

      <div className="relative mx-auto w-full max-w-[1400px] px-6 lg:px-8 flex flex-col items-center">
        
        {/* Header */}
        <div className="text-center max-w-3xl mb-12 lg:mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-sm font-semibold text-gray-700 shadow-sm mb-6"
          >
            <BrainCircuit className="h-4 w-4 text-brand-dark" />
            Expert Knowledge Capture
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-[clamp(32px,4vw,48px)] font-extrabold tracking-tight text-gray-900 leading-[1.1] mb-5"
          >
            Capture decades of <span className="text-brand-light">operational expertise</span> before it walks out the door.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-600 leading-relaxed"
          >
            IndustroMind interviews experienced personnel, extracts procedures, safety knowledge, operational best practices and engineering expertise, then converts that information into structured organizational knowledge connected to the Knowledge Graph.
          </motion.p>
        </div>

        {/* 2-Column Experience */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-6 lg:gap-12 items-stretch max-w-[1200px]">
          
          {/* Left Panel: AI Conversation */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={phase >= 1 ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.6 }}
            className="bg-[#FAFAFA] rounded-[2rem] border border-gray-200/60 shadow-lg p-6 lg:p-8 flex flex-col h-[500px] lg:h-[600px] relative overflow-hidden"
          >
            <div className="flex items-center gap-2.5 mb-8 pb-4 border-b border-gray-200/60">
              <MessageSquareText className="h-5 w-5 text-gray-400" />
              <h3 className="text-sm font-bold text-gray-900">Live AI Knowledge Extraction</h3>
            </div>
            
            <div className="flex-1 flex flex-col gap-6 overflow-y-auto pr-2 scrollbar-hide">
              {/* AI Message */}
              <AnimatePresence>
                {phase >= 1 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="flex gap-4 max-w-[90%]"
                  >
                    <div className="h-8 w-8 rounded-full bg-brand-light flex items-center justify-center shrink-0 shadow-sm mt-1">
                      <Bot className="h-4 w-4 text-brand-dark" />
                    </div>
                    <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm p-4 shadow-sm">
                      <p className="text-sm text-gray-800 leading-relaxed">
                        Can you explain the restart procedure for <span className="font-semibold text-gray-900 bg-gray-100 px-1 rounded">Pump P-2031</span> after scheduled maintenance?
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Operator Message */}
              <AnimatePresence>
                {phase >= 3 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="flex gap-4 max-w-[90%] self-end flex-row-reverse"
                  >
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center shrink-0 shadow-sm mt-1">
                      <User className="h-4 w-4 text-gray-600" />
                    </div>
                    <div className="bg-gray-800 rounded-2xl rounded-tr-sm p-4 shadow-md text-white">
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {/* Progressive chunks */}
                        {phase >= 3 && <span>Before restarting, we always verify </span>}
                        {phase >= 4 && <span className="text-brand-light font-semibold">suction pressure</span>}
                        {phase >= 4 && <span>, </span>}
                        {phase >= 5 && <span>inspect the <span className="font-semibold border-b border-white/30">discharge valve</span>, </span>}
                        {phase >= 6 && <span>and wait until <span className="text-orange-300 font-semibold">lubrication pressure</span> stabilizes.</span>}
                        {phase < 6 && <span className="inline-block w-1.5 h-4 ml-1 align-middle bg-white/50 animate-pulse" />}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Input box placeholder */}
            <div className="mt-4 pt-4 border-t border-gray-200/60">
              <div className="bg-white rounded-full h-12 w-full border border-gray-200 flex items-center px-4">
                <span className="text-sm text-gray-400">Listening to operator...</span>
                <div className="ml-auto flex gap-1 items-center">
                  <div className="h-1.5 w-1.5 bg-brand-light rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="h-1.5 w-1.5 bg-brand-light rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="h-1.5 w-1.5 bg-brand-light rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Panel: Extraction Workspace */}
          <div className="flex flex-col h-[500px] lg:h-[600px] gap-4 lg:gap-6 relative z-10">
            
            {/* Structured Knowledge Cards Grid */}
            <div className="grid grid-cols-2 gap-4 auto-rows-max h-full overflow-hidden">
              
              <AnimatePresence>
                {phase >= 2 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm h-min"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Equipment</span>
                      <Settings2 className="h-3 w-3 text-brand-dark" />
                    </div>
                    <p className="text-sm font-bold text-gray-900">Pump P-2031</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {phase >= 2 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm h-min"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Procedure</span>
                      <Workflow className="h-3 w-3 text-blue-600" />
                    </div>
                    <p className="text-sm font-bold text-gray-900 leading-snug">Restart after scheduled maintenance</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {phase >= 4 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="bg-brand-light/5 border border-brand-light/20 rounded-xl p-4 shadow-sm h-min col-span-2"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-bold text-brand-dark uppercase tracking-wider">Operating Parameter</span>
                      <Activity className="h-3 w-3 text-brand-dark" />
                    </div>
                    <p className="text-sm font-bold text-gray-900">Verify minimum suction pressure</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {phase >= 5 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm h-min"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Related Asset</span>
                      <Wrench className="h-3 w-3 text-gray-400" />
                    </div>
                    <p className="text-sm font-bold text-gray-900">Discharge Valve</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {phase >= 6 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="bg-orange-50 border border-orange-100 rounded-xl p-4 shadow-sm h-min col-span-2"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-bold text-orange-800 uppercase tracking-wider">Safety Note / Constraint</span>
                      <AlertTriangle className="h-3 w-3 text-orange-500" />
                    </div>
                    <p className="text-sm font-bold text-orange-950">Wait until lubrication pressure stabilizes</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Graph Update Panel */}
            <AnimatePresence>
              {phase >= 7 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="mt-auto bg-brand-dark rounded-2xl p-6 shadow-xl relative overflow-hidden shrink-0"
                >
                  <div className="absolute -right-12 -top-12 h-32 w-32 bg-brand-light/20 rounded-full blur-[40px] pointer-events-none" />
                  
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-8 w-8 rounded-full bg-brand-light/10 flex items-center justify-center">
                      <Network className="h-4 w-4 text-brand-light" />
                    </div>
                    <h4 className="text-sm font-bold text-white">Knowledge Graph Updated</h4>
                  </div>
                  
                  <div className="space-y-3">
                    <motion.div 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="flex items-center gap-2"
                    >
                      <CheckCircle2 className="h-4 w-4 text-brand-light" />
                      <p className="text-xs text-gray-300">6 operational entities identified</p>
                    </motion.div>
                    
                    <motion.div 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                      className="flex items-center gap-2"
                    >
                      <CheckCircle2 className="h-4 w-4 text-brand-light" />
                      <p className="text-xs text-gray-300">14 new relationships created</p>
                    </motion.div>

                    <motion.div 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 }}
                      className="flex items-center gap-2"
                    >
                      <CheckCircle2 className="h-4 w-4 text-brand-light" />
                      <p className="text-xs text-gray-300">Operational expertise indexed</p>
                    </motion.div>
                    
                    <motion.div 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 }}
                      className="flex items-center gap-2"
                    >
                      <CheckCircle2 className="h-4 w-4 text-brand-light" />
                      <p className="text-xs text-gray-300">Ready for GraphRAG operational search</p>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
          </div>

        </div>

        {/* Bottom Strip: Value Props */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="w-full mt-12 lg:mt-16 bg-gray-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[1px] rounded-[2rem] overflow-hidden shadow-xl ring-1 ring-black/5 max-w-[1200px]"
        >
          {[
            { title: "Institutional Memory", desc: "Capture knowledge before experienced employees retire.", icon: BookOpen },
            { title: "Accelerated Onboarding", desc: "Help new engineers learn proven operational practices faster.", icon: Users },
            { title: "Standardized Procedures", desc: "Convert informal practices into structured operational knowledge.", icon: Lightbulb },
            { title: "Continuous Learning", desc: "Every expert conversation strengthens the enterprise graph.", icon: Network }
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

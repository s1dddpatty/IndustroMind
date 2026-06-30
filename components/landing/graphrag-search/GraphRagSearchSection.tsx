"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Sparkles, 
  FileText, 
  Settings, 
  AlertTriangle, 
  ArrowRight,
  Database,
  Link as LinkIcon,
  CheckCircle2,
  Network,
  ShieldCheck
} from "lucide-react";

export default function GraphRagSearchSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (isInView && phase === 0) {
      // Start the orchestrated sequence
      const runSequence = async () => {
        setPhase(1); // Typing question
        await new Promise(r => setTimeout(r, 1500));
        
        setPhase(2); // Searching & Reasoning checklist
        await new Promise(r => setTimeout(r, 2000));
        
        setPhase(3); // Graph lights up
        await new Promise(r => setTimeout(r, 2000));
        
        setPhase(4); // Answer appears
        await new Promise(r => setTimeout(r, 1500));
        
        setPhase(5); // Sources appear
      };
      runSequence();
    }
  }, [isInView, phase]);

  const typingVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.03 } }
  };

  const letterVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1 }
  };

  const questionText = "What is the startup procedure for Pump P-2031?";

  return (
    <section id="graphrag-search" className="relative flex flex-col justify-center min-h-screen bg-white py-16 lg:py-24 overflow-hidden" ref={containerRef}>
      
      {/* Background Gradients */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-light/5 rounded-full blur-3xl pointer-events-none mix-blend-multiply" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none mix-blend-multiply" />

      <div className="relative mx-auto w-full max-w-[1200px] px-6 lg:px-8 flex flex-col items-center">
        
        {/* Header */}
        <div className="text-center max-w-2xl mb-12 lg:mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-sm font-semibold text-gray-700 shadow-sm mb-6"
          >
            <Sparkles className="h-4 w-4 text-brand-light" />
            GraphRAG Search
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-[clamp(32px,4vw,48px)] font-extrabold tracking-tight text-gray-900 leading-[1.1] mb-4"
          >
            Ask your plant <span className="text-brand-light">anything.</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-600 leading-relaxed"
          >
            Every answer is grounded in your connected industrial knowledge graph, not generic AI patterns. Experience true industrial reasoning.
          </motion.p>
        </div>

        {/* Centerpiece Search Experience */}
        <div className="w-full max-w-4xl flex flex-col items-center">
          
          {/* Search Box */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="w-full bg-white rounded-full border border-gray-200 shadow-xl ring-1 ring-black/5 p-3 pl-6 flex items-center gap-4 z-20"
          >
            <Search className="h-6 w-6 text-brand-light shrink-0" />
            <div className="flex-1 font-medium text-lg lg:text-xl text-gray-900 h-8 flex items-center">
              {phase >= 1 && (
                <motion.div variants={typingVariants} initial="hidden" animate="show" className="flex flex-wrap">
                  {questionText.split("").map((char, index) => (
                    <motion.span key={index} variants={letterVariants}>
                      {char === " " ? "\u00A0" : char}
                    </motion.span>
                  ))}
                  {phase === 1 && (
                    <motion.span 
                      animate={{ opacity: [1, 0] }} 
                      transition={{ repeat: Infinity, duration: 0.8 }} 
                      className="inline-block w-0.5 h-6 bg-brand-light ml-1 align-middle"
                    />
                  )}
                </motion.div>
              )}
            </div>
            <div className="hidden sm:flex bg-brand-dark rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-sm items-center gap-2 shrink-0 opacity-80">
              <Sparkles className="h-4 w-4" /> Search
            </div>
          </motion.div>

          {/* Reasoning & Graph Area */}
          <AnimatePresence>
            {phase >= 2 && phase < 4 && (
              <motion.div 
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: "auto", marginTop: 32 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full flex flex-col md:flex-row items-center justify-center gap-8 lg:gap-12 border border-gray-100 bg-gray-50/50 rounded-[2rem] p-6 lg:p-8 shadow-sm overflow-hidden"
              >
                {/* Reasoning Checklist */}
                <div className="flex-1 flex flex-col gap-3">
                  <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
                      <Network className="h-3.5 w-3.5 text-brand-light" />
                    </motion.div>
                    GraphRAG Reasoning
                  </h4>
                  {[
                    "Querying SOP-204...",
                    "Reviewing API 610 standards...",
                    "Checking maintenance history...",
                    "Cross-referencing procedures...",
                    "Validating with Knowledge Graph..."
                  ].map((task, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.4 }}
                      className="flex items-center gap-3 text-sm font-medium text-gray-700"
                    >
                      <motion.div 
                        initial={{ scale: 0 }} 
                        animate={{ scale: 1 }} 
                        transition={{ delay: (i * 0.4) + 0.2 }}
                      >
                        <CheckCircle2 className="h-4 w-4 text-brand-light" />
                      </motion.div>
                      {task}
                    </motion.div>
                  ))}
                </div>

                {/* Animated Graph Visual */}
                <div className="flex-1 flex justify-center items-center h-48 relative w-full">
                  {/* Subtle pulsing background */}
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }} 
                    transition={{ repeat: Infinity, duration: 3 }}
                    className="absolute inset-0 bg-brand-light/5 rounded-full blur-xl"
                  />
                  
                  {/* Graph SVG */}
                  <svg viewBox="0 0 200 200" className="w-full h-full max-w-[240px] drop-shadow-sm overflow-visible">
                    {/* Edges */}
                    {[
                      { d: "M100 100 L50 50", delay: 0.5 },
                      { d: "M100 100 L150 40", delay: 0.8 },
                      { d: "M100 100 L170 120", delay: 1.1 },
                      { d: "M100 100 L120 170", delay: 1.4 },
                      { d: "M100 100 L40 140", delay: 1.7 },
                      { d: "M150 40 L170 120", delay: 2.0 },
                      { d: "M50 50 L40 140", delay: 2.3 },
                    ].map((edge, i) => (
                      <motion.path 
                        key={`edge-${i}`}
                        d={edge.d} 
                        stroke="#2B6B4C" 
                        strokeWidth="1.5"
                        strokeOpacity="0.2"
                        fill="none"
                        initial={phase >= 3 ? { pathLength: 0 } : { pathLength: 0 }}
                        animate={phase >= 3 ? { pathLength: 1 } : { pathLength: 0 }}
                        transition={{ duration: 0.6, delay: edge.delay * 0.4 }}
                      />
                    ))}

                    {/* Nodes */}
                    {[
                      { cx: 100, cy: 100, label: "P-2031", isCenter: true },
                      { cx: 50, cy: 50, label: "SOP" },
                      { cx: 150, cy: 40, label: "API 610" },
                      { cx: 170, cy: 120, label: "Hazard" },
                      { cx: 120, cy: 170, label: "Operator" },
                      { cx: 40, cy: 140, label: "Maint." },
                    ].map((node, i) => (
                      <g key={`node-${i}`}>
                        <motion.circle 
                          cx={node.cx} 
                          cy={node.cy} 
                          r={node.isCenter ? 12 : 8} 
                          fill={node.isCenter ? "#0F3223" : "#fff"} 
                          stroke="#2B6B4C"
                          strokeWidth="2"
                          initial={phase >= 3 ? { scale: 0 } : { scale: 0 }}
                          animate={phase >= 3 ? { scale: 1 } : { scale: 0 }}
                          transition={{ type: "spring", delay: (i * 0.2) }}
                        />
                        <motion.text 
                          x={node.cx} 
                          y={node.cy + (node.isCenter ? 24 : 20)} 
                          fontSize="9" 
                          fontWeight="700"
                          fill="#4B5563"
                          textAnchor="middle"
                          initial={phase >= 3 ? { opacity: 0 } : { opacity: 0 }}
                          animate={phase >= 3 ? { opacity: 1 } : { opacity: 0 }}
                          transition={{ delay: (i * 0.2) + 0.2 }}
                        >
                          {node.label}
                        </motion.text>
                      </g>
                    ))}
                  </svg>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Answer and Sources Area */}
          {phase >= 4 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="w-full mt-8 grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6"
            >
              {/* Main Answer Panel */}
              <div className="bg-white rounded-[2rem] border border-gray-200 shadow-lg p-6 lg:p-8 flex flex-col gap-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-light to-blue-500 opacity-20"></div>
                <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-dark text-brand-light">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Verified Answer</h3>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2">Summary</h4>
                    <p className="text-sm text-gray-700 leading-relaxed font-medium">
                      To start Pump P-2031 safely, you must ensure the suction valve is fully open and the discharge valve is closed before energizing the motor, adhering to SOP-204 and API 610 guidelines.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-3">Step-by-step Procedure</h4>
                    <ul className="space-y-3">
                      {[
                        "Verify lockout/tagout has been removed and permit is closed.",
                        "Fully open the suction block valve (V-101).",
                        "Ensure the discharge block valve (V-102) is fully closed.",
                        "Energize the motor and verify rotation direction.",
                        "Slowly open the discharge valve until reaching target flow."
                      ].map((step, i) => (
                        <li key={i} className="flex gap-3 text-sm text-gray-700">
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-light/10 text-[10px] font-bold text-brand-dark">
                            {i + 1}
                          </span>
                          <span className="leading-snug">{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex gap-4 p-4 rounded-xl bg-orange-50 border border-orange-100">
                    <AlertTriangle className="h-5 w-5 text-orange-500 shrink-0" />
                    <div>
                      <h4 className="text-sm font-bold text-orange-800">Safety Warning</h4>
                      <p className="text-xs text-orange-700 mt-1 leading-relaxed">Never start the pump with a closed suction valve. This will cause cavitation and severe mechanical seal damage.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sources Panel */}
              <div className="flex flex-col gap-4">
                <h3 className="text-sm font-bold text-gray-900 px-1 mb-1">Grounded Sources</h3>
                {phase >= 5 && [
                  { title: "SOP-204", type: "Procedure", conf: "99%", icon: FileText, delay: 0 },
                  { title: "Pump Manual P-2031", type: "Manual", conf: "98%", icon: Settings, delay: 0.1 },
                  { title: "API 610 Standard", type: "Compliance", conf: "96%", icon: FileText, delay: 0.2 },
                  { title: "Knowledge Graph", type: "Connected Data", conf: "100%", icon: Network, delay: 0.3 }
                ].map((source, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: source.delay }}
                    className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:border-brand-light/40 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-md bg-gray-50 text-gray-500 group-hover:bg-brand-light/10 group-hover:text-brand-light transition-colors">
                          <source.icon className="h-4 w-4" />
                        </div>
                        <span className="text-[13px] font-bold text-gray-900">{source.title}</span>
                      </div>
                      <span className="text-[10px] font-bold text-brand-dark bg-brand-light/10 px-2 py-0.5 rounded-full ring-1 ring-inset ring-brand-light/20">
                        {source.conf}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] font-medium text-gray-500 pl-9">
                      <LinkIcon className="h-3 w-3" />
                      {source.type}
                    </div>
                  </motion.div>
                ))}
              </div>

            </motion.div>
          )}
        </div>

        {/* Bottom Strip: Value Props */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="w-full max-w-4xl mt-12 lg:mt-16 bg-gray-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[1px] rounded-[2rem] overflow-hidden shadow-xl ring-1 ring-black/5"
        >
          {[
            { title: "Grounded Answers", desc: "No hallucinations. Pure facts.", icon: Database },
            { title: "Traceable Sources", desc: "Verify every claim instantly.", icon: LinkIcon },
            { title: "Graph Reasoning", desc: "Cross-references all context.", icon: Network },
            { title: "Enterprise Trust", desc: "Secure and highly accurate.", icon: ShieldCheck }
          ].map((prop, i) => (
            <div key={i} className="bg-white p-6 xl:p-8 flex flex-col items-center justify-center text-center group transition-colors hover:bg-brand-light/[0.02]">
              <div className="flex h-10 w-10 mb-3 shrink-0 items-center justify-center rounded-full bg-brand-light/10 text-brand-dark ring-4 ring-white shadow-sm transition-transform duration-300 group-hover:scale-110">
                <prop.icon className="h-5 w-5" />
              </div>
              <h4 className="text-[13px] xl:text-sm font-bold text-gray-900 mb-1.5">{prop.title}</h4>
              <p className="text-[11px] xl:text-xs text-gray-500 leading-snug">{prop.desc}</p>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}

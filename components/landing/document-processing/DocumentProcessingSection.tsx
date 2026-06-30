"use client";

import { motion } from "framer-motion";
import { 
  CheckCircle2, 
  Upload, 
  BrainCircuit, 
  Network, 
  Database,
  Link,
  FileText,
  Image as ImageIcon,
  Scan,
  FileSpreadsheet,
  File,
  MoreHorizontal,
  CloudUpload,
  ShieldCheck,
  AlertTriangle,
  Clock,
  MapPin,
  Settings,
  FileSearch
} from "lucide-react";
import { Button } from "@/components/ui/button";

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

export default function DocumentProcessingSection() {
  return (
    <section id="document-processing" className="bg-white min-h-screen flex flex-col justify-center py-16 overflow-hidden">
      <div className="mx-auto max-w-[1400px] w-full px-6 lg:px-8">
        
        {/* Main Grid: Left Info / Right Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-[40fr_60fr] gap-8 xl:gap-12 items-center">
          
          {/* Left Column */}
          <motion.div 
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="flex flex-col"
          >
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-sm font-semibold text-gray-700 shadow-sm w-fit">
              <FileText className="h-4 w-4 text-primary" />
              Intelligent Document Processing
            </motion.div>

            <motion.h2 variants={fadeUp} className="mt-6 text-[clamp(32px,4vw,48px)] font-extrabold tracking-tight text-gray-900 leading-[1.1]">
              Intelligent document parsing that turns <span className="text-brand-light">unstructured files into structured knowledge.</span>
            </motion.h2>

            <motion.p variants={fadeUp} className="mt-4 text-lg leading-relaxed text-gray-600">
              IndustroMind AI reads and understands industrial documents in context and extracts what matters — procedures, equipment, hazards, standards, parameters and compliance information — turning unstructured content into trusted, connected intelligence.
            </motion.p>

            <motion.ul variants={staggerContainer} className="mt-6 space-y-3">
              {[
                "Extract entities like equipment, procedures, hazards and controls",
                "Understand context, relationships and dependencies",
                "Auto-classify and tag for faster discovery",
                "Continuously improve with feedback and usage"
              ].map((item, i) => (
                <motion.li key={i} variants={fadeUp} className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 shrink-0 text-brand-light" />
                  <span className="text-gray-700 font-medium">{item}</span>
                </motion.li>
              ))}
            </motion.ul>

            {/* Stats */}
            <motion.div variants={fadeUp} className="mt-8 grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm ring-1 ring-gray-900/5 transition-all hover:shadow-md">
                <div className="flex items-center gap-2 text-gray-500 mb-3">
                  <FileText className="h-5 w-5 text-brand-light" />
                  <span className="text-3xl font-bold text-gray-900">1,248</span>
                </div>
                <p className="text-sm font-semibold text-gray-700">Documents ingested</p>
                <p className="text-xs text-brand-light font-medium mt-1">+156 this week</p>
              </div>
              <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm ring-1 ring-gray-900/5 transition-all hover:shadow-md">
                <div className="flex items-center gap-2 text-gray-500 mb-3">
                  <CheckCircle2 className="h-5 w-5 text-brand-light" />
                  <span className="text-3xl font-bold text-gray-900">98.7%</span>
                </div>
                <p className="text-sm font-semibold text-gray-700">Extraction accuracy</p>
                <p className="text-xs text-brand-light font-medium mt-1">+3.2% this week</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: Enterprise Workspace */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative w-full rounded-[2rem] border border-gray-200/50 bg-[#FAFAFA] shadow-2xl ring-1 ring-black/5 overflow-hidden p-5 sm:p-6"
          >
            {/* Subtle premium background accents */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-light/5 rounded-full blur-3xl pointer-events-none mix-blend-multiply" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none mix-blend-multiply" />

            <div className="relative z-10 flex flex-col gap-5">
              
              {/* Pipeline Section */}
              <div className="w-full">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">From unstructured documents to operational intelligence</h3>
                <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {[
                    { icon: Upload, label: "Upload", sub: "Any document\nany format", color: "text-brand-light" },
                    { icon: BrainCircuit, label: "Extract", sub: "AI reads and\nunderstands", color: "text-brand-light" },
                    { icon: Database, label: "Structure", sub: "Entities, relations\nand context", color: "text-brand-light" },
                    { icon: Network, label: "Enrich", sub: "Linked to assets,\npeople, systems", color: "text-brand-light" },
                    { icon: Link, label: "Connect", sub: "Added to the\nknowledge graph", color: "text-brand-light" },
                  ].map((step, i, arr) => (
                    <div key={i} className="flex items-center gap-2 min-w-max">
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 + (i * 0.1) }}
                        className="flex flex-col items-center justify-center p-3 bg-white rounded-xl border border-gray-100 shadow-sm w-[100px] h-[110px] text-center"
                      >
                        <step.icon className={`h-5 w-5 ${step.color} mb-2`} strokeWidth={1.5} />
                        <span className="text-[11px] font-bold text-gray-900">{step.label}</span>
                        <span className="text-[9px] text-gray-500 mt-1 leading-tight whitespace-pre-line">{step.sub}</span>
                      </motion.div>
                      {i < arr.length - 1 && (
                        <div className="w-4 flex justify-center text-gray-300">
                          <ArrowRightIcon />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Middle Panels */}
              <div className="grid grid-cols-1 md:grid-cols-[40fr_60fr] gap-5">
                
                {/* Ingestion Panel */}
                <motion.div 
                   initial={{ opacity: 0, x: -20 }}
                   whileInView={{ opacity: 1, x: 0 }}
                   viewport={{ once: true }}
                   transition={{ delay: 0.5 }}
                   className="flex flex-col"
                >
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">Ingest from your sources</h3>
                  <p className="text-[11px] text-gray-500 mb-3">Bring in documents from the sources you already use.</p>
                  
                  <div className="grid grid-cols-4 gap-2 mb-3">
                    {[
                      { icon: File, label: "PDF", color: "text-red-500 bg-red-50/50 border-red-100" },
                      { icon: FileText, label: "Word", color: "text-blue-600 bg-blue-50/50 border-blue-100" },
                      { icon: FileSpreadsheet, label: "Excel", color: "text-green-600 bg-green-50/50 border-green-100" },
                      { icon: FileSearch, label: "PPT", color: "text-orange-500 bg-orange-50/50 border-orange-100" },
                      { icon: FileText, label: "TXT", color: "text-gray-600 bg-gray-50/50 border-gray-200" },
                      { icon: ImageIcon, label: "Images", color: "text-brand-light bg-brand-light/5 border-brand-light/20" },
                      { icon: Scan, label: "Scans", color: "text-purple-600 bg-purple-50/50 border-purple-100" },
                      { icon: MoreHorizontal, label: "More", color: "text-gray-400 bg-gray-50/50 border-gray-200" },
                    ].map((source, i) => (
                      <div key={i} className={`flex flex-col items-center justify-center p-2 rounded-lg border ${source.color} transition-transform hover:scale-105 cursor-default`}>
                        <source.icon className="h-4 w-4 mb-1" strokeWidth={1.5} />
                        <span className="text-[8px] font-medium text-gray-600">{source.label}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-auto border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50 p-5 flex flex-col items-center justify-center text-center transition-colors hover:bg-gray-50">
                    <CloudUpload className="h-5 w-5 text-gray-400 mb-2" />
                    <p className="text-[11px] text-gray-600 font-medium">Drag & drop your files here</p>
                    <p className="text-[10px] text-gray-500">or <span className="text-brand-light font-medium cursor-pointer hover:underline">browse</span></p>
                  </div>
                  
                  <div className="flex items-center gap-1.5 mt-3 text-[10px] text-gray-500 font-medium">
                    <ShieldCheck className="h-3.5 w-3.5" /> Secure. Private. Enterprise-ready.
                  </div>
                </motion.div>

                {/* Extraction Preview Panel */}
                <motion.div 
                   initial={{ opacity: 0, x: 20 }}
                   whileInView={{ opacity: 1, x: 0 }}
                   viewport={{ once: true }}
                   transition={{ delay: 0.6 }}
                   className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col h-full"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-semibold text-gray-900">AI extraction preview</h3>
                    <span className="inline-flex items-center rounded-full bg-brand-light/10 px-2 py-0.5 text-[9px] font-medium text-brand-dark ring-1 ring-inset ring-brand-light/20">
                      High confidence
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4 bg-gray-50/50 p-2.5 rounded-lg border border-gray-100">
                    <div>
                      <p className="text-[9px] text-gray-500 font-medium uppercase tracking-wider mb-0.5">Document</p>
                      <p className="text-[11px] font-semibold text-gray-900 truncate">Standard Operating Procedure</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-gray-500 font-medium uppercase tracking-wider mb-0.5">Document ID</p>
                      <div className="flex items-center gap-1 text-[11px] font-semibold text-gray-900">
                        <FileText className="h-3 w-3 text-gray-400" />
                        SOP-PMP-2031
                      </div>
                    </div>
                  </div>

                  <div className="flex-1">
                    <p className="text-[9px] text-gray-900 font-bold uppercase tracking-wider mb-2">Extracted entities</p>
                    <div className="space-y-2">
                      {[
                        { icon: Settings, label: "Equipment", value: "Centrifugal Pump P-2031", conf: "98%" },
                        { icon: FileText, label: "Procedure", value: "Seal Replacement", conf: "96%" },
                        { icon: MapPin, label: "Location", value: "Unit 12 - Fluid Transfer", conf: "97%" },
                        { icon: Clock, label: "Frequency", value: "Every 3 Months", conf: "95%" },
                        { icon: AlertTriangle, label: "Hazard", value: "High Pressure / Hot Surface", conf: "98%" },
                        { icon: FileSearch, label: "Standard", value: "API 610", conf: "96%" },
                      ].map((entity, i) => (
                        <div key={i} className="flex items-center justify-between group">
                          <div className="flex items-center gap-2 w-1/3">
                            <entity.icon className="h-3 w-3 text-gray-400" />
                            <span className="text-[10px] text-gray-600">{entity.label}</span>
                          </div>
                          <div className="flex-1 text-[10px] font-medium text-gray-900 truncate pr-2">
                            {entity.value}
                          </div>
                          <div className="text-[9px] font-medium text-brand-dark opacity-0 group-hover:opacity-100 transition-opacity">
                            {entity.conf}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-2 border-t border-gray-100 flex justify-between items-center cursor-pointer hover:bg-gray-50 p-2 -mx-2 rounded-lg transition-colors">
                    <span className="text-[11px] font-semibold text-gray-700">View full extracted content</span>
                    <ArrowRightIcon className="text-gray-400 h-3.5 w-3.5" />
                  </div>
                </motion.div>

              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Strip: Premium Enterprise Value Panel */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mt-10 lg:mt-12 bg-gray-100 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] gap-[1px] rounded-[2rem] overflow-hidden shadow-xl ring-1 ring-black/5"
        >
          {/* 1. Context Column */}
          <div className="bg-white p-6 xl:p-8 md:col-span-2 lg:col-span-1 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-6 w-1.5 bg-brand-light rounded-full"></div>
              <h3 className="text-base font-bold text-gray-900">Why it matters</h3>
            </div>
            <p className="text-[13px] xl:text-sm text-gray-600 leading-relaxed pr-4">
              Unstructured documents hide critical knowledge. We unlock it and make it easy to use, trust and act on.
            </p>
          </div>
          
          {/* 2-5. Value Columns */}
          {[
            { icon: Clock, title: "Save time", desc: "Reduce manual reading and data entry." },
            { icon: ShieldCheck, title: "Improve accuracy", desc: "Minimize human error and missing details." },
            { icon: FileText, title: "Ensure compliance", desc: "Capture requirements and controls reliably." },
            { icon: Network, title: "Accelerate decisions", desc: "Deliver the right info to the right people, faster." }
          ].map((prop, i) => (
            <div key={i} className="bg-white p-6 xl:p-8 flex flex-col items-start justify-center group transition-colors hover:bg-brand-light/[0.02]">
              <div className="flex h-10 w-10 mb-4 shrink-0 items-center justify-center rounded-full bg-brand-light/10 text-brand-dark ring-4 ring-white shadow-sm transition-transform duration-300 group-hover:scale-110">
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

function ArrowRightIcon(props: any) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
  );
}

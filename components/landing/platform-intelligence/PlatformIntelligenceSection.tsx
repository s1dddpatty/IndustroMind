"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Network, 
  Activity, 
  Wrench, 
  ShieldCheck, 
  FileText, 
  BookOpen, 
  Sparkles, 
  ChevronRight, 
  Settings2, 
  AlertTriangle,
  CheckCircle2,
  Eye,
  Server,
  Zap,
  Clock,
  ArrowRight,
  BrainCircuit
} from "lucide-react";

// --- Mock Data for the Interactive Explorer ---
const ASSETS = [
  { id: 'plant-a', name: 'Plant A', level: 0, status: 'Healthy' },
  { id: 'pump-p2031', name: 'Pump P-2031', level: 1, status: 'Attention' },
  { id: 'compressor-c12', name: 'Compressor C-12', level: 1, status: 'Maintenance' },
  { id: 'valve-v08', name: 'Valve V-08', level: 1, status: 'Healthy' },
  { id: 'hx-03', name: 'Heat Exchanger HX-03', level: 1, status: 'Inspection' },
  { id: 'cooling-tower', name: 'Cooling Tower', level: 1, status: 'Healthy' },
];

const ASSET_DATA: Record<string, any> = {
  'plant-a': {
    health: 94,
    maintenance: 'Routine',
    compliance: 'Compliant',
    recommendations: 12,
    aiSummary: "Plant A is operating efficiently at 94% capacity. Overall compliance is green. 12 minor maintenance items recommended for next week's PM schedule."
  },
  'pump-p2031': {
    health: 72,
    maintenance: 'Overdue',
    compliance: 'Review Required',
    recommendations: 2,
    aiSummary: "Pump P-2031 shows a 15% drop in suction pressure over 48 hours. Connected maintenance records indicate overdue seal replacement. Recommend immediate inspection."
  },
  'compressor-c12': {
    health: 45,
    maintenance: 'In Progress',
    compliance: 'Compliant',
    recommendations: 0,
    aiSummary: "Compressor C-12 is currently offline for scheduled maintenance. Estimated return to service: 14:00 hours."
  },
  'valve-v08': {
    health: 98,
    maintenance: 'Up to date',
    compliance: 'Compliant',
    recommendations: 1,
    aiSummary: "Valve V-08 is functioning normally. Last calibration was 12 days ago. No immediate actions required."
  },
  'hx-03': {
    health: 85,
    maintenance: 'Scheduled',
    compliance: 'Compliant',
    recommendations: 1,
    aiSummary: "Heat Exchanger HX-03 scheduled for routine NDT inspection next month. Slight thermal efficiency drop noted, but within safe operating margins."
  },
  'cooling-tower': {
    health: 99,
    maintenance: 'Up to date',
    compliance: 'Compliant',
    recommendations: 0,
    aiSummary: "Cooling Tower operating at optimal parameters. Water chemistry logs verified by AI."
  }
};

const getStatusColor = (status: string) => {
  switch(status) {
    case 'Healthy': return 'bg-green-500';
    case 'Attention': return 'bg-orange-500';
    case 'Maintenance': return 'bg-blue-500';
    case 'Inspection': return 'bg-purple-500';
    default: return 'bg-gray-400';
  }
};

const getStatusTextColor = (status: string) => {
  switch(status) {
    case 'Healthy': return 'text-green-700 bg-green-50';
    case 'Attention': return 'text-orange-700 bg-orange-50';
    case 'Maintenance': return 'text-blue-700 bg-blue-50';
    case 'Inspection': return 'text-purple-700 bg-purple-50';
    default: return 'text-gray-700 bg-gray-50';
  }
};

export default function PlatformIntelligenceSection() {
  const [selectedAssetId, setSelectedAssetId] = useState('pump-p2031');
  const activeData = ASSET_DATA[selectedAssetId];

  return (
    <section id="asset-intelligence" className="relative flex flex-col justify-center min-h-screen bg-gray-50 py-16 lg:py-24 overflow-hidden">
      
      {/* Background gradients */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-light/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-50/50 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative mx-auto w-full max-w-[1400px] px-6 lg:px-8 flex flex-col items-center">
        
        {/* Header */}
        <div className="text-center max-w-3xl mb-12 lg:mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-sm font-semibold text-gray-700 shadow-sm mb-6"
          >
            <Network className="h-4 w-4 text-brand-dark" />
            One Connected Operational View
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-[clamp(32px,4vw,48px)] font-extrabold tracking-tight text-gray-900 leading-[1.1] mb-5"
          >
            Every asset. Every document. Every decision.<br/>
            <span className="text-brand-light">One connected operational platform.</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-600 leading-relaxed"
          >
            IndustroMind unifies asset information, operational insights, maintenance history, compliance status, AI recommendations and enterprise knowledge into one unified interface.
          </motion.p>
        </div>

        {/* 2-Column Experience */}
        <div className="w-full flex flex-col lg:flex-row gap-6 max-w-[1300px]">
          
          {/* Left Panel: Asset Explorer (~35%) */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full lg:w-[35%] bg-white rounded-3xl border border-gray-200/60 shadow-lg p-6 overflow-hidden flex flex-col h-[650px]"
          >
            <div className="flex items-center gap-2.5 mb-6 pb-4 border-b border-gray-100">
              <Server className="h-5 w-5 text-gray-400" />
              <h3 className="text-sm font-bold text-gray-900">Asset Explorer</h3>
            </div>
            
            <div className="flex-1 overflow-y-auto scrollbar-hide space-y-1">
              {ASSETS.map((asset) => {
                const isSelected = selectedAssetId === asset.id;
                return (
                  <button
                    key={asset.id}
                    onClick={() => setSelectedAssetId(asset.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all text-left group ${
                      isSelected 
                        ? "bg-brand-light/10 border-brand-light/30 border" 
                        : "hover:bg-gray-50 border border-transparent"
                    }`}
                  >
                    <div className={`flex items-center gap-3 ${asset.level === 1 ? 'ml-6' : ''}`}>
                      <ChevronRight className={`h-4 w-4 transition-transform ${isSelected ? 'text-brand-light rotate-90' : 'text-gray-400 group-hover:text-gray-600'}`} />
                      <span className={`text-sm font-semibold ${isSelected ? 'text-brand-dark' : 'text-gray-700 group-hover:text-gray-900'}`}>
                        {asset.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getStatusTextColor(asset.status)}`}>
                        {asset.status}
                      </span>
                      <div className={`h-2 w-2 rounded-full ${getStatusColor(asset.status)}`} />
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Right Panel: Executive Workspace (~65%) */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full lg:w-[65%] bg-[#FDFDFD] rounded-3xl border border-gray-200/60 shadow-lg p-6 lg:p-8 flex flex-col h-[650px] relative overflow-hidden ring-1 ring-black/5"
          >
            <div className="absolute top-0 right-0 h-32 w-32 bg-brand-light/5 rounded-full blur-[40px] pointer-events-none" />

            <AnimatePresence mode="wait">
              <motion.div
                key={selectedAssetId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="flex-1 flex flex-col h-full"
              >
                {/* Workspace Header */}
                <div className="flex items-start justify-between mb-8">
                  <div>
                    <h3 className="text-2xl font-extrabold text-gray-900 mb-2">{ASSETS.find(a => a.id === selectedAssetId)?.name}</h3>
                    <p className="text-sm font-medium text-gray-500 flex items-center gap-2">
                      <span className="flex items-center gap-1"><Activity className="h-3 w-3" /> System Active</span>
                      <span>•</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Live Sync</span>
                    </p>
                  </div>
                  <div className={`px-4 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider ${
                    activeData.health > 90 ? 'bg-green-50 border-green-200 text-green-700' :
                    activeData.health > 70 ? 'bg-orange-50 border-orange-200 text-orange-700' :
                    'bg-red-50 border-red-200 text-red-700'
                  }`}>
                    Health Score: {activeData.health}/100
                  </div>
                </div>

                {/* Top KPI Cards */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-2 transition-transform hover:-translate-y-1">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Wrench className="h-4 w-4" />
                      <span className="text-xs font-bold uppercase tracking-wider">Maintenance</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{activeData.maintenance}</span>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-2 transition-transform hover:-translate-y-1">
                    <div className="flex items-center gap-2 text-gray-500">
                      <ShieldCheck className="h-4 w-4" />
                      <span className="text-xs font-bold uppercase tracking-wider">Compliance</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{activeData.compliance}</span>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-2 transition-transform hover:-translate-y-1">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Sparkles className="h-4 w-4" />
                      <span className="text-xs font-bold uppercase tracking-wider">Recommendations</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{activeData.recommendations} Open</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                  {/* Connected Knowledge Panel */}
                  <div className="flex flex-col gap-3">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Connected Knowledge</h4>
                    <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm relative overflow-hidden h-full flex items-center justify-center min-h-[140px]">
                      {/* Mini Graph Visualization */}
                      <div className="absolute inset-0 bg-brand-light/5 pattern-grid-lg opacity-50" />
                      
                      <div className="relative z-10 flex flex-wrap justify-center gap-3">
                        <div className="flex items-center gap-1.5 bg-white border border-gray-200 shadow-sm px-2.5 py-1 rounded-full">
                          <FileText className="h-3 w-3 text-blue-500" />
                          <span className="text-[10px] font-bold text-gray-600">3 SOPs</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-white border border-gray-200 shadow-sm px-2.5 py-1 rounded-full">
                          <AlertTriangle className="h-3 w-3 text-orange-500" />
                          <span className="text-[10px] font-bold text-gray-600">API 610</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-white border border-gray-200 shadow-sm px-2.5 py-1 rounded-full">
                          <BookOpen className="h-3 w-3 text-purple-500" />
                          <span className="text-[10px] font-bold text-gray-600">Manual</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-white border border-gray-200 shadow-sm px-2.5 py-1 rounded-full">
                          <Wrench className="h-3 w-3 text-gray-500" />
                          <span className="text-[10px] font-bold text-gray-600">12 Logs</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-white border border-gray-200 shadow-sm px-2.5 py-1 rounded-full">
                          <Settings2 className="h-3 w-3 text-brand-dark" />
                          <span className="text-[10px] font-bold text-gray-600">Expert Q&A</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* AI Summary Panel */}
                  <div className="flex flex-col gap-3">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">AI Intelligence</h4>
                    <div className="bg-brand-dark border border-brand-dark rounded-2xl p-5 shadow-sm h-full flex flex-col justify-center">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="h-4 w-4 text-brand-light" />
                        <span className="text-xs font-bold text-white uppercase tracking-wider">Asset Brief</span>
                      </div>
                      <p className="text-sm text-gray-300 leading-relaxed">
                        {activeData.aiSummary}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-auto border-t border-gray-100 pt-4 flex justify-between items-center">
                  <span className="text-xs font-medium text-gray-400">View complete asset history</span>
                  <button className="flex items-center gap-1 text-sm font-bold text-brand-dark hover:text-brand-light transition-colors group">
                    Explore Details
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>

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
            { title: "Unified Asset View", desc: "No more switching between separate systems.", icon: Server },
            { title: "Operational Visibility", desc: "Real-time health, maintenance, and compliance.", icon: Eye },
            { title: "AI Recommendations", desc: "Predictive insights powered by your own data.", icon: Zap },
            { title: "Enterprise Intelligence", desc: "Decisions grounded in connected organizational knowledge.", icon: Network }
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

        {/* Elegant Closing Statement */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-20 lg:mt-28 text-center max-w-2xl mx-auto border-t border-gray-200 pt-12"
        >
          <div className="inline-block p-3 rounded-full bg-gray-50 mb-6">
            <BrainCircuit className="h-6 w-6 text-gray-400" />
          </div>
          <p className="text-xl md:text-2xl font-semibold text-gray-800 leading-snug">
            Powered by every document, <br/>
            every expert, every procedure, <br/>
            <span className="text-brand-light">and every decision captured by IndustroMind.</span>
          </p>
        </motion.div>

      </div>
    </section>
  );
}

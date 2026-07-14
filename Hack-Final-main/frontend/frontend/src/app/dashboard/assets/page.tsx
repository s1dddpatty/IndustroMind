"use client";

import { useState } from "react";
import { 
  Wrench, Activity, ShieldCheck, AlertCircle, Search, HelpCircle, 
  BookOpen, Clock, FileText, ChevronRight, Info, AlertTriangle, UserCheck 
} from "lucide-react";

interface Asset {
  tag: string;
  name: string;
  type: string;
  criticality: "Critical" | "High" | "Medium" | "Low";
  status: "Running" | "Standby" | "Maintenance";
  specs: Record<string, string>;
  compliance: { standard: string; title: string; status: string }[];
  heuristics: { title: string; author: string; detail: string }[];
  history: { date: string; type: string; summary: string; tech: string }[];
}

const DEMO_ASSETS: Asset[] = [
  {
    tag: "P-204",
    name: "Main Centrifugal Pump",
    type: "Rotating Equipment",
    criticality: "Critical",
    status: "Running",
    specs: {
      Manufacturer: "Flowserve Corp",
      Model: "HPX 3x2x10",
      Capacity: "450 GPM",
      "Design Head": "320 ft",
      "Operating Temp": "380 °F",
      "Power Rating": "150 HP"
    },
    compliance: [
      { standard: "API Standard 610", title: "Centrifugal Pumps for Petroleum/Gas Services", status: "Compliant" },
      { standard: "OSHA 1910.119 PSM", title: "Process Safety Management guidelines", status: "Compliant" },
      { standard: "ISO 10816-3", title: "Vibration Assessment Standards", status: "Under Review" }
    ],
    heuristics: [
      {
        title: "Cold Weather Startup Heuristic",
        author: "Dave Miller (Senior Specialist)",
        detail: "Always crack suction valve V-101 open by 5% for 15 minutes prior to full startup in cold weather (< 32°F) to prevent seal thermal shock."
      }
    ],
    history: [
      { date: "2026-06-12", type: "Inspection", summary: "Routine vibration analysis - alert level normal (1.8 mm/s)", tech: "J. Mercer" },
      { date: "2026-04-18", type: "Maintenance", summary: "Mechanical seal MS-204 replacement and oil flush", tech: "R. Chen" },
      { date: "2023-09-12", type: "Incident", summary: "Impeller seizure due to cold startup thermal shock (INC-2023-09)", tech: "Elena Vance" }
    ]
  },
  {
    tag: "V-101",
    name: "Suction Isolation Gate Valve",
    type: "Piping & Valves",
    criticality: "High",
    status: "Running",
    specs: {
      Manufacturer: "Crane Valves",
      "Valve Size": "4 inch",
      "Pressure Class": "Class 300",
      "Body Material": "Cast Carbon Steel",
      Actuation: "Manual Handwheel"
    },
    compliance: [
      { standard: "ASME B16.34", title: "Valves - Flanged, Threaded and Welding End", status: "Compliant" }
    ],
    heuristics: [
      {
        title: "Seat Binding Warning",
        author: "Dave Miller (Senior Specialist)",
        detail: "Do not over-tighten during thermal cycles; expansion causes gate binding. Back off 1/4 turn when fully closed."
      }
    ],
    history: [
      { date: "2026-05-30", type: "Inspection", summary: "Seat leakage test completed - zero bubble pass", tech: "M. Kovalenko" }
    ]
  },
  {
    tag: "V-102",
    name: "Discharge Control Valve",
    type: "Piping & Valves",
    criticality: "High",
    status: "Running",
    specs: {
      Manufacturer: "Fisher Controls",
      Model: "Easy-Drive Globe",
      "Valve Size": "3 inch",
      Trim: "Equal Percentage",
      Positioner: "FIELDVUE DVC6200"
    },
    compliance: [
      { standard: "ISA-75.01.01", title: "Flow Equations for Sizing Control Valves", status: "Compliant" }
    ],
    heuristics: [],
    history: [
      { date: "2026-06-02", type: "Maintenance", summary: "Actuator spring replacement and stroke calibration", tech: "R. Chen" }
    ]
  },
  {
    tag: "C-301",
    name: "Syngas Compressor Unit",
    type: "Rotating Equipment",
    criticality: "Critical",
    status: "Standby",
    specs: {
      Manufacturer: "Elliott Group",
      Type: "Multi-stage Centrifugal",
      Stages: "4 Stage Inline",
      Speed: "11,500 RPM",
      Flow: "18,200 ICFM",
      Driver: "15,000 HP Steam Turbine"
    },
    compliance: [
      { standard: "API Standard 617", title: "Axial and Centrifugal Compressors for Gas Industries", status: "Compliant" },
      { standard: "OSHA 1910.119 PSM", title: "Hazard Analysis Critical Control Point", status: "Compliant" }
    ],
    heuristics: [
      {
        title: "Surge Control Override Heuristic",
        author: "Sarah Jenkins (Lead Control Tech)",
        detail: "When gas density drops below 0.85 kg/m3, bypass flow should be manually set to 15% override to prevent high-frequency vibration spike."
      }
    ],
    history: [
      { date: "2026-06-25", type: "Maintenance", summary: "Anti-surge controller loop check and diagnostic scan", tech: "Sarah Jenkins" }
    ]
  }
];

export default function AssetsPage() {
  const [assets] = useState<Asset[]>(DEMO_ASSETS);
  const [selectedTag, setSelectedTag] = useState<string>("P-204");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"specs" | "compliance" | "heuristics" | "history">("specs");

  const filteredAssets = assets.filter(asset => 
    asset.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedAsset = assets.find(a => a.tag === selectedTag) || assets[0];

  const getCriticalityColor = (crit: string) => {
    switch (crit) {
      case "Critical": return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      case "High": return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "Medium": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      default: return "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Running": return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
      case "Standby": return "text-sky-400 bg-sky-500/10 border-sky-500/20";
      default: return "text-amber-400 bg-amber-500/10 border-amber-500/20";
    }
  };

  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-120px)]">
      {/* Header */}
      <div className="flex-shrink-0">
        <h2 className="text-2xl font-bold tracking-tight text-[#dde3eb] flex items-center gap-2">
          <Wrench className="h-6 w-6 text-[#0ea5e9]" />
          <span>Asset Profiles & Lineage</span>
        </h2>
        <p className="text-xs text-[#88929b] mt-1">Explore design specifications, compliance mappings, and expert tribal heuristics for physical plant equipment.</p>
      </div>

      {/* Main Container */}
      <div className="flex-1 flex gap-6 overflow-hidden min-h-0">
        
        {/* Left Side: Asset Directory */}
        <div className="w-[300px] bg-[#161c22] border border-[#334155] rounded-2xl flex flex-col overflow-hidden flex-shrink-0">
          <div className="p-4 border-b border-[#334155]">
            <h3 className="text-xs font-bold text-[#dde3eb] uppercase tracking-wider mb-3">Plant Assets Directory</h3>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[#88929b]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by tag, name..."
                className="w-full bg-[#0e141a] border border-[#334155] rounded-xl pl-9 pr-4 py-2 text-xs text-[#dde3eb] placeholder:text-[#88929b]/80 focus:border-[#0ea5e9] focus:outline-none"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {filteredAssets.map(asset => {
              const isSelected = asset.tag === selectedTag;
              return (
                <div
                  key={asset.tag}
                  onClick={() => {
                    setSelectedTag(asset.tag);
                    setActiveTab("specs");
                  }}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start justify-between ${
                    isSelected 
                      ? "bg-[#0ea5e9]/5 border-[#0ea5e9] shadow-lg shadow-[#0ea5e9]/5" 
                      : "bg-[#1a2026]/40 border-[#334155] hover:border-[#88929b]/35"
                  }`}
                >
                  <div className="min-w-0">
                    <span className="font-mono text-xs font-bold text-[#89ceff]">{asset.tag}</span>
                    <h4 className={`text-xs font-bold mt-1 truncate ${isSelected ? "text-white" : "text-[#dde3eb]"}`}>
                      {asset.name}
                    </h4>
                    <p className="text-[10px] text-[#88929b] mt-1">{asset.type}</p>
                  </div>
                  <div className="flex flex-col items-end space-y-1.5">
                    <span className={`text-[9px] px-1.5 py-0.5 rounded border font-mono ${getCriticalityColor(asset.criticality)}`}>
                      {asset.criticality}
                    </span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded border font-mono ${getStatusColor(asset.status)}`}>
                      {asset.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Digital Profile Detail */}
        <div className="flex-1 bg-[#161c22] border border-[#334155] rounded-2xl flex flex-col overflow-hidden">
          {selectedAsset ? (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Asset Header Info */}
              <div className="p-6 border-b border-[#334155] bg-[#0F172A]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2.5">
                    <span className="text-[#0ea5e9] font-mono text-sm font-bold bg-[#0ea5e9]/10 px-2 py-0.5 rounded border border-[#0ea5e9]/20">
                      {selectedAsset.tag}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-mono ${getCriticalityColor(selectedAsset.criticality)}`}>
                      {selectedAsset.criticality} Criticality
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-mono ${getStatusColor(selectedAsset.status)}`}>
                      {selectedAsset.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mt-1.5">{selectedAsset.name}</h3>
                  <p className="text-xs text-[#88929b]">{selectedAsset.type}</p>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex border-b border-[#334155] px-6 bg-[#0e141a]/40 text-xs">
                {[
                  { id: "specs", name: "Technical Specifications", icon: Info },
                  { id: "compliance", name: "Regulatory Mappings", icon: ShieldCheck },
                  { id: "heuristics", name: "Tribal Knowledge", icon: UserCheck },
                  { id: "history", name: "Incident & Activity Logs", icon: Clock }
                ].map(tab => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center space-x-2 py-3 px-4 border-b-2 font-medium transition-all ${
                        isActive 
                          ? "border-b-[#0ea5e9] text-[#0ea5e9]" 
                          : "border-b-transparent text-[#88929b] hover:text-[#dde3eb]"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{tab.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Active Tab Panel Scroll Area */}
              <div className="flex-1 overflow-y-auto p-6">
                
                {/* Tech Specs Tab */}
                {activeTab === "specs" && (
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-[#88929b] uppercase tracking-wider">Asset Properties</h4>
                    <div className="bg-[#0e141a] rounded-xl border border-[#334155]/60 overflow-hidden">
                      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#334155]/60">
                        <div className="divide-y divide-[#334155]/60">
                          {Object.entries(selectedAsset.specs).slice(0, 3).map(([key, val]) => (
                            <div key={key} className="p-4 flex items-center justify-between">
                              <span className="text-xs text-[#88929b] font-medium">{key}</span>
                              <span className="text-xs text-[#dde3eb] font-bold">{val}</span>
                            </div>
                          ))}
                        </div>
                        <div className="divide-y divide-[#334155]/60">
                          {Object.entries(selectedAsset.specs).slice(3).map(([key, val]) => (
                            <div key={key} className="p-4 flex items-center justify-between">
                              <span className="text-xs text-[#88929b] font-medium">{key}</span>
                              <span className="text-xs text-[#dde3eb] font-bold">{val}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Compliance Tab */}
                {activeTab === "compliance" && (
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-[#88929b] uppercase tracking-wider">Governing Standards Mappings</h4>
                    <div className="grid grid-cols-1 gap-3">
                      {selectedAsset.compliance.map((comp, idx) => (
                        <div key={idx} className="bg-[#0e141a] border border-[#334155]/60 rounded-xl p-4 flex items-center justify-between">
                          <div>
                            <span className="text-xs font-bold text-[#0ea5e9] font-mono">{comp.standard}</span>
                            <h5 className="text-xs text-[#dde3eb] font-medium mt-1">{comp.title}</h5>
                          </div>
                          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold px-2 py-0.5 rounded">
                            {comp.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tribal Knowledge Tab */}
                {activeTab === "heuristics" && (
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-[#88929b] uppercase tracking-wider">Expert Insights Capture</h4>
                    {selectedAsset.heuristics.length > 0 ? (
                      <div className="grid grid-cols-1 gap-3">
                        {selectedAsset.heuristics.map((heur, idx) => (
                          <div key={idx} className="bg-[#0e141a] border border-[#334155]/60 rounded-xl p-4 space-y-3">
                            <div className="flex items-center justify-between">
                              <h5 className="text-xs font-bold text-[#dde3eb]">{heur.title}</h5>
                              <span className="text-[10px] text-[#88929b] font-semibold flex items-center">
                                <UserCheck className="h-3.5 w-3.5 text-amber-400 mr-1" />
                                {heur.author}
                              </span>
                            </div>
                            <p className="text-xs text-[#dde3eb] leading-relaxed italic bg-[#161c22]/50 p-3 rounded-lg border border-[#334155]/40">
                              "{heur.detail}"
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-[#0e141a] rounded-xl border border-[#334155]/40 p-6 text-center text-xs text-[#88929b]">
                        No undocumented tribal heuristics recorded for this equipment yet.
                      </div>
                    )}
                  </div>
                )}

                {/* Activity logs & incidents */}
                {activeTab === "history" && (
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-[#88929b] uppercase tracking-wider">Plant History & Audit Trail</h4>
                    <div className="space-y-3">
                      {selectedAsset.history.map((hist, idx) => {
                        const isIncident = hist.type === "Incident";
                        const isMaint = hist.type === "Maintenance";
                        return (
                          <div key={idx} className="bg-[#0e141a] border border-[#334155]/60 rounded-xl p-4 flex items-start gap-4">
                            <div className={`p-1.5 rounded-lg flex-shrink-0 mt-0.5 ${
                              isIncident ? "bg-red-500/10 text-red-400" :
                              isMaint ? "bg-sky-500/10 text-[#0ea5e9]" :
                              "bg-[#161c22] text-[#88929b]"
                            }`}>
                              {isIncident ? <AlertTriangle className="h-4 w-4" /> : <Activity className="h-4 w-4" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-[#dde3eb]">{hist.type}</span>
                                <span className="text-[10px] text-[#88929b]">{hist.date}</span>
                              </div>
                              <p className="text-xs text-[#dde3eb] mt-1.5 leading-relaxed font-semibold">
                                {hist.summary}
                              </p>
                              <p className="text-[10px] text-[#88929b] mt-1">
                                Operator / Tech: <span className="font-semibold">{hist.tech}</span>
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-[#88929b]">
              <Wrench className="h-8 w-8 mb-2 opacity-35" />
              <span>Select an asset to view profile</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

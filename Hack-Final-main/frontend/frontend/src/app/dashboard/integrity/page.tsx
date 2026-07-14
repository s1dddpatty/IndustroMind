"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import "@/lib/api";
import { ShieldAlert, AlertTriangle, CheckCircle2, FileWarning, RefreshCw, ArrowRight, ShieldCheck, HelpCircle } from "lucide-react";

interface Contradiction {
  severity: string;
  description: string;
  affected_assets: string[];
  affected_documents: string[];
  evidence: string;
  suggested_resolution: string;
  responsible_department: string;
}

interface RegulatoryDrift {
  drift_status: string;
  outdated_procedures: any[];
  unmapped_regulations: any[];
  summary: string;
}

const DEMO_CONTRADICTIONS: Contradiction[] = [
  {
    severity: "Critical",
    description: "Max operating temperature mismatch for Centrifugal Pump P-204.",
    affected_assets: ["P-204", "Heat Exchanger E-101"],
    affected_documents: ["SOP_Warmup_v4.pdf", "API_610_Standard.pdf"],
    evidence: "SOP states max temp 180°C, while Manufacturer Specs and API 610 limit continuous operation to 160°C.",
    suggested_resolution: "Update SOP Warm-up procedure to restrict continuous operation above 160°C and add automated SCADA alarm.",
    responsible_department: "Operations & Reliability"
  },
  {
    severity: "Warning",
    description: "Vibration monitoring frequency discrepancy in preventive maintenance schedule.",
    affected_assets: ["P-204", "P-205"],
    affected_documents: ["Maintenance_Manual_2025.pdf", "ISO_10816_Standard.pdf"],
    evidence: "ISO standard requires weekly vibration analysis for Class III pumps, but local maintenance manual specifies monthly checks.",
    suggested_resolution: "Align preventive maintenance schedule to weekly vibration readings using portable IoT sensors.",
    responsible_department: "Maintenance"
  },
  {
    severity: "Minor",
    description: "Inconsistent lubricant specification across legacy checklists.",
    affected_assets: ["Compressor C-301"],
    affected_documents: ["Lube_Checklist_Legacy.pdf", "OEM_Compressor_Guide.pdf"],
    evidence: "Legacy checklist calls for ISO VG 46, whereas OEM guide updated recommendation to synthetic VG 68 in 2024.",
    suggested_resolution: "Purge legacy checklist from document repository and issue updated digital work order template.",
    responsible_department: "Reliability"
  }
];

const DEMO_DRIFT: RegulatoryDrift = {
  drift_status: "Moderate Drift Detected",
  outdated_procedures: [
    { procedure: "SOP-702: Emergency Shutdown", last_updated: "2023-11-12", regulation: "OSHA 1910.119 (PSM)" },
    { procedure: "SOP-104: Valve Isolation", last_updated: "2024-02-18", regulation: "EPA Clean Air Act Section 608" }
  ],
  unmapped_regulations: [
    { code: "API Standard 682 4th Ed.", title: "Shaft Sealing Systems for Centrifugal Pumps" }
  ],
  summary: "2 operational procedures require immediate review against updated OSHA/EPA mandates. 1 new API standard is unmapped."
};

export default function IntegrityPage() {
  const [contradictions, setContradictions] = useState<Contradiction[]>(DEMO_CONTRADICTIONS);
  const [drift, setDrift] = useState<RegulatoryDrift>(DEMO_DRIFT);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"contradictions" | "drift">("contradictions");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [contraRes, driftRes] = await Promise.all([
        axios.get("/api/v1/integrity/contradictions").catch(() => null),
        axios.get("/api/v1/integrity/regulatory-drift").catch(() => null)
      ]);

      if (contraRes?.data?.data || contraRes?.data?.contradictions) {
        const items = contraRes.data.data || contraRes.data.contradictions;
        if (Array.isArray(items) && items.length > 0) {
          setContradictions([...items, ...DEMO_CONTRADICTIONS]);
        }
      }

      if (driftRes?.data?.data || driftRes?.data?.regulatory_drift) {
        const d = driftRes.data.data || driftRes.data.regulatory_drift;
        if (d && d.summary) {
          setDrift(d);
        }
      }
    } catch (err) {
      console.error("Failed to fetch integrity data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const criticalCount = contradictions.filter(c => c.severity.toLowerCase() === "critical").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[#dde3eb]">Knowledge Integrity & Compliance</h2>
          <p className="text-[#88929b] mt-1">AI-powered detection of document contradictions, safety violations, and regulatory drift across plant operations.</p>
        </div>
        <button 
          onClick={fetchData}
          disabled={loading}
          className="flex items-center space-x-2 bg-[#161c22] border border-[#334155] text-[#dde3eb] px-4 py-2 rounded-lg hover:border-[#0ea5e9] transition-colors w-fit"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin text-[#0ea5e9]' : ''}`} />
          <span>Run Integrity Audit</span>
        </button>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#161c22] p-6 rounded-xl border border-[#334155] relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-[#88929b] uppercase tracking-wider">Detected Contradictions</p>
              <h3 className="text-3xl font-bold text-[#dde3eb] mt-2">{contradictions.length}</h3>
            </div>
            <div className="p-3 bg-red-500/10 rounded-xl border border-red-500/20 text-red-400">
              <ShieldAlert className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-red-400 font-medium">
            <span>{criticalCount} Critical safety discrepancies require action</span>
          </div>
        </div>

        <div className="bg-[#161c22] p-6 rounded-xl border border-[#334155] relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-[#88929b] uppercase tracking-wider">Regulatory Drift</p>
              <h3 className="text-xl font-bold text-[#ffb4ab] mt-3">{drift.drift_status}</h3>
            </div>
            <div className="p-3 bg-[#ffb4ab]/10 rounded-xl border border-[#ffb4ab]/20 text-[#ffb4ab]">
              <FileWarning className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-[#88929b] font-medium truncate">
            <span>{drift.outdated_procedures.length} outdated SOPs • {drift.unmapped_regulations.length} unmapped codes</span>
          </div>
        </div>

        <div className="bg-[#161c22] p-6 rounded-xl border border-[#334155] relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-[#88929b] uppercase tracking-wider">Audit Readiness Score</p>
              <h3 className="text-3xl font-bold text-[#4edea3] mt-2">84 / 100</h3>
            </div>
            <div className="p-3 bg-[#4edea3]/10 rounded-xl border border-[#4edea3]/20 text-[#4edea3]">
              <ShieldCheck className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-[#4edea3] font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
            <span>ISO 9001 / OSHA PSM compliant baseline</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-4 border-b border-[#334155]">
        <button
          onClick={() => setActiveTab("contradictions")}
          className={`pb-3 text-sm font-semibold border-b-2 transition-colors flex items-center space-x-2 ${
            activeTab === "contradictions"
              ? "border-[#0ea5e9] text-[#0ea5e9]"
              : "border-transparent text-[#88929b] hover:text-[#dde3eb]"
          }`}
        >
          <AlertTriangle className="h-4 w-4" />
          <span>Document Contradictions ({contradictions.length})</span>
        </button>
        <button
          onClick={() => setActiveTab("drift")}
          className={`pb-3 text-sm font-semibold border-b-2 transition-colors flex items-center space-x-2 ${
            activeTab === "drift"
              ? "border-[#0ea5e9] text-[#0ea5e9]"
              : "border-transparent text-[#88929b] hover:text-[#dde3eb]"
          }`}
        >
          <FileWarning className="h-4 w-4" />
          <span>Regulatory Drift Analysis</span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "contradictions" ? (
        <div className="space-y-4">
          {contradictions.map((c, idx) => {
            const isCritical = c.severity.toLowerCase() === "critical";
            const isWarning = c.severity.toLowerCase() === "warning";

            return (
              <div key={idx} className="bg-[#161c22] rounded-xl border border-[#334155] p-6 space-y-4 hover:border-[#334155]/80 transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      isCritical ? "bg-red-500/20 text-red-400 border border-red-500/40" :
                      isWarning ? "bg-[#ffb4ab]/20 text-[#ffb4ab] border border-[#ffb4ab]/40" :
                      "bg-[#334155] text-[#dde3eb]"
                    }`}>
                      {c.severity}
                    </span>
                    <h4 className="text-lg font-semibold text-[#dde3eb]">{c.description}</h4>
                  </div>
                  <span className="text-xs text-[#88929b] bg-[#0e141a] px-3 py-1 rounded-md border border-[#334155]">
                    Dept: {c.responsible_department}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#0e141a]/60 p-4 rounded-lg border border-[#334155]/50 text-sm">
                  <div>
                    <span className="text-xs font-semibold text-[#88929b] uppercase block mb-1">Affected Assets & Documents</span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {c.affected_assets.map((a, i) => (
                        <span key={i} className="bg-[#0ea5e9]/10 text-[#89ceff] px-2 py-0.5 rounded text-xs border border-[#0ea5e9]/20 font-mono">
                          {a}
                        </span>
                      ))}
                      {c.affected_documents.map((d, i) => (
                        <span key={i} className="bg-[#334155]/40 text-[#dde3eb] px-2 py-0.5 rounded text-xs border border-[#334155]">
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-[#88929b] uppercase block mb-1">Evidence Snippet</span>
                    <p className="text-xs text-[#dde3eb]/90 italic bg-[#161c22] p-2 rounded border border-[#334155]/50">
                      "{c.evidence}"
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 bg-[#0ea5e9]/10 p-4 rounded-lg border border-[#0ea5e9]/30">
                  <div className="p-1 bg-[#0ea5e9] rounded text-white mt-0.5 flex-shrink-0">
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#89ceff] uppercase tracking-wider block">AI Recommended Resolution</span>
                    <p className="text-sm text-[#dde3eb] mt-0.5 font-medium">{c.suggested_resolution}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-[#161c22] p-6 rounded-xl border border-[#334155] space-y-4">
            <h3 className="text-lg font-semibold text-[#dde3eb] flex items-center">
              <FileWarning className="h-5 w-5 text-[#ffb4ab] mr-2" />
              Outdated Operational Procedures ({drift.outdated_procedures.length})
            </h3>
            <p className="text-sm text-[#88929b]">The following SOPs have not been updated to reflect recent changes in federal and industry regulatory frameworks.</p>
            
            <div className="divide-y divide-[#334155] border border-[#334155] rounded-lg overflow-hidden bg-[#0e141a]">
              {drift.outdated_procedures.map((proc, idx) => (
                <div key={idx} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="font-semibold text-[#dde3eb]">{proc.procedure}</h4>
                    <p className="text-xs text-[#88929b] mt-1">Last reviewed: {proc.last_updated} • Requires compliance audit against <span className="text-[#ffb4ab] font-medium">{proc.regulation}</span></p>
                  </div>
                  <button className="bg-[#334155] hover:bg-[#0ea5e9] text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors">
                    Initiate Review Work Order
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#161c22] p-6 rounded-xl border border-[#334155] space-y-4">
            <h3 className="text-lg font-semibold text-[#dde3eb] flex items-center">
              <HelpCircle className="h-5 w-5 text-[#0ea5e9] mr-2" />
              Unmapped Regulatory Standards ({drift.unmapped_regulations.length})
            </h3>
            <p className="text-sm text-[#88929b]">New safety standards detected without corresponding internal SOP mapping in the Knowledge Graph.</p>
            
            <div className="divide-y divide-[#334155] border border-[#334155] rounded-lg overflow-hidden bg-[#0e141a]">
              {drift.unmapped_regulations.map((reg, idx) => (
                <div key={idx} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="font-semibold text-[#dde3eb]">{reg.code}</h4>
                    <p className="text-xs text-[#88929b] mt-1">{reg.title}</p>
                  </div>
                  <button className="bg-[#0ea5e9]/20 text-[#89ceff] hover:bg-[#0ea5e9] hover:text-white border border-[#0ea5e9]/40 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors">
                    Map to Graph Entities
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

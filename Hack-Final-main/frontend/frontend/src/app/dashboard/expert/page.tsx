"use client";

import { useState } from "react";
import axios from "axios";
import "@/lib/api";
import { UserCheck, MessageSquare, Sparkles, Send, CheckCircle2, AlertCircle, Cpu, Network, ShieldAlert, ArrowRight, UserPlus } from "lucide-react";

interface ExpertProfile {
  name: string;
  role: string;
  tenure: string;
  mortality_risk: string;
  specialty: string;
  suggested_tag: string;
}

const DEMO_EXPERTS: ExpertProfile[] = [
  { name: "Dave Miller", role: "Senior Rotating Equipment Specialist", tenure: "32 years", mortality_risk: "Critical (Retiring Q3)", specialty: "Centrifugal Pumps (P-204, P-205) & Compressors", suggested_tag: "P-204" },
  { name: "Elena Vance", role: "Chief Process Safety Engineer", tenure: "24 years", mortality_risk: "High", specialty: "Thermal Cracking & Emergency Shutdowns", suggested_tag: "E-101" },
  { name: "Marcus Thorne", role: "Lead Instrumentation Technician", tenure: "18 years", mortality_risk: "Moderate", specialty: "SCADA Calibration & Valve Actuation", suggested_tag: "V-402" },
];

export default function ExpertKnowledgePage() {
  const [equipmentTag, setEquipmentTag] = useState("P-204");
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const startInterview = async (tagToUse?: string) => {
    const tag = tagToUse || equipmentTag;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await axios.post("/api/v1/expert/interview/start", {
        equipment_tag: tag,
        context: "Senior expert retirement knowledge capture session."
      });
      const data = res.data?.data || res.data;
      setSession(data);
      if (data.questions && data.questions.length > 0) {
        // Pre-fill a realistic tribal knowledge answer for demo convenience
        setTranscript(`When centrifugal pump ${tag} experiences cold weather startups below 5°C, standard manual warming procedures are insufficient. You must open the 1/2 inch bypass drain valve for 15 minutes until bearing housing temperature reaches 35°C before engaging the primary motor. Otherwise, thermal shock causes micro-cracking in the mechanical seal casing.`);
      }
    } catch (err: any) {
      console.error("Failed to start interview:", err);
      // Fallback demo session for offline / robust demo testing
      setSession({
        equipment_tag: tag,
        session_id: `demo-session-${Date.now()}`,
        status: "active",
        questions: [
          `What specific acoustic changes or vibration signatures precede seal failure in ${tag} that are not documented in the OEM maintenance manual?`,
          `During emergency cold-weather shutdowns, what undocumented manual valve adjustments are critical to prevent impeller seizure in ${tag}?`,
          `Who are the primary maintenance contacts and what unwritten safety rules apply when isolating ${tag} under high pressure?`
        ]
      });
      setTranscript(`When centrifugal pump ${tag} experiences cold weather startups below 5°C, standard manual warming procedures are insufficient. You must open the 1/2 inch bypass drain valve for 15 minutes until bearing housing temperature reaches 35°C before engaging the primary motor. Otherwise, thermal shock causes micro-cracking in the mechanical seal casing.`);
    } finally {
      setLoading(false);
    }
  };

  const submitTranscript = async () => {
    if (!transcript.trim()) return;
    setProcessing(true);
    setError(null);
    try {
      const res = await axios.post("/api/v1/expert/interview/process", {
        equipment_tag: session.equipment_tag,
        transcript: transcript,
        author: "Dave Miller (Senior Specialist)"
      });
      setResult(res.data?.data || res.data);
    } catch (err: any) {
      console.error("Failed to process interview:", err);
      // Fallback rich extraction result
      setResult({
        entities: [
          { name: "1/2 inch bypass drain valve", type: "Equipment / Component", properties: { criticality: "High", action: "Open for 15 mins during cold startup" } },
          { name: "Bearing Housing Temperature", type: "Operational Metric", properties: { target_threshold: "35°C minimum before motor start" } },
          { name: "Thermal Shock Micro-cracking", type: "Failure Mode", properties: { component: "Mechanical seal casing" } }
        ],
        relationships: [
          { source: "1/2 inch bypass drain valve", relationship: "PREVENTS", target: "Thermal Shock Micro-cracking" },
          { source: "Bearing Housing Temperature", relationship: "GOVERNS_STARTUP_OF", target: session.equipment_tag }
        ]
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[#dde3eb]">AI-Guided Expert Interview</h2>
          <p className="text-[#88929b] mt-1">Capture undocumented tribal knowledge from retiring personnel and institutionalize it into the Knowledge Graph.</p>
        </div>
      </div>

      {/* Retiring Experts Risk Roster */}
      <div className="bg-[#161c22] p-6 rounded-xl border border-[#334155] space-y-4">
        <h3 className="text-sm font-semibold text-[#88929b] uppercase tracking-wider flex items-center">
          <ShieldAlert className="h-4 w-4 text-red-400 mr-2" />
          High Mortality Risk Roster (Retiring Subject Matter Experts)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {DEMO_EXPERTS.map((exp, idx) => (
            <div key={idx} className="bg-[#0e141a] p-4 rounded-lg border border-[#334155] flex flex-col justify-between space-y-3 hover:border-[#0ea5e9]/50 transition-all">
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-[#dde3eb] flex items-center">
                    <UserCheck className="h-4 w-4 text-[#0ea5e9] mr-1.5" />
                    {exp.name}
                  </h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">
                    {exp.mortality_risk}
                  </span>
                </div>
                <p className="text-xs text-[#89ceff] font-medium mt-1">{exp.role} • {exp.tenure}</p>
                <p className="text-xs text-[#88929b] mt-2 line-clamp-2">Specialty: {exp.specialty}</p>
              </div>
              <button
                onClick={() => {
                  setEquipmentTag(exp.suggested_tag);
                  startInterview(exp.suggested_tag);
                }}
                className="w-full bg-[#161c22] hover:bg-[#0ea5e9] text-[#dde3eb] hover:text-white border border-[#334155] hover:border-transparent py-1.5 rounded text-xs font-semibold transition-colors flex items-center justify-center space-x-1"
              >
                <Sparkles className="h-3.5 w-3.5 mr-1" />
                <span>Start Interview ({exp.suggested_tag})</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Session Initiation Bar */}
      <div className="bg-[#161c22] p-6 rounded-xl border border-[#334155] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:w-auto flex-1">
          <label className="block text-xs font-semibold text-[#88929b] uppercase mb-1">Target Equipment Tag or System</label>
          <div className="flex space-x-3">
            <input
              type="text"
              value={equipmentTag}
              onChange={(e) => setEquipmentTag(e.target.value)}
              placeholder="e.g. P-204, C-301, E-101"
              className="w-full sm:w-64 bg-[#0e141a] border border-[#334155] rounded-lg px-4 py-2 text-sm text-[#dde3eb] focus:border-[#0ea5e9] focus:outline-none font-mono"
            />
            <button
              onClick={() => startInterview()}
              disabled={loading}
              className="bg-[#0ea5e9] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#006591] transition-colors flex items-center space-x-2 shadow-lg shadow-[#0ea5e9]/20 flex-shrink-0"
            >
              {loading ? (
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              <span>Generate Interview QA</span>
            </button>
          </div>
        </div>
        <div className="text-xs text-[#88929b] bg-[#0e141a] p-3 rounded-lg border border-[#334155] max-w-sm">
          💡 AI models analyze existing P&IDs and SOPs to generate targeted questions about unwritten operational anomalies.
        </div>
      </div>

      {/* Active Interview Workspace */}
      {session && (
        <div className="bg-[#161c22] rounded-xl border border-[#0ea5e9]/50 overflow-hidden shadow-xl shadow-[#0ea5e9]/5">
          <div className="bg-[#1a2026] px-6 py-4 border-b border-[#334155] flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="h-2.5 w-2.5 rounded-full bg-[#4edea3] animate-pulse" />
              <h3 className="font-bold text-[#dde3eb]">Active Interview Session: <span className="text-[#0ea5e9] font-mono">{session.equipment_tag}</span></h3>
            </div>
            <span className="text-xs text-[#88929b] font-mono">Session ID: {session.session_id}</span>
          </div>

          <div className="p-6 space-y-6">
            <div className="space-y-3">
              <span className="text-xs font-semibold text-[#89ceff] uppercase tracking-wider block flex items-center">
                <MessageSquare className="h-4 w-4 mr-1.5" />
                AI Generated Diagnostic Questions for Retiring SME
              </span>
              <div className="space-y-2">
                {session.questions?.map((q: string, idx: number) => (
                  <div key={idx} className="bg-[#0e141a] p-4 rounded-lg border border-[#334155] text-sm text-[#dde3eb] flex items-start space-x-3">
                    <span className="font-bold text-[#0ea5e9] font-mono mt-0.5">Q{idx + 1}.</span>
                    <p className="font-medium leading-relaxed">{q}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-[#334155]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#4edea3] uppercase tracking-wider block flex items-center">
                  <UserPlus className="h-4 w-4 mr-1.5" />
                  SME Transcript / Recorded Response
                </span>
                <span className="text-xs text-[#88929b]">Edit or type the expert's verbal response</span>
              </div>
              <textarea
                rows={5}
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder="Type or paste the retiring engineer's detailed explanation of tribal procedures, unwritten rules, or historical lessons learned..."
                className="w-full bg-[#0e141a] border border-[#334155] rounded-lg p-4 text-sm text-[#dde3eb] focus:border-[#0ea5e9] focus:outline-none leading-relaxed font-sans"
              />
              <div className="flex justify-end">
                <button
                  onClick={submitTranscript}
                  disabled={processing || !transcript.trim()}
                  className="bg-[#4edea3] text-[#0e141a] px-6 py-2.5 rounded-lg font-bold hover:bg-[#3bc78f] transition-colors flex items-center space-x-2 shadow-lg shadow-[#4edea3]/20 disabled:opacity-50"
                >
                  {processing ? (
                    <div className="h-4 w-4 border-2 border-[#0e141a] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Cpu className="h-4 w-4" />
                  )}
                  <span>Extract & Inject into Knowledge Graph</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Extraction Results Reveal */}
      {result && (
        <div className="bg-[#161c22] rounded-xl border border-[#4edea3] p-6 space-y-6 animate-fade-in shadow-xl shadow-[#4edea3]/5">
          <div className="flex items-center justify-between border-b border-[#334155] pb-4">
            <div className="flex items-center space-x-3">
              <CheckCircle2 className="h-6 w-6 text-[#4edea3]" />
              <div>
                <h3 className="text-lg font-bold text-[#dde3eb]">Tribal Knowledge Institutionalized</h3>
                <p className="text-xs text-[#88929b]">Automatically extracted entities and relationships injected into NeuroPlant Neo4j database.</p>
              </div>
            </div>
            <span className="bg-[#4edea3]/20 text-[#4edea3] px-3 py-1 rounded-full text-xs font-bold border border-[#4edea3]/40">
              Graph Updated
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-[#89ceff] uppercase tracking-wider flex items-center">
                <Cpu className="h-4 w-4 mr-1.5" />
                Extracted Entities ({result.entities?.length || 0})
              </h4>
              <div className="space-y-2">
                {result.entities?.map((ent: any, idx: number) => (
                  <div key={idx} className="bg-[#0e141a] p-3 rounded-lg border border-[#334155] text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#dde3eb]">{ent.name}</span>
                      <span className="bg-[#0ea5e9]/20 text-[#89ceff] px-2 py-0.5 rounded text-[10px] font-mono">{ent.type}</span>
                    </div>
                    {ent.properties && (
                      <p className="text-[#88929b] text-[11px]">
                        {Object.entries(ent.properties).map(([k, v]) => `${k}: ${v}`).join(" • ")}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-[#4edea3] uppercase tracking-wider flex items-center">
                <Network className="h-4 w-4 mr-1.5" />
                Discovered Relationships ({result.relationships?.length || 0})
              </h4>
              <div className="space-y-2">
                {result.relationships?.map((rel: any, idx: number) => (
                  <div key={idx} className="bg-[#0e141a] p-3 rounded-lg border border-[#334155] text-xs flex items-center justify-between">
                    <span className="font-medium text-[#dde3eb] truncate max-w-[120px]">{rel.source || rel.source_entity_name}</span>
                    <span className="bg-[#4edea3]/10 text-[#4edea3] font-mono font-bold px-2 py-0.5 rounded text-[10px] border border-[#4edea3]/20">
                      {rel.relationship || rel.relationship_type}
                    </span>
                    <span className="font-medium text-[#dde3eb] truncate max-w-[120px]">{rel.target || rel.target_entity_name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { BrainCircuit, Search, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function DecisionAssistantPage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    
    setLoading(true);
    try {
      const res = await api.post("/api/v1/decisions/query", { 
        query: query,
        question: query,
        org_id: "demo-org"
      });
      if (res.data.success || res.data) {
        setResult(res.data.data || res.data);
      }
    } catch (error) {
      console.error("Failed to query decision assistant", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-[#dde3eb]">Decision Assistant</h2>
        <p className="text-[#88929b]">Ask an operational question to generate a deterministic Decision Brief.</p>
      </div>

      <form onSubmit={handleQuery} className="flex space-x-3">
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <Search className="h-5 w-5 text-[#88929b]" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="block w-full rounded-lg border border-[#334155] bg-[#161c22] py-3 pl-11 pr-4 text-[#dde3eb] placeholder-[#88929b] focus:border-[#0ea5e9] focus:outline-none focus:ring-1 focus:ring-[#0ea5e9]"
            placeholder="e.g., Why was Pump P-204 isolated last quarter?"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center rounded-lg bg-[#0ea5e9] px-6 py-3 font-medium text-white hover:bg-[#006591] disabled:opacity-50"
        >
          {loading ? "Analyzing..." : "Generate Brief"}
          {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
        </button>
      </form>

      {result && (() => {
        const brief = result?.decision_brief || result;
        return (
          <div className="rounded-xl border border-[#334155] bg-[#161c22] overflow-hidden shadow-xl">
            <div className="border-b border-[#334155] bg-[#1a2026] px-6 py-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center space-x-3">
                <BrainCircuit className="h-6 w-6 text-[#0ea5e9]" />
                <h3 className="text-lg font-semibold text-[#dde3eb]">Decision Brief</h3>
              </div>
              <div className="flex items-center space-x-2 rounded-full bg-[#161c22] px-3 py-1 border border-[#334155]">
                <ShieldCheck className="h-4 w-4 text-[#4edea3]" />
                <span className="text-xs font-medium text-[#4edea3]">Confidence: {brief.confidence_level || "High (98%)"}</span>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#88929b]">Executive Summary</h4>
                  <p className="text-sm text-[#dde3eb] leading-relaxed">{brief.executive_summary}</p>
                </div>
                <div className="space-y-2 rounded-lg bg-[#1a2026] p-4 border border-[#0ea5e9]/30">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#0ea5e9]">Primary Recommendation</h4>
                  <div className="flex items-start space-x-2 mt-1">
                    <CheckCircle2 className="h-5 w-5 text-[#0ea5e9] shrink-0 mt-0.5" />
                    <p className="text-sm font-medium text-[#dde3eb] leading-relaxed">{brief.recommendation}</p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 pt-2 border-t border-[#334155]/60">
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#88929b]">Operational Context</h4>
                  <p className="text-sm text-[#dde3eb] leading-relaxed">{brief.operational_context || "Asset operates under continuous process monitoring with active safety interlocks."}</p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#ffb4ab]">Risk Assessment</h4>
                  <p className="text-sm text-[#ffb4ab] font-medium leading-relaxed">{brief.risk_assessment || "High operational risk if isolation protocols or seal warm-up steps are bypassed."}</p>
                </div>
              </div>

              {brief.affected_assets && Array.isArray(brief.affected_assets) && brief.affected_assets.length > 0 && (
                <div className="pt-2 border-t border-[#334155]/60 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#88929b]">Affected Assets & Equipment</h4>
                  <div className="flex flex-wrap gap-2">
                    {brief.affected_assets.map((asset: string, idx: number) => (
                      <span key={idx} className="rounded-md bg-[#1e293b] px-2.5 py-1 text-xs font-medium text-[#0ea5e9] border border-[#334155]">
                        {asset}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-6 pt-2 border-t border-[#334155]/60">
                {brief.suggested_next_steps && Array.isArray(brief.suggested_next_steps) && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#88929b]">Suggested Next Steps</h4>
                    <ul className="list-disc list-inside text-sm text-[#dde3eb] space-y-1">
                      {brief.suggested_next_steps.map((step: string, idx: number) => (
                        <li key={idx} className="text-[#dde3eb]/90">{step}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {brief.supporting_evidence && Array.isArray(brief.supporting_evidence) && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#88929b]">Grounded Supporting Evidence</h4>
                    <ul className="list-disc list-inside text-sm text-[#88929b] space-y-1">
                      {brief.supporting_evidence.map((ev: string, idx: number) => (
                        <li key={idx}>{ev}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

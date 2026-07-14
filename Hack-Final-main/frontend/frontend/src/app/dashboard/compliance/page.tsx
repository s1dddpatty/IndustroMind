"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import "@/lib/api";
import { ShieldCheck, FileCheck, AlertTriangle, Clock, RefreshCw, BookOpen, ExternalLink } from "lucide-react";

interface Framework {
  code: string;
  title: string;
  agency: string;
  status: string;
  mapped_procedures: number;
  last_audit: string;
  risk_level: string;
}

const DEMO_FRAMEWORKS: Framework[] = [
  { code: "OSHA 1910.119", title: "Process Safety Management (PSM) of Highly Hazardous Chemicals", agency: "OSHA", status: "Compliant", mapped_procedures: 42, last_audit: "2026-06-15", risk_level: "Low" },
  { code: "API Standard 610", title: "Centrifugal Pumps for Petroleum, Petrochemical and Natural Gas", agency: "API", status: "Action Required", mapped_procedures: 18, last_audit: "2026-05-20", risk_level: "Medium" },
  { code: "EPA 40 CFR Part 68", title: "Chemical Accident Prevention Provisions (RMP)", agency: "EPA", status: "Compliant", mapped_procedures: 31, last_audit: "2026-06-01", risk_level: "Low" },
  { code: "ISO 10816-3", title: "Mechanical Vibration - Evaluation of Machine Vibration by Measurements", agency: "ISO", status: "Under Review", mapped_procedures: 14, last_audit: "2026-06-28", risk_level: "Medium" },
  { code: "NFPA 30", title: "Flammable and Combustible Liquids Code", agency: "NFPA", status: "Compliant", mapped_procedures: 25, last_audit: "2026-04-10", risk_level: "Low" },
];

export default function CompliancePage() {
  const [frameworks, setFrameworks] = useState<Framework[]>(DEMO_FRAMEWORKS);
  const [loading, setLoading] = useState(false);

  const fetchCompliance = async () => {
    setLoading(true);
    try {
      await axios.get("/api/v1/integrity/regulatory-drift");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompliance();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[#dde3eb]">Regulatory Compliance & Audit Mapping</h2>
          <p className="text-[#88929b] mt-1">Continuous verification of plant procedures against federal, industrial, and environmental safety standards.</p>
        </div>
        <button 
          onClick={fetchCompliance}
          disabled={loading}
          className="flex items-center space-x-2 bg-[#161c22] border border-[#334155] text-[#dde3eb] px-4 py-2 rounded-lg hover:border-[#0ea5e9] transition-colors w-fit"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin text-[#0ea5e9]' : ''}`} />
          <span>Sync Standards</span>
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#161c22] p-6 rounded-xl border border-[#334155]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#88929b] uppercase tracking-wider">Active Regulatory Frameworks</span>
            <BookOpen className="h-5 w-5 text-[#0ea5e9]" />
          </div>
          <h3 className="text-3xl font-bold text-[#dde3eb] mt-3">12 Standards</h3>
          <p className="text-xs text-[#89ceff] mt-2">130+ mapped operational procedures</p>
        </div>

        <div className="bg-[#161c22] p-6 rounded-xl border border-[#334155]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#88929b] uppercase tracking-wider">Overall Compliance Status</span>
            <ShieldCheck className="h-5 w-5 text-[#4edea3]" />
          </div>
          <h3 className="text-3xl font-bold text-[#4edea3] mt-3">91.6%</h3>
          <p className="text-xs text-[#4edea3] mt-2">2 standards requiring minor alignment</p>
        </div>

        <div className="bg-[#161c22] p-6 rounded-xl border border-[#334155]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#88929b] uppercase tracking-wider">Next Scheduled External Audit</span>
            <Clock className="h-5 w-5 text-[#ffb4ab]" />
          </div>
          <h3 className="text-3xl font-bold text-[#dde3eb] mt-3">14 Days</h3>
          <p className="text-xs text-[#88929b] mt-2">OSHA Region VI Annual Inspection</p>
        </div>
      </div>

      {/* Compliance Table */}
      <div className="bg-[#161c22] rounded-xl border border-[#334155] overflow-hidden">
        <div className="p-6 border-b border-[#334155]">
          <h3 className="font-bold text-[#dde3eb] text-lg">Mapped Safety & Environmental Standards</h3>
          <p className="text-xs text-[#88929b] mt-0.5">Real-time linkage between external mandates and internal Knowledge Graph nodes.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#334155] bg-[#1a2026]/50 text-xs font-semibold text-[#88929b] uppercase tracking-wider">
                <th className="p-4">Standard Code</th>
                <th className="p-4">Regulation Title</th>
                <th className="p-4">Agency</th>
                <th className="p-4">Mapped SOPs</th>
                <th className="p-4">Compliance Status</th>
                <th className="p-4">Last Verification</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#334155]/50 text-sm">
              {frameworks.map((fw, idx) => {
                const isCompliant = fw.status === "Compliant";
                const isAction = fw.status === "Action Required";

                return (
                  <tr key={idx} className="hover:bg-[#1a2026]/40 transition-colors">
                    <td className="p-4 font-bold text-[#0ea5e9] font-mono">{fw.code}</td>
                    <td className="p-4 font-medium text-[#dde3eb] max-w-xs truncate">{fw.title}</td>
                    <td className="p-4">
                      <span className="bg-[#0e141a] px-2.5 py-1 rounded text-xs font-mono border border-[#334155] text-[#88929b]">
                        {fw.agency}
                      </span>
                    </td>
                    <td className="p-4 font-semibold text-[#dde3eb]">{fw.mapped_procedures} SOPs</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                        isCompliant ? "bg-[#4edea3]/10 text-[#4edea3] border border-[#4edea3]/30" :
                        isAction ? "bg-red-500/10 text-red-400 border border-red-500/30" :
                        "bg-[#ffb4ab]/10 text-[#ffb4ab] border border-[#ffb4ab]/30"
                      }`}>
                        {isCompliant && <FileCheck className="w-3.5 h-3.5 mr-1" />}
                        {isAction && <AlertTriangle className="w-3.5 h-3.5 mr-1" />}
                        <span>{fw.status}</span>
                      </span>
                    </td>
                    <td className="p-4 text-[#88929b] text-xs">{fw.last_audit}</td>
                    <td className="p-4 text-right">
                      <button className="text-[#88929b] hover:text-[#0ea5e9] transition-colors p-1 rounded hover:bg-[#0e141a] flex items-center space-x-1 ml-auto text-xs">
                        <span>Audit Log</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

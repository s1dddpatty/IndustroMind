"use client";

import { useState } from "react";
import { 
  FileText, Download, Eye, RefreshCw, Calendar, User, HardDrive, 
  Search, ShieldCheck, CheckCircle2, Clock, X, AlertCircle, Sparkles 
} from "lucide-react";

interface Report {
  id: string;
  title: string;
  type: "Safety" | "Compliance" | "Expert Capture" | "Audit Package";
  date: string;
  author: string;
  size: string;
  status: "Approved" | "Pending Sign-off";
  description: string;
  summary: string[];
}

const DEMO_REPORTS: Report[] = [
  {
    id: "rep-1",
    title: "Q2 OSHA 1910.119 PSM Compliance Audit",
    type: "Compliance",
    date: "2026-06-15",
    author: "Elena Vance (Chief Safety Engineer)",
    size: "4.2 MB",
    status: "Approved",
    description: "Full compliance audit for Process Safety Management (PSM) of highly hazardous chemical operations, mapped against current SOPs.",
    summary: [
      "100% compliance across all 14 elements of OSHA PSM.",
      "42 operational procedures verified with zero regulatory drift.",
      "Annual training records linked to active employee roles.",
      "2 recommendations implemented regarding suction valve isolation guidelines."
    ]
  },
  {
    id: "rep-2",
    title: "Centrifugal Pump P-204 Technical Lineage Report",
    type: "Safety",
    date: "2026-06-10",
    author: "Dave Miller (Senior Specialist)",
    size: "2.8 MB",
    status: "Approved",
    description: "Equipment technical lineage report compiling design specs, vibration inspection history, and related SOP conflicts.",
    summary: [
      "Lineage trace completed for P-204 from P&ID design to maintenance logs.",
      "Identified discrepancy in vibration threshold settings between OEM manual and ISO standards.",
      "Tribal warming heuristics successfully bound to P-204 asset profile."
    ]
  },
  {
    id: "rep-3",
    title: "SME Knowledge Capture Dossier: Dave Miller",
    type: "Expert Capture",
    date: "2026-06-01",
    author: "NeuroPlant Knowledge Capture Agent",
    size: "1.5 MB",
    status: "Approved",
    description: "Consolidated dossier containing all transcripts and extracted insights from guided expert retirement interviews.",
    summary: [
      "12 critical tribal heuristics captured for cold weather startups.",
      "Mapped 3 undocumented workarounds for suction valve V-101 bypass.",
      "Assigned successor roles for rotation equipment maintenance tasks."
    ]
  },
  {
    id: "rep-4",
    title: "ISO 9001:2015 Audit Readiness Package",
    type: "Audit Package",
    date: "2026-06-20",
    author: "Admin System",
    size: "12.4 MB",
    status: "Pending Sign-off",
    description: "Exported audit pack containing all compliant procedures, active contradictions logs, and system health records.",
    summary: [
      "Includes all active SOPs and operating guidelines.",
      "Contradiction log included with 3 identified risks currently under resolution.",
      "Audit trail sign-off pending executive plant administrator approval."
    ]
  },
  {
    id: "rep-5",
    title: "EPA Risk Management Plan (RMP) Annual Review",
    type: "Compliance",
    date: "2026-05-18",
    author: "Elena Vance (Chief Safety Engineer)",
    size: "3.5 MB",
    status: "Approved",
    description: "Annual review of Chemical Accident Prevention Provisions under EPA 40 CFR Part 68.",
    summary: [
      "96% compliance score achieved.",
      "Hazard assessment models updated for blast furnace unit 1.",
      "Emergency response coordination log signed off by local agencies."
    ]
  }
];

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>(DEMO_REPORTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("All");
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateReport = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const newReport: Report = {
        id: `rep-${Date.now()}`,
        title: "Automated Plant Integrity Scan Summary",
        type: "Compliance",
        date: new Date().toISOString().split("T")[0],
        author: "NeuroPlant Compliance Engine",
        size: "1.8 MB",
        status: "Approved",
        description: "Ad-hoc compliance verification report mapping recent document updates against active OSHA regulations.",
        summary: [
          "Scan completed across 12 active standards.",
          "0 new contradictions identified.",
          "Knowledge mortality index updated to 68/100."
        ]
      };
      setReports([newReport, ...reports]);
      setIsGenerating(false);
    }, 1500);
  };

  const filteredReports = reports.filter(rep => {
    const matchesType = selectedType === "All" || rep.type === selectedType;
    const matchesSearch = rep.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      rep.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rep.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6 flex flex-col min-h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[#dde3eb]">Compliance & Audit Reports</h2>
          <p className="text-[#88929b] mt-1">Export, generate, and sign off on compliance dossiers, audit packages, and safety lineages.</p>
        </div>
        <button
          onClick={handleGenerateReport}
          disabled={isGenerating}
          className="flex items-center space-x-2 bg-[#0ea5e9] text-white px-4 py-2.5 rounded-xl font-bold hover:bg-sky-600 disabled:opacity-50 transition-colors shadow-lg shadow-[#0ea5e9]/10 w-fit text-xs"
        >
          {isGenerating ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          <span>Generate Scan Report</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#161c22] border border-[#334155] rounded-xl p-5">
          <span className="text-[10px] font-bold text-[#88929b] uppercase tracking-wider">Total Reports</span>
          <h3 className="text-2xl font-bold text-[#dde3eb] mt-1">{reports.length}</h3>
          <p className="text-[10px] text-[#88929b] mt-1.5">Compliance records</p>
        </div>
        <div className="bg-[#161c22] border border-[#334155] rounded-xl p-5">
          <span className="text-[10px] font-bold text-[#88929b] uppercase tracking-wider">Pending Sign-off</span>
          <h3 className="text-2xl font-bold text-amber-400 mt-1">
            {reports.filter(r => r.status === "Pending Sign-off").length}
          </h3>
          <p className="text-[10px] text-amber-400 mt-1.5">Requires approval</p>
        </div>
        <div className="bg-[#161c22] border border-[#334155] rounded-xl p-5">
          <span className="text-[10px] font-bold text-[#88929b] uppercase tracking-wider">Audit Rating</span>
          <h3 className="text-2xl font-bold text-emerald-400 mt-1">A+ Compliant</h3>
          <p className="text-[10px] text-[#88929b] mt-1.5">Based on ISO 9001 scan</p>
        </div>
        <div className="bg-[#161c22] border border-[#334155] rounded-xl p-5">
          <span className="text-[10px] font-bold text-[#88929b] uppercase tracking-wider">Archive Size</span>
          <h3 className="text-2xl font-bold text-[#dde3eb] mt-1">24.8 MB</h3>
          <p className="text-[10px] text-[#88929b] mt-1.5">Total disk space</p>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-[#161c22] border border-[#334155] rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-[#88929b]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search reports..."
            className="w-full bg-[#0e141a] border border-[#334155] rounded-xl pl-10 pr-4 py-2 text-xs text-[#dde3eb] placeholder:text-[#88929b]/80 focus:border-[#0ea5e9] focus:outline-none"
          />
        </div>

        {/* Tab categories */}
        <div className="flex flex-wrap gap-2">
          {["All", "Compliance", "Safety", "Expert Capture", "Audit Package"].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedType === type 
                  ? "bg-[#0ea5e9] text-white" 
                  : "bg-[#0e141a] text-[#88929b] border border-[#334155] hover:text-[#dde3eb]"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Reports List */}
      <div className="bg-[#161c22] border border-[#334155] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#334155] bg-[#1a2026]/50 text-xs font-semibold text-[#88929b] uppercase tracking-wider">
                <th className="p-4">Report Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Date Generated</th>
                <th className="p-4">Author</th>
                <th className="p-4">Status</th>
                <th className="p-4">File Size</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#334155]/50 text-xs">
              {filteredReports.map((rep) => {
                const isApproved = rep.status === "Approved";
                return (
                  <tr key={rep.id} className="hover:bg-[#1a2026]/40 transition-colors">
                    <td className="p-4 font-bold text-[#dde3eb]">{rep.title}</td>
                    <td className="p-4">
                      <span className="bg-[#0e141a] px-2.5 py-1 rounded-md text-[10px] font-bold border border-[#334155] text-[#89ceff]">
                        {rep.type}
                      </span>
                    </td>
                    <td className="p-4 text-[#88929b]">{rep.date}</td>
                    <td className="p-4 text-[#88929b]">{rep.author}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        isApproved 
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/35" 
                          : "bg-amber-500/10 text-amber-400 border-amber-500/35"
                      }`}>
                        {isApproved ? (
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                        ) : (
                          <Clock className="h-3 w-3 mr-1" />
                        )}
                        <span>{rep.status}</span>
                      </span>
                    </td>
                    <td className="p-4 text-[#88929b]">{rep.size}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => setSelectedReport(rep)}
                          className="flex items-center space-x-1 px-2.5 py-1 rounded bg-[#0e141a] border border-[#334155] text-xs text-[#dde3eb] hover:bg-[#1a2026] hover:border-[#0ea5e9] transition-colors"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span>View</span>
                        </button>
                        <a
                          href={`data:text/plain;charset=utf-8,${encodeURIComponent(rep.title + "\n\n" + rep.description)}`}
                          download={`${rep.title.replace(/\s+/g, "_")}.pdf`}
                          className="flex items-center space-x-1 px-2.5 py-1 rounded bg-[#0ea5e9]/10 border border-[#0ea5e9]/20 text-xs text-[#0ea5e9] hover:bg-[#0ea5e9]/20 transition-colors"
                        >
                          <Download className="h-3.5 w-3.5" />
                          <span>Download</span>
                        </a>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed View Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl bg-[#161c22] border border-[#334155] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#334155] bg-[#0F172A]">
              <div>
                <span className="text-[10px] px-2 py-0.5 rounded-full border font-mono font-semibold bg-[#0ea5e9]/10 text-[#89ceff] border-[#0ea5e9]/25">
                  {selectedReport.type}
                </span>
                <h3 className="text-base font-bold text-white mt-1.5">{selectedReport.title}</h3>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="text-[#88929b] hover:text-[#dde3eb] p-1.5 rounded-lg hover:bg-[#1a2026] transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-5">
              <div>
                <span className="text-[10px] font-bold text-[#88929b] uppercase tracking-wider block">Description</span>
                <p className="text-xs text-[#dde3eb] mt-1.5 leading-relaxed bg-[#0e141a]/40 p-4 rounded-xl border border-[#334155]/60">
                  {selectedReport.description}
                </p>
              </div>

              <div className="space-y-3">
                <span className="text-[10px] font-bold text-[#88929b] uppercase tracking-wider block">Dossier Executive Summary Findings</span>
                <div className="space-y-2">
                  {selectedReport.summary.map((point, idx) => (
                    <div key={idx} className="flex items-start space-x-3 bg-[#0e141a] p-3 rounded-lg border border-[#334155]/40 text-xs">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <p className="text-[#dde3eb] leading-relaxed">{point}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Metadata */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-[#334155] text-xs text-[#88929b]">
                <div className="space-y-0.5">
                  <span className="text-[9px] uppercase tracking-wider">Author / Scan Engine</span>
                  <p className="font-bold text-[#dde3eb] truncate">{selectedReport.author}</p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[9px] uppercase tracking-wider">Date Compiled</span>
                  <p className="font-bold text-[#dde3eb]">{selectedReport.date}</p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[9px] uppercase tracking-wider">Dossier Size</span>
                  <p className="font-bold text-[#dde3eb]">{selectedReport.size}</p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[9px] uppercase tracking-wider">Review Status</span>
                  <p className="font-bold text-[#dde3eb]">{selectedReport.status}</p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-[#334155] bg-[#0F172A] flex items-center justify-between">
              {selectedReport.status === "Pending Sign-off" ? (
                <button
                  onClick={() => {
                    const updated = reports.map(r => r.id === selectedReport.id ? { ...r, status: "Approved" as const } : r);
                    setReports(updated);
                    setSelectedReport({ ...selectedReport, status: "Approved" });
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-500 text-[#0e141a] text-xs font-bold hover:bg-emerald-600 transition-colors"
                >
                  Sign Off & Approve Report
                </button>
              ) : (
                <span className="text-xs text-emerald-400 font-bold flex items-center">
                  <CheckCircle2 className="h-4 w-4 mr-1.5" />
                  Report Approved & Locked
                </span>
              )}
              <button
                onClick={() => setSelectedReport(null)}
                className="px-4 py-2 rounded-xl bg-[#161c22] border border-[#334155] text-xs text-[#dde3eb] hover:bg-[#1a2026] transition-colors"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

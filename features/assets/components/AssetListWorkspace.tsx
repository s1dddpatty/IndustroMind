"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/hooks/useTheme";
import { DESIGN_TOKENS } from "@/constants/design";
import { Asset } from "../constants/assetData";
import { useSystemDocuments } from "@/features/shared/hooks/useSystemDocuments";
import { 
  Server, 
  Search, 
  Filter, 
  Download, 
  ChevronRight, 
  Activity, 
  AlertTriangle,
  BrainCircuit,
  FileText,
  ShieldCheck,
  Upload
} from "lucide-react";

interface AssetListWorkspaceProps {
  onSelectAsset: (id: string) => void;
}

// Assets generated when Sample_Compliance_Document.pdf is ingested
const INGESTED_ASSETS: Asset[] = [
  {
    id: "ast-p204",
    assetTag: "P-204",
    assetName: "Centrifugal Pump P-204",
    assetType: "Rotary",
    manufacturer: "Flowserve Industrial",
    model: "Durco Mark 3 ISO 13709",
    location: "Unit 3 - Hydrocarbon Processing",
    department: "Mechanical Reliability",
    criticality: "Critical",
    status: "Critical",
    healthScore: 68,
    riskScore: 78,
    failureProbability: 38,
    remainingUsefulLife: "8 months",
    operationalState: "Running",
    installationDate: "2021-04-12",
    commissionDate: "2021-05-01",
    lastInspection: "2026-10-15",
    nextInspection: "2026-11-20",
    executiveAiSummary: "Centrifugal Pump P-204 operating at 400 psi in Unit 3. Flagged with a critical contradiction between SOP-MECH-042 LOTO isolation and OEM seal flush requirements.",
    aiRecommendations: [
      { id: "rec-1", action: "Review LOTO clause with reliability supervisor", reason: "Suction valve lockout contradicts OEM mechanical seal flush specification.", timeframe: "Immediate", priority: "High" }
    ],
    knowledgeCoverage: {
      sopsLinked: true,
      datasheetLinked: true,
      inspectionReportsAvailable: true,
      maintenanceHistoryAvailable: true,
      complianceMapped: true,
      sparePartsDocumentationMissing: false,
      replacementHistoryIncomplete: false,
      calibrationEvidenceUnavailable: false,
      overallScore: 92
    },
    complianceRules: [
      { id: "comp-1", regulation: "OSHA 29 CFR 1910.147", description: "LOTO Lockout / Tagout isolation requirements", status: "Non-Compliant", lastChecked: "2026-11-07", impactLevel: "High" },
      { id: "comp-2", regulation: "API 610 12th Ed.", description: "Centrifugal pumps for petroleum and gas industries", status: "Compliant", lastChecked: "2026-11-07", impactLevel: "Medium" }
    ],
    relatedKnowledge: [
      { id: "kn-1", title: "SOP-MECH-042 Revision 3.2", type: "SOP", relevanceScore: 98, date: "2026-11-01" },
      { id: "kn-2", title: "Incident INC-2023-09 Record", type: "Document", relevanceScore: 94, date: "2023-09-14" }
    ],
    timeline: [
      { id: "tl-1", date: "2026-11-07", type: "Alert", title: "Contradiction Flagged", description: "AI detected conflict between SOP-MECH-042 and OEM Manual rev 3.", status: "Critical" },
      { id: "tl-2", date: "2026-10-15", type: "Inspection", title: "Quarterly Vibration Baseline", description: "Seal MS-204 baseline verified.", status: "Completed" }
    ]
  },
  {
    id: "ast-v101",
    assetTag: "V-101",
    assetName: "Suction Isolation Valve V-101",
    assetType: "Static",
    manufacturer: "Fisher Controls",
    model: "High-Pressure Isolation Globe",
    location: "Unit 3 - Hydrocarbon Processing",
    department: "Operations",
    criticality: "High",
    status: "Warning",
    healthScore: 82,
    riskScore: 42,
    failureProbability: 14,
    remainingUsefulLife: "3.5 years",
    operationalState: "Running",
    installationDate: "2020-08-10",
    commissionDate: "2020-09-01",
    lastInspection: "2026-09-22",
    nextInspection: "2027-03-22",
    executiveAiSummary: "Suction valve for Pump P-204. Involved in lockout sequence contradiction during warm-up bypass phase.",
    aiRecommendations: [
      { id: "rec-2", action: "Clarify bypass lock status", reason: "Must not be locked 100% closed during warm-up flush.", timeframe: "Next Shift", priority: "Medium" }
    ],
    knowledgeCoverage: {
      sopsLinked: true,
      datasheetLinked: true,
      inspectionReportsAvailable: true,
      maintenanceHistoryAvailable: true,
      complianceMapped: true,
      sparePartsDocumentationMissing: false,
      replacementHistoryIncomplete: false,
      calibrationEvidenceUnavailable: false,
      overallScore: 88
    },
    complianceRules: [
      { id: "comp-1", regulation: "OSHA 29 CFR 1910.147", description: "Suction valve energy isolation", status: "Pending Review", lastChecked: "2026-11-07", impactLevel: "High" }
    ],
    relatedKnowledge: [
      { id: "kn-1", title: "SOP-MECH-042", type: "SOP", relevanceScore: 96 }
    ],
    timeline: [
      { id: "tl-3", date: "2026-11-07", type: "AI Recommendation", title: "Lockout Sequence Verification", description: "Tagged in SOP-MECH-042 contradiction.", status: "Pending" }
    ]
  },
  {
    id: "ast-v102",
    assetTag: "V-102",
    assetName: "Discharge Isolation Valve V-102",
    assetType: "Static",
    manufacturer: "Cameron Valves",
    model: "Flanged Check & Bleed Valve",
    location: "Unit 3 - Hydrocarbon Processing",
    department: "Operations",
    criticality: "Medium",
    status: "Healthy",
    healthScore: 94,
    riskScore: 12,
    failureProbability: 4,
    remainingUsefulLife: "5 years",
    operationalState: "Running",
    installationDate: "2020-08-10",
    commissionDate: "2020-09-01",
    lastInspection: "2026-09-22",
    nextInspection: "2027-03-22",
    executiveAiSummary: "Discharge valve connected to Pump P-204. Full mechanical integrity verified under API 610.",
    aiRecommendations: [],
    knowledgeCoverage: {
      sopsLinked: true,
      datasheetLinked: true,
      inspectionReportsAvailable: true,
      maintenanceHistoryAvailable: true,
      complianceMapped: true,
      sparePartsDocumentationMissing: false,
      replacementHistoryIncomplete: false,
      calibrationEvidenceUnavailable: false,
      overallScore: 95
    },
    complianceRules: [
      { id: "comp-2", regulation: "API 610", description: "Discharge pressure containment", status: "Compliant", lastChecked: "2026-11-07", impactLevel: "Low" }
    ],
    relatedKnowledge: [
      { id: "kn-1", title: "SOP-MECH-042", type: "SOP", relevanceScore: 92 }
    ],
    timeline: [
      { id: "tl-4", date: "2026-09-22", type: "Inspection", title: "Hydrostatic Shell Test", description: "Passed pressure test at 600 psi.", status: "Completed" }
    ]
  }
];

export function AssetListWorkspace({ onSelectAsset }: AssetListWorkspaceProps) {
  const router = useRouter();
  const { theme } = useTheme();
  const tokens = DESIGN_TOKENS[theme];
  const [searchQuery, setSearchQuery] = useState("");
  const { hasDocuments } = useSystemDocuments();
  const [liveAssets, setLiveAssets] = useState<Asset[]>([]);

  React.useEffect(() => {
    import("@/lib/api/client").then(({ apiClient }) => {
      apiClient.get("/api/v1/assets")
        .then(res => {
          const items = res.data?.data?.items || res.data?.items || [];
          if (Array.isArray(items) && items.length > 0) {
            setLiveAssets(items);
          }
        })
        .catch(() => {});
    });
  }, []);

  const currentAssets = !hasDocuments ? [] : (liveAssets.length > 0 ? liveAssets : INGESTED_ASSETS);
  const totalAssets = currentAssets.length;
  const healthyAssets = currentAssets.filter(a => a.status === "Healthy").length;
  const criticalAssets = currentAssets.filter(a => a.status === "Critical").length;
  const highRiskAssets = currentAssets.filter(a => a.riskScore > 50).length;

  const filteredAssets = currentAssets.filter(a => 
    a.assetName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    a.assetTag.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col w-full h-full pb-8">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500`}>
            <Server className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Asset Intelligence Hub</h1>
            <p className={`text-sm ${tokens.text.secondary}`}>Unified Asset & Operations Brain</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className={`relative flex items-center bg-slate-900/50 rounded-xl border ${tokens.card.border}`}>
            <Search className="w-4 h-4 text-slate-400 absolute left-3" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search assets..." 
              className="w-64 bg-transparent border-none text-sm text-white focus:outline-none focus:ring-0 py-2 pl-9 pr-3"
            />
          </div>
          <button className={`p-2 rounded-xl bg-slate-900/50 border ${tokens.card.border} hover:bg-slate-800 transition-colors text-slate-300`}>
            <Filter className="w-4 h-4" />
          </button>
          <button 
            onClick={() => window.print()}
            title="Export Asset Inventory"
            className={`p-2 rounded-xl bg-slate-900/50 border ${tokens.card.border} hover:bg-slate-800 transition-colors text-slate-300 cursor-pointer`}
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Assets", value: totalAssets, icon: Server, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Healthy Assets", value: healthyAssets, icon: Activity, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "Critical Assets", value: criticalAssets, icon: ShieldCheck, color: "text-orange-500", bg: "bg-orange-500/10" },
          { label: "High Risk", value: highRiskAssets, icon: AlertTriangle, color: "text-red-500", bg: "bg-red-500/10" },
        ].map((stat, i) => (
          <div key={i} className={`p-5 rounded-2xl bg-slate-900/40 border ${tokens.card.border} flex items-center gap-4`}>
            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div>
              <p className={`text-xs font-medium ${tokens.text.secondary}`}>{stat.label}</p>
              <p className="text-xl font-bold text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Hybrid Rich Table */}
      <div className={`flex-1 rounded-2xl bg-slate-900/40 border ${tokens.card.border} overflow-hidden flex flex-col min-h-[300px]`}>
        <div className={`max-md:hidden grid grid-cols-12 gap-4 p-4 border-b ${tokens.card.border} bg-slate-900/80 text-xs font-semibold ${tokens.text.secondary} uppercase tracking-wider`}>
          <div className="col-span-3">Asset</div>
          <div className="col-span-2">Health & Risk</div>
          <div className="col-span-2">Operational State</div>
          <div className="col-span-2">Knowledge Coverage</div>
          <div className="col-span-2">AI Intelligence</div>
          <div className="col-span-1 text-right">Actions</div>
        </div>

        <div className="flex-1 overflow-y-auto hide-scrollbar flex flex-col">
          {filteredAssets.length > 0 ? (
            filteredAssets.map((asset) => (
              <div 
                key={asset.id} 
                onClick={() => onSelectAsset(asset.id)}
                className={`grid grid-cols-12 max-md:flex max-md:flex-col max-md:relative gap-4 max-md:gap-3 p-4 max-md:p-5 border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors cursor-pointer max-md:items-start items-center group`}
              >
                
                {/* Asset Identity */}
                <div className="col-span-3 flex items-center gap-3">
                  <div className={`p-2 rounded-xl bg-slate-800/80 border border-slate-700/60 ${asset.status === 'Critical' ? 'text-red-400' : 'text-slate-300'}`}>
                    <Server className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">{asset.assetTag}</h3>
                    <p className={`text-xs ${tokens.text.secondary}`}>{asset.assetName}</p>
                  </div>
                </div>

                {/* Health & Risk */}
                <div className="col-span-2 flex flex-col gap-1.5 justify-center">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div 
                        className={`h-full ${asset.healthScore > 80 ? 'bg-emerald-500' : asset.healthScore > 50 ? 'bg-amber-500' : 'bg-red-500'}`} 
                        style={{ width: `${asset.healthScore}%` }} 
                      />
                    </div>
                    <span className="text-xs font-semibold text-slate-300">{asset.healthScore}%</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                      asset.riskScore > 70 ? 'bg-red-500/10 border-red-500/30 text-red-400' : 
                      asset.riskScore > 30 ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 
                      'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    }`}>
                      RISK {asset.riskScore}
                    </span>
                  </div>
                </div>

                {/* Operational State */}
                <div className="col-span-2 flex flex-col justify-center">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${asset.status === 'Critical' ? 'bg-red-500' : 'bg-emerald-500'}`} />
                    <span className="text-xs font-semibold text-slate-200">{asset.operationalState}</span>
                  </div>
                  <span className={`text-[10px] ${tokens.text.secondary} mt-0.5`}>RUL: {asset.remainingUsefulLife}</span>
                </div>

                {/* Knowledge Coverage */}
                <div className="col-span-2 flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full border border-slate-700/60 bg-slate-800/40 flex items-center justify-center text-xs font-bold text-slate-200`}>
                    {asset.knowledgeCoverage.overallScore}
                  </div>
                  <div className="flex items-center gap-1 text-slate-500">
                    <FileText className="w-3.5 h-3.5 text-emerald-500" />
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                  </div>
                </div>

                {/* AI Intelligence */}
                <div className="col-span-2 flex items-center gap-2">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
                    <BrainCircuit className="w-3.5 h-3.5" />
                    <span>{asset.aiRecommendations.length} Recs</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="col-span-1 flex items-center justify-end">
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                </div>
              </div>
            ))
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-slate-500">
              <Server className="w-12 h-12 mb-3 opacity-40 text-blue-500" />
              <p className="text-base font-semibold text-slate-300">No Industrial Assets Ingested</p>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mb-5">
                No plant assets or equipment hierarchies are currently indexed. Upload an SOP or equipment standard to automatically extract assets and telemetry.
              </p>
              <button
                onClick={() => router.push("/demo/documents?action=upload")}
                className="px-4 py-2 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition-colors flex items-center gap-2 text-xs"
              >
                <Upload className="w-3.5 h-3.5" /> Upload Industrial Document
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

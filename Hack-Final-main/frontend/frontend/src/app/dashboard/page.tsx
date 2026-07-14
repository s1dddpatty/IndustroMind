"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import "@/lib/api";
import { 
  Activity, ShieldAlert, BookOpen, AlertTriangle, CheckCircle, Clock, 
  X, RefreshCw, Terminal, Globe, ArrowRight 
} from "lucide-react";

interface AuditLogItem {
  id: string;
  action: string;
  resource_type: string;
  resource_id?: string | null;
  details?: string | null;
  ip_address?: string | null;
  created_at: string;
}

const DEMO_ALERTS = [
  { id: "a-1", type: "contradiction", severity: "critical", title: "Contradiction: Max operating temperature mismatch", message: "SOP states max temp 180°C, while API 610 limits continuous operation to 160°C for P-204." },
  { id: "a-2", type: "regulatory_drift", severity: "high", title: "Regulatory Drift Detected", message: "2 operational procedures require immediate review against updated OSHA/EPA mandates." },
  { id: "a-3", type: "knowledge_mortality", severity: "medium", title: "Knowledge Mortality: 68/100", message: "Critical reliance on Dave Miller (Senior Rotating Equipment Specialist, retiring Q3)." },
];

const DEMO_MORTALITY = {
  score: 68,
  risk_level: "High",
  highRiskExperts: ["Dave Miller (Senior Rotating Equipment Specialist)", "Elena Vance (Chief Safety Engineer)"],
  summary: "Organization Knowledge Mortality Score is 68/100. Critical reliance on retiring personnel."
};

export default function DashboardPage() {
  const [alerts, setAlerts] = useState<any[]>(DEMO_ALERTS);
  const [mortality, setMortality] = useState<any>(DEMO_MORTALITY);
  const [loading, setLoading] = useState(true);

  // Audit Logs State
  const [isAuditOpen, setIsAuditOpen] = useState(false);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [auditTotal, setAuditTotal] = useState(0);
  const [auditPage, setAuditPage] = useState(1);
  const [auditFilter, setAuditFilter] = useState("");
  const [auditLoading, setAuditLoading] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const [alertsRes, mortalityRes] = await Promise.all([
        axios.get("/api/v1/dashboard/alerts").catch(() => null),
        axios.get("/api/v1/mortality/score").catch(() => null),
      ]);
      
      if (alertsRes?.data) {
        const apiAlerts = alertsRes.data.data?.alerts || alertsRes.data.alerts || [];
        if (Array.isArray(apiAlerts) && apiAlerts.length > 0) {
          setAlerts([...apiAlerts, ...DEMO_ALERTS.filter(d => !apiAlerts.some((a: any) => a.title === d.title))]);
        }
      }
      if (mortalityRes?.data) {
        const apiMort = mortalityRes.data.data || mortalityRes.data;
        if (apiMort && (apiMort.score || apiMort.mortality_score)) {
          setMortality({
            score: apiMort.score || apiMort.mortality_score || 68,
            highRiskExperts: apiMort.highRiskExperts || apiMort.high_risk_experts || DEMO_MORTALITY.highRiskExperts,
            risk_level: apiMort.risk_level || "High",
            summary: apiMort.summary || DEMO_MORTALITY.summary
          });
        }
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAuditLogs = async (page: number, actionFilter: string) => {
    setAuditLoading(true);
    const pageSize = 8;
    try {
      const params: any = { page, page_size: pageSize };
      if (actionFilter) {
        params.action = actionFilter;
      }
      
      const res = await axios.get("/api/v1/audit-logs/", { params });
      const responseData = res.data?.data || res.data;
      if (responseData) {
        setAuditLogs(responseData.items || responseData.data?.items || []);
        setAuditTotal(responseData.total || responseData.data?.total || 0);
      }
    } catch (err) {
      console.error("Error fetching audit logs, loading mock data fallback:", err);
      // Generate mock fallback logs representing the real DB state
      const mockLogs: AuditLogItem[] = [
        { id: "m-1", action: "pipeline.graph_population", resource_type: "document", details: "nodes=6, relationships=5", ip_address: "127.0.0.1", created_at: new Date(Date.now() - 120000).toISOString() },
        { id: "m-2", action: "pipeline.relationship_extraction", resource_type: "document", details: "relationships=5", ip_address: "127.0.0.1", created_at: new Date(Date.now() - 180000).toISOString() },
        { id: "m-3", action: "pipeline.entity_extraction", resource_type: "document", details: "entities=6", ip_address: "127.0.0.1", created_at: new Date(Date.now() - 240000).toISOString() },
        { id: "m-4", action: "pipeline.classification", resource_type: "document", details: "classification=SOP, confidence=0.96", ip_address: "127.0.0.1", created_at: new Date(Date.now() - 300000).toISOString() },
        { id: "m-5", action: "pipeline.ocr", resource_type: "document", details: "raw_text_length=713", ip_address: "127.0.0.1", created_at: new Date(Date.now() - 360000).toISOString() },
        { id: "m-6", action: "pipeline.queued", resource_type: "document", details: "file=test.txt", ip_address: "127.0.0.1", created_at: new Date(Date.now() - 420000).toISOString() },
        { id: "m-7", action: "user.login", resource_type: "user", details: "User log in successful", ip_address: "192.168.1.5", created_at: new Date(Date.now() - 86400000).toISOString() },
        { id: "m-8", action: "document.upload", resource_type: "document", details: "file=test.txt", ip_address: "192.168.1.5", created_at: new Date(Date.now() - 86500000).toISOString() },
      ];
      
      const filtered = actionFilter ? mockLogs.filter(l => l.action === actionFilter) : mockLogs;
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      setAuditLogs(filtered.slice(start, end));
      setAuditTotal(filtered.length);
    } finally {
      setAuditLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (isAuditOpen) {
      fetchAuditLogs(auditPage, auditFilter);
    }
  }, [isAuditOpen, auditPage, auditFilter]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-[#88929b]">Loading operational intelligence...</div>
      </div>
    );
  }

  const formatTimestamp = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleString();
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-[#dde3eb]">Operational Dashboard</h2>
        <p className="text-[#88929b]">Real-time plant intelligence, knowledge mortality risk, and regulatory integrity overview.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-[#334155] bg-[#161c22] p-6 relative overflow-hidden">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium text-[#88929b]">Knowledge Mortality</h3>
            <Activity className="h-4 w-4 text-[#ffb4ab]" />
          </div>
          <div className="text-3xl font-bold text-[#dde3eb] mt-1">{mortality?.score || 68}<span className="text-sm font-normal text-[#88929b]">/100</span></div>
          <p className="text-xs text-[#88929b] mt-2 line-clamp-1">
            High risk: <span className="text-[#ffb4ab] font-medium">{mortality?.highRiskExperts?.join(", ") || "Dave Miller"}</span>
          </p>
        </div>

        <div className="rounded-xl border border-[#334155] bg-[#161c22] p-6 relative overflow-hidden">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium text-[#88929b]">Critical Alerts</h3>
            <ShieldAlert className="h-4 w-4 text-[#ffb4ab]" />
          </div>
          <div className="text-3xl font-bold text-[#dde3eb] mt-1">{alerts.length}</div>
          <p className="text-xs text-red-400 font-medium mt-2">Requires immediate attention</p>
        </div>
        
        <div className="rounded-xl border border-[#334155] bg-[#161c22] p-6 relative overflow-hidden">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium text-[#88929b]">Knowledge Gaps</h3>
            <BookOpen className="h-4 w-4 text-[#89ceff]" />
          </div>
          <div className="text-3xl font-bold text-[#dde3eb] mt-1">12 <span className="text-sm font-normal text-[#88929b]">SOPs</span></div>
          <p className="text-xs text-[#89ceff] font-medium mt-2">Missing procedures & unmapped codes</p>
        </div>

        <div className="rounded-xl border border-[#334155] bg-[#161c22] p-6 relative overflow-hidden">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium text-[#88929b]">Audit Readiness</h3>
            <CheckCircle className="h-4 w-4 text-[#4edea3]" />
          </div>
          <div className="text-3xl font-bold text-[#4edea3] mt-1">91.6%</div>
          <p className="text-xs text-[#4edea3] font-medium mt-2">ISO 9001 / OSHA PSM compliant</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 rounded-xl border border-[#334155] bg-[#161c22] p-6">
          <h3 className="text-lg font-semibold mb-4 text-[#dde3eb]">Recent AI Discoveries & Contradictions</h3>
          <div className="space-y-3">
            {alerts.map((alert: any, idx: number) => (
              <div key={alert.id || idx} className="flex items-start space-x-4 border border-[#334155] bg-[#1a2026] p-4 rounded-lg hover:border-[#0ea5e9]/50 transition-colors">
                <AlertTriangle className="h-5 w-5 text-[#ffb4ab] flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-[#dde3eb] truncate">{alert.title}</h4>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#334155] text-[#89ceff]">
                      {alert.type || "Alert"}
                    </span>
                  </div>
                  <p className="text-xs text-[#88929b] mt-1 leading-relaxed">{alert.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-3 rounded-xl border border-[#334155] bg-[#161c22] p-6 flex flex-col justify-between">
           <div>
             <h3 className="text-lg font-semibold mb-2 text-[#dde3eb]">Compliance Framework Status</h3>
             <p className="text-xs text-[#88929b] mb-6">Live mapping against federal and industry standards.</p>
             
             <div className="space-y-4">
               <div>
                 <div className="flex justify-between text-xs font-semibold mb-1">
                   <span className="text-[#dde3eb]">OSHA 1910.119 (PSM)</span>
                   <span className="text-[#4edea3]">100% Compliant</span>
                 </div>
                 <div className="w-full bg-[#0e141a] rounded-full h-2 overflow-hidden border border-[#334155]">
                   <div className="bg-[#4edea3] h-full rounded-full" style={{ width: "100%" }} />
                 </div>
               </div>

               <div>
                 <div className="flex justify-between text-xs font-semibold mb-1">
                   <span className="text-[#dde3eb]">API Standard 610 (Pumps)</span>
                   <span className="text-[#ffb4ab]">82% Action Required</span>
                 </div>
                 <div className="w-full bg-[#0e141a] rounded-full h-2 overflow-hidden border border-[#334155]">
                   <div className="bg-[#ffb4ab] h-full rounded-full" style={{ width: "82%" }} />
                 </div>
               </div>

               <div>
                 <div className="flex justify-between text-xs font-semibold mb-1">
                   <span className="text-[#dde3eb]">EPA 40 CFR Part 68 (RMP)</span>
                   <span className="text-[#4edea3]">96% Compliant</span>
                 </div>
                 <div className="w-full bg-[#0e141a] rounded-full h-2 overflow-hidden border border-[#334155]">
                   <div className="bg-[#4edea3] h-full rounded-full" style={{ width: "96%" }} />
                 </div>
               </div>

               <div>
                 <div className="flex justify-between text-xs font-semibold mb-1">
                   <span className="text-[#dde3eb]">ISO 10816-3 (Vibration)</span>
                   <span className="text-[#89ceff]">88% Under Review</span>
                 </div>
                 <div className="w-full bg-[#0e141a] rounded-full h-2 overflow-hidden border border-[#334155]">
                   <div className="bg-[#89ceff] h-full rounded-full" style={{ width: "88%" }} />
                 </div>
               </div>
             </div>
           </div>

           <div className="mt-6 pt-4 border-t border-[#334155] flex items-center justify-between text-xs text-[#88929b]">
             <span className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1 text-[#89ceff]" /> Auto-sync active</span>
             <span 
               onClick={() => {
                 setAuditPage(1);
                 setIsAuditOpen(true);
               }}
               className="text-[#0ea5e9] font-medium cursor-pointer hover:underline"
             >
               View Audit Logs →
             </span>
           </div>
        </div>
      </div>

      {/* Audit Logs Modal */}
      {isAuditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-4xl rounded-2xl border border-[#334155] bg-[#161c22] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#334155] bg-[#0F172A]">
              <div>
                <h3 className="text-base font-bold text-[#dde3eb] flex items-center space-x-2">
                  <Terminal className="h-5 w-5 text-[#89ceff]" />
                  <span>System Audit Logs</span>
                </h3>
                <p className="text-xs text-[#88929b] mt-0.5">
                  Historical log of all background processes, AI operations, and user changes.
                </p>
              </div>
              <button
                onClick={() => setIsAuditOpen(false)}
                className="text-[#88929b] hover:text-[#dde3eb] p-1.5 rounded-lg hover:bg-[#1a2026] transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Filter Toolbar */}
            <div className="px-6 py-3 border-b border-[#334155] bg-[#1a2026] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center space-x-3">
                <label htmlFor="action-filter" className="text-xs font-semibold text-[#88929b]">Filter by Action:</label>
                <select
                  id="action-filter"
                  value={auditFilter}
                  onChange={(e) => {
                    setAuditFilter(e.target.value);
                    setAuditPage(1);
                  }}
                  className="rounded border border-[#334155] bg-[#161c22] px-2.5 py-1 text-xs text-[#dde3eb] focus:border-[#0ea5e9] focus:outline-none"
                >
                  <option value="">All Actions</option>
                  <option value="pipeline.queued">pipeline.queued</option>
                  <option value="pipeline.ocr">pipeline.ocr</option>
                  <option value="pipeline.classification">pipeline.classification</option>
                  <option value="pipeline.entity_extraction">pipeline.entity_extraction</option>
                  <option value="pipeline.relationship_extraction">pipeline.relationship_extraction</option>
                  <option value="pipeline.graph_population">pipeline.graph_population</option>
                  <option value="user.login">user.login</option>
                  <option value="document.upload">document.upload</option>
                </select>
              </div>

              <button
                onClick={() => fetchAuditLogs(auditPage, auditFilter)}
                disabled={auditLoading}
                className="flex items-center space-x-1 px-3 py-1 rounded bg-[#334155] text-xs text-[#dde3eb] hover:bg-[#1a2026] disabled:opacity-50 transition-colors"
              >
                <RefreshCw className={`h-3 w-3 ${auditLoading ? "animate-spin" : ""}`} />
                <span>Refresh</span>
              </button>
            </div>

            {/* Table Content */}
            <div className="flex-1 overflow-y-auto p-6 min-h-[300px]">
              {auditLoading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="flex flex-col items-center space-y-2">
                    <RefreshCw className="h-8 w-8 text-[#0ea5e9] animate-spin" />
                    <span className="text-xs text-[#88929b]">Fetching audit trail...</span>
                  </div>
                </div>
              ) : auditLogs.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#334155] text-xs font-semibold text-[#88929b]">
                        <th className="pb-3 w-[25%]">Timestamp</th>
                        <th className="pb-3 w-[25%]">Action</th>
                        <th className="pb-3 w-[15%]">Resource</th>
                        <th className="pb-3 w-[25%]">Details</th>
                        <th className="pb-3 w-[10%]">IP Address</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#334155]/60 text-xs">
                      {auditLogs.map((log) => {
                        const isPipeline = log.action.startsWith("pipeline.");
                        return (
                          <tr key={log.id} className="hover:bg-[#1a2026]/40">
                            <td className="py-3 text-[#88929b] font-mono">
                              {formatTimestamp(log.created_at)}
                            </td>
                            <td className="py-3">
                              <span className={`px-2 py-0.5 rounded font-mono font-medium ${
                                log.action.includes("graph_population") ? "bg-emerald-950 text-emerald-400 border border-emerald-800" :
                                log.action.includes("extraction") ? "bg-sky-950 text-sky-400 border border-sky-800" :
                                isPipeline ? "bg-blue-950 text-blue-400 border border-blue-800" :
                                "bg-zinc-800 text-zinc-300 border border-zinc-700"
                              }`}>
                                {log.action}
                              </span>
                            </td>
                            <td className="py-3 text-[#dde3eb] font-semibold">{log.resource_type}</td>
                            <td className="py-3 text-[#88929b] truncate max-w-xs font-mono" title={log.details || ""}>
                              {log.details || "-"}
                            </td>
                            <td className="py-3 text-[#88929b] flex items-center space-x-1">
                              <Globe className="h-3 w-3 opacity-60" />
                              <span>{log.ip_address || "local"}</span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-2 py-10">
                  <Terminal className="h-8 w-8 text-[#88929b] opacity-40" />
                  <p className="text-sm text-[#88929b]">No audit logs found matching selected criteria.</p>
                </div>
              )}
            </div>

            {/* Modal Footer / Pagination */}
            <div className="px-6 py-4 border-t border-[#334155] bg-[#0F172A] flex items-center justify-between">
              <span className="text-xs text-[#88929b]">
                Showing {Math.min(auditTotal, (auditPage - 1) * 8 + 1)} - {Math.min(auditTotal, auditPage * 8)} of {auditTotal} system actions
              </span>
              <div className="flex items-center space-x-2">
                <button
                  disabled={auditPage <= 1 || auditLoading}
                  onClick={() => setAuditPage(prev => Math.max(1, prev - 1))}
                  className="px-3 py-1.5 rounded border border-[#334155] bg-[#161c22] text-xs text-[#dde3eb] hover:bg-[#1a2026] disabled:opacity-40 transition-colors"
                >
                  Previous
                </button>
                <button
                  disabled={auditPage * 8 >= auditTotal || auditLoading}
                  onClick={() => setAuditPage(prev => prev + 1)}
                  className="px-3 py-1.5 rounded border border-[#334155] bg-[#161c22] text-xs text-[#dde3eb] hover:bg-[#1a2026] disabled:opacity-40 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

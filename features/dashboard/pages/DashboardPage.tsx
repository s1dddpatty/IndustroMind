"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardHero } from "../components/DashboardHero";
import { KpiGrid } from "../components/KpiGrid";
import { WorkspaceRow } from "../components/WorkspaceRow";
import { BottomRow } from "../components/BottomRow";
import { AlertsWorkspace } from "../components/AlertsWorkspace";
import { AlertDetail } from "../components/AlertDetail";
import { DASHBOARD_DATA } from "../constants/dashboardData";
import { KnowledgeGraphWorkspace } from "../components/KnowledgeGraphWorkspace";
import { AiBriefWorkspace } from "../components/AiBriefWorkspace";
import { RecentQueriesWorkspace } from "../components/RecentQueriesWorkspace";
import { QueryDetailWorkspace } from "@/features/dashboard/components/QueryDetailWorkspace";
import { SystemHealthWorkspace } from "../components/SystemHealthWorkspace";
import { ServiceDetailWorkspace } from "../components/ServiceDetailWorkspace";
import { aiBriefService } from "../services/aiBriefService";

export type WorkspaceView = "dashboard" | "alerts" | "alert-detail" | "knowledge-graph" | "ai-brief" | "recent-queries" | "query-detail" | "system-health" | "service-detail";

export function DashboardPage() {
  const router = useRouter();
  const [workspace, setWorkspace] = useState<WorkspaceView>("dashboard");
  const [selectedAlertId, setSelectedAlertId] = useState<number | null>(null);
  
  // AI Brief State
  const [currentBrief, setCurrentBrief] = useState(DASHBOARD_DATA.workspace.aiDecisionBrief.currentBrief);
  const [isGeneratingBrief, setIsGeneratingBrief] = useState(false);


  // Queries State
  const [selectedQueryId, setSelectedQueryId] = useState<string | null>(null);

  // System Health State
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);

  const handleSelectAlert = (id: number) => {
    setSelectedAlertId(id);
    setWorkspace("alert-detail");
  };

  const handleGenerateBrief = async () => {
    setIsGeneratingBrief(true);
    setWorkspace("ai-brief");
    try {
      const newBrief = await aiBriefService.generateNewBrief(currentBrief.id);
      setCurrentBrief(newBrief);
    } catch (error) {
      console.error("Error generating brief", error);
    } finally {
      setIsGeneratingBrief(false);
    }
  };

  return (
    <div className="flex-1 min-h-0 w-full relative flex flex-col">
      <AnimatePresence mode="wait">
        {workspace === "dashboard" && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 12, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.99 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="flex-1 min-h-0 flex flex-col gap-5 overflow-hidden"
          >
            {/* Dashboard Layout Lock Safeguards */}
            <div className="shrink-0">
              <DashboardHero 
                data={DASHBOARD_DATA.hero} 
                onUpload={() => router.push("/demo/documents?action=upload")}
              />
            </div>
            <div className="shrink-0">
              <KpiGrid kpis={DASHBOARD_DATA.kpis} />
            </div>
            <div className="flex-1 min-h-0 flex flex-col">
              <WorkspaceRow 
              data={{
                ...DASHBOARD_DATA.workspace,
                aiDecisionBrief: {
                  ...DASHBOARD_DATA.workspace.aiDecisionBrief,
                  currentBrief
                }
              }} 
              onExpand={() => setWorkspace("alerts")} 
              onExpandGraph={() => setWorkspace("knowledge-graph")}
              onExpandBrief={() => setWorkspace("ai-brief")}
              onGenerateBrief={handleGenerateBrief}
            />
            </div>
            <div className="shrink-0">
              <BottomRow 
                data={DASHBOARD_DATA.bottomRow} 
                onExpandDocuments={() => router.push("/demo/documents")}
                onExpandQueries={() => setWorkspace("recent-queries")}
                onExpandHealth={() => setWorkspace("system-health")}
              />
            </div>
          </motion.div>
        )}
        {workspace !== "dashboard" && (
          <motion.div
            key={workspace} // Force re-render on workspace change for animation
            initial={{ opacity: 0, y: 12, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.99 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="flex-1 min-h-0 flex flex-col overflow-y-auto overflow-x-hidden hide-scrollbar"
          >
            {workspace === "alerts" && (
              <AlertsWorkspace 
                alerts={DASHBOARD_DATA.workspace.proactiveAlerts.alerts}
                onBack={() => setWorkspace("dashboard")} 
                onSelectAlert={handleSelectAlert} 
              />
            )}

            {workspace === "alert-detail" && selectedAlertId !== null && (
              <AlertDetail 
                alertId={selectedAlertId}
                alerts={DASHBOARD_DATA.workspace.proactiveAlerts.alerts}
                onBack={() => setWorkspace("alerts")} 
              />
            )}

            {workspace === "knowledge-graph" && (
              <KnowledgeGraphWorkspace
                data={DASHBOARD_DATA.workspace.knowledgeGraph.graph}
                onBack={() => setWorkspace("dashboard")}
              />
            )}

            {workspace === "ai-brief" && (
              <AiBriefWorkspace
                brief={currentBrief}
                isGenerating={isGeneratingBrief}
                onBack={() => setWorkspace("dashboard")}
                onGenerateNew={handleGenerateBrief}
              />
            )}



            {workspace === "recent-queries" && (
              <RecentQueriesWorkspace
                queries={DASHBOARD_DATA.bottomRow.recentQueries.queries}
                onBack={() => setWorkspace("dashboard")}
                onSelectQuery={(id: string) => {
                  setSelectedQueryId(id);
                  setWorkspace("query-detail");
                }}
              />
            )}

            {workspace === "query-detail" && selectedQueryId && (
              <QueryDetailWorkspace
                queryId={selectedQueryId}
                queries={DASHBOARD_DATA.bottomRow.recentQueries.queries}
                onBack={() => setWorkspace("recent-queries")}
              />
            )}

            {workspace === "system-health" && (
              <SystemHealthWorkspace
                services={DASHBOARD_DATA.bottomRow.systemHealth.services}
                onBack={() => setWorkspace("dashboard")}
                onSelectService={(id: string) => {
                  setSelectedServiceId(id);
                  setWorkspace("service-detail");
                }}
              />
            )}

            {workspace === "service-detail" && selectedServiceId && (
              <ServiceDetailWorkspace
                serviceId={selectedServiceId}
                services={DASHBOARD_DATA.bottomRow.systemHealth.services}
                onBack={() => setWorkspace("system-health")}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

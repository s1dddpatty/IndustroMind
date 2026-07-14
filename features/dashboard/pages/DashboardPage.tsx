"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardHero } from "../components/DashboardHero";
import { KpiGrid } from "../components/KpiGrid";
import { WorkspaceRow } from "../components/WorkspaceRow";
import { BottomRow } from "../components/BottomRow";
import dynamic from "next/dynamic";
import { DashboardData } from "../constants/dashboardData";
import { aiBriefService } from "../services/aiBriefService";
import { useDashboard } from "../hooks/useDashboard";
import { Skeleton } from "@/features/shared/components/ui/Skeleton";
import { ErrorState } from "@/features/shared/components/ui/ErrorState";
import { useToast } from "@/features/shared/components/ui/ToastProvider";

// Heavy detail workspaces lazy-loaded to code-split huge mock data and heavy renderers
const AlertsWorkspace = dynamic(() => import("../components/AlertsWorkspace").then(mod => mod.AlertsWorkspace));
const AlertDetail = dynamic(() => import("../components/AlertDetail").then(mod => mod.AlertDetail));
const KnowledgeGraphWorkspace = dynamic(() => import("../components/KnowledgeGraphWorkspace").then(mod => mod.KnowledgeGraphWorkspace));
const AiBriefWorkspace = dynamic(() => import("../components/AiBriefWorkspace").then(mod => mod.AiBriefWorkspace));
const RecentQueriesWorkspace = dynamic(() => import("../components/RecentQueriesWorkspace").then(mod => mod.RecentQueriesWorkspace));
const QueryDetailWorkspace = dynamic(() => import("@/features/dashboard/components/QueryDetailWorkspace").then(mod => mod.QueryDetailWorkspace));
const SystemHealthWorkspace = dynamic(() => import("../components/SystemHealthWorkspace").then(mod => mod.SystemHealthWorkspace));
const ServiceDetailWorkspace = dynamic(() => import("../components/ServiceDetailWorkspace").then(mod => mod.ServiceDetailWorkspace));

export type WorkspaceView = "dashboard" | "alerts" | "alert-detail" | "knowledge-graph" | "ai-brief" | "recent-queries" | "query-detail" | "system-health" | "service-detail";

export function DashboardPage() {
  const router = useRouter();
  const [workspace, setWorkspace] = useState<WorkspaceView>("dashboard");
  const [selectedAlertId, setSelectedAlertId] = useState<number | null>(null);
  
  // Data State
  const { data, isLoading, error, refresh } = useDashboard();
  
  // AI Brief State
  const [currentBrief, setCurrentBrief] = useState<any>(null); // Wait for data to initialize
  const [isGeneratingBrief, setIsGeneratingBrief] = useState(false);

  // Queries State
  const [selectedQueryId, setSelectedQueryId] = useState<string | null>(null);

  // System Health State
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);

  const { toast } = useToast();

  const handleSelectAlert = (id: number) => {
    setSelectedAlertId(id);
    setWorkspace("alert-detail");
  };

  const handleGenerateBrief = async () => {
    setIsGeneratingBrief(true);
    setWorkspace("ai-brief");
    try {
      toast("info", "Generating new decision brief...");
      const briefIdToUse = currentBrief ? currentBrief.id : (data ? data.workspace.aiDecisionBrief.currentBrief.id : "new");
      const newBrief = await aiBriefService.generateNewBrief(briefIdToUse);
      setCurrentBrief(newBrief);
      toast("success", "Brief generated successfully");
    } catch (error: any) {
      console.error("Error generating brief", error);
      toast("error", error.message || "Failed to generate brief");
    } finally {
      setIsGeneratingBrief(false);
    }
  };

  if (error) {
    return (
      <div className="flex-1 min-h-0 w-full flex items-center justify-center p-8">
        <ErrorState message="Failed to load dashboard data." onRetry={refresh} />
      </div>
    );
  }

  if (isLoading || !data) {
    return (
      <div className="flex-1 min-h-0 w-full p-4 flex flex-col gap-5">
        <Skeleton className="w-full h-[280px]" rounded="xl" />
        <div className="grid grid-cols-4 max-md:grid-cols-2 gap-4">
          <Skeleton className="h-[110px]" rounded="xl" />
          <Skeleton className="h-[110px]" rounded="xl" />
          <Skeleton className="h-[110px]" rounded="xl" />
          <Skeleton className="h-[110px]" rounded="xl" />
        </div>
        <div className="grid grid-cols-3 max-md:grid-cols-1 gap-4 flex-1 min-h-0">
          <Skeleton className="h-[380px]" rounded="xl" />
          <Skeleton className="h-[380px]" rounded="xl" />
          <Skeleton className="h-[380px]" rounded="xl" />
        </div>
      </div>
    );
  }

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
            className="flex-1 min-h-0 max-lg:min-h-none flex flex-col gap-5 overflow-hidden max-lg:overflow-visible max-lg:h-auto pb-4 max-md:px-4 max-lg:px-4"
          >
            <DashboardHero 
              data={data.hero} 
              onUpload={() => router.push("/demo/documents?action=upload")}
              onAskAI={() => router.push("/demo/decision-assistant?sourceModule=Dashboard&conversationMode=General")}
            />
            <KpiGrid kpis={data.kpis} />
            <WorkspaceRow 
              data={{
                ...data.workspace,
                aiDecisionBrief: {
                  ...data.workspace.aiDecisionBrief,
                  currentBrief: currentBrief || data.workspace.aiDecisionBrief.currentBrief
                }
              }} 
              onExpand={() => setWorkspace("alerts")} 
              onExpandGraph={() => setWorkspace("knowledge-graph")}
              onExpandBrief={() => setWorkspace("ai-brief")}
              onGenerateBrief={handleGenerateBrief}
            />
            <BottomRow 
              data={data.bottomRow} 
              onExpandDocuments={() => router.push("/demo/documents")}
              onExpandQueries={() => setWorkspace("recent-queries")}
              onExpandHealth={() => setWorkspace("system-health")}
            />
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
                onBack={() => setWorkspace("dashboard")} 
                onSelectAlert={handleSelectAlert} 
              />
            )}

            {workspace === "alert-detail" && selectedAlertId !== null && (
              <AlertDetail 
                alertId={selectedAlertId}
                onBack={() => setWorkspace("alerts")} 
              />
            )}

            {workspace === "knowledge-graph" && (
              <KnowledgeGraphWorkspace
                onBack={() => setWorkspace("dashboard")}
              />
            )}

            {workspace === "ai-brief" && (
              <AiBriefWorkspace
                brief={currentBrief || data.workspace.aiDecisionBrief.currentBrief}
                isGenerating={isGeneratingBrief}
                onBack={() => setWorkspace("dashboard")}
                onGenerateNew={handleGenerateBrief}
              />
            )}



            {workspace === "recent-queries" && (
              <RecentQueriesWorkspace
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
                onBack={() => setWorkspace("recent-queries")}
              />
            )}

            {workspace === "system-health" && (
              <SystemHealthWorkspace
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
                onBack={() => setWorkspace("system-health")}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

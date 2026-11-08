"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { integrityService, IntegrityData } from "../services/integrityService";
import { ComplianceRule } from "../constants/complianceData";
import { useSystemDocuments } from "@/features/shared/hooks/useSystemDocuments";

const INGESTED_COMPLIANCE_RULES: ComplianceRule[] = [
  {
    id: "comp-osha-1910-147",
    regulationId: "OSHA 29 CFR 1910.147",
    regulationName: "The Control of Hazardous Energy (Lockout/Tagout)",
    standard: "OSHA",
    category: "Safety",
    severity: "Critical",
    status: "Warning",
    description: "Contradiction detected: SOP-MECH-042 requires suction valve V-101 locked closed before venting, but OEM manual rev 3 specifies V-101 must remain cracked open 5% during seal warm-up flush.",
    complianceScore: 65,
    riskScore: 82,
    evidenceCompleteness: 94,
    evaluationConfidence: 96,
    lastEvaluated: new Date().toISOString(),
    nextScheduledEvaluation: "2026-11-20T08:00:00Z",
    evidenceFreshness: "Fresh",
    lastDocumentUpdate: "2026-11-07",
    executiveAiSummary: "AI neuro-symbolic scan detected a direct operational conflict between SOP-MECH-042 (mandatory suction lockout) and Flowserve OEM Manual rev 3 (warm-up bypass). Restricting bypass creates high risk of dry-run seal failure on MS-204.",
    aiReasoning: "Cross-document ontology alignment identified conflicting valve states for V-101 during centrifugal pump P-204 isolation procedure.",
    impact: {
      safety: "High",
      operational: "High",
      environmental: "Medium",
      financial: "High",
      description: "Potential mechanical seal blowout or personnel exposure to pressurized hydrocarbon fluid."
    },
    affectedAssets: [
      { id: "ast-p204", assetTag: "P-204", assetName: "Centrifugal Pump P-204", criticality: "Critical", status: "Critical" },
      { id: "ast-v101", assetTag: "V-101", assetName: "Suction Valve V-101", criticality: "High", status: "Warning" }
    ],
    evidence: [
      { id: "ev-1", title: "SOP-MECH-042 Revision 3.2", type: "SOP", relevanceScore: 98, date: "2026-11-07" },
      { id: "ev-2", title: "OSHA 29 CFR 1910.147 Standard", type: "Document", relevanceScore: 95, date: "2026-11-07" }
    ],
    knowledgeCoverage: {
      regulationMapped: true,
      sopsLinked: true,
      assetsLinked: true,
      documentsLinked: true,
      inspectionAvailable: true,
      maintenanceEvidenceAvailable: true,
      missingCalibration: false,
      missingInspection: false,
      missingApproval: true,
      overallCoverageScore: 92
    },
    timeline: [
      { id: "tl-c-1", date: new Date().toISOString(), type: "Violation Detected", title: "LOTO Valve Contradiction Detected", description: "AI scan flagged suction isolation conflict.", status: "Critical" }
    ],
    aiRecommendations: [
      { id: "rec-c-1", action: "Authorize SOP-MECH-042 revision 3.3 bypass exception clause", reason: "Prevents mechanical seal dry-run failure during warm-up phase.", priority: "Critical", type: "Update SOP" }
    ],
    owner: "Process Safety Team",
    department: "Compliance & Safety",
    tags: ["OSHA", "LOTO", "Contradiction", "P-204"]
  },
  {
    id: "comp-api-610",
    regulationId: "API 610 12th Ed.",
    regulationName: "Centrifugal Pumps for Petroleum, Petrochemical and Natural Gas",
    standard: "API",
    category: "Equipment",
    severity: "High",
    status: "Compliant",
    description: "Establishes mechanical integrity, minimum continuous flow, and containment boundaries for centrifugal pump P-204.",
    complianceScore: 94,
    riskScore: 12,
    evidenceCompleteness: 98,
    evaluationConfidence: 95,
    lastEvaluated: new Date().toISOString(),
    nextScheduledEvaluation: "2027-05-01T08:00:00Z",
    evidenceFreshness: "Fresh",
    lastDocumentUpdate: "2026-11-07",
    executiveAiSummary: "Centrifugal pump P-204 meets all API 610 mechanical specifications and discharge containment requirements under normal operating pressures.",
    aiReasoning: "Design parameters extracted from SOP-MECH-042 align with API 610 Annex G standards.",
    impact: {
      safety: "Medium",
      operational: "Medium",
      environmental: "Low",
      financial: "Low",
      description: "Normal compliance maintained across all fluid pressure boundaries."
    },
    affectedAssets: [
      { id: "ast-p204", assetTag: "P-204", assetName: "Centrifugal Pump P-204", criticality: "Critical", status: "Critical" }
    ],
    evidence: [
      { id: "ev-3", title: "API 610 Compliance Checklist", type: "Inspection Report", relevanceScore: 92, date: "2026-11-07" }
    ],
    knowledgeCoverage: {
      regulationMapped: true,
      sopsLinked: true,
      assetsLinked: true,
      documentsLinked: true,
      inspectionAvailable: true,
      maintenanceEvidenceAvailable: true,
      missingCalibration: false,
      missingInspection: false,
      missingApproval: false,
      overallCoverageScore: 96
    },
    timeline: [
      { id: "tl-c-2", date: new Date().toISOString(), type: "Verification", title: "API 610 Standard Audit", description: "Design verification completed.", status: "Completed" }
    ],
    aiRecommendations: [],
    owner: "Mechanical Engineering",
    department: "Engineering",
    tags: ["API-610", "Pumps", "Compliant"]
  }
];

export function useIntegrity() {
  const [data, setData] = useState<IntegrityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const { hasDocuments } = useSystemDocuments();

  const fetchIntegrityData = useCallback(async (forceRefresh = false) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      if (forceRefresh || !data) {
        setLoading(true);
      }
      setError(null);

      const result = await integrityService.fetchIntegrityData(forceRefresh, abortControllerRef.current.signal);
      setData(result);
    } catch (err: any) {
      if (err.name === 'CanceledError' || err.name === 'AbortError') return;
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [data]);

  useEffect(() => {
    fetchIntegrityData();
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchIntegrityData]);

  const runScan = useCallback(async () => {
    try {
      setLoading(true);
      await integrityService.runScan("demo-org");
      await fetchIntegrityData(true);
    } catch (err: any) {
      setError(err instanceof Error ? err : new Error(String(err)));
      setLoading(false);
    }
  }, [fetchIntegrityData]);

  // If no documents ingested into the system yet, everything is clean/0!
  if (!hasDocuments) {
    return {
      rules: [],
      stats: {
        overallScore: 0,
        openViolations: 0,
        criticalViolations: 0,
        knowledgeCoverage: 0
      },
      loading: false,
      error: null,
      refresh: () => fetchIntegrityData(true),
      runScan
    };
  }

  const activeRules = data?.rules && data.rules.length > 0 ? data.rules : INGESTED_COMPLIANCE_RULES;

  return {
    rules: activeRules,
    stats: {
      overallScore: 65,
      openViolations: 1,
      criticalViolations: 1,
      knowledgeCoverage: 92
    },
    loading: false,
    error,
    refresh: () => fetchIntegrityData(true),
    runScan
  };
}

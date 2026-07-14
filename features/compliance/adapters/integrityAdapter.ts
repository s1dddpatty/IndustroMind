import { 
  ContradictionRead, 
  RegulatoryDriftRead, 
  KnowledgeMortalityRead 
} from "../../../types/api/integrity";
import { 
  ComplianceRule, 
  COMPLIANCE_STATS 
} from "../constants/complianceData";

export const integrityAdapter = {
  adaptIntegrityData(
    contradictionsRes: ContradictionRead[] | null,
    driftRes: RegulatoryDriftRead | null,
    mortalityRes: KnowledgeMortalityRead | null
  ): { rules: ComplianceRule[], stats: typeof COMPLIANCE_STATS } {
    const rules: ComplianceRule[] = [];
    
    // Base stats using placeholders, merging in any real numbers
    const stats = { ...COMPLIANCE_STATS };

    let openViolations = 0;
    let criticalViolations = 0;

    // --- 1. Contradictions -> ComplianceRules ---
    if (contradictionsRes) {
      contradictionsRes.forEach((c, idx) => {
        const severity = c.severity.toLowerCase() === "critical" ? "Critical" : 
                         c.severity.toLowerCase() === "high" ? "High" : 
                         c.severity.toLowerCase() === "medium" ? "Medium" : "Low";
                         
        if (severity === "Critical") criticalViolations++;
        openViolations++;

        rules.push({
          id: `contradiction-${idx}`,
          regulationId: `Contradiction Alert`,
          regulationName: "Document Integrity Conflict",
          standard: "OISD", // Placeholder
          category: "Procedural", // Placeholder
          severity,
          status: "Non-Compliant",
          description: c.description,
          
          complianceScore: 0, // Placeholder
          riskScore: severity === "Critical" ? 95 : severity === "High" ? 80 : 50, // Synthesized
          evidenceCompleteness: 100, // Placeholder
          evaluationConfidence: 95, // Placeholder
          
          lastEvaluated: new Date().toISOString(),
          nextScheduledEvaluation: "N/A", // Placeholder
          evidenceFreshness: "Fresh", // Placeholder
          lastDocumentUpdate: new Date().toISOString(),

          executiveAiSummary: c.description,
          aiReasoning: "Backend contradiction detection engine identified a conflict between multiple sources.",
          
          impact: {
            safety: severity === "Critical" ? "High" : "Medium",
            operational: severity === "High" ? "High" : "Medium",
            environmental: "None",
            financial: "Medium",
            description: "Conflicting standard operating procedures."
          },

          affectedAssets: (c.affected_assets || []).map((asset, aIdx) => ({
            id: `ca-${idx}-${aIdx}`,
            assetTag: asset,
            assetName: `Asset ${asset}`,
            criticality: "High",
            status: "Warning"
          })),

          evidence: [
            {
              id: `ev-c-${idx}`,
              title: "Conflicting Evidence Extract",
              type: "Document",
              relevanceScore: 100,
              date: new Date().toISOString()
            }
          ],

          knowledgeCoverage: {
            regulationMapped: false,
            sopsLinked: true,
            assetsLinked: true,
            documentsLinked: true,
            inspectionAvailable: false,
            maintenanceEvidenceAvailable: false,
            missingCalibration: false,
            missingInspection: false,
            missingApproval: false,
            overallCoverageScore: 50
          },

          timeline: [
            {
              id: `tl-c-${idx}`,
              date: new Date().toISOString(),
              type: "Violation Detected",
              title: "Contradiction Identified",
              description: c.description,
              status: "Critical"
            }
          ],

          aiRecommendations: [
            {
              id: `rec-c-${idx}`,
              action: c.suggested_resolution || "Review documents to resolve conflict.",
              reason: c.description,
              priority: severity,
              type: "Update Documentation"
            }
          ],

          owner: c.responsible_department || "System",
          department: c.responsible_department || "Compliance",
          tags: ["contradiction", "integrity"],

          backendMetadata: {
            sourceType: "contradiction",
            originalPayload: c,
            endpointOrigin: "/api/v1/integrity/contradictions",
            fetchedAt: new Date().toISOString(),
            adapterVersion: "1.0.0"
          }
        });
      });
    }

    // --- 2. Regulatory Drift -> ComplianceRule ---
    if (driftRes) {
      if (driftRes.drift_status && driftRes.drift_status.toLowerCase() !== "compliant") {
        openViolations++;
        rules.push({
          id: `drift-alert`,
          regulationId: "Regulatory Drift",
          regulationName: "Knowledge Base Staleness",
          standard: "OISD", // Placeholder
          category: "Procedural", // Placeholder
          severity: "High",
          status: "Warning",
          description: "Detected outdated procedures and unmapped regulations.",
          
          complianceScore: 60, // Placeholder
          riskScore: 70, // Synthesized
          evidenceCompleteness: 40, // Synthesized
          evaluationConfidence: 90, // Placeholder
          
          lastEvaluated: new Date().toISOString(),
          nextScheduledEvaluation: "N/A", // Placeholder
          evidenceFreshness: "Stale", // Synthesized
          lastDocumentUpdate: new Date().toISOString(),

          executiveAiSummary: driftRes.summary || "Regulatory drift detected.",
          aiReasoning: "Backend drift detection found missing regulatory mappings.",
          
          impact: {
            safety: "Medium",
            operational: "Medium",
            environmental: "Low",
            financial: "Medium",
            description: "Operating with outdated procedures can lead to compliance violations."
          },

          affectedAssets: [],

          evidence: (driftRes.outdated_procedures || []).map((proc: any, pIdx) => ({
            id: `ev-d-${pIdx}`,
            title: typeof proc === 'string' ? proc : proc.name || "Outdated Procedure",
            type: "SOP",
            relevanceScore: 90,
            date: new Date().toISOString()
          })),

          knowledgeCoverage: {
            regulationMapped: false,
            sopsLinked: false,
            assetsLinked: false,
            documentsLinked: false,
            inspectionAvailable: false,
            maintenanceEvidenceAvailable: false,
            missingCalibration: false,
            missingInspection: false,
            missingApproval: false,
            overallCoverageScore: 40
          },

          timeline: [
            {
              id: `tl-d-1`,
              date: new Date().toISOString(),
              type: "Violation Detected",
              title: "Drift Detected",
              description: driftRes.summary || "Drift detected.",
              status: "Pending"
            }
          ],

          aiRecommendations: (driftRes.unmapped_regulations || []).map((reg: any, rIdx) => ({
            id: `rec-d-${rIdx}`,
            action: `Map regulation: ${typeof reg === 'string' ? reg : reg.name || 'Unknown'}`,
            reason: "Unmapped regulation introduces drift risk.",
            priority: "High",
            type: "Update Documentation"
          })),

          owner: "Compliance Officer", // Placeholder
          department: "Compliance", // Placeholder
          tags: ["drift", "regulatory"],

          backendMetadata: {
            sourceType: "regulatoryDrift",
            originalPayload: driftRes,
            endpointOrigin: "/api/v1/integrity/regulatory-drift",
            fetchedAt: new Date().toISOString(),
            adapterVersion: "1.0.0"
          }
        });
      }
    }

    // --- 3. Knowledge Mortality -> ComplianceRule ---
    if (mortalityRes) {
      stats.overallScore = 100 - (mortalityRes.mortality_score || 0); // Inject mortality into overall compliance health
      
      if ((mortalityRes.mortality_score || 0) > 30) {
        openViolations++;
        const isCritical = mortalityRes.risk_level?.toLowerCase() === "critical";
        if (isCritical) criticalViolations++;

        rules.push({
          id: `mortality-alert`,
          regulationId: "Personnel Risk",
          regulationName: "Knowledge Mortality Risk",
          standard: "OISD", // Placeholder
          category: "Procedural", // Placeholder
          severity: isCritical ? "Critical" : "High",
          status: isCritical ? "Non-Compliant" : "Warning",
          description: "High risk of institutional knowledge loss due to aging or departing experts.",
          
          complianceScore: 100 - (mortalityRes.mortality_score || 0),
          riskScore: mortalityRes.mortality_score || 0,
          evidenceCompleteness: 50, // Placeholder
          evaluationConfidence: 90, // Placeholder
          
          lastEvaluated: new Date().toISOString(),
          nextScheduledEvaluation: "N/A", // Placeholder
          evidenceFreshness: "Stale", // Synthesized
          lastDocumentUpdate: new Date().toISOString(),

          executiveAiSummary: mortalityRes.summary || "High knowledge mortality risk detected.",
          aiReasoning: "Backend analytics identified key personnel holding undocumented critical knowledge.",
          
          impact: {
            safety: "Medium",
            operational: "High",
            environmental: "None",
            financial: "High",
            description: "Loss of un-documented knowledge can cripple operations and safety responses."
          },

          affectedAssets: [],

          evidence: (mortalityRes.knowledge_at_risk || []).map((know: any, kIdx) => ({
            id: `ev-m-${kIdx}`,
            title: `At Risk Domain: ${typeof know === 'string' ? know : know.domain || 'Unknown'}`,
            type: "Knowledge Graph Node",
            relevanceScore: 100,
            date: new Date().toISOString()
          })),

          knowledgeCoverage: {
            regulationMapped: false,
            sopsLinked: false,
            assetsLinked: true,
            documentsLinked: false,
            inspectionAvailable: false,
            maintenanceEvidenceAvailable: false,
            missingCalibration: false,
            missingInspection: false,
            missingApproval: false,
            overallCoverageScore: 100 - (mortalityRes.mortality_score || 0)
          },

          timeline: [
            {
              id: `tl-m-1`,
              date: new Date().toISOString(),
              type: "AI Recommendation",
              title: "Mortality Risk Flagged",
              description: mortalityRes.summary || "High risk identified.",
              status: "Pending"
            }
          ],

          aiRecommendations: (mortalityRes.recommended_interviews || []).map((interview: any, iIdx) => ({
            id: `rec-m-${iIdx}`,
            action: `Schedule expert interview with ${typeof interview === 'string' ? interview : interview.expert || 'Subject Matter Expert'}`,
            reason: "Capture undocumented knowledge before departure.",
            priority: isCritical ? "Critical" : "High",
            type: "Generate AI Brief"
          })),

          owner: "HR & Operations", // Placeholder
          department: "HR", // Placeholder
          tags: ["mortality", "personnel", "risk"],

          backendMetadata: {
            sourceType: "mortality",
            originalPayload: mortalityRes,
            endpointOrigin: "/api/v1/integrity/mortality",
            fetchedAt: new Date().toISOString(),
            adapterVersion: "1.0.0"
          }
        });
      }
    }

    stats.openViolations = openViolations;
    stats.criticalViolations = criticalViolations;

    return { rules, stats };
  }
};

import { DecisionBriefRead } from "@/types/api/decisions";
import { ChatMessage, GraphNodeRef, EvidenceItem, ActionRecommendation, ComplianceImpact } from "../constants/assistantData";

export const decisionAdapter = {
  /**
   * Adapts the backend DecisionBriefRead into our robust frontend ChatMessage ViewModel.
   * Maps existing fields safely, and injects placeholders for presentation-only UI components
   * that do not have backend equivalents yet. Business intelligence is NEVER fabricated.
   */
  adaptDecisionBriefToMessage(
    brief: DecisionBriefRead,
    messageId: string,
    requestId?: string
  ): ChatMessage {
    const timestamp = new Date().toISOString();
    
    // Extract brief data safely
    const data = brief.decision_brief || {};
    
    // 1. Executive Summary & Main Content
    // Use executive_summary as the summary, and a combined or specific main content string if needed.
    // If the backend returns `recommendation`, we can use that as the primary text, or fallback to summary.
    const content = data.recommendation || "Decision Brief generated. See summary below.";
    
    // 2. Map Graph Nodes from 'detected_entities' (since graph_traversal_results are often generic records)
    const graphNodes: GraphNodeRef[] = (brief.detected_entities || []).map((entity, i) => ({
      id: `node-${i}-${Date.now()}`,
      label: entity,
      type: "Equipment", // Placeholder presentation type, as backend doesn't provide node types in detected_entities yet
      status: "Warning" // Placeholder status
    }));

    // 3. Map Citations/Evidence from 'supporting_evidence'
    const evidence: EvidenceItem[] = (data.supporting_evidence || []).map((ev, i) => ({
      id: `ev-${i}-${Date.now()}`,
      type: "Report", // Placeholder presentation type
      title: `Source ${i + 1}`, // Placeholder title
      excerpt: ev,
      confidence: 95 // Placeholder confidence for UI
    }));

    // 4. Map Recommendations from 'suggested_next_steps'
    const recommendations: ActionRecommendation[] = (data.suggested_next_steps || []).map((step, i) => ({
      id: `rec-${i}-${Date.now()}`,
      actionType: "Maintenance", // Placeholder presentation type
      description: step,
      priority: "Medium" // Placeholder priority
    }));

    // 5. Compliance Impacts from 'applicable_regulations'
    const complianceImpacts: ComplianceImpact[] = (data.applicable_regulations || []).map((reg, i) => ({
      id: `comp-${i}-${Date.now()}`,
      standard: reg,
      rule: "Standard Regulation Check", // Placeholder
      status: "Compliant", // Placeholder
      description: `Relevant regulation: ${reg}`
    }));

    return {
      id: messageId,
      role: "assistant",
      content,
      timestamp,
      status: "completed",
      executiveSummary: data.executive_summary,
      confidenceScore: data.confidence_level ? parseInt(data.confidence_level, 10) || 90 : 90, // Placeholder numeric parse
      graphNodes,
      evidence,
      recommendations,
      complianceImpacts,
      followUpQuestions: [], // Can be extracted if backend adds it
      
      // Technical Metadata
      backendRequestId: requestId,
      endpointOrigin: "/api/v1/decisions/query",
      adapterVersion: "v1.1"
    };
  }
};

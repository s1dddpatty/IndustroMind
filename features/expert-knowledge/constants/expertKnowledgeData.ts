export interface KnowledgeExpert {
  name: string;
  role: string;
  department: string;
  type: "Primary Expert" | "Reviewer" | "Domain Expert";
}

export interface KnowledgeImpact {
  safety: "High" | "Medium" | "Low" | "None";
  operational: "High" | "Medium" | "Low" | "None";
  reliability: "High" | "Medium" | "Low" | "None";
  maintenance: "High" | "Medium" | "Low" | "None";
  production: "High" | "Medium" | "Low" | "None";
  environmental: "High" | "Medium" | "Low" | "None";
  description: string;
}

export interface KnowledgeContent {
  overview: string;
  technicalDetails: string;
  operationalContext: string;
  fieldTricks: string[];
  failureSymptoms: string[];
  commonMistakes: string[];
  lessonsLearned: string[];
  knownLimitations: string[];
}

export interface KnowledgeVersion {
  versionNumber: number;
  date: string;
  whatChanged: string;
  whyChanged: string;
  approvedBy: string;
  triggeringIncident?: string;
  affectedAssets: string[];
}

export interface KnowledgeReuseMetrics {
  referencedByDecisionAssistant: number;
  referencedByAiBriefs: number;
  referencedByCompliance: number;
  referencedByMaintenancePlans: number;
  referencedBySopUpdates: number;
  referencedByPreviousQueries: number;
}

export interface KnowledgeEvidence {
  id: string;
  title: string;
  type: "Document" | "SOP" | "Inspection Report" | "Maintenance Record" | "Knowledge Graph Node" | "Compliance Rule" | "AI Brief" | "Alert";
  relevanceScore: number;
}

export interface KnowledgeTimelineEvent {
  id: string;
  date: string;
  type: "Created" | "Validated" | "Applied During Maintenance" | "Referenced by AI" | "Updated" | "Reviewed";
  description: string;
}

export interface ExpertKnowledgeArticle {
  id: string;
  title: string;
  category: "Mechanical" | "Electrical" | "Process" | "Safety" | "Instrumentation";
  sourceType: "Senior Engineer Experience" | "Maintenance Team Observation" | "Incident Investigation" | "Vendor Recommendation" | "AI Generated Insight" | "SOP Derived" | "Field Best Practice";
  maturity: "Draft" | "Under Review" | "Validated" | "Operational" | "Widely Adopted" | "Needs Review";
  
  experts: KnowledgeExpert[];
  
  knowledgeScore: number; // 0-100
  confidence: number; // 0-100
  aiConfidence: number; // 0-100
  completeness: number; // 0-100
  evidenceCoverage: number; // 0-100
  usageFrequency: number;
  reviewFreshness: "Fresh" | "Stale" | "Outdated";
  knowledgeHealth: "Excellent" | "Good" | "Needs Attention" | "Critical Gap";

  executiveAiSummary: string;
  content: KnowledgeContent;
  impact: KnowledgeImpact;
  
  knowledgeGaps: string[];
  aiInsights: string[];

  applicableAssets: Array<{ id: string, tag: string, name: string }>;
  supportingEvidence: KnowledgeEvidence[];
  timeline: KnowledgeTimelineEvent[];
  versions: KnowledgeVersion[];
  reuseMetrics: KnowledgeReuseMetrics;

  lastUpdated: string;
  tags: string[];
}

export const MOCK_KNOWLEDGE_ARTICLES: ExpertKnowledgeArticle[] = [
  {
    id: "ek-001",
    title: "Durco Mark 3 Cold-Start Vibration Heuristics",
    category: "Mechanical",
    sourceType: "Senior Engineer Experience",
    maturity: "Widely Adopted",
    
    experts: [
      { name: "Robert Chen", role: "Sr. Rotating Equipment Eng", department: "Reliability", type: "Primary Expert" },
      { name: "Sarah Jenkins", role: "Reliability Manager", department: "Maintenance", type: "Reviewer" },
      { name: "David Wu", role: "Process Safety Engineer", department: "HSE", type: "Domain Expert" }
    ],

    knowledgeScore: 98,
    confidence: 99,
    aiConfidence: 95,
    completeness: 92,
    evidenceCoverage: 100,
    usageFrequency: 142,
    reviewFreshness: "Fresh",
    knowledgeHealth: "Excellent",

    executiveAiSummary: "This knowledge captures undocumented vibration behaviors in Durco Mark 3 pumps (e.g., P-201) during cold-starts (< 10°C). It matters because standard OEM manuals do not account for fluid viscosity spikes in our specific process piping. Ignoring this leads to false positive alarms, unnecessary emergency shutdowns, and accelerated seal wear. All operators handling Unit 2 must review this.",
    
    impact: {
      safety: "Medium",
      operational: "High",
      reliability: "High",
      maintenance: "High",
      production: "Medium",
      environmental: "None",
      description: "Directly prevents false trips during winter operations, saving an estimated 12 hours of downtime per season while extending mechanical seal life by 40%."
    },

    content: {
      overview: "Standard SOPs call for immediate trip if vibration exceeds 3.0 mm/s. However, field experience shows Durco Mark 3 pumps on our heavy product lines will briefly spike to 4.5 mm/s for exactly 45-60 seconds during cold starts before settling.",
      technicalDetails: "The cold-start viscosity of the heavy naphtha causes temporary cavitation in the suction volute. This creates an asymmetric load on the inboard bearing.",
      operationalContext: "Applies specifically during winter months (ambient < 10°C) or after extended turnaround when lines have completely cooled.",
      fieldTricks: [
        "Throttle the discharge valve to 40% instead of 60% during the first 2 minutes of cold start.",
        "Listen for a distinct 'gravel' sound; if it stops within 60 seconds, it's normal cold cavitation."
      ],
      failureSymptoms: [
        "If vibration does not drop below 3.0 mm/s after 90 seconds, it is NOT cold cavitation—it is a true bearing issue.",
        "Rapid temperature spike in the inboard bearing housing accompanying the vibration."
      ],
      commonMistakes: [
        "Tripping the pump at exactly 3.0 mm/s during winter startup.",
        "Attempting to adjust the mechanical seal flush pressure during the transient phase."
      ],
      lessonsLearned: [
        "Incident 2023-14: Emergency shutdown triggered due to false vibration alarm cost 4 hours of production.",
        "Repeated false trips wear out the motor contactors prematurely."
      ],
      knownLimitations: [
        "Does not apply if the pump fluid has been steam-traced and pre-heated.",
        "Only verified for Durco Mark 3 geometries."
      ]
    },

    knowledgeGaps: [
      "No direct CFD simulation exists to prove the cavitation geometry.",
      "Requires validation on the new P-205 impeller upgrade coming next year."
    ],

    aiInsights: [
      "Conflicting Procedure: SOP-OP-412 strictly dictates tripping at 3.0 mm/s with no exceptions for ambient temp.",
      "Suggested Improvement: Automate a 60-second alarm delay in the DCS logic specifically for cold-start sequences on P-201 and P-202.",
      "Potential Risk: If field operators rely on the 'gravel sound' trick over high-noise PPE, they might misidentify true mechanical rub."
    ],

    applicableAssets: [
      { id: "asset-001", tag: "P-201", name: "Primary Cooling Water Pump" },
      { id: "asset-044", tag: "P-202", name: "Secondary Cooling Water Pump" }
    ],

    supportingEvidence: [
      { id: "ev-1", title: "Incident Report 2023-14: False Trip P-201", type: "Inspection Report", relevanceScore: 100 },
      { id: "ev-2", title: "Vibration Trend Analysis Dec 2024", type: "Maintenance Record", relevanceScore: 98 },
      { id: "ev-3", title: "Durco Mark 3 Volute Geometry Node", type: "Knowledge Graph Node", relevanceScore: 85 }
    ],

    timeline: [
      { id: "tl-1", date: "2024-02-15", type: "Created", description: "Initial documentation after Incident 2023-14." },
      { id: "tl-2", date: "2024-03-01", type: "Validated", description: "Reviewed and approved by Reliability Engineering." },
      { id: "tl-3", date: "2025-12-10", type: "Applied During Maintenance", description: "Successfully prevented a false trip during winter turnaround." },
      { id: "tl-4", date: "2026-01-20", type: "Referenced by AI", description: "Decision Assistant cited this knowledge during a high-vibration alert." }
    ],

    versions: [
      {
        versionNumber: 2,
        date: "2025-01-10",
        whatChanged: "Added specific throttling percentage (40%) to Field Tricks.",
        whyChanged: "Operators were throttling too aggressively, starving the seal.",
        approvedBy: "Sarah Jenkins",
        triggeringIncident: "Seal Failure Jan 2025",
        affectedAssets: ["P-201", "P-202"]
      },
      {
        versionNumber: 1,
        date: "2024-02-15",
        whatChanged: "Initial Creation",
        whyChanged: "Capture cold-start behavior",
        approvedBy: "David Wu",
        affectedAssets: ["P-201"]
      }
    ],

    reuseMetrics: {
      referencedByDecisionAssistant: 45,
      referencedByAiBriefs: 12,
      referencedByCompliance: 0,
      referencedByMaintenancePlans: 4,
      referencedBySopUpdates: 2,
      referencedByPreviousQueries: 108
    },

    lastUpdated: "2025-01-10T14:30:00Z",
    tags: ["vibration", "pumps", "cold-start", "false-trip", "durco"]
  },
  {
    id: "ek-002",
    title: "LOTO Bypass Pitfalls on C-105 Compressor",
    category: "Safety",
    sourceType: "Incident Investigation",
    maturity: "Operational",
    
    experts: [
      { name: "Alice Fernandez", role: "Safety Inspector", department: "HSE", type: "Primary Expert" },
      { name: "Michael Chang", role: "Plant Manager", department: "Operations", type: "Reviewer" }
    ],

    knowledgeScore: 88,
    confidence: 95,
    aiConfidence: 85,
    completeness: 80,
    evidenceCoverage: 75,
    usageFrequency: 34,
    reviewFreshness: "Stale",
    knowledgeHealth: "Needs Attention",

    executiveAiSummary: "Critical tacit knowledge regarding the Lockout/Tagout (LOTO) procedure on Compressor C-105. It highlights a hidden pneumatic energy source that is frequently missed during standard electrical isolation. This knowledge prevents fatal accidental startups. Mandatory for all maintenance personnel.",
    
    impact: {
      safety: "High",
      operational: "Low",
      reliability: "None",
      maintenance: "Medium",
      production: "None",
      environmental: "None",
      description: "Directly addresses a fatal hazard where residual pneumatic pressure can rotate the compressor screw even when main power is disconnected."
    },

    content: {
      overview: "When isolating C-105, operators routinely lock out the main electrical breaker. However, the pneumatic pilot valve often retains 40 psi of trapped air that can actuate the inlet guide vanes.",
      technicalDetails: "The air receiver tank check-valve has a known tiny bleed leak backward into the pilot line. Over 2 hours of shutdown, this pressurizes the control circuit.",
      operationalContext: "Applies to all mechanical interventions inside the C-105 acoustic enclosure.",
      fieldTricks: [
        "Always manually crack the 1/4 inch bleed valve (V-901) behind the control panel after electrical lockout.",
        "Listen for the hiss; it takes about 15 seconds to fully depressurize."
      ],
      failureSymptoms: [
        "Inlet guide vanes suddenly slamming shut while mechanics have hands near the linkage."
      ],
      commonMistakes: [
        "Assuming electrical LOTO = zero energy state.",
        "Trusting the local pressure gauge (PG-105) which often reads zero even when pilot pressure exists."
      ],
      lessonsLearned: [
        "Near Miss 2025-08: Mechanic experienced sudden linkage movement; avoided injury by chance."
      ],
      knownLimitations: [
        "We are waiting on a CAPEX project to replace the check valve entirely, which will render this knowledge obsolete."
      ]
    },

    knowledgeGaps: [
      "No formal engineering validation of why the pressure gauge fails to register the pilot pressure.",
      "SOP-OP-210 has not yet been officially updated to include cracking V-901."
    ],

    aiInsights: [
      "Conflicting Procedure: Current OSHA Compliance check (comp-osha-1910) for C-105 shows non-compliance due to outdated LOTO SOPs. This knowledge article perfectly explains the missing step.",
      "Suggested Improvement: Instantly update LOTO SOP for C-105 to mandate V-901 bleed.",
      "Potential Risk: If this knowledge remains tacit and the check-valve is not replaced, new mechanics are at extreme risk."
    ],

    applicableAssets: [
      { id: "asset-002", tag: "C-105", name: "Main Air Compressor" }
    ],

    supportingEvidence: [
      { id: "ev-4", title: "Near Miss Report 2025-08", type: "Inspection Report", relevanceScore: 100 },
      { id: "ev-5", title: "OSHA 1910.147 Compliance Alert", type: "Compliance Rule", relevanceScore: 95 }
    ],

    timeline: [
      { id: "tl-5", date: "2025-09-01", type: "Created", description: "Captured post-incident investigation." },
      { id: "tl-6", date: "2025-09-15", type: "Validated", description: "HSE verified the pneumatic trap phenomenon." }
    ],

    versions: [
      {
        versionNumber: 1,
        date: "2025-09-01",
        whatChanged: "Initial Creation",
        whyChanged: "Near Miss 2025-08",
        approvedBy: "Michael Chang",
        affectedAssets: ["C-105"]
      }
    ],

    reuseMetrics: {
      referencedByDecisionAssistant: 18,
      referencedByAiBriefs: 5,
      referencedByCompliance: 12,
      referencedByMaintenancePlans: 8,
      referencedBySopUpdates: 0, // This is the problem
      referencedByPreviousQueries: 42
    },

    lastUpdated: "2025-09-15T09:00:00Z",
    tags: ["loto", "safety", "pneumatic", "compressor", "near-miss"]
  }
];

export const EXPERT_KNOWLEDGE_STATS = {
  totalArticles: 148,
  validated: 112,
  pendingReview: 18,
  criticalBestPractices: 45,
  lessonsLearned: 67,
  aiGeneratedInsights: 31,
  contributors: 42,
  knowledgeHealth: 88
};

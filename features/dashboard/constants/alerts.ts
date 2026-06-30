export interface AlertDocument {
  id: string;
  title: string;
  type: string;
}

export interface AlertData {
  id: number;
  title: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  description: string;
  asset: string;
  timestamp: string;
  recommendedAction?: string;
  relatedDocuments?: AlertDocument[];
  status: "Active" | "Resolved";
}

export const DASHBOARD_ALERTS: AlertData[] = [
  {
    id: 1,
    title: "SOP Conflict Detected",
    severity: "Critical",
    description: "SOP-MAINT-P201 requires annual inspection but\nOISD-GDN-116 mandates 6-monthly inspection.",
    asset: "Pump P-201",
    timestamp: "2h ago",
    status: "Active",
    recommendedAction: "Review the compliance documentation and schedule an ad-hoc inspection to synchronize maintenance and regulatory timelines.",
    relatedDocuments: [
      { id: "SOP-MAINT-P201", title: "SOP-MAINT-P201", type: "Standard Operating Procedure" },
      { id: "OISD-GDN-116", title: "OISD-GDN-116", type: "Inspection Guideline" }
    ]
  },
  {
    id: 2,
    title: "Regulation Update Impact",
    severity: "High",
    description: "OISD-STD-189 updated on 15 Jan 2025.\nAffects 12 procedures at your plant.",
    asset: "Compliance",
    timestamp: "5h ago",
    status: "Active",
    recommendedAction: "Audit the 12 affected procedures and draft an update plan.",
    relatedDocuments: [
      { id: "OISD-STD-189", title: "OISD-STD-189", type: "Regulatory Standard" }
    ]
  },
  {
    id: 3,
    title: "Knowledge at Risk",
    severity: "Medium",
    description: "Emergency isolation procedure for Train B exists\nonly in R. Sharma's notes.",
    asset: "Train B",
    timestamp: "1d ago",
    status: "Active",
    recommendedAction: "Digitize and formalize the emergency isolation procedure.",
    relatedDocuments: []
  }
];

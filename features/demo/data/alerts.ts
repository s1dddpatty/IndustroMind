export type AlertPriority = "Critical" | "High" | "Medium" | "Low";

export interface DemoAlert {
  id: string;
  title: string;
  priority: AlertPriority;
  description: string;
  context: string;
  timeAgo: string;
}

export const demoAlerts: DemoAlert[] = [
  {
    id: "alert-1",
    title: "SOP Conflict Detected",
    priority: "Critical",
    description: "SOP-MAINT-P201 requires annual inspection but OISD-GDN-116 mandates 6-monthly inspection.",
    context: "Pump P-201",
    timeAgo: "2h ago"
  },
  {
    id: "alert-2",
    title: "Regulation Update Impact",
    priority: "High",
    description: "OISD-STD-189 updated on 15 Jan 2025. Affects 12 procedures at your plant.",
    context: "Compliance",
    timeAgo: "5h ago"
  },
  {
    id: "alert-3",
    title: "Knowledge at Risk",
    priority: "Medium",
    description: "Emergency isolation procedure for Train B exists only in R. Sharma's notes.",
    context: "Train B",
    timeAgo: "1d ago"
  }
];

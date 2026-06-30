import { ShieldCheck, AlertTriangle, FileWarning, Activity, Files } from "lucide-react";

export const demoKpis = [
  {
    id: "integrity",
    title: "Knowledge Integrity",
    value: "92%",
    icon: ShieldCheck,
    iconColorClass: "text-green-400",
    trend: { value: 8, label: "vs last 7 days", direction: "up" as const },
    sparklineData: [40, 45, 55, 50, 70, 85, 92]
  },
  {
    id: "contradictions",
    title: "Active Contradictions",
    value: "3",
    icon: AlertTriangle,
    iconColorClass: "text-red-400",
    trend: { value: 2, label: "vs last 7 days", direction: "down" as const },
    sparklineData: [8, 7, 5, 6, 4, 3, 3]
  },
  {
    id: "non-compliant",
    title: "SOPs Non-Compliant",
    value: "7",
    icon: FileWarning,
    iconColorClass: "text-orange-400",
    trend: { value: 3, label: "vs last 7 days", direction: "up" as const },
    sparklineData: [2, 3, 3, 4, 5, 6, 7]
  },
  {
    id: "mortality",
    title: "Knowledge Mortality",
    value: "34%",
    icon: Activity,
    iconColorClass: "text-purple-400",
    trend: { value: 6, label: "vs last 7 days", direction: "down" as const },
    sparklineData: [50, 48, 45, 42, 38, 36, 34]
  },
  {
    id: "processed",
    title: "Documents Processed",
    value: "247",
    icon: Files,
    iconColorClass: "text-blue-400",
    trend: { value: 24, label: "vs last 7 days", direction: "up" as const },
    sparklineData: [180, 190, 200, 210, 220, 235, 247]
  }
];

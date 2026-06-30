import { 
  LayoutDashboard, 
  BrainCircuit, 
  Network, 
  FileText, 
  Server, 
  ShieldCheck, 
  Users, 
  BarChart3
} from "lucide-react";

export interface NavigationItem {
  id: string;
  title: string;
  icon: any; // Lucide icon
  href: string;
  description: string;
  requiredRole?: string[];
  isVisible: boolean;
  isBottom?: boolean;
}

export const NAVIGATION_ITEMS: NavigationItem[] = [
  { 
    id: "dashboard", 
    title: "Dashboard", 
    href: "/demo", 
    icon: LayoutDashboard,
    description: "Overview of all metrics and active systems.",
    requiredRole: ["admin", "user"],
    isVisible: true
  },
  { 
    id: "decision-assistant", 
    title: "Decision Assistant", 
    href: "/demo/decision-assistant", 
    icon: BrainCircuit,
    description: "AI-powered decision making assistant.",
    requiredRole: ["admin", "user"],
    isVisible: true
  },
  { 
    id: "knowledge-graph", 
    title: "Knowledge Graph", 
    href: "/demo/knowledge-graph", 
    icon: Network,
    description: "Visual representation of industrial entities and relations.",
    requiredRole: ["admin", "user"],
    isVisible: true
  },
  { 
    id: "documents", 
    title: "Documents", 
    href: "/demo/documents", 
    icon: FileText,
    description: "Manage and process compliance and operations documents.",
    requiredRole: ["admin", "user"],
    isVisible: true
  },
  { 
    id: "assets", 
    title: "Assets", 
    href: "/demo/assets", 
    icon: Server,
    description: "Track physical and digital industrial assets.",
    requiredRole: ["admin", "user"],
    isVisible: true
  },
  { 
    id: "compliance", 
    title: "Compliance", 
    href: "/demo/compliance", 
    icon: ShieldCheck,
    description: "Monitor regulatory compliance and risk.",
    requiredRole: ["admin", "user"],
    isVisible: true
  },
  { 
    id: "expert-knowledge", 
    title: "Expert Knowledge", 
    href: "/demo/expert-knowledge", 
    icon: Users,
    description: "Human-in-the-loop knowledge capture.",
    requiredRole: ["admin", "user"],
    isVisible: true
  },
  { 
    id: "reports", 
    title: "Reports", 
    href: "/demo/reports", 
    icon: BarChart3,
    description: "Generate and view performance reports.",
    requiredRole: ["admin", "user"],
    isVisible: true
  },
];

import Link from "next/link";
import { LayoutDashboard, ShieldAlert, BrainCircuit, Box, BookOpen, FileText, CheckSquare, Users, Network, FileBarChart, Settings } from "lucide-react";

export function Sidebar() {
  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { name: "Knowledge Integrity", icon: ShieldAlert, href: "/dashboard/integrity" },
    { name: "Decision Assistant", icon: BrainCircuit, href: "/dashboard/decision" },
    { name: "Assets", icon: Box, href: "/dashboard/assets" },
    { name: "Knowledge", icon: BookOpen, href: "/dashboard/knowledge" },
    { name: "Documents", icon: FileText, href: "/dashboard/documents" },
    { name: "Compliance", icon: CheckSquare, href: "/dashboard/compliance" },
    { name: "Expert Knowledge", icon: Users, href: "/dashboard/expert" },
    { name: "Knowledge Graph", icon: Network, href: "/dashboard/graph" },
    { name: "Reports", icon: FileBarChart, href: "/dashboard/reports" },
    { name: "Administration", icon: Settings, href: "/dashboard/admin" },
  ];

  return (
    <div className="flex h-screen w-[280px] flex-col border-r border-[#334155] bg-[#0F172A] text-[#dde3eb]">
      <div className="flex h-16 items-center border-b border-[#334155] px-6">
        <h1 className="text-xl font-bold tracking-tight text-[#89ceff]">NeuroPlant</h1>
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-[#1a2026] hover:text-[#0ea5e9]"
            >
              <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
      <div className="border-t border-[#334155] p-4">
        <div className="flex items-center text-sm">
          <div className="h-8 w-8 rounded-full bg-[#334155] mr-3"></div>
          <div>
            <p className="font-medium">Admin User</p>
            <p className="text-xs text-[#bec8d2]">Plant Manager</p>
          </div>
        </div>
      </div>
    </div>
  );
}

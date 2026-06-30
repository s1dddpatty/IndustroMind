"use client";

import React, { memo } from "react";
import Link from "next/link";
import { Hexagon, ChevronDown, LogOut, User, Activity, Settings2 } from "lucide-react";
import { NAVIGATION_ITEMS } from "@/constants/navigation";
import { useActiveNavigation } from "../hooks/useActiveNavigation";
import { useTheme } from "@/hooks/useTheme";
import { DESIGN_TOKENS } from "@/constants/design";

export const Sidebar = memo(function Sidebar() {
  const { activeId } = useActiveNavigation();
  const { theme } = useTheme();
  
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);
  
  const tokens = DESIGN_TOKENS[theme];
  const navTokens = tokens.navigation;

  const mainNav = NAVIGATION_ITEMS.filter(item => !item.isBottom);
  const bottomNav = NAVIGATION_ITEMS.filter(item => item.isBottom);

  return (
    <aside className={`w-[280px] flex-shrink-0 flex flex-col h-screen ${navTokens.background} border-r ${navTokens.border} overflow-y-auto transition-colors duration-200`}>
      {/* Logo & Tagline */}
      <div className="px-6 pt-8 pb-4">
        <Link href="/" className="flex items-center gap-2 mb-2" aria-label="IndustroMind home">
          <Hexagon className={`h-8 w-8 ${navTokens.accent} fill-current transition-colors duration-200`} />
          <div>
            <span className={`text-xl font-extrabold ${navTokens.logoText} tracking-tight transition-colors duration-200`}>IndustroMind</span>
          </div>
        </Link>
        <p className={`text-[10px] ${tokens.text.secondary} font-medium uppercase tracking-wider transition-colors duration-200`}>AI Powered Industrial Intelligence</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 mt-14 space-y-1">
        {mainNav.map((item) => {
          const isActive = activeId === item.id;
          return (
            <Link
              key={item.id}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={`flex items-center gap-3 px-4 h-12 rounded-xl transition-colors duration-200 text-sm font-medium ${
                isActive 
                  ? `${navTokens.activeBg} ${navTokens.activeText} shadow-sm` 
                  : `${navTokens.muted} ${navTokens.hover}`
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.title}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className={`p-4 mt-auto border-t ${navTokens.border} flex flex-col gap-4 transition-colors duration-200`}>


        {/* Bottom Nav */}
        <nav className="space-y-1 mt-2">
          {bottomNav.map((item) => {
            const isActive = activeId === item.id;
            return (
              <Link
                key={item.id}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`flex items-center gap-3 px-4 h-12 rounded-xl transition-colors duration-200 text-sm font-medium ${
                  isActive 
                    ? `${navTokens.activeBg} ${navTokens.activeText} shadow-sm` 
                    : `${navTokens.muted} ${navTokens.hover}`
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.title}
              </Link>
            );
          })}
        </nav>

        {/* User Profile Dropdown */}
        <div className="relative mt-2">
          {isProfileOpen && (
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsProfileOpen(false)}
            />
          )}
          
          <div className={`absolute bottom-full left-0 w-full mb-2 z-50 transition-all duration-200 origin-bottom ${isProfileOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}`}>
            <div className={`w-full p-2 rounded-2xl bg-slate-900 border ${tokens.card.border} shadow-2xl flex flex-col gap-1`}>
              <div className="px-3 py-2 border-b border-slate-800/50 mb-1">
                <div className="text-[13px] font-bold text-white">Administrator</div>
                <div className={`text-[11px] ${tokens.text.secondary}`}>admin@industromind.ai</div>
              </div>
              <button className="flex items-center gap-3 px-3 py-2 rounded-xl text-[12px] font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors w-full text-left">
                <User className="w-4 h-4 text-slate-400" /> My Profile
              </button>
              <button className="flex items-center gap-3 px-3 py-2 rounded-xl text-[12px] font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors w-full text-left">
                <Activity className="w-4 h-4 text-slate-400" /> Activity
              </button>
              <button className="flex items-center gap-3 px-3 py-2 rounded-xl text-[12px] font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors w-full text-left">
                <Settings2 className="w-4 h-4 text-slate-400" /> Preferences
              </button>
              <div className="h-px w-full bg-slate-800/50 my-1" />
              <button className="flex items-center gap-3 px-3 py-2 rounded-xl text-[12px] font-bold text-red-400 hover:bg-red-500/10 transition-colors w-full text-left">
                <LogOut className="w-4 h-4" /> Log Out
              </button>
            </div>
          </div>

          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-800/50 transition-colors cursor-pointer ${isProfileOpen ? 'bg-slate-800/50' : ''}`}
          >
            <div className={`w-8 h-8 rounded-full ${navTokens.activeBg} flex items-center justify-center text-xs font-bold text-white transition-colors duration-200`}>
              AD
            </div>
            <div className="text-left flex-1">
              <div className={`text-xs font-bold ${navTokens.logoText} transition-colors duration-200`}>Admin User</div>
              <div className={`text-[10px] ${tokens.text.secondary} transition-colors duration-200 line-clamp-1`}>Plant Administrator</div>
            </div>
            <ChevronDown className={`h-4 w-4 ${navTokens.muted} transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>
    </aside>
  );
});

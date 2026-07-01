"use client";

import React from "react";
import { Plus, MessageSquare } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { DESIGN_TOKENS } from "@/constants/design";
import { HeroData } from "../constants/dashboardData";

interface DashboardHeroProps {
  data: HeroData;
  onUpload?: () => void;
}

export function DashboardHero({ data, onUpload }: DashboardHeroProps) {
  const { theme } = useTheme();
  const tokens = DESIGN_TOKENS[theme];

  return (
    <div className={`relative shrink-0 w-full rounded-2xl border ${tokens.card.border} ${tokens.card.background} shadow-sm overflow-hidden transition-colors duration-200 flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 py-2 min-h-[78px] gap-6`}>
      
      {/* Decorative Background */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        {/* Glow */}
        <div className={`absolute top-0 right-0 w-[500px] h-[500px] bg-brand/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 transition-opacity duration-200 ${theme === 'dark' ? 'opacity-100' : 'opacity-40'}`} />
        
        {/* Network Pattern */}
        <div 
          className={`absolute inset-0 transition-opacity duration-200 ${theme === 'dark' ? 'opacity-[0.03]' : 'opacity-[0.02]'}`}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '30px 30px'
          }}
        />
        
        {/* Subtle Green Gradient */}
        <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-brand/5 to-brand/10 transition-opacity duration-200 ${theme === 'dark' ? 'opacity-100' : 'opacity-30'}`} />
      </div>

      {/* Content - Must have higher z-index to stay above decorative bg */}
      <div className="relative z-10 flex flex-col gap-2.5">
        <h1 className={`text-[26px] font-bold ${tokens.text.primary} tracking-tight leading-none transition-colors duration-200`}>
          {data.greeting}
        </h1>
        <p className={`text-base ${tokens.text.secondary} transition-colors duration-200`}>
          {data.subtitle}
        </p>
      </div>

      <div className="relative z-10 flex items-center gap-4 shrink-0">
        <button 
          onClick={onUpload}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border ${tokens.border.strong} ${tokens.text.primary} ${tokens.button.ghostHover} transition-colors duration-200 font-medium text-sm bg-transparent`}
        >
          <Plus className="h-4 w-4" />
          {data.primaryAction}
        </button>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand text-white hover:bg-brand/90 hover:-translate-y-0.5 shadow-[0_4px_14px_0_rgba(82,183,136,0.39)] hover:shadow-[0_6px_20px_rgba(82,183,136,0.23)] transition-all duration-200 font-medium text-sm">
          <MessageSquare className="h-4 w-4" />
          {data.secondaryAction}
        </button>
      </div>
    </div>
  );
}

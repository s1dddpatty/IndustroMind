"use client";

import { Hexagon } from "lucide-react";
import { DESIGN_TOKENS } from "@/constants/design";
import { useTheme } from "@/hooks/useTheme";
import { DESIGN } from "@/features/shared/constants/design";

interface PlaceholderPageProps {
  title: string;
}

export function PlaceholderPage({ title }: PlaceholderPageProps) {
  const { theme } = useTheme();
  const tokens = DESIGN_TOKENS[theme];

  return (
    <div className={`flex flex-col items-center justify-center h-[calc(100vh-4rem)] ${DESIGN.spacing.page}`}>
      <div className={`w-16 h-16 rounded-2xl ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'} border flex items-center justify-center mb-6 transition-colors duration-200`}>
        <Hexagon className={`h-8 w-8 ${tokens.text.brand} ${theme === 'dark' ? 'opacity-50 fill-current/20' : 'opacity-80 fill-current/10'} transition-all duration-200`} />
      </div>
      <h2 className={`text-2xl font-bold ${tokens.text.primary} mb-2 transition-colors duration-200`}>{title}</h2>
      <p className={`${tokens.text.secondary} text-sm max-w-md text-center transition-colors duration-200`}>
        This workspace is fully structured but currently serves as a visual placeholder.
        Functionality will be connected in the next implementation phase.
      </p>
    </div>
  );
}

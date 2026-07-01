"use client";

import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { TopNavigation } from "./TopNavigation";
import { PageContainer } from "./PageContainer";
import { DESIGN_TOKENS } from "@/constants/design";
import { useTheme } from "@/hooks/useTheme";
import { AppShellProvider } from "../hooks/useAppShell";

interface PageLayoutProps {
  children: ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  const { theme } = useTheme();
  const colors = DESIGN_TOKENS[theme];

  return (
    <AppShellProvider>
      <div className={`flex h-screen w-full ${colors.background.main} ${colors.text.primary} font-sans overflow-hidden transition-colors duration-200`}>
        <Sidebar />
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          <TopNavigation />
          <main className="flex-1 min-h-0 overflow-hidden max-lg:overflow-y-auto relative flex flex-col">
            <PageContainer>
              {children}
            </PageContainer>
          </main>
        </div>
      </div>
    </AppShellProvider>
  );
}

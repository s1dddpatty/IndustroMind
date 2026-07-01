import { ReactNode } from "react";
import { PageLayout } from "@/features/app-shell/components/PageLayout";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Demo Workspace | IndustroMind",
  description: "Enterprise demo mode for IndustroMind.",
};

export default function DemoLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <PageLayout>
        {children}
      </PageLayout>
    </ThemeProvider>
  );
}

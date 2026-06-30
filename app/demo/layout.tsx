import { ReactNode } from "react";
import { PageLayout } from "@/features/app-shell/components/PageLayout";
import { DemoDataProvider } from "@/features/demo/providers/DemoDataProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Demo Workspace | IndustroMind",
  description: "Enterprise demo mode for IndustroMind.",
};

export default function DemoLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <DemoDataProvider>
        <PageLayout>
          {children}
        </PageLayout>
      </DemoDataProvider>
    </ThemeProvider>
  );
}

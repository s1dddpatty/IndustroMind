import { ReactNode } from "react";
import { PageLayout } from "@/features/app-shell/components/PageLayout";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Demo Workspace | IndustroMind",
  description: "Enterprise demo mode for IndustroMind.",
};

export default function DemoLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <ProtectedRoute>
        <PageLayout>
          {children}
        </PageLayout>
      </ProtectedRoute>
    </ThemeProvider>
  );
}

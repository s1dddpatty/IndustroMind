"use client";

import { ReactNode } from "react";

interface WorkspaceLayoutProps {
  header: ReactNode;
  kpis: ReactNode;
  primaryLeft: ReactNode;
  primaryCenter: ReactNode;
  primaryRight: ReactNode;
  secondaryLeft: ReactNode;
  secondaryCenter: ReactNode;
  secondaryRight: ReactNode;
}

export function WorkspaceLayout({
  header,
  kpis,
  primaryLeft,
  primaryCenter,
  primaryRight,
  secondaryLeft,
  secondaryCenter,
  secondaryRight
}: WorkspaceLayoutProps) {
  return (
    <div className="h-full w-full p-5 grid grid-rows-[auto_auto_2fr_1fr] gap-4">
      
      {/* Row 1: Header */}
      <div className="min-h-0">
        {header}
      </div>

      {/* Row 2: KPIs */}
      <div className="min-h-0">
        {kpis}
      </div>

      {/* Row 3: Primary Workspace (30/40/30) */}
      <div className="min-h-0 grid grid-cols-[3fr_4fr_3fr] gap-5">
        <div className="min-h-0 min-w-0">
          {primaryLeft}
        </div>
        <div className="min-h-0 min-w-0">
          {primaryCenter}
        </div>
        <div className="min-h-0 min-w-0">
          {primaryRight}
        </div>
      </div>

      {/* Row 4: Secondary Workspace (3 Equal Cols) */}
      <div className="min-h-0 grid grid-cols-3 gap-5">
        <div className="min-h-0 min-w-0">
          {secondaryLeft}
        </div>
        <div className="min-h-0 min-w-0">
          {secondaryCenter}
        </div>
        <div className="min-h-0 min-w-0">
          {secondaryRight}
        </div>
      </div>

    </div>
  );
}

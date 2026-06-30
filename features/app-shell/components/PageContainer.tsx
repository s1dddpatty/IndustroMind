"use client";

import { ReactNode } from "react";
import { useTheme } from "@/hooks/useTheme";
import { DESIGN_TOKENS } from "@/constants/design";

interface PageContainerProps {
  children: ReactNode;
  scrollable?: boolean;
}

/**
 * Global Page Container
 * This enforces the permanent UI architecture rule for consistent global margins.
 * Every top-level page must be wrapped in this container.
 * No individual page should define its own outer spacing.
 */
export function PageContainer({ children, scrollable = false }: PageContainerProps) {
  const { theme } = useTheme();
  const tokens = DESIGN_TOKENS[theme];

  const outerClasses = `flex-1 min-h-0 w-full flex flex-col overflow-hidden ${tokens.layout.pageMargin}`;

  if (scrollable) {
    return (
      <div className={outerClasses}>
        <div className="flex-1 min-h-0 w-full flex flex-col overflow-y-auto overflow-x-hidden hide-scrollbar relative">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className={outerClasses}>
      {children}
    </div>
  );
}

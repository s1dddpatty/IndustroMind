"use client";

import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { NAVIGATION_ITEMS } from "@/constants/navigation";

export function useActiveNavigation() {
  const pathname = usePathname();

  const activeItem = useMemo(() => {
    // Sort items by length of href descending to match more specific routes first
    // e.g., /demo/decision-assistant should match before /demo
    const sortedItems = [...NAVIGATION_ITEMS].sort((a, b) => b.href.length - a.href.length);
    
    // Find the first item whose href matches the beginning of the pathname
    const match = sortedItems.find(item => {
      if (!pathname) return false;
      if (item.href === "/demo") {
        return pathname === "/demo"; // exact match for dashboard
      }
      return pathname.startsWith(item.href);
    });

    return match || NAVIGATION_ITEMS[0];
  }, [pathname]);

  return {
    activeId: activeItem?.id || "",
    currentRoute: pathname,
  };
}

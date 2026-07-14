"use client";

import React from "react";
import { useTheme } from "@/hooks/useTheme";

interface SkeletonProps {
  className?: string;
  rounded?: "sm" | "md" | "lg" | "xl" | "full";
}

export function Skeleton({ className = "", rounded = "md" }: SkeletonProps) {
  const { theme } = useTheme();
  const roundedClass = `rounded-${rounded}`;
  
  // Use a subtle pulse animation matching our dark theme aesthetic
  const baseClass = theme === "dark" ? "bg-slate-800/50" : "bg-slate-200/50";

  return (
    <div className={`animate-pulse ${baseClass} ${roundedClass} ${className}`} aria-hidden="true" />
  );
}

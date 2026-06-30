import type { LucideIcon } from "lucide-react";

export interface NavLink {
  label: string;
  href: string;
  hasMenu?: boolean;
}

export interface KpiCardData {
  label: string;
  value: string;
  sublabel?: string;
  delta?: string;
  note?: string;
  icon: LucideIcon;
  className: string;
}

export interface TrustedCompany {
  name: string;
  logoSrc: string;
}

export interface FeatureCardData {
  title: string;
  description: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  arrowColor: string;
}

export interface CapabilityCardData {
  id: string; // Identifier for the illustration
  scrollTarget?: string; // Optional target ID for smooth scrolling
  title: string;
  description: string;
  number: number;
}

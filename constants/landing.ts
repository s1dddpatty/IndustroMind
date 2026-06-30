import {
  AlertTriangle,
  Brain,
  CheckCircle2,
  FileText,
  Hexagon,
  ShieldCheck,
  Share2,
  Sparkles,
  Zap,
} from "lucide-react";
import type { FeatureCardData, KpiCardData, NavLink, TrustedCompany } from "@/types/landing";

export const HERO_IMAGE_URL = "/images/hero-refinery.png";

export const HERO_CONTENT = {
  eyebrow: "AI-Powered Industrial Knowledge Intelligence",
  headline: "Turn industrial knowledge into",
  accent: "operational intelligence.",
  subtitle:
    "IndustroMind unifies your documents, assets, procedures and expert knowledge using AI, Knowledge Graphs and GraphRAG to deliver trusted operational intelligence.",
  primaryCta: "Get started free",
  secondaryCta: "Request a demo",
  trustItems: ["Quick setup", "Enterprise grade security", "Scales with your operations"],
};

export const NAV_LINKS: NavLink[] = [
  { label: "Product", href: "#product", hasMenu: true },
  { label: "Solutions", href: "#solutions", hasMenu: true },
  { label: "Resources", href: "#resources", hasMenu: true },
  { label: "Company", href: "#company", hasMenu: true },
  { label: "Pricing", href: "#pricing" },
];

export const KPI_CARDS: KpiCardData[] = [
  {
    label: "Knowledge Integrity",
    value: "92",
    sublabel: "Excellent",
    delta: "+5% this week",
    icon: ShieldCheck,
    className: "lg:absolute lg:right-6 lg:top-6 xl:right-8 xl:top-8",
  },
  {
    label: "Documents Ingested",
    value: "1,248",
    delta: "+156 this week",
    icon: FileText,
    className: "lg:absolute lg:right-6 lg:top-[calc(50%-56px)] xl:right-8",
  },
  {
    label: "Active Risks",
    value: "7",
    sublabel: "High priority",
    note: "3 awaiting action",
    icon: AlertTriangle,
    className: "lg:absolute lg:left-6 lg:top-[60%] xl:left-8",
  },
  {
    label: "AI Decision Briefs",
    value: "24",
    sublabel: "Generated this week",
    icon: Sparkles,
    className: "lg:absolute lg:right-6 lg:bottom-6 xl:right-8 xl:bottom-8",
  },
];

export const TRUSTED_COMPANIES = [
  { name: "ForgeWorks Industries", logoSrc: "/logos/forgeworks.svg" },
  { name: "NovaChem Solutions", logoSrc: "/logos/novachem.svg" },
  { name: "Titan Process Systems", logoSrc: "/logos/titan-process.svg" },
  { name: "Vertex Steel", logoSrc: "/logos/vertex-steel.svg" },
  { name: "IronPeak Energy", logoSrc: "/logos/ironpeak.svg" },
  { name: "Apex Industrial", logoSrc: "/logos/apex-industrial.svg" },
];

export const FEATURE_CARDS: FeatureCardData[] = [
  {
    title: "Unify Fragmented Knowledge",
    description:
      "Bring together documents, procedures, equipment data, and expert knowledge in one intelligent layer.",
    icon: Brain,
    iconBg: "#D8F3DC",
    iconColor: "#1B4332",
    arrowColor: "#52B788",
  },
  {
    title: "AI + Knowledge Graphs",
    description:
      "Our neuro-symbolic AI builds a living knowledge graph that evolves with your operations.",
    icon: Share2,
    iconBg: "#F3E8FF",
    iconColor: "#7C3AED",
    arrowColor: "#7C3AED",
  },
  {
    title: "Trusted & Compliant",
    description:
      "Built for industrial environments with enterprise-grade security, auditability, and compliance.",
    icon: ShieldCheck,
    iconBg: "#EFF6FF",
    iconColor: "#2563EB",
    arrowColor: "#2563EB",
  },
  {
    title: "Accelerate Decisions",
    description: "From predictive insights to decision briefs - act faster with confidence and clarity.",
    icon: Zap,
    iconBg: "#FFFBEB",
    iconColor: "#D97706",
    arrowColor: "#D97706",
  },
];

export const CAPABILITY_CARDS = [
  {
    id: "knowledge-graph",
    title: "Knowledge Graph",
    description: "Connect equipment, SOPs, experts and regulations.",
    number: 1,
  },
  {
    id: "document-processing",
    title: "Intelligent Document Processing",
    description: "Extract knowledge from PDFs, manuals and reports.",
    number: 2,
  },
  {
    id: "graphrag-search",
    title: "GraphRAG Search",
    description: "Ask questions grounded in your industrial knowledge.",
    number: 3,
  },
  {
    id: "compliance",
    title: "Compliance Intelligence",
    description: "Detect outdated SOPs and regulatory conflicts.",
    number: 4,
  },
  {
    id: "expert-knowledge",
    title: "Expert Knowledge Capture",
    description: "Preserve tribal knowledge before it disappears.",
    number: 5,
  },
  {
    id: "decision-briefs",
    title: "AI Decision Briefs",
    description: "Generate operational summaries in seconds.",
    number: 6,
  },
  {
    id: "asset-intelligence",
    title: "Asset Intelligence",
    description: "View every equipment relationship instantly.",
    number: 7,
  },
  {
    id: "operational-insights",
    scrollTarget: "asset-intelligence",
    title: "Operational Insights",
    description: "Dashboards, KPIs and knowledge health metrics.",
    number: 8,
  },
];

export const ICONS = {
  CheckCircle2,
  Hexagon,
};

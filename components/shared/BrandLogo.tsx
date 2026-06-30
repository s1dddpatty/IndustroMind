import { Hexagon } from "lucide-react";
import Link from "next/link";

interface BrandLogoProps {
  textColorClass?: string;
}

export function BrandLogo({ textColorClass = "text-slate-950" }: BrandLogoProps) {
  return (
    <Link
      href="/"
      aria-label="IndustroMind home"
      className="inline-flex items-center gap-2.5 rounded-[8px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
    >
      <span className="relative grid size-9 place-items-center rounded-[8px] bg-brand text-white shadow-[0_10px_20px_rgba(0,107,60,0.18)]">
        <Hexagon className="size-5" strokeWidth={2.4} />
        <span className="absolute size-2 rounded-full bg-white" />
      </span>
      <span className={`text-xl font-bold tracking-normal ${textColorClass}`}>
        Industro<span className="text-brand">Mind</span>
      </span>
    </Link>
  );
}

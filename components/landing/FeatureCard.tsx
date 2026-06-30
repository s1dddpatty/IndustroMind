

import { ArrowRight } from "lucide-react";
import type { FeatureCardData } from "@/types/landing";

export default function FeatureCard({ title, description, icon: Icon, iconBg, iconColor, arrowColor }: FeatureCardData) {
  return (
    <div className="group flex cursor-pointer flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-gray-300 hover:shadow-card-hover sm:p-8">
      <div className="flex items-center gap-4">
        <div className="grid size-12 shrink-0 place-items-center rounded-full" style={{ backgroundColor: iconBg }}>
          <Icon className="size-6" style={{ color: iconColor }} aria-hidden />
        </div>
        <h3 className="text-lg font-bold leading-tight tracking-tight text-gray-900">{title}</h3>
      </div>
      <p className="mt-5 flex-1 text-sm leading-relaxed text-gray-600">{description}</p>
      <div className="mt-6 flex items-center gap-2 font-medium" style={{ color: arrowColor }}>
        <ArrowRight className="size-5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
      </div>
    </div>
  );
}

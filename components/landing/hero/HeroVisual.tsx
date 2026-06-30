import { KPI_CARDS, HERO_IMAGE_URL } from "@/constants/landing";
import { KPIFloatingCard } from "./KPIFloatingCard";

export function HeroVisual() {
  return (
    <div className="relative min-h-[520px] rounded-2xl shadow-2xl ring-1 ring-gray-900/5 lg:min-h-[540px] -translate-y-8">
      <div className="absolute inset-0 overflow-hidden rounded-2xl">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={HERO_IMAGE_URL}
          alt="Industrial refinery facility"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white from-0% via-white/50 via-15% to-transparent to-30%" />
      </div>
      
      {/* KPI Cards Layer */}
      <div className="relative z-10 flex flex-col gap-4 pt-[240px] p-6 sm:pt-[300px] lg:absolute lg:inset-0 lg:block lg:p-0">
        {KPI_CARDS.map((card, index) => (
          <KPIFloatingCard key={card.label} {...card} index={index} />
        ))}
      </div>
    </div>
  );
}

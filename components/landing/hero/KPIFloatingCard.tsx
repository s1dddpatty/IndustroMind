"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { KpiCardData } from "@/types/landing";

interface KPIFloatingCardProps extends KpiCardData {
  index: number;
}

export function KPIFloatingCard({
  label,
  value,
  sublabel,
  delta,
  note,
  icon: Icon,
  className,
  index,
}: KPIFloatingCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut", delay: 0.25 + index * 0.1 }}
      className={cn(
        "relative rounded-2xl border border-gray-200/60 bg-white/90 p-5 shadow-sm backdrop-blur-md transition-all duration-200 hover:-translate-y-1 hover:shadow-card-hover lg:min-w-[220px]",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-5">
        <div>
          <p className="text-xs font-medium text-gray-600">{label}</p>
          <p className="mt-3 text-3xl font-extrabold leading-none tracking-[-0.02em] text-gray-900">{value}</p>

          {(sublabel || delta) && (
            <div className="mt-2 flex items-center gap-2 text-xs font-medium">
              {sublabel && <span className="text-gray-900">{sublabel}</span>}
              {delta && (
                <span className={cn(delta.startsWith("+") ? "text-brand-DEFAULT" : "text-red-600")}>{delta}</span>
              )}
            </div>
          )}

          {note && <p className="mt-1 text-xs text-gray-500">{note}</p>}
        </div>

        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-brand-pale text-brand-dark">
          <Icon className="size-5" aria-hidden />
        </span>
      </div>
    </motion.article>
  );
}

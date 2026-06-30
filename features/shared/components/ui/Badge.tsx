import { ReactNode } from "react";
import { DESIGN } from "@/features/shared/constants/design";

type BadgeVariant = "success" | "warning" | "danger" | "info" | "default";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export function Badge({ children, variant = "default", className = "" }: BadgeProps) {
  let colors = "";
  switch (variant) {
    case "success": colors = `${DESIGN.colors.status.success.bg} ${DESIGN.colors.status.success.text} ${DESIGN.colors.status.success.border}`; break;
    case "warning": colors = `${DESIGN.colors.status.warning.bg} ${DESIGN.colors.status.warning.text} ${DESIGN.colors.status.warning.border}`; break;
    case "danger": colors = `${DESIGN.colors.status.danger.bg} ${DESIGN.colors.status.danger.text} ${DESIGN.colors.status.danger.border}`; break;
    case "info": colors = `${DESIGN.colors.status.info.bg} ${DESIGN.colors.status.info.text} ${DESIGN.colors.status.info.border}`; break;
    default: colors = `bg-gray-800 text-gray-300 border-gray-700`; break;
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border ${colors} ${className}`}>
      {children}
    </span>
  );
}

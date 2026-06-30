import { ReactNode } from "react";
import { DESIGN } from "@/features/shared/constants/design";

interface CardProps {
  children: ReactNode;
  className?: string;
  noPadding?: boolean;
}

export function Card({ children, className = "", noPadding = false }: CardProps) {
  return (
    <div 
      className={`
        bg-[#111315] 
        border border-[rgba(255,255,255,0.06)]
        rounded-[20px] 
        shadow-sm
        ${noPadding ? '' : 'p-5'}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

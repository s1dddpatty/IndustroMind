import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export const buttonVariants: Record<ButtonVariant, string> = {
  primary:
    "bg-brand text-white shadow-[0_14px_28px_rgba(0,107,60,0.22)] hover:bg-brand-dark",
  secondary:
    "border border-slate-200 bg-white text-slate-950 shadow-[0_10px_24px_rgba(15,23,42,0.05)] hover:border-slate-300 hover:bg-slate-50",
  ghost: "text-slate-950 hover:bg-slate-100",
};

export function getButtonStyles(variant: ButtonVariant = "primary", className?: string) {
  return cn(
    "inline-flex h-12 items-center justify-center gap-2 rounded-[8px] px-6 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
    buttonVariants[variant],
    className
  );
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={getButtonStyles(variant, className)}
      {...props}
    />
  ),
);

Button.displayName = "Button";

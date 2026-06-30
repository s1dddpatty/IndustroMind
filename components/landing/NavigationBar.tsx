"use client";

import { ArrowRight, ChevronDown, Menu, X } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { NAV_LINKS } from "@/constants/landing";
import { cn } from "@/lib/utils";
import { BrandLogo } from "@/components/shared/BrandLogo";
import { getButtonStyles } from "@/components/ui/button";

export default function NavigationBar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200/60 bg-white/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6" aria-label="Primary">
        <BrandLogo />

        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="flex items-center gap-1 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
            >
              {link.label}
              {link.hasMenu ? <ChevronDown className="size-4" aria-hidden /> : null}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-4 md:flex">
          <Link href="/auth/login" className={getButtonStyles("ghost", "h-9 px-4 text-sm font-medium")}>
            Sign in
          </Link>
          <Link
            href="/auth/register"
            className={getButtonStyles("primary", "h-9 px-4 text-sm")}
          >
            Get started free
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>

        <button
          type="button"
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((current) => !current)}
          className="grid size-10 place-items-center rounded-lg border border-gray-200 text-gray-900 md:hidden"
        >
          {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      <div className={cn("overflow-hidden border-gray-200/60 bg-white md:hidden", isOpen ? "border-t" : "h-0")}>
        <div className="mx-auto flex max-w-7xl flex-col gap-1 px-6 py-4">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between rounded-lg py-3 text-sm font-medium text-gray-700"
            >
              {link.label}
              {link.hasMenu ? <ChevronDown className="size-4" aria-hidden /> : null}
            </a>
          ))}
          <Link href="/auth/login" className={getButtonStyles("secondary", "mt-3 w-full")}>
            Sign in
          </Link>
          <Link
            href="/auth/register"
            className={getButtonStyles("primary", "mt-2 w-full")}
          >
            Get started free <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </div>
    </header>
  );
}

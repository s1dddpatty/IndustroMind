"use client";

import { motion } from "framer-motion";
import { Sparkles, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { HERO_CONTENT } from "@/constants/landing";
import { Button } from "@/components/ui/button";
import { HeroVisual } from "./HeroVisual";

export default function HeroSection() {
  return (
    <section className="mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-[45fr_55fr] lg:gap-8 lg:items-center lg:py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-brand-dark shadow-sm">
          <Sparkles className="size-4 text-brand-light" aria-hidden />
          {HERO_CONTENT.eyebrow}
        </div>

        <h1 className="mt-8 max-w-[720px] text-[clamp(36px,4.5vw,60px)] font-extrabold leading-[1.1] tracking-[-0.03em] text-gray-900">
          {HERO_CONTENT.headline} <span className="text-brand-light">{HERO_CONTENT.accent}</span>
        </h1>

        <p className="mt-6 max-w-[600px] text-lg leading-[1.7] text-gray-600 sm:text-xl">
          {HERO_CONTENT.subtitle}
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Link href="/auth/register" passHref>
            <Button className="h-14 px-8 text-base">
              {HERO_CONTENT.primaryCta}
            </Button>
          </Link>
          <Link href="/demo" passHref>
            <Button variant="secondary" className="h-14 px-8 text-base">
              {HERO_CONTENT.secondaryCta}
            </Button>
          </Link>
        </div>

        <motion.ul
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 text-sm font-medium text-gray-600"
        >
          {HERO_CONTENT.trustItems.map((item) => (
            <li key={item} className="flex items-center gap-2">
              <CheckCircle2 className="size-5 text-brand-light" aria-hidden />
              {item}
            </li>
          ))}
        </motion.ul>
      </motion.div>

      <HeroVisual />
    </section>
  );
}

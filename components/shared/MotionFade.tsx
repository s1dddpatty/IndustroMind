"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface MotionFadeProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function MotionFade({ children, className, delay = 0 }: MotionFadeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.45, ease: "easeOut", delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

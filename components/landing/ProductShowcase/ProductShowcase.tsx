"use client";

import { motion } from "framer-motion";

export default function ProductShowcase() {
  return (
    <section className="bg-gray-50/50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
            See IndustroMind in Action
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-[1.7] text-gray-600 sm:text-xl">
            Watch how AI transforms fragmented industrial knowledge into operational intelligence in seconds.
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
        className="mx-auto mt-16 max-w-[1400px] px-4 sm:px-6 lg:px-8"
      >
        <div className="relative overflow-hidden rounded-[30px] border border-gray-200/60 bg-white shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] ring-1 ring-gray-900/5">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="pointer-events-none aspect-video w-full object-cover"
          >
            <source src="/videos/industromind-demo.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </motion.div>
    </section>
  );
}

"use client";

import { useRef, useState } from "react";
import { useKnowledgeGraphScroll } from "./hooks/useKnowledgeGraphScroll";
import VideoPlayer from "./VideoPlayer";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function KnowledgeGraphSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isSkipVisible, setIsSkipVisible] = useState(false);
  
  const { skip } = useKnowledgeGraphScroll({ sectionRef, videoRef, setIsSkipVisible });

  const handleSkip = () => {
    skip();
  };

  return (
    <section id="knowledge-graph" ref={sectionRef} className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-white">
      {/* GSAP Video Player */}
      <VideoPlayer ref={videoRef}>
        <AnimatePresence>
          {isSkipVisible && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              onClick={handleSkip}
              className="absolute right-6 bottom-6 z-20 flex items-center gap-2 rounded-full border border-gray-200/60 bg-white/85 px-4 py-2 text-xs font-semibold tracking-wide text-gray-700 shadow-sm backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-white hover:text-gray-900 hover:shadow-md"
            >
              Skip animation
              <ArrowRight className="h-3.5 w-3.5" />
            </motion.button>
          )}
        </AnimatePresence>
      </VideoPlayer>
    </section>
  );
}

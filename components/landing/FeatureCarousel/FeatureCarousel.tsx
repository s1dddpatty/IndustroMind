"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CAPABILITY_CARDS } from "@/constants/landing";
import FeatureCard from "./FeatureCard";

export default function FeatureCarousel() {
  const [cardsPerPage, setCardsPerPage] = useState(4);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCardsPerPage(1); // Mobile
      } else if (window.innerWidth < 1024) {
        setCardsPerPage(2); // Tablet
      } else {
        setCardsPerPage(4); // Desktop
      }
    };
    
    // Initial check
    handleResize();
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalPages = Math.ceil(CAPABILITY_CARDS.length / cardsPerPage);

  // Ensure current page is valid when resizing
  useEffect(() => {
    if (currentPage >= totalPages) {
      setCurrentPage(Math.max(0, totalPages - 1));
    }
  }, [totalPages, currentPage]);

  const nextPage = () => {
    if (currentPage < totalPages - 1) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  return (
    <section className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        
        {/* Header Section */}
        <div className="mb-16 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 shadow-sm ring-1 ring-primary/20">
            <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-primary">
              Powerful Capabilities
            </span>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
            Everything your industrial knowledge needs.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-600">
            IndustroMind combines AI and industrial knowledge graphs to help teams work smarter, stay compliant, and operate with confidence.
          </p>
        </div>

        {/* Carousel Track */}
        <div className="relative overflow-hidden w-full -mx-3 px-3">
          <motion.div
            className="flex flex-nowrap w-full"
            animate={{ x: `-${currentPage * 100}%` }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            {CAPABILITY_CARDS.map((card) => (
              <div
                key={card.id}
                className="w-full shrink-0 px-3 md:w-1/2 lg:w-1/4"
              >
                <FeatureCard {...card} />
              </div>
            ))}
          </motion.div>
        </div>

        {/* Pagination & Controls */}
        <div className="mt-12 flex items-center justify-center gap-8">
          <button
            onClick={prevPage}
            disabled={currentPage === 0}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-900 shadow-sm transition-all hover:bg-gray-50 hover:shadow disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i)}
                  className="relative h-2 w-2 rounded-full"
                  aria-label={`Go to page ${i + 1}`}
                >
                  <span className={`absolute inset-0 rounded-full transition-all duration-300 ${currentPage === i ? "bg-primary scale-125" : "bg-gray-200"}`}></span>
                </button>
              ))}
            </div>
            <span className="text-sm font-medium text-gray-500 tabular-nums">
              {currentPage + 1} / {totalPages}
            </span>
          </div>

          <button
            onClick={nextPage}
            disabled={currentPage === totalPages - 1}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-900 shadow-sm transition-all hover:bg-gray-50 hover:shadow disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Next page"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
        
      </div>
    </section>
  );
}

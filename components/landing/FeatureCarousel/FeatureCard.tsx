import { ArrowRight } from "lucide-react";
import type { CapabilityCardData } from "@/types/landing";
import { getIllustrationForId } from "./FeatureIllustrations";

export default function FeatureCard({ id, scrollTarget, title, description, number }: CapabilityCardData) {
  const handleScroll = () => {
    // The implementation is generic and uses the card's ID or an optional scrollTarget
    const targetElement = document.getElementById(scrollTarget ?? id);
    if (targetElement) {
      // Offset for sticky navbar to ensure content is fully visible
      const navbarOffset = 80;
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - navbarOffset;

      // Disable disruptive scroll triggers (like Knowledge Graph video pin) during smooth scroll
      (window as any).isProgrammaticNavigation = true;

      const handleScrollEnd = () => {
        (window as any).isProgrammaticNavigation = false;
        window.removeEventListener("scrollend", handleScrollEnd);
      };
      
      window.addEventListener("scrollend", handleScrollEnd);

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <div 
      onClick={handleScroll}
      className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-xl"
    >
      {/* Illustration Area */}
      <div className="relative h-48 w-full overflow-hidden bg-gray-50/50">

        {/* The Illustration */}
        <div className="h-full w-full transition-transform duration-500 ease-out group-hover:scale-105">
          {getIllustrationForId(id)}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-gray-600">{description}</p>
        
        {/* Arrow Button */}
        <div className="mt-auto pt-6 flex w-full justify-end">
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm transition-all duration-300 group-hover:border-primary/20 group-hover:bg-primary/5">
            <ArrowRight className="h-4 w-4 text-gray-400 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-primary" />
          </div>
        </div>
      </div>
    </div>
  );
}

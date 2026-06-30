"use client";

import { RefObject, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

interface UseKnowledgeGraphScrollProps {
  sectionRef: RefObject<HTMLDivElement | null>;
  videoRef: RefObject<HTMLVideoElement | null>;
  setIsSkipVisible: (visible: boolean) => void;
}

export function useKnowledgeGraphScroll({
  sectionRef,
  videoRef,
  setIsSkipVisible,
}: UseKnowledgeGraphScrollProps) {
  
  // Create a ref to hold the skip function so we can return it
  const skipRef = useRef<() => void>(() => {});
  
  useGSAP(
    () => {
      const video = videoRef.current;
      const section = sectionRef.current;
      
      if (!video || !section) return;

      let playbackState: "idle" | "starting" | "playing" | "ended" = "idle";
      let playTimeout: NodeJS.Timeout;

      // Single source of truth for releasing the pin and moving on
      const completeSection = () => {
        playbackState = "ended";
        clearTimeout(playTimeout);
        setIsSkipVisible(false);
        document.body.style.overflow = "";
      };

      // Expose skip function to the UI
      skipRef.current = () => {
        console.log("Video skipped");
        completeSection();
      };

      ScrollTrigger.create({
        trigger: section,
        start: "center center",
        onEnter: async () => {
          if ((window as any).isProgrammaticNavigation) {
            console.log("Bypassing Knowledge Graph pin due to programmatic navigation");
            return;
          }

          console.log("Entering section");
          if (playbackState === "idle") {
            playbackState = "starting";

            const navbarOffset = 80;
            const elementPosition = section.getBoundingClientRect().top;
            window.scrollTo({
              top: elementPosition + window.scrollY - navbarOffset,
              behavior: "instant"
            });

            document.body.style.overflow = "hidden";
            
            console.log("Calling video.play()");
            try {
              // Ensure we start from a clean state on enter
              video.currentTime = 0;
              await video.play();
              // Only advance to playing if we haven't been aborted by a rapid leave
              if (playbackState === "starting") {
                playbackState = "playing";
              }
            } catch (err: any) {
              console.error(err);
              document.body.style.overflow = "";
              playbackState = "idle";
            }
          }
        },
        onLeaveBack: () => {
          console.log("Leaving section backwards");
          clearTimeout(playTimeout);
          setIsSkipVisible(false);
          document.body.style.overflow = "";
          
          // Only pause and reset if it's safe to do so without interrupting a pending play()
          if (playbackState === "playing") {
            video.pause();
            video.currentTime = 0;
            playbackState = "idle";
          } else if (playbackState === "ended") {
            video.currentTime = 0;
            playbackState = "idle";
          } else if (playbackState === "starting") {
            // If we leave while it's still starting, we rely on the video's 'playing' or 'canplay' events 
            // or the promise catch to handle cleanup. For now, mark it idle so it can be re-triggered.
            playbackState = "idle";
          }
        }
      });

      const handlePlaying = () => {
        console.log("Video playing event");
        if (playbackState === "starting") {
          playbackState = "playing";
        }
        playTimeout = setTimeout(() => {
          setIsSkipVisible(true);
        }, 400);
      };

      const handleEnded = () => {
        console.log("Video ended");
        completeSection();
      };

      video.addEventListener("playing", handlePlaying);
      video.addEventListener("ended", handleEnded);

      return () => {
        clearTimeout(playTimeout);
        setIsSkipVisible(false);
        document.body.style.overflow = "";
        video.removeEventListener("playing", handlePlaying);
        video.removeEventListener("ended", handleEnded);
      };
    },
    { scope: sectionRef }
  );

  return { skip: () => skipRef.current() };
}

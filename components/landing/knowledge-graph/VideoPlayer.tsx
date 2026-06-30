"use client";

import { forwardRef, ReactNode } from "react";

interface VideoPlayerProps {
  children?: ReactNode;
}

const VideoPlayer = forwardRef<HTMLVideoElement, VideoPlayerProps>(({ children }, ref) => {
  return (
    <div className="relative flex h-[65vh] w-[78vw] items-center justify-center overflow-hidden rounded-[2rem] bg-gray-50 shadow-2xl ring-1 ring-gray-200/50">
      <video
        ref={ref}
        src="/videos/knowledge-graph.mp4"
        muted
        playsInline
        preload="auto"
        controls={false}
        loop={false}
        className="h-full w-full object-cover"
      />
      {children}
    </div>
  );
});

VideoPlayer.displayName = "VideoPlayer";

export default VideoPlayer;

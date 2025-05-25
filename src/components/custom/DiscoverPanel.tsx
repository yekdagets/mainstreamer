"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { ShortVideoPlayer } from "@/components/player/ShortVideoPlayer";
import { Button } from "@/components/ui/button";
import { videos } from "@/data/videos";

interface DiscoverPanelProps {
  onClose: () => void;
}

export function DiscoverPanel({ onClose }: DiscoverPanelProps) {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const changeVideo = useCallback(
    (direction: "next" | "prev") => {
      if (isScrolling || isInteracting) return;

      setIsScrolling(true);

      if (direction === "next" && currentVideoIndex < videos.length - 1) {
        setCurrentVideoIndex((prev) => prev + 1);
      } else if (direction === "prev" && currentVideoIndex > 0) {
        setCurrentVideoIndex((prev) => prev - 1);
      }

      setTimeout(() => {
        setIsScrolling(false);
      }, 600);
    },
    [currentVideoIndex, videos.length, isScrolling, isInteracting]
  );

  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout | null = null;

    const handleWheel = (e: WheelEvent) => {
      if (isInteracting || isScrolling) return;

      e.preventDefault();
      e.stopPropagation();

      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }

      scrollTimeout = setTimeout(() => {
        if (Math.abs(e.deltaY) > 5) {
          if (e.deltaY > 0) {
            changeVideo("next");
          } else {
            changeVideo("prev");
          }
        }
      }, 10);
    };

    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        (target as HTMLInputElement).type === "range" ||
        target.closest(".pointer-events-auto") ||
        target.closest("input")
      ) {
        setIsInteracting(true);
      }
    };

    const handleMouseUp = () => {
      setTimeout(() => {
        setIsInteracting(false);
      }, 100);
    };

    const handleTouchStart = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      if (
        (target as HTMLInputElement).type === "range" ||
        target.closest(".pointer-events-auto") ||
        target.closest("input")
      ) {
        setIsInteracting(true);
      }
    };

    const handleTouchEnd = () => {
      setTimeout(() => {
        setIsInteracting(false);
      }, 100);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false });
      container.addEventListener("mousedown", handleMouseDown);
      container.addEventListener("mouseup", handleMouseUp);
      container.addEventListener("touchstart", handleTouchStart);
      container.addEventListener("touchend", handleTouchEnd);
    }

    return () => {
      if (container) {
        container.removeEventListener("wheel", handleWheel);
        container.removeEventListener("mousedown", handleMouseDown);
        container.removeEventListener("mouseup", handleMouseUp);
        container.removeEventListener("touchstart", handleTouchStart);
        container.removeEventListener("touchend", handleTouchEnd);
      }
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }, [changeVideo, isScrolling, isInteracting]);

  const handleVideoEnd = useCallback(() => {
    if (
      currentVideoIndex < videos.length - 1 &&
      !isInteracting &&
      !isScrolling
    ) {
      setTimeout(() => {
        setCurrentVideoIndex((prev) => prev + 1);
      }, 500);
    }
  }, [currentVideoIndex, videos.length, isInteracting, isScrolling]);

  return (
    <div
      ref={containerRef}
      className="h-screen flex flex-col bg-black relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 z-30 bg-gradient-to-b from-black/70 to-transparent p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-white text-lg font-semibold">Discover</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:bg-white/20"
          >
            <XMarkIcon className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="flex-1 relative">
        {videos.map((video, index) => (
          <motion.div
            key={video.id}
            className="absolute inset-0"
            initial={{ y: index === 0 ? 0 : "100%" }}
            animate={{
              y:
                index === currentVideoIndex
                  ? 0
                  : index < currentVideoIndex
                  ? "-100%"
                  : "100%",
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
              mass: 1,
            }}
          >
            <ShortVideoPlayer
              video={video}
              isActive={index === currentVideoIndex}
              onVideoEnd={handleVideoEnd}
            />
          </motion.div>
        ))}
      </div>

      <div className="absolute bottom-4 right-4 z-30 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
        {currentVideoIndex + 1} / {videos.length}
      </div>
    </div>
  );
}

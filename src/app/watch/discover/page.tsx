"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { ShortVideoPlayer } from "@/components/player/ShortVideoPlayer";
import { Button } from "@/components/ui/button";
import { videos } from "@/data/videos";

export default function DiscoverPage() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [startY, setStartY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const changeVideo = useCallback(
    (direction: "next" | "prev") => {
      if (isScrolling || isInteracting) return;

      if (direction === "next" && currentVideoIndex >= videos.length - 1)
        return;
      if (direction === "prev" && currentVideoIndex <= 0) return;

      setIsScrolling(true);

      if (direction === "next") {
        setCurrentVideoIndex((prev) => Math.min(prev + 1, videos.length - 1));
      } else {
        setCurrentVideoIndex((prev) => Math.max(prev - 1, 0));
      }

      setTimeout(() => {
        setIsScrolling(false);
      }, 600);
    },
    [currentVideoIndex, videos.length, isScrolling, isInteracting]
  );

  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout | null = null;

    const handleTouchStart = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      if (
        (target as HTMLInputElement).type === "range" ||
        target.closest(".pointer-events-auto") ||
        target.closest("input")
      ) {
        setIsInteracting(true);
        return;
      }

      setStartY(e.touches[0].clientY);
      setIsDragging(true);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isInteracting) return;
      e.preventDefault();
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isInteracting) {
        setTimeout(() => setIsInteracting(false), 100);
        return;
      }

      if (!isDragging || isScrolling) return;

      const endY = e.changedTouches[0].clientY;
      const deltaY = startY - endY;
      const threshold = 50;

      if (Math.abs(deltaY) > threshold) {
        if (deltaY > 0) {
          changeVideo("next");
        } else {
          changeVideo("prev");
        }
      }

      setIsDragging(false);
    };

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

    const container = containerRef.current;
    if (container) {
      container.addEventListener("touchstart", handleTouchStart, {
        passive: false,
      });
      container.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
      container.addEventListener("touchend", handleTouchEnd, {
        passive: false,
      });
      container.addEventListener("wheel", handleWheel, { passive: false });
    }

    return () => {
      if (container) {
        container.removeEventListener("touchstart", handleTouchStart);
        container.removeEventListener("touchmove", handleTouchMove);
        container.removeEventListener("touchend", handleTouchEnd);
        container.removeEventListener("wheel", handleWheel);
      }
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }, [changeVideo, startY, isDragging, isScrolling, isInteracting]);

  const handleVideoEnd = useCallback(() => {
    if (
      currentVideoIndex < videos.length - 1 &&
      !isInteracting &&
      !isScrolling
    ) {
      setTimeout(() => {
        setCurrentVideoIndex((prev) => Math.min(prev + 1, videos.length - 1));
      }, 500);
    }
  }, [currentVideoIndex, videos.length, isInteracting, isScrolling]);

  return (
    <div
      ref={containerRef}
      className="h-screen flex flex-col bg-black relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 z-30 bg-gradient-to-b from-black/70 to-transparent p-4 pt-12">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </Button>
          <h2 className="text-white text-lg font-semibold">Discover</h2>
          <div className="w-10" />
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

"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatDuration, formatViews, formatUploadDate } from "@/lib/utils";
import { Video } from "@/types/Video";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface VideoCardProps {
  video: Video;
  layout?: "grid" | "row";
}

export function VideoCard({ video, layout = "grid" }: VideoCardProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [hasStartedPreview, setHasStartedPreview] = useState(false);
  const previewTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    previewTimeoutRef.current = setTimeout(() => {
      setIsHovering(true);
      setHasStartedPreview(true);
    }, 800);
  };

  const handleMouseLeave = () => {
    if (previewTimeoutRef.current) {
      clearTimeout(previewTimeoutRef.current);
    }
    setIsHovering(false);
  };

  useEffect(() => {
    if (isHovering && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch((error) => {
        console.error("Auto-play was prevented:", error);
      });
    }
  }, [isHovering]);

  useEffect(() => {
    return () => {
      if (previewTimeoutRef.current) {
        clearTimeout(previewTimeoutRef.current);
      }
    };
  }, []);

  return (
    <Link href={`/watch/${video.id}`} className="block group">
      <Card
        hoverable
        className={`overflow-hidden ${layout === "row" ? "flex" : ""}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className={`relative ${
            layout === "grid" ? "aspect-video w-full" : "aspect-video w-1/3"
          }`}
        >
          {hasStartedPreview ? (
            <div
              className={`absolute inset-0 bg-black transition-opacity duration-300 ${
                isHovering ? "opacity-100" : "opacity-0"
              }`}
            >
              <video
                ref={videoRef}
                src={video.videoUrl}
                muted
                loop
                playsInline
                className="w-full h-full object-cover transform scale-105 transition-transform duration-700"
              />
              <div
                className="absolute inset-0 bg-cover"
                style={{
                  backgroundImage: `url(${video.thumbnailUrl})`,
                  opacity: isHovering ? 0 : 1,
                  transition: "opacity 300ms ease-in-out",
                }}
              />
            </div>
          ) : null}

          <Image
            src={video.thumbnailUrl}
            alt={video.title}
            fill
            className={`object-cover transition-opacity duration-300 ${
              isHovering && hasStartedPreview ? "opacity-0" : "opacity-100"
            }`}
          />

          <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
            {formatDuration(video.duration)}
          </div>
        </div>

        <div className={layout === "row" ? "flex-1" : ""}>
          <CardContent className="p-3">
            <h3
              className={`font-semibold line-clamp-2 group-hover:text-blue-600 transition-colors duration-200 ${
                layout === "row" ? "text-sm" : "text-base"
              }`}
            >
              {video.title}
            </h3>
            <p className="text-sm text-gray-500 mt-1">{video.creator.name}</p>
          </CardContent>
          <CardFooter className="p-3 pt-0">
            <div className="flex items-center text-xs text-gray-500">
              <span>{formatViews(video.views)}</span>
              <span className="mx-1">•</span>
              <span>{formatUploadDate(video.uploadDate)}</span>
            </div>
          </CardFooter>
        </div>
      </Card>
    </Link>
  );
}

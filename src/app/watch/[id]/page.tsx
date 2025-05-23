"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getVideoById, getRelatedVideos } from "@/services/videoService";

import { Video } from "@/types/Video";
import { VideoPlayer } from "@/components/player/VideoPlayer";
import { VideoInfo } from "@/components/custom/VideoInfo";
import { VideoSection } from "@/components/custom/VideoSection";

export default function WatchPage() {
  const { id } = useParams<{ id: string }>();
  const [video, setVideo] = useState<Video | null>(null);
  const [relatedVideos, setRelatedVideos] = useState<Video[]>([]);

  useEffect(() => {
    if (id) {
      const videoData = getVideoById(id as string);
      if (videoData) {
        setVideo(videoData);
        setRelatedVideos(getRelatedVideos(id as string));
      }
    }
  }, [id]);

  if (!video) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <p className="text-lg text-gray-500">Loading video...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="rounded-lg overflow-hidden shadow-md">
            <VideoPlayer video={video} />
          </div>

          <VideoInfo video={video} />
        </div>

        <div className="lg:col-span-1">
          <h2 className="text-xl font-bold mb-4">More like {video.title}</h2>
          <div className="space-y-4">
            <VideoSection
              videos={relatedVideos}
              layout="row"
              showTitle={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

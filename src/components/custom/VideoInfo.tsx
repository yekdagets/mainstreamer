import { useState } from "react";
import Image from "next/image";
import {
  formatViews,
  formatUploadDate,
  formatSubscribers,
  getRandomTagColor,
} from "@/lib/utils";
import { Video } from "@/types/Video";
import { Button } from "@/components/ui/button";

interface VideoInfoProps {
  video: Video;
}

export function VideoInfo({ video }: VideoInfoProps) {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  return (
    <div className="mt-4">
      <h1 className="text-2xl font-bold">{video.title}</h1>

      <div className="flex flex-col md:flex-row md:items-center justify-between mt-4">
        <div className="flex items-center">
          <div className="relative h-10 w-10 rounded-full overflow-hidden mr-3">
            <Image
              src={video.creator.avatarUrl}
              alt={video.creator.name}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h3 className="font-medium">{video.creator.name}</h3>
            <p className="text-sm text-gray-500">
              {formatSubscribers(video.creator.subscribers)}
            </p>
          </div>
          <Button className="ml-4" size="sm" variant="tertiary">
            Subscribe
          </Button>
        </div>

        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          <div className="text-sm text-gray-500">
            {formatViews(video.views)} • {formatUploadDate(video.uploadDate)}
          </div>

          <div className="flex space-x-1">
            {video.tags.map((tag) => (
              <span
                key={tag}
                className={`text-xs px-3 py-1.5 rounded-full inline-block mb-1.5 mr-1.5 ${getRandomTagColor()}`}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 bg-gray-50 p-4 rounded-lg">
        <div
          className={`text-gray-700 overflow-hidden ${
            isDescriptionExpanded ? "max-h-none" : "max-h-12"
          }`}
          style={{ transition: "max-height 0.3s ease-in-out" }}
        >
          {video.description}
        </div>
        {video.description.length > 250 && (
          <Button
            variant="link"
            size="sm"
            className="p-0 mt-2 text-blue-600 h-auto"
            onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
          >
            {isDescriptionExpanded ? "Show less" : "Show more"}
          </Button>
        )}
      </div>
    </div>
  );
}

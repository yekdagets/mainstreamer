import Link from "next/link";
import Image from "next/image";
import { formatDuration, formatViews, formatUploadDate } from "@/lib/utils";
import { Video } from "@/types/Video";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardTitle 
} from "@/components/ui/card";

interface VideoCardProps {
  video: Video;
}

export function VideoCard({ video }: VideoCardProps) {
  return (
    <Link href={`/watch/${video.id}`} className="block group">
      <Card hoverable className="overflow-hidden">
        <div className="relative aspect-video">
          <Image
            src={video.thumbnailUrl}
            alt={video.title}
            fill
            className="object-cover"
          />
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
            {formatDuration(video.duration)}
          </div>
        </div>
        <CardContent className="p-3">
          <CardTitle className="text-base font-semibold line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
            {video.title}
          </CardTitle>
          <p className="text-sm text-gray-500 mt-1">{video.creator.name}</p>
        </CardContent>
        <CardFooter className="p-3 pt-0">
          <div className="flex items-center text-xs text-gray-500">
            <span>{formatViews(video.views)}</span>
            <span className="mx-1">•</span>
            <span>{formatUploadDate(video.uploadDate)}</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
import { Video } from "@/types/Video";
import { VideoCard } from "./VideoCard";

interface VideoSectionProps {
  title?: string;
  videos: Video[];
  layout?: "grid" | "row";
  showTitle?: boolean;
}

export function VideoSection({
  title,
  videos,
  layout = "grid",
  showTitle = true,
}: VideoSectionProps) {
  return (
    <section className="mb-12">
      {showTitle && title && (
        <h2 className="text-2xl font-bold mb-6 text-gray-800">{title}</h2>
      )}
      <div
        className={
          layout === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            : "space-y-4"
        }
      >
        {videos.map((video) => (
          <VideoCard key={video.id} video={video} layout={layout} />
        ))}
      </div>
    </section>
  );
}

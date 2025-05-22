import { Video } from "@/types/Video";
import { videos } from "@/data/videos";

export const getVideoById = (id: string): Video | undefined => {
  return videos.find((video) => video.id === id);
};

export const getRelatedVideos = (
  videoId: string,
  limit: number = 4
): Video[] => {
  const currentVideo = getVideoById(videoId);
  if (!currentVideo) return [];

  return videos
    .filter((video) => video.id !== videoId)
    .sort((a, b) => {
      const aMatchCount =
        a.tags.filter((tag) => currentVideo.tags.includes(tag)).length +
        (a.category === currentVideo.category ? 3 : 0);
      const bMatchCount =
        b.tags.filter((tag) => currentVideo.tags.includes(tag)).length +
        (b.category === currentVideo.category ? 3 : 0);
      return bMatchCount - aMatchCount;
    })
    .slice(0, limit);
};

export const getPopularVideos = (limit: number = 10): Video[] => {
  return [...videos].sort((a, b) => b.views - a.views).slice(0, limit);
};

export const getRecentVideos = (limit: number = 10): Video[] => {
  return [...videos]
    .sort(
      (a, b) =>
        new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
    )
    .slice(0, limit);
};

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
    .map((video) => {
      const tagMatchScore =
        video.tags.filter((tag) => currentVideo.tags.includes(tag)).length * 2;

      const categoryMatchScore =
        video.category === currentVideo.category ? 3 : 0;

      const creatorMatchScore =
        video.creator.id === currentVideo.creator.id ? 4 : 0;

      const totalScore = tagMatchScore + categoryMatchScore + creatorMatchScore;

      return {
        video,
        score: totalScore,
      };
    })
    .sort((a, b) => b.score - a.score)
    .map((item) => item.video)
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

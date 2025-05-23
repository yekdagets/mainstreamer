import { videos } from "@/data/videos";

export const getAllCategories = (): string[] => {
  const categories = Array.from(new Set(videos.map((video) => video.category)));
  return categories.sort();
};

export const getCategoryVideoCount = (category: string): number => {
  return videos.filter((video) => video.category === category).length;
};

export const getVideosByCategory = (category: string | null) => {
  if (!category) return videos;
  return videos.filter((video) => video.category === category);
};

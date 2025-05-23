import { Video } from "@/types/Video";
import { videos } from "@/data/videos";

export const searchVideos = (query: string): Video[] => {
  const lowerCaseQuery = query.toLowerCase().trim();

  if (!lowerCaseQuery) return [];

  return videos.filter((video) => {
    const titleMatch = video.title.toLowerCase().includes(lowerCaseQuery);

    const creatorMatch = video.creator.name
      .toLowerCase()
      .includes(lowerCaseQuery);

    const tagMatch = video.tags.some((tag) =>
      tag.toLowerCase().includes(lowerCaseQuery)
    );

    const descriptionMatch = video.description
      .toLowerCase()
      .includes(lowerCaseQuery);

    return titleMatch || creatorMatch || tagMatch || descriptionMatch;
  });
};

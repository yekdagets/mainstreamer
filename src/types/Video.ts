export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: number;
  views: number;
  uploadDate: string;
  creator: {
    id: string;
    name: string;
    avatarUrl: string;
    subscribers: number;
  };
  tags: string[];
  category: string;
}

"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Video } from "@/types/Video";
import { videos } from "@/data/videos";
import { VideoCard } from "@/components/custom/VideoCard";
import { Button } from "@/components/ui/button";
import { Tabs } from "@/components/ui/tabs";
import { PageTransition } from "@/components/layout/PageTransition";
import { Loading } from "@/components/ui/loading";
import {
  HeartIcon,
  BookmarkIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

export default function MyWatchList() {
  const [likedVideos, setLikedVideos] = useState<Video[]>([]);
  const [savedVideos, setSavedVideos] = useState<Video[]>([]);
  const [activeTab, setActiveTab] = useState<"liked" | "saved">("saved");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    try {
      const watchList = localStorage.getItem("myWatchList")
        ? JSON.parse(localStorage.getItem("myWatchList") || "{}")
        : { myLikes: [], mySaves: [] };

      const likedVideoIds = watchList.myLikes || [];
      const savedVideoIds = watchList.mySaves || [];

      const likedVideosData = videos.filter((video) =>
        likedVideoIds.includes(video.id)
      );
      const savedVideosData = videos.filter((video) =>
        savedVideoIds.includes(video.id)
      );

      setTimeout(() => {
        setLikedVideos(likedVideosData);
        setSavedVideos(savedVideosData);
        setIsLoading(false);
      }, 600);
    } catch (error) {
      console.error("Error accessing localStorage:", error);
      setIsLoading(false);
    }
  }, []);

  const clearList = (type: "liked" | "saved") => {
    try {
      const watchList = localStorage.getItem("myWatchList")
        ? JSON.parse(localStorage.getItem("myWatchList") || "{}")
        : { myLikes: [], mySaves: [] };

      if (type === "liked") {
        watchList.myLikes = [];
        setLikedVideos([]);
      } else {
        watchList.mySaves = [];
        setSavedVideos([]);
      }

      localStorage.setItem("myWatchList", JSON.stringify(watchList));
    } catch (error) {
      console.error("Error updating localStorage:", error);
    }
  };

  const currentVideos = activeTab === "liked" ? likedVideos : savedVideos;

  const tabs = [
    {
      id: "saved",
      label: "Saved",
      count: savedVideos.length,
      icon: <BookmarkIcon className="h-4 w-4" />,
    },
    {
      id: "liked",
      label: "Liked",
      count: likedVideos.length,
      icon: <HeartIcon className="h-4 w-4" />,
    },
  ];

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loading variant="brand" text="Loading your watch list..." />
        </div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-8">
        <motion.div
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold">My Watch List</h1>
          {currentVideos.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <Button
                variant="outline"
                size="sm"
                onClick={() => clearList(activeTab)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
              >
                <TrashIcon className="h-4 w-4 mr-2" />
                Clear {activeTab === "liked" ? "Liked" : "Saved"}
              </Button>
            </motion.div>
          )}
        </motion.div>

        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Tabs
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={(tabId) => setActiveTab(tabId as "liked" | "saved")}
            variant="pills"
            size="md"
          />
        </motion.div>

        {currentVideos.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            {currentVideos.map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <VideoCard video={video} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <div className="mb-4">
              {activeTab === "saved" ? (
                <BookmarkIcon className="h-16 w-16 text-gray-300 mx-auto" />
              ) : (
                <HeartIcon className="h-16 w-16 text-gray-300 mx-auto" />
              )}
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No {activeTab === "liked" ? "liked" : "saved"} videos yet
            </h3>
            <p className="text-gray-500 mb-6">
              Start {activeTab === "liked" ? "liking" : "saving"} videos to see
              them here.
            </p>
            <Button
              variant="primary"
              onClick={() => (window.location.href = "/")}
            >
              Discover Videos
            </Button>
          </motion.div>
        )}
      </div>
    </PageTransition>
  );
}

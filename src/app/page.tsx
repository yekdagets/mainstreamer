"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { getPopularVideos, getRecentVideos } from "@/services/videoService";
import { getVideosByCategory } from "@/services/categoryService";
import { Button } from "@/components/ui/button";
import { Loading } from "@/components/ui/loading";
import { VideoSection } from "@/components/custom/VideoSection";
import { CategoryTabs } from "@/components/custom/CategoryTabs";
import { PageTransition } from "@/components/layout/PageTransition";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const allPopularVideos = getPopularVideos();
  const allRecentVideos = getRecentVideos();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const filteredPopularVideos = useMemo(() => {
    const categoryVideos = getVideosByCategory(activeCategory);
    return allPopularVideos.filter((video) =>
      categoryVideos.some((catVideo) => catVideo.id === video.id)
    );
  }, [allPopularVideos, activeCategory]);

  const filteredRecentVideos = useMemo(() => {
    const categoryVideos = getVideosByCategory(activeCategory);
    return allRecentVideos.filter((video) =>
      categoryVideos.some((catVideo) => catVideo.id === video.id)
    );
  }, [allRecentVideos, activeCategory]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading
          variant="brand"
          text="Watch the mainstream videos in one place!"
        />
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-8">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h1 className="text-3xl font-bold mb-2">
            {activeCategory ? `${activeCategory} Videos` : "Discover Videos"}
          </h1>
          <p className="text-gray-600">
            {activeCategory
              ? `Explore the best ${activeCategory.toLowerCase()} content`
              : "Watch the latest and most popular videos"}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <CategoryTabs
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            showCounts={true}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          {filteredPopularVideos.length > 0 && (
            <VideoSection
              title={
                activeCategory ? `Popular ${activeCategory}` : "Popular Videos"
              }
              videos={filteredPopularVideos}
            />
          )}

          {filteredRecentVideos.length > 0 && (
            <VideoSection
              title={
                activeCategory ? `Recent ${activeCategory}` : "Recent Videos"
              }
              videos={filteredRecentVideos}
            />
          )}
        </motion.div>

        {filteredPopularVideos.length === 0 &&
          filteredRecentVideos.length === 0 &&
          activeCategory && (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <div className="mb-4">
                <svg
                  className="h-16 w-16 text-gray-300 mx-auto"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No {activeCategory} videos found
              </h3>
              <p className="text-gray-500 mb-6">
                Try selecting a different category or browse all videos.
              </p>
              <Button
                variant="ghost"
                onClick={() => setActiveCategory(null)}
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              >
                Show all videos
              </Button>
            </motion.div>
          )}
      </div>
    </PageTransition>
  );
}

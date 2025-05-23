"use client";

import { useState, useRef } from "react";
import { searchVideos } from "@/services/searchService";
import { Video } from "@/types/Video";
import { useRouter } from "next/navigation";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Loading } from "@/components/ui/loading";

export function SearchPopover() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Video[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const router = useRouter();
  const popoverRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(popoverRef, () => setIsOpen(false));

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim().length > 2) {
      setIsSearching(true);
      setIsOpen(true);

      setTimeout(() => {
        const searchResults = searchVideos(value);
        setResults(searchResults.slice(0, 5));
        setIsSearching(false);
      }, 300);
    } else {
      setResults([]);
      setIsOpen(false);
      setIsSearching(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim().length > 0) {
      if (results.length > 0) {
        router.push(`/watch/${results[0].id}`);
        setIsOpen(false);
        setQuery("");
      }
    }
  };

  const handleVideoSelect = (videoId: string) => {
    router.push(`/watch/${videoId}`);
    setIsOpen(false);
    setQuery("");
  };

  return (
    <div className="relative" ref={popoverRef}>
      <form onSubmit={handleSearchSubmit} className="relative">
        <input
          type="text"
          placeholder="Search videos..."
          value={query}
          onChange={handleSearchChange}
          onFocus={() => query.trim().length > 2 && setIsOpen(true)}
          className="w-64 pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
      </form>

      {isOpen && isSearching && (
        <div className="absolute z-10 mt-2 w-96 bg-white rounded-md shadow-lg overflow-hidden border">
          <div className="p-6 text-center">
            <Loading variant="dots" text="Searching videos..." />
          </div>
        </div>
      )}

      {isOpen && !isSearching && results.length > 0 && (
        <div className="absolute z-10 mt-2 w-96 bg-white rounded-md shadow-lg overflow-hidden border">
          <div className="max-h-96 overflow-y-auto">
            {results.map((video) => (
              <div
                key={video.id}
                className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                onClick={() => handleVideoSelect(video.id)}
              >
                <div className="flex items-start space-x-3">
                  <div className="relative w-24 h-16 flex-shrink-0">
                    <img
                      src={video.thumbnailUrl}
                      alt={video.title}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium line-clamp-2 text-gray-900">
                      {video.title}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">
                      {video.creator.name}
                    </p>
                    <div className="flex items-center text-xs text-gray-400 mt-1">
                      <span>{video.views.toLocaleString()} views</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {results.length === 5 && (
            <div className="p-2 text-center text-xs text-gray-500 bg-gray-50">
              Press Enter to see more results
            </div>
          )}
        </div>
      )}

      {isOpen &&
        !isSearching &&
        query.trim().length > 2 &&
        results.length === 0 && (
          <div className="absolute z-10 mt-2 w-96 bg-white rounded-md shadow-lg overflow-hidden border">
            <div className="p-4 text-center text-gray-500">
              <p className="text-sm">No videos found for "{query}"</p>
            </div>
          </div>
        )}
    </div>
  );
}

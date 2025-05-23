"use client";

import { useState, useRef, useEffect } from "react";
import ReactPlayer from "react-player";
import {
  PlayIcon,
  PauseIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  ArrowsPointingOutIcon,
} from "@heroicons/react/24/solid";
import { formatDuration } from "@/lib/utils";
import { Video } from "@/types/Video";
import { Button } from "@/components/ui/button";
import { HeartIcon, BookmarkIcon } from "@heroicons/react/24/outline";
import {
  HeartIcon as HeartIconSolid,
  BookmarkIcon as BookmarkIconSolid,
} from "@heroicons/react/24/solid";

interface VideoPlayerProps {
  video: Video;
}

export function VideoPlayer({ video }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [previousVolume, setPreviousVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [played, setPlayed] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [isVideoEnded, setIsVideoEnded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const playerRef = useRef<ReactPlayer>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    try {
      const watchList = localStorage.getItem("myWatchList")
        ? JSON.parse(localStorage.getItem("myWatchList") || "{}")
        : { myLikes: [], mySaves: [] };

      setIsLiked(watchList.myLikes?.includes(video.id) || false);
      setIsSaved(watchList.mySaves?.includes(video.id) || false);
    } catch (error) {
      console.error("Error accessing localStorage:", error);
    }
  }, [video.id]);

  useEffect(() => {
    const showControlsTemporarily = () => {
      setShowControls(true);

      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }

      if (isPlaying) {
        controlsTimeoutRef.current = setTimeout(() => {
          setShowControls(false);
        }, 3000);
      }
    };

    const playerContainer = playerContainerRef.current;
    if (playerContainer) {
      playerContainer.addEventListener("mousemove", showControlsTemporarily);
      playerContainer.addEventListener("mouseenter", showControlsTemporarily);
      playerContainer.addEventListener("mouseleave", () => {
        if (isPlaying) setShowControls(false);
      });
    }

    return () => {
      if (playerContainer) {
        playerContainer.removeEventListener(
          "mousemove",
          showControlsTemporarily
        );
        playerContainer.removeEventListener(
          "mouseenter",
          showControlsTemporarily
        );
        playerContainer.removeEventListener("mouseleave", () => {
          if (isPlaying) setShowControls(false);
        });
      }

      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [isPlaying]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case "Space":
          togglePlay();
          break;
        case "KeyM":
          toggleMute();
          break;
        case "KeyF":
          toggleFullscreen();
          break;
        case "KeyL":
          toggleLike();
          break;
        case "KeyS":
          toggleSave();
          break;
        case "ArrowLeft":
          handleRewind();
          break;
        case "ArrowRight":
          handleForward();
          break;
        case "ArrowUp":
          handleVolumeChange(Math.min(volume + 0.1, 1));
          break;
        case "ArrowDown":
          handleVolumeChange(Math.max(volume - 0.1, 0));
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [volume, isLiked, isSaved]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    if (isVideoEnded) {
      setIsVideoEnded(false);
      playerRef.current?.seekTo(0);
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      setVolume(previousVolume);
    } else {
      setPreviousVolume(volume);
      setIsMuted(true);
      setVolume(0);
    }
  };

  const toggleLike = () => {
    try {
      const watchList = localStorage.getItem("myWatchList")
        ? JSON.parse(localStorage.getItem("myWatchList") || "{}")
        : { myLikes: [], mySaves: [] };

      if (!watchList.myLikes) watchList.myLikes = [];

      if (isLiked) {
        watchList.myLikes = watchList.myLikes.filter(
          (id: string) => id !== video.id
        );
      } else {
        watchList.myLikes = [...watchList.myLikes, video.id];
      }

      localStorage.setItem("myWatchList", JSON.stringify(watchList));
      setIsLiked(!isLiked);
    } catch (error) {
      console.error("Error updating localStorage:", error);
    }
  };

  const toggleSave = () => {
    try {
      const watchList = localStorage.getItem("myWatchList")
        ? JSON.parse(localStorage.getItem("myWatchList") || "{}")
        : { myLikes: [], mySaves: [] };

      if (!watchList.mySaves) watchList.mySaves = [];

      if (isSaved) {
        watchList.mySaves = watchList.mySaves.filter(
          (id: string) => id !== video.id
        );
      } else {
        watchList.mySaves = [...watchList.mySaves, video.id];
      }

      localStorage.setItem("myWatchList", JSON.stringify(watchList));
      setIsSaved(!isSaved);
    } catch (error) {
      console.error("Error updating localStorage:", error);
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
    } else if (newVolume === 0 && !isMuted) {
      setIsMuted(true);
    }
  };

  const handleProgress = (state: {
    played: number;
    playedSeconds: number;
    loaded: number;
    loadedSeconds: number;
  }) => {
    if (!seeking) {
      setPlayed(state.played);
    }
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlayed(parseFloat(e.target.value));
  };

  const handleSeekStart = () => {
    setSeeking(true);
  };

  const handleSeekEnd = (
    e:
      | React.MouseEvent<HTMLInputElement>
      | React.TouchEvent<HTMLInputElement>
      | React.PointerEvent<HTMLInputElement>
  ) => {
    setSeeking(false);
    const value = parseFloat((e.target as HTMLInputElement).value);
    playerRef.current?.seekTo(value);
  };

  const handleRewind = () => {
    const currentTime = playerRef.current?.getCurrentTime() || 0;
    playerRef.current?.seekTo(Math.max(currentTime - 10, 0));
  };

  const handleForward = () => {
    const currentTime = playerRef.current?.getCurrentTime() || 0;
    playerRef.current?.seekTo(Math.min(currentTime + 10, duration));
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      playerContainerRef.current?.requestFullscreen().catch((err) => {
        console.error(
          `Error attempting to enable full-screen mode: ${err.message}`
        );
      });
    } else {
      document.exitFullscreen();
    }
  };

  const handleFullscreenChange = () => {
    setIsFullscreen(!!document.fullscreenElement);
  };

  useEffect(() => {
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const handleVideoEnd = () => {
    setIsPlaying(false);
    setIsVideoEnded(true);
  };

  const handleBuffer = () => {
    setIsBuffering(true);
  };

  const handleBufferEnd = () => {
    setIsBuffering(false);
  };

  return (
    <div
      ref={playerContainerRef}
      className="relative aspect-video bg-black"
      onClick={togglePlay}
    >
      <ReactPlayer
        ref={playerRef}
        url={video.videoUrl}
        width="100%"
        height="100%"
        playing={isPlaying}
        volume={volume}
        muted={isMuted}
        onProgress={handleProgress}
        onDuration={setDuration}
        onEnded={handleVideoEnd}
        onBuffer={handleBuffer}
        onBufferEnd={handleBufferEnd}
        style={{ position: "absolute", top: 0, left: 0 }}
        config={{
          file: {
            attributes: {
              onContextMenu: (e: React.MouseEvent) => e.preventDefault(),
              controlsList: "nodownload",
            },
          },
        }}
      />

      {(!isPlaying || isVideoEnded) && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Button
            variant="player"
            className="bg-black/60 h-16 w-16 transform transition-transform hover:scale-110"
            onClick={(e) => {
              e.stopPropagation();
              togglePlay();
            }}
          >
            {isVideoEnded ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            ) : (
              <PlayIcon className="h-12 w-12" />
            )}
          </Button>
        </div>
      )}

      {isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      )}

      <div
        className={`absolute top-4 right-4 flex space-x-2 transition-opacity duration-300 ${
          showControls || !isPlaying ? "opacity-100" : "opacity-0"
        }`}
      >
        <Button
          variant={isLiked ? "tertiary" : "ghost"}
          size="icon"
          className={`rounded-full ${
            isLiked ? "" : "bg-black/50 hover:bg-black/70"
          } text-white h-10 w-10`}
          onClick={(e) => {
            e.stopPropagation();
            toggleLike();
          }}
        >
          {isLiked ? (
            <HeartIconSolid className="h-5 w-5" />
          ) : (
            <HeartIcon className="h-5 w-5" />
          )}
        </Button>
        <Button
          variant={isSaved ? "tertiary" : "ghost"}
          size="icon"
          className={`rounded-full ${
            isSaved ? "" : "bg-black/50 hover:bg-black/70"
          } text-white h-10 w-10`}
          onClick={(e) => {
            e.stopPropagation();
            toggleSave();
          }}
        >
          {isSaved ? (
            <BookmarkIconSolid className="h-5 w-5" />
          ) : (
            <BookmarkIcon className="h-5 w-5" />
          )}
        </Button>
      </div>

      <div
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-4 py-3 transition-opacity duration-300 ${
          showControls || !isPlaying ? "opacity-100" : "opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative group w-full h-1 bg-gray-600 rounded cursor-pointer mb-2">
          <input
            type="range"
            min={0}
            max={0.999999}
            step="any"
            value={played}
            onMouseDown={handleSeekStart}
            onTouchStart={handleSeekStart}
            onPointerDown={handleSeekStart}
            onChange={handleSeekChange}
            onMouseUp={handleSeekEnd}
            onTouchEnd={handleSeekEnd}
            onPointerUp={handleSeekEnd}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div
            className="absolute h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded"
            style={{ width: `${played * 100}%` }}
          />
          <div
            className="absolute h-3 w-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full -top-1 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ left: `${played * 100}%` }}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-white p-1 rounded hover:bg-gray-700/50 h-8 w-8"
              onClick={(e) => {
                e.stopPropagation();
                togglePlay();
              }}
            >
              {isPlaying ? (
                <PauseIcon className="h-5 w-5" />
              ) : (
                <PlayIcon className="h-5 w-5" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="text-white p-1 rounded hover:bg-gray-700/50 h-8 w-auto px-2"
              onClick={(e) => {
                e.stopPropagation();
                handleRewind();
              }}
            >
              <span className="text-xs font-medium">-10s</span>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="text-white p-1 rounded hover:bg-gray-700/50 h-8 w-auto px-2"
              onClick={(e) => {
                e.stopPropagation();
                handleForward();
              }}
            >
              <span className="text-xs font-medium">+10s</span>
            </Button>

            <div className="flex items-center space-x-1 group relative">
              <Button
                variant="ghost"
                size="icon"
                className="text-white p-1 rounded hover:bg-gray-700/50 h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMute();
                }}
              >
                {isMuted || volume === 0 ? (
                  <SpeakerXMarkIcon className="h-5 w-5" />
                ) : (
                  <SpeakerWaveIcon className="h-5 w-5" />
                )}
              </Button>

              <div className="hidden group-hover:flex items-center w-24 h-8">
                <div className="relative w-full h-1.5 bg-gray-600 rounded cursor-pointer">
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={volume}
                    onChange={(e) =>
                      handleVolumeChange(parseFloat(e.target.value))
                    }
                    onTouchStart={(e) => e.stopPropagation()}
                    onTouchEnd={(e) => e.stopPropagation()}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div
                    className="absolute h-1.5 bg-white rounded"
                    style={{ width: `${volume * 100}%` }}
                  />
                  <div
                    className="absolute h-3 w-3 bg-white rounded-full -top-0.75 transform -translate-x-1/2"
                    style={{ left: `${volume * 100}%` }}
                  />
                </div>

                <div className="ml-2 text-xs text-white bg-black/70 px-1.5 py-0.5 rounded whitespace-nowrap">
                  {Math.round(volume * 100)}%
                </div>
              </div>
            </div>

            <div className="text-white text-xs">
              {formatDuration(playerRef.current?.getCurrentTime() || 0)} /{" "}
              {formatDuration(duration)}
            </div>
          </div>

          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="text-white p-1 rounded hover:bg-gray-700/50 h-8 w-8"
              onClick={(e) => {
                e.stopPropagation();
                toggleFullscreen();
              }}
            >
              <ArrowsPointingOutIcon className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

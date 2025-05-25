"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import ReactPlayer from "react-player";
import { PlayIcon } from "@heroicons/react/24/solid";
import { formatDuration } from "@/lib/utils";
import { Video } from "@/types/Video";
import { Button } from "@/components/ui/button";

interface ShortVideoPlayerProps {
  video: Video;
  isActive: boolean;
  onVideoEnd?: () => void;
}

export function ShortVideoPlayer({
  video,
  isActive,
  onVideoEnd,
}: ShortVideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const playerRef = useRef<ReactPlayer>(null);
  const router = useRouter();

  useEffect(() => {
    if (isActive) {
      setIsPlaying(true);
      setPlayed(0);
      setCurrentTime(0);
      if (playerRef.current) {
        playerRef.current.seekTo(0);
      }
    } else {
      setIsPlaying(false);
      setPlayed(0);
      setCurrentTime(0);
      if (playerRef.current) {
        playerRef.current.seekTo(0);
      }
    }
  }, [isActive]);

  useEffect(() => {
    if (playerRef.current && playerRef.current.getInternalPlayer()) {
      const internalPlayer = playerRef.current.getInternalPlayer();
      if (internalPlayer && internalPlayer.volume !== undefined) {
        internalPlayer.volume = isActive ? 0.8 : 0;
        internalPlayer.muted = !isActive;
      }
    }
  }, [isActive]);

  const togglePlay = () => {
    if (!isActive) return;
    setIsPlaying(!isPlaying);
  };

  const handleProgress = (state: { played: number; playedSeconds: number }) => {
    if (!seeking && isActive) {
      setPlayed(state.played);
      setCurrentTime(state.playedSeconds);
    }
  };

  const handleSeekBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.preventDefault();

    if (!playerRef.current || duration === 0) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;

    const maxDuration = Math.min(duration, 10);
    const seekTime = percentage * maxDuration;
    const seekRatio = seekTime / duration;

    playerRef.current.seekTo(seekRatio);
    setPlayed(seekRatio);
    setCurrentTime(seekTime);
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const value = parseFloat(e.target.value);

    const maxDuration = Math.min(duration, 10);
    const seekTime = value * maxDuration;
    const seekRatio = seekTime / duration;

    setPlayed(seekRatio);
    setCurrentTime(seekTime);
  };

  const handleSeekStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    setSeeking(true);
  };

  const handleSeekEnd = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    setSeeking(false);

    if (playerRef.current) {
      playerRef.current.seekTo(played);
    }
  };

  const handleVideoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/watch/${video.id}`);
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
    onVideoEnd?.();
  };

  const maxDuration = Math.min(duration, 10);
  const displayTime = Math.min(currentTime, 10);
  const displayPlayed = maxDuration > 0 ? displayTime / maxDuration : 0;

  useEffect(() => {
    if (!isActive || seeking) return;

    if (duration > 10 && currentTime >= 10) {
      handleVideoEnd();
    }
  }, [currentTime, duration, isActive, seeking]);

  return (
    <div className="relative w-full h-full bg-black flex flex-col">
      <div className="flex-1 relative" onClick={togglePlay}>
        <ReactPlayer
          ref={playerRef}
          url={video.videoUrl}
          width="100%"
          height="100%"
          playing={isPlaying && isActive}
          volume={isActive ? 0.8 : 0}
          muted={!isActive}
          onProgress={handleProgress}
          onDuration={setDuration}
          onEnded={handleVideoEnd}
          style={{ position: "absolute", top: 0, left: 0 }}
          config={{
            file: {
              attributes: {
                onContextMenu: (e: React.MouseEvent) => e.preventDefault(),
              },
            },
          }}
        />

        {!isPlaying && isActive && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Button
              variant="player"
              className="bg-black/60 h-16 w-16"
              onClick={(e) => {
                e.stopPropagation();
                togglePlay();
              }}
            >
              <PlayIcon className="h-8 w-8" />
            </Button>
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 pointer-events-none">
        <div className="mb-4 pointer-events-auto">
          <div
            className="relative group w-full h-2 bg-gray-600 rounded cursor-pointer"
            onClick={handleSeekBarClick}
          >
            <input
              type="range"
              min={0}
              max={0.999999}
              step="any"
              value={displayPlayed}
              onMouseDown={handleSeekStart}
              onTouchStart={handleSeekStart}
              onChange={handleSeekChange}
              onMouseUp={handleSeekEnd}
              onTouchEnd={handleSeekEnd}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
            />
            <div
              className="absolute h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded pointer-events-none"
              style={{ width: `${displayPlayed * 100}%` }}
            />
            <div
              className="absolute h-3 w-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full -top-0.5 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
              style={{ left: `${displayPlayed * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-white mt-2">
            <span>{formatDuration(displayTime)}</span>
            <span>{formatDuration(maxDuration)}</span>
          </div>
        </div>

        <div className="text-white pointer-events-auto">
          <h3
            className="text-base md:text-lg font-semibold mb-1 cursor-pointer hover:text-blue-300 transition-colors line-clamp-2"
            onClick={handleVideoClick}
          >
            {video.title}
          </h3>
          <p className="text-xs md:text-sm text-gray-300">
            {video.creator.name}
          </p>
        </div>
      </div>
    </div>
  );
}

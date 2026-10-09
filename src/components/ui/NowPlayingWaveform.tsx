"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Volume2,
  VolumeX,
  Heart,
  Music2,
  Radio,
  Sliders,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface TrackItem {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number; // in seconds
  coverGradient: string;
  accentColor: string;
  device: string;
}

export interface NowPlayingWaveformProps {
  /** Array of tracks to cycle through */
  tracks?: TrackItem[];
  /** Default playing state */
  initialPlaying?: boolean;
  /** Extra container className */
  className?: string;
}

const DEFAULT_TRACKS: TrackItem[] = [
  {
    id: "track-1",
    title: "Midnight City",
    artist: "M83",
    album: "Hurry Up, We're Dreaming",
    duration: 243, // 4:03
    coverGradient: "from-emerald-500 via-teal-700 to-cyan-900",
    accentColor: "#1DB954", // Spotify Green
    device: "Sonos Era 300 · Hi-Fi Lossless",
  },
  {
    id: "track-2",
    title: "Nightcall (Synthwave Rework)",
    artist: "Kavinsky",
    album: "OutRun",
    duration: 259, // 4:19
    coverGradient: "from-rose-600 via-purple-800 to-indigo-950",
    accentColor: "#F43F5E",
    device: "AirPods Pro (2nd Gen) · Spatial Audio",
  },
  {
    id: "track-3",
    title: "Resonance",
    artist: "HOME",
    album: "Odyssey",
    duration: 212, // 3:32
    coverGradient: "from-amber-500 via-orange-600 to-stone-900",
    accentColor: "#F59E0B",
    device: "Studio Monitors · 24-bit 96kHz",
  },
];

const BAR_COUNT = 32;

function formatSeconds(secs: number): string {
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

export function NowPlayingWaveform({
  tracks = DEFAULT_TRACKS,
  initialPlaying = true,
  className,
}: NowPlayingWaveformProps) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(initialPlaying);
  const [currentTime, setCurrentTime] = useState(64); // start at 1:04
  const [volume, setVolume] = useState(78);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState<"off" | "all" | "one">("all");
  const [isLiked, setIsLiked] = useState(true);

  // Scrubber hover state
  const [hoverPosition, setHoverPosition] = useState<number | null>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const track = tracks[currentTrackIndex] || tracks[0];

  // Playback timer simulation
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentTime((prev) => {
        if (prev >= track.duration) {
          if (repeatMode === "one") return 0;
          if (repeatMode === "all") {
            setCurrentTrackIndex((idx) => (idx + 1) % tracks.length);
            return 0;
          }
          setIsPlaying(false);
          return track.duration;
        }
        return prev + 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying, track.duration, repeatMode, tracks.length]);

  const handleNextTrack = () => {
    setCurrentTrackIndex((idx) => (idx + 1) % tracks.length);
    setCurrentTime(0);
  };

  const handlePrevTrack = () => {
    if (currentTime > 4) {
      setCurrentTime(0);
    } else {
      setCurrentTrackIndex((idx) => (idx - 1 + tracks.length) % tracks.length);
      setCurrentTime(0);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const ratio = clickX / rect.width;
    setCurrentTime(Math.floor(ratio * track.duration));
  };

  const handleMouseMoveScrub = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const hoverX = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    setHoverPosition(hoverX / rect.width);
  };

  const progressPercent = Math.min(100, (currentTime / track.duration) * 100);

  return (
    <div
      data-fullscreen-scroll
      className={cn(
        "relative flex min-h-[520px] w-full flex-col justify-between overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-900 p-4 text-white sm:p-8 dark:border-neutral-800 dark:bg-[#0A0D12]",
        className
      )}
    >
      {/* Background glow radiating track colors */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full blur-[120px] transition-colors duration-1000"
        style={{
          backgroundColor: track.accentColor,
          opacity: isPlaying ? 0.22 : 0.08,
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-20 -left-20 h-96 w-96 rounded-full blur-[140px] transition-colors duration-1000"
        style={{
          backgroundColor: track.accentColor,
          opacity: isPlaying ? 0.15 : 0.05,
        }}
      />

      {/* Header bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-2">
        <div className="flex items-center gap-3">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-xl text-white shadow-lg shadow-black/40"
            style={{ backgroundColor: track.accentColor }}
          >
            <Music2 className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold tracking-tight text-white">
                Spotify Now Playing Waveform
              </span>
              <span className="flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium text-white/80 backdrop-blur-md">
                <Radio className="h-2.5 w-2.5 text-emerald-400" />
                Live Visualizer
              </span>
            </div>
            <p className="text-xs text-neutral-400">
              Reactive animated frequency equalizer, scrubbable timeline, and Spotify Connect
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-black/40 px-3 py-1 text-xs text-neutral-300 backdrop-blur-md">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="truncate max-w-[190px]">{track.device}</span>
          </div>
        </div>
      </div>

      {/* Main Player Center Stage */}
      <div className="relative z-10 my-auto flex flex-col items-center justify-center py-6">
        <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-neutral-950/80 p-5 shadow-2xl backdrop-blur-xl sm:p-7">
          {/* Top row: Album Art & Track Info */}
          <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center">
            {/* Album Art with spinning vinyl simulation when playing */}
            <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/15">
              <div
                className={cn(
                  "h-full w-full bg-gradient-to-br transition-all duration-700",
                  track.coverGradient
                )}
              />
              <motion.div
                animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
                transition={
                  isPlaying
                    ? { repeat: Infinity, duration: 12, ease: "linear" }
                    : { duration: 0.5 }
                }
                className="absolute inset-2 flex items-center justify-center rounded-full border-2 border-dashed border-white/25 bg-black/30 backdrop-blur-xs"
              >
                <div className="h-6 w-6 rounded-full border-2 border-white/40 bg-neutral-900" />
              </motion.div>
            </div>

            {/* Title, Artist, and Favorite */}
            <div className="flex flex-1 flex-col justify-center text-center sm:text-left">
              <div className="flex items-center justify-center gap-2 sm:justify-start">
                <span className="rounded bg-white/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-neutral-300">
                  Master
                </span>
                <span className="text-xs text-neutral-400">{track.album}</span>
              </div>
              <h2 className="mt-1 text-lg font-bold tracking-tight text-white sm:text-xl">
                {track.title}
              </h2>
              <p className="text-sm font-medium text-neutral-400">
                {track.artist}
              </p>
            </div>

            {/* Favorite button */}
            <button
              type="button"
              onClick={() => setIsLiked(!isLiked)}
              aria-label={isLiked ? "Remove from favorites" : "Save to favorites"}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 transition hover:scale-105 active:scale-95"
            >
              <Heart
                className={cn(
                  "h-5 w-5 transition-colors",
                  isLiked ? "fill-emerald-400 text-emerald-400" : "text-neutral-400"
                )}
              />
            </button>
          </div>

          {/* REAL-TIME DANCING FREQUENCY WAVEFORM */}
          <div className="my-6 flex h-20 w-full items-end justify-between gap-1 rounded-2xl border border-white/5 bg-black/40 px-3 py-2.5 sm:gap-1.5">
            {Array.from({ length: BAR_COUNT }).map((_, i) => {
              // Sine-based multi-octave initial heights
              const baseHeight =
                Math.sin((i / BAR_COUNT) * Math.PI) * 55 +
                Math.sin((i / 4) * Math.PI) * 15 +
                20;

              // Generate looping animated heights when playing
              const h1 = Math.max(12, Math.min(95, baseHeight * 0.7));
              const h2 = Math.max(15, Math.min(100, baseHeight * 1.3));
              const h3 = Math.max(10, Math.min(85, baseHeight * 0.4));
              const h4 = Math.max(20, Math.min(98, baseHeight * 1.1));

              const duration = 0.65 + (i % 5) * 0.12;

              return (
                <motion.div
                  key={i}
                  animate={
                    isPlaying
                      ? {
                          height: [`${h1}%`, `${h2}%`, `${h3}%`, `${h4}%`, `${h1}%`],
                        }
                      : {
                          height: `${Math.max(10, baseHeight * 0.35)}%`,
                        }
                  }
                  transition={
                    isPlaying
                      ? {
                          duration,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: (i % 7) * 0.05,
                        }
                      : { duration: 0.3 }
                  }
                  style={{
                    backgroundColor:
                      i / BAR_COUNT <= progressPercent / 100
                        ? track.accentColor
                        : "rgba(255, 255, 255, 0.2)",
                  }}
                  className="w-full min-w-[2px] rounded-full transition-colors duration-150"
                />
              );
            })}
          </div>

          {/* SCRUBBABLE TIMELINE PROGRESS BAR */}
          <div className="relative">
            {/* Hover timestamp tooltip */}
            {hoverPosition !== null && (
              <div
                style={{ left: `${hoverPosition * 100}%` }}
                className="pointer-events-none absolute -top-7 -translate-x-1/2 rounded bg-neutral-800 px-1.5 py-0.5 font-mono text-[10px] text-white shadow-md ring-1 ring-white/10"
              >
                {formatSeconds(hoverPosition * track.duration)}
              </div>
            )}

            <div
              ref={progressBarRef}
              onClick={handleSeek}
              onMouseMove={handleMouseMoveScrub}
              onMouseLeave={() => setHoverPosition(null)}
              className="group relative flex h-3 w-full cursor-pointer items-center"
            >
              {/* Background Track */}
              <div className="h-1 w-full rounded-full bg-white/20 transition-all group-hover:h-1.5">
                {/* Active Progress */}
                <div
                  style={{
                    width: `${progressPercent}%`,
                    backgroundColor: track.accentColor,
                  }}
                  className="relative h-full rounded-full"
                >
                  {/* Scrubber Knob */}
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 h-3.5 w-3.5 scale-0 rounded-full bg-white shadow-md transition-transform group-hover:scale-100" />
                </div>
              </div>
            </div>

            {/* Time labels */}
            <div className="mt-1 flex items-center justify-between font-mono text-[11px] text-neutral-400">
              <span>{formatSeconds(currentTime)}</span>
              <span>{formatSeconds(track.duration)}</span>
            </div>
          </div>

          {/* PLAYBACK CONTROLS ROW */}
          <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
            {/* Shuffle */}
            <button
              type="button"
              onClick={() => setIsShuffle(!isShuffle)}
              aria-label="Toggle shuffle"
              className={cn(
                "p-2 transition rounded-full hover:bg-white/5",
                isShuffle ? "text-emerald-400" : "text-neutral-400 hover:text-white"
              )}
            >
              <Shuffle className="h-4 w-4" />
            </button>

            {/* Core Prev / Play / Next */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handlePrevTrack}
                aria-label="Previous track"
                className="rounded-full p-2 text-neutral-300 transition hover:bg-white/10 hover:text-white active:scale-95"
              >
                <SkipBack className="h-5 w-5" />
              </button>

              <motion.button
                type="button"
                whileTap={{ scale: 0.92 }}
                onClick={() => setIsPlaying(!isPlaying)}
                aria-label={isPlaying ? "Pause track" : "Play track"}
                style={{ backgroundColor: track.accentColor }}
                className="flex h-12 w-12 items-center justify-center rounded-full text-black shadow-lg shadow-black/40 transition hover:scale-105"
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5 fill-current" />
                ) : (
                  <Play className="ml-0.5 h-5 w-5 fill-current" />
                )}
              </motion.button>

              <button
                type="button"
                onClick={handleNextTrack}
                aria-label="Next track"
                className="rounded-full p-2 text-neutral-300 transition hover:bg-white/10 hover:text-white active:scale-95"
              >
                <SkipForward className="h-5 w-5" />
              </button>
            </div>

            {/* Repeat Mode */}
            <button
              type="button"
              onClick={() => {
                if (repeatMode === "off") setRepeatMode("all");
                else if (repeatMode === "all") setRepeatMode("one");
                else setRepeatMode("off");
              }}
              aria-label="Toggle repeat"
              className={cn(
                "relative p-2 transition rounded-full hover:bg-white/5",
                repeatMode !== "off" ? "text-emerald-400" : "text-neutral-400 hover:text-white"
              )}
            >
              <Repeat className="h-4 w-4" />
              {repeatMode === "one" && (
                <span className="absolute -top-0.5 right-0 text-[8px] font-bold">1</span>
              )}
            </button>

            {/* Volume Stepper */}
            <div className="hidden items-center gap-2 sm:flex">
              <button
                type="button"
                onClick={() => setIsMuted(!isMuted)}
                className="text-neutral-400 transition hover:text-white"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="100"
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  setVolume(Number(e.target.value));
                  if (isMuted) setIsMuted(false);
                }}
                className="h-1 w-20 cursor-pointer accent-emerald-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer Track Switcher Controls */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4 text-xs text-neutral-400">
        <div className="flex flex-wrap items-center gap-2">
          <span>Switch Song:</span>
          {tracks.map((t, idx) => (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                setCurrentTrackIndex(idx);
                setCurrentTime(0);
                setIsPlaying(true);
              }}
              className={cn(
                "rounded-md px-2.5 py-1 text-xs font-medium transition",
                currentTrackIndex === idx
                  ? "bg-white text-black font-semibold"
                  : "bg-white/10 text-white/80 hover:bg-white/20"
              )}
            >
              {t.title}
            </button>
          ))}
        </div>

        <div className="font-mono text-[11px] text-neutral-400">
          Audio Engine: 44.1kHz PCM Synthesizer
        </div>
      </div>
    </div>
  );
}

export default NowPlayingWaveform;

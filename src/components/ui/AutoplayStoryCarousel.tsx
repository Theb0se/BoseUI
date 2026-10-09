"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Volume2,
  VolumeX,
  Pause,
  Play,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ExternalLink,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface StorySlide {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  accentColor: string;
  gradient: string;
  badge: string;
  stats?: { label: string; value: string }[];
  date: string;
}

export interface AutoplayStoryCarouselProps {
  /** List of story slides */
  slides?: StorySlide[];
  /** Duration in milliseconds per story slide */
  duration?: number;
  /** Initial slide index */
  defaultIndex?: number;
  /** Whether autoplay is initially running */
  autoPlay?: boolean;
  /** On slide change callback */
  onSlideChange?: (index: number) => void;
  /** Whether to show header bar (defaults to true) */
  showHeader?: boolean;
  /** Whether to show bottom controls bar (defaults to true) */
  showControls?: boolean;
  /** Container className */
  className?: string;
}

const DEFAULT_SLIDES: StorySlide[] = [
  {
    id: "apple-intelligence",
    tag: "Intelligence",
    title: "Apple Intelligence Integrated",
    subtitle: "Personal intelligence system combining generative AI models with deep personal context.",
    accentColor: "#38BDF8",
    gradient: "from-sky-500/30 via-indigo-500/20 to-purple-600/30",
    badge: "iOS 18.2",
    date: "October 2026",
    stats: [
      { label: "Neural Engine", value: "38 TOPS" },
      { label: "Privacy Core", value: "On-Device" },
    ],
  },
  {
    id: "m4-max-silicon",
    tag: "Silicon",
    title: "M4 Max Hardware Raytracing",
    subtitle: "Built on second-generation 3nm technology for extreme pro workflows and 3D rendering.",
    accentColor: "#F59E0B",
    gradient: "from-amber-500/30 via-orange-500/20 to-rose-600/30",
    badge: "Apple Silicon",
    date: "October 2026",
    stats: [
      { label: "Unified Memory", value: "Up to 128GB" },
      { label: "Memory Bandwidth", value: "546 GB/s" },
    ],
  },
  {
    id: "spatial-computing",
    tag: "visionOS",
    title: "visionOS Spatial Computing",
    subtitle: "Navigate using your eyes, hands, and voice with ultra-high-resolution custom micro-OLED displays.",
    accentColor: "#EC4899",
    gradient: "from-pink-500/30 via-rose-500/20 to-purple-600/30",
    badge: "Spatial OS",
    date: "October 2026",
    stats: [
      { label: "Display Clustered", value: "23M Pixels" },
      { label: "Latency Response", value: "12ms Realtime" },
    ],
  },
  {
    id: "titanium-craft",
    tag: "Design",
    title: "Grade 5 Titanium Architecture",
    subtitle: "Lightest, strongest Pro models ever created with micro-blasted continuous tactile rails.",
    accentColor: "#10B981",
    gradient: "from-emerald-500/30 via-teal-500/20 to-cyan-600/30",
    badge: "Industrial Design",
    date: "October 2026",
    stats: [
      { label: "Material Alloy", value: "Ti-6Al-4V" },
      { label: "Thermal Band", value: "Sub-structure" },
    ],
  },
];

export function AutoplayStoryCarousel({
  slides = DEFAULT_SLIDES,
  duration = 5000,
  defaultIndex = 0,
  autoPlay = true,
  onSlideChange,
  showHeader = true,
  showControls = true,
  className,
}: AutoplayStoryCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(defaultIndex);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [slideDuration, setSlideDuration] = useState(duration);
  const [direction, setDirection] = useState(1);

  const isPausedRef = useRef(false);
  const progressStartTimeRef = useRef(Date.now());
  const elapsedBeforePauseRef = useRef(0);

  const total = slides.length;
  const currentSlide = slides[currentIndex];

  const nextSlide = useCallback(() => {
    setDirection(1);
    setProgress(0);
    elapsedBeforePauseRef.current = 0;
    progressStartTimeRef.current = Date.now();
    setCurrentIndex((prev) => {
      const next = (prev + 1) % total;
      onSlideChange?.(next);
      return next;
    });
  }, [total, onSlideChange]);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setProgress(0);
    elapsedBeforePauseRef.current = 0;
    progressStartTimeRef.current = Date.now();
    setCurrentIndex((prev) => {
      const next = (prev - 1 + total) % total;
      onSlideChange?.(next);
      return next;
    });
  }, [total, onSlideChange]);

  // Autoplay ticker loop with high-resolution timestamp calculation
  useEffect(() => {
    if (!isPlaying) return;

    let animId: number;
    progressStartTimeRef.current = Date.now() - elapsedBeforePauseRef.current;

    const loop = () => {
      if (!isPausedRef.current) {
        const elapsed = Date.now() - progressStartTimeRef.current;
        const currentP = Math.min(100, (elapsed / slideDuration) * 100);
        setProgress(currentP);

        if (elapsed >= slideDuration) {
          nextSlide();
          return;
        }
      }
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [currentIndex, isPlaying, slideDuration, nextSlide]);

  const handlePointerDown = () => {
    isPausedRef.current = true;
    elapsedBeforePauseRef.current = (progress / 100) * slideDuration;
  };

  const handlePointerUp = () => {
    isPausedRef.current = false;
    progressStartTimeRef.current = Date.now() - elapsedBeforePauseRef.current;
  };

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    if (clickX < rect.width * 0.4) {
      prevSlide();
    } else {
      nextSlide();
    }
  };

  // Jump to specific slide
  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setProgress(0);
    elapsedBeforePauseRef.current = 0;
    progressStartTimeRef.current = Date.now();
    setCurrentIndex(index);
    onSlideChange?.(index);
  };

  // Slide transition variants
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 120 : -120,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: "spring", stiffness: 350, damping: 30 },
        opacity: { duration: 0.28 },
        scale: { duration: 0.28 },
      },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -120 : 120,
      opacity: 0,
      scale: 0.95,
      transition: {
        x: { type: "spring", stiffness: 350, damping: 30 },
        opacity: { duration: 0.22 },
      },
    }),
  };

  return (
    <div
      data-fullscreen-scroll
      className={cn(
        "relative w-full min-h-[520px] overflow-hidden rounded-2xl border border-neutral-200/80 bg-[#07090E] p-6 text-neutral-100 shadow-2xl transition-all dark:border-neutral-800",
        className
      )}
    >
      {/* Dynamic Ambient Background Bloom matching active slide accent */}
      <div
        className="pointer-events-none absolute inset-0 transition-all duration-700 opacity-30"
        style={{
          background: `radial-gradient(circle 700px at 50% 40%, ${currentSlide.accentColor}, transparent 70%)`,
        }}
      />

      {/* Top Header & Overview */}
      {showHeader && (
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
              <Sparkles className="h-3 w-3 text-sky-400" />
              Apple News Interactive Stories
            </div>
            <h2 className="mt-2 text-xl font-semibold tracking-tight text-white">
              Autoplay Story Carousel
            </h2>
            <p className="text-xs text-neutral-400">
              Sequential progress bars, half-card tap navigation, hover pause, and sound controls
            </p>
          </div>

          {/* Play/Pause & Sound Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-white shadow-sm backdrop-blur-md transition hover:bg-white/20 active:scale-95"
              aria-label={isPlaying ? "Pause story autoplay" : "Play story autoplay"}
            >
              {isPlaying ? (
                <>
                  <Pause className="h-3.5 w-3.5" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Play</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setIsMuted(!isMuted)}
              className={cn(
                "flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium backdrop-blur-md transition active:scale-95",
                !isMuted
                  ? "border-sky-500/50 bg-sky-500/20 text-sky-300"
                  : "border-white/15 bg-white/10 text-neutral-300 hover:bg-white/20 hover:text-white"
              )}
              aria-label={isMuted ? "Unmute audio" : "Mute audio"}
            >
              {!isMuted ? (
                <>
                  <Volume2 className="h-3.5 w-3.5 text-sky-400" />
                  <span>Audio On</span>
                </>
              ) : (
                <>
                  <VolumeX className="h-3.5 w-3.5 text-neutral-400" />
                  <span>Muted</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Main Interactive Story Card Frame */}
      <div className="relative z-10 flex min-h-[360px] items-center justify-center py-6 select-none">
        <div
          onMouseEnter={handlePointerDown}
          onMouseLeave={handlePointerUp}
          onMouseDown={handlePointerDown}
          onMouseUp={handlePointerUp}
          onClick={handleContainerClick}
          className="group relative h-[360px] w-full max-w-md cursor-pointer overflow-hidden rounded-3xl border border-white/20 bg-neutral-900/90 shadow-[0_25px_60px_rgba(0,0,0,0.8)] backdrop-blur-xl ring-1 ring-white/10"
        >
          {/* Top Sequential Pill Progress Bars */}
          <div className="absolute inset-x-0 top-0 z-30 flex items-center gap-1.5 p-3.5">
            {slides.map((s, idx) => {
              let fillPercent = 0;
              if (idx < currentIndex) fillPercent = 100;
              else if (idx === currentIndex) fillPercent = progress;

              return (
                <div
                  key={s.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    goToSlide(idx);
                  }}
                  className="relative h-1 flex-1 overflow-hidden rounded-full bg-white/25 transition hover:h-1.5"
                >
                  <div
                    className="h-full rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all ease-linear"
                    style={{
                      width: `${fillPercent}%`,
                      transitionDuration: idx === currentIndex ? "50ms" : "0ms",
                    }}
                  />
                </div>
              );
            })}
          </div>

          {/* Left/Right Click Nav Hints */}
          <div className="pointer-events-none absolute inset-y-0 left-0 flex w-16 items-center justify-start pl-2 z-20 opacity-0 transition-opacity group-hover:opacity-40">
            <ChevronLeft className="h-6 w-6 text-white" />
          </div>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex w-16 items-center justify-end pr-2 z-20 opacity-0 transition-opacity group-hover:opacity-40">
            <ChevronRight className="h-6 w-6 text-white" />
          </div>

          {/* Fluid Slide Transitions Container */}
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={currentSlide.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className={cn(
                "relative flex h-full w-full flex-col justify-between p-7 pt-12",
                `bg-gradient-to-b ${currentSlide.gradient}`
              )}
            >
              {/* Header Badges */}
              <div className="flex items-center justify-between">
                <span className="rounded-full border border-white/20 bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white backdrop-blur-md">
                  {currentSlide.tag}
                </span>

                <span className="text-[11px] font-mono text-white/70">
                  {currentSlide.date}
                </span>
              </div>

              {/* Main Content Body */}
              <div className="space-y-3">
                <div className="inline-block rounded-md bg-white/10 px-2 py-0.5 text-[10px] font-mono text-white/90">
                  {currentSlide.badge}
                </div>
                <h3 className="text-2xl font-bold tracking-tight text-white drop-shadow">
                  {currentSlide.title}
                </h3>
                <p className="text-xs leading-relaxed text-white/80">
                  {currentSlide.subtitle}
                </p>
              </div>

              {/* Slide Technical Metrics Footnote */}
              {currentSlide.stats && (
                <div className="grid grid-cols-2 gap-2 rounded-2xl border border-white/15 bg-black/40 p-3 backdrop-blur-md">
                  {currentSlide.stats.map((stat) => (
                    <div key={stat.label}>
                      <span className="block text-[9px] uppercase tracking-wider text-white/60">
                        {stat.label}
                      </span>
                      <span className="font-mono text-xs font-bold text-white">
                        {stat.value}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Hold to Pause Indicator Tag */}
          <div className="pointer-events-none absolute bottom-2 inset-x-0 text-center opacity-0 transition-opacity group-hover:opacity-75 z-30">
            <span className="text-[10px] text-white/80 font-mono">
              Hold pointer to pause • Click left / right to skip
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Controls Bar */}
      {showControls && (
        <div className="relative z-10 mt-2 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/40 p-3.5 backdrop-blur-md">
          {/* Slide Duration Picker */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-neutral-400">Duration:</span>
            {[3000, 5000, 8000].map((dur) => (
              <button
                key={dur}
                type="button"
                onClick={() => setSlideDuration(dur)}
                className={cn(
                  "rounded-lg px-2.5 py-1 text-xs font-medium transition",
                  slideDuration === dur
                    ? "bg-white/20 text-white shadow-sm ring-1 ring-white/20"
                    : "text-neutral-400 hover:text-white"
                )}
              >
                {dur / 1000}s
              </button>
            ))}
          </div>

          {/* Slide Counter Dots */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-neutral-400">
              Story {currentIndex + 1} of {total}
            </span>
            <div className="flex items-center gap-1.5">
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => goToSlide(i)}
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    i === currentIndex
                      ? "w-5 bg-white shadow-sm"
                      : "w-1.5 bg-white/30 hover:bg-white/60"
                  )}
                  aria-label={`Jump to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AutoplayStoryCarousel;

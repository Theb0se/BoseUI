"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Sparkles,
  Share2,
  MessageCircle,
  Bookmark,
  Volume2,
  VolumeX,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface HeartBurstButtonProps {
  /** Initial like state */
  initialLiked?: boolean;
  /** Initial like count */
  initialCount?: number;
  /** Size variant */
  size?: "sm" | "md" | "lg" | "xl";
  /** Color theme */
  theme?: "instagram" | "crimson" | "violet" | "gold";
  /** Callback when like state changes */
  onToggle?: (liked: boolean, count: number) => void;
  /** Extra container className */
  className?: string;
}

interface Particle {
  id: number;
  angle: number;
  distance: number;
  size: number;
  color: string;
}

const THEME_COLORS: Record<string, { primary: string; glow: string; particles: string[] }> = {
  instagram: {
    primary: "text-rose-500 fill-rose-500",
    glow: "shadow-rose-500/40",
    particles: ["#FF385C", "#E0245E", "#FF5A5F", "#FA709A", "#FEE140", "#7928CA"],
  },
  crimson: {
    primary: "text-red-600 fill-red-600",
    glow: "shadow-red-600/40",
    particles: ["#E50914", "#FF1E27", "#B81D24", "#FF6B6B", "#FFA07A"],
  },
  violet: {
    primary: "text-fuchsia-500 fill-fuchsia-500",
    glow: "shadow-fuchsia-500/40",
    particles: ["#A855F7", "#D946EF", "#EC4899", "#8B5CF6", "#C084FC"],
  },
  gold: {
    primary: "text-amber-500 fill-amber-500",
    glow: "shadow-amber-500/40",
    particles: ["#F59E0B", "#FBBF24", "#FCD34D", "#D97706", "#FEF08A"],
  },
};

const SIZES = {
  sm: { icon: "h-4 w-4", btn: "h-8 px-2.5 text-xs gap-1.5", ring: "w-8 h-8" },
  md: { icon: "h-5 w-5", btn: "h-10 px-3.5 text-sm gap-2", ring: "w-10 h-10" },
  lg: { icon: "h-7 w-7", btn: "h-12 px-4.5 text-base gap-2.5", ring: "w-12 h-12" },
  xl: { icon: "h-9 w-9", btn: "h-16 px-6 text-lg gap-3", ring: "w-16 h-16" },
};

export function HeartBurstButton({
  initialLiked = false,
  initialCount = 1420,
  size = "md",
  theme = "instagram",
  onToggle,
  className,
}: HeartBurstButtonProps) {
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialCount);
  const [activeTheme, setActiveTheme] = useState<"instagram" | "crimson" | "violet" | "gold">(theme);
  const [activeSize, setActiveSize] = useState<"sm" | "md" | "lg" | "xl">(size);
  const [burstKey, setBurstKey] = useState(0);
  const [cardDoubleTapBurst, setCardDoubleTapBurst] = useState<{ id: number; x: number; y: number } | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(false);

  const colors = THEME_COLORS[activeTheme];
  const sizeConfig = SIZES[activeSize];

  // Generate 12 radial particles
  const particles: Particle[] = Array.from({ length: 12 }).map((_, i) => {
    const angle = (i * (360 / 12)) + (i % 2 === 0 ? 8 : -8);
    const distance = 28 + (i % 3) * 10;
    const pSize = 4 + (i % 3) * 2;
    const color = colors.particles[i % colors.particles.length];
    return { id: i, angle, distance, size: pSize, color };
  });

  const triggerLike = (forceState?: boolean) => {
    const nextState = forceState !== undefined ? forceState : !isLiked;
    setIsLiked(nextState);
    const newCount = nextState ? likeCount + 1 : Math.max(0, likeCount - 1);
    setLikeCount(newCount);
    if (nextState) {
      setBurstKey((prev) => prev + 1);
    }
    onToggle?.(nextState, newCount);
  };

  const handleCardDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setCardDoubleTapBurst({ id: Date.now(), x, y });
    if (!isLiked) {
      triggerLike(true);
    } else {
      setBurstKey((prev) => prev + 1);
    }
  };

  return (
    <div
      data-fullscreen-scroll
      className={cn(
        "relative flex min-h-[520px] w-full flex-col justify-between overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50/70 p-4 sm:p-8 dark:border-neutral-800 dark:bg-neutral-950",
        className
      )}
    >
      {/* Header bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400">
            <Heart className="h-4 w-4 fill-rose-500" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
                Instagram Heart Burst Button
              </span>
              <span className="rounded-full bg-rose-500/10 px-2 py-0.5 text-[10px] font-semibold text-rose-600 dark:text-rose-400">
                Confetti &amp; Shockwave
              </span>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Elastic pop spring, expanding shockwave ring, radial particles, and photo double-tap
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-medium text-neutral-700 shadow-xs transition hover:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
          >
            {soundEnabled ? (
              <>
                <Volume2 className="h-3.5 w-3.5 text-rose-500" />
                <span>Haptic Audio On</span>
              </>
            ) : (
              <>
                <VolumeX className="h-3.5 w-3.5" />
                <span>Mute Audio</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Showcase Stage */}
      <div className="relative z-10 my-auto flex flex-col items-center justify-center py-6 sm:flex-row sm:gap-12">
        {/* Instagram Post Card with Double Tap Burst */}
        <div className="relative w-full max-w-sm rounded-3xl border border-neutral-200/90 bg-white shadow-xl shadow-neutral-950/5 dark:border-neutral-800/90 dark:bg-neutral-900 dark:shadow-black/40">
          {/* Post Header */}
          <div className="flex items-center justify-between border-b border-neutral-100 p-3.5 dark:border-neutral-800">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-0.5">
                <div className="h-full w-full rounded-full bg-white dark:bg-neutral-900 flex items-center justify-center text-[11px] font-bold">
                  P
                </div>
              </div>
              <div>
                <div className="text-xs font-bold text-neutral-900 dark:text-white">
                  pulse.ui
                </div>
                <div className="text-[10px] text-neutral-400">Kyoto, Japan</div>
              </div>
            </div>
            <Sparkles className="h-4 w-4 text-neutral-400" />
          </div>

          {/* Post Photo Canvas (Double Clickable) */}
          <div
            onDoubleClick={handleCardDoubleClick}
            className="group relative h-64 w-full cursor-pointer select-none overflow-hidden bg-gradient-to-br from-indigo-900 via-slate-900 to-rose-950"
          >
            {/* Visual backdrop details */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white/90">
              <div className="mb-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-medium backdrop-blur-md">
                Double tap anywhere to like
              </div>
              <p className="max-w-[200px] text-xs font-light text-white/70">
                Cherry blossoms blooming along the Philosopher&apos;s Path at dawn.
              </p>
            </div>

            {/* Central Double Tap Big Heart Pop */}
            <AnimatePresence>
              {cardDoubleTapBurst && (
                <motion.div
                  key={cardDoubleTapBurst.id}
                  initial={{ scale: 0, opacity: 0, rotate: -15 }}
                  animate={{
                    scale: [0, 1.4, 1.1, 1.2],
                    opacity: [0, 1, 0.95, 0],
                    rotate: [0, 10, -5, 0],
                    y: [0, -20],
                  }}
                  transition={{ duration: 0.85, ease: [0.175, 0.885, 0.32, 1.275] }}
                  style={{
                    position: "absolute",
                    left: cardDoubleTapBurst.x - 36,
                    top: cardDoubleTapBurst.y - 36,
                  }}
                  className="pointer-events-none z-30"
                >
                  <Heart className="h-20 w-20 fill-white text-white drop-shadow-2xl" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Post Action Bar */}
          <div className="p-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Heart Burst Action */}
                <div className="relative">
                  {/* Expanding Shockwave Ring */}
                  <AnimatePresence>
                    {isLiked && (
                      <motion.div
                        key={`ring-${burstKey}`}
                        initial={{ scale: 0.2, opacity: 0.9 }}
                        animate={{ scale: 2.4, opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className={cn(
                          "pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-rose-500",
                          sizeConfig.ring
                        )}
                      />
                    )}
                  </AnimatePresence>

                  {/* Confetti Particles */}
                  <AnimatePresence>
                    {isLiked && (
                      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                        {particles.map((p) => {
                          const rad = (p.angle * Math.PI) / 180;
                          const targetX = Math.cos(rad) * p.distance;
                          const targetY = Math.sin(rad) * p.distance;

                          return (
                            <motion.span
                              key={`p-${burstKey}-${p.id}`}
                              initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                              animate={{
                                scale: [0, 1.3, 0],
                                x: targetX,
                                y: targetY,
                                opacity: [1, 0.9, 0],
                              }}
                              transition={{
                                duration: 0.55,
                                ease: "easeOut",
                                delay: (p.id % 4) * 0.02,
                              }}
                              style={{
                                width: p.size,
                                height: p.size,
                                backgroundColor: p.color,
                              }}
                              className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full shadow-xs"
                            />
                          );
                        })}
                      </div>
                    )}
                  </AnimatePresence>

                  {/* Elastic Heart Icon Button */}
                  <motion.button
                    type="button"
                    onClick={() => triggerLike()}
                    whileTap={{ scale: 0.8 }}
                    aria-label={isLiked ? "Unlike post" : "Like post"}
                    className="relative z-10 flex items-center justify-center transition-colors focus-visible:outline-none"
                  >
                    <motion.div
                      key={`heart-${burstKey}`}
                      animate={
                        isLiked
                          ? {
                              scale: [1, 0.65, 1.45, 0.92, 1],
                              rotate: [0, -12, 12, -4, 0],
                            }
                          : { scale: 1 }
                      }
                      transition={{ duration: 0.45, ease: "easeInOut" }}
                    >
                      <Heart
                        className={cn(
                          sizeConfig.icon,
                          "transition-colors duration-150",
                          isLiked
                            ? colors.primary
                            : "text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
                        )}
                      />
                    </motion.div>
                  </motion.button>
                </div>

                <MessageCircle className="h-5 w-5 text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white cursor-pointer" />
                <Share2 className="h-5 w-5 text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white cursor-pointer" />
              </div>

              <Bookmark className="h-5 w-5 text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white cursor-pointer" />
            </div>

            {/* Like Counter with Number Spring Animation */}
            <div className="mt-2.5 flex items-center gap-1.5">
              <span className="text-xs font-bold text-neutral-900 dark:text-white">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={likeCount}
                    initial={{ y: 8, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -8, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="inline-block font-mono"
                  >
                    {likeCount.toLocaleString()}
                  </motion.span>
                </AnimatePresence>{" "}
                likes
              </span>
            </div>

            <p className="mt-1 text-xs text-neutral-700 dark:text-neutral-300">
              <span className="font-bold">pulse.ui</span> Spring physics make tactile consumer interactions irresistible.
            </p>
          </div>
        </div>

        {/* Standalone Button Inspector & Variations */}
        <div className="mt-6 flex flex-col items-center gap-5 sm:mt-0">
          <div className="text-center">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
              Standalone Interactive Button
            </span>
            <div className="mt-3 flex items-center justify-center">
              <button
                type="button"
                onClick={() => triggerLike()}
                className={cn(
                  "relative flex items-center rounded-full border border-neutral-200 bg-white shadow-md transition-all hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900",
                  sizeConfig.btn
                )}
              >
                <motion.div
                  key={`standalone-heart-${burstKey}`}
                  animate={
                    isLiked
                      ? { scale: [1, 0.6, 1.45, 0.9, 1] }
                      : { scale: 1 }
                  }
                  transition={{ duration: 0.4 }}
                >
                  <Heart
                    className={cn(
                      sizeConfig.icon,
                      "transition-colors",
                      isLiked ? colors.primary : "text-neutral-400"
                    )}
                  />
                </motion.div>
                <span className="font-mono font-semibold text-neutral-800 dark:text-neutral-200">
                  {likeCount.toLocaleString()}
                </span>
              </button>
            </div>
          </div>

          {/* Theme Palette Chooser */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-3.5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
            <div className="mb-2 text-[11px] font-medium text-neutral-500">
              Confetti Sparkle Theme:
            </div>
            <div className="flex items-center gap-2">
              {(["instagram", "crimson", "violet", "gold"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setActiveTheme(t)}
                  className={cn(
                    "capitalize rounded-lg px-2.5 py-1 text-xs font-semibold transition",
                    activeTheme === t
                      ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                      : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="mt-3 border-t border-neutral-100 pt-3 dark:border-neutral-800">
              <div className="mb-2 text-[11px] font-medium text-neutral-500">
                Button Size:
              </div>
              <div className="flex items-center gap-1.5">
                {(["sm", "md", "lg", "xl"] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setActiveSize(s)}
                    className={cn(
                      "uppercase rounded-md px-2 py-0.5 text-[11px] font-mono font-medium transition",
                      activeSize === s
                        ? "bg-rose-500 text-white"
                        : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer reset bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-t border-neutral-200/80 pt-4 dark:border-neutral-800/80">
        <span className="text-xs text-neutral-500">
          State: <strong className="text-neutral-900 dark:text-white">{isLiked ? "Liked" : "Unliked"}</strong> ({likeCount} total)
        </span>
        <button
          type="button"
          onClick={() => {
            setIsLiked(false);
            setLikeCount(initialCount);
          }}
          className="flex items-center gap-1 text-xs text-neutral-500 underline transition hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
        >
          <RotateCcw className="h-3 w-3" />
          <span>Reset Likes</span>
        </button>
      </div>
    </div>
  );
}

export default HeartBurstButton;

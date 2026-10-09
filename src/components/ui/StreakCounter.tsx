"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Flame,
  Shield,
  Check,
  Sparkles,
  Trophy,
  Zap,
  RotateCcw,
  Calendar,
  ChevronRight,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface DayStatus {
  day: string; // e.g. "M", "T", "W"
  label: string; // e.g. "Mon"
  completed: boolean;
  isToday?: boolean;
}

export interface StreakCounterProps {
  /** Initial streak length in days */
  initialStreak?: number;
  /** Whether today's streak is already claimed */
  initialClaimed?: boolean;
  /** Whether a streak freeze shield is equipped */
  hasStreakFreeze?: boolean;
  /** Callback fired when streak is claimed */
  onClaim?: (newStreak: number) => void;
  /** Extra container className */
  className?: string;
}

const DEFAULT_DAYS: DayStatus[] = [
  { day: "M", label: "Mon", completed: true },
  { day: "T", label: "Tue", completed: true },
  { day: "W", label: "Wed", completed: true },
  { day: "T", label: "Thu", completed: true },
  { day: "F", label: "Fri", completed: true },
  { day: "S", label: "Sat", completed: false, isToday: true },
  { day: "S", label: "Sun", completed: false },
];

const CONFETTI_COLORS = [
  "#FF9600", // Duolingo Orange
  "#FF4B4B", // Duolingo Coral
  "#58CC02", // Duolingo Green
  "#1CB0F6", // Duolingo Sky
  "#FFD900", // Gold
  "#CE82FF", // Purple
];

export function StreakCounter({
  initialStreak = 14,
  initialClaimed = false,
  hasStreakFreeze = true,
  onClaim,
  className,
}: StreakCounterProps) {
  const [streak, setStreak] = useState(initialStreak);
  const [isClaimedToday, setIsClaimedToday] = useState(initialClaimed);
  const [freezeEquipped, setFreezeEquipped] = useState(hasStreakFreeze);
  const [confettiActive, setConfettiActive] = useState(false);
  const [days, setDays] = useState<DayStatus[]>(DEFAULT_DAYS);

  // Milestone progression calculation
  const nextMilestone = streak < 7 ? 7 : streak < 21 ? 21 : streak < 30 ? 30 : streak < 50 ? 50 : 100;
  const progressPercent = Math.min(100, Math.round((streak / nextMilestone) * 100));

  const handleClaimStreak = () => {
    if (isClaimedToday) return;

    const newStreak = streak + 1;
    setStreak(newStreak);
    setIsClaimedToday(true);
    setConfettiActive(true);

    // Mark today as completed in calendar
    setDays((prev) =>
      prev.map((d) => (d.isToday ? { ...d, completed: true } : d))
    );

    onClaim?.(newStreak);

    setTimeout(() => {
      setConfettiActive(false);
    }, 2500);
  };

  const handleReset = () => {
    setStreak(initialStreak);
    setIsClaimedToday(false);
    setDays(DEFAULT_DAYS);
    setConfettiActive(false);
  };

  return (
    <div
      data-fullscreen-scroll
      className={cn(
        "relative flex min-h-[520px] w-full flex-col justify-between overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50/70 p-4 sm:p-8 dark:border-neutral-800 dark:bg-neutral-950",
        className
      )}
    >
      {/* Background warm flame glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-amber-500/10 blur-[100px] dark:bg-amber-500/15"
      />

      {/* Header bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-2">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400">
            <Flame className="h-5 w-5 fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
                Duolingo Gamified Streak Counter
              </span>
              <span className="rounded-full bg-orange-500/10 px-2 py-0.5 text-[10px] font-semibold text-orange-600 dark:text-orange-400">
                Habit Loop
              </span>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Pulsing flame engine, 7-day calendar row, freeze shield, and confetti explosion
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Streak Freeze Badge */}
          <button
            type="button"
            onClick={() => setFreezeEquipped(!freezeEquipped)}
            className={cn(
              "flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition shadow-xs",
              freezeEquipped
                ? "border-sky-500/30 bg-sky-500/10 text-sky-600 dark:text-sky-400"
                : "border-neutral-300 bg-white text-neutral-400 dark:border-neutral-700 dark:bg-neutral-900"
            )}
          >
            <Shield className={cn("h-3.5 w-3.5", freezeEquipped && "fill-current")} />
            <span>{freezeEquipped ? "Freeze Equipped" : "Freeze Inactive"}</span>
          </button>
        </div>
      </div>

      {/* Main Center Gamification Card */}
      <div className="relative z-10 my-auto flex flex-col items-center justify-center py-6">
        <div className="relative w-full max-w-md rounded-3xl border border-neutral-200/90 bg-white p-6 shadow-xl shadow-neutral-950/5 dark:border-neutral-800/90 dark:bg-neutral-900 sm:p-8 dark:shadow-black/40 text-center">
          {/* Confetti Explosion particles */}
          <AnimatePresence>
            {confettiActive && (
              <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl z-30">
                {Array.from({ length: 36 }).map((_, i) => {
                  const angle = (i * 360) / 36;
                  const rad = (angle * Math.PI) / 180;
                  const distance = 80 + (i % 6) * 28;
                  const x = Math.cos(rad) * distance;
                  const y = Math.sin(rad) * distance - 30;
                  const color = CONFETTI_COLORS[i % CONFETTI_COLORS.length];

                  return (
                    <motion.div
                      key={`confetti-${i}`}
                      initial={{ scale: 0, x: 0, y: 0, opacity: 1, rotate: 0 }}
                      animate={{
                        scale: [0, 1.2, 0.8],
                        x,
                        y: [0, y, y + 60],
                        opacity: [1, 1, 0],
                        rotate: [0, 180, 360],
                      }}
                      transition={{ duration: 1.8, ease: "easeOut" }}
                      style={{
                        position: "absolute",
                        left: "50%",
                        top: "30%",
                        width: i % 2 === 0 ? 8 : 12,
                        height: i % 2 === 0 ? 8 : 6,
                        backgroundColor: color,
                        borderRadius: i % 3 === 0 ? "50%" : "2px",
                      }}
                    />
                  );
                })}
              </div>
            )}
          </AnimatePresence>

          {/* PULSING FLAME ICON AVATAR */}
          <div className="relative mx-auto mb-3 flex h-24 w-24 items-center justify-center">
            {/* Outer heat pulse wave */}
            <motion.div
              animate={{
                scale: [1, 1.25, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-500/30 to-orange-600/30 blur-lg"
            />

            {/* Floating Sparks */}
            <motion.div
              animate={{
                y: [-6, -22, -6],
                opacity: [0, 1, 0],
                scale: [0.5, 1, 0.5],
              }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
              className="absolute -top-1 left-7 text-amber-400"
            >
              <Sparkles className="h-4 w-4" />
            </motion.div>
            <motion.div
              animate={{
                y: [-4, -18, -4],
                opacity: [0, 1, 0],
                scale: [0.4, 0.9, 0.4],
              }}
              transition={{ duration: 1.4, repeat: Infinity, delay: 0.5, ease: "easeOut" }}
              className="absolute -top-2 right-6 text-orange-400"
            >
              <Sparkles className="h-3 w-3" />
            </motion.div>

            {/* Core Animated Flame */}
            <motion.div
              animate={{
                scale: [1, 1.07, 0.98, 1.05, 1],
                rotate: [0, -3, 3, -1, 0],
              }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-tr from-orange-600 via-amber-500 to-yellow-400 shadow-xl shadow-orange-500/30"
            >
              <Flame className="h-12 w-12 text-white fill-white drop-shadow-md" />
            </motion.div>
          </div>

          {/* LARGE STREAK NUMBER */}
          <div className="space-y-0.5">
            <div className="flex items-center justify-center gap-2">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={streak}
                  initial={{ y: 15, opacity: 0, scale: 0.8 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ y: -15, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 450, damping: 25 }}
                  className="font-mono text-4xl font-black tracking-tight text-neutral-900 dark:text-white sm:text-5xl"
                >
                  {streak}
                </motion.span>
              </AnimatePresence>
              <span className="text-xl font-bold uppercase tracking-wider text-orange-500 sm:text-2xl">
                DAYS
              </span>
            </div>
            <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
              {isClaimedToday
                ? "You've extended your streak today! Keep the flame alive."
                : "Practice now to lock in today's streak!"}
            </p>
          </div>

          {/* 7-DAY CALENDAR ROW */}
          <div className="my-6 rounded-2xl border border-neutral-100 bg-neutral-50/80 p-3.5 dark:border-neutral-800 dark:bg-neutral-950/60">
            <div className="mb-2.5 flex items-center justify-between text-[11px] font-semibold text-neutral-500">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                This Week
              </span>
              <span>
                {days.filter((d) => d.completed).length} / 7 days
              </span>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {days.map((item, idx) => {
                return (
                  <div key={idx} className="flex flex-col items-center gap-1.5">
                    <span className="font-mono text-[10px] font-bold text-neutral-400">
                      {item.day}
                    </span>

                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className={cn(
                        "relative flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full font-bold transition-all shadow-xs",
                        item.completed
                          ? "bg-gradient-to-tr from-orange-500 to-amber-400 text-white shadow-orange-500/20"
                          : item.isToday
                          ? "border-2 border-orange-500 bg-orange-500/10 text-orange-600 dark:text-orange-400 ring-2 ring-orange-500/20 animate-pulse"
                          : "border border-neutral-200 bg-white text-neutral-400 dark:border-neutral-800 dark:bg-neutral-900"
                      )}
                    >
                      {item.completed ? (
                        <Check className="h-4 w-4 stroke-[3]" />
                      ) : item.isToday ? (
                        <Flame className="h-4 w-4 fill-current" />
                      ) : (
                        <Lock className="h-3 w-3 opacity-40" />
                      )}
                    </motion.div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* MILESTONE PROGRESSION BAR */}
          <div className="mb-6 space-y-1.5 text-left">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-neutral-800 dark:text-neutral-200">
                <Trophy className="h-3.5 w-3.5 text-amber-500" />
                Next Goal: {nextMilestone}-Day Club
              </span>
              <span className="font-mono text-[11px] text-neutral-400">
                {nextMilestone - streak} days left
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400"
              />
            </div>
          </div>

          {/* PRIMARY INTERACTIVE CLAIM / PRACTICE BUTTON */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleClaimStreak}
            disabled={isClaimedToday}
            className={cn(
              "flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-bold uppercase tracking-wider shadow-lg transition",
              isClaimedToday
                ? "bg-neutral-100 text-neutral-400 border border-neutral-200 dark:bg-neutral-800 dark:text-neutral-500 dark:border-neutral-700 cursor-default"
                : "bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white shadow-orange-500/30 hover:brightness-105 active:brightness-95"
            )}
          >
            {isClaimedToday ? (
              <>
                <Check className="h-4 w-4 stroke-[3]" />
                <span>Streak Protected Today</span>
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 fill-white" />
                <span>Claim Today&apos;s Streak</span>
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* Footer Interactive Stage Controls */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-t border-neutral-200/80 pt-4 dark:border-neutral-800/80">
        <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500">
          <span>Set Streak:</span>
          {[7, 14, 30, 100].map((count) => (
            <button
              key={count}
              type="button"
              onClick={() => {
                setStreak(count);
                setIsClaimedToday(false);
              }}
              className={cn(
                "rounded-md px-2 py-0.5 text-[11px] font-mono font-medium transition",
                streak === count
                  ? "bg-orange-500 text-white"
                  : "bg-neutral-200/60 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
              )}
            >
              {count}d
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="flex items-center gap-1 text-xs text-neutral-500 underline transition hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
        >
          <RotateCcw className="h-3 w-3" />
          <span>Reset Streak Demo</span>
        </button>
      </div>
    </div>
  );
}

export default StreakCounter;

"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface KineticRollingCounterProps {
  /** Initial integer value. Default: 1248 */
  defaultValue?: number;
  /** Increment step size. Default: 17 */
  step?: number;
  /** Hooke's Law spring stiffness coefficient for digit reel rotation. Default: 340 */
  stiffness?: number;
  /** Spring damping coefficient for digit reel rotation. Default: 26 */
  damping?: number;
  className?: string;
}

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

interface DigitReelColumnProps {
  digit: number;
  stiffness: number;
  damping: number;
  shouldReduceMotion: boolean;
}

function DigitReelColumn({
  digit,
  stiffness,
  damping,
  shouldReduceMotion,
}: DigitReelColumnProps) {
  return (
    <div
      aria-hidden="true"
      className="relative h-9 w-6 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50 font-mono text-lg font-bold tabular-nums text-black dark:border-[#262626] dark:bg-[#141414] dark:text-white"
    >
      <motion.div
        animate={{ y: `-${digit * 10}%` }}
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : { type: "spring", stiffness, damping }
        }
        className="flex flex-col items-center"
      >
        {DIGITS.map((n) => (
          <span
            key={n}
            className="flex h-9 w-6 items-center justify-center leading-none"
          >
            {n}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export function KineticRollingCounter({
  defaultValue = 1248,
  step = 17,
  stiffness = 340,
  damping = 26,
  className,
}: KineticRollingCounterProps) {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const [count, setCount] = useState<number>(Math.max(0, defaultValue));

  const formatted = String(Math.max(0, count)).padStart(4, "0");
  const digitArray = formatted.split("").map((ch) => Number(ch) || 0);

  return (
    <div
      className={cn(
        "inline-flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white px-4 py-3 shadow-sm dark:border-[#222222] dark:bg-[#0A0A0A]",
        className
      )}
    >
      <button
        type="button"
        aria-label={`Decrease counter by ${step}`}
        onClick={() => setCount((c) => Math.max(0, c - step))}
        className="flex h-8 w-8 items-center justify-center rounded-xl border border-neutral-200 text-neutral-600 transition-colors hover:border-black hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:border-[#262626] dark:text-neutral-300 dark:hover:border-white dark:hover:text-white dark:focus-visible:ring-white"
      >
        <Minus className="h-3.5 w-3.5" />
      </button>

      {/* Screen-reader live region */}
      <span className="sr-only" role="status" aria-live="polite">
        Current value: {count}
      </span>

      {/* Mechanical Odometer Digit Reels */}
      <div className="flex items-center gap-1">
        {digitArray.map((d, idx) => (
          <DigitReelColumn
            key={idx}
            digit={d}
            stiffness={stiffness}
            damping={damping}
            shouldReduceMotion={shouldReduceMotion}
          />
        ))}
      </div>

      <button
        type="button"
        aria-label={`Increase counter by ${step}`}
        onClick={() => setCount((c) => c + step)}
        className="flex h-8 w-8 items-center justify-center rounded-xl border border-black bg-black text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:border-white dark:bg-white dark:text-black dark:focus-visible:ring-white"
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export default KineticRollingCounter;

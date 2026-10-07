"use client";

import React, { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { RotateCw } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SplitFlapTextProps {
  /** Array of preset words of similar length to cycle through. */
  words?: string[];
  /** Spring stiffness coefficient for 3D flap rotation. Default: 380 */
  stiffness?: number;
  /** Spring damping coefficient for 3D flap rotation. Default: 24 */
  damping?: number;
  className?: string;
}

const DEFAULT_WORDS = ["KINETIC", "PHYSICS", "SPRINGS", "MINIMAL"];

export function SplitFlapText({
  words = DEFAULT_WORDS,
  stiffness = 380,
  damping = 24,
  className,
}: SplitFlapTextProps) {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const [wordIndex, setWordIndex] = useState(0);

  const activeWord = words[wordIndex % words.length] || "KINETIC";
  const maxLen = Math.max(...words.map((w) => w.length), activeWord.length);
  const paddedChars = activeWord.padEnd(maxLen, " ").split("");

  const cycleNext = () => {
    setWordIndex((prev) => (prev + 1) % words.length);
  };

  return (
    <div
      className={cn(
        "inline-flex flex-col items-center gap-3 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-[#222222] dark:bg-[#0A0A0A]",
        className
      )}
    >
      {/* Screen-reader live readout */}
      <span className="sr-only" role="status" aria-live="polite">
        {activeWord}
      </span>

      <button
        type="button"
        onClick={cycleNext}
        aria-label={`Split-flap display showing ${activeWord}. Click to flip to next word.`}
        style={{ perspective: "900px" }}
        className="group flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white"
      >
        {paddedChars.map((char, idx) => (
          <div
            key={idx}
            aria-hidden="true"
            className="relative flex h-12 w-9 items-center justify-center overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950 font-mono text-lg font-bold text-white shadow-inner dark:border-neutral-200 dark:bg-white dark:text-black"
          >
            {/* Mechanical Horizontal Split Hinge Line */}
            <div className="pointer-events-none absolute inset-x-0 top-1/2 z-20 h-[1px] bg-black/40 dark:bg-neutral-300" />

            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={`${wordIndex}-${idx}-${char}`}
                initial={
                  shouldReduceMotion
                    ? { opacity: 0 }
                    : { rotateX: -90, opacity: 0, y: -6 }
                }
                animate={{ rotateX: 0, opacity: 1, y: 0 }}
                exit={
                  shouldReduceMotion
                    ? { opacity: 0 }
                    : { rotateX: 90, opacity: 0, y: 6 }
                }
                transition={
                  shouldReduceMotion
                    ? { duration: 0.01 }
                    : {
                        type: "spring",
                        stiffness,
                        damping,
                        delay: idx * 0.035,
                      }
                }
                className="relative z-10 inline-block"
              >
                {char}
              </motion.span>
            </AnimatePresence>
          </div>
        ))}
      </button>

      <div className="flex items-center gap-1.5 text-[11px] text-neutral-400">
        <RotateCw className="h-3 w-3" />
        <span>Click board to cycle mechanical split-flap</span>
      </div>
    </div>
  );
}

export default SplitFlapText;

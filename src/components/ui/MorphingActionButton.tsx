"use client";

import React, { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check, Loader2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export type ActionPhase = "idle" | "loading" | "success" | "error";

export interface MorphingActionButtonProps {
  /** Label shown in resting idle phase. Default: "Publish Registry" */
  idleLabel?: string;
  /** Label shown during async loading phase. Default: "Compiling..." */
  loadingLabel?: string;
  /** Label shown upon completion. Default: "Published v2.4" */
  successLabel?: string;
  /** Simulate an error state on every second click for demo purposes. Default: false */
  simulateError?: boolean;
  /** Hooke's Law spring stiffness coefficient for pill width morphing. Default: 380 */
  stiffness?: number;
  /** Spring damping coefficient for pill width morphing. Default: 26 */
  damping?: number;
  className?: string;
}

export function MorphingActionButton({
  idleLabel = "Publish Registry",
  loadingLabel = "Compiling...",
  successLabel = "Published v2.4",
  simulateError = false,
  stiffness = 380,
  damping = 26,
  className,
}: MorphingActionButtonProps) {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const [phase, setPhase] = useState<ActionPhase>("idle");
  const [runCount, setRunCount] = useState(0);

  const handleTrigger = () => {
    if (phase === "loading") return;
    if (phase !== "idle") {
      setPhase("idle");
      return;
    }

    setPhase("loading");
    const nextRun = runCount + 1;
    setRunCount(nextRun);

    setTimeout(() => {
      if (simulateError && nextRun % 2 === 0) {
        setPhase("error");
      } else {
        setPhase("success");
      }
      setTimeout(() => {
        setPhase("idle");
      }, 1800);
    }, 950);
  };

  return (
    <motion.button
      layout
      type="button"
      aria-live="polite"
      onClick={handleTrigger}
      animate={
        phase === "error" && !shouldReduceMotion
          ? { x: [0, -7, 7, -4, 4, 0] }
          : { x: 0 }
      }
      transition={
        shouldReduceMotion
          ? { duration: 0.01 }
          : { type: "spring", stiffness, damping }
      }
      className={cn(
        "relative inline-flex h-12 items-center justify-center overflow-hidden rounded-full border px-6 text-xs font-semibold shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 dark:focus-visible:ring-white",
        phase === "idle" &&
          "border-black bg-black text-white hover:opacity-90 dark:border-white dark:bg-white dark:text-black",
        phase === "loading" &&
          "border-neutral-300 bg-neutral-100 text-neutral-700 dark:border-[#262626] dark:bg-[#141414] dark:text-neutral-300",
        phase === "success" &&
          "border-black bg-white text-black dark:border-white dark:bg-[#0D0D0D] dark:text-white",
        phase === "error" &&
          "border-neutral-800 bg-neutral-900 text-white dark:border-neutral-300 dark:bg-neutral-200 dark:text-black",
        className
      )}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {phase === "idle" && (
          <motion.span
            key="idle"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="inline-flex items-center gap-2 whitespace-nowrap"
          >
            <span>{idleLabel}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </motion.span>
        )}

        {phase === "loading" && (
          <motion.span
            key="loading"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="inline-flex items-center gap-2 whitespace-nowrap"
          >
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            <span>{loadingLabel}</span>
          </motion.span>
        )}

        {phase === "success" && (
          <motion.span
            key="success"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ type: "spring", stiffness: 420, damping: 22 }}
            className="inline-flex items-center gap-2 whitespace-nowrap"
          >
            <Check className="h-4 w-4" />
            <span>{successLabel}</span>
          </motion.span>
        )}

        {phase === "error" && (
          <motion.span
            key="error"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.15 }}
            className="inline-flex items-center gap-2 whitespace-nowrap"
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>Build Failed • Retry</span>
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

export default MorphingActionButton;

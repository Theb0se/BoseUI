"use client";

import React, { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown, Cpu, Gauge, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ExpandableBentoCardProps {
  /** Card header badge text. Default: "RUNTIME_TELEMETRY" */
  badge?: string;
  /** Primary card title. Default: "GPU Compositor Pipeline" */
  title?: string;
  /** Short summary shown in both states. */
  summary?: string;
  /** Initial expanded state. Default: false */
  defaultExpanded?: boolean;
  /** Hooke's Law spring stiffness coefficient. Default: 320 */
  stiffness?: number;
  /** Spring damping coefficient. Default: 26 */
  damping?: number;
  className?: string;
}

export function ExpandableBentoCard({
  badge = "RUNTIME_TELEMETRY",
  title = "GPU Compositor Pipeline",
  summary = "Click to expand live sub-pixel spring diagnostics and frame budget metrics.",
  defaultExpanded = false,
  stiffness = 320,
  damping = 26,
  className,
}: ExpandableBentoCardProps) {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <motion.div
      layout
      transition={
        shouldReduceMotion
          ? { duration: 0.01 }
          : { type: "spring", stiffness, damping }
      }
      className={cn(
        "w-full max-w-sm overflow-hidden rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm transition-colors hover:border-neutral-400 dark:border-[#222222] dark:bg-[#0A0A0A] dark:hover:border-[#383838]",
        className
      )}
    >
      <button
        type="button"
        aria-expanded={expanded}
        onClick={() => setExpanded((prev) => !prev)}
        className="flex w-full items-start justify-between gap-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white"
      >
        <div>
          <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
            <Sparkles className="h-3 w-3 text-black dark:text-white" />
            {badge}
          </span>
          <h3 className="mt-1 text-base font-semibold text-black dark:text-white">
            {title}
          </h3>
          <p className="mt-1 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
            {summary}
          </p>
        </div>

        <motion.span
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { type: "spring", stiffness: 360, damping: 24 }
          }
          className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-neutral-50 text-black dark:border-[#262626] dark:bg-[#141414] dark:text-white"
        >
          <ChevronDown className="h-4 w-4" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="expanded-content"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={
              shouldReduceMotion
                ? { duration: 0.01 }
                : { type: "spring", stiffness, damping }
            }
            className="overflow-hidden"
          >
            <div className="mt-4 grid grid-cols-2 gap-2.5 border-t border-neutral-200 pt-4 dark:border-[#1F1F1F]">
              <div className="rounded-2xl border border-neutral-200/80 bg-neutral-50 p-3 dark:border-[#222222] dark:bg-[#121212]">
                <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase text-neutral-400">
                  <Gauge className="h-3 w-3" />
                  Frame Budget
                </div>
                <div className="mt-1 font-mono text-sm font-bold text-black dark:text-white">
                  0.42 ms
                </div>
                <div className="text-[10px] text-neutral-500">
                  120fps locked
                </div>
              </div>

              <div className="rounded-2xl border border-neutral-200/80 bg-neutral-50 p-3 dark:border-[#222222] dark:bg-[#121212]">
                <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase text-neutral-400">
                  <Cpu className="h-3 w-3" />
                  Re-Renders
                </div>
                <div className="mt-1 font-mono text-sm font-bold text-black dark:text-white">
                  0 / sec
                </div>
                <div className="text-[10px] text-neutral-500">
                  MotionValue direct
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default ExpandableBentoCard;

"use client";

import React, { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Activity, CheckCircle2, Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type IslandMode = "compact" | "telemetry" | "expanded";

export interface DynamicIslandToastProps {
  /** Initial state mode of the dynamic capsule. Default: "compact" */
  defaultMode?: IslandMode;
  /** Title displayed in expanded and telemetry modes. Default: "Registry Sync Active" */
  title?: string;
  /** Subtitle displayed inside the expanded capsule. Default: "12 shadcn v2 manifests compiled in 42ms" */
  subtitle?: string;
  /** Hooke's Law spring stiffness coefficient. Default: 340 */
  stiffness?: number;
  /** Spring damping coefficient. Default: 25 */
  damping?: number;
  className?: string;
}

export function DynamicIslandToast({
  defaultMode = "compact",
  title = "Registry Sync Active",
  subtitle = "12 shadcn v2 manifests compiled in 42ms",
  stiffness = 340,
  damping = 25,
  className,
}: DynamicIslandToastProps) {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const [mode, setMode] = useState<IslandMode>(defaultMode);

  const cycleMode = () => {
    setMode((prev) =>
      prev === "compact"
        ? "telemetry"
        : prev === "telemetry"
          ? "expanded"
          : "compact"
    );
  };

  const springTransition = shouldReduceMotion
    ? { duration: 0.01 }
    : { type: "spring" as const, stiffness, damping };

  return (
    <div
      className={cn(
        "flex min-h-[160px] w-full flex-col items-center justify-center gap-3",
        className
      )}
    >
      <motion.div
        layout
        role="status"
        aria-live="polite"
        transition={springTransition}
        onClick={() => {
          if (mode !== "expanded") cycleMode();
        }}
        className={cn(
          "relative overflow-hidden border border-neutral-800 bg-black text-white shadow-xl dark:border-[#2A2A2A] dark:bg-[#0D0D0D]",
          mode === "compact" && "cursor-pointer rounded-full px-4 py-2",
          mode === "telemetry" && "cursor-pointer rounded-full px-5 py-2.5",
          mode === "expanded" && "w-full max-w-sm rounded-3xl p-5"
        )}
      >
        <AnimatePresence mode="wait" initial={false}>
          {mode === "compact" && (
            <motion.button
              key="compact"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setMode("telemetry");
              }}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.14 }}
              className="flex items-center gap-2.5 text-xs font-semibold focus-visible:outline-none"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
              </span>
              <span>BoseUI Live</span>
              <span className="font-mono text-[10px] text-neutral-400">
                120Hz
              </span>
            </motion.button>
          )}

          {mode === "telemetry" && (
            <motion.button
              key="telemetry"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setMode("expanded");
              }}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.15 }}
              className="flex items-center gap-3 text-xs font-semibold focus-visible:outline-none"
            >
              <Activity className="h-4 w-4 text-white" />
              <span>{title}</span>
              <span className="rounded-full bg-white/15 px-2 py-0.5 font-mono text-[10px] text-white">
                99.8%
              </span>
            </motion.button>
          )}

          {mode === "expanded" && (
            <motion.div
              key="expanded"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.16 }}
              className="flex flex-col gap-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-white">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">
                      {title}
                    </div>
                    <div className="text-xs text-neutral-400">{subtitle}</div>
                  </div>
                </div>

                <button
                  type="button"
                  aria-label="Collapse dynamic island"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMode("compact");
                  }}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-neutral-300 transition-colors hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-white/5 px-3.5 py-2.5 font-mono text-[11px]">
                <span className="inline-flex items-center gap-1.5 text-neutral-300">
                  <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                  SEO Audit: 100/100
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMode("compact");
                  }}
                  className="rounded-lg bg-white px-2.5 py-1 text-[10px] font-bold text-black transition-opacity hover:opacity-90"
                >
                  Dismiss
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Mode Switcher Controls */}
      <div className="flex items-center gap-1.5">
        {(["compact", "telemetry", "expanded"] as IslandMode[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={cn(
              "rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase transition-colors",
              mode === m
                ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                : "border-neutral-200 bg-transparent text-neutral-500 hover:border-neutral-400 dark:border-[#222222]"
            )}
          >
            {m}
          </button>
        ))}
      </div>
    </div>
  );
}

export default DynamicIslandToast;

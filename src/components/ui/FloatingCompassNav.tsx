"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Compass, CornerUpLeft, CornerUpRight, CornerDownLeft, CornerDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type QuadrantId = "NW" | "NE" | "SW" | "SE";

export interface FloatingCompassNavProps {
  /** Initial corner quadrant. Default: "SE" */
  defaultQuadrant?: QuadrantId;
  /** Spring stiffness coefficient for corner snap projection. Default: 300 */
  stiffness?: number;
  /** Spring damping coefficient for corner snap projection. Default: 24 */
  damping?: number;
  className?: string;
}

const QUADRANTS: Array<{ id: QuadrantId; label: string; classes: string }> = [
  { id: "NW", label: "Top-Left", classes: "top-3 left-3" },
  { id: "NE", label: "Top-Right", classes: "top-3 right-3" },
  { id: "SW", label: "Bottom-Left", classes: "bottom-3 left-3" },
  { id: "SE", label: "Bottom-Right", classes: "bottom-3 right-3" },
];

export function FloatingCompassNav({
  defaultQuadrant = "SE",
  stiffness = 300,
  damping = 24,
  className,
}: FloatingCompassNavProps) {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const [quadrant, setQuadrant] = useState<QuadrantId>(defaultQuadrant);

  const activeSpec =
    QUADRANTS.find((q) => q.id === quadrant) || QUADRANTS[3]!;

  return (
    <div
      className={cn(
        "relative flex h-[230px] w-full max-w-md select-none items-center justify-center overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-50/70 p-4 dark:border-[#222222] dark:bg-[#0A0A0A]",
        className
      )}
    >
      {/* Corner Quadrant Targets */}
      {QUADRANTS.map((q) => (
        <button
          key={q.id}
          type="button"
          aria-label={`Snap navigation pod to ${q.label} (${q.id})`}
          onClick={() => setQuadrant(q.id)}
          className={cn(
            "absolute flex h-9 w-9 items-center justify-center rounded-xl border border-dashed font-mono text-[10px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white",
            q.classes,
            quadrant === q.id
              ? "border-transparent opacity-0"
              : "border-neutral-300 text-neutral-400 hover:border-black hover:text-black dark:border-[#2A2A2A] dark:hover:border-white dark:hover:text-white"
          )}
        >
          {q.id}
        </button>
      ))}

      {/* Center Stage Prompt */}
      <div className="text-center">
        <div className="font-mono text-[11px] font-semibold uppercase tracking-widest text-neutral-400">
          QUADRANT_ANCHOR // {quadrant}
        </div>
        <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
          Click any corner marker or directional button to snap pod
        </p>
      </div>

      {/* Spring-Projected Floating Navigation Pod */}
      <motion.div
        layout
        transition={
          shouldReduceMotion
            ? { duration: 0.01 }
            : { type: "spring", stiffness, damping }
        }
        className={cn(
          "absolute z-10 flex items-center gap-1.5 rounded-2xl border border-black bg-black p-1.5 text-white shadow-lg dark:border-white dark:bg-white dark:text-black",
          activeSpec.classes
        )}
      >
        <div className="flex items-center gap-1.5 px-2 font-mono text-[11px] font-bold">
          <Compass className="h-3.5 w-3.5" />
          <span>{quadrant}</span>
        </div>

        <div className="flex items-center gap-0.5 rounded-xl bg-white/15 p-0.5 dark:bg-black/10">
          <button
            type="button"
            aria-label="Snap North-West"
            onClick={() => setQuadrant("NW")}
            className="rounded-lg p-1 hover:bg-white/20 dark:hover:bg-black/15"
          >
            <CornerUpLeft className="h-3 w-3" />
          </button>
          <button
            type="button"
            aria-label="Snap North-East"
            onClick={() => setQuadrant("NE")}
            className="rounded-lg p-1 hover:bg-white/20 dark:hover:bg-black/15"
          >
            <CornerUpRight className="h-3 w-3" />
          </button>
          <button
            type="button"
            aria-label="Snap South-West"
            onClick={() => setQuadrant("SW")}
            className="rounded-lg p-1 hover:bg-white/20 dark:hover:bg-black/15"
          >
            <CornerDownLeft className="h-3 w-3" />
          </button>
          <button
            type="button"
            aria-label="Snap South-East"
            onClick={() => setQuadrant("SE")}
            className="rounded-lg p-1 hover:bg-white/20 dark:hover:bg-black/15"
          >
            <CornerDownRight className="h-3 w-3" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default FloatingCompassNav;

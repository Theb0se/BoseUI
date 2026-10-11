"use client";

import React, { useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { ArrowRight, Check, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ElasticSwipeSliderProps {
  /** Label displayed before confirmation. Default: "Slide to Confirm" */
  label?: string;
  /** Label displayed after confirmation. Default: "Confirmed" */
  confirmedLabel?: string;
  /** Callback fired upon reaching the trigger threshold */
  onConfirm?: () => void;
  /** Width of the slider track in pixels. Default: 280 */
  width?: number;
  /** Disabled state. Default: false */
  disabled?: boolean;
  /** Custom class name */
  className?: string;
}

export function ElasticSwipeSlider({
  label = "Slide to Confirm",
  confirmedLabel = "Confirmed",
  onConfirm,
  width = 280,
  disabled = false,
  className,
}: ElasticSwipeSliderProps) {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const reduceMotion = useReducedMotion();

  // Constraints: track width minus thumb width (48px) minus padding (8px)
  const maxDrag = Math.max(100, width - 56);

  const opacity = useTransform(x, [0, maxDrag * 0.7], [1, 0.15]);
  const progressPercent = useTransform(x, [0, maxDrag], ["0%", "100%"]);

  const handleDragEnd = () => {
    if (disabled || isConfirmed) return;
    if (x.get() >= maxDrag * 0.85) {
      setIsConfirmed(true);
      x.set(maxDrag);
      onConfirm?.();
    } else {
      x.set(0);
    }
  };

  const reset = () => {
    setIsConfirmed(false);
    x.set(0);
  };

  return (
    <div
      ref={containerRef}
      style={{ width }}
      className={cn(
        "relative flex h-14 select-none items-center overflow-hidden rounded-full border border-neutral-200 bg-neutral-100 p-1 dark:border-neutral-800 dark:bg-neutral-900",
        disabled && "opacity-50 cursor-not-allowed pointer-events-none",
        isConfirmed && "border-emerald-500/50 bg-emerald-500/10",
        className
      )}
    >
      {/* Background fill trail */}
      <motion.div
        style={{ width: isConfirmed ? "100%" : progressPercent }}
        className={cn(
          "absolute left-0 top-0 h-full rounded-full transition-colors",
          isConfirmed
            ? "bg-emerald-500"
            : "bg-neutral-200/80 dark:bg-neutral-800/80"
        )}
      />

      {/* Center Label */}
      <motion.span
        style={{ opacity: isConfirmed ? 1 : opacity }}
        className={cn(
          "pointer-events-none absolute inset-0 flex items-center justify-center font-mono text-xs font-semibold uppercase tracking-wider",
          isConfirmed
            ? "text-white"
            : "text-neutral-500 dark:text-neutral-400"
        )}
      >
        {isConfirmed ? confirmedLabel : label}
      </motion.span>

      {/* Draggable Thumb */}
      {!isConfirmed ? (
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: maxDrag }}
          dragElastic={0.12}
          dragMomentum={false}
          style={{ x }}
          onDragEnd={handleDragEnd}
          whileTap={{ scale: 0.95 }}
          className="relative z-10 flex h-12 w-12 cursor-grab active:cursor-grabbing items-center justify-center rounded-full bg-black text-white shadow-md dark:bg-white dark:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white"
        >
          <ChevronRight className="h-5 w-5 animate-pulse" />
        </motion.div>
      ) : (
        <motion.button
          type="button"
          onClick={reset}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={
            reduceMotion
              ? { duration: 0.1 }
              : { type: "spring", stiffness: 450, damping: 20 }
          }
          className="relative z-10 ml-auto flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-white text-emerald-600 shadow-md transition-transform hover:scale-105"
          title="Click to reset"
        >
          <Check className="h-5 w-5 stroke-[3]" />
        </motion.button>
      )}
    </div>
  );
}

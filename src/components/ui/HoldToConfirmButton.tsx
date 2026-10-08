"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { ShieldAlert, Check, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

export interface HoldToConfirmButtonProps {
  /** Default button label before confirmation. Default: "Hold to Purge Cache" */
  label?: string;
  /** Label displayed once hold threshold is completed. Default: "Cache Purged" */
  confirmedLabel?: string;
  /** Hold duration in milliseconds required to trigger confirmation. Default: 1400 */
  holdDuration?: number;
  /** Visual variant. Default: "default" */
  variant?: "default" | "danger";
  /** Disable button interactions. Default: false */
  disabled?: boolean;
  /** Spring stiffness coefficient for fill bar snap-back. Default: 280 */
  stiffness?: number;
  /** Spring damping coefficient for fill bar snap-back. Default: 24 */
  damping?: number;
  /** Callback fired when hold completes 100% */
  onConfirm?: () => void;
  className?: string;
}

export function HoldToConfirmButton({
  label = "Hold to Purge Cache",
  confirmedLabel = "Cache Purged",
  holdDuration = 1400,
  variant = "default",
  disabled = false,
  stiffness = 280,
  damping = 24,
  onConfirm,
  className,
}: HoldToConfirmButtonProps) {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const [isHolding, setIsHolding] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const progress = useMotionValue(0);
  const springProgress = useSpring(progress, {
    stiffness,
    damping,
    mass: 0.4,
  });

  const fillWidth = useTransform(
    springProgress,
    (v) => `${Math.max(0, Math.min(100, v))}%`
  );

  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  const stopHolding = () => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    setIsHolding(false);
    if (!isConfirmed) {
      progress.set(0);
    }
  };

  const startHolding = () => {
    if (disabled) return;
    if (isConfirmed) {
      setIsConfirmed(false);
      progress.set(0);
      return;
    }

    setIsHolding(true);
    startTimeRef.current = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTimeRef.current;
      const pct = Math.min(100, (elapsed / holdDuration) * 100);
      progress.set(pct);

      if (pct >= 100) {
        setIsHolding(false);
        setIsConfirmed(true);
        onConfirm?.();
        rafRef.current = null;
      } else {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if ((e.key === " " || e.key === "Enter") && !e.repeat && !isHolding) {
      e.preventDefault();
      startHolding();
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      stopHolding();
    }
  };

  return (
    <div className="inline-flex flex-col items-center gap-2">
      <motion.button
        type="button"
        disabled={disabled}
        aria-live="polite"
        onPointerDown={startHolding}
        onPointerUp={stopHolding}
        onPointerLeave={stopHolding}
        onPointerCancel={stopHolding}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        animate={{
          scale: isHolding && !shouldReduceMotion && !disabled ? 0.96 : 1,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 22 }}
        className={cn(
          "group relative inline-flex h-12 min-w-[220px] select-none touch-none items-center justify-center overflow-hidden rounded-2xl border px-6 text-xs font-semibold tracking-tight transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white disabled:cursor-not-allowed disabled:opacity-45",
          isConfirmed
            ? variant === "danger"
              ? "border-red-600 bg-red-600 text-white dark:border-red-500 dark:bg-red-500 dark:text-white"
              : "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
            : variant === "danger"
              ? "border-red-300 bg-red-50/60 text-red-700 hover:border-red-500 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300 dark:hover:border-red-700"
              : "border-neutral-300 bg-white text-black hover:border-black dark:border-[#262626] dark:bg-[#0A0A0A] dark:text-white dark:hover:border-white",
          className
        )}
      >
        {/* Spring-pressured progress fill overlay */}
        {!isConfirmed && (
          <motion.span
            aria-hidden="true"
            style={{ width: fillWidth }}
            className={cn(
              "pointer-events-none absolute inset-y-0 left-0",
              variant === "danger"
                ? "bg-red-500/20 dark:bg-red-500/25"
                : "bg-black/10 dark:bg-white/15"
            )}
          />
        )}

        <span className="relative z-10 flex items-center gap-2">
          {isConfirmed ? (
            <>
              <Check className="h-4 w-4" />
              <span>{confirmedLabel}</span>
              <RotateCcw className="ml-1 h-3 w-3 opacity-60" />
            </>
          ) : (
            <>
              <ShieldAlert
                className={cn(
                  "h-4 w-4 transition-transform",
                  isHolding && !shouldReduceMotion && "scale-110"
                )}
              />
              <span>{isHolding ? "Keep Holding..." : label}</span>
            </>
          )}
        </span>
      </motion.button>

      <span className="text-[11px] text-neutral-400 dark:text-neutral-500">
        {disabled
          ? "Action disabled"
          : isConfirmed
            ? "Click to reset state"
            : `Press & hold for ${(holdDuration / 1000).toFixed(1)}s (or Spacebar)`}
      </span>
    </div>
  );
}

export default HoldToConfirmButton;

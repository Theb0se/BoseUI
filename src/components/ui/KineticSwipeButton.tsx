"use client";

import React, { useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { ArrowRight, Check, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

export interface KineticSwipeButtonProps {
  /** Track instruction text before completion. Default: "Slide to Deploy Production" */
  label?: string;
  /** Text displayed when locked at the right end. Default: "Deployment Triggered" */
  completedLabel?: string;
  /** Completion threshold ratio (0.5 to 0.95). Default: 0.78 */
  threshold?: number;
  /** Spring stiffness coefficient for thumb snap-back. Default: 360 */
  stiffness?: number;
  /** Spring damping coefficient for thumb snap-back. Default: 26 */
  damping?: number;
  /** Callback fired when swipe crosses completion threshold */
  onComplete?: () => void;
  className?: string;
}

export function KineticSwipeButton({
  label = "Slide to Deploy Production",
  completedLabel = "Deployment Triggered",
  threshold = 0.78,
  stiffness = 360,
  damping = 26,
  onComplete,
  className,
}: KineticSwipeButtonProps) {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const startXRef = useRef<number>(0);

  const dragX = useMotionValue(0);
  const springX = useSpring(dragX, { stiffness, damping, mass: 0.4 });
  const textOpacity = useTransform(springX, [0, 140], [1, 0]);

  const getMaxTravel = () => {
    const track = trackRef.current;
    if (!track) return 220;
    return Math.max(0, track.clientWidth - 52);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (isCompleted) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    startXRef.current = e.clientX - dragX.get();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!isDragging || isCompleted) return;
    const maxTravel = getMaxTravel();
    const nextX = Math.max(0, Math.min(maxTravel, e.clientX - startXRef.current));
    dragX.set(nextX);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!isDragging) return;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    setIsDragging(false);

    const maxTravel = getMaxTravel();
    if (dragX.get() >= maxTravel * threshold) {
      dragX.set(maxTravel);
      setIsCompleted(true);
      onComplete?.();
    } else {
      dragX.set(0);
    }
  };

  const resetSwipe = () => {
    setIsCompleted(false);
    dragX.set(0);
  };

  return (
    <div
      ref={trackRef}
      className={cn(
        "relative flex h-14 w-full max-w-xs select-none items-center overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100 p-1.5 dark:border-[#222222] dark:bg-[#0D0D0D]",
        className
      )}
    >
      {/* Center Track Label */}
      {!isCompleted ? (
        <motion.span
          style={{ opacity: shouldReduceMotion ? 1 : textOpacity }}
          className="pointer-events-none mx-auto pl-8 text-xs font-semibold tracking-tight text-neutral-500 dark:text-neutral-400"
        >
          {label}
        </motion.span>
      ) : (
        <button
          type="button"
          onClick={resetSwipe}
          className="mx-auto inline-flex items-center gap-1.5 text-xs font-semibold text-black dark:text-white"
        >
          <Check className="h-4 w-4" />
          <span>{completedLabel}</span>
          <RotateCcw className="ml-1 h-3 w-3 text-neutral-400" />
        </button>
      )}

      {/* Draggable Magnetic Actuator Thumb */}
      {!isCompleted && (
        <motion.button
          type="button"
          aria-label={label}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              dragX.set(getMaxTravel());
              setIsCompleted(true);
              onComplete?.();
            }
          }}
          style={{ x: shouldReduceMotion ? 0 : springX }}
          className="absolute left-1.5 flex h-11 w-11 cursor-grab touch-none items-center justify-center rounded-xl bg-black text-white shadow-sm active:cursor-grabbing focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:bg-white dark:text-black dark:focus-visible:ring-white"
        >
          <ArrowRight className="h-4 w-4" />
        </motion.button>
      )}
    </div>
  );
}

export default KineticSwipeButton;

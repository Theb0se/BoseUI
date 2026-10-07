"use client";

import React, { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import { MoveHorizontal, Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ScrubbableNumberInputProps {
  /** Label shown on the left side of the scrubbable pill. Default: "Stiffness" */
  label?: string;
  /** Controlled numeric value */
  value?: number;
  /** Uncontrolled initial numeric value. Default: 240 */
  defaultValue?: number;
  /** Minimum value. Default: 0 */
  min?: number;
  /** Maximum value. Default: 1000 */
  max?: number;
  /** Base increment step per scrub unit. Default: 5 */
  step?: number;
  /** Pixels of horizontal drag required per step increment. Default: 4 */
  pixelsPerStep?: number;
  /** Unit suffix displayed next to the value. Default: "N/m" */
  unit?: string;
  /** Callback fired when numeric value changes */
  onChange?: (value: number) => void;
  className?: string;
}

export function ScrubbableNumberInput({
  label = "Stiffness",
  value: controlledValue,
  defaultValue = 240,
  min = 0,
  max = 1000,
  step = 5,
  pixelsPerStep = 4,
  unit = "N/m",
  onChange,
  className,
}: ScrubbableNumberInputProps) {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const [internalValue, setInternalValue] = useState<number>(() =>
    Math.min(max, Math.max(min, defaultValue))
  );
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [direction, setDirection] = useState<1 | -1>(1);

  const startXRef = useRef<number>(0);
  const startValRef = useRef<number>(defaultValue);

  const currentValue =
    controlledValue !== undefined ? controlledValue : internalValue;

  // Elastic housing horizontal tug
  const tugX = useMotionValue(0);
  const springTugX = useSpring(tugX, {
    stiffness: 380,
    damping: 24,
    mass: 0.4,
  });

  const commitValue = (nextRaw: number) => {
    const stepped = Math.round((nextRaw - min) / step) * step + min;
    const clamped = Math.min(max, Math.max(min, stepped));
    if (clamped !== currentValue) {
      setDirection(clamped > currentValue ? 1 : -1);
      if (controlledValue === undefined) {
        setInternalValue(clamped);
      }
      onChange?.(clamped);
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("button")) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsScrubbing(true);
    startXRef.current = e.clientX;
    startValRef.current = currentValue;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isScrubbing) return;
    const deltaX = e.clientX - startXRef.current;
    const modifier = e.shiftKey ? 5 : e.altKey ? 0.2 : 1;
    const stepsMoved = Math.round(deltaX / pixelsPerStep);
    const nextVal = startValRef.current + stepsMoved * step * modifier;

    // Subtle spring tug feedback capped at +-10px
    const clampedTug = Math.max(-10, Math.min(10, deltaX * 0.12));
    tugX.set(shouldReduceMotion ? 0 : clampedTug);

    commitValue(nextVal);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    setIsScrubbing(false);
    tugX.set(0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const multiplier = e.shiftKey ? 10 : 1;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      commitValue(currentValue + step * multiplier);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      commitValue(currentValue - step * multiplier);
    } else if (e.key === "Home") {
      e.preventDefault();
      commitValue(min);
    } else if (e.key === "End") {
      e.preventDefault();
      commitValue(max);
    }
  };

  return (
    <motion.div
      role="spinbutton"
      tabIndex={0}
      aria-label={label}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={currentValue}
      aria-valuetext={`${currentValue} ${unit}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onKeyDown={handleKeyDown}
      style={{ x: shouldReduceMotion ? 0 : springTugX }}
      className={cn(
        "group inline-flex w-full max-w-xs cursor-ew-resize select-none touch-none items-center justify-between gap-3 rounded-2xl border bg-white px-4 py-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:bg-[#0A0A0A] dark:focus-visible:ring-white",
        isScrubbing
          ? "border-black shadow-sm dark:border-white"
          : "border-neutral-200 hover:border-neutral-400 dark:border-[#222222] dark:hover:border-[#383838]",
        className
      )}
    >
      {/* Left Scrub Label */}
      <div className="flex items-center gap-2">
        <MoveHorizontal
          aria-hidden="true"
          className={cn(
            "h-3.5 w-3.5 transition-colors",
            isScrubbing
              ? "text-black dark:text-white"
              : "text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-300"
          )}
        />
        <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-300">
          {label}
        </span>
      </div>

      {/* Right Value + Stepper Controls */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          tabIndex={-1}
          aria-label={`Decrease ${label}`}
          onClick={() => commitValue(currentValue - step)}
          disabled={currentValue <= min}
          className="flex h-6 w-6 items-center justify-center rounded-lg border border-neutral-200 text-neutral-500 transition-colors hover:border-black hover:text-black disabled:opacity-30 dark:border-[#262626] dark:hover:border-white dark:hover:text-white"
        >
          <Minus className="h-3 w-3" />
        </button>

        <div className="relative flex min-w-[4.5rem] items-baseline justify-end overflow-hidden font-mono text-sm font-semibold tabular-nums text-black dark:text-white">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={currentValue}
              initial={
                shouldReduceMotion
                  ? { opacity: 1 }
                  : { y: direction * 12, opacity: 0 }
              }
              animate={{ y: 0, opacity: 1 }}
              exit={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : { y: direction * -12, opacity: 0 }
              }
              transition={{ type: "spring", stiffness: 420, damping: 28 }}
              className="inline-block"
            >
              {currentValue}
            </motion.span>
          </AnimatePresence>
          {unit && (
            <span className="ml-1 text-[10px] font-normal text-neutral-400">
              {unit}
            </span>
          )}
        </div>

        <button
          type="button"
          tabIndex={-1}
          aria-label={`Increase ${label}`}
          onClick={() => commitValue(currentValue + step)}
          disabled={currentValue >= max}
          className="flex h-6 w-6 items-center justify-center rounded-lg border border-neutral-200 text-neutral-500 transition-colors hover:border-black hover:text-black disabled:opacity-30 dark:border-[#262626] dark:hover:border-white dark:hover:text-white"
        >
          <Plus className="h-3 w-3" />
        </button>
      </div>
    </motion.div>
  );
}

export default ScrubbableNumberInput;

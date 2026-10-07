"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useVelocity,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { cn } from "@/lib/utils";

export interface KineticSliderProps {
  /** Field label displayed above the slider track. Default: "Spring Tension" */
  label?: string;
  /** Controlled numeric value */
  value?: number;
  /** Uncontrolled initial numeric value. Default: 64 */
  defaultValue?: number;
  /** Minimum value. Default: 0 */
  min?: number;
  /** Maximum value. Default: 100 */
  max?: number;
  /** Increment step size. Default: 1 */
  step?: number;
  /** Unit suffix appended to displayed value (e.g. "%", "Hz", "ms"). Default: "%" */
  unit?: string;
  /** Hooke's Law spring stiffness coefficient. Default: 340 */
  stiffness?: number;
  /** Spring damping coefficient. Default: 24 */
  damping?: number;
  /** Callback fired when value changes */
  onChange?: (value: number) => void;
  className?: string;
}

export function KineticSlider({
  label = "Spring Tension",
  value: controlledValue,
  defaultValue = 64,
  min = 0,
  max = 100,
  step = 1,
  unit = "%",
  stiffness = 340,
  damping = 24,
  onChange,
  className,
}: KineticSliderProps) {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const trackRef = useRef<HTMLDivElement | null>(null);

  const [internalValue, setInternalValue] = useState<number>(() =>
    Math.min(max, Math.max(min, defaultValue))
  );
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const currentValue =
    controlledValue !== undefined ? controlledValue : internalValue;
  const range = Math.max(1, max - min);
  const normalizedPct = ((currentValue - min) / range) * 100;

  const pctMotion = useMotionValue(normalizedPct);
  const springPct = useSpring(pctMotion, {
    stiffness,
    damping,
    mass: 0.4,
  });

  // Rubber-band overdrag horizontal stretch in pixels
  const overdragX = useMotionValue(0);
  const springOverdragX = useSpring(overdragX, {
    stiffness: 420,
    damping: 26,
  });

  // Velocity-reactive tooltip tilt
  const pctVelocity = useVelocity(springPct);
  const rawTilt = useTransform(pctVelocity, [-250, 0, 250], [-14, 0, 14]);
  const tooltipRotate = useSpring(rawTilt, {
    stiffness: 320,
    damping: 20,
  });

  const fillWidth = useTransform(springPct, (v) => `${Math.max(0, Math.min(100, v))}%`);

  useEffect(() => {
    pctMotion.set(((currentValue - min) / range) * 100);
  }, [currentValue, min, range, pctMotion]);

  const commitValue = (nextRaw: number) => {
    const stepped = Math.round((nextRaw - min) / step) * step + min;
    const clamped = Math.min(max, Math.max(min, Number(stepped.toFixed(4))));
    if (controlledValue === undefined) {
      setInternalValue(clamped);
    }
    onChange?.(clamped);
  };

  const updateFromClientX = (clientX: number) => {
    const track = trackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const rawRatio = (clientX - rect.left) / rect.width;

    if (rawRatio < 0) {
      const excessPx = clientX - rect.left;
      const rubber = -Math.log1p(Math.abs(excessPx)) * 3.2;
      overdragX.set(shouldReduceMotion ? 0 : rubber);
      commitValue(min);
    } else if (rawRatio > 1) {
      const excessPx = clientX - rect.right;
      const rubber = Math.log1p(Math.abs(excessPx)) * 3.2;
      overdragX.set(shouldReduceMotion ? 0 : rubber);
      commitValue(max);
    } else {
      overdragX.set(0);
      commitValue(min + rawRatio * range);
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    updateFromClientX(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    updateFromClientX(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    setIsDragging(false);
    overdragX.set(0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const largeStep = step * 10;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      commitValue(currentValue + step);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      commitValue(currentValue - step);
    } else if (e.key === "PageUp") {
      e.preventDefault();
      commitValue(currentValue + largeStep);
    } else if (e.key === "PageDown") {
      e.preventDefault();
      commitValue(currentValue - largeStep);
    } else if (e.key === "Home") {
      e.preventDefault();
      commitValue(min);
    } else if (e.key === "End") {
      e.preventDefault();
      commitValue(max);
    }
  };

  const showBubble = isDragging || isHovered || isFocused;

  return (
    <motion.div
      style={{ x: shouldReduceMotion ? 0 : springOverdragX }}
      className={cn(
        "w-full max-w-sm select-none rounded-2xl border border-neutral-200 bg-white p-5 dark:border-[#222222] dark:bg-[#0A0A0A]",
        className
      )}
    >
      <div className="mb-4 flex items-center justify-between text-xs">
        <span className="font-semibold tracking-tight text-black dark:text-white">
          {label}
        </span>
        <span className="font-mono text-xs font-medium tabular-nums text-neutral-500 dark:text-neutral-400">
          {currentValue}
          {unit}
        </span>
      </div>

      {/* Interactive Slider Track */}
      <div
        ref={trackRef}
        role="slider"
        tabIndex={0}
        aria-label={label}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={currentValue}
        aria-valuetext={`${currentValue}${unit}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyDown={handleKeyDown}
        className="group relative flex h-9 cursor-ew-resize touch-none items-center rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white"
      >
        {/* Background Rail */}
        <motion.div
          animate={{
            height: isDragging ? 10 : isHovered ? 8 : 6,
          }}
          transition={{ type: "spring", stiffness: 360, damping: 26 }}
          className="relative w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-[#1E1E1E]"
        >
          {/* Active Fill Bar */}
          <motion.div
            style={{
              width: shouldReduceMotion ? `${normalizedPct}%` : fillWidth,
            }}
            className="h-full rounded-full bg-black dark:bg-white"
          />
        </motion.div>

        {/* Thumb + Velocity-Reactive Floating Pill */}
        <motion.div
          style={{
            left: shouldReduceMotion ? `${normalizedPct}%` : fillWidth,
          }}
          className="pointer-events-none absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          {/* Floating Velocity Pill */}
          <motion.div
            initial={false}
            animate={{
              opacity: showBubble ? 1 : 0,
              y: showBubble ? -30 : -18,
              scale: showBubble ? 1 : 0.85,
            }}
            style={{
              rotate: shouldReduceMotion ? 0 : tooltipRotate,
            }}
            transition={{ type: "spring", stiffness: 380, damping: 22 }}
            aria-hidden="true"
            className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-black px-2 py-0.5 font-mono text-[10px] font-semibold tabular-nums text-white shadow-sm dark:bg-white dark:text-black"
          >
            {currentValue}
            {unit}
          </motion.div>

          {/* Tactile Thumb */}
          <motion.div
            animate={{
              scaleX: isDragging && !shouldReduceMotion ? 1.18 : 1,
              scaleY: isDragging && !shouldReduceMotion ? 0.9 : 1,
              scale: isHovered || isFocused ? 1.08 : 1,
            }}
            transition={{ type: "spring", stiffness: 400, damping: 22 }}
            className="h-5 w-5 rounded-full border-2 border-black bg-white shadow-sm dark:border-white dark:bg-[#0A0A0A]"
          />
        </motion.div>
      </div>

      <div className="mt-2 flex justify-between font-mono text-[10px] text-neutral-400">
        <span>
          {min}
          {unit}
        </span>
        <span>
          {max}
          {unit}
        </span>
      </div>
    </motion.div>
  );
}

export default KineticSlider;

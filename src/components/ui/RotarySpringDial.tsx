"use client";

import React, { useRef, useState } from "react";
import { motion, useSpring, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface RotarySpringDialProps {
  /** Dial parameter label. Default: "Damping Ratio" */
  label?: string;
  /** Initial value between min and max. Default: 65 */
  defaultValue?: number;
  /** Minimum value. Default: 0 */
  min?: number;
  /** Maximum value. Default: 100 */
  max?: number;
  /** Step increment. Default: 5 */
  step?: number;
  /** Unit suffix. Default: "%" */
  unit?: string;
  /** Spring stiffness coefficient for rotary needle. Default: 340 */
  stiffness?: number;
  /** Spring damping coefficient for rotary needle. Default: 24 */
  damping?: number;
  /** Callback fired when value changes */
  onChange?: (val: number) => void;
  className?: string;
}

export function RotarySpringDial({
  label = "Damping Ratio",
  defaultValue = 65,
  min = 0,
  max = 100,
  step = 5,
  unit = "%",
  stiffness = 340,
  damping = 24,
  onChange,
  className,
}: RotarySpringDialProps) {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const [value, setValue] = useState<number>(() =>
    Math.min(max, Math.max(min, defaultValue))
  );
  const [isDragging, setIsDragging] = useState(false);
  const startYRef = useRef<number>(0);
  const startValRef = useRef<number>(defaultValue);

  const range = Math.max(1, max - min);
  const ratio = (value - min) / range;
  // Map 0..1 ratio to -135deg .. +135deg rotary arc
  const targetAngle = -135 + ratio * 270;

  const springAngle = useSpring(targetAngle, {
    stiffness,
    damping,
    mass: 0.4,
  });

  const commitValue = (nextRaw: number) => {
    const stepped = Math.round((nextRaw - min) / step) * step + min;
    const clamped = Math.min(max, Math.max(min, stepped));
    setValue(clamped);
    const nextRatio = (clamped - min) / range;
    springAngle.set(-135 + nextRatio * 270);
    onChange?.(clamped);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    startYRef.current = e.clientY;
    startValRef.current = value;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    // Dragging upward increases value, downward decreases
    const deltaY = startYRef.current - e.clientY;
    const deltaVal = (deltaY / 120) * range;
    commitValue(startValRef.current + deltaVal);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    setIsDragging(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowUp" || e.key === "ArrowRight") {
      e.preventDefault();
      commitValue(value + step);
    } else if (e.key === "ArrowDown" || e.key === "ArrowLeft") {
      e.preventDefault();
      commitValue(value - step);
    } else if (e.key === "Home") {
      e.preventDefault();
      commitValue(min);
    } else if (e.key === "End") {
      e.preventDefault();
      commitValue(max);
    }
  };

  return (
    <div
      className={cn(
        "inline-flex flex-col items-center gap-3 rounded-3xl border border-neutral-200 bg-white px-6 py-5 shadow-sm select-none dark:border-[#222222] dark:bg-[#0A0A0A]",
        className
      )}
    >
      <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
        {label}
      </div>

      {/* Tactile Synthesizer Rotary Knob */}
      <div
        role="slider"
        tabIndex={0}
        aria-label={label}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-valuetext={`${value}${unit}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onKeyDown={handleKeyDown}
        className={cn(
          "relative flex h-24 w-24 cursor-ns-resize touch-none items-center justify-center rounded-full border-2 bg-neutral-50 shadow-inner transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:bg-[#121212] dark:focus-visible:ring-white",
          isDragging
            ? "border-black dark:border-white"
            : "border-neutral-200 hover:border-neutral-400 dark:border-[#262626] dark:hover:border-[#3A3A3A]"
        )}
      >
        {/* Rotating Dial Rotor + Indicator Notch */}
        <motion.div
          aria-hidden="true"
          style={{
            rotate: shouldReduceMotion ? targetAngle : springAngle,
          }}
          className="relative flex h-16 w-16 items-start justify-center rounded-full border border-neutral-300 bg-white pt-1.5 shadow-md dark:border-[#333333] dark:bg-[#1B1B1B]"
        >
          <span className="h-3 w-1 rounded-full bg-black dark:bg-white" />
        </motion.div>
      </div>

      {/* Digital Readout + Quick Stepper */}
      <div className="font-mono text-sm font-bold tabular-nums text-black dark:text-white">
        {value}
        {unit}
      </div>

      <div className="text-[10px] text-neutral-400">
        Drag vertically or use ↑/↓ keys
      </div>
    </div>
  );
}

export default RotarySpringDial;

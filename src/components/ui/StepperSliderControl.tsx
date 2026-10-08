"use client";

import React, { useState, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StepperSliderControlProps {
  /** Label for the control */
  label?: string;
  /** Controlled numeric value */
  value?: number;
  /** Initial value for uncontrolled mode. Default: 60 */
  defaultValue?: number;
  /** Minimum value. Default: 0 */
  min?: number;
  /** Maximum value. Default: 100 */
  max?: number;
  /** Step increment for both slider and (− / +) buttons. Default: 5 */
  step?: number;
  /** Optional unit suffix (e.g. "%", "px", "dB"). Default: "%" */
  unit?: string;
  /** Callback fired when value changes */
  onChange?: (value: number) => void;
  /** Disable interactions */
  disabled?: boolean;
  className?: string;
}

export function StepperSliderControl({
  label = "Display Brightness",
  value: controlledValue,
  defaultValue = 65,
  min = 0,
  max = 100,
  step = 5,
  unit = "%",
  onChange,
  disabled = false,
  className,
}: StepperSliderControlProps) {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const trackRef = useRef<HTMLDivElement>(null);
  const isControlled = controlledValue !== undefined;

  const [internalVal, setInternalVal] = useState(defaultValue);
  const [isDragging, setIsDragging] = useState(false);

  const currentVal = isControlled ? controlledValue : internalVal;

  const clampAndSnap = (raw: number) => {
    const snapped = Math.round((raw - min) / step) * step + min;
    return Math.max(min, Math.min(max, Number(snapped.toFixed(4))));
  };

  const updateValue = (next: number) => {
    if (disabled) return;
    const clamped = clampAndSnap(next);
    if (!isControlled) {
      setInternalVal(clamped);
    }
    onChange?.(clamped);
  };

  const pct =
    max > min ? Math.max(0, Math.min(100, ((currentVal - min) / (max - min)) * 100)) : 0;

  const updateFromPointer = (clientX: number) => {
    if (!trackRef.current || disabled) return;
    const rect = trackRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const rawValue = min + ratio * (max - min);
    updateValue(rawValue);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (disabled) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    updateFromPointer(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || disabled) return;
    updateFromPointer(e.clientX);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      className={cn(
        "w-full max-w-sm rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-[#0A0A0A]",
        disabled && "opacity-50",
        className
      )}
    >
      {/* Top Row: Label + Value Readout */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-neutral-950 dark:text-white">
          {label}
        </span>
        <span className="font-mono text-sm font-bold tracking-tight text-neutral-950 dark:text-white">
          {currentVal}
          {unit}
        </span>
      </div>

      {/* Thin-Track Slider with Large Round Thumb */}
      <div
        ref={trackRef}
        role="slider"
        tabIndex={disabled ? -1 : 0}
        aria-label={label}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={currentVal}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onKeyDown={(e) => {
          if (disabled) return;
          if (e.key === "ArrowRight" || e.key === "ArrowUp") {
            e.preventDefault();
            updateValue(currentVal + step);
          } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
            e.preventDefault();
            updateValue(currentVal - step);
          } else if (e.key === "Home") {
            e.preventDefault();
            updateValue(min);
          } else if (e.key === "End") {
            e.preventDefault();
            updateValue(max);
          }
        }}
        className="relative my-5 flex h-7 cursor-pointer touch-none select-none items-center focus-visible:outline-none"
      >
        {/* Thin Background Track */}
        <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
          <motion.div
            animate={{ width: `${pct}%` }}
            transition={
              isDragging || shouldReduceMotion
                ? { duration: 0 }
                : { type: "spring", stiffness: 420, damping: 32 }
            }
            className="h-full rounded-full bg-neutral-900 dark:bg-white"
          />
        </div>

        {/* Large Round Thumb */}
        <motion.div
          animate={{
            left: `calc(${pct}% - 12px)`,
            scale: isDragging && !shouldReduceMotion ? 1.15 : 1,
          }}
          transition={
            isDragging || shouldReduceMotion
              ? { duration: 0 }
              : { type: "spring", stiffness: 420, damping: 32 }
          }
          className="pointer-events-none absolute h-6 w-6 rounded-full border-2 border-neutral-900 bg-white shadow-md dark:border-white dark:bg-neutral-950"
        />
      </div>

      {/* Bottom Row: Minimal Stepper (− / +) & Fine-Tune Controls */}
      <div className="flex items-center justify-between border-t border-neutral-100 pt-3.5 dark:border-neutral-900">
        <span className="font-mono text-[11px] text-neutral-400">
          Step: {step}
          {unit}
        </span>

        {/* Apple-Style Segmented Pill Stepper (− | +) */}
        <div className="inline-flex h-9 items-center overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100/80 dark:border-neutral-800 dark:bg-neutral-900">
          <button
            type="button"
            aria-label={`Decrease ${label}`}
            disabled={disabled || currentVal <= min}
            onClick={() => updateValue(currentVal - step)}
            className="flex h-full w-11 items-center justify-center text-neutral-700 transition-colors hover:bg-neutral-200/70 active:scale-95 disabled:cursor-not-allowed disabled:opacity-35 dark:text-neutral-200 dark:hover:bg-neutral-800"
          >
            <Minus className="h-3.5 w-3.5 stroke-[2.2]" />
          </button>

          <span
            aria-hidden="true"
            className="h-4 w-px bg-neutral-300 dark:bg-neutral-700"
          />

          <button
            type="button"
            aria-label={`Increase ${label}`}
            disabled={disabled || currentVal >= max}
            onClick={() => updateValue(currentVal + step)}
            className="flex h-full w-11 items-center justify-center text-neutral-700 transition-colors hover:bg-neutral-200/70 active:scale-95 disabled:cursor-not-allowed disabled:opacity-35 dark:text-neutral-200 dark:hover:bg-neutral-800"
          >
            <Plus className="h-3.5 w-3.5 stroke-[2.2]" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default StepperSliderControl;

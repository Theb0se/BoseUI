"use client";

import React, { useEffect, useState } from "react";
import { motion, useSpring, useTransform, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface AIGenerationProgressProps {
  /** Progress percentage 0–100. Ignored when indeterminate is true. */
  progress?: number;
  /** Current generated token count */
  current?: number;
  /** Total expected token count */
  total?: number;
  /** Spin indeterminately when total token count is unknown */
  indeterminate?: boolean;
  /** Ring diameter in px. Default: 96 */
  size?: number;
  /** Ring stroke thickness. Default: 6 */
  strokeWidth?: number;
  /** Optional status text shown below counter */
  statusText?: string;
  className?: string;
}

export function AIGenerationProgress({
  progress = 0,
  current,
  total,
  indeterminate = false,
  size = 96,
  strokeWidth = 6,
  statusText,
  className,
}: AIGenerationProgressProps) {
  const reduceMotion = useReducedMotion();
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;

  // Spring-animated progress value
  const springProgress = useSpring(0, {
    stiffness: 90,
    damping: 24,
    mass: 0.6,
  });

  useEffect(() => {
    if (!indeterminate) {
      springProgress.set(Math.max(0, Math.min(100, progress)));
    }
  }, [progress, indeterminate, springProgress]);

  const dashOffset = useTransform(
    springProgress,
    [0, 100],
    [circumference, 0]
  );

  const center = size / 2;

  return (
    <div
      role="progressbar"
      aria-valuenow={indeterminate ? undefined : Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="AI generation progress"
      className={cn("flex flex-col items-center justify-center gap-2", className)}
    >
      <div
        className="relative flex items-center justify-center select-none"
        style={{ width: size, height: size }}
      >
        {indeterminate ? (
          <motion.svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            animate={reduceMotion ? {} : { rotate: 360 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0"
          >
            {/* Track */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth={strokeWidth}
              className="text-muted/40"
            />
            {/* Spinning Arc */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={`${circumference * 0.28} ${circumference * 0.72}`}
              className="text-foreground"
            />
          </motion.svg>
        ) : (
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            className="absolute inset-0 -rotate-90"
          >
            {/* Track */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth={strokeWidth}
              className="text-muted/40"
            />
            {/* Progress Arc */}
            <motion.circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              style={{
                strokeDashoffset: reduceMotion
                  ? circumference - (progress / 100) * circumference
                  : dashOffset,
              }}
              className="text-foreground"
            />
          </svg>
        )}

        {/* Center Content */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-1">
          {indeterminate ? (
            <span className="text-xs font-mono font-medium text-muted-foreground animate-pulse">
              ···
            </span>
          ) : total !== undefined ? (
            <>
              <span className="text-sm font-semibold tabular-nums font-mono text-foreground leading-none">
                {current ?? Math.round((progress / 100) * total)}
              </span>
              <span className="text-[10px] font-mono text-muted-foreground/60 leading-none mt-1">
                / {total}
              </span>
            </>
          ) : (
            <span className="text-sm font-semibold tabular-nums font-mono text-foreground">
              {Math.round(progress)}%
            </span>
          )}
        </div>
      </div>

      {statusText && (
        <span className="text-xs font-mono text-muted-foreground/70 tracking-tight">
          {statusText}
        </span>
      )}
    </div>
  );
}

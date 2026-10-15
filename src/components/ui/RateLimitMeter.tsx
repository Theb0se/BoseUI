"use client";

import React, { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Gauge,
  Zap,
  AlertTriangle,
  RotateCcw,
  ShieldAlert,
  Clock,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface RateLimitMeterProps {
  /** Maximum requests allowed in current window */
  maxLimit?: number;
  /** Current remaining requests */
  initialRemaining?: number;
  /** Window duration in seconds */
  windowSeconds?: number;
  /** Rate limit tier name, e.g. "Pro Tier (API Gateway)" */
  tierLabel?: string;
  /** Key or client identifier */
  clientIdentifier?: string;
  className?: string;
}

export function RateLimitMeter({
  maxLimit = 120,
  initialRemaining = 92,
  windowSeconds = 60,
  tierLabel = "Pro Plan (Global Edge)",
  clientIdentifier = "api_key_live_948a**",
  className,
}: RateLimitMeterProps) {
  const [remaining, setRemaining] = useState(initialRemaining);
  const [secondsLeft, setSecondsLeft] = useState(windowSeconds);
  const reduceMotion = useReducedMotion();

  // Tick down seconds until window resets
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setRemaining(maxLimit);
          return windowSeconds;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [maxLimit, windowSeconds]);

  const percentage = Math.max(0, Math.min(100, Math.round((remaining / maxLimit) * 100)));
  const isCritical = remaining === 0;
  const isWarning = remaining > 0 && percentage <= 25;

  const handleSimulateOne = () => {
    setRemaining((prev) => Math.max(0, prev - 1));
  };

  const handleSimulateBurst = () => {
    setRemaining((prev) => Math.max(0, prev - 15));
  };

  const handleReset = () => {
    setRemaining(maxLimit);
    setSecondsLeft(windowSeconds);
  };

  return (
    <div
      className={cn(
        "w-full rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6 shadow-sm text-neutral-900 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100 flex flex-col gap-5",
        isCritical && "border-rose-500/40 bg-rose-500/5 dark:border-rose-500/40 dark:bg-rose-500/10",
        className
      )}
    >
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 dark:border-neutral-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Gauge className="h-4 w-4 text-neutral-900 dark:text-white" />
            <h3 className="text-sm font-semibold tracking-tight text-neutral-900 dark:text-white">
              Rate Limit &amp; Quota Meter
            </h3>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Sliding window token-bucket capacity monitor with retry telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] text-neutral-600 bg-neutral-100 dark:bg-neutral-900 dark:text-neutral-400 px-2.5 py-1 rounded-lg border border-neutral-200 dark:border-neutral-800">
            {clientIdentifier}
          </span>
          <button
            onClick={handleReset}
            title="Reset quota"
            className="p-1.5 rounded-lg border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:text-neutral-400 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Main Metric Banner */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800">
        <div className="flex flex-col">
          <span className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
            {tierLabel}
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span
              className={cn(
                "text-3xl font-extrabold font-mono tracking-tight",
                isCritical
                  ? "text-rose-500"
                  : isWarning
                  ? "text-amber-500"
                  : "text-neutral-900 dark:text-white"
              )}
            >
              {remaining}
            </span>
            <span className="text-sm font-mono text-neutral-500 dark:text-neutral-400">/ {maxLimit} req</span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:justify-end">
          {isCritical ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-semibold font-mono animate-pulse">
              <ShieldAlert className="h-4 w-4" />
              <span>429 Quota Exceeded (Retry: {secondsLeft}s)</span>
            </div>
          ) : isWarning ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-semibold font-mono">
              <AlertTriangle className="h-4 w-4" />
              <span>Throttling Warning (&lt; 25%)</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold font-mono">
              <ShieldCheck className="h-4 w-4" />
              <span>Healthy Throughput</span>
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar & Visual Token Track */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 font-mono">
          <span>Capacity remaining: {percentage}%</span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" /> Resets in {secondsLeft}s
          </span>
        </div>

        <div className="w-full h-3 rounded-full bg-neutral-100 dark:bg-neutral-900 overflow-hidden relative border border-neutral-200 dark:border-neutral-800">
          <motion.div
            className={cn(
              "h-full rounded-full transition-colors",
              isCritical
                ? "bg-rose-500"
                : isWarning
                ? "bg-amber-500"
                : "bg-neutral-900 dark:bg-white"
            )}
            initial={false}
            animate={{ width: `${percentage}%` }}
            transition={
              reduceMotion
                ? { duration: 0.1 }
                : { type: "spring", stiffness: 300, damping: 25 }
            }
          />
        </div>
      </div>

      {/* Interactive Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-neutral-200 dark:border-neutral-800">
        <span className="text-xs text-neutral-500 dark:text-neutral-400">Test live rate limiter behavior:</span>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSimulateOne}
            disabled={isCritical}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-xs font-medium text-neutral-800 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:text-neutral-200 transition-all active:scale-95 disabled:opacity-40"
          >
            <Zap className="h-3.5 w-3.5 text-neutral-700 dark:text-neutral-300" />
            <span>+1 Request</span>
          </button>
          <button
            onClick={handleSimulateBurst}
            disabled={isCritical}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 text-xs font-semibold transition-all active:scale-95 disabled:opacity-40 shadow-xs"
          >
            <span>Simulate Burst (-15)</span>
          </button>
        </div>
      </div>
    </div>
  );
}

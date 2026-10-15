"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Database, AlertTriangle, CheckCircle, Info, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ContextTokenGaugeProps {
  /** Total tokens currently utilized. Default: 42800 */
  usedTokens?: number;
  /** Maximum context window capacity. Default: 128000 */
  maxTokens?: number;
  /** Specific system prompt tokens */
  systemTokens?: number;
  /** Specific user input prompt tokens */
  promptTokens?: number;
  /** Specific model completion tokens */
  completionTokens?: number;
  /** Visual presentation mode. Default: "radial" */
  variant?: "radial" | "bar";
  /** Model name badge. Default: "Claude 3.5 Sonnet (128k)" */
  modelName?: string;
  /** Show breakdown pills beneath gauge. Default: true */
  showBreakdown?: boolean;
  className?: string;
}

export function ContextTokenGauge({
  usedTokens = 42800,
  maxTokens = 128000,
  systemTokens = 3400,
  promptTokens = 24600,
  completionTokens = 14800,
  variant = "radial",
  modelName = "Claude 3.5 Sonnet (128k)",
  showBreakdown = true,
  className,
}: ContextTokenGaugeProps) {
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();

  const percentage = Math.min(Math.max((usedTokens / maxTokens) * 100, 0), 100);
  const remainingTokens = Math.max(maxTokens - usedTokens, 0);

  // Status thresholds
  const isCritical = percentage >= 90;
  const isWarning = percentage >= 75 && percentage < 90;

  const statusColor = isCritical
    ? "text-rose-500"
    : isWarning
    ? "text-amber-500"
    : "text-emerald-500";

  const strokeColor = isCritical
    ? "#F43F5E"
    : isWarning
    ? "#F59E0B"
    : "#10B981";

  // Radial geometry
  const radius = 62;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const formatTokens = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toLocaleString();
  };

  const segments = [
    { label: "System", count: systemTokens, color: "bg-indigo-500", border: "border-indigo-500/40" },
    { label: "Prompt", count: promptTokens, color: "bg-sky-500", border: "border-sky-500/40" },
    { label: "Completion", count: completionTokens, color: "bg-emerald-500", border: "border-emerald-500/40" },
  ];

  return (
    <div
      className={cn(
        "relative w-full max-w-md overflow-hidden rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md p-5 shadow-sm text-foreground",
        className
      )}
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-border/60 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-muted/50 text-muted-foreground">
            <Database className="h-3.5 w-3.5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-foreground tracking-tight">
              Context Window
            </div>
            <div className="text-[10px] text-muted-foreground font-mono">
              {modelName}
            </div>
          </div>
        </div>

        {/* Status Pill */}
        <div
          className={cn(
            "flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium border font-mono",
            isCritical
              ? "border-rose-500/40 bg-rose-500/10 text-rose-500"
              : isWarning
              ? "border-amber-500/40 bg-amber-500/10 text-amber-500"
              : "border-emerald-500/40 bg-emerald-500/10 text-emerald-500"
          )}
        >
          {isCritical ? (
            <AlertTriangle className="h-3 w-3" />
          ) : isWarning ? (
            <Info className="h-3 w-3" />
          ) : (
            <CheckCircle className="h-3 w-3" />
          )}
          <span>{isCritical ? "Near Limit" : isWarning ? "High Load" : "Optimal"}</span>
        </div>
      </div>

      {variant === "radial" ? (
        /* Radial Arc View */
        <div className="flex flex-col items-center justify-center py-2">
          <div className="relative flex items-center justify-center">
            <svg
              className="w-40 h-40 transform -rotate-90"
              viewBox="0 0 150 150"
            >
              {/* Background Track */}
              <circle
                cx="75"
                cy="75"
                r={radius}
                className="stroke-muted/30"
                strokeWidth="10"
                fill="none"
              />
              {/* Animated Progress Arc */}
              <motion.circle
                cx="75"
                cy="75"
                r={radius}
                stroke={strokeColor}
                strokeWidth="10"
                strokeLinecap="round"
                fill="none"
                initial={reduceMotion ? false : { strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 120, damping: 20 }
                }
                style={{ strokeDasharray: circumference }}
              />
            </svg>

            {/* Inner Center Metrics */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-bold tracking-tight text-foreground font-mono">
                {percentage.toFixed(0)}%
              </span>
              <span className="text-[11px] text-muted-foreground font-mono">
                {formatTokens(usedTokens)} / {formatTokens(maxTokens)}
              </span>
            </div>
          </div>

          <div className="mt-2 text-center text-xs text-muted-foreground">
            <span className="font-mono font-medium text-foreground">
              {formatTokens(remainingTokens)}
            </span>{" "}
            tokens remaining headroom
          </div>
        </div>
      ) : (
        /* Linear Bar View */
        <div className="space-y-3 py-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-muted-foreground">
              {formatTokens(usedTokens)} tokens used
            </span>
            <span className="font-semibold text-foreground">
              {percentage.toFixed(1)}% ({formatTokens(maxTokens)} max)
            </span>
          </div>

          {/* Segmented Progress Track */}
          <div className="relative h-3 w-full overflow-hidden rounded-full bg-muted/40 border border-border flex">
            {segments.map((seg, i) => {
              const segPct = (seg.count / maxTokens) * 100;
              return (
                <div
                  key={i}
                  style={{ width: `${segPct}%` }}
                  onMouseEnter={() => setHoveredSegment(seg.label)}
                  onMouseLeave={() => setHoveredSegment(null)}
                  className={cn(
                    "h-full transition-opacity cursor-pointer",
                    seg.color,
                    hoveredSegment && hoveredSegment !== seg.label && "opacity-40"
                  )}
                  title={`${seg.label}: ${formatTokens(seg.count)} tokens`}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Breakdown Pills */}
      {showBreakdown && (
        <div className="mt-4 pt-3 border-t border-border/50 grid grid-cols-3 gap-2 text-center">
          {segments.map((seg, i) => (
            <div
              key={i}
              className={cn(
                "p-2 rounded-xl border bg-muted/30 transition-all",
                hoveredSegment === seg.label ? "border-foreground shadow-xs" : "border-border/60"
              )}
            >
              <div className="flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground font-medium">
                <span className={cn("h-1.5 w-1.5 rounded-full", seg.color)} />
                <span>{seg.label}</span>
              </div>
              <div className="mt-0.5 text-xs font-mono font-semibold text-foreground">
                {formatTokens(seg.count)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

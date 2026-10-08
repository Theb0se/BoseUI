"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Sparkles, Layers, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FeatureCardProps {
  /** Eyebrow label above the headline */
  eyebrow?: string;
  /** Main card headline */
  title?: string;
  /** Short descriptive copy */
  description?: string;
  /** Optional CTA label */
  ctaLabel?: string;
  /** Optional link or click handler */
  onAction?: () => void;
  /** Custom media element rendered inside the media stage */
  media?: React.ReactNode;
  /** Card layout orientation. Default: "vertical" */
  layout?: "vertical" | "horizontal";
  className?: string;
}

export function FeatureCard({
  eyebrow = "Apple Silicon Architecture",
  title = "Engineered for fluid 120Hz motion.",
  description = "Every interaction responds with spring physics, hardware-accelerated transforms, and zero layout shift across light and dark appearances.",
  ctaLabel = "Explore Architecture",
  onAction,
  media,
  layout = "vertical",
  className,
}: FeatureCardProps) {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const [hovered, setHovered] = useState(false);

  return (
    <motion.article
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      animate={{
        y: hovered && !shouldReduceMotion ? -6 : 0,
      }}
      transition={{ type: "spring", stiffness: 360, damping: 28 }}
      className={cn(
        "group relative flex w-full max-w-md overflow-hidden rounded-[28px] border border-neutral-200/90 bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-xl dark:border-neutral-800/90 dark:bg-[#0A0A0A] dark:hover:border-neutral-700",
        layout === "horizontal"
          ? "max-w-2xl flex-col gap-6 sm:flex-row sm:items-center"
          : "flex-col justify-between gap-6",
        className
      )}
    >
      {/* Text Copy Block */}
      <div className={cn("flex flex-col", layout === "horizontal" && "sm:w-1/2")}>
        {eyebrow && (
          <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            <Sparkles className="h-3 w-3" />
            {eyebrow}
          </span>
        )}

        <h3 className="mt-2 text-xl font-bold tracking-tight text-neutral-950 dark:text-white sm:text-2xl">
          {title}
        </h3>

        <p className="mt-2 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400 sm:text-sm">
          {description}
        </p>

        {ctaLabel && (
          <div className="mt-4">
            <button
              type="button"
              onClick={onAction}
              className="inline-flex items-center gap-1.5 rounded-full bg-neutral-900 px-4 py-2 text-xs font-semibold text-white transition-transform active:scale-95 dark:bg-white dark:text-black"
            >
              <span>{ctaLabel}</span>
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </button>
          </div>
        )}
      </div>

      {/* Media Area */}
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl border border-neutral-200/80 bg-neutral-50 p-5 dark:border-neutral-800/80 dark:bg-[#111111]",
          layout === "horizontal" ? "sm:w-1/2" : "w-full"
        )}
      >
        {media ?? (
          <div className="flex flex-col gap-3">
            {/* Simulated Hardware Telemetry Media Stage */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-black">
                  <Cpu className="h-3.5 w-3.5" />
                </span>
                <div>
                  <div className="text-xs font-semibold text-neutral-950 dark:text-white">
                    Spring Compositor
                  </div>
                  <div className="font-mono text-[10px] text-neutral-500">
                    120 FPS · GPU Layer
                  </div>
                </div>
              </div>
              <span className="rounded-full border border-neutral-200 bg-white px-2.5 py-0.5 font-mono text-[10px] font-medium text-neutral-700 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300">
                Active
              </span>
            </div>

            {/* Animated Bars inside Media Area */}
            <div className="mt-1 space-y-2 rounded-xl border border-neutral-200/70 bg-white p-3 dark:border-neutral-800 dark:bg-[#0A0A0A]">
              {[
                { label: "Frame Budget", pct: hovered ? "94%" : "78%", val: "8.3ms" },
                { label: "Spring Velocity", pct: hovered ? "86%" : "62%", val: "420 N/m" },
              ].map((metric) => (
                <div key={metric.label} className="space-y-1">
                  <div className="flex justify-between font-mono text-[10px]">
                    <span className="text-neutral-500">{metric.label}</span>
                    <span className="font-semibold text-neutral-900 dark:text-white">
                      {metric.val}
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-900">
                    <motion.div
                      animate={{ width: metric.pct }}
                      transition={{ type: "spring", stiffness: 260, damping: 26 }}
                      className="h-full rounded-full bg-neutral-900 dark:bg-white"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.article>
  );
}

export default FeatureCard;

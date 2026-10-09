"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  Cpu,
  Layers,
  Gauge,
  Zap,
  Activity,
  ArrowUpRight,
  ShieldCheck,
  MousePointer2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ExpandableBentoCard } from "@/components/ui/ExpandableBentoCard";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { ParallaxTiltCard } from "@/components/ui/ParallaxTiltCard";
import { FeatureCard } from "@/components/ui/FeatureCard";

export interface FeatureBentoBlockProps {
  /** Eyebrow badge over section heading */
  eyebrow?: string;
  /** Section headline */
  title?: string;
  /** Supporting section description */
  description?: string;
  className?: string;
}

export function FeatureBentoBlock({
  eyebrow = "Modular Architecture",
  title = "Next-Generation Interface Bento",
  description = "A responsive asymmetric showcase combining expandable telemetry, radial spotlight proximity, 3D spatial parallax, and editorial feature storytelling.",
  className,
}: FeatureBentoBlockProps) {
  const [activeMetricFilter, setActiveMetricFilter] = useState<"all" | "speed" | "safety">("all");

  return (
    <div
      data-fullscreen-scroll
      className={cn(
        "relative w-full min-h-[540px] overflow-hidden rounded-2xl border border-neutral-200/80 bg-neutral-950 p-6 sm:p-10 lg:p-12 text-neutral-100 shadow-2xl dark:border-neutral-800",
        className
      )}
    >
      {/* Background Radial Glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 right-10 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />
        <div className="absolute bottom-10 left-10 h-96 w-96 rounded-full bg-purple-600/10 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      {/* Section Header */}
      <div className="relative z-10 mx-auto max-w-3xl text-center mb-10 sm:mb-14">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-neutral-800 bg-neutral-900/90 px-3 py-1 text-xs font-medium text-neutral-300 backdrop-blur-md mb-4">
          <Sparkles className="h-3.5 w-3.5 text-blue-400" />
          <span>{eyebrow}</span>
        </div>

        <h2 className="text-2xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
          {title}
        </h2>

        <p className="mt-3.5 text-sm text-neutral-400 sm:text-base leading-relaxed">
          {description}
        </p>

        {/* Quick Interactive Filter Badges */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setActiveMetricFilter("all")}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium transition-colors",
              activeMetricFilter === "all"
                ? "bg-neutral-100 text-neutral-950 font-semibold"
                : "bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800"
            )}
          >
            All Modules
          </button>
          <button
            type="button"
            onClick={() => setActiveMetricFilter("speed")}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium transition-colors",
              activeMetricFilter === "speed"
                ? "bg-blue-600 text-white font-semibold"
                : "bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800"
            )}
          >
            120fps Motion
          </button>
          <button
            type="button"
            onClick={() => setActiveMetricFilter("safety")}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium transition-colors",
              activeMetricFilter === "safety"
                ? "bg-emerald-600 text-white font-semibold"
                : "bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800"
            )}
          >
            Type-Safe Contracts
          </button>
        </div>
      </div>

      {/* Bento Grid Composition */}
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
          
          {/* Tile 1: Expandable Bento Card (Span 7 on LG) */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="rounded-3xl border border-neutral-800/80 bg-neutral-900/40 p-1 sm:p-2 backdrop-blur-md h-full flex flex-col justify-center">
              <div className="mb-2 px-3 pt-2 flex items-center justify-between text-xs text-neutral-500 font-mono">
                <span className="flex items-center gap-1.5 text-neutral-400">
                  <Gauge className="h-3.5 w-3.5 text-amber-400" />
                  INTERACTIVE_STATE_CARD
                </span>
                <span>HOOKES_LAW_SOLVER</span>
              </div>
              <ExpandableBentoCard
                badge="RUNTIME_TELEMETRY"
                title="GPU Compositor & Spring Engine"
                summary="Click to inspect real-time frame budgets, velocity handoff, and spring relaxation graphs."
                defaultExpanded={true}
                className="max-w-none w-full border-neutral-800 bg-neutral-950/90 text-neutral-100 shadow-xl"
              />
            </div>
          </div>

          {/* Tile 2: Spotlight Card (Span 5 on LG) */}
          <div className="lg:col-span-5 flex flex-col">
            <SpotlightCard
              enableTilt={true}
              spotlightColor="rgba(59, 130, 246, 0.22)"
              borderColor="rgba(99, 102, 241, 0.6)"
              className="h-full rounded-3xl border border-neutral-800 bg-neutral-900/60 p-6 backdrop-blur-md flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-blue-400">
                    <MousePointer2 className="h-3 w-3" />
                    HOVER_PROXIMITY
                  </span>
                  <Activity className="h-4 w-4 text-neutral-500" />
                </div>

                <h3 className="mt-4 text-xl font-semibold tracking-tight text-white">
                  Dynamic Cursor Spotlight
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-neutral-400 leading-relaxed">
                  Calculates radial photon gradients dynamically from pointer coordinates with
                  zero re-render lag via motion value spring templates.
                </p>
              </div>

              {/* Spotlight Live Metric Pill */}
              <div className="mt-6 rounded-2xl border border-neutral-800/80 bg-neutral-950/70 p-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-400">Render Pipeline</span>
                  <span className="font-mono text-emerald-400 font-medium">GPU Surface</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs">
                  <span className="text-neutral-400">Pointer Responsiveness</span>
                  <span className="font-mono text-blue-400 font-medium">1000 Hz Polling</span>
                </div>
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-neutral-800">
                  <div className="h-full w-4/5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500" />
                </div>
              </div>
            </SpotlightCard>
          </div>

          {/* Tile 3: Parallax Tilt Card (Span 5 on LG) */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="rounded-3xl border border-neutral-800/80 bg-neutral-900/40 p-1 sm:p-2 backdrop-blur-md h-full flex flex-col justify-center">
              <div className="mb-2 px-3 pt-2 flex items-center justify-between text-xs text-neutral-500 font-mono">
                <span className="flex items-center gap-1.5 text-neutral-400">
                  <Layers className="h-3.5 w-3.5 text-indigo-400" />
                  3D_SPATIAL_GYROSCOPE
                </span>
                <span>Z_INDEX_LAYERS</span>
              </div>
              <ParallaxTiltCard
                title="Spatial Depth Gyroscope"
                subtitle="Pointer translation splits into three independent 3D planes with graduated spring ratios."
                maxTilt={16}
                className="max-w-none w-full border-neutral-800 bg-neutral-950/90 text-neutral-100 shadow-xl"
              />
            </div>
          </div>

          {/* Tile 4: FeatureCard Horizontal / Editorial (Span 7 on LG) */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="rounded-3xl border border-neutral-800/80 bg-neutral-900/40 p-1 sm:p-2 backdrop-blur-md h-full flex flex-col justify-center">
              <div className="mb-2 px-3 pt-2 flex items-center justify-between text-xs text-neutral-500 font-mono">
                <span className="flex items-center gap-1.5 text-neutral-400">
                  <Cpu className="h-3.5 w-3.5 text-emerald-400" />
                  EDITORIAL_SPOTLIGHT
                </span>
                <span>PRODUCTION_READY</span>
              </div>
              <FeatureCard
                eyebrow="Zero-Overhead Primitive"
                title="Machined for uncompromising production velocity."
                description="Engineered without bulky runtime wrappers. Copy the pure TypeScript component into your repository and retain full ownership of styles and animation constants."
                ctaLabel="Inspect Source"
                layout="horizontal"
                media={
                  <div className="flex h-full w-full items-center justify-center rounded-2xl bg-neutral-900/80 border border-neutral-800 p-6">
                    <div className="flex flex-col items-center text-center gap-2">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        <Zap className="h-6 w-6" />
                      </div>
                      <span className="font-mono text-xs font-semibold text-white">0kb External CSS</span>
                      <span className="text-[11px] text-neutral-500">Pure Tailwind + Motion</span>
                    </div>
                  </div>
                }
                className="max-w-none w-full border-neutral-800 bg-neutral-950/90 text-neutral-100 shadow-xl"
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

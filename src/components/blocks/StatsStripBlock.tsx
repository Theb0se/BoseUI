"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  ShieldCheck,
  Zap,
  Globe2,
  ArrowUpRight,
  Sparkles,
  Activity,
  RotateCcw,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { RollingNumberTicker } from "@/components/ui/RollingNumberTicker";
import { KineticRollingCounter } from "@/components/ui/KineticRollingCounter";

export interface StatsStripBlockProps {
  /** Section eyebrow label */
  eyebrow?: string;
  /** Section headline */
  title?: string;
  /** Section descriptive copy */
  description?: string;
  className?: string;
}

const SAMPLE_GROWTH_DATA = [
  { time: "00:00", value: 3120 },
  { time: "04:00", value: 3450 },
  { time: "08:00", value: 4180 },
  { time: "12:00", value: 4720 },
  { time: "16:00", value: 4890 },
  { time: "20:00", value: 5240 },
  { time: "24:00", value: 5880 },
];

export function StatsStripBlock({
  eyebrow = "GLOBAL INFRASTRUCTURE TELEMETRY",
  title = "Scalability Verified at Planet Scale",
  description = "Real-time production metrics combining continuous number tickers, kinetic SLA counters, and scrubbable live throughput sparklines.",
  className,
}: StatsStripBlockProps) {
  const [tickerValue, setTickerValue] = useState(4820);
  const [activeTimeframe, setActiveTimeframe] = useState<"24h" | "7d" | "30d">("24h");
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(SAMPLE_GROWTH_DATA.length - 1);

  const activePoint = hoveredPoint !== null ? SAMPLE_GROWTH_DATA[hoveredPoint] : SAMPLE_GROWTH_DATA[SAMPLE_GROWTH_DATA.length - 1];

  return (
    <div
      data-fullscreen-scroll
      className={cn(
        "relative w-full min-h-[540px] overflow-hidden rounded-2xl border border-neutral-200/80 bg-neutral-950 p-6 sm:p-10 lg:p-12 text-neutral-100 shadow-2xl dark:border-neutral-800",
        className
      )}
    >
      {/* Background Ambient Glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 left-1/3 h-80 w-80 rounded-full bg-emerald-600/10 blur-3xl" />
        <div className="absolute top-1/2 -right-20 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />
        <div className="absolute -bottom-20 left-10 h-72 w-72 rounded-full bg-purple-600/10 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      {/* Section Header */}
      <div className="relative z-10 mx-auto max-w-3xl text-center mb-10 sm:mb-14">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-neutral-800 bg-neutral-900/90 px-3 py-1 text-xs font-mono text-neutral-300 backdrop-blur-md mb-4">
          <Activity className="h-3.5 w-3.5 text-emerald-400" />
          <span>{eyebrow}</span>
        </div>

        <h2 className="text-2xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
          {title}
        </h2>

        <p className="mt-3.5 text-sm text-neutral-400 sm:text-base leading-relaxed">
          {description}
        </p>

        {/* Global SLA Status Capsule */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-neutral-400">
          <div className="flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900/70 px-3 py-1">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>ALL_REGIONS_HEALTHY</span>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900/70 px-3 py-1">
            <Globe2 className="h-3.5 w-3.5 text-blue-400" />
            <span>48 EDGE POPs ACTIVE</span>
          </div>
        </div>
      </div>

      {/* 3 High-Impact Metric Cards Grid */}
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          
          {/* Card 1: Rolling Number Ticker ($4.8B+ Volume) */}
          <div className="flex flex-col justify-between rounded-3xl border border-neutral-800 bg-neutral-900/80 p-6 sm:p-7 backdrop-blur-xl shadow-xl transition-all duration-300 hover:border-neutral-700">
            <div>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-blue-400">
                  <TrendingUp className="h-3.5 w-3.5" />
                  ANNUALIZED_VOLUME
                </span>
                <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                  <ArrowUpRight className="h-3 w-3" />
                  +42.8% QoQ
                </span>
              </div>

              <h3 className="mt-3 text-lg font-semibold text-white">
                Cumulative Payment Volume
              </h3>
              <p className="mt-1 text-xs text-neutral-400">
                Processed across credit cards, instant ACH, and SEPA corridors.
              </p>

              {/* Dynamic Ticker Display */}
              <div className="mt-6 flex items-baseline gap-2">
                <RollingNumberTicker
                  value={tickerValue}
                  currency="$"
                  decimalPlaces={0}
                  fontSize="lg"
                  className="font-bold text-white tracking-tight"
                />
                <span className="font-mono text-xl font-bold text-neutral-400">M+</span>
              </div>
            </div>

            {/* Interactive Ticker Steppers */}
            <div className="mt-6 border-t border-neutral-800/80 pt-4 flex items-center justify-between">
              <span className="text-[11px] text-neutral-500 font-mono">SIMULATE_TRANSACTION</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setTickerValue((v) => v + 120)}
                  className="flex items-center gap-1 rounded-lg border border-neutral-700 bg-neutral-800 px-2.5 py-1 text-xs font-medium text-white hover:bg-neutral-700 transition-colors"
                >
                  <Plus className="h-3 w-3" />
                  +$120M
                </button>
                <button
                  type="button"
                  onClick={() => setTickerValue(4820)}
                  className="rounded-lg border border-neutral-800 bg-neutral-900 p-1 text-neutral-400 hover:text-white"
                  title="Reset counter"
                >
                  <RotateCcw className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Card 2: Kinetic Rolling Counter (99.99% SLA Uptime) */}
          <div className="flex flex-col justify-between rounded-3xl border border-neutral-800 bg-neutral-900/80 p-6 sm:p-7 backdrop-blur-xl shadow-xl transition-all duration-300 hover:border-neutral-700">
            <div>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-emerald-400">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  ENTERPRISE_SLA
                </span>
                <span className="font-mono text-[11px] text-neutral-400">
                  742 DAYS CONSECUTIVE
                </span>
              </div>

              <h3 className="mt-3 text-lg font-semibold text-white">
                Guaranteed Uptime Availability
              </h3>
              <p className="mt-1 text-xs text-neutral-400">
                Redundant multi-cloud failover backed by contractual financial SLA credits.
              </p>

              {/* Kinetic Rolling Counter Reel */}
              <div className="mt-6 flex items-center gap-2">
                <div className="flex items-baseline">
                  <KineticRollingCounter
                    defaultValue={9999}
                    step={1}
                    className="text-white"
                  />
                  <span className="font-mono text-xl font-bold text-emerald-400 ml-1">%</span>
                </div>
              </div>
            </div>

            {/* SLA Telemetry Breakdown */}
            <div className="mt-6 border-t border-neutral-800/80 pt-4 flex items-center justify-between text-xs">
              <div className="flex flex-col">
                <span className="text-[11px] text-neutral-500">Median P99 Latency</span>
                <span className="font-mono font-semibold text-white">&lt; 1.18 ms</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[11px] text-neutral-500">Incident Recovery</span>
                <span className="font-mono font-semibold text-emerald-400">Automated DNS</span>
              </div>
            </div>
          </div>

          {/* Card 3: Interactive Throughput Sparkline */}
          <div className="flex flex-col justify-between rounded-3xl border border-neutral-800 bg-neutral-900/80 p-6 sm:p-7 backdrop-blur-xl shadow-xl transition-all duration-300 hover:border-neutral-700 md:col-span-2 lg:col-span-1">
            <div>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-purple-400">
                  <Zap className="h-3.5 w-3.5" />
                  REALTIME_THROUGHPUT
                </span>
                <span className="font-mono text-[11px] text-purple-400 font-semibold">
                  {activePoint.value.toLocaleString()} REQ/S
                </span>
              </div>

              <h3 className="mt-3 text-lg font-semibold text-white">
                Network Requests Throughput
              </h3>
              <p className="mt-1 text-xs text-neutral-400">
                Hover across the sparkline to view granular timestamp telemetry.
              </p>

              {/* Mini Sparkline Visualization */}
              <div className="mt-4 rounded-2xl border border-neutral-800/80 bg-neutral-950/70 p-3">
                <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500 mb-2">
                  <span>Peak Edge Traffic</span>
                  <span className="text-white">{activePoint.time} UTC</span>
                </div>
                <div className="relative h-24 w-full flex items-end">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 300 100" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#a855f7" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#a855f7" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    {/* Fill */}
                    <path
                      d="M 0 85 L 50 75 L 100 55 L 150 40 L 200 35 L 250 22 L 300 8 L 300 100 L 0 100 Z"
                      fill="url(#purpleGrad)"
                    />
                    {/* Line */}
                    <path
                      d="M 0 85 L 50 75 L 100 55 L 150 40 L 200 35 L 250 22 L 300 8"
                      fill="none"
                      stroke="#c084fc"
                      strokeWidth="2.5"
                    />
                  </svg>
                  {/* Hover Hitboxes */}
                  <div className="absolute inset-0 flex justify-between">
                    {SAMPLE_GROWTH_DATA.map((pt, i) => (
                      <button
                        key={pt.time}
                        type="button"
                        onMouseEnter={() => setHoveredPoint(i)}
                        className="flex-1 h-full cursor-pointer group focus:outline-none flex flex-col justify-end items-center"
                      >
                        <div
                          className={cn(
                            "w-1.5 h-1.5 rounded-full transition-transform",
                            hoveredPoint === i ? "bg-purple-300 scale-150" : "bg-transparent group-hover:bg-purple-500/50"
                          )}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Timeframe Filter Badges */}
            <div className="mt-4 border-t border-neutral-800/80 pt-4 flex items-center justify-between">
              <span className="text-[11px] text-neutral-500 font-mono">TIMEFRAME</span>
              <div className="flex items-center gap-1">
                {(["24h", "7d", "30d"] as const).map((tf) => (
                  <button
                    key={tf}
                    type="button"
                    onClick={() => setActiveTimeframe(tf)}
                    className={cn(
                      "px-2 py-0.5 rounded text-[11px] font-mono transition-colors",
                      activeTimeframe === tf
                        ? "bg-purple-600 text-white font-semibold"
                        : "text-neutral-400 hover:text-white hover:bg-neutral-800"
                    )}
                  >
                    {tf.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default StatsStripBlock;

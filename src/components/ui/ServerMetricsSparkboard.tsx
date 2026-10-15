"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  Cpu,
  HardDrive,
  Network,
  Server,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface MetricStream {
  label: string;
  unit: string;
  currentValue: number;
  data: number[];
  color: string;
}

export interface ServerMetricsSparkboardProps {
  /** Server node identifier */
  hostName?: string;
  /** Cloud provider / region */
  region?: string;
  className?: string;
}

const DEFAULT_METRICS: MetricStream[] = [
  {
    label: "CPU Utilization",
    unit: "%",
    currentValue: 34.2,
    data: [22, 28, 35, 42, 38, 48, 52, 45, 38, 31, 34, 39, 41, 36, 34],
    color: "#0284c7", // Sky 600
  },
  {
    label: "Memory (RAM)",
    unit: "%",
    currentValue: 61.8,
    data: [58, 59, 60, 60, 62, 63, 62, 61, 62, 64, 63, 62, 61, 62, 61],
    color: "#9333ea", // Purple 600
  },
  {
    label: "Disk I/O Write",
    unit: "MB/s",
    currentValue: 18.4,
    data: [5, 12, 8, 24, 45, 32, 18, 14, 22, 30, 16, 20, 24, 19, 18],
    color: "#d97706", // Amber 600
  },
  {
    label: "Network Egress",
    unit: "GB/s",
    currentValue: 2.4,
    data: [1.1, 1.4, 1.8, 2.2, 3.1, 2.9, 2.4, 2.1, 2.3, 2.8, 2.6, 2.5, 2.4, 2.3, 2.4],
    color: "#059669", // Emerald 600
  },
];

export function ServerMetricsSparkboard({
  hostName = "edge-compute-node-42.iad1",
  region = "AWS us-east-1 (N. Virginia)",
  className,
}: ServerMetricsSparkboardProps) {
  const [timeRange, setTimeRange] = useState<"1h" | "6h" | "24h" | "7d">("1h");
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const pointsCount = DEFAULT_METRICS[0].data.length;

  return (
    <div
      className={cn(
        "w-full rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6 shadow-sm text-neutral-900 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100 flex flex-col gap-5",
        className
      )}
    >
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 dark:border-neutral-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-neutral-900 dark:text-white">
            <Server className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold tracking-tight text-neutral-900 dark:text-white">{hostName}</h3>
              <span className="flex items-center gap-1 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                HEALTHY
              </span>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">{region}</p>
          </div>
        </div>

        {/* Time range switcher */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
          {(["1h", "6h", "24h", "7d"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setTimeRange(r)}
              className={cn(
                "px-2.5 py-1 text-xs font-medium rounded-lg uppercase transition-all",
                timeRange === r
                  ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-xs font-semibold"
                  : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
              )}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Synchronized 4-Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {DEFAULT_METRICS.map((metric) => {
          const maxVal = Math.max(...metric.data) * 1.15;
          const displayVal =
            hoverIndex !== null ? metric.data[hoverIndex] : metric.currentValue;

          // SVG polyline coordinates
          const width = 200;
          const height = 45;
          const points = metric.data
            .map((val, idx) => {
              const x = (idx / (pointsCount - 1)) * width;
              const y = height - (val / maxVal) * height;
              return `${x},${y}`;
            })
            .join(" ");

          return (
            <div
              key={metric.label}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const ratio = Math.max(0, Math.min(1, x / rect.width));
                setHoverIndex(Math.round(ratio * (pointsCount - 1)));
              }}
              onMouseLeave={() => setHoverIndex(null)}
              className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all flex flex-col justify-between gap-3 cursor-crosshair group shadow-2xs"
            >
              <div>
                <span className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  {metric.label}
                </span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-xl font-bold font-mono text-neutral-900 dark:text-white">
                    {typeof displayVal === "number" ? displayVal.toFixed(1) : displayVal}
                  </span>
                  <span className="text-xs text-neutral-500 dark:text-neutral-400 font-mono">{metric.unit}</span>
                </div>
              </div>

              {/* Sparkline Canvas / SVG */}
              <div className="relative w-full h-12 pt-1">
                <svg
                  viewBox={`0 0 ${width} ${height}`}
                  className="w-full h-full overflow-visible"
                  preserveAspectRatio="none"
                >
                  {/* Baseline fill */}
                  <polygon
                    points={`0,${height} ${points} ${width},${height}`}
                    fill={metric.color}
                    fillOpacity={0.12}
                  />
                  {/* Line */}
                  <polyline
                    points={points}
                    fill="none"
                    stroke={metric.color}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Synchronized Hover Point Indicator */}
                  {hoverIndex !== null && (
                    <circle
                      cx={(hoverIndex / (pointsCount - 1)) * width}
                      cy={height - (metric.data[hoverIndex] / maxVal) * height}
                      r="4"
                      fill={metric.color}
                      stroke="currentColor"
                      className="text-white dark:text-neutral-950"
                      strokeWidth="2"
                    />
                  )}
                </svg>
              </div>
            </div>
          );
        })}
      </div>

      {/* Scrubber Telemetry Footer */}
      <div className="flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400 font-mono pt-1 border-t border-neutral-200 dark:border-neutral-800">
        <span className="flex items-center gap-1.5">
          <Activity className="h-3 w-3 text-neutral-700 dark:text-neutral-300" />
          <span>Telemetry: 10s sampling resolution</span>
        </span>
        <span>
          {hoverIndex !== null ? `T - ${(pointsCount - 1 - hoverIndex) * 4}m ago` : "Live Real-Time"}
        </span>
      </div>
    </div>
  );
}

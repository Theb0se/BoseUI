"use client";

import React, { useState, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  BarChart2,
  LineChart,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type TimeRange = "1D" | "1W" | "1M" | "1Y" | "ALL";

export interface RangeDataConfig {
  label: TimeRange;
  resolution: string;
  price: string;
  change: string;
  isPositive: boolean;
  high: string;
  low: string;
  volume: string;
  points: number[];
}

const DEFAULT_RANGE_DATA: Record<TimeRange, RangeDataConfig> = {
  "1D": {
    label: "1D",
    resolution: "5m interval",
    price: "$68,420.50",
    change: "+2.45%",
    isPositive: true,
    high: "$68,910.00",
    low: "$66,780.00",
    volume: "$24.8B",
    points: [40, 42, 38, 55, 62, 58, 70, 75, 72, 85, 82, 90],
  },
  "1W": {
    label: "1W",
    resolution: "1h interval",
    price: "$68,420.50",
    change: "-1.18%",
    isPositive: false,
    high: "$70,120.00",
    low: "$65,240.00",
    volume: "$168.2B",
    points: [85, 80, 75, 78, 65, 60, 58, 62, 70, 68, 72, 65],
  },
  "1M": {
    label: "1M",
    resolution: "4h interval",
    price: "$68,420.50",
    change: "+14.32%",
    isPositive: true,
    high: "$69,500.00",
    low: "$58,900.00",
    volume: "$720.5B",
    points: [30, 35, 42, 40, 48, 55, 62, 59, 72, 78, 85, 92],
  },
  "1Y": {
    label: "1Y",
    resolution: "1D interval",
    price: "$68,420.50",
    change: "+108.64%",
    isPositive: true,
    high: "$73,750.00",
    low: "$28,400.00",
    volume: "$8.4T",
    points: [20, 25, 30, 45, 52, 60, 58, 75, 82, 88, 95, 98],
  },
  ALL: {
    label: "ALL",
    resolution: "1W interval",
    price: "$68,420.50",
    change: "+4,820.10%",
    isPositive: true,
    high: "$73,750.00",
    low: "$120.00",
    volume: "$34.2T",
    points: [5, 8, 12, 18, 28, 45, 60, 50, 70, 85, 92, 100],
  },
};

export interface SegmentedRangePickerProps {
  ranges?: TimeRange[];
  defaultRange?: TimeRange;
  onRangeChange?: (range: TimeRange) => void;
  className?: string;
}

export function SegmentedRangePicker({
  ranges = ["1D", "1W", "1M", "1Y", "ALL"],
  defaultRange = "1D",
  onRangeChange,
  className,
}: SegmentedRangePickerProps) {
  const [selectedRange, setSelectedRange] = useState<TimeRange>(defaultRange);
  const [chartMode, setChartMode] = useState<"line" | "bars">("line");
  const uniquePillId = useId();

  const activeData = DEFAULT_RANGE_DATA[selectedRange] || DEFAULT_RANGE_DATA["1D"];

  const handleSelect = (r: TimeRange) => {
    setSelectedRange(r);
    onRangeChange?.(r);
  };

  // Compute SVG line points
  const svgWidth = 600;
  const svgHeight = 160;
  const padX = 16;
  const padY = 20;
  const w = svgWidth - padX * 2;
  const h = svgHeight - padY * 2;

  const minPt = Math.min(...activeData.points);
  const maxPt = Math.max(...activeData.points);

  const coords = activeData.points.map((pt, i) => {
    const x = padX + (i / (activeData.points.length - 1)) * w;
    const y = padY + h - ((pt - minPt) / (maxPt - minPt || 1)) * h;
    return { x, y };
  });

  const linePath = coords.reduce((acc, curr, i) => {
    return i === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
  }, "");

  const areaPath =
    coords.length > 0
      ? `${linePath} L ${coords[coords.length - 1].x} ${svgHeight} L ${coords[0].x} ${svgHeight} Z`
      : "";

  return (
    <div
      data-fullscreen-scroll
      className={cn(
        "relative w-full min-h-[520px] overflow-hidden rounded-2xl border border-neutral-200/80 bg-neutral-950 p-6 text-neutral-100 shadow-xl dark:border-neutral-800 flex flex-col justify-between",
        className
      )}
    >
      {/* Background ambient lighting */}
      <div
        className={cn(
          "pointer-events-none absolute -top-32 right-1/4 h-80 w-80 rounded-full blur-[110px] transition-colors duration-700 opacity-20",
          activeData.isPositive ? "bg-emerald-500" : "bg-rose-500"
        )}
      />

      {/* Header Bar */}
      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-base text-white">BTC/USD Market Overview</span>
            <div
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold",
                activeData.isPositive
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
              )}
            >
              {activeData.isPositive ? (
                <ArrowUpRight className="h-3 w-3" />
              ) : (
                <ArrowDownRight className="h-3 w-3" />
              )}
              <span>{activeData.change}</span>
            </div>
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-mono text-3xl font-extrabold text-white">
              {activeData.price}
            </span>
            <span className="text-xs text-neutral-400 flex items-center gap-1">
              <Clock className="h-3 w-3" /> {activeData.resolution}
            </span>
          </div>
        </div>

        {/* Sliding Segmented Range Picker Pills */}
        <div className="flex items-center rounded-xl border border-neutral-800 bg-neutral-900/90 p-1 backdrop-blur-md">
          {ranges.map((r) => {
            const isSelected = selectedRange === r;
            return (
              <button
                key={r}
                type="button"
                onClick={() => handleSelect(r)}
                className={cn(
                  "relative rounded-lg px-3.5 py-1.5 text-xs font-semibold font-mono transition-colors duration-200",
                  isSelected
                    ? "text-white"
                    : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/40"
                )}
              >
                {isSelected && (
                  <motion.div
                    layoutId={`segmented-pill-${uniquePillId}`}
                    className="absolute inset-0 rounded-lg bg-neutral-800 shadow-sm border border-neutral-700/60"
                    transition={{ type: "spring", stiffness: 420, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{r}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Animated Chart Transition Canvas */}
      <div className="relative my-8 select-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedRange + chartMode}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="w-full"
          >
            {chartMode === "line" ? (
              <svg
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                className="w-full h-44 overflow-visible"
              >
                <defs>
                  <linearGradient
                    id={`range-grad-${uniquePillId}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor={activeData.isPositive ? "#10b981" : "#f43f5e"}
                      stopOpacity="0.3"
                    />
                    <stop
                      offset="100%"
                      stopColor={activeData.isPositive ? "#10b981" : "#f43f5e"}
                      stopOpacity="0"
                    />
                  </linearGradient>
                </defs>

                {/* Subtle horizontal grid lines */}
                <line
                  x1={padX}
                  y1={padY + h * 0.3}
                  x2={svgWidth - padX}
                  y2={padY + h * 0.3}
                  stroke="#262626"
                  strokeDasharray="4 4"
                />
                <line
                  x1={padX}
                  y1={padY + h * 0.7}
                  x2={svgWidth - padX}
                  y2={padY + h * 0.7}
                  stroke="#262626"
                  strokeDasharray="4 4"
                />

                {/* Area Gradient */}
                {areaPath && (
                  <path
                    d={areaPath}
                    fill={`url(#range-grad-${uniquePillId})`}
                  />
                )}

                {/* Main Stroke */}
                {linePath && (
                  <path
                    d={linePath}
                    fill="none"
                    stroke={activeData.isPositive ? "#10b981" : "#f43f5e"}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}

                {/* Data Points */}
                {coords.map((c, i) => (
                  <circle
                    key={i}
                    cx={c.x}
                    cy={c.y}
                    r="3.5"
                    fill="#0a0a0a"
                    stroke={activeData.isPositive ? "#10b981" : "#f43f5e"}
                    strokeWidth="2"
                  />
                ))}
              </svg>
            ) : (
              /* Bar Histogram View */
              <div className="flex h-44 items-end justify-between gap-2 px-4 pb-2">
                {activeData.points.map((pt, i) => {
                  const normalized = ((pt - minPt) / (maxPt - minPt || 1)) * 100;
                  return (
                    <div
                      key={i}
                      className="flex-1 flex flex-col items-center gap-1"
                    >
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${Math.max(12, normalized)}%` }}
                        transition={{ duration: 0.3, delay: i * 0.02 }}
                        className={cn(
                          "w-full rounded-t-sm transition-colors",
                          activeData.isPositive
                            ? "bg-emerald-500/80 hover:bg-emerald-400"
                            : "bg-rose-500/80 hover:bg-rose-400"
                        )}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Financial Stat Cards */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-3">
            <span className="text-[10px] uppercase font-mono text-neutral-500 block">
              Range High
            </span>
            <span className="font-mono text-sm font-semibold text-neutral-200">
              {activeData.high}
            </span>
          </div>
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-3">
            <span className="text-[10px] uppercase font-mono text-neutral-500 block">
              Range Low
            </span>
            <span className="font-mono text-sm font-semibold text-neutral-200">
              {activeData.low}
            </span>
          </div>
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-3">
            <span className="text-[10px] uppercase font-mono text-neutral-500 block">
              Volume ({selectedRange})
            </span>
            <span className="font-mono text-sm font-semibold text-neutral-200">
              {activeData.volume}
            </span>
          </div>
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-3">
            <span className="text-[10px] uppercase font-mono text-neutral-500 block">
              Time Interval
            </span>
            <span className="font-mono text-sm font-semibold text-neutral-200">
              {activeData.resolution}
            </span>
          </div>
        </div>
      </div>

      {/* Footer Controls Bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-t border-neutral-800/80 pt-4 text-xs text-neutral-400">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setChartMode("line")}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors",
              chartMode === "line"
                ? "bg-neutral-800 text-white font-semibold"
                : "text-neutral-400 hover:text-neutral-200"
            )}
          >
            <LineChart className="h-3.5 w-3.5" />
            <span>Line Curve</span>
          </button>
          <button
            type="button"
            onClick={() => setChartMode("bars")}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors",
              chartMode === "bars"
                ? "bg-neutral-800 text-white font-semibold"
                : "text-neutral-400 hover:text-neutral-200"
            )}
          >
            <BarChart2 className="h-3.5 w-3.5" />
            <span>Volume Bars</span>
          </button>
        </div>

        <div className="flex items-center gap-2 font-mono text-[11px] text-neutral-500">
          <Layers className="h-3.5 w-3.5" />
          <span>Active Window: {selectedRange}</span>
        </div>
      </div>
    </div>
  );
}

export default SegmentedRangePicker;

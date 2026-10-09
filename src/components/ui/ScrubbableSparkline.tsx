"use client";

import React, { useState, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Maximize2,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface SparklinePoint {
  time: string;
  value: number;
}

export interface ScrubbableSparklineProps {
  data?: SparklinePoint[];
  title?: string;
  ticker?: string;
  currency?: string;
  height?: number;
  showGradient?: boolean;
  showGrid?: boolean;
  minimal?: boolean;
  className?: string;
}

const PRESET_DATASETS: Record<string, { ticker: string; name: string; currency: string; points: SparklinePoint[] }> = {
  BTC: {
    ticker: "BTC/USD",
    name: "Bitcoin",
    currency: "$",
    points: [
      { time: "09:30", value: 64250 },
      { time: "10:30", value: 64580 },
      { time: "11:30", value: 64320 },
      { time: "12:30", value: 65120 },
      { time: "13:30", value: 64980 },
      { time: "14:30", value: 65890 },
      { time: "15:30", value: 66420 },
      { time: "16:30", value: 66150 },
      { time: "17:30", value: 67200 },
      { time: "18:30", value: 67890 },
      { time: "19:30", value: 67450 },
      { time: "20:30", value: 68340 },
    ],
  },
  ETH: {
    ticker: "ETH/USD",
    name: "Ethereum",
    currency: "$",
    points: [
      { time: "09:30", value: 3450 },
      { time: "10:30", value: 3420 },
      { time: "11:30", value: 3380 },
      { time: "12:30", value: 3395 },
      { time: "13:30", value: 3360 },
      { time: "14:30", value: 3320 },
      { time: "15:30", value: 3290 },
      { time: "16:30", value: 3310 },
      { time: "17:30", value: 3275 },
      { time: "18:30", value: 3240 },
      { time: "19:30", value: 3260 },
      { time: "20:30", value: 3215 },
    ],
  },
  NVDA: {
    ticker: "NVDA",
    name: "NVIDIA Corp.",
    currency: "$",
    points: [
      { time: "09:30", value: 118.5 },
      { time: "10:30", value: 120.2 },
      { time: "11:30", value: 119.8 },
      { time: "12:30", value: 122.4 },
      { time: "13:30", value: 123.9 },
      { time: "14:30", value: 123.1 },
      { time: "15:30", value: 125.6 },
      { time: "16:30", value: 127.2 },
      { time: "17:30", value: 126.8 },
      { time: "18:30", value: 129.4 },
      { time: "19:30", value: 130.5 },
      { time: "20:30", value: 132.8 },
    ],
  },
  SOL: {
    ticker: "SOL/USD",
    name: "Solana",
    currency: "$",
    points: [
      { time: "09:30", value: 154.2 },
      { time: "10:30", value: 151.8 },
      { time: "11:30", value: 153.4 },
      { time: "12:30", value: 156.9 },
      { time: "13:30", value: 155.1 },
      { time: "14:30", value: 158.7 },
      { time: "15:30", value: 161.2 },
      { time: "16:30", value: 159.8 },
      { time: "17:30", value: 163.5 },
      { time: "18:30", value: 165.2 },
      { time: "19:30", value: 164.1 },
      { time: "20:30", value: 168.0 },
    ],
  },
};

export function ScrubbableSparkline({
  data: initialData,
  title = "Bitcoin",
  ticker = "BTC/USD",
  currency = "$",
  height = 240,
  showGradient: initialShowGradient = true,
  showGrid: initialShowGrid = true,
  minimal = false,
  className,
}: ScrubbableSparklineProps) {
  const [selectedPresetKey, setSelectedPresetKey] = useState<string>("BTC");
  const [showGradient, setShowGradient] = useState(initialShowGradient);
  const [showGrid, setShowGrid] = useState(initialShowGrid);
  const [isLiveStreaming, setIsLiveStreaming] = useState(false);

  // Active dataset
  const activeDataset = initialData
    ? {
        ticker,
        name: title,
        currency,
        points: initialData,
      }
    : PRESET_DATASETS[selectedPresetKey] || PRESET_DATASETS.BTC;

  const points = activeDataset.points;
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Min and max for scaling
  const { minVal, maxVal, firstVal, lastVal } = useMemo(() => {
    if (!points || points.length === 0) {
      return { minVal: 0, maxVal: 100, firstVal: 0, lastVal: 0 };
    }
    const vals = points.map((p) => p.value);
    const min = Math.min(...vals);
    const max = Math.max(...vals);
    const pad = (max - min) * 0.08 || 1;
    return {
      minVal: min - pad,
      maxVal: max + pad,
      firstVal: points[0].value,
      lastVal: points[points.length - 1].value,
    };
  }, [points]);

  // Scrubbing state
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const currentPoint = activeIndex !== null ? points[activeIndex] : points[points.length - 1];
  const currentVal = currentPoint?.value ?? lastVal;
  const delta = currentVal - firstVal;
  const deltaPercent = firstVal !== 0 ? (delta / firstVal) * 100 : 0;
  const isPositive = delta >= 0;

  // Viewbox metrics
  const vbWidth = 800;
  const vbHeight = height;
  const paddingX = 20;
  const paddingTop = 20;
  const paddingBottom = 20;
  const chartWidth = vbWidth - paddingX * 2;
  const chartHeight = vbHeight - paddingTop - paddingBottom;

  // Compute SVG coordinates
  const coords = useMemo(() => {
    if (points.length === 0) return [];
    return points.map((p, i) => {
      const x = paddingX + (i / (points.length - 1)) * chartWidth;
      const normalizedY = (p.value - minVal) / (maxVal - minVal || 1);
      const y = paddingTop + chartHeight - normalizedY * chartHeight;
      return { x, y, point: p };
    });
  }, [points, minVal, maxVal, chartWidth, chartHeight, paddingX, paddingTop]);

  // Generate smooth cubic bezier SVG path
  const pathD = useMemo(() => {
    if (coords.length < 2) return "";
    let d = `M ${coords[0].x} ${coords[0].y}`;
    for (let i = 0; i < coords.length - 1; i++) {
      const p0 = coords[i === 0 ? 0 : i - 1];
      const p1 = coords[i];
      const p2 = coords[i + 1];
      const p3 = coords[i + 2] || p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return d;
  }, [coords]);

  // Area path
  const areaD = useMemo(() => {
    if (coords.length < 2) return "";
    const bottomY = vbHeight - paddingBottom;
    return `${pathD} L ${coords[coords.length - 1].x} ${bottomY} L ${coords[0].x} ${bottomY} Z`;
  }, [pathD, coords, vbHeight, paddingBottom]);

  // Pointer scrub handler
  const handlePointerMove = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      if (!svgRef.current || coords.length === 0) return;
      const rect = svgRef.current.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const relativeX = (clientX / rect.width) * vbWidth;

      // Find closest point by x coordinate
      let closestIdx = 0;
      let minDiff = Infinity;
      coords.forEach((coord, idx) => {
        const diff = Math.abs(coord.x - relativeX);
        if (diff < minDiff) {
          minDiff = diff;
          closestIdx = idx;
        }
      });
      setActiveIndex(closestIdx);
    },
    [coords, vbWidth]
  );

  const handlePointerLeave = () => {
    setActiveIndex(null);
  };

  const activeCoord = activeIndex !== null ? coords[activeIndex] : null;

  // Format currency
  const formatPrice = (val: number) => {
    return `${activeDataset.currency}${val.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  if (minimal) {
    return (
      <div className={cn("relative w-full overflow-hidden select-none", className)}>
        <div className="flex items-center justify-between pb-2 text-xs">
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-base font-bold text-white">
              {formatPrice(currentVal)}
            </span>
            <span
              className={cn(
                "text-[10px] font-mono font-semibold",
                isPositive ? "text-emerald-400" : "text-rose-400"
              )}
            >
              {isPositive ? "+" : ""}
              {deltaPercent.toFixed(1)}%
            </span>
          </div>
          <span className="font-mono text-neutral-400 text-[10px]">
            {activeIndex !== null ? currentPoint.time : "Live"}
          </span>
        </div>
        <div className="relative select-none">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${vbWidth} ${vbHeight}`}
            className="w-full cursor-crosshair overflow-visible touch-none"
            style={{ height }}
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
          >
            <defs>
              <linearGradient id="sparkline-emerald-grad-min" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
                <stop offset="70%" stopColor="#10b981" stopOpacity="0.05" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="sparkline-rose-grad-min" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.35" />
                <stop offset="70%" stopColor="#f43f5e" stopOpacity="0.05" />
                <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
              </linearGradient>
              <filter id="sparkline-glow-min" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            {showGrid && (
              <g className="stroke-neutral-800/60 stroke-[1]">
                <line
                  x1={paddingX}
                  y1={paddingTop + chartHeight * 0.5}
                  x2={vbWidth - paddingX}
                  y2={paddingTop + chartHeight * 0.5}
                  strokeDasharray="3 3"
                />
              </g>
            )}
            {showGradient && areaD && (
              <path
                d={areaD}
                fill={isPositive ? "url(#sparkline-emerald-grad-min)" : "url(#sparkline-rose-grad-min)"}
              />
            )}
            {pathD && (
              <path
                d={pathD}
                fill="none"
                stroke={isPositive ? "#10b981" : "#f43f5e"}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#sparkline-glow-min)"
              />
            )}
            {activeCoord && (
              <g>
                <line
                  x1={activeCoord.x}
                  y1={paddingTop}
                  x2={activeCoord.x}
                  y2={vbHeight - paddingBottom}
                  stroke="#737373"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  className="opacity-80"
                />
                <circle
                  cx={activeCoord.x}
                  cy={activeCoord.y}
                  r="7"
                  fill={isPositive ? "rgba(16, 185, 129, 0.2)" : "rgba(244, 63, 94, 0.2)"}
                />
                <circle
                  cx={activeCoord.x}
                  cy={activeCoord.y}
                  r="3.5"
                  fill={isPositive ? "#10b981" : "#f43f5e"}
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />
              </g>
            )}
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div
      data-fullscreen-scroll
      className={cn(
        "relative w-full min-h-[520px] overflow-hidden rounded-2xl border border-neutral-200/80 bg-neutral-950 p-6 text-neutral-100 shadow-xl dark:border-neutral-800",
        className
      )}
    >
      {/* Background radial highlight */}
      <div
        className={cn(
          "pointer-events-none absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full blur-[100px] transition-colors duration-700 opacity-20",
          isPositive ? "bg-emerald-500" : "bg-rose-500"
        )}
      />

      {/* Header & Controls bar */}
      <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-lg text-white">
              {activeDataset.name}
            </span>
            <span className="rounded-md bg-neutral-800/80 px-2 py-0.5 text-xs font-mono font-medium text-neutral-400">
              {activeDataset.ticker}
            </span>
            <div
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold tracking-wide",
                isPositive
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
              )}
            >
              {isPositive ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              <span>
                {isPositive ? "+" : ""}
                {deltaPercent.toFixed(2)}%
              </span>
            </div>
          </div>

          {/* Large Live Ticker Readout */}
          <div className="mt-2 flex items-baseline gap-3">
            <motion.h2
              key={currentVal}
              initial={{ opacity: 0.8, y: -2 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-extrabold tracking-tight font-mono text-white"
            >
              {formatPrice(currentVal)}
            </motion.h2>
            <span className="text-sm font-medium text-neutral-400">
              {activeIndex !== null ? `at ${currentPoint.time}` : "Live Market"}
            </span>
          </div>
        </div>

        {/* Preset Selector Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-neutral-800 bg-neutral-900/90 p-1 backdrop-blur-md">
          {Object.keys(PRESET_DATASETS).map((key) => {
            const isSelected = selectedPresetKey === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setSelectedPresetKey(key);
                  setActiveIndex(null);
                }}
                className={cn(
                  "relative rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200",
                  isSelected
                    ? "text-white font-semibold shadow-sm"
                    : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50"
                )}
              >
                {isSelected && (
                  <motion.div
                    layoutId="sparkline-asset-pill"
                    className="absolute inset-0 rounded-lg bg-neutral-800"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{key}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Sparkline Stage */}
      <div className="relative mt-8 select-none">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${vbWidth} ${vbHeight}`}
          className="w-full cursor-crosshair overflow-visible touch-none"
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
        >
          <defs>
            {/* Emerald Gradient */}
            <linearGradient id="sparkline-emerald-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
              <stop offset="70%" stopColor="#10b981" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </linearGradient>

            {/* Rose Gradient */}
            <linearGradient id="sparkline-rose-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.35" />
              <stop offset="70%" stopColor="#f43f5e" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
            </linearGradient>

            {/* Glow Filter */}
            <filter id="sparkline-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Horizontal Grid lines */}
          {showGrid && (
            <g className="stroke-neutral-800/60 stroke-[1] stroke-dasharray-4">
              <line x1={paddingX} y1={paddingTop + chartHeight * 0.25} x2={vbWidth - paddingX} y2={paddingTop + chartHeight * 0.25} strokeDasharray="3 3" />
              <line x1={paddingX} y1={paddingTop + chartHeight * 0.5} x2={vbWidth - paddingX} y2={paddingTop + chartHeight * 0.5} strokeDasharray="3 3" />
              <line x1={paddingX} y1={paddingTop + chartHeight * 0.75} x2={vbWidth - paddingX} y2={paddingTop + chartHeight * 0.75} strokeDasharray="3 3" />
            </g>
          )}

          {/* Area Fill */}
          {showGradient && areaD && (
            <motion.path
              d={areaD}
              fill={isPositive ? "url(#sparkline-emerald-grad)" : "url(#sparkline-rose-grad)"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
          )}

          {/* Main Sparkline Stroke */}
          {pathD && (
            <motion.path
              d={pathD}
              fill="none"
              stroke={isPositive ? "#10b981" : "#f43f5e"}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#sparkline-glow)"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          )}

          {/* Scrub Vertical Crosshair Cursor */}
          {activeCoord && (
            <g>
              <line
                x1={activeCoord.x}
                y1={paddingTop}
                x2={activeCoord.x}
                y2={vbHeight - paddingBottom}
                stroke="#737373"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                className="opacity-80"
              />
              {/* Outer pulsing ring */}
              <circle
                cx={activeCoord.x}
                cy={activeCoord.y}
                r="9"
                fill={isPositive ? "rgba(16, 185, 129, 0.2)" : "rgba(244, 63, 94, 0.2)"}
              />
              {/* Core indicator dot */}
              <circle
                cx={activeCoord.x}
                cy={activeCoord.y}
                r="4.5"
                fill={isPositive ? "#10b981" : "#f43f5e"}
                stroke="#ffffff"
                strokeWidth="2"
              />
            </g>
          )}
        </svg>

        {/* Scrub tooltip badge */}
        <AnimatePresence>
          {activeCoord && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.15 }}
              style={{
                left: `${(activeCoord.x / vbWidth) * 100}%`,
                top: `${(activeCoord.y / vbHeight) * 100}%`,
              }}
              className="pointer-events-none absolute -translate-x-1/2 -translate-y-12 z-20 whitespace-nowrap rounded-lg border border-neutral-700 bg-neutral-900/95 px-2.5 py-1 text-xs shadow-xl backdrop-blur-md"
            >
              <span className="font-mono font-semibold text-white">
                {formatPrice(activeCoord.point.value)}
              </span>
              <span className="ml-1.5 text-[10px] text-neutral-400">
                {activeCoord.point.time}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Interactive Feature Controls Deck */}
      <div className="relative z-10 mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-neutral-800/80 pt-4 text-xs text-neutral-400">
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-1.5 cursor-pointer hover:text-neutral-200 transition-colors">
            <input
              type="checkbox"
              checked={showGradient}
              onChange={(e) => setShowGradient(e.target.checked)}
              className="rounded border-neutral-700 bg-neutral-800 text-emerald-500 focus:ring-0"
            />
            <span>Area Glow</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer hover:text-neutral-200 transition-colors">
            <input
              type="checkbox"
              checked={showGrid}
              onChange={(e) => setShowGrid(e.target.checked)}
              className="rounded border-neutral-700 bg-neutral-800 text-emerald-500 focus:ring-0"
            />
            <span>Gridlines</span>
          </label>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveIndex(null)}
            className="flex items-center gap-1 rounded-lg border border-neutral-800 bg-neutral-900 px-2.5 py-1 font-medium text-neutral-300 hover:bg-neutral-800 transition-colors"
          >
            <RefreshCw className="h-3 w-3" />
            <span>Reset Cursor</span>
          </button>
          <div className="flex items-center gap-1.5 rounded-lg border border-neutral-800 bg-neutral-900/60 px-3 py-1 font-mono text-neutral-400">
            <Activity className="h-3.5 w-3.5 text-neutral-500" />
            <span>Drag or hover to scrub</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ScrubbableSparkline;

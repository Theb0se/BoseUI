"use client";

import React, { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Layers,
  Sparkles,
  Zap,
  Shield,
  Cpu,
  ArrowUpRight,
  Sliders,
  CheckCircle2,
  Workflow,
  Radio,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type SpotlightColor = "indigo" | "emerald" | "violet" | "amber";

export interface BentoFeatureItem {
  id: string;
  tag: string;
  title: string;
  summary: string;
  revealedDetails: string;
  badge: string;
  metric: string;
  colSpan?: string;
}

export interface HoverRevealFeatureGridProps {
  spotlightColor?: SpotlightColor;
  spotlightRadius?: number;
  className?: string;
}

const SPOTLIGHT_THEMES: Record<
  SpotlightColor,
  {
    name: string;
    radial: string;
    borderGlow: string;
    badgeBorder: string;
    badgeBg: string;
    badgeText: string;
    accent: string;
  }
> = {
  indigo: {
    name: "Linear Indigo",
    radial: "rgba(99, 102, 241, 0.22)",
    borderGlow: "rgba(129, 140, 248, 0.5)",
    badgeBorder: "border-indigo-500/40",
    badgeBg: "bg-indigo-950/60",
    badgeText: "text-indigo-300",
    accent: "text-indigo-400",
  },
  emerald: {
    name: "Matrix Emerald",
    radial: "rgba(16, 185, 129, 0.22)",
    borderGlow: "rgba(52, 211, 153, 0.5)",
    badgeBorder: "border-emerald-500/40",
    badgeBg: "bg-emerald-950/60",
    badgeText: "text-emerald-300",
    accent: "text-emerald-400",
  },
  violet: {
    name: "Cyber Violet",
    radial: "rgba(168, 85, 247, 0.22)",
    borderGlow: "rgba(192, 132, 252, 0.5)",
    badgeBorder: "border-purple-500/40",
    badgeBg: "bg-purple-950/60",
    badgeText: "text-purple-300",
    accent: "text-purple-400",
  },
  amber: {
    name: "Sunset Amber",
    radial: "rgba(245, 158, 11, 0.22)",
    borderGlow: "rgba(251, 191, 36, 0.5)",
    badgeBorder: "border-amber-500/40",
    badgeBg: "bg-amber-950/60",
    badgeText: "text-amber-300",
    accent: "text-amber-400",
  },
};

const DEFAULT_FEATURES: BentoFeatureItem[] = [
  {
    id: "hero-sync",
    tag: "CORE PROTOCOL",
    title: "Real-time Bi-directional Graph Sync",
    summary: "Instantaneous CRDT delta updates replicated across client memory states.",
    revealedDetails:
      "State vector clocks with sub-10ms conflict resolution, zero server round-trip latency for local changes, and optimistic offline caching.",
    badge: "99.999% Uptime",
    metric: "< 8ms Latency",
    colSpan: "md:col-span-2",
  },
  {
    id: "engine-isolate",
    tag: "INFRASTRUCTURE",
    title: "Microsecond Sandboxing",
    summary: "Stateless execution isolates boots in 200 microseconds.",
    revealedDetails:
      "V8 memory pools pre-warmed on global edge nodes with isolated heap ceilings.",
    badge: "0 Cold Start",
    metric: "0.2ms Init",
    colSpan: "md:col-span-1",
  },
  {
    id: "keyboard-first",
    tag: "ERGONOMICS",
    title: "Command-Driven Workflows",
    summary: "Operate the entire system without lifting fingers from the keyboard.",
    revealedDetails:
      "Fuzzy command matching, macro record/playback, and custom vim keybindings baked into every screen.",
    badge: "100% Keyboard",
    metric: "120+ Hotkeys",
    colSpan: "md:col-span-1",
  },
  {
    id: "telemetry-mesh",
    tag: "OBSERVABILITY",
    title: "High-Frequency Telemetry Mesh",
    summary: "Sub-millisecond tracing across microservices with eBPF hooks.",
    revealedDetails:
      "Continuous runtime profiling with flamegraphs, distributed span correlation, and automated anomaly detection.",
    badge: "Auto Diagnostics",
    metric: "10M Events/s",
    colSpan: "md:col-span-2",
  },
];

export function HoverRevealFeatureGrid({
  spotlightColor = "indigo",
  spotlightRadius = 350,
  className,
}: HoverRevealFeatureGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeTheme, setActiveTheme] = useState<SpotlightColor>(spotlightColor);
  const [radius, setRadius] = useState<number>(spotlightRadius);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const [alwaysReveal, setAlwaysReveal] = useState<boolean>(false);

  const theme = SPOTLIGHT_THEMES[activeTheme];

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setMousePos(null);
  }, []);

  return (
    <div
      data-fullscreen-scroll
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative w-full min-h-[520px] overflow-hidden rounded-2xl border border-neutral-800 bg-[#07080D] p-6 text-white shadow-2xl flex flex-col justify-between selection:bg-neutral-800",
        className
      )}
    >
      {/* Background radial spotlight beam tracking cursor */}
      {mousePos && (
        <div
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl transition-opacity duration-300"
          style={{
            left: `${mousePos.x}px`,
            top: `${mousePos.y}px`,
            width: `${radius * 2}px`,
            height: `${radius * 2}px`,
            background: `radial-gradient(circle, ${theme.radial} 0%, transparent 70%)`,
          }}
        />
      )}

      {/* Header Bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-neutral-800/80 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-700 bg-neutral-900 font-mono text-xs font-bold text-neutral-200">
            <Layers className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold tracking-tight text-white">
                Linear Bento Feature Grid
              </h3>
              <span
                className={cn(
                  "text-[10px] uppercase font-mono px-2 py-0.5 rounded-full border",
                  theme.badgeBorder,
                  theme.badgeBg,
                  theme.badgeText
                )}
              >
                {theme.name}
              </span>
            </div>
            <p className="text-xs text-neutral-400 font-mono">
              Hover tiles to project spotlight mask & reveal secondary specs
            </p>
          </div>
        </div>

        {/* Live Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Spotlight color selector */}
          <div className="flex items-center rounded-lg border border-neutral-800 bg-neutral-900/90 p-1">
            {(["indigo", "emerald", "violet", "amber"] as const).map((c) => (
              <button
                key={c}
                onClick={() => setActiveTheme(c)}
                className={cn(
                  "px-2.5 py-1 text-[11px] font-mono rounded capitalize transition-all",
                  activeTheme === c
                    ? "bg-neutral-800 text-white font-bold shadow-sm"
                    : "text-neutral-400 hover:text-neutral-200"
                )}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Always Reveal Toggle */}
          <button
            onClick={() => setAlwaysReveal(!alwaysReveal)}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono rounded-lg border transition-all",
              alwaysReveal
                ? "border-neutral-700 bg-neutral-800 text-white font-medium"
                : "border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-neutral-200"
            )}
          >
            <Eye className="h-3.5 w-3.5" />
            <span>{alwaysReveal ? "Always Reveal: ON" : "Hover Reveal"}</span>
          </button>
        </div>
      </div>

      {/* Main Bento Grid */}
      <div className="relative z-10 my-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {DEFAULT_FEATURES.map((item, idx) => {
          const isHovered = hoveredCardId === item.id || alwaysReveal;

          return (
            <motion.div
              key={item.id}
              tabIndex={0}
              role="button"
              onMouseEnter={() => setHoveredCardId(item.id)}
              onMouseLeave={() => setHoveredCardId(null)}
              onFocus={() => setHoveredCardId(item.id)}
              onBlur={() => setHoveredCardId(null)}
              className={cn(
                "group relative flex flex-col justify-between overflow-hidden rounded-xl border p-5 backdrop-blur-md transition-all duration-300 cursor-pointer outline-none",
                item.colSpan,
                isHovered
                  ? "border-neutral-600 bg-neutral-900/80 shadow-lg ring-1 ring-white/10"
                  : "border-neutral-800/80 bg-neutral-950/60 hover:border-neutral-700"
              )}
            >
              {/* Card top banner */}
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                    {idx === 0 ? (
                      <Sparkles className="h-3 w-3 text-white" />
                    ) : idx === 1 ? (
                      <Cpu className="h-3 w-3" />
                    ) : idx === 2 ? (
                      <Zap className="h-3 w-3" />
                    ) : (
                      <Radio className="h-3 w-3" />
                    )}
                    {item.tag}
                  </span>

                  <span
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-mono text-[10px] font-bold transition-all",
                      isHovered
                        ? cn(theme.badgeBorder, theme.badgeBg, theme.badgeText)
                        : "border-neutral-800 bg-neutral-900 text-neutral-400"
                    )}
                  >
                    {item.metric}
                    <ArrowUpRight className="h-2.5 w-2.5" />
                  </span>
                </div>

                <h4 className="mt-3 text-base font-semibold text-white tracking-tight group-hover:text-white transition-colors">
                  {item.title}
                </h4>

                <p className="mt-1.5 text-xs leading-relaxed text-neutral-400">
                  {item.summary}
                </p>
              </div>

              {/* Progressive Revealed Details (Spring Animated) */}
              <div className="mt-4 border-t border-neutral-800/80 pt-3">
                <AnimatePresence>
                  {isHovered ? (
                    <motion.div
                      initial={{ opacity: 0, height: 0, y: 6 }}
                      animate={{ opacity: 1, height: "auto", y: 0 }}
                      exit={{ opacity: 0, height: 0, y: 6 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
                      <div className="rounded-lg border border-neutral-800 bg-neutral-950/90 p-3 font-mono text-[11px] leading-relaxed text-neutral-300">
                        <div className="flex items-center gap-1.5 text-white font-semibold mb-1">
                          <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                          <span>ARCHITECTURE SPECIFICATION</span>
                        </div>
                        {item.revealedDetails}
                      </div>
                    </motion.div>
                  ) : (
                    <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500">
                      <span>Hover or focus to inspect spec</span>
                      <span className="text-neutral-600">&rarr;</span>
                    </div>
                  )}
                </AnimatePresence>

                {/* Bottom badge */}
                <div className="mt-3 flex items-center justify-between">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded",
                      isHovered
                        ? "bg-white/10 text-white font-medium"
                        : "text-neutral-500"
                    )}
                  >
                    {item.badge}
                  </span>
                  <span className="text-[10px] font-mono text-neutral-500">
                    STATUS: READY
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Footer controls: Spotlight Radius Slider & Telemetry */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-t border-neutral-800/80 pt-3 text-xs">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] text-neutral-400 flex items-center gap-1">
            <Sliders className="h-3 w-3" />
            <span>SPOTLIGHT CONE</span>
          </span>
          <input
            type="range"
            min="150"
            max="600"
            step="25"
            value={radius}
            onChange={(e) => setRadius(parseInt(e.target.value))}
            className="accent-neutral-300 h-1.5 w-32 cursor-pointer rounded-lg bg-neutral-800"
          />
          <span className="font-mono text-[11px] text-white font-bold">{radius}px</span>
        </div>

        <div className="flex items-center gap-4 font-mono text-[11px] text-neutral-400">
          <span>
            HOVERED:{" "}
            <span className="text-white font-bold">
              {hoveredCardId ? hoveredCardId.toUpperCase() : "NONE"}
            </span>
          </span>
          <span>TILES: 4 BENTO CELLS</span>
        </div>
      </div>
    </div>
  );
}

export default HoverRevealFeatureGrid;

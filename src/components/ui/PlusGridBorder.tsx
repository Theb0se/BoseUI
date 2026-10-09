"use client";

import React, { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  Layers,
  Cpu,
  GitBranch,
  ShieldCheck,
  Zap,
  ArrowUpRight,
  Maximize2,
  Sliders,
  Compass,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface GridCardItem {
  id: string;
  tag: string;
  title: string;
  description: string;
  metric?: string;
  icon?: React.ReactNode;
}

export interface PlusGridBorderProps {
  items?: GridCardItem[];
  glowColor?: "cyan" | "violet" | "emerald" | "amber";
  interactiveProximity?: boolean;
  className?: string;
}

const DEFAULT_CARDS: GridCardItem[] = [
  {
    id: "edge-compute",
    tag: "01 // COMPUTE",
    title: "Edge Runtime Execution",
    description: "Zero-cold-start V8 isolates executing sub-millisecond payloads at 310 global edge nodes.",
    metric: "0.4ms TTFB",
  },
  {
    id: "turborepo",
    tag: "02 // PIPELINE",
    title: "Remote Cache Artifacts",
    description: "Multi-tenant build hashes cached across continuous CI runners with bit-level reproducibility.",
    metric: "98.2% Cache Hit",
  },
  {
    id: "ddos-guard",
    tag: "03 // SECURITY",
    title: "Layer 7 Anomaly Shield",
    description: "Automated eBPF packet mitigation absorbing volumetric SYN floods and synthetic bot scrapers.",
    metric: "40Tbps Capacity",
  },
  {
    id: "instant-rollback",
    tag: "04 // ORCHESTRATION",
    title: "Atomic Deployment Slugs",
    description: "Zero-downtime DNS pointer swaps allowing instantaneous rollback to any previous immutable release.",
    metric: "1-Click Rollback",
  },
];

const GLOW_THEMES = {
  cyan: {
    accent: "text-cyan-400",
    bgAccent: "bg-cyan-500/10",
    borderAccent: "border-cyan-500/40",
    glow: "rgba(6, 182, 212, 0.4)",
    crossColor: "text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]",
    pill: "border-cyan-500/30 text-cyan-400 bg-cyan-950/40",
  },
  violet: {
    accent: "text-violet-400",
    bgAccent: "bg-violet-500/10",
    borderAccent: "border-violet-500/40",
    glow: "rgba(139, 92, 246, 0.4)",
    crossColor: "text-violet-400 drop-shadow-[0_0_8px_rgba(139,92,246,0.8)]",
    pill: "border-violet-500/30 text-violet-400 bg-violet-950/40",
  },
  emerald: {
    accent: "text-emerald-400",
    bgAccent: "bg-emerald-500/10",
    borderAccent: "border-emerald-500/40",
    glow: "rgba(16, 185, 129, 0.4)",
    crossColor: "text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]",
    pill: "border-emerald-500/30 text-emerald-400 bg-emerald-950/40",
  },
  amber: {
    accent: "text-amber-400",
    bgAccent: "bg-amber-500/10",
    borderAccent: "border-amber-500/40",
    glow: "rgba(245, 158, 11, 0.4)",
    crossColor: "text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]",
    pill: "border-amber-500/30 text-amber-400 bg-amber-950/40",
  },
};

export function PlusGridBorder({
  items = DEFAULT_CARDS,
  glowColor = "cyan",
  interactiveProximity = true,
  className,
}: PlusGridBorderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeTheme, setActiveTheme] = useState<"cyan" | "violet" | "emerald" | "amber">(glowColor);
  const [crossSize, setCrossSize] = useState<"sm" | "md" | "lg">("md");
  const [proximityActive, setProximityActive] = useState<boolean>(interactiveProximity);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const [activeCardId, setActiveCardId] = useState<string | null>(null);

  const theme = GLOW_THEMES[activeTheme];

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

  // Cross marker renderer
  const renderCross = (positionClasses: string, keyId: string) => {
    return (
      <div
        key={keyId}
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute z-20 flex items-center justify-center -translate-x-1/2 -translate-y-1/2 select-none font-mono transition-colors duration-300",
          positionClasses,
          crossSize === "sm" && "text-xs h-3 w-3",
          crossSize === "md" && "text-sm h-4 w-4",
          crossSize === "lg" && "text-base h-5 w-5",
          mousePos && proximityActive
            ? theme.crossColor
            : "text-neutral-600 dark:text-neutral-500"
        )}
      >
        <span className="font-semibold leading-none">+</span>
      </div>
    );
  };

  const getCardIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Zap className="h-4 w-4 text-neutral-400 group-hover:text-cyan-400 transition-colors" />;
      case 1:
        return <GitBranch className="h-4 w-4 text-neutral-400 group-hover:text-cyan-400 transition-colors" />;
      case 2:
        return <ShieldCheck className="h-4 w-4 text-neutral-400 group-hover:text-cyan-400 transition-colors" />;
      default:
        return <Cpu className="h-4 w-4 text-neutral-400 group-hover:text-cyan-400 transition-colors" />;
    }
  };

  return (
    <div
      data-fullscreen-scroll
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative w-full min-h-[520px] overflow-hidden rounded-2xl border border-neutral-800 bg-[#07090E] p-6 text-white shadow-2xl flex flex-col justify-between selection:bg-cyan-500/30",
        className
      )}
    >
      {/* Background blueprint dotted grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Dynamic radial glow following pointer */}
      {mousePos && proximityActive && (
        <div
          className="pointer-events-none absolute rounded-full blur-3xl transition-opacity duration-300 -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `${mousePos.x}px`,
            top: `${mousePos.y}px`,
            width: "320px",
            height: "320px",
            background: `radial-gradient(circle, ${theme.glow} 0%, transparent 70%)`,
          }}
        />
      )}

      {/* Header bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-neutral-800/80 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-700 bg-neutral-900/80 font-mono text-xs font-bold text-neutral-200">
            [+]
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-tight text-white flex items-center gap-2">
              Blueprint Plus Grid
              <span className={cn("text-[10px] uppercase font-mono px-2 py-0.5 rounded-full border", theme.pill)}>
                {activeTheme}
              </span>
            </h3>
            <p className="text-xs text-neutral-400 font-mono">
              Vercel-style architectural frame with proximity corner crosses
            </p>
          </div>
        </div>

        {/* Live Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Theme selector */}
          <div className="flex items-center rounded-lg border border-neutral-800 bg-neutral-900/90 p-1">
            {(["cyan", "violet", "emerald", "amber"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setActiveTheme(t)}
                className={cn(
                  "px-2.5 py-1 text-[11px] font-mono rounded capitalize transition-all",
                  activeTheme === t
                    ? "bg-neutral-800 text-white shadow-sm font-bold"
                    : "text-neutral-400 hover:text-neutral-200"
                )}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Cross size selector */}
          <div className="flex items-center rounded-lg border border-neutral-800 bg-neutral-900/90 p-1">
            {(["sm", "md", "lg"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setCrossSize(s)}
                className={cn(
                  "px-2 py-1 text-[10px] font-mono rounded uppercase transition-all",
                  crossSize === s
                    ? "bg-neutral-800 text-white font-bold"
                    : "text-neutral-400 hover:text-neutral-200"
                )}
              >
                +{s}
              </button>
            ))}
          </div>

          {/* Proximity Toggle */}
          <button
            onClick={() => setProximityActive(!proximityActive)}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono rounded-lg border transition-all",
              proximityActive
                ? "border-neutral-700 bg-neutral-800 text-white font-medium"
                : "border-neutral-800 bg-neutral-900 text-neutral-500 hover:text-neutral-300"
            )}
          >
            <Compass className="h-3 w-3" />
            <span>{proximityActive ? "Glow On" : "Glow Off"}</span>
          </button>
        </div>
      </div>

      {/* Main Grid Section with Junction Crosses */}
      <div className="relative my-6 grid grid-cols-1 md:grid-cols-2 gap-0 border border-neutral-800/90 bg-neutral-950/40 rounded-xl overflow-visible backdrop-blur-sm">
        {/* Perimeter & Intersection Plus Crosses */}
        {renderCross("left-0 top-0", "cross-tl")}
        {renderCross("left-1/2 top-0 hidden md:flex", "cross-tc")}
        {renderCross("right-0 top-0", "cross-tr")}
        {renderCross("left-0 top-1/2 hidden md:flex", "cross-ml")}
        {renderCross("left-1/2 top-1/2 hidden md:flex", "cross-mc")}
        {renderCross("right-0 top-1/2 hidden md:flex", "cross-mr")}
        {renderCross("left-0 bottom-0", "cross-bl")}
        {renderCross("left-1/2 bottom-0 hidden md:flex", "cross-bc")}
        {renderCross("right-0 bottom-0", "cross-br")}

        {items.map((card, idx) => {
          const isSelected = activeCardId === card.id;
          return (
            <motion.div
              key={card.id}
              tabIndex={0}
              role="button"
              onClick={() => setActiveCardId(isSelected ? null : card.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setActiveCardId(isSelected ? null : card.id);
                }
              }}
              whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.02)" }}
              className={cn(
                "group relative p-6 cursor-pointer outline-none transition-all duration-200 border-neutral-800/80",
                // Grid cell dividing borders
                idx % 2 === 0 ? "md:border-r border-b" : "border-b",
                idx >= items.length - 2 && "md:border-b-0",
                isSelected && "bg-white/[0.04] ring-1 ring-neutral-600"
              )}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-neutral-400 group-hover:text-neutral-200 flex items-center gap-1.5 transition-colors">
                  {getCardIcon(idx)}
                  {card.tag}
                </span>

                {card.metric && (
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 font-mono text-[11px] px-2 py-0.5 rounded border border-neutral-800 bg-neutral-900/80 font-bold transition-all",
                      isSelected ? theme.pill : "text-neutral-300 group-hover:border-neutral-700"
                    )}
                  >
                    {card.metric}
                    <ArrowUpRight className="h-3 w-3 text-neutral-400 group-hover:text-white transition-colors" />
                  </span>
                )}
              </div>

              <div className="mt-4">
                <h4 className="text-base font-semibold text-white tracking-tight group-hover:text-white transition-colors">
                  {card.title}
                </h4>
                <p className="mt-1.5 text-xs leading-relaxed text-neutral-400 group-hover:text-neutral-300 transition-colors">
                  {card.description}
                </p>
              </div>

              {/* Bottom detail pill */}
              <div className="mt-5 flex items-center justify-between text-[11px] font-mono text-neutral-500">
                <span>STAGE: ACTIVE</span>
                <span className="group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 text-neutral-400 group-hover:text-white">
                  Inspect Spec &rarr;
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Footer status / telemetry */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 border-t border-neutral-800/80 pt-3 text-[11px] font-mono text-neutral-400">
        <div className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>BLUEPRINT MESH: 4 QUADRANTS CONNECTED</span>
        </div>
        <div className="flex items-center gap-4">
          <span>CURSOR POS: {mousePos ? `${Math.round(mousePos.x)}px, ${Math.round(mousePos.y)}px` : "OFF GRID"}</span>
          <span>INTERSECTIONS: 9 NODES</span>
        </div>
      </div>
    </div>
  );
}

export default PlusGridBorder;

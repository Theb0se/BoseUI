"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  Sliders,
  Type,
  Eye,
  Check,
  Copy,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type ShimmerPalette = "silver" | "gold" | "violet" | "emerald";

export interface ShimmerTextProps {
  text?: string;
  palette?: ShimmerPalette;
  duration?: number;
  angle?: number;
  shimmerOnHoverOnly?: boolean;
  className?: string;
}

const PALETTES: Record<
  ShimmerPalette,
  {
    name: string;
    textGradient: string;
    shimmerGlow: string;
    border: string;
    badgeBg: string;
    badgeText: string;
    beamGradient: string;
  }
> = {
  silver: {
    name: "Platinum Silver",
    textGradient:
      "linear-gradient(180deg, #FFFFFF 0%, #E2E8F0 45%, #94A3B8 100%)",
    shimmerGlow: "rgba(255, 255, 255, 0.4)",
    border: "border-slate-700/60",
    badgeBg: "bg-slate-800/80",
    badgeText: "text-slate-200",
    beamGradient:
      "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.95) 50%, rgba(255,255,255,0) 100%)",
  },
  gold: {
    name: "Liquid Gold",
    textGradient:
      "linear-gradient(180deg, #FFFBEB 0%, #FDE68A 40%, #D97706 100%)",
    shimmerGlow: "rgba(251, 191, 36, 0.45)",
    border: "border-amber-700/60",
    badgeBg: "bg-amber-950/60",
    badgeText: "text-amber-300",
    beamGradient:
      "linear-gradient(90deg, rgba(254,243,199,0) 0%, rgba(254,240,138,0.95) 50%, rgba(254,243,199,0) 100%)",
  },
  violet: {
    name: "Cyber Neon",
    textGradient:
      "linear-gradient(180deg, #FAF5FF 0%, #D8B4FE 45%, #9333EA 100%)",
    shimmerGlow: "rgba(168, 85, 247, 0.45)",
    border: "border-purple-700/60",
    badgeBg: "bg-purple-950/60",
    badgeText: "text-purple-300",
    beamGradient:
      "linear-gradient(90deg, rgba(243,232,255,0) 0%, rgba(216,180,254,0.95) 50%, rgba(243,232,255,0) 100%)",
  },
  emerald: {
    name: "Matrix Emerald",
    textGradient:
      "linear-gradient(180deg, #ECFDF5 0%, #6EE7B7 45%, #059669 100%)",
    shimmerGlow: "rgba(52, 211, 153, 0.45)",
    border: "border-emerald-700/60",
    badgeBg: "bg-emerald-950/60",
    badgeText: "text-emerald-300",
    beamGradient:
      "linear-gradient(90deg, rgba(209,250,229,0) 0%, rgba(110,231,183,0.95) 50%, rgba(209,250,229,0) 100%)",
  },
};

const DEFAULT_HEADLINE =
  "Linear issue tracking engineered for high-velocity software teams.";

export function ShimmerText({
  text = DEFAULT_HEADLINE,
  palette = "silver",
  duration = 3,
  angle = 115,
  shimmerOnHoverOnly = false,
  className,
}: ShimmerTextProps) {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const [headline, setHeadline] = useState(text);
  const [activePalette, setActivePalette] = useState<ShimmerPalette>(palette);
  const [speed, setSpeed] = useState(duration);
  const [beamAngle, setBeamAngle] = useState(angle);
  const [hoverOnly, setHoverOnly] = useState(shimmerOnHoverOnly);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [copied, setCopied] = useState(false);
  const [fontSize, setFontSize] = useState<"md" | "lg" | "xl">("lg");

  const currentTheme = PALETTES[activePalette];
  const activeAnimation = !shouldReduceMotion && isPlaying && (!hoverOnly || isHovered);

  const handleCopy = () => {
    navigator.clipboard?.writeText(headline);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      data-fullscreen-scroll
      className={cn(
        "relative w-full min-h-[520px] overflow-hidden rounded-2xl border border-neutral-800 bg-[#08090D] p-6 text-white shadow-2xl flex flex-col justify-between selection:bg-purple-500/30",
        className
      )}
    >
      {/* Background ambient radial aura */}
      <div
        className="pointer-events-none absolute inset-0 opacity-25 blur-3xl transition-all duration-700"
        style={{
          background: `radial-gradient(circle at 50% 40%, ${currentTheme.shimmerGlow} 0%, transparent 60%)`,
        }}
      />

      {/* Control Header */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-neutral-800/80 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-700 bg-neutral-900 font-mono text-xs font-bold text-neutral-200">
            <Sparkles className="h-4 w-4 text-neutral-300" />
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-tight text-white flex items-center gap-2">
              Specular Shimmer Text
              <span
                className={cn(
                  "text-[10px] uppercase font-mono px-2 py-0.5 rounded-full border",
                  currentTheme.border,
                  currentTheme.badgeBg,
                  currentTheme.badgeText
                )}
              >
                {currentTheme.name}
              </span>
            </h3>
            <p className="text-xs text-neutral-400 font-mono">
              Linear-grade metallic typography with high-gloss beam refraction
            </p>
          </div>
        </div>

        {/* Palette selector & Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center rounded-lg border border-neutral-800 bg-neutral-900/90 p-1">
            {(["silver", "gold", "violet", "emerald"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setActivePalette(p)}
                className={cn(
                  "px-2.5 py-1 text-[11px] font-mono rounded capitalize transition-all",
                  activePalette === p
                    ? "bg-neutral-800 text-white font-bold shadow-sm"
                    : "text-neutral-400 hover:text-neutral-200"
                )}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Size picker */}
          <div className="flex items-center rounded-lg border border-neutral-800 bg-neutral-900/90 p-1 font-mono text-[10px]">
            {(["md", "lg", "xl"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFontSize(s)}
                className={cn(
                  "px-2 py-1 rounded uppercase transition-all",
                  fontSize === s
                    ? "bg-neutral-800 text-white font-bold"
                    : "text-neutral-400 hover:text-neutral-200"
                )}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Play / Pause toggle */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            aria-label={isPlaying ? "Pause Shimmer" : "Play Shimmer"}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-mono rounded-lg border border-neutral-800 bg-neutral-900 text-neutral-300 hover:text-white transition-colors"
          >
            {isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
            <span>{isPlaying ? "Pause" : "Play"}</span>
          </button>
        </div>
      </div>

      {/* Main Display Area */}
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative my-auto flex flex-col items-center justify-center py-12 px-4 text-center cursor-default select-none"
      >
        {/* Release Pill Badge */}
        <div
          className={cn(
            "mb-6 inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[11px] font-medium backdrop-blur-md transition-all",
            currentTheme.border,
            currentTheme.badgeBg,
            currentTheme.badgeText
          )}
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-current" />
          </span>
          <span>LINEAR 2.0 PROTOCOL // RELEASE REFS</span>
        </div>

        {/* Shimmering Headline Container */}
        <div className="relative inline-block max-w-3xl">
          {/* Base metallic gradient text */}
          <h1
            className={cn(
              "font-bold tracking-tight leading-[1.15] transition-all",
              fontSize === "md" && "text-2xl md:text-3xl",
              fontSize === "lg" && "text-3xl md:text-5xl",
              fontSize === "xl" && "text-4xl md:text-6xl"
            )}
            style={{
              backgroundImage: currentTheme.textGradient,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {headline}
          </h1>

          {/* Sweeping specular light beam overlay via mask and absolute clone */}
          {activeAnimation && (
            <motion.div
              aria-hidden="true"
              className={cn(
                "pointer-events-none absolute inset-0 font-bold tracking-tight leading-[1.15]",
                fontSize === "md" && "text-2xl md:text-3xl",
                fontSize === "lg" && "text-3xl md:text-5xl",
                fontSize === "xl" && "text-4xl md:text-6xl"
              )}
              initial={{
                maskPosition: "-200% 0%",
                WebkitMaskPosition: "-200% 0%",
              }}
              animate={{
                maskPosition: ["-100% 0%", "200% 0%"],
                WebkitMaskPosition: ["-100% 0%", "200% 0%"],
              }}
              transition={{
                repeat: Infinity,
                duration: speed,
                ease: "easeInOut",
                repeatDelay: 0.5,
              }}
              style={{
                background: currentTheme.beamGradient,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                filter: "drop-shadow(0 0 12px rgba(255, 255, 255, 0.8))",
                maskImage: `linear-gradient(${beamAngle}deg, transparent 20%, black 50%, transparent 80%)`,
                WebkitMaskImage: `linear-gradient(${beamAngle}deg, transparent 20%, black 50%, transparent 80%)`,
                maskSize: "200% 100%",
                WebkitMaskSize: "200% 100%",
              }}
            >
              {headline}
            </motion.div>
          )}
        </div>

        {/* Subtitle */}
        <p className="mt-6 max-w-xl text-sm md:text-base text-neutral-400 font-sans">
          Engineered with microsecond responsiveness, real-time sync, and fluid keyboard ergonomics.
        </p>

        {/* Interactive copy button */}
        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-2 rounded-xl border border-neutral-700 bg-neutral-800/80 px-4 py-2 text-xs font-medium text-neutral-200 hover:bg-neutral-700 hover:text-white transition-all shadow-sm"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span>Copied to Clipboard</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy Headline</span>
              </>
            )}
          </button>

          <button
            onClick={() => setHoverOnly(!hoverOnly)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-mono transition-all",
              hoverOnly
                ? "border-neutral-600 bg-neutral-800 text-white font-medium"
                : "border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:text-neutral-200"
            )}
          >
            <Eye className="h-3.5 w-3.5" />
            <span>{hoverOnly ? "Sweep on Hover Only: ON" : "Sweep on Hover Only: OFF"}</span>
          </button>
        </div>
      </div>

      {/* Interactive Controls Bar */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-neutral-800/80 pt-4 text-xs">
        {/* Live Headline Editor */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-mono text-neutral-400 flex items-center gap-1">
            <Type className="h-3 w-3" />
            <span>CUSTOM TEXT</span>
          </label>
          <input
            type="text"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            placeholder="Type custom headline..."
            className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-1.5 font-sans text-xs text-white placeholder-neutral-500 focus:border-neutral-500 focus:outline-none"
          />
        </div>

        {/* Shimmer Speed Slider */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-[11px] font-mono text-neutral-400">
            <span>SWEEP DURATION</span>
            <span className="text-white font-bold">{speed}s</span>
          </div>
          <input
            type="range"
            min="1"
            max="6"
            step="0.5"
            value={speed}
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
            className="accent-neutral-300 h-1.5 w-full cursor-pointer rounded-lg bg-neutral-800"
          />
        </div>

        {/* Beam Angle Slider */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-[11px] font-mono text-neutral-400">
            <span>BEAM ANGLE</span>
            <span className="text-white font-bold">{beamAngle}&deg;</span>
          </div>
          <input
            type="range"
            min="45"
            max="180"
            step="5"
            value={beamAngle}
            onChange={(e) => setBeamAngle(parseInt(e.target.value))}
            className="accent-neutral-300 h-1.5 w-full cursor-pointer rounded-lg bg-neutral-800"
          />
        </div>
      </div>
    </div>
  );
}

export default ShimmerText;

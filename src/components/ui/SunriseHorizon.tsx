"use client";

import React, { useState, useEffect } from "react";
import { Sun, Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";

export type TimePreset = "dawn" | "noon" | "dusk";

export interface SunriseHorizonProps {
  /** Time of day from 0 (dawn) to 0.5 (noon) to 1 (dusk), or named preset. Default: "dawn" */
  time?: number | TimePreset;
  /** Continuously cycle through dawn, noon, and dusk. Default: true */
  autoplay?: boolean;
  /** Diameter of the sun orb in pixels. Default: 96 */
  sunSize?: number;
  /** Overlay subtle atmospheric film grain. Default: true */
  grain?: boolean;
  /** Optional foreground content */
  children?: React.ReactNode;
  className?: string;
}

const PRESET_TO_TIME: Record<TimePreset, number> = {
  dawn: 0.18,
  noon: 0.5,
  dusk: 0.84,
};

function lerpColor(hexA: string, hexB: string, t: number): string {
  const a = parseInt(hexA.slice(1), 16);
  const b = parseInt(hexB.slice(1), 16);
  const r1 = (a >> 16) & 255;
  const g1 = (a >> 8) & 255;
  const b1 = a & 255;
  const r2 = (b >> 16) & 255;
  const g2 = (b >> 8) & 255;
  const b2 = b & 255;
  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const bl = Math.round(b1 + (b2 - b1) * t);
  return `rgb(${r}, ${g}, ${bl})`;
}

function getSkyPalette(t: number) {
  // Keyframes: 0 = deep night/dawn, 0.25 = sunrise, 0.5 = bright noon, 0.8 = golden dusk, 1 = night
  const stops = [
    {
      pos: 0,
      zenith: "#070B19",
      mid: "#1E1B4B",
      horizon: "#7C2D12",
      glow: "#F97316",
      sun: "#FDBA74",
    },
    {
      pos: 0.22,
      zenith: "#0F172A",
      mid: "#581C87",
      horizon: "#EA580C",
      glow: "#FBBF24",
      sun: "#FEF08A",
    },
    {
      pos: 0.5,
      zenith: "#0284C7",
      mid: "#38BDF8",
      horizon: "#BAE6FD",
      glow: "#FEF9C3",
      sun: "#FFFFFF",
    },
    {
      pos: 0.82,
      zenith: "#0F172A",
      mid: "#4C1D95",
      horizon: "#E11D48",
      glow: "#FB923C",
      sun: "#FDE047",
    },
    {
      pos: 1,
      zenith: "#050814",
      mid: "#1E1B4B",
      horizon: "#431407",
      glow: "#EA580C",
      sun: "#FDBA74",
    },
  ];

  const clamped = Math.max(0, Math.min(1, t));
  let lower = stops[0];
  let upper = stops[stops.length - 1];

  for (let i = 0; i < stops.length - 1; i++) {
    if (clamped >= stops[i].pos && clamped <= stops[i + 1].pos) {
      lower = stops[i];
      upper = stops[i + 1];
      break;
    }
  }

  const span = upper.pos - lower.pos || 1;
  const localT = (clamped - lower.pos) / span;

  return {
    zenith: lerpColor(lower.zenith, upper.zenith, localT),
    mid: lerpColor(lower.mid, upper.mid, localT),
    horizon: lerpColor(lower.horizon, upper.horizon, localT),
    glow: lerpColor(lower.glow, upper.glow, localT),
    sun: lerpColor(lower.sun, upper.sun, localT),
  };
}

export function SunriseHorizon({
  time = "dawn",
  autoplay = true,
  sunSize = 92,
  grain = true,
  children,
  className,
}: SunriseHorizonProps) {
  const initialNumeric =
    typeof time === "number" ? time : PRESET_TO_TIME[time] ?? 0.2;

  const [currentTime, setCurrentTime] = useState(initialNumeric);
  const [isPlaying, setIsPlaying] = useState(autoplay);

  useEffect(() => {
    setCurrentTime(
      typeof time === "number" ? time : PRESET_TO_TIME[time] ?? 0.2
    );
  }, [time]);

  useEffect(() => {
    setIsPlaying(autoplay);
  }, [autoplay]);

  useEffect(() => {
    if (!isPlaying) return;
    let rafId: number;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      setCurrentTime((prev) => (prev + dt * 0.055) % 1);
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [isPlaying]);

  const palette = getSkyPalette(currentTime);

  // Sun arc trajectory: X goes from 18% to 82%, Y rises in an arc (sin(pi * t))
  const sunX = 18 + currentTime * 64;
  const arcHeight = Math.sin(currentTime * Math.PI); // 0 at edges, 1 at noon
  const sunBottomPct = 14 + arcHeight * 54;

  return (
    <div
      data-fullscreen-scroll
      style={
        {
          "--time": currentTime.toFixed(3),
          background: `linear-gradient(180deg, ${palette.zenith} 0%, ${palette.mid} 48%, ${palette.horizon} 85%, ${palette.glow} 100%)`,
        } as React.CSSProperties
      }
      className={cn(
        "relative flex min-h-[360px] w-full flex-col justify-between overflow-hidden rounded-3xl border border-neutral-200 shadow-sm dark:border-neutral-800",
        className
      )}
    >
      {/* Radial Horizon Glow */}
      <div
        aria-hidden="true"
        style={{
          left: `${sunX}%`,
          bottom: `${Math.max(8, sunBottomPct - 10)}%`,
          width: sunSize * 3.8,
          height: sunSize * 3.8,
          background: `radial-gradient(circle, ${palette.glow} 0%, transparent 70%)`,
          opacity: 0.75,
        }}
        className="pointer-events-none absolute -translate-x-1/2 translate-y-1/2 rounded-full blur-2xl"
      />

      {/* Sun Orb */}
      <div
        aria-hidden="true"
        style={{
          left: `${sunX}%`,
          bottom: `${sunBottomPct}%`,
          width: sunSize,
          height: sunSize,
          background: `radial-gradient(circle, ${palette.sun} 0%, ${palette.glow} 85%)`,
          boxShadow: `0 0 ${sunSize * 0.7}px ${palette.glow}`,
        }}
        className="pointer-events-none absolute -translate-x-1/2 translate-y-1/2 rounded-full"
      />

      {/* Optional Film Grain */}
      {grain && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.14] mix-blend-overlay [background-image:radial-gradient(rgba(255,255,255,0.6)_1px,transparent_0)] [background-size:3px_3px]"
        />
      )}

      {/* Layered Mountain / Ocean Silhouettes */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1200 220"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32 w-full"
      >
        {/* Distant Ridge */}
        <path
          d="M0,140 C220,75 410,165 650,95 C880,35 1040,125 1200,85 L1200,220 L0,220 Z"
          fill="rgba(10, 10, 24, 0.45)"
        />
        {/* Mid Ridge */}
        <path
          d="M0,165 C280,120 520,185 820,125 C990,95 1110,150 1200,135 L1200,220 L0,220 Z"
          fill="rgba(8, 8, 18, 0.72)"
        />
        {/* Foreground Silhouette */}
        <path
          d="M0,190 C340,165 690,205 1200,175 L1200,220 L0,220 Z"
          fill="#05050A"
        />
      </svg>

      {/* Foreground Content or Interactive Time Controller */}
      <div className="relative z-10 flex flex-1 flex-col justify-between p-6">
        {children ?? (
          <>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/30 px-3 py-1 font-mono text-[11px] font-medium text-white backdrop-blur-md">
                <Sun className="h-3.5 w-3.5 text-amber-300" />
                Sunrise Horizon · --time: {currentTime.toFixed(2)}
              </span>

              <div className="flex items-center gap-1.5 rounded-full border border-white/20 bg-black/30 p-1 backdrop-blur-md">
                {(["dawn", "noon", "dusk"] as TimePreset[]).map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => {
                      setIsPlaying(false);
                      setCurrentTime(PRESET_TO_TIME[preset]);
                    }}
                    className={cn(
                      "rounded-full px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase transition-colors",
                      Math.abs(currentTime - PRESET_TO_TIME[preset]) < 0.08
                        ? "bg-white text-black"
                        : "text-white/80 hover:text-white"
                    )}
                  >
                    {preset}
                  </button>
                ))}
                <button
                  type="button"
                  aria-label={isPlaying ? "Pause cycle" : "Play cycle"}
                  onClick={() => setIsPlaying((p) => !p)}
                  className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30"
                >
                  {isPlaying ? (
                    <Pause className="h-2.5 w-2.5" />
                  ) : (
                    <Play className="h-2.5 w-2.5" />
                  )}
                </button>
              </div>
            </div>

            <div className="my-auto max-w-md py-6">
              <h3 className="text-2xl font-bold tracking-tight text-white drop-shadow-sm sm:text-3xl">
                Dynamic Atmospheric Sky
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-white/80 sm:text-sm">
                Layered zenith, horizon, and solar radial gradients interpolated
                smoothly along a solar arc.
              </p>
            </div>

            {/* Scrubber Bar */}
            <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-black/35 px-4 py-2.5 backdrop-blur-md">
              <span className="font-mono text-[10px] uppercase text-white/70">
                Solar Arc
              </span>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={currentTime}
                aria-label="Scrub time of day"
                onChange={(e) => {
                  setIsPlaying(false);
                  setCurrentTime(parseFloat(e.target.value));
                }}
                className="h-1.5 flex-1 cursor-pointer accent-white"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default SunriseHorizon;

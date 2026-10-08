"use client";

import React, { useState } from "react";
import { Compass } from "lucide-react";
import { cn } from "@/lib/utils";

export interface GridHorizonProps {
  /** Forward road scroll speed multiplier (1 = default). Default: 1 */
  speed?: number;
  /** Grid line color. Default: "rgba(236, 72, 153, 0.55)" */
  gridColor?: string;
  /** Horizon sun gradient color. Default: "#F97316" */
  sunColor?: string;
  /** Grid cell size in pixels. Default: 44 */
  gridSize?: number;
  /** Display the retro segmented sun on the horizon. Default: true */
  showSun?: boolean;
  /** Optional foreground content */
  children?: React.ReactNode;
  className?: string;
}

export function GridHorizon({
  speed = 1,
  gridColor = "rgba(236, 72, 153, 0.55)",
  sunColor = "#F97316",
  gridSize = 44,
  showSun = true,
  children,
  className,
}: GridHorizonProps) {
  const [theme, setTheme] = useState<"synthwave" | "cyber" | "mono">(
    "synthwave"
  );

  const palettes = {
    synthwave: {
      grid: gridColor,
      sun: sunColor,
      glow: "#EC4899",
    },
    cyber: {
      grid: "rgba(6, 182, 212, 0.55)",
      sun: "#38BDF8",
      glow: "#06B6D4",
    },
    mono: {
      grid: "rgba(255, 255, 255, 0.35)",
      sun: "#FFFFFF",
      glow: "#A3A3A3",
    },
  };

  const active = palettes[theme];
  const duration = Math.max(0.4, 1.8 / Math.max(0.2, speed));

  return (
    <div
      data-fullscreen-scroll
      className={cn(
        "relative flex min-h-[360px] w-full flex-col justify-between overflow-hidden rounded-3xl border border-neutral-800 bg-[#06040F] p-6 text-white shadow-sm",
        className
      )}
    >
      <style>{`
        @keyframes bose-grid-scroll {
          0% { background-position: 0px 0px; }
          100% { background-position: 0px ${gridSize}px; }
        }
      `}</style>

      {/* Sky Backdrop & Segmented Synthwave Sun */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[52%] overflow-hidden bg-gradient-to-b from-[#05030D] via-[#130926] to-[#2E1045]"
      >
        {showSun && (
          <div
            style={{
              background: `linear-gradient(180deg, #FDE047 0%, ${active.sun} 55%, ${active.glow} 100%)`,
              boxShadow: `0 0 60px ${active.glow}`,
              WebkitMaskImage:
                "repeating-linear-gradient(to bottom, black 0px, black 8px, transparent 8px, transparent 11px)",
              maskImage:
                "repeating-linear-gradient(to bottom, black 0px, black 8px, transparent 8px, transparent 11px)",
            }}
            className="absolute bottom-[-28px] left-1/2 h-36 w-36 -translate-x-1/2 rounded-full"
          />
        )}
      </div>

      {/* Glowing Horizon Divider Line */}
      <div
        aria-hidden="true"
        style={{
          background: active.glow,
          boxShadow: `0 0 24px 3px ${active.glow}`,
        }}
        className="pointer-events-none absolute inset-x-0 top-[52%] z-10 h-[2px]"
      />

      {/* 3D Perspective Infinite Scrolling Grid Plane */}
      <div
        aria-hidden="true"
        style={{ perspective: "320px" }}
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[48%] overflow-hidden bg-[#06030E]"
      >
        <div
          style={{
            transform: "rotateX(64deg) scale(2.2)",
            transformOrigin: "top center",
            backgroundImage: `linear-gradient(to right, ${active.grid} 1px, transparent 1px), linear-gradient(to bottom, ${active.grid} 1px, transparent 1px)`,
            backgroundSize: `${gridSize}px ${gridSize}px`,
            animation: `bose-grid-scroll ${duration}s linear infinite`,
          }}
          className="h-[220%] w-full"
        />

        {/* Distance Fog Fade at Horizon */}
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#130926] to-transparent" />
      </div>

      {/* Foreground Content */}
      <div className="relative z-20 flex flex-1 flex-col justify-between">
        {children ?? (
          <>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/40 px-3 py-1 font-mono text-[11px] font-medium text-white backdrop-blur-md">
                <Compass className="h-3.5 w-3.5 text-pink-400" />
                Grid Horizon · rotateX(64deg)
              </span>

              <div className="flex items-center gap-1 rounded-full border border-white/15 bg-black/40 p-1 backdrop-blur-md">
                {(["synthwave", "cyber", "mono"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTheme(t)}
                    className={cn(
                      "rounded-full px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase transition-colors",
                      theme === t
                        ? "bg-white text-black"
                        : "text-white/75 hover:text-white"
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="my-auto max-w-md py-6">
              <h3 className="text-2xl font-bold tracking-tight text-white drop-shadow-md sm:text-3xl">
                Perspective Grid Horizon
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-white/85 drop-shadow-xs sm:text-sm">
                Pure CSS <code className="font-mono">perspective(320px)</code>{" "}
                plane tilted at 64° with an endless{" "}
                <code className="font-mono">background-position-y</code> loop
                and a scanline horizon sun.
              </p>
            </div>

            <div className="font-mono text-[11px] text-white/60">
              Pure CSS 3D Transform · Endless Loop · 0 JS Per-Frame Cost
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default GridHorizon;

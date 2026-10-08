"use client";

import React, { useState } from "react";
import { Cloud } from "lucide-react";
import { cn } from "@/lib/utils";

export type SkyVariant = "day" | "sunset" | "night";

export interface CloudsDriftProps {
  /** Drift speed multiplier (1 = default). Default: 1 */
  speed?: number;
  /** Cloud layer opacity multiplier (0.2 to 1). Default: 0.85 */
  opacity?: number;
  /** Sky color theme. Default: "day" */
  variant?: SkyVariant;
  /** Optional foreground content */
  children?: React.ReactNode;
  className?: string;
}

const SKY_THEMES: Record<
  SkyVariant,
  { bg: string; cloudFill: string; label: string }
> = {
  day: {
    bg: "bg-gradient-to-b from-sky-600 via-sky-400 to-sky-200",
    cloudFill: "rgba(255, 255, 255, 0.82)",
    label: "Daylight Cumulus",
  },
  sunset: {
    bg: "bg-gradient-to-b from-indigo-950 via-rose-700 to-amber-300",
    cloudFill: "rgba(254, 215, 170, 0.72)",
    label: "Golden Hour",
  },
  night: {
    bg: "bg-gradient-to-b from-[#040711] via-[#0B1528] to-[#1E293B]",
    cloudFill: "rgba(148, 163, 184, 0.35)",
    label: "Moonlit Stratus",
  },
};

export function CloudsDrift({
  speed = 1,
  opacity = 0.85,
  variant = "day",
  children,
  className,
}: CloudsDriftProps) {
  const [activeVariant, setActiveVariant] = useState<SkyVariant>(variant);
  const theme = SKY_THEMES[activeVariant] ?? SKY_THEMES.day;

  const baseDuration = Math.max(8, 36 / Math.max(0.2, speed));

  const layers = [
    {
      id: "far",
      duration: baseDuration * 1.6,
      top: "12%",
      scale: 0.75,
      blur: "blur-xl",
      alpha: 0.45 * opacity,
    },
    {
      id: "mid",
      duration: baseDuration * 1.15,
      top: "36%",
      scale: 1,
      blur: "blur-lg",
      alpha: 0.7 * opacity,
    },
    {
      id: "near",
      duration: baseDuration * 0.75,
      top: "58%",
      scale: 1.25,
      blur: "blur-md",
      alpha: 0.9 * opacity,
    },
  ];

  return (
    <div
      data-fullscreen-scroll
      className={cn(
        "relative flex min-h-[360px] w-full flex-col justify-between overflow-hidden rounded-3xl border border-neutral-200 p-6 text-white shadow-sm dark:border-neutral-800",
        theme.bg,
        className
      )}
    >
      <style>{`
        @keyframes bose-cloud-loop {
          0% { transform: translate3d(0%, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
      `}</style>

      {/* Seamless Looping Parallax Cloud Layers */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        {layers.map((layer) => (
          <div
            key={layer.id}
            style={{
              top: layer.top,
              opacity: layer.alpha,
              animation: `bose-cloud-loop ${layer.duration}s linear infinite`,
            }}
            className={cn("absolute left-0 flex w-[200%]", layer.blur)}
          >
            {[0, 1].map((dup) => (
              <div
                key={dup}
                className="relative flex h-36 w-1/2 items-center justify-around"
              >
                {/* Cloud Formation A */}
                <div
                  style={{
                    background: theme.cloudFill,
                    transform: `scale(${layer.scale})`,
                  }}
                  className="h-16 w-48 rounded-full shadow-2xl"
                />
                {/* Cloud Formation B */}
                <div
                  style={{
                    background: theme.cloudFill,
                    transform: `scale(${layer.scale * 1.15})`,
                  }}
                  className="-mt-8 h-20 w-64 rounded-full shadow-2xl"
                />
                {/* Cloud Formation C */}
                <div
                  style={{
                    background: theme.cloudFill,
                    transform: `scale(${layer.scale * 0.9})`,
                  }}
                  className="mt-6 h-14 w-44 rounded-full shadow-2xl"
                />
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 flex flex-1 flex-col justify-between">
        {children ?? (
          <>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-black/25 px-3 py-1 font-mono text-[11px] font-medium text-white backdrop-blur-md">
                <Cloud className="h-3.5 w-3.5" />
                Clouds Drift · {theme.label}
              </span>

              <div className="flex items-center gap-1 rounded-full border border-white/25 bg-black/25 p-1 backdrop-blur-md">
                {(["day", "sunset", "night"] as SkyVariant[]).map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setActiveVariant(v)}
                    className={cn(
                      "rounded-full px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase transition-colors",
                      activeVariant === v
                        ? "bg-white text-black"
                        : "text-white/80 hover:text-white"
                    )}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            <div className="my-auto max-w-md py-8">
              <h3 className="text-2xl font-bold tracking-tight text-white drop-shadow-sm sm:text-3xl">
                Parallax Cloud Layers
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-white/90 drop-shadow-xs sm:text-sm">
                Three altitude layers of soft diffused cloud ellipses moving at
                independent <code className="font-mono">translate3d</code>{" "}
                velocities for seamless infinite drift.
              </p>
            </div>

            <div className="font-mono text-[11px] text-white/75">
              Pure CSS · 3 Parallax Layers · Seamless Loop
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default CloudsDrift;

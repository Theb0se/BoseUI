"use client";

import React, { useState, useEffect } from "react";
import { Cloud, Sun, Sunset, Moon } from "lucide-react";
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

type LayerTier = "far" | "mid" | "near";

const SKY_THEMES: Record<
  SkyVariant,
  {
    bg: string;
    label: string;
    gradientId: string;
    topStop: string;
    midStop: string;
    botStop: string;
    shadowFilter: string;
    icon: React.ComponentType<{ className?: string }>;
  }
> = {
  day: {
    bg: "bg-gradient-to-b from-sky-600 via-sky-400 to-sky-200",
    label: "Daylight Cumulus",
    gradientId: "bose-cloud-grad-day",
    topStop: "#FFFFFF",
    midStop: "rgba(255, 255, 255, 0.95)",
    botStop: "rgba(196, 224, 246, 0.82)",
    shadowFilter: "drop-shadow(0 10px 24px rgba(12, 74, 110, 0.14))",
    icon: Sun,
  },
  sunset: {
    bg: "bg-gradient-to-b from-indigo-950 via-purple-900 to-amber-500",
    label: "Golden Hour",
    gradientId: "bose-cloud-grad-sunset",
    topStop: "#FEF08A",
    midStop: "#FDBA74",
    botStop: "rgba(244, 63, 94, 0.85)",
    shadowFilter: "drop-shadow(0 10px 24px rgba(136, 19, 55, 0.22))",
    icon: Sunset,
  },
  night: {
    bg: "bg-gradient-to-b from-[#030712] via-[#0B1528] to-[#1E293B]",
    label: "Moonlit Stratus",
    gradientId: "bose-cloud-grad-night",
    topStop: "#F1F5F9",
    midStop: "#94A3B8",
    botStop: "rgba(51, 65, 85, 0.75)",
    shadowFilter: "drop-shadow(0 10px 24px rgba(2, 6, 23, 0.38))",
    icon: Moon,
  },
};

/**
 * Majestic 5-lobe Cumulus Tower with dual-pass vapor blur and sunlit crests.
 */
function CumulusTower({
  gradientId,
  layerTier,
  className,
  style,
}: {
  gradientId: string;
  layerTier: LayerTier;
  className?: string;
  style?: React.CSSProperties;
}) {
  const veilFilter = `url(#bose-cloud-veil-${layerTier})`;
  const coreFilter = `url(#bose-cloud-core-${layerTier})`;

  return (
    <svg
      viewBox="0 0 360 160"
      className={cn("overflow-visible", className)}
      style={style}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Pass 1: Diffused Outer Vapor Veil */}
      <g filter={veilFilter} opacity={0.55}>
        <ellipse cx="180" cy="115" rx="155" ry="32" fill={`url(#${gradientId})`} />
        <circle cx="60" cy="108" r="32" fill={`url(#${gradientId})`} />
        <circle cx="110" cy="92" r="44" fill={`url(#${gradientId})`} />
        <circle cx="175" cy="65" r="56" fill={`url(#${gradientId})`} />
        <circle cx="245" cy="78" r="50" fill={`url(#${gradientId})`} />
        <circle cx="305" cy="100" r="36" fill={`url(#${gradientId})`} />
      </g>

      {/* Pass 2: Volumetric Softened Core with Sunlit Crests */}
      <g filter={coreFilter} opacity={0.92}>
        <ellipse cx="180" cy="115" rx="138" ry="26" fill={`url(#${gradientId})`} />
        <circle cx="68" cy="110" r="26" fill={`url(#${gradientId})`} />
        <circle cx="115" cy="94" r="36" fill={`url(#${gradientId})`} />
        <circle cx="175" cy="70" r="48" fill={`url(#${gradientId})`} />
        <circle cx="240" cy="82" r="42" fill={`url(#${gradientId})`} />
        <circle cx="298" cy="102" r="30" fill={`url(#${gradientId})`} />

        {/* Sunlit top crest highlights */}
        <circle cx="175" cy="64" r="40" fill="#FFFFFF" opacity={0.4} />
        <circle cx="240" cy="76" r="34" fill="#FFFFFF" opacity={0.3} />
        <circle cx="115" cy="88" r="28" fill="#FFFFFF" opacity={0.3} />
      </g>
    </svg>
  );
}

/**
 * Sprawling multi-dome cloud bank with undulating billows.
 */
function StratusSprawl({
  gradientId,
  layerTier,
  className,
  style,
}: {
  gradientId: string;
  layerTier: LayerTier;
  className?: string;
  style?: React.CSSProperties;
}) {
  const veilFilter = `url(#bose-cloud-veil-${layerTier})`;
  const coreFilter = `url(#bose-cloud-core-${layerTier})`;

  return (
    <svg
      viewBox="0 0 480 150"
      className={cn("overflow-visible", className)}
      style={style}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Pass 1: Diffused Outer Vapor Veil */}
      <g filter={veilFilter} opacity={0.52}>
        <ellipse cx="240" cy="105" rx="215" ry="28" fill={`url(#${gradientId})`} />
        <circle cx="65" cy="100" r="32" fill={`url(#${gradientId})`} />
        <circle cx="120" cy="86" r="40" fill={`url(#${gradientId})`} />
        <circle cx="185" cy="74" r="46" fill={`url(#${gradientId})`} />
        <circle cx="255" cy="62" r="52" fill={`url(#${gradientId})`} />
        <circle cx="325" cy="72" r="48" fill={`url(#${gradientId})`} />
        <circle cx="390" cy="85" r="40" fill={`url(#${gradientId})`} />
        <circle cx="435" cy="98" r="30" fill={`url(#${gradientId})`} />
      </g>

      {/* Pass 2: Volumetric Softened Core */}
      <g filter={coreFilter} opacity={0.92}>
        <ellipse cx="240" cy="105" rx="195" ry="22" fill={`url(#${gradientId})`} />
        <circle cx="75" cy="102" r="26" fill={`url(#${gradientId})`} />
        <circle cx="125" cy="89" r="34" fill={`url(#${gradientId})`} />
        <circle cx="185" cy="78" r="40" fill={`url(#${gradientId})`} />
        <circle cx="255" cy="68" r="46" fill={`url(#${gradientId})`} />
        <circle cx="325" cy="77" r="42" fill={`url(#${gradientId})`} />
        <circle cx="388" cy="89" r="34" fill={`url(#${gradientId})`} />
        <circle cx="430" cy="100" r="24" fill={`url(#${gradientId})`} />

        {/* Sunlit highlights */}
        <circle cx="255" cy="64" r="38" fill="#FFFFFF" opacity={0.38} />
        <circle cx="185" cy="74" r="32" fill="#FFFFFF" opacity={0.3} />
        <circle cx="325" cy="73" r="34" fill="#FFFFFF" opacity={0.3} />
      </g>
    </svg>
  );
}

/**
 * Compact airy cloudlet drifting freely.
 */
function CumulusCompact({
  gradientId,
  layerTier,
  className,
  style,
}: {
  gradientId: string;
  layerTier: LayerTier;
  className?: string;
  style?: React.CSSProperties;
}) {
  const veilFilter = `url(#bose-cloud-veil-${layerTier})`;
  const coreFilter = `url(#bose-cloud-core-${layerTier})`;

  return (
    <svg
      viewBox="0 0 280 130"
      className={cn("overflow-visible", className)}
      style={style}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Pass 1: Diffused Outer Vapor Veil */}
      <g filter={veilFilter} opacity={0.5}>
        <ellipse cx="140" cy="90" rx="118" ry="24" fill={`url(#${gradientId})`} />
        <circle cx="55" cy="88" r="28" fill={`url(#${gradientId})`} />
        <circle cx="105" cy="72" r="38" fill={`url(#${gradientId})`} />
        <circle cx="165" cy="60" r="44" fill={`url(#${gradientId})`} />
        <circle cx="225" cy="78" r="34" fill={`url(#${gradientId})`} />
      </g>

      {/* Pass 2: Volumetric Softened Core */}
      <g filter={coreFilter} opacity={0.9}>
        <ellipse cx="140" cy="90" rx="100" ry="20" fill={`url(#${gradientId})`} />
        <circle cx="62" cy="89" r="22" fill={`url(#${gradientId})`} />
        <circle cx="108" cy="75" r="32" fill={`url(#${gradientId})`} />
        <circle cx="165" cy="65" r="38" fill={`url(#${gradientId})`} />
        <circle cx="220" cy="80" r="28" fill={`url(#${gradientId})`} />

        {/* Highlights */}
        <circle cx="165" cy="60" r="30" fill="#FFFFFF" opacity={0.35} />
        <circle cx="108" cy="70" r="24" fill="#FFFFFF" opacity={0.28} />
      </g>
    </svg>
  );
}

export function CloudsDrift({
  speed = 1,
  opacity = 0.85,
  variant = "day",
  children,
  className,
}: CloudsDriftProps) {
  const [activeVariant, setActiveVariant] = useState<SkyVariant>(variant);

  useEffect(() => {
    setActiveVariant(variant);
  }, [variant]);

  const theme = SKY_THEMES[activeVariant] ?? SKY_THEMES.day;
  const ActiveIcon = theme.icon;

  const baseDuration = Math.max(8, 36 / Math.max(0.2, speed));

  const layers: {
    id: string;
    tier: LayerTier;
    duration: number;
    top: string;
    scale: number;
    alpha: number;
    zIndex: number;
  }[] = [
    {
      id: "far",
      tier: "far",
      duration: baseDuration * 1.85,
      top: "6%",
      scale: 0.75,
      alpha: 0.58 * opacity,
      zIndex: 1,
    },
    {
      id: "mid",
      tier: "mid",
      duration: baseDuration * 1.25,
      top: "26%",
      scale: 0.98,
      alpha: 0.82 * opacity,
      zIndex: 2,
    },
    {
      id: "near",
      tier: "near",
      duration: baseDuration * 0.82,
      top: "46%",
      scale: 1.25,
      alpha: 0.98 * opacity,
      zIndex: 3,
    },
  ];

  return (
    <div
      data-fullscreen-scroll
      className={cn(
        "relative flex min-h-[380px] w-full flex-col justify-between overflow-hidden rounded-3xl border border-neutral-200 p-6 text-white shadow-sm transition-colors duration-700 dark:border-neutral-800",
        theme.bg,
        className
      )}
    >
      <style>{`
        @keyframes bose-cloud-drift-loop {
          0% { transform: translate3d(0%, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .bose-cloud-drift-layer {
            animation-play-state: paused !important;
          }
        }
      `}</style>

      {/* SVG Definitions: Sky Gradients & Multi-Tier Gaussian Blur Filters */}
      <svg className="absolute h-0 w-0 pointer-events-none" aria-hidden="true">
        <defs>
          <linearGradient
            id={theme.gradientId}
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop offset="0%" stopColor={theme.topStop} />
            <stop offset="45%" stopColor={theme.midStop} />
            <stop offset="100%" stopColor={theme.botStop} />
          </linearGradient>

          {/* Far layer: dreamy, atmospheric diffusion */}
          <filter id="bose-cloud-veil-far" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="12" />
          </filter>
          <filter id="bose-cloud-core-far" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="6.5" />
          </filter>

          {/* Mid layer: balanced soft volume */}
          <filter id="bose-cloud-veil-mid" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="8" />
          </filter>
          <filter id="bose-cloud-core-mid" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="4.5" />
          </filter>

          {/* Near layer: billowy definition with vapor perimeter */}
          <filter id="bose-cloud-veil-near" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
          <filter id="bose-cloud-core-near" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="2.8" />
          </filter>
        </defs>
      </svg>

      {/* Atmospheric Celestial Light (Sun / Sunset Halo / Moon) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        {activeVariant === "day" && (
          <div className="absolute -top-12 right-12 h-64 w-64 rounded-full bg-amber-100/35 blur-3xl" />
        )}
        {activeVariant === "sunset" && (
          <div className="absolute bottom-6 left-1/3 h-56 w-56 rounded-full bg-amber-300/40 blur-3xl" />
        )}
        {activeVariant === "night" && (
          <>
            <div className="absolute top-10 right-16 h-36 w-36 rounded-full bg-sky-200/20 blur-2xl" />
            <div className="absolute top-12 right-20 h-10 w-10 rounded-full border border-sky-100/30 bg-sky-100/40 shadow-[0_0_24px_rgba(255,255,255,0.4)]" />
            {/* Soft celestial stars */}
            <div className="absolute top-8 left-1/6 h-1 w-1 rounded-full bg-white/70 shadow-[0_0_4px_#fff]" />
            <div className="absolute top-14 left-1/3 h-1.5 w-1.5 rounded-full bg-white/60 shadow-[0_0_4px_#fff]" />
            <div className="absolute top-20 left-2/3 h-1 w-1 rounded-full bg-white/80 shadow-[0_0_4px_#fff]" />
            <div className="absolute top-6 right-1/3 h-1 w-1 rounded-full bg-white/75 shadow-[0_0_4px_#fff]" />
          </>
        )}
      </div>

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
              zIndex: layer.zIndex,
              filter: theme.shadowFilter,
              animation: `bose-cloud-drift-loop ${layer.duration}s linear infinite`,
            }}
            className="bose-cloud-drift-layer absolute left-0 flex w-[200%] will-change-transform"
          >
            {[0, 1].map((dup) => (
              <div
                key={dup}
                className="relative flex h-40 w-1/2 items-center justify-around px-4"
              >
                {/* Cloud Formation 1: Majestic Cumulus Tower */}
                <CumulusTower
                  gradientId={theme.gradientId}
                  layerTier={layer.tier}
                  style={{
                    transform: `scale(${layer.scale})`,
                  }}
                  className="h-28 w-auto shrink-0 transition-transform duration-300"
                />

                {/* Cloud Formation 2: Sprawling Low Cloud Bank */}
                <StratusSprawl
                  gradientId={theme.gradientId}
                  layerTier={layer.tier}
                  style={{
                    transform: `scale(${layer.scale * 1.1}) translateY(-10px)`,
                  }}
                  className="h-32 w-auto shrink-0 transition-transform duration-300"
                />

                {/* Cloud Formation 3: Compact Drifting Cloudlet */}
                <CumulusCompact
                  gradientId={theme.gradientId}
                  layerTier={layer.tier}
                  style={{
                    transform: `scale(${layer.scale * 0.9}) translateY(12px)`,
                  }}
                  className="h-24 w-auto shrink-0 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Atmospheric Horizon Softness / Vapor Haze */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-white/20 via-white/5 to-transparent"
      />

      {/* Foreground Content */}
      <div className="relative z-10 flex flex-1 flex-col justify-between">
        {children ?? (
          <>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-black/25 px-3 py-1 font-mono text-[11px] font-medium text-white backdrop-blur-md shadow-2xs">
                <ActiveIcon className="h-3.5 w-3.5" />
                <span>Clouds Drift · {theme.label}</span>
              </span>

              <div className="flex items-center gap-1 rounded-full border border-white/25 bg-black/25 p-1 backdrop-blur-md shadow-2xs">
                {(["day", "sunset", "night"] as SkyVariant[]).map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setActiveVariant(v)}
                    className={cn(
                      "rounded-full px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider transition-all",
                      activeVariant === v
                        ? "bg-white text-neutral-950 shadow-xs"
                        : "text-white/80 hover:text-white hover:bg-white/10"
                    )}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            <div className="my-auto max-w-md py-8">
              <h3 className="text-2xl font-bold tracking-tight text-white drop-shadow-md sm:text-3xl">
                Parallax Cloud Layers
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-white/95 drop-shadow-sm sm:text-sm">
                Three altitude layers of soft volumetric cumulus formations
                moving at independent <code className="font-mono bg-black/20 px-1 py-0.5 rounded">translate3d</code>{" "}
                velocities for seamless infinite drift.
              </p>
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-white/80">
              <span>Pure CSS · 3 Parallax Layers · Seamless Loop</span>
              <span className="hidden sm:inline">Speed: {speed}x · Opacity: {Math.round(opacity * 100)}%</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default CloudsDrift;

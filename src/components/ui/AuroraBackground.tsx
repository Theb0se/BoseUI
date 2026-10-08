"use client";

import React, { useState } from "react";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AuroraBackgroundProps {
  /** Array of 3 to 5 aurora blob colors */
  colors?: string[];
  /** Animation speed multiplier (1 = default). Default: 1 */
  speed?: number;
  /** Opacity/glow intensity from 0.2 to 1. Default: 0.75 */
  intensity?: number;
  /** Optional foreground content */
  children?: React.ReactNode;
  className?: string;
}

const DEFAULT_COLORS = [
  "#10B981", // Emerald green
  "#06B6D4", // Teal / Cyan
  "#8B5CF6", // Violet
  "#3B82F6", // Royal blue
];

const PALETTE_PRESETS: Record<string, string[]> = {
  Borealis: ["#10B981", "#06B6D4", "#8B5CF6", "#3B82F6"],
  Sonoma: ["#EC4899", "#8B5CF6", "#06B6D4", "#F59E0B"],
  Polar: ["#2DD4BF", "#38BDF8", "#818CF8", "#C084FC"],
};

export function AuroraBackground({
  colors = DEFAULT_COLORS,
  speed = 1,
  intensity = 0.75,
  children,
  className,
}: AuroraBackgroundProps) {
  const [activePreset, setActivePreset] = useState<string>("Borealis");
  const [customColors, setCustomColors] = useState<string[]>(colors);

  const activeColors =
     customColors.length >= 3 ? customColors : DEFAULT_COLORS;
  const baseDuration = Math.max(4, 18 / Math.max(0.2, speed));

  return (
    <div
      data-fullscreen-scroll
      className={cn(
        "relative flex min-h-[360px] w-full flex-col justify-between overflow-hidden rounded-3xl border border-neutral-800 bg-[#04060E] p-6 text-white shadow-sm",
        className
      )}
    >
      <style>{`
        @keyframes bose-aurora-1 {
          0%, 100% { transform: translate(0%, 0%) scale(1) rotate(0deg); }
          33% { transform: translate(18%, -14%) scale(1.18) rotate(12deg); }
          66% { transform: translate(-12%, 12%) scale(0.92) rotate(-8deg); }
        }
        @keyframes bose-aurora-2 {
          0%, 100% { transform: translate(0%, 0%) scale(1.05) rotate(0deg); }
          50% { transform: translate(-22%, 16%) scale(1.22) rotate(-15deg); }
        }
        @keyframes bose-aurora-3 {
          0%, 100% { transform: translate(0%, 0%) scale(0.95); }
          40% { transform: translate(15%, 20%) scale(1.15); }
          80% { transform: translate(-16%, -12%) scale(1.05); }
        }
      `}</style>

      {/* Blurred Screen-Blended Aurora Blobs */}
      <div
        aria-hidden="true"
        style={{ opacity: Math.max(0.15, Math.min(1, intensity)) }}
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        {activeColors.map((color, idx) => {
          const animName = `bose-aurora-${(idx % 3) + 1}`;
          const duration = baseDuration + idx * 3.5;
          const positions = [
            "left-[-10%] top-[-15%] h-[280px] w-[420px]",
            "right-[-10%] top-[5%] h-[300px] w-[440px]",
            "bottom-[-20%] left-[15%] h-[320px] w-[480px]",
            "bottom-[5%] right-[10%] h-[260px] w-[380px]",
          ];

          return (
            <div
              key={idx}
              style={{
                background: `radial-gradient(ellipse at center, ${color} 0%, transparent 70%)`,
                filter: "blur(60px)",
                mixBlendMode: "screen",
                animation: `${animName} ${duration}s ease-in-out infinite`,
                animationDelay: `${idx * -2.5}s`,
              }}
              className={cn(
                "absolute rounded-full",
                positions[idx % positions.length]
              )}
            />
          );
        })}
      </div>

      {/* Subtle Vignette */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#04060E] via-transparent to-[#04060E]/60"
      />

      {/* Foreground Content */}
      <div className="relative z-10 flex flex-1 flex-col justify-between">
        {children ?? (
          <>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 font-mono text-[11px] font-medium text-white backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5 text-emerald-300" />
                Aurora · Screen Blend
              </span>

              <div className="flex items-center gap-1 rounded-full border border-white/15 bg-black/40 p-1 backdrop-blur-md">
                {Object.keys(PALETTE_PRESETS).map((name) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => {
                      setActivePreset(name);
                      setCustomColors(PALETTE_PRESETS[name]);
                    }}
                    className={cn(
                      "rounded-full px-2.5 py-0.5 font-mono text-[10px] font-semibold transition-colors",
                      activePreset === name
                        ? "bg-white text-black"
                        : "text-white/75 hover:text-white"
                    )}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>

            <div className="my-auto max-w-md py-8">
              <h3 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Northern Lights Diffusion
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-white/75 sm:text-sm">
                Multi-layered radial blobs with 60px Gaussian blur and{" "}
                <code className="font-mono text-white">mix-blend-mode: screen</code>{" "}
                drifting on offset harmonic keyframe loops.
              </p>
            </div>

            {/* Color Swatches */}
            <div className="flex items-center gap-2">
              {activeColors.map((col, i) => (
                <span
                  key={i}
                  style={{ backgroundColor: col }}
                  className="h-4 w-4 rounded-full border border-white/30 shadow-sm"
                  title={col}
                />
              ))}
              <span className="ml-1 font-mono text-[11px] text-white/60">
                {activeColors.join(" · ")}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AuroraBackground;

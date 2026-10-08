"use client";

import React, { useState } from "react";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MeshGradientProps {
  /** Array of 4 to 5 hex colors blended across the mesh */
  colors?: string[];
  /** Animation speed multiplier (1 = default). Default: 1 */
  speed?: number;
  /** Blur radius in pixels. Default: 70 */
  blur?: number;
  /** Overlay subtle noise grain. Default: true */
  grain?: boolean;
  /** Optional foreground content */
  children?: React.ReactNode;
  className?: string;
}

const MESH_PRESETS: Record<string, string[]> = {
  "Apple Music": ["#FF2D55", "#5856D6", "#FF9500", "#AF52DE", "#00C7BE"],
  Sequoia: ["#1E3A8A", "#0EA5E9", "#F97316", "#FACC15", "#4338CA"],
  Obsidian: ["#312E81", "#4C1D95", "#0F766E", "#1E40AF", "#701A75"],
};

export function MeshGradient({
  colors = MESH_PRESETS["Apple Music"],
  speed = 1,
  blur = 70,
  grain = true,
  children,
  className,
}: MeshGradientProps) {
  const [presetName, setPresetName] = useState<string>("Apple Music");
  const [palette, setPalette] = useState<string[]>(colors);

  const c = palette.length >= 4 ? palette : MESH_PRESETS["Apple Music"];
  const dur = Math.max(5, 16 / Math.max(0.2, speed));

  return (
    <div
      data-fullscreen-scroll
      className={cn(
        "relative flex min-h-[360px] w-full flex-col justify-between overflow-hidden rounded-3xl border border-neutral-800 bg-[#080711] p-6 text-white shadow-sm",
        className
      )}
    >
      <style>{`
        @keyframes bose-mesh-orbit-1 {
          0%, 100% { transform: translate(0%, 0%) scale(1); }
          50% { transform: translate(28%, 22%) scale(1.25); }
        }
        @keyframes bose-mesh-orbit-2 {
          0%, 100% { transform: translate(0%, 0%) scale(1.1); }
          50% { transform: translate(-26%, 24%) scale(0.9); }
        }
        @keyframes bose-mesh-orbit-3 {
          0%, 100% { transform: translate(0%, 0%) scale(0.95); }
          50% { transform: translate(24%, -26%) scale(1.2); }
        }
        @keyframes bose-mesh-orbit-4 {
          0%, 100% { transform: translate(0%, 0%) scale(1.05); }
          50% { transform: translate(-22%, -20%) scale(1.15); }
        }
      `}</style>

      {/* Multi-Point Blurred Mesh Canvas */}
      <div
        aria-hidden="true"
        style={{ filter: `blur(${blur}px) saturate(140%)` }}
        className="pointer-events-none absolute -inset-12 overflow-hidden opacity-90"
      >
        <div
          style={{
            background: c[0],
            animation: `bose-mesh-orbit-1 ${dur}s ease-in-out infinite`,
          }}
          className="absolute left-[5%] top-[5%] h-72 w-72 rounded-full"
        />
        <div
          style={{
            background: c[1],
            animation: `bose-mesh-orbit-2 ${dur * 1.2}s ease-in-out infinite`,
          }}
          className="absolute right-[8%] top-[10%] h-80 w-80 rounded-full"
        />
        <div
          style={{
            background: c[2],
            animation: `bose-mesh-orbit-3 ${dur * 0.9}s ease-in-out infinite`,
          }}
          className="absolute bottom-[5%] left-[15%] h-72 w-72 rounded-full"
        />
        <div
          style={{
            background: c[3],
            animation: `bose-mesh-orbit-4 ${dur * 1.35}s ease-in-out infinite`,
          }}
          className="absolute bottom-[8%] right-[12%] h-72 w-72 rounded-full"
        />
        {c[4] && (
          <div
            style={{
              background: c[4],
              animation: `bose-mesh-orbit-1 ${dur * 1.1}s ease-in-out infinite reverse`,
            }}
            className="absolute left-1/3 top-1/3 h-64 w-64 rounded-full"
          />
        )}
      </div>

      {/* Subtle Film Grain */}
      {grain && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.15] mix-blend-overlay [background-image:radial-gradient(rgba(255,255,255,0.7)_1px,transparent_0)] [background-size:3px_3px]"
        />
      )}

      {/* Foreground Content */}
      <div className="relative z-10 flex flex-1 flex-col justify-between">
        {children ?? (
          <>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/30 px-3 py-1 font-mono text-[11px] font-medium text-white backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5" />
                Mesh Gradient · {presetName}
              </span>

              <div className="flex items-center gap-1 rounded-full border border-white/20 bg-black/30 p-1 backdrop-blur-md">
                {Object.keys(MESH_PRESETS).map((name) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => {
                      setPresetName(name);
                      setPalette(MESH_PRESETS[name]);
                    }}
                    className={cn(
                      "rounded-full px-2.5 py-0.5 font-mono text-[10px] font-semibold transition-colors",
                      presetName === name
                        ? "bg-white text-black"
                        : "text-white/80 hover:text-white"
                    )}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>

            <div className="my-auto max-w-md py-8">
              <h3 className="text-2xl font-bold tracking-tight text-white drop-shadow-sm sm:text-3xl">
                Fluid Multi-Point Mesh
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-white/85 sm:text-sm">
                Five color control points orbiting smoothly on independent CSS
                trajectories and blended with a {blur}px Gaussian diffusion
                filter.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {c.map((hex, i) => (
                <span
                  key={i}
                  style={{ backgroundColor: hex }}
                  className="h-4 w-4 rounded-full border border-white/40 shadow-xs"
                />
              ))}
              <span className="ml-1 font-mono text-[11px] text-white/75">
                5 Control Points · {blur}px Blur
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default MeshGradient;

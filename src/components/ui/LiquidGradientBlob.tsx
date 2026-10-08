"use client";

import React, { useId, useState } from "react";
import { motion } from "framer-motion";
import { Droplets } from "lucide-react";
import { cn } from "@/lib/utils";

export interface LiquidGradientBlobProps {
  /** Array of blob fill colors. Default: ["#8B5CF6", "#EC4899", "#06B6D4", "#3B82F6"] */
  colors?: string[];
  /** Animation speed multiplier (1 = default). Default: 1 */
  speed?: number;
  /** SVG feGaussianBlur standard deviation for the gooey merge effect. Default: 22 */
  gooeyIntensity?: number;
  /** Optional foreground content */
  children?: React.ReactNode;
  className?: string;
}

const DEFAULT_BLOB_COLORS = ["#8B5CF6", "#EC4899", "#06B6D4", "#3B82F6"];

export function LiquidGradientBlob({
  colors = DEFAULT_BLOB_COLORS,
  speed = 1,
  gooeyIntensity = 22,
  children,
  className,
}: LiquidGradientBlobProps) {
  const filterId = useId().replace(/:/g, "");
  const [pointer, setPointer] = useState({ x: 50, y: 50 });

  const dur = Math.max(4, 12 / Math.max(0.2, speed));
  const c = colors.length >= 3 ? colors : DEFAULT_BLOB_COLORS;

  return (
    <div
      data-fullscreen-scroll
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setPointer({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100,
        });
      }}
      className={cn(
        "relative flex min-h-[360px] w-full flex-col justify-between overflow-hidden rounded-3xl border border-neutral-800 bg-[#06060E] p-6 text-white shadow-sm",
        className
      )}
    >
      {/* Hidden SVG Filter Definition: feGaussianBlur + feColorMatrix Gooey Threshold */}
      <svg aria-hidden="true" className="pointer-events-none absolute h-0 w-0">
        <defs>
          <filter id={`gooey-${filterId}`}>
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation={gooeyIntensity}
              result="blur"
            />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -10"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>

      {/* Gooey Filtered Metaball Stage */}
      <div
        aria-hidden="true"
        style={{ filter: `url(#gooey-${filterId})` }}
        className="pointer-events-none absolute inset-0 overflow-hidden opacity-90"
      >
        <motion.div
          animate={{
            x: ["-15%", "25%", "-10%", "-15%"],
            y: ["-10%", "20%", "-15%", "-10%"],
            scale: [1, 1.2, 0.9, 1],
          }}
          transition={{ duration: dur, repeat: Infinity, ease: "easeInOut" }}
          style={{ background: c[0] }}
          className="absolute left-[22%] top-[20%] h-44 w-44 rounded-full"
        />

        <motion.div
          animate={{
            x: ["20%", "-25%", "15%", "20%"],
            y: ["15%", "-20%", "25%", "15%"],
            scale: [1.1, 0.85, 1.15, 1.1],
          }}
          transition={{
            duration: dur * 1.15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ background: c[1] }}
          className="absolute right-[22%] top-[25%] h-48 w-48 rounded-full"
        />

        <motion.div
          animate={{
            x: ["-10%", "20%", "-20%", "-10%"],
            y: ["20%", "-18%", "12%", "20%"],
          }}
          transition={{
            duration: dur * 0.9,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ background: c[2] }}
          className="absolute bottom-[18%] left-[32%] h-40 w-40 rounded-full"
        />

        {/* Cursor-Following Metaball */}
        <motion.div
          animate={{
            left: `${pointer.x}%`,
            top: `${pointer.y}%`,
          }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
          style={{ background: c[3] ?? c[0] }}
          className="absolute h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full"
        />
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 flex flex-1 flex-col justify-between">
        {children ?? (
          <>
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/35 px-3 py-1 font-mono text-[11px] font-medium text-white backdrop-blur-md">
                <Droplets className="h-3.5 w-3.5 text-pink-300" />
                SVG Gooey Filter · feColorMatrix
              </span>
              <span className="font-mono text-[11px] text-white/60">
                Blur: {gooeyIntensity}px
              </span>
            </div>

            <div className="my-auto max-w-md py-8">
              <h3 className="text-2xl font-bold tracking-tight text-white drop-shadow-sm sm:text-3xl">
                Liquid Metaball Fusion
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-white/85 sm:text-sm">
                Powered by an SVG{" "}
                <code className="font-mono">feGaussianBlur</code> +{" "}
                <code className="font-mono">feColorMatrix</code> alpha-threshold
                filter so drifting blobs snap and fuse like liquid lava.
              </p>
            </div>

            <div className="font-mono text-[11px] text-white/60">
              Move your cursor to fuse the interactive metaball with orbiting blobs
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default LiquidGradientBlob;

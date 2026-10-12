"use client";

import React, { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { Sparkles, Palette } from "lucide-react";
import { cn } from "@/lib/utils";

export interface IPadProMockupProps {
  /** Screen orientation. Default: "landscape" */
  orientation?: "landscape" | "portrait";
  /** Aluminum chassis finish. Default: "space-black" */
  color?: "space-black" | "silver";
  /** Enable 3D cursor tilt physics. Default: true */
  enableTilt?: boolean;
  /** Show top iPadOS status bar. Default: true */
  showStatusBar?: boolean;
  /** Show bottom home indicator bar. Default: true */
  showHomeIndicator?: boolean;
  /** Optional screenshot or wallpaper image URL */
  imageSrc?: string;
  /** Content rendered inside the iPad screen */
  children?: React.ReactNode;
  className?: string;
}

const FINISHES: Record<
  "space-black" | "silver",
  { frame: string; bezel: string; highlight: string }
> = {
  "space-black": {
    frame: "border-neutral-800 bg-[#161617]",
    bezel: "ring-1 ring-white/10",
    highlight: "from-white/15 via-transparent to-white/5",
  },
  silver: {
    frame: "border-neutral-300 bg-[#E3E3E8]",
    bezel: "ring-1 ring-neutral-400/30",
    highlight: "from-white/35 via-transparent to-neutral-300/20",
  },
};

export function IPadProMockup({
  orientation = "landscape",
  color = "space-black",
  enableTilt = true,
  showStatusBar = true,
  showHomeIndicator = true,
  imageSrc,
  children,
  className,
}: IPadProMockupProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const isLandscape = orientation === "landscape";

  // 3D Parallax tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateXSpring = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), {
    stiffness: 260,
    damping: 24,
  });
  const rotateYSpring = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), {
    stiffness: 260,
    damping: 24,
  });

  const glareX = useTransform(mouseX, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(mouseY, [-0.5, 0.5], ["0%", "100%"]);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!enableTilt || reduceMotion || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  const theme = FINISHES[color] || FINISHES["space-black"];

  return (
    <div className={cn("perspective-1000 flex items-center justify-center p-4", className)}>
      <motion.div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        layout
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
        style={
          enableTilt && !reduceMotion
            ? {
                rotateX: rotateXSpring,
                rotateY: rotateYSpring,
                transformStyle: "preserve-3d",
              }
            : undefined
        }
        className={cn(
          "relative rounded-[36px] border-[6px] p-[8px] shadow-2xl transition-all select-none",
          isLandscape
            ? "w-full max-w-[560px] aspect-[4/3]"
            : "w-[340px] sm:w-[400px] aspect-[3/4]",
          theme.frame,
          theme.bezel
        )}
      >
        {/* Apple Pencil Magnetic Dock (Top Edge in landscape, Right in portrait) */}
        <div
          className={cn(
            "absolute rounded-full bg-neutral-700/60",
            isLandscape
              ? "left-1/2 -top-[4px] -translate-x-1/2 h-[2px] w-[90px]"
              : "-right-[4px] top-1/2 -translate-y-1/2 w-[2px] h-[90px]"
          )}
        />

        {/* Front Camera Sensor Embedded in Bezel */}
        <div
          className={cn(
            "absolute z-30 flex items-center justify-center pointer-events-none",
            isLandscape
              ? "left-1/2 top-[3px] -translate-x-1/2"
              : "left-1/2 top-[3px] -translate-x-1/2"
          )}
        >
          <div className="h-1.5 w-1.5 rounded-full bg-neutral-900 border border-neutral-800" />
        </div>

        {/* Outer Chamfer Glare Highlight */}
        <div
          className={cn(
            "pointer-events-none absolute inset-0 rounded-[30px] bg-gradient-to-tr",
            theme.highlight
          )}
        />

        {/* Inner Screen Display (Ultra Retina XDR OLED) */}
        <div className="relative h-full w-full overflow-hidden rounded-[26px] bg-black text-white shadow-inner">
          {/* Edge-to-Edge Screen Content / Wallpaper */}
          <div className="absolute inset-0 h-full w-full overflow-hidden">
            {children ? (
              children
            ) : (
              <div className="relative h-full w-full overflow-hidden">
                <img
                  src={
                    imageSrc ||
                    "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1400&auto=format&fit=crop"
                  }
                  alt="iPad Pro Screen"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-black/15 pointer-events-none" />

                {/* Centered Creative Suite Pill (shown when no custom image or children) */}
                {!imageSrc && (
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center p-4 pointer-events-none select-none">
                    <div className="h-11 w-11 rounded-2xl bg-white/10 flex items-center justify-center mb-2 border border-white/10 backdrop-blur-md shadow-lg">
                      <Palette className="h-5 w-5 text-amber-300" />
                    </div>
                    <h4 className="text-base font-semibold text-white tracking-tight drop-shadow-md">
                      iPad Pro M4
                    </h4>
                    <span className="text-[11px] text-white/80 drop-shadow">
                      Ultra Retina Tandem OLED
                    </span>
                    <span className="mt-3 text-[10px] text-white/60">
                      Apple Pencil Pro Connected
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* iPadOS Status Bar */}
          {showStatusBar && (
            <div className="absolute top-0 inset-x-0 z-20 flex h-7 items-center justify-between px-5 text-[11px] text-white/90 font-medium select-none pointer-events-none">
              <span className="font-semibold text-xs drop-shadow-xs">9:41 AM</span>
              <div className="flex items-center gap-2 drop-shadow-xs">
                <span className="text-[10px] font-mono">100%</span>
                <div className="h-2.5 w-5 rounded-[3px] border border-white/80 p-[1px] flex items-center">
                  <div className="h-full w-full bg-white rounded-[1px]" />
                </div>
              </div>
            </div>
          )}

          {/* Bottom Home Indicator Bar */}
          {showHomeIndicator && (
            <div className="absolute bottom-2 inset-x-0 z-20 flex items-center justify-center pointer-events-none">
              <div className="h-1 w-32 rounded-full bg-white/45 backdrop-blur-xs shadow-xs" />
            </div>
          )}

          {/* Specular Light Reflection */}
          {enableTilt && !reduceMotion && (
            <motion.div
              className="pointer-events-none absolute inset-0 z-40 rounded-[26px] opacity-35 mix-blend-overlay"
              style={{
                background:
                  "linear-gradient(125deg, rgba(255,255,255,0.4) 0%, transparent 45%, transparent 70%, rgba(255,255,255,0.15) 100%)",
                backgroundPositionX: glareX,
                backgroundPositionY: glareY,
              }}
            />
          )}
        </div>
      </motion.div>
    </div>
  );
}

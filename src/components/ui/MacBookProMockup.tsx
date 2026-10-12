"use client";

import React, { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { Sparkles, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MacBookProMockupProps {
  /** Aluminum chassis finish. Default: "space-black" */
  color?: "space-black" | "silver";
  /** Enable 3D cursor tilt physics. Default: true */
  enableTilt?: boolean;
  /** Show top macOS menu bar with camera notch. Default: true */
  showMenuBar?: boolean;
  /** Show bottom floating glass dock. Default: true */
  showDock?: boolean;
  /** Optional screenshot or wallpaper image URL */
  imageSrc?: string;
  /** Content rendered inside the laptop screen */
  children?: React.ReactNode;
  className?: string;
}

const FINISHES: Record<
  "space-black" | "silver",
  { frame: string; base: string; lip: string; highlight: string }
> = {
  "space-black": {
    frame: "border-neutral-800 bg-[#161617]",
    base: "bg-[#1c1c1e] border-neutral-700/60",
    lip: "bg-neutral-800 border-neutral-700/80",
    highlight: "from-white/10 via-transparent to-white/5",
  },
  silver: {
    frame: "border-neutral-300 bg-[#E3E3E8]",
    base: "bg-[#D8D8DF] border-neutral-300",
    lip: "bg-neutral-200 border-neutral-300",
    highlight: "from-white/30 via-transparent to-neutral-400/20",
  },
};

export function MacBookProMockup({
  color = "space-black",
  enableTilt = true,
  showMenuBar = true,
  showDock = true,
  imageSrc,
  children,
  className,
}: MacBookProMockupProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  // 3D Parallax tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateXSpring = useSpring(useTransform(mouseY, [-0.5, 0.5], [7, -7]), {
    stiffness: 260,
    damping: 24,
  });
  const rotateYSpring = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), {
    stiffness: 260,
    damping: 24,
  });

  const glareX = useTransform(mouseX, [-0.5, 0.5], ["-20%", "120%"]);
  const glareY = useTransform(mouseY, [-0.5, 0.5], ["-20%", "120%"]);

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
    <div className={cn("perspective-1000 flex flex-col items-center justify-center p-4", className)}>
      <motion.div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={
          enableTilt && !reduceMotion
            ? {
                rotateX: rotateXSpring,
                rotateY: rotateYSpring,
                transformStyle: "preserve-3d",
              }
            : undefined
        }
        className="relative w-full max-w-[620px] select-none"
      >
        {/* Screen Top Lid */}
        <div
          className={cn(
            "relative w-full aspect-[16/10] rounded-t-[18px] rounded-b-[4px] border-[5px] p-[8px] shadow-2xl transition-all",
            theme.frame
          )}
        >
          {/* Outer Chamfer Highlight */}
          <div
            className={cn(
              "pointer-events-none absolute inset-0 rounded-t-[14px] bg-gradient-to-tr",
              theme.highlight
            )}
          />

          {/* Inner Screen Display (Liquid Retina XDR) */}
          <div className="relative h-full w-full overflow-hidden rounded-[10px] bg-black text-white shadow-inner">
            {/* Edge-to-Edge Screen Content / Wallpaper */}
            <div className="absolute inset-0 h-full w-full overflow-hidden">
              {children ? (
                children
              ) : (
                <div className="relative h-full w-full overflow-hidden">
                  <img
                    src={
                      imageSrc ||
                      "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1600&auto=format&fit=crop"
                    }
                    alt="MacBook Pro Screen"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/15 pointer-events-none" />

                  {/* Centered Desktop Branding (shown when no custom image or children) */}
                  {!imageSrc && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center p-4 pointer-events-none select-none">
                      <div className="h-10 w-10 rounded-2xl bg-white/10 flex items-center justify-center mb-2 border border-white/10 backdrop-blur-md shadow-lg">
                        <Sparkles className="h-5 w-5 text-amber-300" />
                      </div>
                      <h4 className="text-base font-semibold text-white tracking-tight drop-shadow-md">
                        MacBook Pro 16″
                      </h4>
                      <span className="text-[11px] text-white/80 drop-shadow">
                        Liquid Retina XDR Display
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Camera Notch (Hangs from top center) */}
            <div className="absolute left-1/2 top-0 -translate-x-1/2 z-40 h-[14px] w-[88px] rounded-b-[7px] bg-black flex items-center justify-center pointer-events-none">
              <div className="h-2 w-2 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center">
                <div className="h-0.5 w-0.5 rounded-full bg-emerald-500/80" />
              </div>
            </div>

            {/* macOS Top Menu Bar */}
            {showMenuBar && (
              <div className="absolute top-0 inset-x-0 z-30 flex h-[24px] w-full items-center justify-between px-3 text-[10px] text-white/90 font-medium select-none bg-black/30 backdrop-blur-md border-b border-white/10 pointer-events-none">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-xs"></span>
                  <span className="font-semibold">Finder</span>
                  <span className="hidden sm:inline">File</span>
                  <span className="hidden sm:inline">Edit</span>
                  <span className="hidden sm:inline">View</span>
                  <span className="hidden sm:inline">Window</span>
                  <span className="hidden sm:inline">Help</span>
                </div>
                <div className="flex items-center gap-2 font-mono text-[9px]">
                  <span>Mon Oct 12</span>
                  <span>9:41 AM</span>
                </div>
              </div>
            )}

            {/* Floating macOS Dock */}
            {showDock && (
              <div className="absolute bottom-2 inset-x-0 z-30 flex justify-center pointer-events-none select-none">
                <div className="flex items-center gap-2 rounded-2xl border border-white/15 bg-black/35 px-3 py-1.5 backdrop-blur-xl shadow-2xl">
                  {["Finder", "Safari", "Terminal", "Code", "Notes", "Music"].map((app, i) => (
                    <div
                      key={i}
                      className="flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-tr from-white/15 to-white/30 text-[9px] font-bold text-white shadow-xs hover:scale-115 transition-transform"
                    >
                      {app[0]}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Specular Glare Reflection */}
            {enableTilt && !reduceMotion && (
              <motion.div
                className="pointer-events-none absolute inset-0 z-40 rounded-[10px] opacity-30 mix-blend-overlay"
                style={{
                  background:
                    "linear-gradient(125deg, rgba(255,255,255,0.4) 0%, transparent 45%, transparent 70%, rgba(255,255,255,0.15) 100%)",
                  backgroundPositionX: glareX,
                  backgroundPositionY: glareY,
                }}
              />
            )}
          </div>
        </div>

        {/* Bottom Laptop Chassis Deck */}
        <div className="relative w-[108%] -left-[4%] flex flex-col items-center">
          {/* Keyboard Deck Layer */}
          <div
            className={cn(
              "relative h-[11px] w-full rounded-b-[10px] border-t border-neutral-900/40 shadow-xl flex items-start justify-center",
              theme.base
            )}
          >
            {/* Display Hinge Cutout */}
            <div className="h-[3px] w-[110px] bg-neutral-950 rounded-b-sm opacity-80" />

            {/* Center Thumb Notch / Display Opening Lip */}
            <div
              className={cn(
                "absolute -top-[1px] h-[5px] w-[65px] rounded-b-[4px] border border-t-0 shadow-inner",
                theme.lip
              )}
            />
          </div>

          {/* Bottom Rubber Feet Shadows */}
          <div className="w-[96%] h-[2px] bg-black/40 blur-[2px] mt-0.5" />
        </div>
      </motion.div>
    </div>
  );
}

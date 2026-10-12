"use client";

import React, { useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
  useReducedMotion,
} from "framer-motion";
import { Music2, Sparkles, Volume2, Flashlight, Camera } from "lucide-react";
import { cn } from "@/lib/utils";

export interface IPhone16ProMockupProps {
  /** Titanium finish. Default: "natural" */
  color?: "natural" | "desert" | "black" | "white";
  /** Enable 3D cursor tilt physics. Default: true */
  enableTilt?: boolean;
  /** Allow clicking the Dynamic Island to expand. Default: true */
  interactiveIsland?: boolean;
  /** Show lockscreen clock, date, and shortcut buttons. Default: true when children is not provided */
  showLockScreen?: boolean;
  /** Show top status bar (time, cellular, wifi, battery). Default: true */
  showStatusBar?: boolean;
  /** Show bottom home indicator pill. Default: true */
  showHomeIndicator?: boolean;
  /** Optional screenshot or wallpaper image URL */
  imageSrc?: string;
  /** Content rendered inside the screen */
  children?: React.ReactNode;
  className?: string;
}

const COLOR_STYLES: Record<
  "natural" | "desert" | "black" | "white",
  { frame: string; bezel: string; highlight: string }
> = {
  natural: {
    frame: "border-neutral-400/80 bg-[#282725]",
    bezel: "border-neutral-500/40 ring-1 ring-neutral-300/20",
    highlight: "from-neutral-200/20 via-transparent to-neutral-400/10",
  },
  desert: {
    frame: "border-[#A88C78]/90 bg-[#2A231F]",
    bezel: "border-[#C4A894]/50 ring-1 ring-[#D8BAA3]/20",
    highlight: "from-[#F3E5D8]/20 via-transparent to-[#A88C78]/15",
  },
  black: {
    frame: "border-neutral-800 bg-[#161617]",
    bezel: "border-neutral-700/50 ring-1 ring-white/10",
    highlight: "from-white/15 via-transparent to-white/5",
  },
  white: {
    frame: "border-neutral-300 bg-[#E8E8ED]",
    bezel: "border-neutral-200/80 ring-1 ring-white/40",
    highlight: "from-white/40 via-transparent to-neutral-200/20",
  },
};

export function IPhone16ProMockup({
  color = "natural",
  enableTilt = true,
  interactiveIsland = true,
  showLockScreen,
  showStatusBar = true,
  showHomeIndicator = true,
  imageSrc,
  children,
  className,
}: IPhone16ProMockupProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [islandExpanded, setIslandExpanded] = useState(false);
  const reduceMotion = useReducedMotion();

  // 3D Parallax tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateXSpring = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), {
    stiffness: 260,
    damping: 24,
  });
  const rotateYSpring = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), {
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

  const theme = COLOR_STYLES[color] || COLOR_STYLES.natural;
  const isLockScreenActive = showLockScreen ?? !children;

  return (
    <div className={cn("perspective-1000 flex items-center justify-center p-4", className)}>
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
        className={cn(
          "relative w-[280px] sm:w-[320px] aspect-[9/19.5] rounded-[50px] p-[10px] shadow-2xl transition-shadow select-none",
          theme.frame,
          theme.bezel
        )}
      >
        {/* Hardware Buttons: Left Side (Action + Volume) */}
        <div className="absolute -left-[3px] top-[95px] h-[22px] w-[3px] rounded-l-sm bg-neutral-500/80" />
        <div className="absolute -left-[3px] top-[135px] h-[40px] w-[3px] rounded-l-sm bg-neutral-500/80" />
        <div className="absolute -left-[3px] top-[185px] h-[40px] w-[3px] rounded-l-sm bg-neutral-500/80" />

        {/* Hardware Button: Right Side (Power / Lock) */}
        <div className="absolute -right-[3px] top-[145px] h-[65px] w-[3px] rounded-r-sm bg-neutral-500/80" />

        {/* Outer Titanium Bezel Chamfer Highlight */}
        <div
          className={cn(
            "pointer-events-none absolute inset-0 rounded-[50px] bg-gradient-to-tr",
            theme.highlight
          )}
        />

        {/* Inner Screen Display (Super Retina XDR OLED) */}
        <div className="relative h-full w-full overflow-hidden rounded-[42px] bg-black text-white shadow-inner">
          {/* Edge-to-Edge Screen Content / Wallpaper */}
          <div className="absolute inset-0 h-full w-full overflow-hidden">
            {children ? (
              children
            ) : (
              <div className="relative h-full w-full overflow-hidden">
                <img
                  src={
                    imageSrc ||
                    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop"
                  }
                  alt="iPhone 16 Pro Screen"
                  className="absolute inset-0 h-full w-full object-cover"
                />

                {/* Lock Screen Gradient & Overlays */}
                {isLockScreenActive && (
                  <div className="absolute inset-0 flex flex-col justify-between p-6 pointer-events-none select-none">
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />

                    {/* iOS Lockscreen Header */}
                    <div className="relative z-10 pt-10 flex flex-col items-center text-center">
                      <span className="text-[11px] font-medium tracking-wide text-white/80 uppercase">
                        Monday, October 12
                      </span>
                      <span className="text-6xl font-light tracking-tight text-white/95 mt-1 font-sans">
                        9:41
                      </span>
                    </div>

                    {/* Bottom Lockscreen Shortcuts: Flashlight & Camera */}
                    <div className="relative z-10 flex items-center justify-between pb-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md border border-white/15 shadow-lg pointer-events-auto cursor-pointer hover:bg-black/50 transition-colors">
                        <Flashlight className="h-4 w-4" />
                      </div>
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md border border-white/15 shadow-lg pointer-events-auto cursor-pointer hover:bg-black/50 transition-colors">
                        <Camera className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Top Status Bar (Time, Cellular, 5G, Battery) */}
          {showStatusBar && (
            <div className="absolute top-0 inset-x-0 z-30 flex items-center justify-between px-6 pt-3 select-none pointer-events-none">
              {/* Clock (hidden when big lockscreen clock is visible) */}
              <span
                className={cn(
                  "text-[12px] font-semibold tracking-tight text-white/90 transition-opacity",
                  isLockScreenActive ? "opacity-0" : "opacity-100"
                )}
              >
                9:41
              </span>

              {/* Status Icons */}
              <div className="flex items-center gap-1.5 text-white/90">
                {/* Cellular signal bars */}
                <div className="flex items-end gap-[1.5px] h-2.5">
                  <span className="w-[2px] h-1 bg-white rounded-[0.5px]" />
                  <span className="w-[2px] h-1.5 bg-white rounded-[0.5px]" />
                  <span className="w-[2px] h-2 bg-white rounded-[0.5px]" />
                  <span className="w-[2px] h-2.5 bg-white rounded-[0.5px]" />
                </div>
                {/* 5G label */}
                <span className="text-[9px] font-bold font-sans tracking-tighter">5G</span>
                {/* Battery Pill */}
                <div className="flex items-center gap-[1px]">
                  <div className="h-2.5 w-5 rounded-[3px] border border-white/80 p-[1px] flex items-center">
                    <div className="h-full w-3 bg-white rounded-[1px]" />
                  </div>
                  <div className="h-1 w-[1.5px] bg-white/80 rounded-r-[0.5px]" />
                </div>
              </div>
            </div>
          )}

          {/* Dynamic Island Pill */}
          <motion.div
            layout
            onClick={() => interactiveIsland && setIslandExpanded((prev) => !prev)}
            className={cn(
              "absolute left-1/2 -translate-x-1/2 top-2.5 z-40 flex items-center justify-between rounded-full bg-black px-2.5 py-1 text-white shadow-md transition-colors",
              interactiveIsland && "cursor-pointer hover:ring-1 hover:ring-white/20"
            )}
            animate={
              islandExpanded
                ? { width: 195, height: 44, borderRadius: 24 }
                : { width: 85, height: 26, borderRadius: 16 }
            }
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
          >
            <AnimatePresence mode="wait">
              {islandExpanded ? (
                <motion.div
                  key="expanded"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex w-full items-center justify-between px-1"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/20 text-amber-400">
                      <Sparkles className="h-3.5 w-3.5" />
                    </div>
                    <div className="flex flex-col leading-none">
                      <span className="text-[10px] font-semibold text-white">BoseUI</span>
                      <span className="text-[8px] text-white/60">Dynamic Island</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="h-2 w-1 animate-pulse rounded-full bg-emerald-400" />
                    <span className="h-3.5 w-1 animate-pulse rounded-full bg-emerald-400 delay-75" />
                    <span className="h-2 w-1 animate-pulse rounded-full bg-emerald-400 delay-150" />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="compact"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex w-full items-center justify-between px-1"
                >
                  {/* Camera Lens Circle */}
                  <div className="h-2.5 w-2.5 rounded-full bg-neutral-900 border border-neutral-800" />
                  {/* FaceID / Audio Dot */}
                  <div className="h-2 w-2 rounded-full bg-emerald-500/80 animate-pulse" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Bottom Home Indicator Bar */}
          {showHomeIndicator && (
            <div className="absolute bottom-2 inset-x-0 z-30 flex items-center justify-center pointer-events-none">
              <div className="h-1 w-28 rounded-full bg-white/50 backdrop-blur-xs shadow-xs" />
            </div>
          )}

          {/* Realistic Specular Glare Layer */}
          {enableTilt && !reduceMotion && (
            <motion.div
              className="pointer-events-none absolute inset-0 z-50 rounded-[42px] opacity-40 mix-blend-overlay"
              style={{
                background:
                  "linear-gradient(115deg, rgba(255,255,255,0.4) 0%, transparent 40%, transparent 70%, rgba(255,255,255,0.15) 100%)",
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

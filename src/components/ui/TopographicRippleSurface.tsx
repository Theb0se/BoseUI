"use client";

import React, { useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import { Compass } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TopographicRippleSurfaceProps {
  /** Number of concentric contour rings. Default: 6 */
  ringCount?: number;
  /** Spring stiffness coefficient for contour displacement. Default: 220 */
  stiffness?: number;
  /** Spring damping coefficient for contour displacement. Default: 20 */
  damping?: number;
  /** Optional foreground content rendered over the topographic field */
  children?: React.ReactNode;
  className?: string;
}

interface ContourRingProps {
  index: number;
  total: number;
  offsetX: MotionValue<number>;
  offsetY: MotionValue<number>;
  stiffness: number;
  damping: number;
  pulseBoost: boolean;
  shouldReduceMotion: boolean;
}

function ContourRing({
  index,
  total,
  offsetX,
  offsetY,
  stiffness,
  damping,
  pulseBoost,
  shouldReduceMotion,
}: ContourRingProps) {
  // Inner rings follow pointer more tightly; outer rings lag with lower factor
  const weight = (total - index) / total;
  const targetX = useTransform(offsetX, (v) => v * weight);
  const targetY = useTransform(offsetY, (v) => v * weight);

  const springX = useSpring(targetX, {
    stiffness: Math.max(90, stiffness - index * 20),
    damping: Math.max(12, damping - index),
    mass: 0.35 + index * 0.1,
  });

  const springY = useSpring(targetY, {
    stiffness: Math.max(90, stiffness - index * 20),
    damping: Math.max(12, damping - index),
    mass: 0.35 + index * 0.1,
  });

  const sizePx = 68 + index * 44;

  return (
    <motion.div
      aria-hidden="true"
      animate={{
        scale: pulseBoost && !shouldReduceMotion ? [1, 1.08, 1] : 1,
      }}
      transition={{
        duration: 0.55,
        delay: index * 0.04,
        ease: "easeOut",
      }}
      style={{
        width: sizePx,
        height: sizePx,
        x: shouldReduceMotion ? 0 : springX,
        y: shouldReduceMotion ? 0 : springY,
      }}
      className="pointer-events-none absolute rounded-full border border-neutral-300/75 dark:border-[#262626]"
    />
  );
}

export function TopographicRippleSurface({
  ringCount = 6,
  stiffness = 220,
  damping = 20,
  children,
  className,
}: TopographicRippleSurfaceProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const shouldReduceMotion = useReducedMotion() ?? false;
  const [pulseBoost, setPulseBoost] = useState(false);

  const offsetX = useMotionValue(0);
  const offsetY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion) return;
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const dx = e.clientX - rect.left - centerX;
    const dy = e.clientY - rect.top - centerY;
    offsetX.set(dx * 0.42);
    offsetY.set(dy * 0.42);
  };

  const handleMouseLeave = () => {
    offsetX.set(0);
    offsetY.set(0);
  };

  const triggerShockwave = () => {
    setPulseBoost(true);
    setTimeout(() => setPulseBoost(false), 650);
  };

  const rings = Array.from({ length: ringCount }, (_, i) => i);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={triggerShockwave}
      className={cn(
        "relative flex min-h-[250px] w-full max-w-lg cursor-pointer select-none items-center justify-center overflow-hidden rounded-2xl border border-neutral-200 bg-white p-8 dark:border-[#222222] dark:bg-[#0A0A0A]",
        className
      )}
    >
      {/* Concentric Topographic Isolines */}
      {rings.map((idx) => (
        <ContourRing
          key={idx}
          index={idx}
          total={ringCount}
          offsetX={offsetX}
          offsetY={offsetY}
          stiffness={stiffness}
          damping={damping}
          pulseBoost={pulseBoost}
          shouldReduceMotion={shouldReduceMotion}
        />
      ))}

      {/* Foreground Telemetry Card */}
      <div className="relative z-10 text-center">
        {children || (
          <div className="inline-flex flex-col items-center rounded-2xl border border-neutral-200/90 bg-white/90 px-5 py-3.5 shadow-sm backdrop-blur-md dark:border-[#262626] dark:bg-[#111111]/90">
            <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
              <Compass className="h-3.5 w-3.5 text-black dark:text-white" />
              Topographic Isolines
            </span>
            <span className="mt-1 text-xs font-semibold text-black dark:text-white">
              Move cursor to warp • Click to ripple
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default TopographicRippleSurface;

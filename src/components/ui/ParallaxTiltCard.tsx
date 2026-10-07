"use client";

import React, { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { Cpu, Layers, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ParallaxTiltCardProps {
  /** Card title heading. Default: "Spatial Depth Plane" */
  title?: string;
  /** Supporting card description. */
  subtitle?: string;
  /** Peak 3D rotation angle in degrees. Default: 14 */
  maxTilt?: number;
  /** Hooke's Law spring stiffness coefficient. Default: 240 */
  stiffness?: number;
  /** Spring damping coefficient. Default: 22 */
  damping?: number;
  className?: string;
}

export function ParallaxTiltCard({
  title = "Spatial Depth Plane",
  subtitle = "Three independent Z-planes translate at graduated ratios under pointer movement.",
  maxTilt = 14,
  stiffness = 240,
  damping = 22,
  className,
}: ParallaxTiltCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const shouldReduceMotion = useReducedMotion() ?? false;

  const pctX = useMotionValue(0);
  const pctY = useMotionValue(0);

  const smoothX = useSpring(pctX, { stiffness, damping, mass: 0.4 });
  const smoothY = useSpring(pctY, { stiffness, damping, mass: 0.4 });

  const rotateX = useTransform(smoothY, [-1, 1], [maxTilt, -maxTilt]);
  const rotateY = useTransform(smoothX, [-1, 1], [-maxTilt, maxTilt]);

  // Graduated multi-plane parallax offsets
  const layer1X = useTransform(smoothX, [-1, 1], [-6, 6]);
  const layer1Y = useTransform(smoothY, [-1, 1], [-6, 6]);

  const layer2X = useTransform(smoothX, [-1, 1], [-16, 16]);
  const layer2Y = useTransform(smoothY, [-1, 1], [-16, 16]);

  const layer3X = useTransform(smoothX, [-1, 1], [-26, 26]);
  const layer3Y = useTransform(smoothY, [-1, 1], [-26, 26]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion) return;
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    pctX.set(nx);
    pctY.set(ny);
  };

  const handleMouseLeave = () => {
    pctX.set(0);
    pctY.set(0);
  };

  return (
    <div
      style={{ perspective: "1100px" }}
      className={cn("w-full max-w-sm select-none", className)}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX: shouldReduceMotion ? 0 : rotateX,
          rotateY: shouldReduceMotion ? 0 : rotateY,
          transformStyle: "preserve-3d",
        }}
        className="group relative overflow-hidden rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm transition-colors hover:border-neutral-400 dark:border-[#222222] dark:bg-[#0A0A0A] dark:hover:border-[#383838]"
      >
        {/* Depth Plane 1: Background Blueprint Grid */}
        <motion.div
          aria-hidden="true"
          style={{
            x: shouldReduceMotion ? 0 : layer1X,
            y: shouldReduceMotion ? 0 : layer1Y,
          }}
          className="pointer-events-none absolute -inset-6 bg-[radial-gradient(#d4d4d4_1px,transparent_1px)] [background-size:16px_16px] opacity-60 dark:bg-[radial-gradient(#262626_1px,transparent_1px)]"
        />

        {/* Depth Plane 2: Floating Mid-Ground Telemetry Module */}
        <motion.div
          style={{
            x: shouldReduceMotion ? 0 : layer2X,
            y: shouldReduceMotion ? 0 : layer2Y,
          }}
          className="relative z-10 mb-5 flex items-center justify-between rounded-2xl border border-neutral-200/90 bg-neutral-50/90 p-3.5 backdrop-blur-md dark:border-[#262626] dark:bg-[#141414]/90"
        >
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-black text-white dark:bg-white dark:text-black">
              <Cpu className="h-4 w-4" />
            </div>
            <div>
              <div className="font-mono text-[10px] font-semibold uppercase text-neutral-400">
                PLANE_02 // PARALLAX
              </div>
              <div className="text-xs font-semibold text-black dark:text-white">
                ±{maxTilt}° Coupled Tilt
              </div>
            </div>
          </div>

          <Layers className="h-4 w-4 text-neutral-400" />
        </motion.div>

        {/* Depth Plane 3: High-Elevation Foreground Badge & Copy */}
        <motion.div
          style={{
            x: shouldReduceMotion ? 0 : layer3X,
            y: shouldReduceMotion ? 0 : layer3Y,
          }}
          className="relative z-20"
        >
          <span className="inline-flex items-center gap-1 rounded-full bg-black px-2.5 py-0.5 font-mono text-[10px] font-semibold text-white dark:bg-white dark:text-black">
            <Sparkles className="h-3 w-3" />
            Z-INDEX +26PX
          </span>
          <h3 className="mt-2.5 text-base font-semibold text-black dark:text-white">
            {title}
          </h3>
          <p className="mt-1 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
            {subtitle}
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default ParallaxTiltCard;

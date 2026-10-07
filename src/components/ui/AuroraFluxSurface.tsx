"use client";

import React, { useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AuroraFluxSurfaceProps {
  /** Radius of the primary luminance orb in pixels. Default: 260 */
  orbRadius?: number;
  /** Spring stiffness coefficient for the leading aurora orb. Default: 180 */
  stiffness?: number;
  /** Spring damping coefficient for the leading aurora orb. Default: 24 */
  damping?: number;
  /** Optional foreground content */
  children?: React.ReactNode;
  className?: string;
}

export function AuroraFluxSurface({
  orbRadius = 260,
  stiffness = 180,
  damping = 24,
  children,
  className,
}: AuroraFluxSurfaceProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const shouldReduceMotion = useReducedMotion() ?? false;

  const mouseX = useMotionValue(200);
  const mouseY = useMotionValue(115);

  // Primary low-mass orb
  const orb1X = useSpring(mouseX, { stiffness, damping, mass: 0.4 });
  const orb1Y = useSpring(mouseY, { stiffness, damping, mass: 0.4 });

  // Secondary high-mass trailing orb
  const orb2X = useSpring(mouseX, {
    stiffness: Math.max(60, stiffness * 0.45),
    damping: damping * 1.1,
    mass: 1.4,
  });
  const orb2Y = useSpring(mouseY, {
    stiffness: Math.max(60, stiffness * 0.45),
    damping: damping * 1.1,
    mass: 1.4,
  });

  const auroraGradient = useMotionTemplate`
    radial-gradient(${orbRadius}px circle at ${orb1X}px ${orb1Y}px, rgba(120, 120, 120, 0.22), transparent 75%),
    radial-gradient(${orbRadius * 1.25}px circle at ${orb2X}px ${orb2Y}px, rgba(160, 160, 160, 0.14), transparent 80%)
  `;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion) return;
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={cn(
        "relative flex min-h-[230px] w-full max-w-lg items-center justify-center overflow-hidden rounded-2xl border border-neutral-200 bg-white p-8 dark:border-[#222222] dark:bg-[#0A0A0A]",
        className
      )}
    >
      {/* Dual-Spring Coupled Luminance Field */}
      <motion.div
        aria-hidden="true"
        style={{ background: auroraGradient }}
        className="pointer-events-none absolute inset-0"
      />

      {/* Subtle architectural dot texture */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(#d4d4d4_1px,transparent_1px)] [background-size:20px_20px] opacity-45 dark:bg-[radial-gradient(#242424_1px,transparent_1px)]"
      />

      <div className="relative z-10 text-center">
        {children || (
          <div className="inline-flex flex-col items-center rounded-2xl border border-neutral-200/90 bg-white/85 px-5 py-3.5 shadow-sm backdrop-blur-md dark:border-[#262626] dark:bg-[#111111]/85">
            <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-neutral-500">
              <Sparkles className="h-3.5 w-3.5 text-black dark:text-white" />
              Coupled Luminance Flux
            </span>
            <span className="mt-1 text-xs font-semibold text-black dark:text-white">
              Dual-mass radial aurora chasing pointer
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default AuroraFluxSurface;

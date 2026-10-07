"use client";

import React, { useRef, useState } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import { cn } from "@/lib/utils";

export interface InteractiveGridBeamProps {
  /** Grid cell size in pixels. Default: 32 */
  gridSize?: number;
  /** Radius of the cursor-tracked grid illumination mask in pixels. Default: 220 */
  glowRadius?: number;
  /** Spring stiffness coefficient for cursor spotlight tracking. Default: 280 */
  stiffness?: number;
  /** Spring damping coefficient for cursor spotlight tracking. Default: 26 */
  damping?: number;
  /** Foreground content rendered above the interactive grid matrix */
  children?: React.ReactNode;
  className?: string;
}

interface PulseTrace {
  id: number;
  x: number;
  y: number;
}

export function InteractiveGridBeam({
  gridSize = 32,
  glowRadius = 220,
  stiffness = 280,
  damping = 26,
  children,
  className,
}: InteractiveGridBeamProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const shouldReduceMotion = useReducedMotion() ?? false;
  const [isHovered, setIsHovered] = useState(false);
  const [pulses, setPulses] = useState<PulseTrace[]>([]);

  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);

  const smoothX = useSpring(mouseX, { stiffness, damping, mass: 0.3 });
  const smoothY = useSpring(mouseY, { stiffness, damping, mass: 0.3 });

  const activeX = shouldReduceMotion ? mouseX : smoothX;
  const activeY = shouldReduceMotion ? mouseY : smoothY;

  const maskImage = useMotionTemplate`radial-gradient(${glowRadius}px circle at ${activeX}px ${activeY}px, rgba(0,0,0,1) 0%, rgba(0,0,0,0.35) 55%, transparent 100%)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion) return;
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const rawX = e.clientX - rect.left;
    const rawY = e.clientY - rect.top;

    // Snap beam origin to nearest grid intersection
    const snappedX = Math.round(rawX / gridSize) * gridSize;
    const snappedY = Math.round(rawY / gridSize) * gridSize;
    const id = Date.now() + Math.random();

    setPulses((prev) => [...prev.slice(-3), { id, x: snappedX, y: snappedY }]);
  };

  const gridBackgroundStyle: React.CSSProperties = {
    backgroundSize: `${gridSize}px ${gridSize}px`,
    backgroundImage:
      "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      className={cn(
        "group relative flex min-h-[240px] w-full cursor-crosshair items-center justify-center overflow-hidden rounded-2xl border border-neutral-200 bg-white p-8 dark:border-[#222222] dark:bg-[#0A0A0A]",
        className
      )}
    >
      {/* Base ambient low-contrast architectural grid */}
      <div
        aria-hidden="true"
        style={gridBackgroundStyle}
        className="pointer-events-none absolute inset-0 text-neutral-200/55 dark:text-[#1A1A1A]"
      />

      {/* Cursor-masked high-contrast kinetic grid overlay */}
      <motion.div
        aria-hidden="true"
        style={{
          ...gridBackgroundStyle,
          WebkitMaskImage: maskImage,
          maskImage,
          opacity: isHovered ? 1 : 0,
        }}
        className="pointer-events-none absolute inset-0 text-black/45 transition-opacity duration-300 dark:text-white/45"
      />

      {/* Interactive orthogonal light beams emitted on click */}
      {!shouldReduceMotion &&
        pulses.map((pulse) => (
          <React.Fragment key={pulse.id}>
            {/* Horizontal propagating beam */}
            <motion.div
              aria-hidden="true"
              initial={{ scaleX: 0, opacity: 0.9 }}
              animate={{ scaleX: 1.6, opacity: 0 }}
              transition={{ duration: 0.75, ease: "easeOut" }}
              style={{ top: pulse.y, left: 0, right: 0 }}
              className="pointer-events-none absolute h-[1.5px] origin-center bg-gradient-to-r from-transparent via-black to-transparent dark:via-white"
            />
            {/* Vertical propagating beam */}
            <motion.div
              aria-hidden="true"
              initial={{ scaleY: 0, opacity: 0.9 }}
              animate={{ scaleY: 1.6, opacity: 0 }}
              transition={{ duration: 0.75, ease: "easeOut" }}
              style={{ left: pulse.x, top: 0, bottom: 0 }}
              className="pointer-events-none absolute w-[1.5px] origin-center bg-gradient-to-b from-transparent via-black to-transparent dark:via-white"
            />
            {/* Intersection node pulse */}
            <motion.div
              aria-hidden="true"
              initial={{ scale: 0.4, opacity: 1 }}
              animate={{ scale: 2.8, opacity: 0 }}
              transition={{ duration: 0.65, ease: "easeOut" }}
              style={{ left: pulse.x - 4, top: pulse.y - 4 }}
              className="pointer-events-none absolute h-2 w-2 rounded-full bg-black dark:bg-white"
            />
          </React.Fragment>
        ))}

      {/* Foreground Content */}
      <div className="relative z-10 text-center">
        {children || (
          <div className="mx-auto max-w-xs rounded-2xl border border-neutral-200/90 bg-white/90 px-5 py-4 shadow-sm backdrop-blur-md dark:border-[#262626] dark:bg-[#111111]/90">
            <div className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
              Interactive Grid Matrix
            </div>
            <div className="mt-1 text-sm font-semibold text-black dark:text-white">
              Move cursor or click any intersection
            </div>
            <p className="mt-1 text-[11px] text-neutral-500">
              Snaps orthogonal light beams to {gridSize}px coordinates.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default InteractiveGridBeam;

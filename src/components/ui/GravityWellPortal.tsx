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
import { Magnet, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export interface GravityWellPortalProps {
  /** Gravitational pull radius in pixels around the pointer. Default: 180 */
  pullRadius?: number;
  /** Peak attraction displacement factor (0.1 to 0.9). Default: 0.55 */
  pullStrength?: number;
  /** Hooke's Law spring stiffness coefficient. Default: 240 */
  stiffness?: number;
  /** Spring damping coefficient. Default: 20 */
  damping?: number;
  className?: string;
}

interface OrbitalNodeSpec {
  id: string;
  label: string;
  xPct: number;
  yPct: number;
}

const ORBITAL_NODES: OrbitalNodeSpec[] = [
  { id: "n1", label: "k=240", xPct: 20, yPct: 26 },
  { id: "n2", label: "ζ=0.65", xPct: 78, yPct: 24 },
  { id: "n3", label: "m=0.4", xPct: 16, yPct: 74 },
  { id: "n4", label: "60fps", xPct: 82, yPct: 72 },
  { id: "n5", label: "F=-kx", xPct: 50, yPct: 18 },
  { id: "n6", label: "GPU", xPct: 50, yPct: 82 },
];

interface tetheredNodeProps {
  node: OrbitalNodeSpec;
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  containerRef: React.RefObject<HTMLDivElement | null>;
  pullRadius: number;
  pullStrength: number;
  stiffness: number;
  damping: number;
  impulseMultiplier: number;
  shouldReduceMotion: boolean;
}

function TetheredNode({
  node,
  mouseX,
  mouseY,
  containerRef,
  pullRadius,
  pullStrength,
  stiffness,
  damping,
  impulseMultiplier,
  shouldReduceMotion,
}: tetheredNodeProps) {
  const offsetX = useTransform([mouseX, mouseY], ([mx, my]) => {
    const el = containerRef.current;
    if (!el || mx === -Infinity || my === -Infinity) return 0;
    const rect = el.getBoundingClientRect();
    const anchorX = (node.xPct / 100) * rect.width;
    const anchorY = (node.yPct / 100) * rect.height;
    const dx = (mx as number) - anchorX;
    const dy = (my as number) - anchorY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist >= pullRadius || dist === 0) return 0;
    const falloff = 1 - dist / pullRadius;
    return dx * falloff * pullStrength * impulseMultiplier;
  });

  const offsetY = useTransform([mouseX, mouseY], ([mx, my]) => {
    const el = containerRef.current;
    if (!el || mx === -Infinity || my === -Infinity) return 0;
    const rect = el.getBoundingClientRect();
    const anchorX = (node.xPct / 100) * rect.width;
    const anchorY = (node.yPct / 100) * rect.height;
    const dx = (mx as number) - anchorX;
    const dy = (my as number) - anchorY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist >= pullRadius || dist === 0) return 0;
    const falloff = 1 - dist / pullRadius;
    return dy * falloff * pullStrength * impulseMultiplier;
  });

  const springX = useSpring(offsetX, { stiffness, damping, mass: 0.45 });
  const springY = useSpring(offsetY, { stiffness, damping, mass: 0.45 });

  return (
    <motion.div
      aria-hidden="true"
      style={{
        left: `${node.xPct}%`,
        top: `${node.yPct}%`,
        x: shouldReduceMotion ? 0 : springX,
        y: shouldReduceMotion ? 0 : springY,
      }}
      className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-neutral-200 bg-white/95 px-2.5 py-1 font-mono text-[10px] font-semibold text-neutral-700 shadow-sm backdrop-blur-md dark:border-[#262626] dark:bg-[#141414]/95 dark:text-neutral-300"
    >
      {node.label}
    </motion.div>
  );
}

export function GravityWellPortal({
  pullRadius = 180,
  pullStrength = 0.55,
  stiffness = 240,
  damping = 20,
  className,
}: GravityWellPortalProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const shouldReduceMotion = useReducedMotion() ?? false;
  const [repelMode, setRepelMode] = useState(false);

  const mouseX = useMotionValue(-Infinity);
  const mouseY = useMotionValue(-Infinity);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion) return;
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const handleMouseLeave = () => {
    mouseX.set(-Infinity);
    mouseY.set(-Infinity);
  };

  return (
    <div
      ref={containerRef}
      role="region"
      aria-label="Interactive gravitational spring field"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => setRepelMode((prev) => !prev)}
      className={cn(
        "relative flex min-h-[240px] w-full max-w-md cursor-pointer select-none flex-col items-center justify-center overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6 dark:border-[#222222] dark:bg-[#0A0A0A]",
        className
      )}
    >
      {/* Orbital Rings */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute h-44 w-44 rounded-full border border-dashed border-neutral-200/80 dark:border-[#1F1F1F]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute h-28 w-28 rounded-full border border-neutral-200/60 dark:border-[#1A1A1A]"
      />

      {/* Tethered Telemetry Nodes */}
      {ORBITAL_NODES.map((node) => (
        <TetheredNode
          key={node.id}
          node={node}
          mouseX={mouseX}
          mouseY={mouseY}
          containerRef={containerRef}
          pullRadius={pullRadius}
          pullStrength={pullStrength}
          stiffness={stiffness}
          damping={damping}
          impulseMultiplier={repelMode ? -1.15 : 1}
          shouldReduceMotion={shouldReduceMotion}
        />
      ))}

      {/* Central Singularity Core */}
      <div className="relative z-10 flex flex-col items-center text-center">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setRepelMode((prev) => !prev);
          }}
          className="inline-flex items-center gap-1.5 rounded-full border border-neutral-300 bg-neutral-50 px-3 py-1.5 text-xs font-semibold text-black shadow-sm transition-colors hover:border-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:border-[#2E2E2E] dark:bg-[#141414] dark:text-white dark:hover:border-white dark:focus-visible:ring-white"
        >
          {repelMode ? (
            <Sparkles className="h-3.5 w-3.5" />
          ) : (
            <Magnet className="h-3.5 w-3.5" />
          )}
          <span>{repelMode ? "Polarity: Repel" : "Polarity: Attract"}</span>
        </button>
        <p className="mt-2 text-[11px] text-neutral-500 dark:text-neutral-400">
          Move cursor to warp nodes • Click to invert polarity
        </p>
      </div>
    </div>
  );
}

export default GravityWellPortal;

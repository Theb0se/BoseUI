"use client";

import React, { useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ConstellationMeshFieldProps {
  /** Proximity distance threshold in pixels to connect cursor to mesh vertices. Default: 130 */
  connectRadius?: number;
  /** Optional foreground content */
  children?: React.ReactNode;
  className?: string;
}

interface MeshVertex {
  id: string;
  x: number;
  y: number;
}

const VERTICES: MeshVertex[] = [
  { id: "v1", x: 52, y: 46 },
  { id: "v2", x: 148, y: 38 },
  { id: "v3", x: 262, y: 54 },
  { id: "v4", x: 348, y: 42 },
  { id: "v5", x: 84, y: 118 },
  { id: "v6", x: 198, y: 112 },
  { id: "v7", x: 310, y: 124 },
  { id: "v8", x: 48, y: 188 },
  { id: "v9", x: 156, y: 184 },
  { id: "v10", x: 258, y: 192 },
  { id: "v11", x: 354, y: 180 },
];

export function ConstellationMeshField({
  connectRadius = 130,
  children,
  className,
}: ConstellationMeshFieldProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const shouldReduceMotion = useReducedMotion() ?? false;
  const [pointer, setPointer] = useState<{ x: number; y: number } | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion) return;
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    // Normalize coordinates into 400x230 SVG viewBox space
    const normX = ((e.clientX - rect.left) / rect.width) * 400;
    const normY = ((e.clientY - rect.top) / rect.height) * 230;
    setPointer({ x: normX, y: normY });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setPointer(null)}
      className={cn(
        "relative flex min-h-[230px] w-full max-w-lg items-center justify-center overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6 dark:border-[#222222] dark:bg-[#0A0A0A]",
        className
      )}
    >
      {/* Interactive SVG Constellation Graph */}
      <svg
        aria-hidden="true"
        viewBox="0 0 400 230"
        className="pointer-events-none absolute inset-0 h-full w-full"
      >
        {/* Static ambient mesh edges between close vertices */}
        {VERTICES.map((a, i) =>
          VERTICES.slice(i + 1).map((b) => {
            const dist = Math.hypot(a.x - b.x, a.y - b.y);
            if (dist > 125) return null;
            return (
              <line
                key={`${a.id}-${b.id}`}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke="currentColor"
                strokeWidth="1"
                className="text-neutral-200/70 dark:text-[#1D1D1D]"
              />
            );
          })
        )}

        {/* Dynamic pointer-coupled proximity edges */}
        {pointer &&
          VERTICES.map((v) => {
            const dist = Math.hypot(pointer.x - v.x, pointer.y - v.y);
            if (dist > connectRadius) return null;
            const opacity = Math.max(0.15, 1 - dist / connectRadius);
            return (
              <line
                key={`ptr-${v.id}`}
                x1={pointer.x}
                y1={pointer.y}
                x2={v.x}
                y2={v.y}
                stroke="currentColor"
                strokeOpacity={opacity}
                strokeWidth="1.5"
                className="text-black dark:text-white"
              />
            );
          })}

        {/* Constellation Vertices */}
        {VERTICES.map((v) => {
          const dist = pointer
            ? Math.hypot(pointer.x - v.x, pointer.y - v.y)
            : Infinity;
          const active = dist <= connectRadius;
          return (
            <motion.circle
              key={v.id}
              cx={v.x}
              cy={v.y}
              animate={{ r: active ? 4.2 : 2.5 }}
              transition={{ type: "spring", stiffness: 360, damping: 20 }}
              className={cn(
                "fill-current transition-colors",
                active
                  ? "text-black dark:text-white"
                  : "text-neutral-300 dark:text-neutral-700"
              )}
            />
          );
        })}
      </svg>

      <div className="relative z-10 text-center">
        {children || (
          <div className="inline-flex flex-col items-center rounded-2xl border border-neutral-200/90 bg-white/90 px-5 py-3.5 shadow-sm backdrop-blur-md dark:border-[#262626] dark:bg-[#111111]/90">
            <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-neutral-500">
              <Share2 className="h-3.5 w-3.5 text-black dark:text-white" />
              Constellation Graph
            </span>
            <span className="mt-1 text-xs font-semibold text-black dark:text-white">
              Sweep cursor to tether proximity edges
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default ConstellationMeshField;

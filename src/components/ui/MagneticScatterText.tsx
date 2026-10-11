"use client";

import React, { useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface MagneticScatterTextProps {
  /** The text string to scatter */
  text?: string;
  /** Dispersion radius around the cursor in pixels. Default: 100 */
  radius?: number;
  /** Force of repulsion multiplier. Default: 40 */
  strength?: number;
  /** Optional custom class name */
  className?: string;
}

export function MagneticScatterText({
  text = "Magnetic Scatter",
  radius = 100,
  strength = 40,
  className,
}: MagneticScatterTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const safeText = text || "Magnetic Scatter";
  const [scatterOffsets, setScatterOffsets] = useState<{ x: number; y: number }[]>(
    () => safeText.split("").map(() => ({ x: 0, y: 0 }))
  );
  const reduceMotion = useReducedMotion();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduceMotion || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const chars = containerRef.current.children;
    const newOffsets: { x: number; y: number }[] = [];

    for (let i = 0; i < chars.length; i++) {
      const charEl = chars[i] as HTMLElement;
      const charX = charEl.offsetLeft + charEl.offsetWidth / 2;
      const charY = charEl.offsetTop + charEl.offsetHeight / 2;

      const dx = charX - mouseX;
      const dy = charY - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < radius && dist > 0) {
        const factor = (1 - dist / radius) * strength;
        const angle = Math.atan2(dy, dx);
        newOffsets.push({
          x: Math.cos(angle) * factor,
          y: Math.sin(angle) * factor,
        });
      } else {
        newOffsets.push({ x: 0, y: 0 });
      }
    }

    setScatterOffsets(newOffsets);
  };

  const handleMouseLeave = () => {
    setScatterOffsets(safeText.split("").map(() => ({ x: 0, y: 0 })));
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "inline-flex flex-wrap items-baseline select-none cursor-pointer py-4",
        className
      )}
    >
      {safeText.split("").map((char, index) => {
        const offset = scatterOffsets[index] || { x: 0, y: 0 };

        return (
          <motion.span
            key={index}
            animate={{
              x: offset.x,
              y: offset.y,
            }}
            transition={{
              type: "spring",
              stiffness: 450,
              damping: 20,
              mass: 0.5,
            }}
            className="inline-block will-change-transform"
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        );
      })}
    </div>
  );
}

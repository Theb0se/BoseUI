"use client";

import React, { useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface HoverCursorShimmerTextProps {
  /** The text string to render */
  text: string;
  /** Radius of the shimmer beam around the cursor in pixels. Default: 100 */
  radius?: number;
  /** Core shimmer highlight color. Default: "#ffffff" */
  shimmerColor?: string;
  /** Glow color hugging the letter edges. Default: "rgba(255, 255, 255, 0.45)" */
  glowColor?: string;
  /** HTML element type. Default: "span" */
  as?: "span" | "h1" | "h2" | "h3" | "h4" | "p" | "div";
  /** Optional custom class name */
  className?: string;
}

export function HoverCursorShimmerText({
  text,
  radius = 100,
  shimmerColor = "#ffffff",
  glowColor = "rgba(255, 255, 255, 0.45)",
  as: Tag = "span",
  className,
}: HoverCursorShimmerTextProps) {
  const containerRef = useRef<HTMLElement>(null);
  const [coords, setCoords] = useState({ x: -9999, y: -9999 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setCoords({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setCoords({ x: -9999, y: -9999 });
  };

  return (
    <Tag
      ref={containerRef as any}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative inline-block select-none cursor-default font-semibold tracking-tight",
        className
      )}
    >
      {/* Base resting text layer */}
      <span className="text-neutral-500 dark:text-neutral-400 transition-colors">
        {text}
      </span>

      {/* Shimmer layer: gradient is clipped to the glyphs, so it can only appear ON the text */}
      <span
        aria-hidden="true"
        style={{
          backgroundImage: `radial-gradient(${radius}px circle at ${coords.x}px ${coords.y}px, ${shimmerColor} 0%, transparent 100%)`,
          backgroundRepeat: "no-repeat",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          WebkitTextFillColor: "transparent",
          // drop-shadow follows the painted glyph pixels, so the glow hugs the letters
          filter: `drop-shadow(0 0 6px ${glowColor})`,
          opacity: isHovered ? 1 : 0,
        }}
        className="pointer-events-none absolute inset-0 select-none transition-opacity duration-150"
      >
        {text}
      </span>
    </Tag>
  );
}
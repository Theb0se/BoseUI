"use client";

import React, { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export type ShimmerPalette = "silver" | "gold" | "violet" | "emerald";

export interface ShimmerTextProps {
  text: string;
  palette?: ShimmerPalette;
  /** Seconds for one full wave across the text */
  duration?: number;
  /** Glow strength, 0-100 */
  intensity?: number;
  /** Angle of shimmer effect in degrees */
  angle?: number;
  /** Only shimmer while hovered */
  hoverOnly?: boolean;
  /** Wrapper tag, e.g. "h1", "h2", "p", "span" */
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
  className?: string;
}

const PALETTES: Record<ShimmerPalette, { gradient: string; glow: string }> = {
  silver: {
    gradient: "linear-gradient(180deg, #FFFFFF 0%, #E2E8F0 45%, #94A3B8 100%)",
    glow: "rgba(255,255,255,0.95)",
  },
  gold: {
    gradient: "linear-gradient(180deg, #FFFBEB 0%, #FDE68A 40%, #D97706 100%)",
    glow: "rgba(253,224,71,0.95)",
  },
  violet: {
    gradient: "linear-gradient(180deg, #FAF5FF 0%, #D8B4FE 45%, #9333EA 100%)",
    glow: "rgba(216,180,254,0.95)",
  },
  emerald: {
    gradient: "linear-gradient(180deg, #ECFDF5 0%, #6EE7B7 45%, #059669 100%)",
    glow: "rgba(110,231,183,0.95)",
  },
};

export function ShimmerText({
  text,
  palette = "silver",
  duration = 3,
  intensity = 70,
  hoverOnly = false,
  as: Tag = "h1",
  className,
}: ShimmerTextProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const [hovered, setHovered] = useState(false);
  const active = !reduceMotion && (!hoverOnly || hovered);

  const { gradient, glow } = PALETTES[palette];

  // words -> letters, each letter gets a running index for the staggered wave
  const words = useMemo(() => {
    let idx = 0;
    return text.split(" ").map((w) => Array.from(w).map((ch) => ({ ch, i: idx++ })));
  }, [text]);
  const total = words.reduce((n, w) => n + w.length, 0) || 1;

  const stagger = (duration * 0.65) / total;
  const k = Math.min(100, Math.max(0, intensity)) / 100;
  const rest = `brightness(1) drop-shadow(0 0 0px ${glow})`;
  const peak = `brightness(${1 + k * 1.4}) drop-shadow(0 0 ${Math.round(k * 16)}px ${glow})`;

  const letterStyle: React.CSSProperties = {
    display: "inline-block",
    backgroundImage: gradient,
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    WebkitTextFillColor: "transparent",
    color: "transparent",
    willChange: "filter",
  };

  const MotionTag = Tag as React.ElementType;

  return (
    <MotionTag
      aria-label={text}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn("font-bold tracking-tight leading-[1.15]", className)}
    >
      {words.map((word, wi) => (
        <React.Fragment key={wi}>
          <span className="inline-block whitespace-nowrap" aria-hidden="true">
            {word.map(({ ch, i }) => (
              <motion.span
                key={`${i}-${active}`}
                style={letterStyle}
                initial={{ filter: rest }}
                animate={{ filter: active ? [rest, peak, rest, rest] : rest }}
                transition={
                  active
                    ? {
                      duration,
                      times: [0, 0.08, 0.22, 1],
                      ease: "easeInOut",
                      delay: i * stagger,
                      repeat: Infinity,
                    }
                    : { duration: 0.2 }
                }
              >
                {ch}
              </motion.span>
            ))}
          </span>
          {wi < words.length - 1 && " "}
        </React.Fragment>
      ))}
    </MotionTag>
  );
}

export default ShimmerText;
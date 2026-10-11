"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface ChromaticAberrationGlitchTextProps {
  /** The text string to render */
  text?: string;
  /** Whether the glitch triggers on hover or continuously. Default: "hover" */
  trigger?: "hover" | "continuous";
  /** Offset magnitude in pixels. Default: 3 */
  intensity?: number;
  /** Optional custom class name */
  className?: string;
}

export function ChromaticAberrationGlitchText({
  text = "Chromatic Glitch",
  trigger = "hover",
  intensity = 3,
  className,
}: ChromaticAberrationGlitchTextProps) {
  const [isHovered, setIsHovered] = useState(false);
  const reduceMotion = useReducedMotion();

  const isGlitching =
    trigger === "continuous" ? true : isHovered && !reduceMotion;

  return (
    <span
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "relative inline-block cursor-pointer select-none font-bold tracking-tight",
        className
      )}
    >
      {/* Red/Magenta Channel Offset */}
      <motion.span
        aria-hidden="true"
        animate={
          isGlitching
            ? {
                x: [-intensity, intensity, -intensity / 2, 0],
                y: [intensity / 2, -intensity / 2, 0],
                opacity: [0.7, 0.9, 0.8],
              }
            : { x: 0, y: 0, opacity: 0 }
        }
        transition={{
          repeat: isGlitching ? Infinity : 0,
          repeatType: "mirror",
          duration: 0.18,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute inset-0 select-none text-rose-500 mix-blend-screen opacity-0"
      >
        {text}
      </motion.span>

      {/* Cyan/Blue Channel Offset */}
      <motion.span
        aria-hidden="true"
        animate={
          isGlitching
            ? {
                x: [intensity, -intensity, intensity / 2, 0],
                y: [-intensity / 2, intensity / 2, 0],
                opacity: [0.7, 0.9, 0.8],
              }
            : { x: 0, y: 0, opacity: 0 }
        }
        transition={{
          repeat: isGlitching ? Infinity : 0,
          repeatType: "mirror",
          duration: 0.22,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute inset-0 select-none text-cyan-400 mix-blend-screen opacity-0"
      >
        {text}
      </motion.span>

      {/* Main Base Text Layer */}
      <span className="relative z-10">{text}</span>
    </span>
  );
}

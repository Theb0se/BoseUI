"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Waves } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ElasticWaveTextProps {
  /** Text string to ripple across. Default: "Harmonic Transverse Wave" */
  text?: string;
  /** Peak vertical wave amplitude in pixels. Default: -14 */
  amplitude?: number;
  /** Hooke's Law spring stiffness coefficient. Default: 420 */
  stiffness?: number;
  /** Spring damping coefficient. Default: 14 */
  damping?: number;
  className?: string;
}

export function ElasticWaveText({
  text = "Harmonic Transverse Wave",
  amplitude = -14,
  stiffness = 420,
  damping = 14,
  className,
}: ElasticWaveTextProps) {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const [wavePulse, setWavePulse] = useState(0);

  const triggerWave = () => {
    if (!shouldReduceMotion) {
      setWavePulse((p) => p + 1);
    }
  };

  const chars = text.split("");

  return (
    <button
      type="button"
      onClick={triggerWave}
      onMouseEnter={triggerWave}
      className={cn(
        "group inline-flex flex-col items-center gap-3 rounded-2xl border border-neutral-200 bg-white px-7 py-6 text-center transition-colors hover:border-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:border-[#222222] dark:bg-[#0A0A0A] dark:hover:border-white dark:focus-visible:ring-white",
        className
      )}
    >
      <span className="sr-only">{text}</span>

      <div
        aria-hidden="true"
        className="flex flex-wrap items-center justify-center text-xl font-bold tracking-tight text-black sm:text-2xl dark:text-white"
      >
        {chars.map((char, idx) => {
          if (char === " ") {
            return (
              <span key={idx} className="inline-block w-[0.32em]">
                &nbsp;
              </span>
            );
          }

          return (
            <motion.span
              key={`${wavePulse}-${idx}`}
              initial={{ y: 0 }}
              animate={
                wavePulse > 0 && !shouldReduceMotion
                  ? { y: [0, amplitude, -amplitude * 0.45, 0] }
                  : { y: 0 }
              }
              transition={{
                duration: 0.52,
                delay: idx * 0.024,
                ease: "easeInOut",
              }}
              className="inline-block select-none"
            >
              {char}
            </motion.span>
          );
        })}
      </div>

      <span className="inline-flex items-center gap-1.5 text-[11px] text-neutral-400">
        <Waves className="h-3.5 w-3.5" />
        <span>Hover or click to pluck transverse glyph wave</span>
      </span>
    </button>
  );
}

export default ElasticWaveText;

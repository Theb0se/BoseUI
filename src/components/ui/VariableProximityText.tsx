"use client";

import React, { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import { cn } from "@/lib/utils";

export interface VariableProximityTextProps {
  /** Text string to split into proximity-reactive kinetic glyphs. */
  text?: string;
  /** Pointer influence radius in pixels. Default: 120 */
  radius?: number;
  /** Peak vertical displacement in pixels at zero pointer distance. Default: -10 */
  maxLift?: number;
  /** Peak glyph scale factor at zero pointer distance. Default: 1.22 */
  maxScale?: number;
  /** Hooke's Law spring stiffness coefficient. Default: 300 */
  stiffness?: number;
  /** Spring damping coefficient. Default: 22 */
  damping?: number;
  className?: string;
}

interface ProximityGlyphProps {
  char: string;
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  radius: number;
  maxLift: number;
  maxScale: number;
  stiffness: number;
  damping: number;
  shouldReduceMotion: boolean;
}

function ProximityGlyph({
  char,
  mouseX,
  mouseY,
  radius,
  maxLift,
  maxScale,
  stiffness,
  damping,
  shouldReduceMotion,
}: ProximityGlyphProps) {
  const glyphRef = useRef<HTMLSpanElement | null>(null);

  const proximityFactor = useTransform([mouseX, mouseY], ([x, y]) => {
    const el = glyphRef.current;
    if (!el || x === -Infinity || y === -Infinity) return 0;
    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = (x as number) - centerX;
    const dy = (y as number) - centerY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist >= radius) return 0;
    return 1 - dist / radius;
  });

  const targetY = useTransform(proximityFactor, [0, 1], [0, maxLift]);
  const targetScale = useTransform(proximityFactor, [0, 1], [1, maxScale]);
  const targetOpacity = useTransform(proximityFactor, [0, 1], [0.68, 1]);

  const springY = useSpring(targetY, { stiffness, damping, mass: 0.35 });
  const springScale = useSpring(targetScale, { stiffness, damping, mass: 0.35 });

  if (char === " ") {
    return <span className="inline-block w-[0.32em]">&nbsp;</span>;
  }

  return (
    <motion.span
      ref={glyphRef}
      aria-hidden="true"
      style={{
        y: shouldReduceMotion ? 0 : springY,
        scale: shouldReduceMotion ? 1 : springScale,
        opacity: shouldReduceMotion ? 1 : targetOpacity,
      }}
      className="inline-block origin-bottom select-none will-change-transform"
    >
      {char}
    </motion.span>
  );
}

export function VariableProximityText({
  text = "Kinetic typography engineered with spring physics.",
  radius = 120,
  maxLift = -10,
  maxScale = 1.22,
  stiffness = 300,
  damping = 22,
  className,
}: VariableProximityTextProps) {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const mouseX = useMotionValue(-Infinity);
  const mouseY = useMotionValue(-Infinity);

  const words = text.split(" ");

  return (
    <div
      onMouseMove={(e) => {
        if (!shouldReduceMotion) {
          mouseX.set(e.clientX);
          mouseY.set(e.clientY);
        }
      }}
      onMouseLeave={() => {
        mouseX.set(-Infinity);
        mouseY.set(-Infinity);
      }}
      className={cn(
        "relative cursor-default rounded-2xl border border-neutral-200 bg-white px-6 py-8 text-center dark:border-[#222222] dark:bg-[#0A0A0A]",
        className
      )}
    >
      {/* Screen-reader accessible uninterrupted string */}
      <span className="sr-only">{text}</span>

      <p
        aria-hidden="true"
        className="text-xl font-semibold tracking-tight text-black sm:text-2xl dark:text-white"
      >
        {words.map((word, wordIdx) => (
          <span key={wordIdx} className="inline-block whitespace-nowrap">
            {word.split("").map((char, charIdx) => (
              <ProximityGlyph
                key={`${wordIdx}-${charIdx}`}
                char={char}
                mouseX={mouseX}
                mouseY={mouseY}
                radius={radius}
                maxLift={maxLift}
                maxScale={maxScale}
                stiffness={stiffness}
                damping={damping}
                shouldReduceMotion={shouldReduceMotion}
              />
            ))}
            {wordIdx < words.length - 1 && (
              <span className="inline-block w-[0.32em]">&nbsp;</span>
            )}
          </span>
        ))}
      </p>

      <div className="mt-3 text-[11px] font-medium uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Sweep cursor across glyphs • Radius {radius}px
      </div>
    </div>
  );
}

export default VariableProximityText;

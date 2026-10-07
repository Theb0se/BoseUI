"use client";

import React, { useRef, useState } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import { RotateCw, Sparkles, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";

export interface HolographicFlipCardProps {
  /** Custom front face content */
  front?: React.ReactNode;
  /** Custom back face content */
  back?: React.ReactNode;
  /** Peak 3D perspective tilt angle in degrees on pointer hover. Default: 12 */
  maxTilt?: number;
  /** Hooke's Law spring stiffness coefficient for 3D rotation. Default: 220 */
  stiffness?: number;
  /** Spring damping coefficient for 3D rotation. Default: 22 */
  damping?: number;
  className?: string;
}

export function HolographicFlipCard({
  front,
  back,
  maxTilt = 12,
  stiffness = 220,
  damping = 22,
  className,
}: HolographicFlipCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const shouldReduceMotion = useReducedMotion() ?? false;
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);

  const springRotateX = useSpring(tiltX, { stiffness, damping });
  const springRotateY = useSpring(tiltY, { stiffness, damping });
  const springGlareX = useSpring(glareX, { stiffness: 280, damping: 28 });
  const springGlareY = useSpring(glareY, { stiffness: 280, damping: 28 });

  const glareBackground = useMotionTemplate`radial-gradient(260px circle at ${springGlareX}% ${springGlareY}%, rgba(255, 255, 255, 0.22), rgba(160, 160, 160, 0.08) 45%, transparent 80%)`;

  const toggleFlip = () => {
    const nextFlipped = !isFlipped;
    setIsFlipped(nextFlipped);
    tiltY.set(nextFlipped ? 180 : 0);
    tiltX.set(0);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el || shouldReduceMotion) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const pctX = (x / rect.width - 0.5) * 2;
    const pctY = (y / rect.height - 0.5) * 2;

    const baseFlipAngle = isFlipped ? 180 : 0;
    tiltX.set(-pctY * maxTilt);
    tiltY.set(baseFlipAngle + pctX * maxTilt);

    glareX.set((x / rect.width) * 100);
    glareY.set((y / rect.height) * 100);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    tiltX.set(0);
    tiltY.set(isFlipped ? 180 : 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleFlip();
    }
  };

  return (
    <div
      style={{ perspective: "1200px" }}
      className={cn("w-full max-w-sm select-none", className)}
    >
      <motion.div
        ref={cardRef}
        role="button"
        tabIndex={0}
        aria-pressed={isFlipped}
        aria-label={
          isFlipped
            ? "Holographic card showing back face. Press Enter or Space to flip to front."
            : "Holographic card showing front face. Press Enter or Space to flip to back."
        }
        onClick={toggleFlip}
        onKeyDown={handleKeyDown}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX: shouldReduceMotion ? 0 : springRotateX,
          rotateY: shouldReduceMotion ? (isFlipped ? 180 : 0) : springRotateY,
          transformStyle: "preserve-3d",
        }}
        className="group relative min-h-[210px] w-full cursor-pointer rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white"
      >
        {/* Front Face */}
        <div
          style={{ backfaceVisibility: "hidden" }}
          className="relative flex min-h-[210px] flex-col justify-between overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition-colors group-hover:border-neutral-400 dark:border-[#222222] dark:bg-[#0A0A0A] dark:group-hover:border-[#383838]"
        >
          <motion.div
            aria-hidden="true"
            style={{
              background: glareBackground,
              opacity: isHovered && !isFlipped ? 1 : 0,
            }}
            className="pointer-events-none absolute inset-0 transition-opacity duration-300"
          />

          {front || (
            <>
              <div className="relative z-10 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-black dark:border-[#262626] dark:bg-[#141414] dark:text-white">
                  <Sparkles className="h-3 w-3" />
                  3D Specular Surface
                </span>
                <RotateCw className="h-4 w-4 text-neutral-400 transition-transform group-hover:rotate-45 group-hover:text-black dark:group-hover:text-white" />
              </div>

              <div className="relative z-10 mt-6">
                <div className="text-base font-semibold text-black dark:text-white">
                  Holographic Flip Card
                </div>
                <p className="mt-1 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
                  Hover for coupled 3D perspective tilt &amp; foil sheen. Click or
                  press Enter to flip 180° around the Y-axis.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Back Face */}
        <div
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
          className="absolute inset-0 flex min-h-[210px] flex-col justify-between overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950 p-6 text-white shadow-sm dark:border-neutral-200 dark:bg-white dark:text-black"
        >
          {back || (
            <>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold text-neutral-300 dark:text-neutral-600">
                  <Terminal className="h-3.5 w-3.5" />
                  SPRING_TELEMETRY
                </span>
                <RotateCw className="h-4 w-4 text-neutral-400" />
              </div>

              <div className="my-auto space-y-2 font-mono text-xs">
                <div className="flex justify-between border-b border-white/10 pb-1.5 dark:border-black/10">
                  <span className="text-neutral-400 dark:text-neutral-500">
                    stiffness:
                  </span>
                  <span className="font-semibold">{stiffness} N/m</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-1.5 dark:border-black/10">
                  <span className="text-neutral-400 dark:text-neutral-500">
                    damping:
                  </span>
                  <span className="font-semibold">{damping} Ns/m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400 dark:text-neutral-500">
                    maxTilt:
                  </span>
                  <span className="font-semibold">±{maxTilt}°</span>
                </div>
              </div>

              <div className="text-[11px] text-neutral-400 dark:text-neutral-500">
                Click or press Space to return to front
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default HolographicFlipCard;

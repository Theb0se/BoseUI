"use client";

import React, { useRef, useState } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useReducedMotion,
  type HTMLMotionProps,
} from "framer-motion";
import { cn } from "@/lib/utils";

export interface SpotlightCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  /** Primary radial spotlight color. Default: "rgba(128, 128, 128, 0.14)" */
  spotlightColor?: string;
  /** Border highlight color on pointer proximity. Default: "rgba(128, 128, 128, 0.55)" */
  borderColor?: string;
  /** Radius of the radial spotlight in pixels. Default: 320 */
  spotlightRadius?: number;
  /** Enable subtle 3D tilt when moving pointer across card. Default: false */
  enableTilt?: boolean;
}

export function SpotlightCard({
  children,
  className,
  spotlightColor = "rgba(128, 128, 128, 0.14)",
  borderColor = "rgba(128, 128, 128, 0.55)",
  spotlightRadius = 320,
  enableTilt = false,
  onMouseMove,
  onMouseEnter,
  onMouseLeave,
  ...props
}: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);

  const smoothX = useSpring(mouseX, { stiffness: 320, damping: 28, mass: 0.25 });
  const smoothY = useSpring(mouseY, { stiffness: 320, damping: 28, mass: 0.25 });

  const rotateX = useSpring(useMotionValue(0), { stiffness: 200, damping: 22 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 200, damping: 22 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    mouseX.set(x);
    mouseY.set(y);

    if (enableTilt && !shouldReduceMotion) {
      const pctX = (x / rect.width - 0.5) * 2;
      const pctY = (y / rect.height - 0.5) * 2;
      rotateX.set(-pctY * 4);
      rotateY.set(pctX * 4);
    }

    onMouseMove?.(e);
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsHovered(true);
    onMouseEnter?.(e);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsHovered(false);
    rotateX.set(0);
    rotateY.set(0);
    onMouseLeave?.(e);
  };

  const activeX = shouldReduceMotion ? mouseX : smoothX;
  const activeY = shouldReduceMotion ? mouseY : smoothY;

  const surfaceBackground = useMotionTemplate`radial-gradient(${spotlightRadius}px circle at ${activeX}px ${activeY}px, ${spotlightColor}, transparent 80%)`;
  const borderBackground = useMotionTemplate`radial-gradient(${
    spotlightRadius * 0.75
  }px circle at ${activeX}px ${activeY}px, ${borderColor}, transparent 100%)`;

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: enableTilt && !shouldReduceMotion ? rotateX : 0,
        rotateY: enableTilt && !shouldReduceMotion ? rotateY : 0,
        transformPerspective: 1000,
      }}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6 transition-colors duration-300 hover:border-neutral-400 dark:border-[#222222] dark:bg-[#0A0A0A] dark:hover:border-[#383838]",
        className
      )}
      {...props}
    >
      {/* Dynamic illuminated 1px border overlay */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-px rounded-2xl transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: borderBackground,
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          padding: "1px",
        }}
      />

      {/* Ambient surface spotlight */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: surfaceBackground,
        }}
      />

      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

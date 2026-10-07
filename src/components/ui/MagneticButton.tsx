"use client";

import React, { useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
  type HTMLMotionProps,
} from "framer-motion";
import { cn } from "@/lib/utils";

export interface MagneticButtonProps
  extends Omit<HTMLMotionProps<"button">, "children"> {
  children: React.ReactNode;
  /** Pull intensity multiplier (0.1 to 1). Default: 0.35 */
  strength?: number;
  /** Spring stiffness. Default: 180 */
  stiffness?: number;
  /** Spring damping. Default: 15 */
  damping?: number;
  /** Spring mass. Default: 0.2 */
  mass?: number;
  /** Visual style preset */
  variant?: "primary" | "secondary" | "outline" | "glow";
  /** Size preset */
  size?: "sm" | "md" | "lg";
}

export function MagneticButton({
  children,
  className,
  strength = 0.35,
  stiffness = 180,
  damping = 15,
  mass = 0.2,
  variant = "primary",
  size = "md",
  onMouseMove,
  onMouseLeave,
  ...props
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  const springConfig = { stiffness, damping, mass };
  const x = useSpring(rawX, springConfig);
  const y = useSpring(rawY, springConfig);

  const innerX = useSpring(useMotionValue(0), {
    stiffness: stiffness * 1.2,
    damping,
    mass,
  });
  const innerY = useSpring(useMotionValue(0), {
    stiffness: stiffness * 1.2,
    damping,
    mass,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current || shouldReduceMotion) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) * strength;
    const deltaY = (e.clientY - centerY) * strength;

    rawX.set(deltaX);
    rawY.set(deltaY);
    innerX.set(deltaX * 0.35);
    innerY.set(deltaY * 0.35);

    onMouseMove?.(e);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsHovered(false);
    rawX.set(0);
    rawY.set(0);
    innerX.set(0);
    innerY.set(0);
    onMouseLeave?.(e);
  };

  const variantStyles: Record<
    NonNullable<MagneticButtonProps["variant"]>,
    string
  > = {
    primary:
      "bg-black text-white hover:bg-neutral-800 border border-black dark:bg-white dark:text-black dark:hover:bg-neutral-200 dark:border-white",
    secondary:
      "bg-neutral-100 text-black hover:bg-neutral-200 border border-neutral-200 dark:bg-[#141414] dark:text-white dark:hover:bg-[#1F1F1F] dark:border-[#262626]",
    outline:
      "bg-transparent text-black border border-neutral-300 hover:border-black hover:bg-black/5 dark:text-white dark:border-[#262626] dark:hover:border-white dark:hover:bg-white/5",
    glow:
      "bg-white text-black border border-black/40 hover:border-black shadow-sm dark:bg-[#0A0A0A] dark:text-white dark:border-white/40 dark:hover:border-white dark:shadow-[0_0_24px_-4px_rgba(255,255,255,0.22)]",
  };

  const sizeStyles: Record<NonNullable<MagneticButtonProps["size"]>, string> = {
    sm: "px-3.5 py-2 text-xs rounded-lg gap-1.5",
    md: "px-5 py-2.5 text-sm rounded-xl gap-2",
    lg: "px-6 py-3 text-sm rounded-xl gap-2.5",
  };

  return (
    <motion.button
      ref={ref}
      type="button"
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        x: shouldReduceMotion ? 0 : x,
        y: shouldReduceMotion ? 0 : y,
      }}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
      className={cn(
        "relative inline-flex items-center justify-center font-medium tracking-tight transition-colors duration-200 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white focus-visible:ring-offset-2",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300",
          isHovered ? "opacity-100" : "opacity-0"
        )}
        style={{
          background:
            "radial-gradient(circle at center, rgba(128,128,128,0.12), transparent 70%)",
        }}
      />

      <motion.span
        style={{
          x: shouldReduceMotion ? 0 : innerX,
          y: shouldReduceMotion ? 0 : innerY,
        }}
        className="relative z-10 inline-flex items-center gap-2"
      >
        {children}
      </motion.span>
    </motion.button>
  );
}

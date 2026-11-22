"use client";

import React, {
  forwardRef,
  useState,
  useId,
  useEffect,
  type FocusEvent,
  type MouseEvent,
  type ReactNode,
} from "react";
import {
  motion,
  useReducedMotion,
  type HTMLMotionProps,
  type Transition,
} from "framer-motion";
import { cn } from "@/lib/utils";

// ============================================================================
// CONSTANTS & SPRING PHYSICS
// ============================================================================

export const EASE_OUT = [0.16, 1, 0.3, 1] as const;

export const SPRING_LAYOUT: Transition = {
  type: "spring",
  stiffness: 420,
  damping: 30,
  mass: 0.8,
};

export const SPRING_PRESS: Transition = {
  type: "spring",
  stiffness: 600,
  damping: 35,
};

// ============================================================================
// HOOKS
// ============================================================================

/**
 * Detects whether the current device supports hover interactions.
 * Prevents sticky hover states on touch screens.
 */
export function useHoverCapable(): boolean {
  const [canHover, setCanHover] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia("(hover: hover)");
    setCanHover(mql.matches);

    const handler = (e: MediaQueryListEvent) => setCanHover(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  return canHover;
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

/**
 * Clean 5-dot chevron icon displayed in the idle collapsed pill.
 */
function DottedChevron({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 28"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <circle cx="4" cy="4" r="2" fill="currentColor" />
      <circle cx="10" cy="9" r="2" fill="currentColor" />
      <circle cx="16" cy="14" r="2" fill="currentColor" />
      <circle cx="10" cy="19" r="2" fill="currentColor" />
      <circle cx="4" cy="24" r="2" fill="currentColor" />
    </svg>
  );
}

/**
 * Kinetic ordered Bayer dithering matrix and pulsing stipple waves.
 */
function AnimatedDitherPattern({
  active,
  reduce,
  className,
}: {
  active: boolean;
  reduce: boolean | null;
  className?: string;
}) {
  const patternId = useId();

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden select-none",
        className
      )}
      aria-hidden="true"
    >
      <svg className="h-full w-full" preserveAspectRatio="none">
        <defs>
          {/* Bayer 4x4 matrix ordered stipple dither pattern */}
          <pattern
            id={patternId}
            width="16"
            height="16"
            patternUnits="userSpaceOnUse"
          >
            {/* Core Bayer matrix coordinates with dynamic dot radiuses */}
            <circle cx="2" cy="2" r="1.5" fill="currentColor" opacity="0.35" />
            <circle cx="10" cy="2" r="1.1" fill="currentColor" opacity="0.25" />
            <circle cx="6" cy="6" r="0.9" fill="currentColor" opacity="0.2" />
            <circle cx="14" cy="6" r="1.6" fill="currentColor" opacity="0.4" />
            <circle cx="2" cy="10" r="1.2" fill="currentColor" opacity="0.3" />
            <circle cx="10" cy="10" r="1.7" fill="currentColor" opacity="0.45" />
            <circle cx="6" cy="14" r="1.4" fill="currentColor" opacity="0.35" />
            <circle cx="14" cy="14" r="1.0" fill="currentColor" opacity="0.25" />

            {/* Intermediate threshold points */}
            <circle cx="6" cy="2" r="0.75" fill="currentColor" opacity="0.15" />
            <circle cx="14" cy="2" r="1.3" fill="currentColor" opacity="0.3" />
            <circle cx="2" cy="6" r="1.4" fill="currentColor" opacity="0.35" />
            <circle cx="10" cy="6" r="0.8" fill="currentColor" opacity="0.18" />
            <circle cx="6" cy="10" r="1.5" fill="currentColor" opacity="0.38" />
            <circle cx="14" cy="10" r="0.9" fill="currentColor" opacity="0.2" />
            <circle cx="2" cy="14" r="1.1" fill="currentColor" opacity="0.25" />
            <circle cx="10" cy="14" r="1.5" fill="currentColor" opacity="0.38" />
          </pattern>
        </defs>

        {/* Scrolling tiled Bayer dither background */}
        <motion.rect
          x="0"
          y="0"
          width="200%"
          height="100%"
          fill={`url(#${patternId})`}
          animate={
            active && !reduce
              ? { x: [0, -16] }
              : { x: 0 }
          }
          transition={{
            duration: 0.9,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </svg>

      {/* Kinetic Stipple Wave Columns across the pill width */}
      <div className="absolute inset-0 flex items-center justify-around px-2">
        {Array.from({ length: 14 }).map((_, colIdx) => (
          <motion.div
            key={colIdx}
            initial={{ opacity: 0, scaleY: 0.5 }}
            animate={
              active
                ? {
                    opacity: reduce ? 0.35 : [0.15, 0.45, 0.15],
                    scaleY: reduce ? 1 : [0.7, 1.15, 0.7],
                  }
                : { opacity: 0, scaleY: 0.5 }
            }
            transition={
              reduce
                ? { duration: 0.1 }
                : {
                    duration: 1.6,
                    repeat: Infinity,
                    delay: colIdx * 0.07,
                    ease: "easeInOut",
                  }
            }
            className="flex flex-col items-center gap-1"
          >
            <span className="h-1 w-1 rounded-full bg-current opacity-60" />
            <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />
            <span className="h-2 w-2 rounded-full bg-current opacity-95" />
            <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />
            <span className="h-1 w-1 rounded-full bg-current opacity-60" />
          </motion.div>
        ))}
      </div>

      {/* Shimmer sweep gradient highlight */}
      <motion.div
        animate={
          active && !reduce
            ? { x: ["-100%", "200%"] }
            : { x: "-100%" }
        }
        transition={{
          duration: 1.8,
          repeat: Infinity,
          repeatDelay: 0.5,
          ease: "easeInOut",
        }}
        className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/20 to-transparent"
      />
    </div>
  );
}

// ============================================================================
// TYPES
// ============================================================================

export interface ExpandingArrowButtonProps
  extends Omit<HTMLMotionProps<"button">, "children"> {
  /** Text or content displayed inside the button */
  children: ReactNode;
  /** Custom classes for the expanding accent pill. Default: "bg-lime-300 text-neutral-950" */
  accentClassName?: string;
  /** Custom classes for the default (unexpanded) label text */
  labelClassName?: string;
  /** Custom classes for the label text when expanded over the dither surface */
  expandedLabelClassName?: string;
  /** Whether to show the text label over the dither pattern when expanded. Default: true */
  showLabelOnExpand?: boolean;
  /** Custom classes for the animated dither pattern container */
  ditherClassName?: string;
  /** Spring stiffness for the expansion physics. Default: 420 */
  stiffness?: number;
  /** Spring damping for the expansion physics. Default: 30 */
  damping?: number;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const ExpandingArrowButton = forwardRef<
  HTMLButtonElement,
  ExpandingArrowButtonProps
>(function ExpandingArrowButton(
  {
    children,
    className,
    accentClassName,
    labelClassName,
    expandedLabelClassName,
    showLabelOnExpand = true,
    ditherClassName,
    stiffness = 420,
    damping = 30,
    disabled,
    onMouseEnter,
    onMouseLeave,
    onFocus,
    onBlur,
    ...rest
  },
  ref
) {
  const reduce = useReducedMotion();
  const canHover = useHoverCapable();
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);

  const active = !disabled && ((canHover && hovered) || focused);

  const layoutTransition: Transition = reduce
    ? { duration: 0 }
    : {
        type: "spring",
        stiffness,
        damping,
        mass: 0.8,
      };

  const handleMouseEnter = (event: MouseEvent<HTMLButtonElement>) => {
    setHovered(true);
    onMouseEnter?.(event);
  };

  const handleMouseLeave = (event: MouseEvent<HTMLButtonElement>) => {
    setHovered(false);
    onMouseLeave?.(event);
  };

  const handleFocus = (event: FocusEvent<HTMLButtonElement>) => {
    setFocused(true);
    onFocus?.(event);
  };

  const handleBlur = (event: FocusEvent<HTMLButtonElement>) => {
    setFocused(false);
    onBlur?.(event);
  };

  return (
    <motion.button
      ref={ref}
      type="button"
      disabled={disabled}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      whileTap={reduce || disabled ? undefined : { scale: 0.97 }}
      transition={SPRING_PRESS}
      className={cn(
        "relative inline-flex h-16 min-w-72 items-center overflow-hidden rounded-[22px] bg-neutral-950 p-1.5 text-white select-none shadow-md",
        "outline-hidden focus-visible:ring-2 focus-visible:ring-lime-300 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...rest}
    >
      {/* Expanding Accent Pill */}
      <motion.span
        layout="size"
        aria-hidden="true"
        transition={layoutTransition}
        style={{
          width: active ? "calc(100% - 12px)" : 52,
          borderRadius: 16,
        }}
        className={cn(
          "absolute inset-y-1.5 left-1.5 z-10 overflow-hidden bg-lime-300 text-neutral-950 shadow-xs",
          accentClassName
        )}
      >
        {/* Idle 5-Dot Chevron (fades out on expand) */}
        <motion.span
          animate={{
            opacity: active ? 0 : 1,
            scale: active ? 0.8 : 1,
          }}
          transition={{ duration: reduce ? 0 : 0.12, ease: EASE_OUT }}
          className="absolute inset-0 grid place-items-center"
        >
          <DottedChevron className="h-7 w-5" />
        </motion.span>

        {/* Animated Dither Pattern (activates on expand) */}
        <AnimatedDitherPattern
          active={active}
          reduce={reduce}
          className={ditherClassName}
        />

        {/* Text displayed over expanded dither pill */}
        {showLabelOnExpand && (
          <motion.span
            animate={{
              opacity: active ? 1 : 0,
              transform:
                active && !reduce ? "translateX(0px)" : "translateX(-10px)",
            }}
            transition={{
              duration: reduce ? 0 : 0.18,
              delay: active && !reduce ? 0.05 : 0,
              ease: EASE_OUT,
            }}
            className={cn(
              "absolute inset-0 z-20 flex items-center justify-center px-6 text-lg font-bold tracking-[-0.02em] text-neutral-950",
              expandedLabelClassName
            )}
          >
            {children}
          </motion.span>
        )}
      </motion.span>

      {/* Base unexpanded text label (fades out as pill expands) */}
      <motion.span
        animate={{
          opacity: active ? 0 : 1,
          transform: active && !reduce ? "translateX(6px)" : "translateX(0px)",
        }}
        transition={{ duration: reduce ? 0 : 0.12, ease: EASE_OUT }}
        className={cn(
          "relative z-0 ml-[76px] mr-5 whitespace-nowrap text-lg font-medium tracking-[-0.02em]",
          labelClassName
        )}
      >
        {children}
      </motion.span>
    </motion.button>
  );
});

export const ExpandingDitherButton = ExpandingArrowButton;

export default ExpandingArrowButton;

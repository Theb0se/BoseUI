"use client";

import React, { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { cn } from "@/lib/utils";

export interface TextHoverLensProps {
  /**
   * The text string to display and reveal through the interactive lens.
   */
  text: string;
  /**
   * Background color of the circular lens. Accepts any CSS color (hex, rgb, hsl, CSS variable).
   * @default "#000000" (site accent teal)
   */
  lensColor?: string;
  /**
   * Color of the revealed text inside the lens. Must have AA contrast against lensColor.
   * @default "#ffffff"
   */
  lensTextColor?: string;
  /**
   * Color of the text outside the lens.
   * @default "currentColor"
   */
  textColor?: string;
  /**
   * Diameter of the circular lens in pixels when fully open.
   * @default 120
   */
  lensSize?: number;
  /**
   * Scale multiplier for the text inside the lens. 1 = no zoom, 1.2 = slight magnification.
   * @default 1
   */
  magnify?: number;
  /**
   * Hooke's Law spring stiffness coefficient for cursor following and radius expansion.
   * Matches the Snappy spring preset.
   * @default 380
   */
  stiffness?: number;
  /**
   * Spring damping coefficient controlling oscillation decay.
   * Matches the Snappy spring preset.
   * @default 24
   */
  damping?: number;
  /**
   * Additional Tailwind or CSS classes applied to the outer wrapper element.
   * Allows typography sizing, font weight, line height, and tracking to be inherited from the parent.
   */
  className?: string;
}

/**
 * TextHoverLens renders an interactive text element where hovering opens a circular lens
 * under the cursor driven by physics springs. Inside the circle, a contrasting text layer
 * is revealed with optional magnification.
 */
export function TextHoverLens({
  text,
  lensColor = "#000000",
  lensTextColor = "#ffffff",
  textColor = "currentColor",
  lensSize = 60,
  magnify = 1,
  stiffness = 380,
  damping = 24,
  className,
}: TextHoverLensProps) {
  const containerRef = useRef<HTMLSpanElement | null>(null);
  const shouldReduceMotion = useReducedMotion();

  // Pointer position motion values (relative to container bounding rect)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const targetRadius = useMotionValue(0);

  // Snappy spring configuration for physics cursor follow and radius expansion
  const springConfig = { stiffness, damping };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);
  const springRadius = useSpring(targetRadius, springConfig);

  // Fallback to instant coordinates when prefers-reduced-motion is active
  const activeX = shouldReduceMotion ? mouseX : springX;
  const activeY = shouldReduceMotion ? mouseY : springY;
  const activeRadius = shouldReduceMotion ? targetRadius : springRadius;

  // Clip-path string for the circular revealing lens (clamped to prevent negative radius)
  const clipPath = useTransform(
    [activeRadius, activeX, activeY],
    ([r, x, y]) => {
      const safeRadius = Math.max(0, Number(r));
      return `circle(${safeRadius}px at ${x}px ${y}px)`;
    }
  );

  // Transform origin pinned to current cursor position for seamless magnification
  const transformOrigin = useTransform(
    [activeX, activeY],
    ([x, y]) => `${x}px ${y}px`
  );

  const updateCoordinates = (e: React.PointerEvent<HTMLElement>) => {
    const el = containerRef.current;
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mouseX.set(x);
    mouseY.set(y);
    return { x, y };
  };

  const handlePointerEnter = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType === "touch") return;
    const coords = updateCoordinates(e);
    if (coords) {
      if (typeof springX.jump === "function") {
        springX.jump(coords.x);
        springY.jump(coords.y);
      }
    }
    targetRadius.set(lensSize / 2);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    updateCoordinates(e);
  };

  const handlePointerLeave = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType === "touch") return;
    targetRadius.set(0);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType === "touch") {
      const coords = updateCoordinates(e);
      if (coords && typeof springX.jump === "function") {
        springX.jump(coords.x);
        springY.jump(coords.y);
      }
      targetRadius.set(lensSize / 2);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType === "touch") {
      targetRadius.set(0);
    }
  };

  const handlePointerCancel = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType === "touch") {
      targetRadius.set(0);
    }
  };

  return (
    <span
      ref={containerRef}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      className={cn(
        "relative inline-block select-text cursor-default leading-normal",
        className
      )}
      style={{ color: textColor }}
    >
      {/* 1. Base Layer: Screen-reader readable, selectable, standard color */}
      <span className="block">{text}</span>

      {/* 2. Lens Layer: Clipped circular viewport revealing lens color and lensTextColor */}
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 block select-none overflow-hidden"
        style={{
          clipPath,
          backgroundColor: lensColor,
          color: lensTextColor,
        }}
      >
        <motion.span
          className="block h-full w-full"
          style={{
            transformOrigin,
            transform: magnify !== 1 ? `scale(${magnify})` : undefined,
          }}
        >
          {text}
        </motion.span>
      </motion.span>
    </span>
  );
}

export default TextHoverLens;

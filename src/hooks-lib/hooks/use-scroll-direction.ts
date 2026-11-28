"use client";

import { useEffect, useRef, useState } from "react";

export type ScrollDirection = "up" | "down" | null;

/**
 * Detects whether the user is scrolling `"up"` or `"down"` once movement
 * exceeds `threshold` pixels.
 *
 * @param threshold - Minimum pixel delta before changing direction (default: `8`).
 * @returns `"up" | "down" | null`.
 */
export function useScrollDirection(threshold = 8): ScrollDirection {
  const [direction, setDirection] = useState<ScrollDirection>(null);
  const lastYRef = useRef<number>(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    lastYRef.current = window.scrollY;

    const handleScroll = () => {
      const currentY = window.scrollY;
      const diff = currentY - lastYRef.current;

      if (Math.abs(diff) < threshold) return;

      setDirection(diff > 0 ? "down" : "up");
      lastYRef.current = Math.max(0, currentY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  return direction;
}

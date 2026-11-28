"use client";

import { useEffect, useState } from "react";

export type TailwindBreakpoint = "base" | "sm" | "md" | "lg" | "xl" | "2xl";

function getBreakpointFromWidth(width: number): TailwindBreakpoint {
  if (width >= 1536) return "2xl";
  if (width >= 1280) return "xl";
  if (width >= 1024) return "lg";
  if (width >= 768) return "md";
  if (width >= 640) return "sm";
  return "base";
}

/**
 * Returns the active Tailwind CSS viewport breakpoint (`"base"`, `"sm"`, `"md"`, `"lg"`, `"xl"`, `"2xl"`).
 * SSR-safe: returns `defaultBreakpoint` during server render and initial hydration.
 *
 * @param defaultBreakpoint - Initial breakpoint before hydration (default: `"base"`).
 * @returns Current Tailwind breakpoint key.
 */
export function useBreakpoint(
  defaultBreakpoint: TailwindBreakpoint = "base"
): TailwindBreakpoint {
  const [breakpoint, setBreakpoint] =
    useState<TailwindBreakpoint>(defaultBreakpoint);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const update = () => {
      setBreakpoint(getBreakpointFromWidth(window.innerWidth));
    };

    update();
    window.addEventListener("resize", update, { passive: true });
    return () => window.removeEventListener("resize", update);
  }, []);

  return breakpoint;
}

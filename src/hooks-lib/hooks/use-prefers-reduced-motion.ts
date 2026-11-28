"use client";

import { useEffect, useState } from "react";

/**
 * Tracks the user's `(prefers-reduced-motion: reduce)` accessibility preference.
 * SSR-safe: defaults to `false` on the server and syncs on mount.
 *
 * @param defaultReduced - Fallback value before hydration (default: `false`).
 * @returns `true` if reduced motion is preferred.
 */
export function usePrefersReducedMotion(defaultReduced = false): boolean {
  const [reduced, setReduced] = useState<boolean>(defaultReduced);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return;
    }

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setReduced(event.matches);
    };

    if (typeof mq.addEventListener === "function") {
      mq.addEventListener("change", handleChange);
      return () => mq.removeEventListener("change", handleChange);
    }

    mq.addListener(handleChange);
    return () => mq.removeListener(handleChange);
  }, []);

  return reduced;
}

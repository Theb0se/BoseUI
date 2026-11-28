"use client";

import { useEffect, useState } from "react";

/**
 * Subscribes to a CSS media query string and returns whether it currently matches.
 * SSR-safe: returns `defaultValue` during server render and initial hydration,
 * then updates cleanly on mount and viewport changes.
 *
 * @param query - CSS media query string (e.g. `"(min-width: 768px)"`).
 * @param defaultValue - Initial value before client hydration (default: `false`).
 * @returns `true` if the media query matches, otherwise `false`.
 */
export function useMediaQuery(query: string, defaultValue = false): boolean {
  const [matches, setMatches] = useState<boolean>(defaultValue);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return;
    }

    const mediaQueryList = window.matchMedia(query);
    setMatches(mediaQueryList.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    if (typeof mediaQueryList.addEventListener === "function") {
      mediaQueryList.addEventListener("change", handleChange);
      return () => mediaQueryList.removeEventListener("change", handleChange);
    }

    // Legacy Safari fallback
    mediaQueryList.addListener(handleChange);
    return () => mediaQueryList.removeListener(handleChange);
  }, [query]);

  return matches;
}

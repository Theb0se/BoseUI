"use client";

import { useEffect, useState } from "react";

export interface WindowSize {
  width: number;
  height: number;
}

/**
 * Tracks the browser viewport `width` and `height` on resize.
 * SSR-safe: initializes to `{ width: 0, height: 0 }` during SSR and updates on mount.
 *
 * @returns `{ width, height }`.
 */
export function useWindowSize(): WindowSize {
  const [size, setSize] = useState<WindowSize>({ width: 0, height: 0 });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    handleResize();
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return size;
}

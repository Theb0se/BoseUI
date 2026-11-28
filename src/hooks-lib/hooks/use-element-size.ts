"use client";

import { useCallback, useEffect, useState, type RefObject } from "react";

export interface ElementSize {
  width: number;
  height: number;
}

/**
 * Measures the `width` and `height` (in pixels) of a referenced DOM element
 * and stays updated via `ResizeObserver` and window `resize` events.
 *
 * @param ref - React ref attached to the target HTML element.
 * @returns `{ width, height }`.
 */
export function useElementSize<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T | null>
): ElementSize {
  const [size, setSize] = useState<ElementSize>({ width: 0, height: 0 });

  const updateSize = useCallback(() => {
    const node = ref.current;
    if (!node) return;
    setSize({
      width: node.offsetWidth,
      height: node.offsetHeight,
    });
  }, [ref]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const node = ref.current;
    if (!node) return;

    updateSize();

    if (typeof ResizeObserver !== "undefined") {
      const observer = new ResizeObserver(() => updateSize());
      observer.observe(node);
      return () => observer.disconnect();
    }

    window.addEventListener("resize", updateSize, { passive: true });
    return () => window.removeEventListener("resize", updateSize);
  }, [ref, updateSize]);

  return size;
}

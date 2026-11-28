"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

export interface ResizeObserverEntrySize {
  width: number;
  height: number;
  entry: ResizeObserverEntry | null;
}

/**
 * Observes size changes on a referenced DOM element using `ResizeObserver`.
 * Cleans up the observer on unmount and invokes an optional callback via ref.
 *
 * @param ref - React ref to the target element.
 * @param onResize - Optional callback fired whenever the element resizes.
 * @returns `{ width, height, entry }`.
 */
export function useResizeObserver<T extends Element = Element>(
  ref: RefObject<T | null>,
  onResize?: (entry: ResizeObserverEntry) => void
): ResizeObserverEntrySize {
  const [size, setSize] = useState<ResizeObserverEntrySize>({
    width: 0,
    height: 0,
    entry: null,
  });

  const onResizeRef = useRef(onResize);
  useEffect(() => {
    onResizeRef.current = onResize;
  }, [onResize]);

  useEffect(() => {
    if (typeof window === "undefined" || typeof ResizeObserver === "undefined") {
      return;
    }

    const node = ref.current;
    if (!node) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { width, height } = entry.contentRect;
      setSize({
        width: Math.round(width),
        height: Math.round(height),
        entry,
      });
      onResizeRef.current?.(entry);
    });

    observer.observe(node);
    return () => observer.disconnect();
  }, [ref]);

  return size;
}

"use client";

import { useEffect, useState, type RefObject } from "react";

export interface ScrollPosition {
  x: number;
  y: number;
}

/**
 * Tracks the `x` and `y` scroll coordinates of the window or a scrollable container ref.
 * SSR-safe: starts at `{ x: 0, y: 0 }` and updates on mount and scroll events.
 *
 * @param ref - Optional scrollable element ref (defaults to `window`).
 * @returns `{ x, y }`.
 */
export function useScrollPosition<T extends HTMLElement = HTMLElement>(
  ref?: RefObject<T | null>
): ScrollPosition {
  const [position, setPosition] = useState<ScrollPosition>({ x: 0, y: 0 });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const target = ref?.current;

    const handleScroll = () => {
      if (target) {
        setPosition({ x: target.scrollLeft, y: target.scrollTop });
      } else {
        setPosition({ x: window.scrollX, y: window.scrollY });
      }
    };

    handleScroll();

    const listenerTarget: EventTarget = target ?? window;
    listenerTarget.addEventListener("scroll", handleScroll, { passive: true });
    return () => listenerTarget.removeEventListener("scroll", handleScroll);
  }, [ref]);

  return position;
}

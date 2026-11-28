"use client";

import { useEffect, useState, type RefObject } from "react";

export interface MousePosition {
  x: number;
  y: number;
}

/**
 * Tracks cursor coordinates (`x`, `y`) relative to the viewport or an optional
 * target element ref.
 *
 * @param ref - Optional element ref for local relative coordinates.
 * @returns `{ x, y }`.
 */
export function useMousePosition<T extends HTMLElement = HTMLElement>(
  ref?: RefObject<T | null>
): MousePosition {
  const [position, setPosition] = useState<MousePosition>({ x: 0, y: 0 });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const target = ref?.current;

    const handleMouseMove = (event: MouseEvent) => {
      if (target) {
        const rect = target.getBoundingClientRect();
        setPosition({
          x: Math.round(event.clientX - rect.left),
          y: Math.round(event.clientY - rect.top),
        });
      } else {
        setPosition({ x: event.clientX, y: event.clientY });
      }
    };

    const listenerTarget: EventTarget = target ?? window;
    listenerTarget.addEventListener(
      "mousemove",
      handleMouseMove as EventListener,
      { passive: true }
    );

    return () => {
      listenerTarget.removeEventListener(
        "mousemove",
        handleMouseMove as EventListener
      );
    };
  }, [ref]);

  return position;
}

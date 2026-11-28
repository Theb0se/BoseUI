"use client";

import { useEffect, useRef, type RefObject } from "react";

/**
 * Invokes a handler when a pointer down or touch start occurs outside the
 * referenced element (or array of referenced elements).
 * Uses a ref for the handler to prevent stale closures without re-subscribing.
 *
 * @param ref - A React ref (or array of refs) to treat as "inside".
 * @param handler - Callback executed when an outside click/tap occurs.
 * @param enabled - Whether the listener is active (default: `true`).
 */
export function useClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T | null> | Array<RefObject<T | null>>,
  handler: (event: MouseEvent | TouchEvent) => void,
  enabled = true
): void {
  const handlerRef = useRef(handler);

  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    if (!enabled || typeof document === "undefined") return;

    const listener = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node | null;
      if (!target || !target.isConnected) return;

      const refs = Array.isArray(ref) ? ref : [ref];
      const isInside = refs.some((r) => {
        const el = r.current;
        return el !== null && el.contains(target);
      });

      if (!isInside) {
        handlerRef.current(event);
      }
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener, { passive: true });

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, enabled]);
}

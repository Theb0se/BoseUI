"use client";

import { useLayoutEffect } from "react";

/**
 * Prevents background page scrolling while `locked` is `true` (commonly used in modals/overlays).
 * Restores the previous `overflow` style automatically on unlock or unmount.
 *
 * @param locked - Whether body scroll should be locked (default: `true`).
 */
export function useLockBodyScroll(locked = true): void {
  useLayoutEffect(() => {
    if (!locked || typeof document === "undefined") return;

    const originalOverflow = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [locked]);
}

"use client";

import { useCallback, useEffect, useState, type RefObject } from "react";

export interface UseFullscreenReturn {
  isFullscreen: boolean;
  enter: () => Promise<void>;
  exit: () => Promise<void>;
  toggle: () => Promise<void>;
}

/**
 * Manages entering, exiting, and toggling the browser Fullscreen API for a
 * referenced element (or `document.documentElement` when omitted).
 *
 * @param ref - Optional target element ref to make fullscreen.
 * @returns `{ isFullscreen, enter, exit, toggle }`.
 */
export function useFullscreen<T extends HTMLElement = HTMLElement>(
  ref?: RefObject<T | null>
): UseFullscreenReturn {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (typeof document === "undefined") return;

    const handleChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener("fullscreenchange", handleChange);
    return () => document.removeEventListener("fullscreenchange", handleChange);
  }, []);

  const enter = useCallback(async () => {
    if (typeof document === "undefined") return;
    const target = ref?.current ?? document.documentElement;
    if (!target || typeof target.requestFullscreen !== "function") return;
    try {
      await target.requestFullscreen();
    } catch {
      // Ignore fullscreen permission rejections
    }
  }, [ref]);

  const exit = useCallback(async () => {
    if (typeof document === "undefined" || !document.fullscreenElement) return;
    try {
      await document.exitFullscreen();
    } catch {
      // Ignore exit errors
    }
  }, []);

  const toggle = useCallback(async () => {
    if (typeof document === "undefined") return;
    if (document.fullscreenElement) {
      await exit();
    } else {
      await enter();
    }
  }, [enter, exit]);

  return { isFullscreen, enter, exit, toggle };
}

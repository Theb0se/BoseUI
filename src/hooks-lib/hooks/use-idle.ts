"use client";

import { useEffect, useRef, useState } from "react";

const DEFAULT_EVENTS: Array<keyof WindowEventMap> = [
  "mousemove",
  "mousedown",
  "keydown",
  "touchstart",
  "scroll",
];

/**
 * Detects user inactivity after `timeoutMs` milliseconds without pointer,
 * keyboard, touch, or scroll activity.
 *
 * @param timeoutMs - Inactivity threshold in milliseconds (default: `5000`).
 * @param events - Window events that reset the idle timer.
 * @returns `true` when the user is idle.
 */
export function useIdle(
  timeoutMs = 5000,
  events: Array<keyof WindowEventMap> = DEFAULT_EVENTS
): boolean {
  const [isIdle, setIsIdle] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const resetTimer = () => {
      setIsIdle(false);
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(() => {
        setIsIdle(true);
      }, Math.max(0, timeoutMs));
    };

    resetTimer();

    for (const eventName of events) {
      window.addEventListener(eventName, resetTimer, { passive: true });
    }

    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
      for (const eventName of events) {
        window.removeEventListener(eventName, resetTimer);
      }
    };
  }, [timeoutMs, events]);

  return isIdle;
}

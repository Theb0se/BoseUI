"use client";

import { useEffect, useRef } from "react";

/**
 * Declarative `setInterval` hook that supports pausing (pass `delay = null`),
 * cleans up automatically on unmount, and always runs the latest callback ref.
 *
 * @param callback - Function invoked on each interval tick.
 * @param delay - Interval in milliseconds, or `null` to pause.
 */
export function useInterval(callback: () => void, delay: number | null): void {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;

    const id = setInterval(() => {
      savedCallback.current();
    }, Math.max(0, delay));

    return () => {
      clearInterval(id);
    };
  }, [delay]);
}

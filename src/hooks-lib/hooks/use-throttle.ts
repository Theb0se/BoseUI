"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Throttles a reactive value so it updates at most once per `interval` ms,
 * while guaranteeing the trailing value is eventually emitted.
 *
 * @param value - The value to throttle.
 * @param interval - Minimum interval between updates in milliseconds (default: 300ms).
 * @returns The throttled value.
 */
export function useThrottle<T>(value: T, interval = 300): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastExecutedRef = useRef<number>(0);

  useEffect(() => {
    const now = Date.now();
    const elapsed = now - lastExecutedRef.current;
    const safeInterval = Math.max(0, interval);

    if (elapsed >= safeInterval) {
      lastExecutedRef.current = now;
      setThrottledValue(value);
      return;
    }

    const remaining = safeInterval - elapsed;
    const timer = setTimeout(() => {
      lastExecutedRef.current = Date.now();
      setThrottledValue(value);
    }, remaining);

    return () => {
      clearTimeout(timer);
    };
  }, [value, interval]);

  return throttledValue;
}

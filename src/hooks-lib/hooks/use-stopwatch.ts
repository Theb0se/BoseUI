"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface UseStopwatchReturn {
  /** Elapsed time in milliseconds. */
  elapsedMs: number;
  isRunning: boolean;
  start: () => void;
  pause: () => void;
  reset: () => void;
}

/**
 * Tracks elapsed time in milliseconds using `performance.now()` (or `Date.now()` fallback)
 * with `start`, `pause`, and `reset` controls.
 *
 * @param intervalMs - UI refresh interval in ms (default: `50`).
 * @returns `{ elapsedMs, isRunning, start, pause, reset }`.
 */
export function useStopwatch(intervalMs = 50): UseStopwatchReturn {
  const [elapsedMs, setElapsedMs] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const accumulatedRef = useRef(0);
  const startedAtRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isRunning) return;

    startedAtRef.current = Date.now();
    const id = setInterval(() => {
      if (startedAtRef.current !== null) {
        setElapsedMs(accumulatedRef.current + (Date.now() - startedAtRef.current));
      }
    }, Math.max(16, intervalMs));

    return () => {
      clearInterval(id);
    };
  }, [isRunning, intervalMs]);

  const start = useCallback(() => {
    setIsRunning((prev) => (prev ? prev : true));
  }, []);

  const pause = useCallback(() => {
    if (startedAtRef.current !== null) {
      accumulatedRef.current += Date.now() - startedAtRef.current;
      startedAtRef.current = null;
      setElapsedMs(accumulatedRef.current);
    }
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    accumulatedRef.current = 0;
    startedAtRef.current = null;
    setIsRunning(false);
    setElapsedMs(0);
  }, []);

  return { elapsedMs, isRunning, start, pause, reset };
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface UseCountdownOptions {
  /** Tick interval in ms (default: `1000`). */
  intervalMs?: number;
  /** Start automatically on mount (default: `false`). */
  autoStart?: boolean;
  /** Callback fired when countdown reaches `0`. */
  onComplete?: () => void;
}

export interface UseCountdownReturn {
  count: number;
  isRunning: boolean;
  start: () => void;
  pause: () => void;
  reset: (nextInitial?: number) => void;
}

/**
 * Countdown timer with `start`, `pause`, `reset`, and completion callback.
 *
 * @param initialCount - Starting count value (e.g. seconds).
 * @param options - Interval, autoStart, and `onComplete` callback.
 * @returns `{ count, isRunning, start, pause, reset }`.
 */
export function useCountdown(
  initialCount: number,
  options: UseCountdownOptions = {}
): UseCountdownReturn {
  const { intervalMs = 1000, autoStart = false, onComplete } = options;
  const safeInitial = Math.max(0, initialCount);

  const [count, setCount] = useState<number>(safeInitial);
  const [isRunning, setIsRunning] = useState<boolean>(
    autoStart && safeInitial > 0
  );

  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (!isRunning) return;

    const id = setInterval(() => {
      setCount((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          onCompleteRef.current?.();
          return 0;
        }
        return prev - 1;
      });
    }, Math.max(16, intervalMs));

    return () => clearInterval(id);
  }, [isRunning, intervalMs]);

  const start = useCallback(() => {
    setCount((prev) => {
      if (prev <= 0) return prev;
      setIsRunning(true);
      return prev;
    });
  }, []);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback(
    (nextInitial?: number) => {
      setIsRunning(false);
      setCount(
        Math.max(0, nextInitial !== undefined ? nextInitial : safeInitial)
      );
    },
    [safeInitial]
  );

  return { count, isRunning, start, pause, reset };
}

"use client";

import { useCallback, useEffect, useRef } from "react";

export interface ThrottledFunction<TArgs extends unknown[]> {
  (...args: TArgs): void;
  cancel: () => void;
}

/**
 * Returns a throttled callback that executes at most once per `interval` ms,
 * with a trailing invocation if called again during the cooldown window.
 *
 * @param callback - The function to throttle.
 * @param interval - Minimum interval between invocations in ms (default: `300`).
 * @returns Throttled callback with `.cancel()`.
 */
export function useThrottledCallback<TArgs extends unknown[]>(
  callback: (...args: TArgs) => void,
  interval = 300
): ThrottledFunction<TArgs> {
  const callbackRef = useRef(callback);
  const lastRunRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const trailingArgsRef = useRef<TArgs | null>(null);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const cancel = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    trailingArgsRef.current = null;
  }, []);

  useEffect(() => cancel, [cancel]);

  const throttled = useCallback(
    (...args: TArgs) => {
      const now = Date.now();
      const safeInterval = Math.max(0, interval);
      const elapsed = now - lastRunRef.current;

      if (elapsed >= safeInterval) {
        lastRunRef.current = now;
        callbackRef.current(...args);
        return;
      }

      trailingArgsRef.current = args;
      if (timerRef.current === null) {
        timerRef.current = setTimeout(() => {
          timerRef.current = null;
          lastRunRef.current = Date.now();
          const latestArgs = trailingArgsRef.current;
          trailingArgsRef.current = null;
          if (latestArgs !== null) {
            callbackRef.current(...latestArgs);
          }
        }, safeInterval - elapsed);
      }
    },
    [interval]
  ) as ThrottledFunction<TArgs>;

  throttled.cancel = cancel;

  return throttled;
}

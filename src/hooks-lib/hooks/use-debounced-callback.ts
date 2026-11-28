"use client";

import { useCallback, useEffect, useRef } from "react";

export interface DebouncedFunction<TArgs extends unknown[]> {
  (...args: TArgs): void;
  /** Cancel any pending invocation. */
  cancel: () => void;
  /** Immediately invoke any pending call. */
  flush: () => void;
}

/**
 * Returns a debounced version of a callback that delays execution until `delay` ms
 * have elapsed since the last invocation. Always invokes the latest callback ref
 * without resetting the timer when the callback identity changes.
 *
 * @param callback - The function to debounce.
 * @param delay - Delay in milliseconds (default: 300ms).
 * @returns A debounced function with `.cancel()` and `.flush()` controls.
 */
export function useDebouncedCallback<TArgs extends unknown[]>(
  callback: (...args: TArgs) => void,
  delay = 300
): DebouncedFunction<TArgs> {
  const callbackRef = useRef(callback);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestArgsRef = useRef<TArgs | null>(null);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const cancel = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    latestArgsRef.current = null;
  }, []);

  const flush = useCallback(() => {
    if (timerRef.current !== null && latestArgsRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
      const args = latestArgsRef.current;
      latestArgsRef.current = null;
      callbackRef.current(...args);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const debounced = useCallback(
    (...args: TArgs) => {
      latestArgsRef.current = args;
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(() => {
        timerRef.current = null;
        const capturedArgs = latestArgsRef.current;
        latestArgsRef.current = null;
        if (capturedArgs !== null) {
          callbackRef.current(...capturedArgs);
        }
      }, Math.max(0, delay));
    },
    [delay]
  ) as DebouncedFunction<TArgs>;

  debounced.cancel = cancel;
  debounced.flush = flush;

  return debounced;
}

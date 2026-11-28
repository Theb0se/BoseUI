"use client";

import { useCallback, useEffect, useRef } from "react";

export interface UseTimeoutReturn {
  reset: () => void;
  clear: () => void;
}

/**
 * Runs a callback after `delay` milliseconds with `reset` and `clear` controls.
 * Pass `delay = null` to disable automatic scheduling.
 *
 * @param callback - Function to invoke when the timeout expires.
 * @param delay - Delay in milliseconds, or `null` to disable.
 * @returns `{ reset, clear }`.
 */
export function useTimeout(
  callback: () => void,
  delay: number | null
): UseTimeoutReturn {
  const callbackRef = useRef(callback);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const clear = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    clear();
    if (delay === null) return;
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      callbackRef.current();
    }, Math.max(0, delay));
  }, [delay, clear]);

  useEffect(() => {
    reset();
    return clear;
  }, [reset, clear]);

  return { reset, clear };
}

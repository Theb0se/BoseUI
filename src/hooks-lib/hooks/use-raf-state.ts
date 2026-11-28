"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Batches state updates onto `requestAnimationFrame` so high-frequency events
 * (pointer move, scroll, resize) only commit at most once per display frame.
 * Cancels any pending frame on unmount.
 *
 * @param initialState - Initial state value.
 * @returns Tuple of `[state, setRafState]`.
 */
export function useRafState<T>(
  initialState: T | (() => T)
): [T, (value: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState<T>(initialState);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (frameRef.current !== null && typeof cancelAnimationFrame === "function") {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  const setRafState = useCallback((value: T | ((prev: T) => T)) => {
    if (typeof requestAnimationFrame !== "function") {
      setState(value);
      return;
    }

    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
    }

    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = null;
      setState(value);
    });
  }, []);

  return [state, setRafState];
}

"use client";

import { useEffect, useRef } from "react";

/**
 * Tracks the previous value of a state or prop from the prior committed render.
 * Returns `undefined` on the initial render.
 *
 * @param value - The current value to track.
 * @returns The value from the previous render, or `undefined` initially.
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

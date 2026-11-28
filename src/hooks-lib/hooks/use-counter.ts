"use client";

import { useCallback, useState } from "react";

export interface UseCounterOptions {
  /** Minimum allowed value. */
  min?: number;
  /** Maximum allowed value. */
  max?: number;
  /** Step size for increment/decrement (default: `1`). */
  step?: number;
}

export interface UseCounterReturn {
  count: number;
  increment: (by?: number) => void;
  decrement: (by?: number) => void;
  reset: () => void;
  set: (value: number | ((prev: number) => number)) => void;
}

function clamp(value: number, min?: number, max?: number): number {
  let next = value;
  if (typeof min === "number") next = Math.max(min, next);
  if (typeof max === "number") next = Math.min(max, next);
  return next;
}

/**
 * Manages a numeric counter with optional `min`/`max` bounds and `step` controls.
 *
 * @param initialValue - Starting numeric value (default: `0`).
 * @param options - Optional `min`, `max`, and `step` bounds.
 * @returns `{ count, increment, decrement, reset, set }`.
 */
export function useCounter(
  initialValue = 0,
  options: UseCounterOptions = {}
): UseCounterReturn {
  const { min, max, step = 1 } = options;
  const clampedInitial = clamp(initialValue, min, max);
  const [count, setCount] = useState<number>(clampedInitial);

  const set = useCallback(
    (value: number | ((prev: number) => number)) => {
      setCount((prev) => {
        const raw = typeof value === "function" ? value(prev) : value;
        return clamp(raw, min, max);
      });
    },
    [min, max]
  );

  const increment = useCallback(
    (by = step) => {
      setCount((prev) => clamp(prev + by, min, max));
    },
    [step, min, max]
  );

  const decrement = useCallback(
    (by = step) => {
      setCount((prev) => clamp(prev - by, min, max));
    },
    [step, min, max]
  );

  const reset = useCallback(() => {
    setCount(clampedInitial);
  }, [clampedInitial]);

  return { count, increment, decrement, reset, set };
}

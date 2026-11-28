"use client";

import { useEffect, useState } from "react";

/**
 * Delays updating a reactive value until a specified delay has elapsed
 * since the last time the input value changed.
 *
 * @param value - The value to debounce.
 * @param delay - Delay in milliseconds (default: 300ms).
 * @returns The debounced value.
 */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, Math.max(0, delay));

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type SetSessionValue<T> = T | ((prev: T) => T);

/**
 * Syncs React state with `window.sessionStorage` (scoped to the current browser tab)
 * in an SSR-safe manner. Gracefully handles blocked storage and invalid JSON.
 *
 * @param key - The sessionStorage key.
 * @param initialValue - Fallback value used during SSR and when no stored value exists.
 * @returns Tuple of `[storedValue, setValue, removeValue]`.
 */
export function useSessionStorage<T>(
  key: string,
  initialValue: T
): [T, (value: SetSessionValue<T>) => void, () => void] {
  const initialValueRef = useRef(initialValue);
  initialValueRef.current = initialValue;

  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const item = window.sessionStorage.getItem(key);
      if (item !== null) {
        setStoredValue(JSON.parse(item) as T);
      } else {
        setStoredValue(initialValueRef.current);
      }
    } catch {
      setStoredValue(initialValueRef.current);
    }
  }, [key]);

  const setValue = useCallback(
    (value: SetSessionValue<T>) => {
      setStoredValue((prev) => {
        const nextValue =
          typeof value === "function"
            ? (value as (prev: T) => T)(prev)
            : value;

        if (typeof window !== "undefined") {
          try {
            window.sessionStorage.setItem(key, JSON.stringify(nextValue));
          } catch {
            // Ignore write errors when storage is blocked or full
          }
        }
        return nextValue;
      });
    },
    [key]
  );

  const removeValue = useCallback(() => {
    setStoredValue(initialValueRef.current);
    if (typeof window !== "undefined") {
      try {
        window.sessionStorage.removeItem(key);
      } catch {
        // Ignore removal errors
      }
    }
  }, [key]);

  return [storedValue, setValue, removeValue];
}

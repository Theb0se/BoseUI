"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type SetStorageValue<T> = T | ((prev: T) => T);

/**
 * Syncs React state with `window.localStorage` in an SSR-safe manner.
 * Gracefully handles blocked storage, quota errors, and invalid JSON,
 * and synchronizes updates across browser tabs via the `storage` event.
 *
 * @param key - The localStorage key.
 * @param initialValue - Fallback value used during SSR and when no stored value exists.
 * @returns Tuple of `[storedValue, setValue, removeValue]`.
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: SetStorageValue<T>) => void, () => void] {
  const initialValueRef = useRef(initialValue);
  initialValueRef.current = initialValue;

  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // Hydrate from localStorage after mount to avoid SSR hydration mismatches
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const item = window.localStorage.getItem(key);
      if (item !== null) {
        setStoredValue(JSON.parse(item) as T);
      } else {
        setStoredValue(initialValueRef.current);
      }
    } catch {
      setStoredValue(initialValueRef.current);
    }
  }, [key]);

  // Cross-tab synchronization
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== key || event.storageArea !== window.localStorage) return;
      if (event.newValue === null) {
        setStoredValue(initialValueRef.current);
        return;
      }
      try {
        setStoredValue(JSON.parse(event.newValue) as T);
      } catch {
        setStoredValue(initialValueRef.current);
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [key]);

  const setValue = useCallback(
    (value: SetStorageValue<T>) => {
      setStoredValue((prev) => {
        const nextValue =
          typeof value === "function"
            ? (value as (prev: T) => T)(prev)
            : value;

        if (typeof window !== "undefined") {
          try {
            window.localStorage.setItem(key, JSON.stringify(nextValue));
          } catch {
            // Ignore write errors when storage is full or blocked
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
        window.localStorage.removeItem(key);
      } catch {
        // Ignore removal errors
      }
    }
  }, [key]);

  return [storedValue, setValue, removeValue];
}

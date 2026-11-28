"use client";

import { useCallback, useEffect, useState } from "react";

export interface UseQueryStateOptions {
  /** Use `history.replaceState` instead of `pushState` (default: `true`). */
  replace?: boolean;
}

/**
 * Syncs a string state value with a URL search parameter (`?key=value`)
 * in an SSR-safe manner without requiring router-specific packages.
 *
 * @param key - The URL search parameter key.
 * @param defaultValue - Fallback value when the parameter is absent.
 * @param options - Navigation behavior (`replace`).
 * @returns Tuple of `[value, setQueryValue]`.
 */
export function useQueryState(
  key: string,
  defaultValue = "",
  options: UseQueryStateOptions = {}
): [string, (nextValue: string | null) => void] {
  const { replace = true } = options;
  const [value, setValue] = useState<string>(defaultValue);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const syncFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      const paramValue = params.get(key);
      setValue(paramValue !== null ? paramValue : defaultValue);
    };

    syncFromUrl();
    window.addEventListener("popstate", syncFromUrl);
    return () => window.removeEventListener("popstate", syncFromUrl);
  }, [key, defaultValue]);

  const setQueryValue = useCallback(
    (nextValue: string | null) => {
      const normalized =
        nextValue === null || nextValue === "" ? defaultValue : nextValue;
      setValue(normalized);

      if (typeof window === "undefined") return;
      const url = new URL(window.location.href);
      if (nextValue === null || nextValue === "" || nextValue === defaultValue) {
        url.searchParams.delete(key);
      } else {
        url.searchParams.set(key, nextValue);
      }

      if (replace) {
        window.history.replaceState({}, "", url.toString());
      } else {
        window.history.pushState({}, "", url.toString());
      }
    },
    [key, defaultValue, replace]
  );

  return [value, setQueryValue];
}

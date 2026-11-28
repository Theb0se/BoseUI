"use client";

import { useEffect, useState } from "react";

export type ColorScheme = "light" | "dark";

/**
 * Detects the operating system's preferred color scheme (`"light"` or `"dark"`)
 * via `(prefers-color-scheme: dark)` and updates live on system theme changes.
 *
 * @param defaultScheme - Initial scheme during SSR (default: `"light"`).
 * @returns `"light" | "dark"`.
 */
export function usePreferredColorScheme(
  defaultScheme: ColorScheme = "light"
): ColorScheme {
  const [scheme, setScheme] = useState<ColorScheme>(defaultScheme);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return;
    }

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setScheme(mq.matches ? "dark" : "light");

    const handleChange = (event: MediaQueryListEvent) => {
      setScheme(event.matches ? "dark" : "light");
    };

    if (typeof mq.addEventListener === "function") {
      mq.addEventListener("change", handleChange);
      return () => mq.removeEventListener("change", handleChange);
    }

    mq.addListener(handleChange);
    return () => mq.removeListener(handleChange);
  }, []);

  return scheme;
}

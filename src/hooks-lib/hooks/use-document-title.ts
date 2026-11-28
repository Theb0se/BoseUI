"use client";

import { useEffect, useRef } from "react";

/**
 * Sets `document.title` declaratively and optionally restores the previous
 * title when the component unmounts.
 *
 * @param title - The document title string to apply.
 * @param restoreOnUnmount - Restore the prior title on unmount (default: `false`).
 */
export function useDocumentTitle(
  title: string,
  restoreOnUnmount = false
): void {
  const previousTitleRef = useRef<string | null>(null);

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (previousTitleRef.current === null) {
      previousTitleRef.current = document.title;
    }
    document.title = title;
  }, [title]);

  useEffect(() => {
    return () => {
      if (
        restoreOnUnmount &&
        typeof document !== "undefined" &&
        previousTitleRef.current !== null
      ) {
        document.title = previousTitleRef.current;
      }
    };
  }, [restoreOnUnmount]);
}

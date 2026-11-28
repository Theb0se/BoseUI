"use client";

import { useEffect, useState } from "react";

/**
 * Tracks whether the current browser tab is visible or hidden using the
 * Page Visibility API (`document.visibilityState`).
 *
 * @returns `true` when the tab is visible, `false` when hidden/minimized.
 */
export function usePageVisibility(): boolean {
  const [isVisible, setIsVisible] = useState<boolean>(true);

  useEffect(() => {
    if (typeof document === "undefined") return;

    const handleVisibilityChange = () => {
      setIsVisible(document.visibilityState === "visible");
    };

    handleVisibilityChange();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return isVisible;
}

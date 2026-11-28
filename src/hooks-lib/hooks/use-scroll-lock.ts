"use client";

import { useCallback, useEffect, useState } from "react";

export interface UseScrollLockReturn {
  isLocked: boolean;
  lock: () => void;
  unlock: () => void;
}

/**
 * Imperatively and declaratively locks `document.body` scrolling (e.g. for modals/drawers),
 * preserving scrollbar width with padding compensation and restoring original styles on unlock/unmount.
 *
 * @param initialLocked - Whether scroll starts locked (default: `false`).
 * @returns `{ isLocked, lock, unlock }`.
 */
export function useScrollLock(initialLocked = false): UseScrollLockReturn {
  const [isLocked, setIsLocked] = useState<boolean>(initialLocked);

  useEffect(() => {
    if (!isLocked || typeof document === "undefined" || typeof window === "undefined") {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [isLocked]);

  const lock = useCallback(() => setIsLocked(true), []);
  const unlock = useCallback(() => setIsLocked(false), []);

  return { isLocked, lock, unlock };
}

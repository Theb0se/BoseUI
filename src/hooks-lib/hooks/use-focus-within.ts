"use client";

import { useEffect, useState, type RefObject } from "react";

/**
 * Tracks whether focus is currently inside a referenced container element
 * (including any of its focusable descendants).
 *
 * @param ref - React ref attached to the container element.
 * @returns `true` when the container or any descendant has focus.
 */
export function useFocusWithin<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T | null>
): boolean {
  const [isFocusWithin, setIsFocusWithin] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const handleFocusIn = () => setIsFocusWithin(true);
    const handleFocusOut = (event: FocusEvent) => {
      const nextTarget = event.relatedTarget as Node | null;
      if (!nextTarget || !node.contains(nextTarget)) {
        setIsFocusWithin(false);
      }
    };

    node.addEventListener("focusin", handleFocusIn);
    node.addEventListener("focusout", handleFocusOut);

    return () => {
      node.removeEventListener("focusin", handleFocusIn);
      node.removeEventListener("focusout", handleFocusOut);
    };
  }, [ref]);

  return isFocusWithin;
}

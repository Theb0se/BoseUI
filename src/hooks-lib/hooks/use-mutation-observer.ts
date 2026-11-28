"use client";

import { useEffect, useRef, type RefObject } from "react";

const DEFAULT_MUTATION_OPTIONS: MutationObserverInit = {
  attributes: true,
  childList: true,
  subtree: true,
};

/**
 * Watches a DOM element for attribute, childList, or characterData mutations
 * via `MutationObserver`. Uses a ref for the callback to prevent observer churn.
 *
 * @param ref - React ref to the target DOM node.
 * @param callback - Callback invoked with the `MutationRecord[]` list.
 * @param options - Standard `MutationObserverInit` options.
 */
export function useMutationObserver<T extends Node = HTMLElement>(
  ref: RefObject<T | null>,
  callback: (mutations: MutationRecord[]) => void,
  options: MutationObserverInit = DEFAULT_MUTATION_OPTIONS
): void {
  const callbackRef = useRef(callback);
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const optionsKey = JSON.stringify(options);

  useEffect(() => {
    if (typeof window === "undefined" || typeof MutationObserver === "undefined") {
      return;
    }

    const node = ref.current;
    if (!node) return;

    const observer = new MutationObserver((mutations) => {
      callbackRef.current(mutations);
    });

    observer.observe(node, options);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, optionsKey]);
}

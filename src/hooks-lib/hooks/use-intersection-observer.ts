"use client";

import { useEffect, useState, type RefObject } from "react";

export interface UseIntersectionObserverOptions {
  /** Root element used as the viewport for checking visibility. */
  root?: Element | Document | null;
  /** Margin around the root (e.g. `"0px 0px -100px 0px"`). */
  rootMargin?: string;
  /** Threshold(s) at which the observer callback executes. */
  threshold?: number | number[];
  /** If `true`, stops observing once the element becomes visible. */
  freezeOnceVisible?: boolean;
}

export interface UseIntersectionObserverReturn {
  entry: IntersectionObserverEntry | null;
  isIntersecting: boolean;
}

/**
 * Tracks whether a referenced DOM element is intersecting with the viewport
 * or a specified root container using `IntersectionObserver`.
 *
 * @param ref - React ref pointing to the target DOM element.
 * @param options - IntersectionObserver configuration and `freezeOnceVisible`.
 * @returns `{ entry, isIntersecting }`.
 */
export function useIntersectionObserver<T extends Element = Element>(
  ref: RefObject<T | null>,
  options: UseIntersectionObserverOptions = {}
): UseIntersectionObserverReturn {
  const {
    root = null,
    rootMargin = "0px",
    threshold = 0,
    freezeOnceVisible = false,
  } = options;

  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const frozen = Boolean(entry?.isIntersecting && freezeOnceVisible);

  const thresholdKey = Array.isArray(threshold)
    ? threshold.join(",")
    : String(threshold);

  useEffect(() => {
    if (
      frozen ||
      typeof window === "undefined" ||
      typeof IntersectionObserver === "undefined"
    ) {
      return;
    }

    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([nextEntry]) => {
        if (nextEntry) {
          setEntry(nextEntry);
        }
      },
      { root, rootMargin, threshold }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, root, rootMargin, thresholdKey, frozen]);

  return {
    entry,
    isIntersecting: entry?.isIntersecting ?? false,
  };
}

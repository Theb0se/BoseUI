"use client";

import { useEffect, useState, type RefObject } from "react";

export interface UseInViewOptions {
  root?: Element | Document | null;
  rootMargin?: string;
  threshold?: number | number[];
  /** Trigger only once when the element first enters the viewport. */
  once?: boolean;
}

/**
 * Simple boolean wrapper around `IntersectionObserver` that returns `true`
 * when the referenced element is visible in the viewport or root container.
 *
 * @param ref - React ref to the observed element.
 * @param options - Observer options and `once` flag.
 * @returns `true` if the element is in view.
 */
export function useInView<T extends Element = Element>(
  ref: RefObject<T | null>,
  options: UseInViewOptions = {}
): boolean {
  const {
    root = null,
    rootMargin = "0px",
    threshold = 0,
    once = false,
  } = options;

  const [inView, setInView] = useState(false);

  const thresholdKey = Array.isArray(threshold)
    ? threshold.join(",")
    : String(threshold);

  useEffect(() => {
    if (once && inView) return;
    if (typeof window === "undefined" || typeof IntersectionObserver === "undefined") {
      return;
    }

    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (once && entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        } else {
          setInView(entry.isIntersecting);
        }
      },
      { root, rootMargin, threshold }
    );

    observer.observe(node);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, root, rootMargin, thresholdKey, once, inView]);

  return inView;
}

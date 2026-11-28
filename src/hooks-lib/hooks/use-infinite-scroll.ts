"use client";

import { useEffect, useRef, type RefObject } from "react";

export interface UseInfiniteScrollOptions {
  /** Whether more items are available to load. */
  hasMore: boolean;
  /** Whether a page is currently loading. */
  isLoading?: boolean;
  /** Root margin passed to `IntersectionObserver` (default: `"120px"`). */
  rootMargin?: string;
  /** Optional scroll container root. */
  root?: Element | Document | null;
}

/**
 * Triggers `onLoadMore` when a sentinel element enters the viewport or root
 * scroll container, while respecting `hasMore` and `isLoading` guards.
 *
 * @param sentinelRef - Ref to the sentinel element placed at the end of a list.
 * @param onLoadMore - Callback invoked to fetch the next page.
 * @param options - `hasMore`, `isLoading`, `rootMargin`, and `root`.
 */
export function useInfiniteScroll<T extends Element = Element>(
  sentinelRef: RefObject<T | null>,
  onLoadMore: () => void,
  options: UseInfiniteScrollOptions
): void {
  const {
    hasMore,
    isLoading = false,
    rootMargin = "120px",
    root = null,
  } = options;

  const onLoadMoreRef = useRef(onLoadMore);
  useEffect(() => {
    onLoadMoreRef.current = onLoadMore;
  }, [onLoadMore]);

  useEffect(() => {
    if (!hasMore || isLoading) return;
    if (typeof window === "undefined" || typeof IntersectionObserver === "undefined") {
      return;
    }

    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          onLoadMoreRef.current();
        }
      },
      { root, rootMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [sentinelRef, hasMore, isLoading, rootMargin, root]);
}

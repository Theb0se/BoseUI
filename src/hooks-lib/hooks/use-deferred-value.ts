"use client";

import { useDeferredValue as useReactDeferredValue } from "react";

export interface UseDeferredValueReturn<T> {
  /** The deferred value that lags behind urgent updates. */
  deferredValue: T;
  /** `true` while React is still rendering the deferred update. */
  isStale: boolean;
}

/**
 * Convenience wrapper around React's `useDeferredValue` that also exposes an
 * `isStale` flag for showing subtle pending UI indicators during heavy list filtering.
 *
 * @param value - Urgent input value to defer for non-urgent rendering.
 * @returns `{ deferredValue, isStale }`.
 */
export function useDeferredValue<T>(value: T): UseDeferredValueReturn<T> {
  const deferredValue = useReactDeferredValue(value);
  const isStale = !Object.is(value, deferredValue);

  return { deferredValue, isStale };
}

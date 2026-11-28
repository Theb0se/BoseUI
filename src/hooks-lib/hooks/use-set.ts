"use client";

import { useCallback, useState } from "react";

export interface UseSetActions<T> {
  add: (value: T) => void;
  remove: (value: T) => void;
  toggle: (value: T) => void;
  clear: () => void;
  reset: () => void;
}

/**
 * Manages a reactive ES6 `Set` state with immutable helper actions (`add`, `remove`, `toggle`, `clear`, `reset`).
 *
 * @param initialValues - Optional initial values for the Set.
 * @returns Tuple of `[set, actions]`.
 */
export function useSet<T>(
  initialValues: Iterable<T> = []
): [ReadonlySet<T>, UseSetActions<T>] {
  const [set, setSet] = useState<Set<T>>(() => new Set(initialValues));

  const add = useCallback((value: T) => {
    setSet((prev) => {
      if (prev.has(value)) return prev;
      const next = new Set(prev);
      next.add(value);
      return next;
    });
  }, []);

  const remove = useCallback((value: T) => {
    setSet((prev) => {
      if (!prev.has(value)) return prev;
      const next = new Set(prev);
      next.delete(value);
      return next;
    });
  }, []);

  const toggle = useCallback((value: T) => {
    setSet((prev) => {
      const next = new Set(prev);
      if (next.has(value)) {
        next.delete(value);
      } else {
        next.add(value);
      }
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setSet((prev) => (prev.size === 0 ? prev : new Set()));
  }, []);

  const reset = useCallback(() => {
    setSet(new Set(initialValues));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [set, { add, remove, toggle, clear, reset }];
}

"use client";

import { useCallback, useState } from "react";

export interface UseMapActions<K, V> {
  set: (key: K, value: V) => void;
  setAll: (entries: Iterable<readonly [K, V]>) => void;
  remove: (key: K) => void;
  clear: () => void;
  reset: () => void;
}

/**
 * Manages a reactive ES6 `Map` state with immutable helper actions (`set`, `setAll`, `remove`, `clear`, `reset`).
 *
 * @param initialEntries - Optional initial entries for the Map.
 * @returns Tuple of `[map, actions]`.
 */
export function useMap<K, V>(
  initialEntries: Iterable<readonly [K, V]> = []
): [ReadonlyMap<K, V>, UseMapActions<K, V>] {
  const [map, setMap] = useState<Map<K, V>>(() => new Map(initialEntries));

  const set = useCallback((key: K, value: V) => {
    setMap((prev) => {
      const next = new Map(prev);
      next.set(key, value);
      return next;
    });
  }, []);

  const setAll = useCallback((entries: Iterable<readonly [K, V]>) => {
    setMap(() => new Map(entries));
  }, []);

  const remove = useCallback((key: K) => {
    setMap((prev) => {
      if (!prev.has(key)) return prev;
      const next = new Map(prev);
      next.delete(key);
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setMap((prev) => (prev.size === 0 ? prev : new Map()));
  }, []);

  const reset = useCallback(() => {
    setMap(new Map(initialEntries));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [map, { set, setAll, remove, clear, reset }];
}

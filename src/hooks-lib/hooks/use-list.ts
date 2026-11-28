"use client";

import { useCallback, useState } from "react";

export interface UseListActions<T> {
  set: (nextList: T[]) => void;
  push: (...items: T[]) => void;
  removeAt: (index: number) => void;
  updateAt: (index: number, item: T) => void;
  insertAt: (index: number, item: T) => void;
  filter: (predicate: (item: T, index: number) => boolean) => void;
  clear: () => void;
  reset: () => void;
}

/**
 * Manages an array state with immutable helper methods (`push`, `removeAt`, `updateAt`, `insertAt`, `filter`, `clear`, `reset`).
 *
 * @param initialList - Initial array items (default: `[]`).
 * @returns Tuple of `[list, actions]`.
 */
export function useList<T>(initialList: T[] = []): [T[], UseListActions<T>] {
  const [list, setList] = useState<T[]>(initialList);

  const set = useCallback((nextList: T[]) => {
    setList(nextList);
  }, []);

  const push = useCallback((...items: T[]) => {
    setList((prev) => [...prev, ...items]);
  }, []);

  const removeAt = useCallback((index: number) => {
    setList((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const updateAt = useCallback((index: number, item: T) => {
    setList((prev) => prev.map((existing, i) => (i === index ? item : existing)));
  }, []);

  const insertAt = useCallback((index: number, item: T) => {
    setList((prev) => [
      ...prev.slice(0, index),
      item,
      ...prev.slice(index),
    ]);
  }, []);

  const filter = useCallback(
    (predicate: (item: T, index: number) => boolean) => {
      setList((prev) => prev.filter(predicate));
    },
    []
  );

  const clear = useCallback(() => {
    setList([]);
  }, []);

  const reset = useCallback(() => {
    setList(initialList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [
    list,
    { set, push, removeAt, updateAt, insertAt, filter, clear, reset },
  ];
}

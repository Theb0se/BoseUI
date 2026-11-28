"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface UseOptimisticReturn<T> {
  state: T;
  isPending: boolean;
  error: Error | null;
  applyOptimistic: (
    optimisticValue: T | ((prev: T) => T),
    commitFn: () => Promise<T>
  ) => Promise<boolean>;
}

/**
 * Applies an immediate optimistic UI state update while an async request
 * runs, committing the server result on success or rolling back on failure.
 *
 * @param initialState - Initial committed state.
 * @returns `{ state, isPending, error, applyOptimistic }`.
 */
export function useOptimistic<T>(initialState: T): UseOptimisticReturn<T> {
  const [state, setState] = useState<T>(initialState);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const stateRef = useRef(state);
  stateRef.current = state;

  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const applyOptimistic = useCallback(
    async (
      optimisticValue: T | ((prev: T) => T),
      commitFn: () => Promise<T>
    ): Promise<boolean> => {
      const snapshot = stateRef.current;
      const nextOptimistic =
        typeof optimisticValue === "function"
          ? (optimisticValue as (prev: T) => T)(snapshot)
          : optimisticValue;

      setState(nextOptimistic);
      setIsPending(true);
      setError(null);

      try {
        const committed = await commitFn();
        if (mountedRef.current) {
          setState(committed);
          setIsPending(false);
        }
        return true;
      } catch (err) {
        if (mountedRef.current) {
          setState(snapshot);
          setError(err instanceof Error ? err : new Error(String(err)));
          setIsPending(false);
        }
        return false;
      }
    },
    []
  );

  return { state, isPending, error, applyOptimistic };
}

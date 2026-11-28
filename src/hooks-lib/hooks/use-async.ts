"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type AsyncStatus = "idle" | "pending" | "success" | "error";

export interface UseAsyncReturn<T, TArgs extends unknown[]> {
  execute: (...args: TArgs) => Promise<T | null>;
  status: AsyncStatus;
  loading: boolean;
  data: T | null;
  error: Error | null;
  reset: () => void;
}

/**
 * Wraps an asynchronous function with `loading`, `data`, `error`, and `status` state,
 * guarding against race conditions and unmounted state updates.
 *
 * @param asyncFunction - Async operation returning a Promise.
 * @param immediate - Automatically invoke with no args on mount (default: `false`).
 * @returns `{ execute, status, loading, data, error, reset }`.
 */
export function useAsync<T, TArgs extends unknown[] = []>(
  asyncFunction: (...args: TArgs) => Promise<T>,
  immediate = false
): UseAsyncReturn<T, TArgs> {
  const [status, setStatus] = useState<AsyncStatus>("idle");
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const fnRef = useRef(asyncFunction);
  const callIdRef = useRef(0);
  const mountedRef = useRef(true);

  useEffect(() => {
    fnRef.current = asyncFunction;
  }, [asyncFunction]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const execute = useCallback(async (...args: TArgs): Promise<T | null> => {
    const callId = ++callIdRef.current;
    setStatus("pending");
    setError(null);

    try {
      const result = await fnRef.current(...args);
      if (mountedRef.current && callId === callIdRef.current) {
        setData(result);
        setStatus("success");
      }
      return result;
    } catch (err) {
      if (mountedRef.current && callId === callIdRef.current) {
        setError(err instanceof Error ? err : new Error(String(err)));
        setStatus("error");
      }
      return null;
    }
  }, []);

  const reset = useCallback(() => {
    callIdRef.current += 1;
    setStatus("idle");
    setData(null);
    setError(null);
  }, []);

  useEffect(() => {
    if (immediate) {
      void execute(...([] as unknown as TArgs));
    }
  }, [immediate, execute]);

  return {
    execute,
    status,
    loading: status === "pending",
    data,
    error,
    reset,
  };
}

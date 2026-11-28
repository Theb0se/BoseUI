"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface UsePollingOptions {
  /** Polling interval in ms (default: `5000`). */
  intervalMs?: number;
  /** Start polling automatically (default: `true`). */
  enabled?: boolean;
  /** Run immediately on start before waiting for the first interval (default: `true`). */
  immediate?: boolean;
}

export interface UsePollingReturn<T> {
  data: T | null;
  error: Error | null;
  isPolling: boolean;
  isLoading: boolean;
  start: () => void;
  stop: () => void;
  pollNow: () => Promise<void>;
}

/**
 * Repeats an async request at a fixed interval, avoiding overlapping runs
 * and cleaning up timers automatically on stop or unmount.
 *
 * @param fetcher - Async function returning fresh data.
 * @param options - `intervalMs`, `enabled`, and `immediate`.
 * @returns `{ data, error, isPolling, isLoading, start, stop, pollNow }`.
 */
export function usePolling<T>(
  fetcher: () => Promise<T>,
  options: UsePollingOptions = {}
): UsePollingReturn<T> {
  const { intervalMs = 5000, enabled = true, immediate = true } = options;

  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isPolling, setIsPolling] = useState<boolean>(enabled);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetcherRef = useRef(fetcher);
  const mountedRef = useRef(true);
  const inFlightRef = useRef(false);

  useEffect(() => {
    fetcherRef.current = fetcher;
  }, [fetcher]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const pollNow = useCallback(async () => {
    if (inFlightRef.current) return;
    inFlightRef.current = true;
    setIsLoading(true);
    try {
      const result = await fetcherRef.current();
      if (mountedRef.current) {
        setData(result);
        setError(null);
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err : new Error(String(err)));
      }
    } finally {
      inFlightRef.current = false;
      if (mountedRef.current) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    if (!isPolling) return;

    if (immediate) {
      void pollNow();
    }

    const id = setInterval(() => {
      void pollNow();
    }, Math.max(100, intervalMs));

    return () => clearInterval(id);
  }, [isPolling, intervalMs, immediate, pollNow]);

  const start = useCallback(() => setIsPolling(true), []);
  const stop = useCallback(() => setIsPolling(false), []);

  return { data, error, isPolling, isLoading, start, stop, pollNow };
}

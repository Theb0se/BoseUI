"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const responseCache = new Map<string, unknown>();

export interface UseFetchOptions extends RequestInit {
  /** Number of automatic retries on failure (default: `0`). */
  retries?: number;
  /** Delay between retries in ms (default: `500`). */
  retryDelayMs?: number;
  /** Cache successful JSON responses by URL in memory (default: `false`). */
  cacheResponse?: boolean;
  /** Skip automatic fetch on mount (default: `true`). */
  enabled?: boolean;
}

export interface UseFetchReturn<T> {
  data: T | null;
  error: Error | null;
  loading: boolean;
  refetch: () => void;
  abort: () => void;
}

/**
 * Fetches JSON data with `AbortController` cancellation on unmount/re-fetch,
 * configurable retry attempts, and optional in-memory response caching.
 *
 * @param url - Request URL, or `null` to skip fetching.
 * @param options - Standard `RequestInit` plus `retries`, `retryDelayMs`, `cacheResponse`, `enabled`.
 * @returns `{ data, error, loading, refetch, abort }`.
 */
export function useFetch<T = unknown>(
  url: string | null,
  options: UseFetchOptions = {}
): UseFetchReturn<T> {
  const {
    retries = 0,
    retryDelayMs = 500,
    cacheResponse = false,
    enabled = true,
    ...fetchInit
  } = options;

  const [data, setData] = useState<T | null>(() =>
    url && cacheResponse && responseCache.has(url)
      ? (responseCache.get(url) as T)
      : null
  );
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(Boolean(url && enabled));
  const [trigger, setTrigger] = useState(0);

  const abortControllerRef = useRef<AbortController | null>(null);
  const initRef = useRef(fetchInit);
  initRef.current = fetchInit;

  const abort = useCallback(() => {
    abortControllerRef.current?.abort();
  }, []);

  const refetch = useCallback(() => {
    if (url && cacheResponse) {
      responseCache.delete(url);
    }
    setTrigger((t) => t + 1);
  }, [url, cacheResponse]);

  useEffect(() => {
    if (!url || !enabled) {
      setLoading(false);
      return;
    }

    if (cacheResponse && responseCache.has(url)) {
      setData(responseCache.get(url) as T);
      setLoading(false);
      setError(null);
      return;
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    let cancelled = false;

    const execute = async () => {
      setLoading(true);
      setError(null);

      let attempt = 0;
      while (attempt <= retries) {
        try {
          const res = await fetch(url, {
            ...initRef.current,
            signal: controller.signal,
          });
          if (!res.ok) {
            throw new Error(`HTTP ${res.status}: ${res.statusText}`);
          }
          const json = (await res.json()) as T;
          if (!cancelled) {
            if (cacheResponse) {
              responseCache.set(url, json);
            }
            setData(json);
            setLoading(false);
          }
          return;
        } catch (err) {
          if (controller.signal.aborted || cancelled) return;
          if (attempt >= retries) {
            setError(err instanceof Error ? err : new Error(String(err)));
            setLoading(false);
            return;
          }
          attempt += 1;
          await new Promise((resolve) => setTimeout(resolve, retryDelayMs));
        }
      }
    };

    void execute();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [url, enabled, retries, retryDelayMs, cacheResponse, trigger]);

  return { data, error, loading, refetch, abort };
}

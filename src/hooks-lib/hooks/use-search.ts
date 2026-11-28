"use client";

import { useEffect, useRef, useState } from "react";

export interface UseSearchOptions {
  /** Debounce delay in ms (default: `300`). */
  delayMs?: number;
  /** Minimum query length before calling `searchFn` (default: `1`). */
  minLength?: number;
}

export interface UseSearchReturn<T> {
  query: string;
  setQuery: (q: string) => void;
  results: T[];
  loading: boolean;
  error: Error | null;
  clear: () => void;
}

/**
 * Combines controlled search query state, debouncing, race-condition guarding,
 * and async search execution into a single ergonomic hook.
 *
 * @param searchFn - Async (or sync) search function receiving the trimmed query.
 * @param options - `delayMs` and `minLength`.
 * @returns `{ query, setQuery, results, loading, error, clear }`.
 */
export function useSearch<T>(
  searchFn: (query: string) => Promise<T[]> | T[],
  options: UseSearchOptions = {}
): UseSearchReturn<T> {
  const { delayMs = 300, minLength = 1 } = options;

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const searchFnRef = useRef(searchFn);
  const requestIdRef = useRef(0);

  useEffect(() => {
    searchFnRef.current = searchFn;
  }, [searchFn]);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < minLength) {
      requestIdRef.current += 1;
      setResults([]);
      setLoading(false);
      setError(null);
      return;
    }

    const requestId = ++requestIdRef.current;
    setLoading(true);

    const timer = setTimeout(async () => {
      try {
        const data = await searchFnRef.current(trimmed);
        if (requestId === requestIdRef.current) {
          setResults(data);
          setError(null);
          setLoading(false);
        }
      } catch (err) {
        if (requestId === requestIdRef.current) {
          setError(err instanceof Error ? err : new Error(String(err)));
          setResults([]);
          setLoading(false);
        }
      }
    }, Math.max(0, delayMs));

    return () => {
      clearTimeout(timer);
    };
  }, [query, delayMs, minLength]);

  const clear = () => {
    setQuery("");
    setResults([]);
    setError(null);
  };

  return { query, setQuery, results, loading, error, clear };
}

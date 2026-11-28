"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface UseMutationOptions<TData, TVariables> {
  onSuccess?: (data: TData, variables: TVariables) => void;
  onError?: (error: Error, variables: TVariables) => void;
  onSettled?: (
    data: TData | null,
    error: Error | null,
    variables: TVariables
  ) => void;
}

export interface UseMutationReturn<TData, TVariables> {
  mutate: (variables: TVariables) => Promise<TData | null>;
  data: TData | null;
  error: Error | null;
  loading: boolean;
  isSuccess: boolean;
  isError: boolean;
  reset: () => void;
}

/**
 * Manages imperative async mutations (POST, PUT, PATCH, DELETE) with
 * `loading`, `data`, `error`, and `onSuccess`/`onError`/`onSettled` lifecycle callbacks.
 *
 * @param mutationFn - Async function accepting variables and returning a Promise.
 * @param options - Optional lifecycle callbacks.
 * @returns `{ mutate, data, error, loading, isSuccess, isError, reset }`.
 */
export function useMutation<TData, TVariables = void>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options: UseMutationOptions<TData, TVariables> = {}
): UseMutationReturn<TData, TVariables> {
  const [data, setData] = useState<TData | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const fnRef = useRef(mutationFn);
  const optionsRef = useRef(options);
  const mountedRef = useRef(true);

  useEffect(() => {
    fnRef.current = mutationFn;
    optionsRef.current = options;
  }, [mutationFn, options]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const mutate = useCallback(
    async (variables: TVariables): Promise<TData | null> => {
      setLoading(true);
      setError(null);
      setIsSuccess(false);

      try {
        const result = await fnRef.current(variables);
        if (mountedRef.current) {
          setData(result);
          setLoading(false);
          setIsSuccess(true);
        }
        optionsRef.current.onSuccess?.(result, variables);
        optionsRef.current.onSettled?.(result, null, variables);
        return result;
      } catch (err) {
        const parsedError =
          err instanceof Error ? err : new Error(String(err));
        if (mountedRef.current) {
          setError(parsedError);
          setLoading(false);
          setIsSuccess(false);
        }
        optionsRef.current.onError?.(parsedError, variables);
        optionsRef.current.onSettled?.(null, parsedError, variables);
        return null;
      }
    },
    []
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
    setIsSuccess(false);
  }, []);

  return {
    mutate,
    data,
    error,
    loading,
    isSuccess,
    isError: error !== null,
    reset,
  };
}

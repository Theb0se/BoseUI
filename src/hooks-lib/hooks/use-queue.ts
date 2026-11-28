"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface UseQueueReturn<T> {
  /** Tasks currently waiting in the queue. */
  pending: number;
  /** Whether a task is currently executing. */
  isProcessing: boolean;
  /** Results of completed tasks in execution order. */
  results: T[];
  /** Enqueue an async task to run sequentially after prior tasks finish. */
  enqueue: (task: () => Promise<T>) => void;
  /** Clear queued (not-yet-started) tasks and completed results. */
  clear: () => void;
}

/**
 * Processes asynchronous tasks strictly in FIFO order, one at a time,
 * tracking pending count, processing state, and completed results.
 *
 * @returns `{ pending, isProcessing, results, enqueue, clear }`.
 */
export function useQueue<T = unknown>(): UseQueueReturn<T> {
  const queueRef = useRef<Array<() => Promise<T>>>([]);
  const runningRef = useRef(false);
  const mountedRef = useRef(true);

  const [pending, setPending] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<T[]>([]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const processNext = useCallback(async () => {
    if (runningRef.current) return;
    const nextTask = queueRef.current.shift();
    if (!nextTask) {
      if (mountedRef.current) {
        setIsProcessing(false);
        setPending(0);
      }
      return;
    }

    runningRef.current = true;
    if (mountedRef.current) {
      setIsProcessing(true);
      setPending(queueRef.current.length);
    }

    try {
      const value = await nextTask();
      if (mountedRef.current) {
        setResults((prev) => [...prev, value]);
      }
    } finally {
      runningRef.current = false;
      if (mountedRef.current) {
        void processNext();
      }
    }
  }, []);

  const enqueue = useCallback(
    (task: () => Promise<T>) => {
      queueRef.current.push(task);
      setPending(queueRef.current.length);
      void processNext();
    },
    [processNext]
  );

  const clear = useCallback(() => {
    queueRef.current = [];
    setPending(0);
    setResults([]);
  }, []);

  return { pending, isProcessing, results, enqueue, clear };
}

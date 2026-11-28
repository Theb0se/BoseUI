"use client";

import { useCallback, useState } from "react";

export interface UseUndoRedoReturn<T> {
  state: T;
  set: (nextState: T | ((prev: T) => T)) => void;
  undo: () => void;
  redo: () => void;
  reset: (newInitialState?: T) => void;
  canUndo: boolean;
  canRedo: boolean;
  past: T[];
  future: T[];
}

interface HistoryState<T> {
  past: T[];
  present: T;
  future: T[];
}

/**
 * Manages state with full undo/redo history stacks and an optional max history limit.
 *
 * @param initialPresent - Initial state value.
 * @param maxHistory - Maximum number of past states to retain (default: `50`).
 * @returns `{ state, set, undo, redo, reset, canUndo, canRedo, past, future }`.
 */
export function useUndoRedo<T>(
  initialPresent: T,
  maxHistory = 50
): UseUndoRedoReturn<T> {
  const [history, setHistory] = useState<HistoryState<T>>({
    past: [],
    present: initialPresent,
    future: [],
  });

  const canUndo = history.past.length > 0;
  const canRedo = history.future.length > 0;

  const set = useCallback(
    (nextState: T | ((prev: T) => T)) => {
      setHistory((prev) => {
        const resolved =
          typeof nextState === "function"
            ? (nextState as (p: T) => T)(prev.present)
            : nextState;

        if (Object.is(resolved, prev.present)) return prev;

        const nextPast = [...prev.past, prev.present];
        if (nextPast.length > Math.max(1, maxHistory)) {
          nextPast.shift();
        }

        return {
          past: nextPast,
          present: resolved,
          future: [],
        };
      });
    },
    [maxHistory]
  );

  const undo = useCallback(() => {
    setHistory((prev) => {
      if (prev.past.length === 0) return prev;
      const previous = prev.past[prev.past.length - 1];
      const nextPast = prev.past.slice(0, -1);
      return {
        past: nextPast,
        present: previous,
        future: [prev.present, ...prev.future],
      };
    });
  }, []);

  const redo = useCallback(() => {
    setHistory((prev) => {
      if (prev.future.length === 0) return prev;
      const [next, ...nextFuture] = prev.future;
      return {
        past: [...prev.past, prev.present],
        present: next,
        future: nextFuture,
      };
    });
  }, []);

  const reset = useCallback(
    (newInitialState?: T) => {
      setHistory({
        past: [],
        present: newInitialState !== undefined ? newInitialState : initialPresent,
        future: [],
      });
    },
    [initialPresent]
  );

  return {
    state: history.present,
    set,
    undo,
    redo,
    reset,
    canUndo,
    canRedo,
    past: history.past,
    future: history.future,
  };
}

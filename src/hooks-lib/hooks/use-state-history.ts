"use client";

import { useCallback, useState } from "react";

export interface UseStateHistoryReturn<T> {
  value: T;
  set: (nextValue: T | ((prev: T) => T)) => void;
  history: T[];
  pointer: number;
  back: (steps?: number) => void;
  forward: (steps?: number) => void;
  go: (index: number) => void;
  canBack: boolean;
  canForward: boolean;
}

/**
 * Tracks a linear history of state values with `back`, `forward`, and `go(index)` rewind controls.
 *
 * @param initialValue - Initial state value.
 * @param capacity - Maximum number of history entries to retain (default: `25`).
 * @returns `{ value, set, history, pointer, back, forward, go, canBack, canForward }`.
 */
export function useStateHistory<T>(
  initialValue: T,
  capacity = 25
): UseStateHistoryReturn<T> {
  const [state, setState] = useState<{ history: T[]; pointer: number }>({
    history: [initialValue],
    pointer: 0,
  });

  const value = state.history[state.pointer];
  const canBack = state.pointer > 0;
  const canForward = state.pointer < state.history.length - 1;

  const set = useCallback(
    (nextValue: T | ((prev: T) => T)) => {
      setState((prev) => {
        const current = prev.history[prev.pointer];
        const resolved =
          typeof nextValue === "function"
            ? (nextValue as (p: T) => T)(current)
            : nextValue;

        if (Object.is(resolved, current)) return prev;

        const sliced = prev.history.slice(0, prev.pointer + 1);
        const nextHistory = [...sliced, resolved];
        if (nextHistory.length > Math.max(1, capacity)) {
          nextHistory.shift();
        }

        return {
          history: nextHistory,
          pointer: nextHistory.length - 1,
        };
      });
    },
    [capacity]
  );

  const go = useCallback((index: number) => {
    setState((prev) => {
      const clamped = Math.max(0, Math.min(index, prev.history.length - 1));
      if (clamped === prev.pointer) return prev;
      return { ...prev, pointer: clamped };
    });
  }, []);

  const back = useCallback((steps = 1) => {
    setState((prev) => {
      const nextPointer = Math.max(0, prev.pointer - Math.max(1, steps));
      return nextPointer === prev.pointer
        ? prev
        : { ...prev, pointer: nextPointer };
    });
  }, []);

  const forward = useCallback((steps = 1) => {
    setState((prev) => {
      const nextPointer = Math.min(
        prev.history.length - 1,
        prev.pointer + Math.max(1, steps)
      );
      return nextPointer === prev.pointer
        ? prev
        : { ...prev, pointer: nextPointer };
    });
  }, []);

  return {
    value,
    set,
    history: state.history,
    pointer: state.pointer,
    back,
    forward,
    go,
    canBack,
    canForward,
  };
}

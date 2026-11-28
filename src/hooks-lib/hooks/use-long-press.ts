"use client";

import { useCallback, useEffect, useRef } from "react";

export interface UseLongPressOptions {
  /** Hold duration in ms before firing (default: `500`). */
  thresholdMs?: number;
  /** Optional callback when press starts. */
  onStart?: () => void;
  /** Optional callback when press is released or cancelled before threshold. */
  onCancel?: () => void;
}

export interface UseLongPressHandlers {
  onMouseDown: () => void;
  onMouseUp: () => void;
  onMouseLeave: () => void;
  onTouchStart: () => void;
  onTouchEnd: () => void;
  onTouchCancel: () => void;
}

/**
 * Detects a long-press gesture across mouse and touch inputs and returns
 * event handler props to spread onto the target element.
 *
 * @param callback - Invoked when the press exceeds `thresholdMs`.
 * @param options - Threshold duration and lifecycle callbacks.
 * @returns Pointer/touch event handlers.
 */
export function useLongPress(
  callback: () => void,
  options: UseLongPressOptions = {}
): UseLongPressHandlers {
  const { thresholdMs = 500, onStart, onCancel } = options;

  const callbackRef = useRef(callback);
  const onStartRef = useRef(onStart);
  const onCancelRef = useRef(onCancel);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggeredRef = useRef(false);

  useEffect(() => {
    callbackRef.current = callback;
    onStartRef.current = onStart;
    onCancelRef.current = onCancel;
  }, [callback, onStart, onCancel]);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const start = useCallback(() => {
    triggeredRef.current = false;
    onStartRef.current?.();
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      triggeredRef.current = true;
      timerRef.current = null;
      callbackRef.current();
    }, Math.max(0, thresholdMs));
  }, [thresholdMs]);

  const cancel = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
      if (!triggeredRef.current) {
        onCancelRef.current?.();
      }
    }
  }, []);

  return {
    onMouseDown: start,
    onMouseUp: cancel,
    onMouseLeave: cancel,
    onTouchStart: start,
    onTouchEnd: cancel,
    onTouchCancel: cancel,
  };
}

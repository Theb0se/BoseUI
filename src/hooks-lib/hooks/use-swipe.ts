"use client";

import { useCallback, useEffect, useRef, type TouchEvent, type PointerEvent } from "react";

export type SwipeDirection = "left" | "right" | "up" | "down";

export interface UseSwipeOptions {
  /** Minimum swipe distance in pixels (default: `40`). */
  threshold?: number;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onSwipe?: (direction: SwipeDirection) => void;
}

export interface UseSwipeHandlers {
  onTouchStart: (e: TouchEvent) => void;
  onTouchEnd: (e: TouchEvent) => void;
  onPointerDown: (e: PointerEvent) => void;
  onPointerUp: (e: PointerEvent) => void;
}

/**
 * Detects directional swipe gestures (`left`, `right`, `up`, `down`) across
 * touch and pointer events, returning handlers to spread onto a container.
 *
 * @param options - Threshold distance and directional callbacks.
 * @returns Touch and pointer event handlers.
 */
export function useSwipe(options: UseSwipeOptions = {}): UseSwipeHandlers {
  const { threshold = 40 } = options;
  const startRef = useRef<{ x: number; y: number } | null>(null);
  const optionsRef = useRef(options);

  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  const handleEnd = useCallback(
    (endX: number, endY: number) => {
      if (!startRef.current) return;
      const dx = endX - startRef.current.x;
      const dy = endY - startRef.current.y;
      startRef.current = null;

      if (Math.abs(dx) < threshold && Math.abs(dy) < threshold) return;

      let direction: SwipeDirection;
      if (Math.abs(dx) >= Math.abs(dy)) {
        direction = dx > 0 ? "right" : "left";
      } else {
        direction = dy > 0 ? "down" : "up";
      }

      const opts = optionsRef.current;
      opts.onSwipe?.(direction);
      if (direction === "left") opts.onSwipeLeft?.();
      if (direction === "right") opts.onSwipeRight?.();
      if (direction === "up") opts.onSwipeUp?.();
      if (direction === "down") opts.onSwipeDown?.();
    },
    [threshold]
  );

  const onTouchStart = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    if (touch) {
      startRef.current = { x: touch.clientX, y: touch.clientY };
    }
  }, []);

  const onTouchEnd = useCallback(
    (e: TouchEvent) => {
      const touch = e.changedTouches[0];
      if (touch) {
        handleEnd(touch.clientX, touch.clientY);
      }
    },
    [handleEnd]
  );

  const onPointerDown = useCallback((e: PointerEvent) => {
    startRef.current = { x: e.clientX, y: e.clientY };
  }, []);

  const onPointerUp = useCallback(
    (e: PointerEvent) => {
      handleEnd(e.clientX, e.clientY);
    },
    [handleEnd]
  );

  return { onTouchStart, onTouchEnd, onPointerDown, onPointerUp };
}

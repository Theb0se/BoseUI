"use client";

import React, { useRef } from "react";
import { useScrollPosition } from "../hooks/use-scroll-position";

export function UseScrollPositionDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { x, y } = useScrollPosition(containerRef);

  return (
    <div className="w-full max-w-md space-y-3">
      <div className="flex items-center justify-between font-mono text-xs text-neutral-600 dark:text-neutral-400">
        <span>Scroll container below:</span>
        <span className="font-semibold text-neutral-950 dark:text-white">
          x: {Math.round(x)}, y: {Math.round(y)}
        </span>
      </div>

      <div
        ref={containerRef}
        className="h-40 overflow-auto rounded-2xl border border-neutral-200 bg-neutral-50/70 p-4 dark:border-neutral-800 dark:bg-neutral-900/50"
      >
        <div className="flex h-72 w-[140%] items-start justify-between text-xs text-neutral-400">
          <span>Scroll vertically and horizontally →</span>
          <span className="self-end">Bottom-right corner</span>
        </div>
      </div>
    </div>
  );
}

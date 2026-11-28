"use client";

import React, { useRef } from "react";
import { useResizeObserver } from "../hooks/use-resize-observer";

export function UseResizeObserverDemo() {
  const boxRef = useRef<HTMLDivElement>(null);
  const { width, height } = useResizeObserver(boxRef);

  return (
    <div className="w-full max-w-md space-y-3 text-center">
      <div
        ref={boxRef}
        className="mx-auto flex h-28 w-64 resize overflow-auto items-center justify-center rounded-2xl border border-dashed border-neutral-300 bg-neutral-50/70 p-4 font-mono text-xs text-neutral-600 dark:border-neutral-700 dark:bg-neutral-900/50 dark:text-neutral-300"
      >
        Drag bottom-right corner to resize: {width} × {height}px
      </div>
    </div>
  );
}

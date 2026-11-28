"use client";

import React, { useRef } from "react";
import { useMousePosition } from "../hooks/use-mouse-position";

export function UseMousePositionDemo() {
  const boxRef = useRef<HTMLDivElement>(null);
  const { x, y } = useMousePosition(boxRef);

  return (
    <div className="w-full max-w-md space-y-3">
      <div
        ref={boxRef}
        className="flex h-36 cursor-crosshair flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-300 bg-neutral-50/70 text-xs text-neutral-500 dark:border-neutral-700 dark:bg-neutral-900/50 dark:text-neutral-400"
      >
        <span>Move cursor inside this container</span>
        <span className="mt-2 font-mono text-sm font-bold text-neutral-950 dark:text-white">
          x: {x}px, y: {y}px
        </span>
      </div>
    </div>
  );
}

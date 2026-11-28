"use client";

import React from "react";
import { useRafState } from "../hooks/use-raf-state";

export function UseRafStateDemo() {
  const [coords, setCoords] = useRafState({ x: 0, y: 0 });

  return (
    <div className="w-full max-w-md space-y-3">
      <div
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          setCoords({
            x: Math.round(e.clientX - rect.left),
            y: Math.round(e.clientY - rect.top),
          });
        }}
        className="flex h-32 cursor-crosshair flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-300 bg-neutral-50/70 text-xs text-neutral-500 dark:border-neutral-700 dark:bg-neutral-900/50 dark:text-neutral-400"
      >
        <span>Move pointer inside box (batched via requestAnimationFrame)</span>
        <span className="mt-2 font-mono text-sm font-bold text-neutral-950 dark:text-white">
          x: {coords.x}, y: {coords.y}
        </span>
      </div>
    </div>
  );
}

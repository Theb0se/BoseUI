"use client";

import React, { useState } from "react";
import { useThrottle } from "../hooks/use-throttle";

export function UseThrottleDemo() {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const throttledCoords = useThrottle(coords, 250);

  return (
    <div className="w-full max-w-md space-y-4">
      <div
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          setCoords({
            x: Math.round(e.clientX - rect.left),
            y: Math.round(e.clientY - rect.top),
          });
        }}
        className="flex h-32 cursor-crosshair items-center justify-center rounded-2xl border border-dashed border-neutral-300 bg-neutral-50/70 text-xs text-neutral-500 transition-colors hover:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-900/50 dark:text-neutral-400"
      >
        Move your cursor rapidly inside this box
      </div>

      <div className="grid grid-cols-2 gap-3 rounded-xl border border-neutral-200 bg-neutral-50/70 p-4 dark:border-neutral-800 dark:bg-neutral-900/50">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-wider text-neutral-400">
            Raw Pointer
          </div>
          <div className="mt-1 font-mono text-xs font-semibold text-neutral-950 dark:text-white">
            x: {coords.x}, y: {coords.y}
          </div>
        </div>
        <div>
          <div className="font-mono text-[10px] uppercase tracking-wider text-neutral-400">
            Throttled (250ms)
          </div>
          <div className="mt-1 font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            x: {throttledCoords.x}, y: {throttledCoords.y}
          </div>
        </div>
      </div>
    </div>
  );
}

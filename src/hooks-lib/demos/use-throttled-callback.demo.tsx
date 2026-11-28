"use client";

import React, { useState } from "react";
import { useThrottledCallback } from "../hooks/use-throttled-callback";

export function UseThrottledCallbackDemo() {
  const [rawClicks, setRawClicks] = useState(0);
  const [throttledCount, setThrottledCount] = useState(0);

  const handleThrottled = useThrottledCallback((next: number) => {
    setThrottledCount(next);
  }, 800);

  return (
    <div className="w-full max-w-md space-y-4">
      <button
        type="button"
        onClick={() => {
          const next = rawClicks + 1;
          setRawClicks(next);
          handleThrottled(next);
        }}
        className="w-full rounded-xl bg-neutral-900 px-4 py-2.5 text-xs font-semibold text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
      >
        Click Rapidly (800ms Throttle)
      </button>

      <div className="grid grid-cols-2 gap-3 rounded-xl border border-neutral-200 bg-neutral-50/70 p-4 dark:border-neutral-800 dark:bg-neutral-900/50">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-wider text-neutral-400">
            Raw Clicks
          </div>
          <div className="mt-1 font-mono text-lg font-bold text-neutral-950 dark:text-white">
            {rawClicks}
          </div>
        </div>
        <div>
          <div className="font-mono text-[10px] uppercase tracking-wider text-neutral-400">
            Executed
          </div>
          <div className="mt-1 font-mono text-lg font-bold text-emerald-600 dark:text-emerald-400">
            {throttledCount}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { useInterval } from "../hooks/use-interval";

export function UseIntervalDemo() {
  const [ticks, setTicks] = useState(0);
  const [isRunning, setIsRunning] = useState(true);

  useInterval(() => {
    setTicks((t) => t + 1);
  }, isRunning ? 500 : null);

  return (
    <div className="w-full max-w-md space-y-4 text-center">
      <div className="rounded-2xl border border-neutral-200 bg-neutral-50/70 p-5 dark:border-neutral-800 dark:bg-neutral-900/50">
        <div className="font-mono text-[10px] uppercase tracking-wider text-neutral-400">
          500ms Interval Ticks
        </div>
        <div className="mt-1 font-mono text-3xl font-bold text-neutral-950 dark:text-white">
          {ticks}
        </div>
      </div>

      <div className="flex justify-center gap-2">
        <button
          type="button"
          onClick={() => setIsRunning((r) => !r)}
          className="rounded-xl bg-neutral-900 px-4 py-2 text-xs font-semibold text-white dark:bg-white dark:text-black"
        >
          {isRunning ? "Pause" : "Resume"}
        </button>
        <button
          type="button"
          onClick={() => setTicks(0)}
          className="rounded-xl border border-neutral-200 bg-white px-4 py-2 font-mono text-xs text-neutral-700 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

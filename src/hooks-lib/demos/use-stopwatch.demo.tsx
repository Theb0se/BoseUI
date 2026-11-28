"use client";

import React from "react";
import { useStopwatch } from "../hooks/use-stopwatch";

export function UseStopwatchDemo() {
  const { elapsedMs, isRunning, start, pause, reset } = useStopwatch(50);

  const seconds = (elapsedMs / 1000).toFixed(2);

  return (
    <div className="w-full max-w-md space-y-4 text-center">
      <div className="rounded-2xl border border-neutral-200 bg-neutral-50/70 p-5 dark:border-neutral-800 dark:bg-neutral-900/50">
        <div className="font-mono text-[10px] uppercase tracking-wider text-neutral-400">
          Elapsed Time
        </div>
        <div className="mt-1 font-mono text-4xl font-bold tabular-nums text-neutral-950 dark:text-white">
          {seconds}s
        </div>
      </div>

      <div className="flex justify-center gap-2">
        <button
          type="button"
          onClick={isRunning ? pause : start}
          className="rounded-xl bg-neutral-900 px-4 py-2 text-xs font-semibold text-white dark:bg-white dark:text-black"
        >
          {isRunning ? "Pause" : "Start"}
        </button>
        <button
          type="button"
          onClick={reset}
          className="rounded-xl border border-neutral-200 bg-white px-4 py-2 font-mono text-xs text-neutral-700 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

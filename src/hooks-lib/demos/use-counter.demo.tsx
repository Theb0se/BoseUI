"use client";

import React from "react";
import { useCounter } from "../hooks/use-counter";

export function UseCounterDemo() {
  const { count, increment, decrement, reset, set } = useCounter(5, {
    min: 0,
    max: 10,
    step: 1,
  });

  return (
    <div className="w-full max-w-md space-y-4 text-center">
      <div className="rounded-2xl border border-neutral-200 bg-neutral-50/70 p-5 dark:border-neutral-800 dark:bg-neutral-900/50">
        <div className="font-mono text-[10px] uppercase tracking-wider text-neutral-400">
          Bounded Counter (0 to 10)
        </div>
        <div className="mt-1 font-mono text-4xl font-bold text-neutral-950 dark:text-white">
          {count}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => decrement()}
          className="rounded-xl border border-neutral-200 bg-white px-4 py-2 font-mono text-xs font-semibold text-neutral-700 hover:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300"
        >
          -1
        </button>
        <button
          type="button"
          onClick={() => increment()}
          className="rounded-xl bg-neutral-900 px-4 py-2 font-mono text-xs font-semibold text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
        >
          +1
        </button>
        <button
          type="button"
          onClick={() => set(10)}
          className="rounded-xl border border-neutral-200 bg-white px-3.5 py-2 font-mono text-xs text-neutral-700 hover:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300"
        >
          Max (10)
        </button>
        <button
          type="button"
          onClick={reset}
          className="rounded-xl border border-neutral-200 bg-white px-3.5 py-2 font-mono text-xs text-neutral-700 hover:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

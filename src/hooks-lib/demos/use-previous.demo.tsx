"use client";

import React, { useState } from "react";
import { usePrevious } from "../hooks/use-previous";

export function UsePreviousDemo() {
  const [count, setCount] = useState(0);
  const previousCount = usePrevious(count);

  return (
    <div className="w-full max-w-md space-y-4">
      <div className="grid grid-cols-2 gap-3 rounded-2xl border border-neutral-200 bg-neutral-50/70 p-4 dark:border-neutral-800 dark:bg-neutral-900/50">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-wider text-neutral-400">
            Current Value
          </div>
          <div className="mt-1 font-mono text-2xl font-bold text-neutral-950 dark:text-white">
            {count}
          </div>
        </div>
        <div>
          <div className="font-mono text-[10px] uppercase tracking-wider text-neutral-400">
            Previous Value
          </div>
          <div className="mt-1 font-mono text-2xl font-bold text-neutral-500 dark:text-neutral-400">
            {previousCount ?? "undefined"}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setCount((c) => c - 1)}
          className="rounded-xl border border-neutral-200 bg-white px-4 py-2 font-mono text-xs font-semibold text-neutral-700 hover:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300"
        >
          -1
        </button>
        <button
          type="button"
          onClick={() => setCount((c) => c + 1)}
          className="rounded-xl bg-neutral-900 px-4 py-2 font-mono text-xs font-semibold text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
        >
          +1
        </button>
        <button
          type="button"
          onClick={() => setCount(Math.floor(Math.random() * 100))}
          className="rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-xs font-medium text-neutral-700 hover:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300"
        >
          Randomize
        </button>
      </div>
    </div>
  );
}

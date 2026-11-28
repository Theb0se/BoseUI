"use client";

import React, { useState } from "react";
import { useDebouncedCallback } from "../hooks/use-debounced-callback";

export function UseDebouncedCallbackDemo() {
  const [rawClicks, setRawClicks] = useState(0);
  const [savedCount, setSavedCount] = useState(0);
  const [lastSavedAt, setLastSavedAt] = useState<string>("Not triggered yet");

  const debouncedSave = useDebouncedCallback((count: number) => {
    setSavedCount(count);
    setLastSavedAt(new Date().toLocaleTimeString());
  }, 600);

  const handleClick = () => {
    const next = rawClicks + 1;
    setRawClicks(next);
    debouncedSave(next);
  };

  return (
    <div className="w-full max-w-md space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={handleClick}
          className="rounded-xl bg-neutral-900 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
        >
          Trigger Action ({rawClicks})
        </button>
        <button
          type="button"
          onClick={() => debouncedSave.flush()}
          className="rounded-xl border border-neutral-200 bg-white px-3 py-2 font-mono text-xs font-medium text-neutral-700 hover:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300"
        >
          Flush Now
        </button>
        <button
          type="button"
          onClick={() => debouncedSave.cancel()}
          className="rounded-xl border border-neutral-200 bg-white px-3 py-2 font-mono text-xs font-medium text-neutral-700 hover:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300"
        >
          Cancel Pending
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 rounded-xl border border-neutral-200 bg-neutral-50/70 p-4 dark:border-neutral-800 dark:bg-neutral-900/50">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-wider text-neutral-400">
            Raw Invocations
          </div>
          <div className="mt-1 font-mono text-sm font-bold text-neutral-950 dark:text-white">
            {rawClicks}
          </div>
        </div>
        <div>
          <div className="font-mono text-[10px] uppercase tracking-wider text-neutral-400">
            Committed Value
          </div>
          <div className="mt-1 font-mono text-sm font-bold text-emerald-600 dark:text-emerald-400">
            {savedCount}
          </div>
        </div>
        <div className="col-span-2 border-t border-neutral-200/70 pt-2 font-mono text-[11px] text-neutral-500 dark:border-neutral-800">
          Last executed: {lastSavedAt}
        </div>
      </div>
    </div>
  );
}

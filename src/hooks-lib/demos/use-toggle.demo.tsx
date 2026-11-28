"use client";

import React from "react";
import { useToggle } from "../hooks/use-toggle";

export function UseToggleDemo() {
  const [enabled, toggle, setEnabled] = useToggle(false);

  return (
    <div className="w-full max-w-md space-y-4">
      <div className="flex items-center justify-between rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-950">
        <div>
          <div className="text-xs font-semibold text-neutral-950 dark:text-white">
            Feature Flag
          </div>
          <div className="font-mono text-[11px] text-neutral-500">
            Status: {enabled ? "enabled (true)" : "disabled (false)"}
          </div>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          onClick={() => toggle()}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            enabled
              ? "bg-neutral-900 dark:bg-white"
              : "bg-neutral-200 dark:bg-neutral-800"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform dark:bg-black ${
              enabled ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => toggle()}
          className="rounded-xl bg-neutral-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
        >
          Toggle
        </button>
        <button
          type="button"
          onClick={() => setEnabled(true)}
          className="rounded-xl border border-neutral-200 bg-white px-3 py-2 font-mono text-xs text-neutral-700 hover:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300"
        >
          Force True
        </button>
        <button
          type="button"
          onClick={() => setEnabled(false)}
          className="rounded-xl border border-neutral-200 bg-white px-3 py-2 font-mono text-xs text-neutral-700 hover:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300"
        >
          Force False
        </button>
      </div>
    </div>
  );
}

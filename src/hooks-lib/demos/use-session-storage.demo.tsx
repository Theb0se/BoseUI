"use client";

import React from "react";
import { useSessionStorage } from "../hooks/use-session-storage";

export function UseSessionStorageDemo() {
  const [tabNote, setTabNote, removeTabNote] = useSessionStorage<string>(
    "boseui-demo-tab-note",
    "Draft for this tab only"
  );

  return (
    <div className="w-full max-w-md space-y-4">
      <div className="space-y-2">
        <label
          htmlFor="session-storage-input"
          className="text-xs font-medium text-neutral-700 dark:text-neutral-300"
        >
          Tab-scoped Note (persists on refresh, isolated per tab)
        </label>
        <input
          id="session-storage-input"
          type="text"
          value={tabNote}
          onChange={(e) => setTabNote(e.target.value)}
          className="h-10 w-full rounded-xl border border-neutral-200 bg-white px-3.5 text-sm text-neutral-900 focus:border-neutral-900 focus:outline-none dark:border-neutral-800 dark:bg-neutral-950 dark:text-white dark:focus:border-white"
        />
      </div>

      <div className="flex items-center justify-between rounded-xl border border-neutral-200 bg-neutral-50/70 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900/50">
        <span className="truncate font-mono text-xs text-neutral-600 dark:text-neutral-400">
          {tabNote}
        </span>
        <button
          type="button"
          onClick={removeTabNote}
          className="ml-3 shrink-0 rounded-lg border border-neutral-200 bg-white px-2.5 py-1 font-mono text-xs text-neutral-600 hover:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-400"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

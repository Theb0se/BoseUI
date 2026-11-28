"use client";

import React from "react";
import { useLocalStorage } from "../hooks/use-local-storage";

export function UseLocalStorageDemo() {
  const [name, setName, removeName] = useLocalStorage<string>(
    "boseui-demo-username",
    "Rishabh"
  );

  return (
    <div className="w-full max-w-md space-y-4">
      <div className="space-y-2">
        <label
          htmlFor="local-storage-input"
          className="text-xs font-medium text-neutral-700 dark:text-neutral-300"
        >
          Persisted Name (survives reload &amp; syncs across tabs)
        </label>
        <input
          id="local-storage-input"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="h-10 w-full rounded-xl border border-neutral-200 bg-white px-3.5 text-sm text-neutral-900 focus:border-neutral-900 focus:outline-none dark:border-neutral-800 dark:bg-neutral-950 dark:text-white dark:focus:border-white"
        />
      </div>

      <div className="flex items-center justify-between rounded-xl border border-neutral-200 bg-neutral-50/70 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900/50">
        <div className="font-mono text-xs text-neutral-600 dark:text-neutral-400">
          Stored:{" "}
          <span className="font-semibold text-neutral-950 dark:text-white">
            &quot;{name}&quot;
          </span>
        </div>
        <button
          type="button"
          onClick={removeName}
          className="rounded-lg border border-neutral-200 bg-white px-2.5 py-1 font-mono text-xs text-neutral-600 hover:border-neutral-400 hover:text-neutral-950 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-400 dark:hover:text-white"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

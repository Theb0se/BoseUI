"use client";

import React, { useMemo, useState } from "react";
import { useDeferredValue } from "../hooks/use-deferred-value";

const ITEMS = Array.from({ length: 200 }, (_, i) => `Hook Utility #${i + 1}`);

export function UseDeferredValueDemo() {
  const [query, setQuery] = useState("");
  const { deferredValue, isStale } = useDeferredValue(query);

  const filtered = useMemo(() => {
    const q = deferredValue.trim().toLowerCase();
    if (!q) return ITEMS.slice(0, 6);
    return ITEMS.filter((item) => item.toLowerCase().includes(q)).slice(0, 6);
  }, [deferredValue]);

  return (
    <div className="w-full max-w-md space-y-3">
      <div className="flex items-center justify-between">
        <label
          htmlFor="deferred-search"
          className="text-xs font-medium text-neutral-700 dark:text-neutral-300"
        >
          Deferred List Filter
        </label>
        <span className="font-mono text-[11px] text-neutral-400">
          {isStale ? "Updating..." : "Synced"}
        </span>
      </div>

      <input
        id="deferred-search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Filter 200 items (e.g. 42)..."
        className="h-10 w-full rounded-xl border border-neutral-200 bg-white px-3.5 text-xs dark:border-neutral-800 dark:bg-neutral-950 dark:text-white"
      />

      <div
        className={`grid grid-cols-2 gap-1.5 transition-opacity ${
          isStale ? "opacity-60" : "opacity-100"
        }`}
      >
        {filtered.map((item) => (
          <div
            key={item}
            className="rounded-lg border border-neutral-200 bg-neutral-50/70 px-3 py-2 font-mono text-[11px] text-neutral-700 dark:border-neutral-800 dark:bg-neutral-900/50 dark:text-neutral-300"
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

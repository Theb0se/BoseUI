"use client";

import React from "react";
import { useSearch } from "../hooks/use-search";

const SAMPLE_HOOKS = [
  "useDebounce",
  "useThrottle",
  "useLocalStorage",
  "useSessionStorage",
  "useFetch",
  "usePagination",
  "useWebSocket",
  "useHotkeys",
];

export function UseSearchDemo() {
  const { query, setQuery, results, loading, clear } = useSearch(
    async (q) => {
      await new Promise((r) => setTimeout(r, 200));
      return SAMPLE_HOOKS.filter((item) =>
        item.toLowerCase().includes(q.toLowerCase())
      );
    },
    { delayMs: 250, minLength: 1 }
  );

  return (
    <div className="w-full max-w-md space-y-3">
      <div className="flex gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search hooks (e.g. use, fetch, scroll)..."
          className="h-9 flex-1 rounded-xl border border-neutral-200 bg-white px-3 text-xs dark:border-neutral-800 dark:bg-neutral-950 dark:text-white"
        />
        {query && (
          <button
            type="button"
            onClick={clear}
            className="rounded-xl border border-neutral-200 px-3 text-xs dark:border-neutral-800"
          >
            Clear
          </button>
        )}
      </div>

      <div className="min-h-20 rounded-2xl border border-neutral-200 bg-neutral-50/70 p-3 font-mono text-xs dark:border-neutral-800 dark:bg-neutral-900/50">
        {loading ? (
          <span className="text-neutral-400">Searching...</span>
        ) : results.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {results.map((r) => (
              <span
                key={r}
                className="rounded-lg border border-neutral-200 bg-white px-2.5 py-1 dark:border-neutral-800 dark:bg-neutral-950 dark:text-white"
              >
                {r}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-neutral-400">
            {query ? "No matches found" : "Type a query to trigger debounced search"}
          </span>
        )}
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { useDebounce } from "../hooks/use-debounce";

export function UseDebounceDemo() {
  const [query, setQuery] = useState("boseui");
  const [delay, setDelay] = useState(400);
  const debouncedQuery = useDebounce(query, delay);

  return (
    <div className="w-full max-w-md space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label
            htmlFor="debounce-input"
            className="text-xs font-medium text-neutral-700 dark:text-neutral-300"
          >
            Type to search
          </label>
          <span className="font-mono text-[11px] text-neutral-500">
            Delay: {delay}ms
          </span>
        </div>
        <input
          id="debounce-input"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type something..."
          className="h-10 w-full rounded-xl border border-neutral-200 bg-white px-3.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none dark:border-neutral-800 dark:bg-neutral-950 dark:text-white dark:focus:border-white"
        />
      </div>

      <div className="flex items-center gap-2">
        {[200, 400, 800].map((ms) => (
          <button
            key={ms}
            type="button"
            onClick={() => setDelay(ms)}
            className={`rounded-lg border px-2.5 py-1 font-mono text-xs transition-colors ${
              delay === ms
                ? "border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-black"
                : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-400"
            }`}
          >
            {ms}ms
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 rounded-xl border border-neutral-200 bg-neutral-50/70 p-4 dark:border-neutral-800 dark:bg-neutral-900/50">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-wider text-neutral-400">
            Immediate
          </div>
          <div className="mt-1 truncate font-mono text-xs font-semibold text-neutral-950 dark:text-white">
            {query || "—"}
          </div>
        </div>
        <div>
          <div className="font-mono text-[10px] uppercase tracking-wider text-neutral-400">
            Debounced
          </div>
          <div className="mt-1 truncate font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            {debouncedQuery || "—"}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import { useQueryState } from "../hooks/use-query-state";

export function UseQueryStateDemo() {
  const [filter, setFilter] = useQueryState("filter", "all");

  return (
    <div className="w-full max-w-md space-y-4">
      <div className="flex flex-wrap gap-2">
        {["all", "timing", "state", "dom"].map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => setFilter(opt)}
            className={`rounded-xl border px-3.5 py-1.5 font-mono text-xs font-medium transition-colors ${
              filter === opt
                ? "border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-black"
                : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-400"
            }`}
          >
            ?filter={opt}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-neutral-200 bg-neutral-50/70 px-4 py-3 font-mono text-xs text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900/50 dark:text-neutral-400">
        Active URL param:{" "}
        <span className="font-semibold text-neutral-950 dark:text-white">
          {filter}
        </span>
      </div>
    </div>
  );
}

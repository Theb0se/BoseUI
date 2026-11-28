"use client";

import React from "react";
import { useSet } from "../hooks/use-set";

const TAG_OPTIONS = ["react", "typescript", "tailwind", "nextjs", "ssr-safe"];

export function UseSetDemo() {
  const [tags, actions] = useSet<string>(["react", "typescript"]);

  return (
    <div className="w-full max-w-md space-y-4">
      <div className="flex flex-wrap gap-2">
        {TAG_OPTIONS.map((tag) => {
          const active = tags.has(tag);
          return (
            <button
              key={tag}
              type="button"
              onClick={() => actions.toggle(tag)}
              className={`rounded-xl border px-3 py-1.5 font-mono text-xs font-medium transition-colors ${
                active
                  ? "border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-black"
                  : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-400"
              }`}
            >
              {active ? `✓ ${tag}` : tag}
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between rounded-xl border border-neutral-200 bg-neutral-50/70 px-4 py-3 font-mono text-xs dark:border-neutral-800 dark:bg-neutral-900/50">
        <span className="text-neutral-600 dark:text-neutral-400">
          Set({tags.size}): [{Array.from(tags).join(", ")}]
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={actions.clear}
            className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={actions.reset}
            className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

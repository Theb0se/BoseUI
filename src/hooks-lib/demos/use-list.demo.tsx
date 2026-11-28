"use client";

import React, { useState } from "react";
import { useList } from "../hooks/use-list";

export function UseListDemo() {
  const [items, actions] = useList<string>(["useDebounce", "useToggle"]);
  const [input, setInput] = useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    actions.push(input.trim());
    setInput("");
  };

  return (
    <div className="w-full max-w-md space-y-4">
      <form onSubmit={handleAdd} className="flex items-center gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add hook name..."
          className="h-9 flex-1 rounded-xl border border-neutral-200 bg-white px-3 text-xs dark:border-neutral-800 dark:bg-neutral-950 dark:text-white"
        />
        <button
          type="submit"
          className="h-9 rounded-xl bg-neutral-900 px-3.5 text-xs font-semibold text-white dark:bg-white dark:text-black"
        >
          Push
        </button>
      </form>

      <div className="space-y-1.5 rounded-2xl border border-neutral-200 bg-neutral-50/70 p-3 dark:border-neutral-800 dark:bg-neutral-900/50">
        {items.map((item, idx) => (
          <div
            key={`${item}-${idx}`}
            className="flex items-center justify-between rounded-lg bg-white px-3 py-2 font-mono text-xs dark:bg-neutral-950"
          >
            <span className="text-neutral-900 dark:text-white">{item}</span>
            <button
              type="button"
              onClick={() => actions.removeAt(idx)}
              className="text-[11px] text-neutral-400 hover:text-rose-500"
            >
              Remove
            </button>
          </div>
        ))}
        {items.length === 0 && (
          <div className="py-3 text-center font-mono text-xs text-neutral-400">
            List is empty
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={actions.clear}
          className="rounded-lg border border-neutral-200 px-2.5 py-1 font-mono text-xs text-neutral-500 dark:border-neutral-800"
        >
          Clear
        </button>
        <button
          type="button"
          onClick={actions.reset}
          className="rounded-lg border border-neutral-200 px-2.5 py-1 font-mono text-xs text-neutral-500 dark:border-neutral-800"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

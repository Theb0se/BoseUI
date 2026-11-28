"use client";

import React, { useState } from "react";
import { useMap } from "../hooks/use-map";

export function UseMapDemo() {
  const [map, actions] = useMap<string, string>([
    ["theme", "dark"],
    ["locale", "en-US"],
  ]);
  const [keyInput, setKeyInput] = useState("");
  const [valInput, setValInput] = useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyInput.trim()) return;
    actions.set(keyInput.trim(), valInput.trim() || "true");
    setKeyInput("");
    setValInput("");
  };

  return (
    <div className="w-full max-w-md space-y-4">
      <form onSubmit={handleAdd} className="flex items-center gap-2">
        <input
          value={keyInput}
          onChange={(e) => setKeyInput(e.target.value)}
          placeholder="Key"
          className="h-9 w-1/3 rounded-xl border border-neutral-200 bg-white px-3 font-mono text-xs dark:border-neutral-800 dark:bg-neutral-950 dark:text-white"
        />
        <input
          value={valInput}
          onChange={(e) => setValInput(e.target.value)}
          placeholder="Value"
          className="h-9 flex-1 rounded-xl border border-neutral-200 bg-white px-3 font-mono text-xs dark:border-neutral-800 dark:bg-neutral-950 dark:text-white"
        />
        <button
          type="submit"
          className="h-9 rounded-xl bg-neutral-900 px-3.5 text-xs font-semibold text-white dark:bg-white dark:text-black"
        >
          Set
        </button>
      </form>

      <div className="space-y-1.5 rounded-2xl border border-neutral-200 bg-neutral-50/70 p-3 dark:border-neutral-800 dark:bg-neutral-900/50">
        {Array.from(map.entries()).map(([k, v]) => (
          <div
            key={k}
            className="flex items-center justify-between rounded-lg bg-white px-3 py-2 font-mono text-xs dark:bg-neutral-950"
          >
            <span>
              <span className="text-neutral-400">{k}:</span>{" "}
              <span className="font-semibold text-neutral-950 dark:text-white">
                {v}
              </span>
            </span>
            <button
              type="button"
              onClick={() => actions.remove(k)}
              className="text-[11px] text-neutral-400 hover:text-rose-500"
            >
              Remove
            </button>
          </div>
        ))}
        {map.size === 0 && (
          <div className="py-3 text-center font-mono text-xs text-neutral-400">
            Map is empty
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

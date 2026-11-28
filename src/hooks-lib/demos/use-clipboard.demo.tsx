"use client";

import React, { useState } from "react";
import { useClipboard } from "../hooks/use-clipboard";

export function UseClipboardDemo() {
  const { text, error, read, write } = useClipboard();
  const [input, setInput] = useState("Hello from BoseUI!");

  return (
    <div className="w-full max-w-md space-y-3">
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="h-9 flex-1 rounded-xl border border-neutral-200 bg-white px-3 text-xs dark:border-neutral-800 dark:bg-neutral-950 dark:text-white"
        />
        <button
          type="button"
          onClick={() => write(input)}
          className="rounded-xl bg-neutral-900 px-3.5 py-2 text-xs font-semibold text-white dark:bg-white dark:text-black"
        >
          Write
        </button>
        <button
          type="button"
          onClick={read}
          className="rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-xs font-medium text-neutral-700 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300"
        >
          Read
        </button>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-neutral-50/70 px-4 py-3 font-mono text-xs dark:border-neutral-800 dark:bg-neutral-900/50">
        {error ? (
          <span className="text-rose-500">{error}</span>
        ) : (
          <span className="text-neutral-600 dark:text-neutral-300">
            Clipboard text: {text ?? "—"}
          </span>
        )}
      </div>
    </div>
  );
}

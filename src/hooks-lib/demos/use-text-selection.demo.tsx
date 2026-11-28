"use client";

import React from "react";
import { useTextSelection } from "../hooks/use-text-selection";

export function UseTextSelectionDemo() {
  const selection = useTextSelection();

  return (
    <div className="w-full max-w-md space-y-4">
      <p className="rounded-2xl border border-neutral-200 bg-white p-4 text-xs leading-relaxed text-neutral-700 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300">
        Highlight any part of this paragraph with your mouse or keyboard to
        inspect the live selected text string returned by{" "}
        <code className="font-mono font-semibold">useTextSelection</code>.
      </p>

      <div className="rounded-xl border border-neutral-200 bg-neutral-50/70 px-4 py-3 font-mono text-xs text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900/50 dark:text-neutral-400">
        Selected:{" "}
        <span className="font-semibold text-neutral-950 dark:text-white">
          {selection ? `"${selection}"` : "None"}
        </span>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import { useUndoRedo } from "../hooks/use-undo-redo";

const PALETTE = ["#171717", "#0d9488", "#2563eb", "#9333ea", "#e11d48", "#d97706"];

export function UseUndoRedoDemo() {
  const { state, set, undo, redo, reset, canUndo, canRedo, past, future } =
    useUndoRedo<string>("#0d9488");

  return (
    <div className="w-full max-w-md space-y-4">
      <div className="flex items-center justify-between rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-950">
        <div className="flex items-center gap-3">
          <span
            className="h-9 w-9 rounded-xl border border-neutral-200 dark:border-neutral-700"
            style={{ backgroundColor: state }}
          />
          <div>
            <div className="font-mono text-xs font-semibold text-neutral-950 dark:text-white">
              {state}
            </div>
            <div className="font-mono text-[10px] text-neutral-400">
              Past: {past.length} · Future: {future.length}
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-lg border border-neutral-200 px-2.5 py-1 font-mono text-xs text-neutral-500 hover:text-neutral-950 dark:border-neutral-800 dark:hover:text-white"
        >
          Reset
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {PALETTE.map((hex) => (
          <button
            key={hex}
            type="button"
            onClick={() => set(hex)}
            aria-label={`Select color ${hex}`}
            className={`h-8 w-8 rounded-lg border-2 transition-transform hover:scale-105 ${
              state === hex
                ? "border-neutral-950 dark:border-white"
                : "border-transparent"
            }`}
            style={{ backgroundColor: hex }}
          />
        ))}
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={undo}
          disabled={!canUndo}
          className="rounded-xl border border-neutral-200 bg-white px-4 py-2 font-mono text-xs font-semibold text-neutral-800 disabled:opacity-40 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-200"
        >
          Undo
        </button>
        <button
          type="button"
          onClick={redo}
          disabled={!canRedo}
          className="rounded-xl border border-neutral-200 bg-white px-4 py-2 font-mono text-xs font-semibold text-neutral-800 disabled:opacity-40 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-200"
        >
          Redo
        </button>
      </div>
    </div>
  );
}

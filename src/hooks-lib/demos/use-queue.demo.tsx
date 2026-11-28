"use client";

import React, { useRef } from "react";
import { useQueue } from "../hooks/use-queue";

export function UseQueueDemo() {
  const { pending, isProcessing, results, enqueue, clear } = useQueue<string>();
  const taskIdRef = useRef(0);

  const addTask = () => {
    const id = ++taskIdRef.current;
    enqueue(
      () =>
        new Promise<string>((resolve) => {
          setTimeout(() => resolve(`Task #${id} done`), 550);
        })
    );
  };

  return (
    <div className="w-full max-w-md space-y-3">
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-neutral-500">
          {isProcessing ? "Processing..." : "Idle"} · Queued: {pending}
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={addTask}
            className="rounded-xl bg-neutral-900 px-3.5 py-1.5 text-xs font-semibold text-white dark:bg-white dark:text-black"
          >
            Enqueue Task
          </button>
          <button
            type="button"
            onClick={clear}
            className="rounded-xl border border-neutral-200 px-3 py-1.5 text-xs dark:border-neutral-800"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="min-h-16 space-y-1 rounded-2xl border border-neutral-200 bg-neutral-50/70 p-3 font-mono text-xs dark:border-neutral-800 dark:bg-neutral-900/50">
        {results.length === 0 ? (
          <span className="text-neutral-400">Completed tasks appear here in FIFO order</span>
        ) : (
          results.slice(-4).map((res, idx) => (
            <div key={idx} className="text-emerald-600 dark:text-emerald-400">
              ✓ {res}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

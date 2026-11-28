"use client";

import React from "react";
import { useStateHistory } from "../hooks/use-state-history";

const STEPS = ["Draft", "Review", "Approved", "Published"];

export function UseStateHistoryDemo() {
  const { value, set, history, pointer, back, forward, go, canBack, canForward } =
    useStateHistory<string>("Draft");

  return (
    <div className="w-full max-w-md space-y-4">
      <div className="flex flex-wrap gap-2">
        {STEPS.map((step) => (
          <button
            key={step}
            type="button"
            onClick={() => set(step)}
            className={`rounded-xl border px-3 py-1.5 text-xs font-medium transition-colors ${
              value === step
                ? "border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-black"
                : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-400"
            }`}
          >
            {step}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between rounded-xl border border-neutral-200 bg-neutral-50/70 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900/50">
        <div className="font-mono text-xs text-neutral-600 dark:text-neutral-400">
          Current: <span className="font-bold text-neutral-950 dark:text-white">{value}</span>{" "}
          ({pointer + 1}/{history.length})
        </div>
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={() => back()}
            disabled={!canBack}
            className="rounded-lg border border-neutral-200 bg-white px-2.5 py-1 font-mono text-xs disabled:opacity-40 dark:border-neutral-800 dark:bg-neutral-950"
          >
            Back
          </button>
          <button
            type="button"
            onClick={() => forward()}
            disabled={!canForward}
            className="rounded-lg border border-neutral-200 bg-white px-2.5 py-1 font-mono text-xs disabled:opacity-40 dark:border-neutral-800 dark:bg-neutral-950"
          >
            Forward
          </button>
          <button
            type="button"
            onClick={() => go(0)}
            disabled={!canBack}
            className="rounded-lg border border-neutral-200 bg-white px-2.5 py-1 font-mono text-xs disabled:opacity-40 dark:border-neutral-800 dark:bg-neutral-950"
          >
            Rewind
          </button>
        </div>
      </div>
    </div>
  );
}

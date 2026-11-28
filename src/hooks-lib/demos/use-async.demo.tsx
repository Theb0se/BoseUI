"use client";

import React from "react";
import { useAsync } from "../hooks/use-async";

const fakeRequest = (shouldFail: boolean) =>
  new Promise<string>((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) reject(new Error("Simulated network failure"));
      else resolve(`Success at ${new Date().toLocaleTimeString()}`);
    }, 600);
  });

export function UseAsyncDemo() {
  const { execute, status, loading, data, error, reset } = useAsync(fakeRequest);

  return (
    <div className="w-full max-w-md space-y-4">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={loading}
          onClick={() => execute(false)}
          className="rounded-xl bg-neutral-900 px-3.5 py-2 text-xs font-semibold text-white disabled:opacity-50 dark:bg-white dark:text-black"
        >
          Run Success
        </button>
        <button
          type="button"
          disabled={loading}
          onClick={() => execute(true)}
          className="rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-xs font-medium text-neutral-700 disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300"
        >
          Run Error
        </button>
        <button
          type="button"
          onClick={reset}
          className="rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-xs text-neutral-500 dark:border-neutral-800 dark:bg-neutral-950"
        >
          Reset
        </button>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-neutral-50/70 p-4 font-mono text-xs dark:border-neutral-800 dark:bg-neutral-900/50">
        <div>Status: {status}</div>
        {data && <div className="mt-1 text-emerald-600 dark:text-emerald-400">{data}</div>}
        {error && <div className="mt-1 text-rose-500">{error.message}</div>}
      </div>
    </div>
  );
}

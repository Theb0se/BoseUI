"use client";

import React from "react";
import { useOptimistic } from "../hooks/use-optimistic";

export function UseOptimisticDemo() {
  const { state: likes, isPending, error, applyOptimistic } = useOptimistic(42);

  const handleLike = (shouldFail: boolean) => {
    void applyOptimistic(
      (prev) => prev + 1,
      () =>
        new Promise<number>((resolve, reject) => {
          setTimeout(() => {
            if (shouldFail) reject(new Error("Server rejected update — rolled back"));
            else resolve(likes + 1);
          }, 700);
        })
    );
  };

  return (
    <div className="w-full max-w-md space-y-4 text-center">
      <div className="rounded-2xl border border-neutral-200 bg-neutral-50/70 p-5 dark:border-neutral-800 dark:bg-neutral-900/50">
        <div className="font-mono text-3xl font-bold text-neutral-950 dark:text-white">
          ♥ {likes}
        </div>
        <div className="mt-1 font-mono text-[11px] text-neutral-500">
          {isPending ? "Syncing with server..." : "Committed"}
        </div>
        {error && <div className="mt-2 font-mono text-xs text-rose-500">{error.message}</div>}
      </div>

      <div className="flex justify-center gap-2">
        <button
          type="button"
          disabled={isPending}
          onClick={() => handleLike(false)}
          className="rounded-xl bg-neutral-900 px-4 py-2 text-xs font-semibold text-white disabled:opacity-50 dark:bg-white dark:text-black"
        >
          Like (Succeeds)
        </button>
        <button
          type="button"
          disabled={isPending}
          onClick={() => handleLike(true)}
          className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-xs font-medium text-neutral-700 disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300"
        >
          Like (Fails &amp; Rollbacks)
        </button>
      </div>
    </div>
  );
}

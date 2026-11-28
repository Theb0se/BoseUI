"use client";

import React, { useState } from "react";
import { useMutation } from "../hooks/use-mutation";

export function UseMutationDemo() {
  const [title, setTitle] = useState("New Release v2.1");

  const { mutate, data, loading, isSuccess, reset } = useMutation(
    async (payload: { title: string }) => {
      await new Promise((r) => setTimeout(r, 500));
      return { id: Math.floor(Math.random() * 1000), title: payload.title };
    }
  );

  return (
    <div className="w-full max-w-md space-y-3">
      <div className="flex gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="h-9 flex-1 rounded-xl border border-neutral-200 bg-white px-3 text-xs dark:border-neutral-800 dark:bg-neutral-950 dark:text-white"
        />
        <button
          type="button"
          disabled={loading}
          onClick={() => mutate({ title })}
          className="rounded-xl bg-neutral-900 px-4 py-2 text-xs font-semibold text-white disabled:opacity-50 dark:bg-white dark:text-black"
        >
          {loading ? "Saving..." : "POST"}
        </button>
      </div>

      {isSuccess && data && (
        <div className="flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 font-mono text-xs text-emerald-700 dark:text-emerald-300">
          <span>Saved #{data.id}: {data.title}</span>
          <button type="button" onClick={reset} className="underline">
            Reset
          </button>
        </div>
      )}
    </div>
  );
}

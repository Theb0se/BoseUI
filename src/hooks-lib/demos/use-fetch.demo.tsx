"use client";

import React from "react";
import { useFetch } from "../hooks/use-fetch";

interface RegistrySummary {
  items?: Array<{ name: string }>;
}

export function UseFetchDemo() {
  const { data, loading, error, refetch, abort } = useFetch<RegistrySummary>(
    "/registry.json",
    { cacheResponse: true, retries: 1 }
  );

  return (
    <div className="w-full max-w-md space-y-3">
      <div className="flex items-center justify-between rounded-2xl border border-neutral-200 bg-neutral-50/70 p-4 font-mono text-xs dark:border-neutral-800 dark:bg-neutral-900/50">
        {loading ? (
          <span>Fetching /registry.json...</span>
        ) : error ? (
          <span className="text-rose-500">{error.message}</span>
        ) : (
          <span className="text-neutral-950 dark:text-white">
            Loaded {data?.items?.length ?? 0} registry components
          </span>
        )}
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={refetch}
          className="rounded-xl bg-neutral-900 px-3.5 py-2 text-xs font-semibold text-white dark:bg-white dark:text-black"
        >
          Refetch
        </button>
        <button
          type="button"
          onClick={abort}
          className="rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-xs dark:border-neutral-800 dark:bg-neutral-950"
        >
          Abort
        </button>
      </div>
    </div>
  );
}

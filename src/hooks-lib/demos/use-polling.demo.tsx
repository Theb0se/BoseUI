"use client";

import React from "react";
import { usePolling } from "../hooks/use-polling";

export function UsePollingDemo() {
  const { data, isPolling, isLoading, start, stop, pollNow } = usePolling(
    async () => {
      await new Promise((r) => setTimeout(r, 150));
      return {
        timestamp: new Date().toLocaleTimeString(),
        latencyMs: Math.floor(15 + Math.random() * 40),
      };
    },
    { intervalMs: 2500, enabled: true }
  );

  return (
    <div className="w-full max-w-md space-y-4">
      <div className="rounded-2xl border border-neutral-200 bg-neutral-50/70 p-4 font-mono text-xs dark:border-neutral-800 dark:bg-neutral-900/50">
        <div className="flex justify-between">
          <span className="text-neutral-500">Polling</span>
          <span className={isPolling ? "text-emerald-600 dark:text-emerald-400" : "text-neutral-400"}>
            {isPolling ? (isLoading ? "Fetching..." : "Active (2.5s)") : "Paused"}
          </span>
        </div>
        <div className="mt-2 flex justify-between">
          <span className="text-neutral-500">Last Sample</span>
          <span className="text-neutral-950 dark:text-white">
            {data ? `${data.timestamp} (${data.latencyMs}ms)` : "—"}
          </span>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={isPolling ? stop : start}
          className="rounded-xl bg-neutral-900 px-4 py-2 text-xs font-semibold text-white dark:bg-white dark:text-black"
        >
          {isPolling ? "Stop Polling" : "Start Polling"}
        </button>
        <button
          type="button"
          onClick={() => void pollNow()}
          className="rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-xs dark:border-neutral-800 dark:bg-neutral-950"
        >
          Poll Now
        </button>
      </div>
    </div>
  );
}

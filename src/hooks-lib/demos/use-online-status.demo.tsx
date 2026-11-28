"use client";

import React from "react";
import { useOnlineStatus } from "../hooks/use-online-status";

export function UseOnlineStatusDemo() {
  const isOnline = useOnlineStatus();

  return (
    <div className="w-full max-w-md space-y-3 text-center">
      <div className="rounded-2xl border border-neutral-200 bg-neutral-50/70 p-6 dark:border-neutral-800 dark:bg-neutral-900/50">
        <span
          className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1 font-mono text-xs font-semibold ${
            isOnline
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
          }`}
        >
          <span
            className={`h-2 w-2 rounded-full ${
              isOnline ? "bg-emerald-500" : "bg-rose-500"
            }`}
          />
          {isOnline ? "Online" : "Offline"}
        </span>
        <p className="mt-3 text-xs text-neutral-500 dark:text-neutral-400">
          Toggle offline mode in browser DevTools Network tab to test live updates.
        </p>
      </div>
    </div>
  );
}

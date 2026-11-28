"use client";

import React from "react";
import { useIdle } from "../hooks/use-idle";

export function UseIdleDemo() {
  const isIdle = useIdle(3000);

  return (
    <div className="w-full max-w-md space-y-3 text-center">
      <div className="rounded-2xl border border-neutral-200 bg-neutral-50/70 p-6 dark:border-neutral-800 dark:bg-neutral-900/50">
        <span
          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 font-mono text-xs font-semibold ${
            isIdle
              ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
              : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          }`}
        >
          <span
            className={`h-2 w-2 rounded-full ${
              isIdle ? "bg-amber-500" : "bg-emerald-500"
            }`}
          />
          {isIdle ? "User Idle (3s)" : "User Active"}
        </span>
        <p className="mt-3 text-xs text-neutral-500 dark:text-neutral-400">
          Stop moving your mouse or typing for 3 seconds to trigger idle state.
        </p>
      </div>
    </div>
  );
}

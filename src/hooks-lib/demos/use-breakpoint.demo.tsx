"use client";

import React from "react";
import { useBreakpoint } from "../hooks/use-breakpoint";

export function UseBreakpointDemo() {
  const breakpoint = useBreakpoint("base");

  return (
    <div className="w-full max-w-md space-y-3 text-center">
      <div className="rounded-2xl border border-neutral-200 bg-neutral-50/70 p-6 dark:border-neutral-800 dark:bg-neutral-900/50">
        <div className="font-mono text-[10px] uppercase tracking-wider text-neutral-400">
          Active Tailwind Breakpoint
        </div>
        <div className="mt-2 inline-flex rounded-xl bg-neutral-900 px-4 py-1.5 font-mono text-lg font-bold text-white dark:bg-white dark:text-black">
          {breakpoint}
        </div>
        <p className="mt-3 text-xs text-neutral-500 dark:text-neutral-400">
          Resize your browser window to watch the breakpoint update live.
        </p>
      </div>
    </div>
  );
}

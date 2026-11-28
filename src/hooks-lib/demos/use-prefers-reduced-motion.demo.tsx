"use client";

import React from "react";
import { usePrefersReducedMotion } from "../hooks/use-prefers-reduced-motion";

export function UsePrefersReducedMotionDemo() {
  const reduced = usePrefersReducedMotion(false);

  return (
    <div className="w-full max-w-md text-center">
      <div className="rounded-2xl border border-neutral-200 bg-neutral-50/70 p-5 font-mono text-xs dark:border-neutral-800 dark:bg-neutral-900/50">
        <div className="text-neutral-400">prefers-reduced-motion</div>
        <div className="mt-1 text-lg font-bold text-neutral-950 dark:text-white">
          {reduced ? "reduce (true)" : "no-preference (false)"}
        </div>
      </div>
    </div>
  );
}

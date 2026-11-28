"use client";

import React from "react";
import { useScrollDirection } from "../hooks/use-scroll-direction";

export function UseScrollDirectionDemo() {
  const direction = useScrollDirection(6);

  return (
    <div className="w-full max-w-md space-y-3 text-center">
      <div className="rounded-2xl border border-neutral-200 bg-neutral-50/70 p-6 dark:border-neutral-800 dark:bg-neutral-900/50">
        <div className="font-mono text-[10px] uppercase tracking-wider text-neutral-400">
          Page Scroll Direction
        </div>
        <div className="mt-2 font-mono text-2xl font-bold text-neutral-950 dark:text-white">
          {direction ? direction.toUpperCase() : "IDLE"}
        </div>
        <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
          Scroll this page up or down to observe the detected direction.
        </p>
      </div>
    </div>
  );
}

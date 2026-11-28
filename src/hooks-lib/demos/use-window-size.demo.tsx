"use client";

import React from "react";
import { useWindowSize } from "../hooks/use-window-size";

export function UseWindowSizeDemo() {
  const { width, height } = useWindowSize();

  return (
    <div className="w-full max-w-md space-y-3 text-center">
      <div className="grid grid-cols-2 gap-3 rounded-2xl border border-neutral-200 bg-neutral-50/70 p-5 dark:border-neutral-800 dark:bg-neutral-900/50">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-wider text-neutral-400">
            Width
          </div>
          <div className="mt-1 font-mono text-2xl font-bold text-neutral-950 dark:text-white">
            {width}px
          </div>
        </div>
        <div>
          <div className="font-mono text-[10px] uppercase tracking-wider text-neutral-400">
            Height
          </div>
          <div className="mt-1 font-mono text-2xl font-bold text-neutral-950 dark:text-white">
            {height}px
          </div>
        </div>
      </div>
    </div>
  );
}

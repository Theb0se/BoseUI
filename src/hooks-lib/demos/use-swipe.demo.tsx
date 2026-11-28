"use client";

import React, { useState } from "react";
import { useSwipe, type SwipeDirection } from "../hooks/use-swipe";

export function UseSwipeDemo() {
  const [lastDirection, setLastDirection] = useState<SwipeDirection | null>(
    null
  );

  const swipeHandlers = useSwipe({
    threshold: 35,
    onSwipe: (dir) => setLastDirection(dir),
  });

  return (
    <div className="w-full max-w-md space-y-3 text-center">
      <div
        {...swipeHandlers}
        className="flex h-36 select-none touch-none items-center justify-center rounded-2xl border border-dashed border-neutral-300 bg-neutral-50/70 p-4 text-xs text-neutral-500 dark:border-neutral-700 dark:bg-neutral-900/50 dark:text-neutral-400"
      >
        Click &amp; drag (or swipe) in any direction inside this area
      </div>

      <div className="font-mono text-xs text-neutral-600 dark:text-neutral-400">
        Last swipe:{" "}
        <span className="font-bold uppercase text-neutral-950 dark:text-white">
          {lastDirection ?? "None yet"}
        </span>
      </div>
    </div>
  );
}

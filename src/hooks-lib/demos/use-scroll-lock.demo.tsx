"use client";

import React from "react";
import { useScrollLock } from "../hooks/use-scroll-lock";

export function UseScrollLockDemo() {
  const { isLocked, lock, unlock } = useScrollLock(false);

  return (
    <div className="w-full max-w-md space-y-4 text-center">
      <div className="rounded-2xl border border-neutral-200 bg-neutral-50/70 p-5 dark:border-neutral-800 dark:bg-neutral-900/50">
        <div className="font-mono text-xs font-semibold text-neutral-950 dark:text-white">
          Body Scroll: {isLocked ? "Locked" : "Unlocked"}
        </div>
        <p className="mt-1.5 text-xs text-neutral-500 dark:text-neutral-400">
          Compensates for scrollbar width automatically to prevent layout shift.
        </p>
      </div>

      <div className="flex justify-center gap-2">
        <button
          type="button"
          onClick={isLocked ? unlock : lock}
          className="rounded-xl bg-neutral-900 px-4 py-2 text-xs font-semibold text-white dark:bg-white dark:text-black"
        >
          {isLocked ? "Unlock Scroll" : "Lock Body Scroll"}
        </button>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { useLongPress } from "../hooks/use-long-press";

export function UseLongPressDemo() {
  const [count, setCount] = useState(0);
  const [pressing, setPressing] = useState(false);

  const handlers = useLongPress(
    () => {
      setCount((c) => c + 1);
      setPressing(false);
    },
    {
      thresholdMs: 600,
      onStart: () => setPressing(true),
      onCancel: () => setPressing(false),
    }
  );

  return (
    <div className="w-full max-w-md space-y-4 text-center">
      <button
        type="button"
        {...handlers}
        className={`select-none rounded-2xl border px-6 py-4 text-xs font-semibold transition-all ${
          pressing
            ? "scale-95 border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-black"
            : "border-neutral-200 bg-white text-neutral-900 hover:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-950 dark:text-white"
        }`}
      >
        {pressing ? "Keep holding (600ms)..." : "Press & Hold for 600ms"}
      </button>

      <div className="font-mono text-xs text-neutral-500">
        Long-press completions: {count}
      </div>
    </div>
  );
}

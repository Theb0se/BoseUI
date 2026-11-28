"use client";

import React, { useState } from "react";
import { useTimeout } from "../hooks/use-timeout";

export function UseTimeoutDemo() {
  const [status, setStatus] = useState("Waiting 2000ms...");
  const { reset, clear } = useTimeout(() => {
    setStatus("Timeout fired!");
  }, 2000);

  return (
    <div className="w-full max-w-md space-y-4 text-center">
      <div className="rounded-2xl border border-neutral-200 bg-neutral-50/70 p-5 font-mono text-sm font-semibold text-neutral-950 dark:border-neutral-800 dark:bg-neutral-900/50 dark:text-white">
        {status}
      </div>

      <div className="flex justify-center gap-2">
        <button
          type="button"
          onClick={() => {
            setStatus("Waiting 2000ms...");
            reset();
          }}
          className="rounded-xl bg-neutral-900 px-4 py-2 text-xs font-semibold text-white dark:bg-white dark:text-black"
        >
          Reset Timeout
        </button>
        <button
          type="button"
          onClick={() => {
            clear();
            setStatus("Timeout cleared");
          }}
          className="rounded-xl border border-neutral-200 bg-white px-4 py-2 font-mono text-xs text-neutral-700 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300"
        >
          Clear
        </button>
      </div>
    </div>
  );
}

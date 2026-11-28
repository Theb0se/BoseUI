"use client";

import React, { useState } from "react";
import { useEventListener } from "../hooks/use-event-listener";

export function UseEventListenerDemo() {
  const [lastKey, setLastKey] = useState<string>("Press any key");
  const [keyCount, setKeyCount] = useState(0);

  useEventListener("keydown", (event) => {
    setLastKey(event.key === " " ? "Space" : event.key);
    setKeyCount((c) => c + 1);
  });

  return (
    <div className="w-full max-w-md space-y-3 text-center">
      <div className="rounded-2xl border border-neutral-200 bg-neutral-50/70 p-6 dark:border-neutral-800 dark:bg-neutral-900/50">
        <div className="font-mono text-[10px] uppercase tracking-wider text-neutral-400">
          Window Keydown Listener
        </div>
        <div className="mt-2 inline-flex min-w-20 items-center justify-center rounded-xl border border-neutral-200 bg-white px-4 py-2 font-mono text-base font-bold text-neutral-950 shadow-2xs dark:border-neutral-700 dark:bg-neutral-950 dark:text-white">
          {lastKey}
        </div>
        <div className="mt-3 font-mono text-[11px] text-neutral-500">
          Total key presses captured: {keyCount}
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { useHotkeys } from "../hooks/use-hotkeys";

export function UseHotkeysDemo() {
  const [triggers, setTriggers] = useState(0);

  useHotkeys("mod+j", () => {
    setTriggers((c) => c + 1);
  });

  return (
    <div className="w-full max-w-md space-y-3 text-center">
      <div className="rounded-2xl border border-neutral-200 bg-neutral-50/70 p-6 dark:border-neutral-800 dark:bg-neutral-900/50">
        <div className="font-mono text-xs text-neutral-500">
          Press{" "}
          <kbd className="rounded border border-neutral-300 bg-white px-2 py-0.5 font-mono text-xs text-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white">
            Cmd/Ctrl + J
          </kbd>
        </div>
        <div className="mt-3 font-mono text-2xl font-bold text-neutral-950 dark:text-white">
          Triggered: {triggers}
        </div>
      </div>
    </div>
  );
}

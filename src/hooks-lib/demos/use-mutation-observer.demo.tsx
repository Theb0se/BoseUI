"use client";

import React, { useRef, useState } from "react";
import { useMutationObserver } from "../hooks/use-mutation-observer";

export function UseMutationObserverDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mutations, setMutations] = useState(0);
  const [items, setItems] = useState(["Node 1"]);

  useMutationObserver(containerRef, (records) => {
    setMutations((c) => c + records.length);
  });

  return (
    <div className="w-full max-w-md space-y-4">
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-neutral-500">
          DOM mutations observed: {mutations}
        </span>
        <button
          type="button"
          onClick={() => setItems((prev) => [...prev, `Node ${prev.length + 1}`])}
          className="rounded-xl bg-neutral-900 px-3.5 py-1.5 text-xs font-semibold text-white dark:bg-white dark:text-black"
        >
          Append Child Node
        </button>
      </div>

      <div
        ref={containerRef}
        className="flex flex-wrap gap-2 rounded-2xl border border-neutral-200 bg-neutral-50/70 p-4 dark:border-neutral-800 dark:bg-neutral-900/50"
      >
        {items.map((item) => (
          <span
            key={item}
            className="rounded-lg border border-neutral-200 bg-white px-2.5 py-1 font-mono text-xs dark:border-neutral-800 dark:bg-neutral-950 dark:text-white"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

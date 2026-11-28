"use client";

import React, { useRef, useState } from "react";
import { useIntersectionObserver } from "../hooks/use-intersection-observer";

export function UseIntersectionObserverDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);
  const [freeze, setFreeze] = useState(false);

  const { isIntersecting, entry } = useIntersectionObserver(targetRef, {
    root: containerRef.current,
    threshold: 0.5,
    freezeOnceVisible: freeze,
  });

  return (
    <div className="w-full max-w-md space-y-3">
      <div className="flex items-center justify-between">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-mono text-[11px] font-semibold ${
            isIntersecting
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              : "bg-neutral-100 text-neutral-500 dark:bg-neutral-900 dark:text-neutral-400"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              isIntersecting ? "bg-emerald-500" : "bg-neutral-400"
            }`}
          />
          {isIntersecting ? "Visible (≥ 50%)" : "Out of View"}
        </span>

        <label className="flex cursor-pointer items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-400">
          <input
            type="checkbox"
            checked={freeze}
            onChange={(e) => setFreeze(e.target.checked)}
            className="rounded border-neutral-300"
          />
          <span>Freeze once visible</span>
        </label>
      </div>

      <div
        ref={containerRef}
        className="h-44 overflow-y-auto rounded-2xl border border-neutral-200 bg-neutral-50/70 p-4 dark:border-neutral-800 dark:bg-neutral-900/50"
      >
        <div className="flex h-36 items-center justify-center text-xs text-neutral-400">
          ↓ Scroll down inside this container ↓
        </div>
        <div
          ref={targetRef}
          className={`flex h-24 items-center justify-center rounded-xl border text-xs font-semibold transition-all ${
            isIntersecting
              ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
              : "border-neutral-200 bg-white text-neutral-500 dark:border-neutral-800 dark:bg-neutral-950"
          }`}
        >
          Observed Target (ratio: {entry ? entry.intersectionRatio.toFixed(2) : "0.00"})
        </div>
        <div className="h-24" />
      </div>
    </div>
  );
}

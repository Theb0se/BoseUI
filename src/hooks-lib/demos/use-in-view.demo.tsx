"use client";

import React, { useRef } from "react";
import { useInView } from "../hooks/use-in-view";

export function UseInViewDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(targetRef, {
    root: containerRef.current,
    threshold: 0.4,
  });

  return (
    <div className="w-full max-w-md space-y-3">
      <div className="font-mono text-xs text-neutral-600 dark:text-neutral-400">
        Target in view:{" "}
        <span className="font-bold text-neutral-950 dark:text-white">
          {String(isInView)}
        </span>
      </div>
      <div
        ref={containerRef}
        className="h-40 overflow-y-auto rounded-2xl border border-neutral-200 bg-neutral-50/70 p-4 dark:border-neutral-800 dark:bg-neutral-900/50"
      >
        <div className="flex h-36 items-center justify-center text-xs text-neutral-400">
          ↓ Scroll down ↓
        </div>
        <div
          ref={targetRef}
          className={`flex h-20 items-center justify-center rounded-xl border font-mono text-xs font-semibold transition-colors ${
            isInView
              ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
              : "border-neutral-200 bg-white text-neutral-500 dark:border-neutral-800 dark:bg-neutral-950"
          }`}
        >
          {isInView ? "In View!" : "Waiting..."}
        </div>
        <div className="h-20" />
      </div>
    </div>
  );
}

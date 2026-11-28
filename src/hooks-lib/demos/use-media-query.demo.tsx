"use client";

import React from "react";
import { useMediaQuery } from "../hooks/use-media-query";

export function UseMediaQueryDemo() {
  const isSm = useMediaQuery("(min-width: 640px)");
  const isMd = useMediaQuery("(min-width: 768px)");
  const isLg = useMediaQuery("(min-width: 1024px)");
  const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  const queries = [
    { label: "sm (≥ 640px)", match: isSm },
    { label: "md (≥ 768px)", match: isMd },
    { label: "lg (≥ 1024px)", match: isLg },
    { label: "prefers-reduced-motion", match: prefersReducedMotion },
  ];

  return (
    <div className="w-full max-w-md space-y-2.5">
      {queries.map((q) => (
        <div
          key={q.label}
          className="flex items-center justify-between rounded-xl border border-neutral-200 bg-white px-4 py-3 dark:border-neutral-800 dark:bg-neutral-950"
        >
          <span className="font-mono text-xs text-neutral-700 dark:text-neutral-300">
            {q.label}
          </span>
          <span
            className={`rounded-md px-2 py-0.5 font-mono text-[11px] font-semibold ${
              q.match
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "bg-neutral-100 text-neutral-500 dark:bg-neutral-900 dark:text-neutral-500"
            }`}
          >
            {q.match ? "true" : "false"}
          </span>
        </div>
      ))}
    </div>
  );
}

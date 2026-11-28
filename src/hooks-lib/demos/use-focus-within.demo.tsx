"use client";

import React, { useRef } from "react";
import { useFocusWithin } from "../hooks/use-focus-within";

export function UseFocusWithinDemo() {
  const formRef = useRef<HTMLDivElement>(null);
  const isFocusWithin = useFocusWithin(formRef);

  return (
    <div
      ref={formRef}
      className={`w-full max-w-md space-y-3 rounded-2xl border p-5 transition-colors ${
        isFocusWithin
          ? "border-neutral-900 bg-white ring-2 ring-neutral-900/10 dark:border-white dark:bg-neutral-950 dark:ring-white/10"
          : "border-neutral-200 bg-neutral-50/70 dark:border-neutral-800 dark:bg-neutral-900/50"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-neutral-950 dark:text-white">
          Container Focus State
        </span>
        <span className="font-mono text-[11px] text-neutral-500">
          {isFocusWithin ? "focused" : "blurred"}
        </span>
      </div>
      <input
        type="text"
        placeholder="Focus inside this input..."
        className="h-9 w-full rounded-xl border border-neutral-200 bg-white px-3 text-xs dark:border-neutral-800 dark:bg-neutral-900 dark:text-white"
      />
    </div>
  );
}

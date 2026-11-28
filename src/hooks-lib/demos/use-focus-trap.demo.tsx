"use client";

import React, { useRef, useState } from "react";
import { useFocusTrap } from "../hooks/use-focus-trap";

export function UseFocusTrapDemo() {
  const [active, setActive] = useState(false);
  const trapRef = useRef<HTMLDivElement>(null);

  useFocusTrap(trapRef, active);

  return (
    <div className="w-full max-w-md space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs text-neutral-500">
          {active ? "Tab key is trapped inside the box" : "Focus trap inactive"}
        </span>
        <button
          type="button"
          onClick={() => setActive((a) => !a)}
          className="rounded-xl bg-neutral-900 px-3.5 py-2 text-xs font-semibold text-white dark:bg-white dark:text-black"
        >
          {active ? "Disable Trap" : "Enable Trap"}
        </button>
      </div>

      <div
        ref={trapRef}
        className={`space-y-3 rounded-2xl border p-4 transition-colors ${
          active
            ? "border-neutral-900 bg-white dark:border-white dark:bg-neutral-950"
            : "border-neutral-200 bg-neutral-50/70 dark:border-neutral-800 dark:bg-neutral-900/50"
        }`}
      >
        <input
          type="text"
          placeholder="First focusable input"
          className="h-9 w-full rounded-xl border border-neutral-200 bg-white px-3 text-xs dark:border-neutral-800 dark:bg-neutral-900 dark:text-white"
        />
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setActive(false)}
            className="rounded-lg border border-neutral-200 px-3 py-1.5 text-xs dark:border-neutral-800"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => setActive(false)}
            className="rounded-lg bg-neutral-900 px-3 py-1.5 text-xs font-semibold text-white dark:bg-white dark:text-black"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

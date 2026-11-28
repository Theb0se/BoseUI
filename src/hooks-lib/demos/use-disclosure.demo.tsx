"use client";

import React from "react";
import { useDisclosure } from "../hooks/use-disclosure";

export function UseDisclosureDemo() {
  const { isOpen, open, close, toggle } = useDisclosure({
    defaultOpen: false,
  });

  return (
    <div className="w-full max-w-md space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={open}
          className="rounded-xl bg-neutral-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
        >
          Open
        </button>
        <button
          type="button"
          onClick={close}
          className="rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-xs font-medium text-neutral-700 hover:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300"
        >
          Close
        </button>
        <button
          type="button"
          onClick={toggle}
          className="rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-xs font-medium text-neutral-700 hover:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300"
        >
          Toggle
        </button>
      </div>

      {isOpen ? (
        <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-xs dark:border-neutral-800 dark:bg-neutral-950">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-950 dark:text-white">
              Disclosure Panel Open
            </span>
            <button
              type="button"
              onClick={close}
              className="font-mono text-[11px] text-neutral-400 hover:text-neutral-950 dark:hover:text-white"
            >
              Dismiss
            </button>
          </div>
          <p className="mt-1.5 text-xs text-neutral-500 dark:text-neutral-400">
            Controlled or uncontrolled open/close state with lifecycle callbacks.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-neutral-200 p-4 text-center font-mono text-xs text-neutral-400 dark:border-neutral-800">
          Disclosure is currently closed (isOpen: false)
        </div>
      )}
    </div>
  );
}

"use client";

import React from "react";
import { useCookie } from "../hooks/use-cookie";

export function UseCookieDemo() {
  const [themePref, setThemePref, deleteThemePref] = useCookie(
    "boseui-cookie-demo",
    "system"
  );

  return (
    <div className="w-full max-w-md space-y-4">
      <div className="flex flex-wrap gap-2">
        {["system", "light", "dark"].map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => setThemePref(opt, { days: 7 })}
            className={`rounded-xl border px-3.5 py-1.5 font-mono text-xs font-medium transition-colors ${
              themePref === opt
                ? "border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-black"
                : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-400"
            }`}
          >
            {opt}
          </button>
        ))}
        <button
          type="button"
          onClick={deleteThemePref}
          className="rounded-xl border border-neutral-200 bg-white px-3 py-1.5 font-mono text-xs text-neutral-500 hover:text-neutral-950 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:text-white"
        >
          Delete Cookie
        </button>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-neutral-50/70 px-4 py-3 font-mono text-xs text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900/50 dark:text-neutral-400">
        Cookie value:{" "}
        <span className="font-semibold text-neutral-950 dark:text-white">
          &quot;{themePref}&quot;
        </span>
      </div>
    </div>
  );
}

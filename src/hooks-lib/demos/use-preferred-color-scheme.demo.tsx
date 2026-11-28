"use client";

import React from "react";
import { usePreferredColorScheme } from "../hooks/use-preferred-color-scheme";

export function UsePreferredColorSchemeDemo() {
  const scheme = usePreferredColorScheme("light");

  return (
    <div className="w-full max-w-md text-center">
      <div className="rounded-2xl border border-neutral-200 bg-neutral-50/70 p-5 font-mono text-xs dark:border-neutral-800 dark:bg-neutral-900/50">
        <div className="text-neutral-400">OS Color Scheme</div>
        <div className="mt-1 text-lg font-bold uppercase text-neutral-950 dark:text-white">
          {scheme}
        </div>
      </div>
    </div>
  );
}

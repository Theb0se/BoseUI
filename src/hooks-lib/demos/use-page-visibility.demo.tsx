"use client";

import React, { useEffect, useState } from "react";
import { usePageVisibility } from "../hooks/use-page-visibility";

export function UsePageVisibilityDemo() {
  const isVisible = usePageVisibility();
  const [switches, setSwitches] = useState(0);

  useEffect(() => {
    if (!isVisible) {
      setSwitches((c) => c + 1);
    }
  }, [isVisible]);

  return (
    <div className="w-full max-w-md space-y-3 text-center">
      <div className="rounded-2xl border border-neutral-200 bg-neutral-50/70 p-6 dark:border-neutral-800 dark:bg-neutral-900/50">
        <div className="font-mono text-sm font-semibold text-neutral-950 dark:text-white">
          Tab State: {isVisible ? "Visible" : "Hidden"}
        </div>
        <div className="mt-2 font-mono text-xs text-neutral-500">
          Tab blur/hidden count: {switches}
        </div>
      </div>
    </div>
  );
}

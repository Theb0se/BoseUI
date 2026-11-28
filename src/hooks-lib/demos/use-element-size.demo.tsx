"use client";

import React, { useRef, useState } from "react";
import { useElementSize } from "../hooks/use-element-size";

export function UseElementSizeDemo() {
  const boxRef = useRef<HTMLDivElement>(null);
  const { width, height } = useElementSize(boxRef);
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="w-full max-w-md space-y-4 text-center">
      <div
        ref={boxRef}
        className={`mx-auto flex items-center justify-center rounded-2xl border border-neutral-200 bg-neutral-50/70 font-mono text-xs font-semibold text-neutral-950 transition-all dark:border-neutral-800 dark:bg-neutral-900/50 dark:text-white ${
          expanded ? "h-32 w-full" : "h-20 w-56"
        }`}
      >
        {width}px × {height}px
      </div>
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        className="rounded-xl bg-neutral-900 px-4 py-2 text-xs font-semibold text-white dark:bg-white dark:text-black"
      >
        {expanded ? "Shrink Box" : "Expand Box"}
      </button>
    </div>
  );
}

"use client";

import React, { useRef } from "react";
import { useFullscreen } from "../hooks/use-fullscreen";

export function UseFullscreenDemo() {
  const boxRef = useRef<HTMLDivElement>(null);
  const { isFullscreen, toggle } = useFullscreen(boxRef);

  return (
    <div
      ref={boxRef}
      className="flex w-full max-w-md flex-col items-center justify-center gap-4 rounded-2xl border border-neutral-200 bg-neutral-50/70 p-8 text-center dark:border-neutral-800 dark:bg-neutral-900/50"
    >
      <div className="font-mono text-xs text-neutral-500">
        Status: {isFullscreen ? "Fullscreen Active" : "Normal View"}
      </div>
      <button
        type="button"
        onClick={toggle}
        className="rounded-xl bg-neutral-900 px-4 py-2 text-xs font-semibold text-white dark:bg-white dark:text-black"
      >
        {isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
      </button>
    </div>
  );
}

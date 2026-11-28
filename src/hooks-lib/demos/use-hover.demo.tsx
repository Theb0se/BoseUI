"use client";

import React, { useRef } from "react";
import { useHover } from "../hooks/use-hover";

export function UseHoverDemo() {
  const cardRef = useRef<HTMLDivElement>(null);
  const isHovered = useHover(cardRef);

  return (
    <div
      ref={cardRef}
      className={`flex h-32 w-full max-w-md cursor-pointer flex-col items-center justify-center rounded-2xl border transition-all ${
        isHovered
          ? "border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-black"
          : "border-neutral-200 bg-neutral-50/70 text-neutral-700 dark:border-neutral-800 dark:bg-neutral-900/50 dark:text-neutral-300"
      }`}
    >
      <div className="font-mono text-sm font-semibold">
        {isHovered ? "Hovered (true)" : "Hover over me (false)"}
      </div>
    </div>
  );
}

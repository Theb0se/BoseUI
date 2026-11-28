"use client";

import React from "react";
import { useKeyPress } from "../hooks/use-key-press";

export function UseKeyPressDemo() {
  const shiftPressed = useKeyPress("Shift");
  const enterPressed = useKeyPress("Enter");
  const spacePressed = useKeyPress(" ");

  const keys = [
    { label: "Shift", active: shiftPressed },
    { label: "Enter", active: enterPressed },
    { label: "Space", active: spacePressed },
  ];

  return (
    <div className="w-full max-w-md space-y-4 text-center">
      <p className="text-xs text-neutral-500 dark:text-neutral-400">
        Press and hold <kbd className="font-mono">Shift</kbd>,{" "}
        <kbd className="font-mono">Enter</kbd>, or{" "}
        <kbd className="font-mono">Space</kbd>
      </p>

      <div className="flex justify-center gap-3">
        {keys.map((k) => (
          <div
            key={k.label}
            className={`min-w-20 rounded-xl border px-4 py-3 font-mono text-xs font-semibold transition-all ${
              k.active
                ? "border-neutral-900 bg-neutral-900 text-white scale-95 dark:border-white dark:bg-white dark:text-black"
                : "border-neutral-200 bg-white text-neutral-600 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-400"
            }`}
          >
            {k.label}
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";

/**
 * Detects whether a specific keyboard key (`event.key`) is currently pressed down.
 * Automatically resets on `blur` so keys never get stuck when switching windows.
 *
 * @param targetKey - The `KeyboardEvent.key` value to watch (e.g. `"Escape"`, `"Enter"`, `" "`).
 * @returns `true` while the key is held down.
 */
export function useKeyPress(targetKey: string): boolean {
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const normalized = targetKey.toLowerCase();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === normalized) {
        setPressed(true);
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === normalized) {
        setPressed(false);
      }
    };

    const handleBlur = () => setPressed(false);

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", handleBlur);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", handleBlur);
    };
  }, [targetKey]);

  return pressed;
}

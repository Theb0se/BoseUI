"use client";

import { useEffect, useRef } from "react";

export interface UseHotkeysOptions {
  /** Call `event.preventDefault()` when matched (default: `true`). */
  preventDefault?: boolean;
  /** Ignore hotkeys while typing inside inputs/textareas (default: `true`). */
  ignoreInputs?: boolean;
  /** Enable/disable hotkey listening (default: `true`). */
  enabled?: boolean;
}

function matchesCombo(event: KeyboardEvent, combo: string): boolean {
  const parts = combo
    .toLowerCase()
    .split("+")
    .map((p) => p.trim());

  const wantsMod = parts.includes("mod") || parts.includes("cmd") || parts.includes("meta");
  const wantsCtrl = parts.includes("ctrl") || parts.includes("control");
  const wantsShift = parts.includes("shift");
  const wantsAlt = parts.includes("alt") || parts.includes("option");

  const keyPart = parts.find(
    (p) => !["mod", "cmd", "meta", "ctrl", "control", "shift", "alt", "option"].includes(p)
  );

  const modPressed = event.metaKey || event.ctrlKey;
  if (wantsMod && !modPressed) return false;
  if (!wantsMod && wantsCtrl && !event.ctrlKey) return false;
  if (!wantsMod && !wantsCtrl && (event.metaKey || event.ctrlKey)) return false;
  if (wantsShift !== event.shiftKey) return false;
  if (wantsAlt !== event.altKey) return false;

  if (!keyPart) return false;
  return event.key.toLowerCase() === keyPart;
}

/**
 * Registers global keyboard shortcut combinations such as `"mod+k"`, `"ctrl+shift+p"`, or `"escape"`.
 * `"mod"` matches `Cmd` on macOS and `Ctrl` on Windows/Linux.
 *
 * @param combo - Key combination string (e.g. `"mod+k"`).
 * @param handler - Callback executed when the shortcut fires.
 * @param options - Configuration for `preventDefault`, `ignoreInputs`, and `enabled`.
 */
export function useHotkeys(
  combo: string,
  handler: (event: KeyboardEvent) => void,
  options: UseHotkeysOptions = {}
): void {
  const { preventDefault = true, ignoreInputs = true, enabled = true } = options;
  const handlerRef = useRef(handler);

  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;

    const listener = (event: KeyboardEvent) => {
      if (ignoreInputs) {
        const target = event.target as HTMLElement | null;
        const tag = target?.tagName;
        if (
          tag === "INPUT" ||
          tag === "TEXTAREA" ||
          tag === "SELECT" ||
          target?.isContentEditable
        ) {
          return;
        }
      }

      if (matchesCombo(event, combo)) {
        if (preventDefault) event.preventDefault();
        handlerRef.current(event);
      }
    };

    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, [combo, preventDefault, ignoreInputs, enabled]);
}

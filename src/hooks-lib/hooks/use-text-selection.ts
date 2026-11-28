"use client";

import { useEffect, useState } from "react";

/**
 * Tracks the user's currently selected text on the page via `document.getSelection()`.
 * Updates live on `selectionchange`.
 *
 * @returns The trimmed selected text string, or `""` when nothing is selected.
 */
export function useTextSelection(): string {
  const [selection, setSelection] = useState<string>("");

  useEffect(() => {
    if (typeof document === "undefined") return;

    const handleSelectionChange = () => {
      const selectedText = document.getSelection()?.toString() ?? "";
      setSelection(selectedText);
    };

    document.addEventListener("selectionchange", handleSelectionChange);
    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
    };
  }, []);

  return selection;
}

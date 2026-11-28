"use client";

import { useCallback, useState } from "react";

export interface UseClipboardReturn {
  text: string | null;
  error: string | null;
  read: () => Promise<string | null>;
  write: (value: string) => Promise<boolean>;
}

/**
 * Reads from and writes to the system clipboard via the async Clipboard API
 * (`navigator.clipboard.readText` and `writeText`), handling permission errors gracefully.
 *
 * @returns `{ text, error, read, write }`.
 */
export function useClipboard(): UseClipboardReturn {
  const [text, setText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const read = useCallback(async (): Promise<string | null> => {
    if (typeof navigator === "undefined" || !navigator.clipboard?.readText) {
      const msg = "Clipboard read is not supported or requires HTTPS.";
      setError(msg);
      return null;
    }

    try {
      const value = await navigator.clipboard.readText();
      setText(value);
      setError(null);
      return value;
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Clipboard read permission denied.";
      setError(msg);
      return null;
    }
  }, []);

  const write = useCallback(async (value: string): Promise<boolean> => {
    if (typeof navigator === "undefined" || !navigator.clipboard?.writeText) {
      const msg = "Clipboard write is not supported or requires HTTPS.";
      setError(msg);
      return false;
    }

    try {
      await navigator.clipboard.writeText(value);
      setText(value);
      setError(null);
      return true;
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Clipboard write permission denied.";
      setError(msg);
      return false;
    }
  }, []);

  return { text, error, read, write };
}

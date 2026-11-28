"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface UseCopyToClipboardReturn {
  /** The most recently copied string, or `null` if nothing has been copied. */
  copiedText: string | null;
  /** `true` during the transient feedback window after a successful copy. */
  isCopied: boolean;
  /** Copies text to the clipboard using Clipboard API with textarea fallback. */
  copy: (text: string) => Promise<boolean>;
  /** Resets `isCopied` and `copiedText` immediately. */
  reset: () => void;
}

/**
 * Copies text to the system clipboard with automatic feedback state reset.
 * Uses `navigator.clipboard.writeText` when available and falls back to
 * `document.execCommand("copy")` for non-secure contexts.
 *
 * @param resetDelay - Milliseconds before `isCopied` resets to `false` (default: 2000ms).
 * @returns `{ copiedText, isCopied, copy, reset }`.
 */
export function useCopyToClipboard(
  resetDelay = 2000
): UseCopyToClipboardReturn {
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const reset = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIsCopied(false);
    setCopiedText(null);
  }, []);

  const copy = useCallback(
    async (text: string): Promise<boolean> => {
      if (typeof window === "undefined") return false;

      let success = false;
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(text);
          success = true;
        } else if (typeof document !== "undefined") {
          const textarea = document.createElement("textarea");
          textarea.value = text;
          textarea.setAttribute("readonly", "");
          textarea.style.position = "fixed";
          textarea.style.left = "-9999px";
          textarea.style.top = "-9999px";
          document.body.appendChild(textarea);
          textarea.select();
          success = document.execCommand("copy");
          document.body.removeChild(textarea);
        }
      } catch {
        success = false;
      }

      if (success) {
        setCopiedText(text);
        setIsCopied(true);

        if (timerRef.current !== null) {
          clearTimeout(timerRef.current);
        }
        if (resetDelay > 0) {
          timerRef.current = setTimeout(() => {
            setIsCopied(false);
            timerRef.current = null;
          }, resetDelay);
        }
      }

      return success;
    },
    [resetDelay]
  );

  return { copiedText, isCopied, copy, reset };
}

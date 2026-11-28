"use client";

import React, { useState } from "react";
import { Check, Copy } from "lucide-react";
import { useCopyToClipboard } from "../hooks/use-copy-to-clipboard";

export function UseCopyToClipboardDemo() {
  const [text, setText] = useState("npx shadcn@latest add https://boseui.site/r/loader.json");
  const { isCopied, copiedText, copy } = useCopyToClipboard(2000);

  return (
    <div className="w-full max-w-md space-y-3">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          aria-label="Text to copy"
          className="h-10 flex-1 rounded-xl border border-neutral-200 bg-white px-3.5 font-mono text-xs text-neutral-900 focus:border-neutral-900 focus:outline-none dark:border-neutral-800 dark:bg-neutral-950 dark:text-white dark:focus:border-white"
        />
        <button
          type="button"
          onClick={() => copy(text)}
          className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-neutral-900 px-3.5 text-xs font-semibold text-white transition-colors hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
        >
          {isCopied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400 dark:text-emerald-600" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-neutral-50/70 px-3.5 py-2.5 font-mono text-[11px] text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900/50">
        Last copied: {copiedText ?? "None yet"}
      </div>
    </div>
  );
}

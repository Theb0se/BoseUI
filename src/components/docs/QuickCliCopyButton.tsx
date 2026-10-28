"use client";

import React, { useState } from "react";
import { Check, Copy, Terminal } from "lucide-react";
import { track } from "@vercel/analytics";
import { copyToClipboard } from "@/lib/utils";

interface QuickCliCopyButtonProps {
  cliCommand: string;
  className?: string;
}

export function QuickCliCopyButton({
  cliCommand,
  className = "",
}: QuickCliCopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const ok = await copyToClipboard(cliCommand);
    if (ok) {
      setCopied(true);
      track("Copy CLI Command", {
        command: cliCommand,
        source: "QuickCliCopyButton",
      });
      setTimeout(() => setCopied(false), 1800);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={`Copy command: ${cliCommand}`}
      title={`Click to copy: ${cliCommand}`}
      className={`group relative inline-flex max-w-full items-center gap-2 rounded-xl border border-neutral-200/90 bg-neutral-50/80 px-3 py-1.5 font-mono text-xs text-neutral-700 shadow-2xs backdrop-blur-sm transition-all hover:border-neutral-400 hover:bg-neutral-100/90 hover:text-neutral-950 dark:border-neutral-800/90 dark:bg-neutral-900/50 dark:text-neutral-300 dark:hover:border-neutral-700 dark:hover:bg-neutral-900/90 dark:hover:text-white ${className}`}
    >
      <span className="flex items-center gap-1.5 text-neutral-500 transition-colors group-hover:text-neutral-900 dark:text-neutral-400 dark:group-hover:text-white">
        <Terminal className="h-3.5 w-3.5 shrink-0" />
        <span className="select-none font-semibold text-neutral-400 dark:text-neutral-600">
          $
        </span>
      </span>
      <span className="truncate font-mono text-[11.5px] tracking-tight">
        {cliCommand}
      </span>
      <span
        className={`ml-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all ${
          copied
            ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-400"
            : "border-neutral-200 bg-white text-neutral-500 group-hover:border-neutral-300 group-hover:text-neutral-950 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-400 dark:group-hover:border-neutral-700 dark:group-hover:text-white"
        }`}
      >
        {copied ? (
          <Check className="h-3 w-3" />
        ) : (
          <Copy className="h-3 w-3" />
        )}
      </span>
    </button>
  );
}

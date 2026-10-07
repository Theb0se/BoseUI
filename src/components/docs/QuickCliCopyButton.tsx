"use client";

import React, { useState } from "react";
import { Check, Copy, Terminal } from "lucide-react";
import { copyToClipboard } from "@/lib/utils";

export function QuickCliCopyButton({ cliCommand }: { cliCommand: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const ok = await copyToClipboard(cliCommand);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="group inline-flex max-w-full items-center gap-2.5 rounded-xl border border-[#262626] bg-[#0A0A0A] px-3.5 py-2 font-mono text-xs text-neutral-300 transition-colors hover:border-white hover:text-white"
    >
      <Terminal className="h-3.5 w-3.5 shrink-0 text-neutral-400" />
      <span className="truncate">{cliCommand}</span>
      <span className="ml-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-[#262626] bg-black text-neutral-400 group-hover:border-white group-hover:bg-white group-hover:text-black">
        {copied ? (
          <Check className="h-3 w-3" />
        ) : (
          <Copy className="h-3 w-3" />
        )}
      </span>
    </button>
  );
}

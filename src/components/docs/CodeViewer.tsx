"use client";

import React, { useState } from "react";
import { Check, Copy, FileCode2 } from "lucide-react";
import { cn, copyToClipboard } from "@/lib/utils";

export interface CodeViewerProps {
  code: string;
  filename?: string;
  language?: string;
  maxHeight?: string;
  className?: string;
}

export function CodeViewer({
  code,
  filename = "component.tsx",
  language = "tsx",
  maxHeight = "480px",
  className,
}: CodeViewerProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const ok = await copyToClipboard(code);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  const lines = code.trimEnd().split("\n");

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-neutral-200/90 bg-neutral-50/50 shadow-2xs dark:border-neutral-800 dark:bg-[#050505]",
        className
      )}
    >
      <div className="flex items-center justify-between border-b border-neutral-200/80 bg-white px-4 py-2.5 dark:border-neutral-800 dark:bg-[#0A0A0A]">
        <div className="flex items-center gap-2">
          <FileCode2 className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
          <span className="font-mono text-xs font-semibold text-neutral-950 dark:text-white">
            {filename}
          </span>
          <span className="rounded border border-neutral-200 bg-neutral-100 px-1.5 py-0.5 font-mono text-[10px] uppercase text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
            {language}
          </span>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy code"
          className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-neutral-50 px-2.5 py-1 font-mono text-xs font-medium text-neutral-700 transition-colors hover:border-neutral-900 hover:bg-neutral-900 hover:text-white dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-white dark:hover:bg-white dark:hover:text-black"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-500" />
              <span className="text-emerald-500">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      <div
        style={{ maxHeight }}
        className="overflow-auto p-4 font-mono text-xs leading-relaxed"
      >
        <table className="w-full border-collapse">
          <tbody>
            {lines.map((line, idx) => (
              <tr
                key={idx}
                className="hover:bg-neutral-200/40 dark:hover:bg-neutral-900/40"
              >
                <td className="w-10 select-none pr-4 text-right font-mono text-[11px] tabular-nums text-neutral-400 dark:text-neutral-600">
                  {idx + 1}
                </td>
                <td className="whitespace-pre text-neutral-800 dark:text-neutral-200">
                  {line || " "}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

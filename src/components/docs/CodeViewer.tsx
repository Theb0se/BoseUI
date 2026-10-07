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
        "overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50 dark:border-[#222222] dark:bg-[#050505]",
        className
      )}
    >
      <div className="flex items-center justify-between border-b border-neutral-200 bg-white px-4 py-2.5 dark:border-[#1F1F1F] dark:bg-[#0A0A0A]">
        <div className="flex items-center gap-2">
          <FileCode2 className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
          <span className="font-mono text-xs font-medium text-black dark:text-white">
            {filename}
          </span>
          <span className="rounded border border-neutral-200 bg-neutral-100 px-1.5 py-0.5 font-mono text-[10px] uppercase text-neutral-500 dark:border-[#262626] dark:bg-[#141414] dark:text-neutral-400">
            {language}
          </span>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-neutral-100 px-2.5 py-1 font-mono text-xs text-neutral-700 transition-colors hover:border-black hover:bg-black hover:text-white dark:border-[#262626] dark:bg-[#141414] dark:text-neutral-300 dark:hover:border-white dark:hover:bg-white dark:hover:text-black"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5" />
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

      <div
        style={{ maxHeight }}
        className="overflow-auto p-4 font-mono text-xs leading-relaxed"
      >
        <table className="w-full border-collapse">
          <tbody>
            {lines.map((line, idx) => (
              <tr
                key={idx}
                className="hover:bg-neutral-200/50 dark:hover:bg-[#111111]"
              >
                <td className="w-9 select-none pr-4 text-right font-mono text-[11px] text-neutral-400 dark:text-neutral-600">
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

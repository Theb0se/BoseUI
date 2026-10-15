"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GitCommit,
  Copy,
  Check,
  Columns,
  AlignJustify,
  FileCode,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface CodeDiffHunk {
  header: string;
  lines: {
    type: "unchanged" | "added" | "removed";
    oldNumber?: number;
    newNumber?: number;
    code: string;
  }[];
}

export interface InteractiveCodeDiffProps {
  /** File path displayed in the diff header */
  filename?: string;
  /** Git branch or commit compare range */
  compareRange?: string;
  /** Array of code diff hunks */
  hunks?: CodeDiffHunk[];
  /** Default layout mode: "unified" or "split" */
  defaultMode?: "unified" | "split";
  className?: string;
}

const SAMPLE_HUNKS: CodeDiffHunk[] = [
  {
    header: "@@ -18,6 +18,10 @@ export async function handleAuthentication(req: Request) {",
    lines: [
      { type: "unchanged", oldNumber: 18, newNumber: 18, code: "  const session = await getSession(req);" },
      { type: "unchanged", oldNumber: 19, newNumber: 19, code: "  if (!session) {" },
      { type: "removed", oldNumber: 20, code: '    throw new Error("Unauthorized user access");' },
      { type: "added", newNumber: 20, code: '    // Emit telemetry audit log before redirecting' },
      { type: "added", newNumber: 21, code: '    await auditLog.record("AUTH_FAILURE", { ip: req.ip });' },
      { type: "added", newNumber: 22, code: '    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });' },
      { type: "unchanged", oldNumber: 21, newNumber: 23, code: "  }" },
      { type: "unchanged", oldNumber: 22, newNumber: 24, code: "  return session.user;" },
    ],
  },
  {
    header: "@@ -45,5 +49,7 @@ export function validateTokenExpiry(expiresAt: Date): boolean {",
    lines: [
      { type: "unchanged", oldNumber: 45, newNumber: 49, code: "  const now = Date.now();" },
      { type: "removed", oldNumber: 46, code: "  return expiresAt.getTime() > now;" },
      { type: "added", newNumber: 50, code: "  const gracePeriodMs = 30 * 1000; // 30s leeway" },
      { type: "added", newNumber: 51, code: "  return expiresAt.getTime() + gracePeriodMs > now;" },
      { type: "unchanged", oldNumber: 47, newNumber: 52, code: "}" },
    ],
  },
];

export function InteractiveCodeDiff({
  filename = "src/server/auth.ts",
  compareRange = "main...feature/audit-logs",
  hunks = SAMPLE_HUNKS,
  defaultMode = "unified",
  className,
}: InteractiveCodeDiffProps) {
  const [mode, setMode] = useState<"unified" | "split">(defaultMode);
  const [copied, setCopied] = useState(false);
  const [collapsedHunks, setCollapsedHunks] = useState<Record<number, boolean>>({});

  const toggleHunk = (idx: number) => {
    setCollapsedHunks((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const allLines = hunks.flatMap((h) => h.lines);
  const additions = allLines.filter((l) => l.type === "added").length;
  const deletions = allLines.filter((l) => l.type === "removed").length;

  const handleCopyDiff = () => {
    const raw = hunks
      .map(
        (h) =>
          `${h.header}\n` +
          h.lines
            .map((l) => `${l.type === "added" ? "+" : l.type === "removed" ? "-" : " "}${l.code}`)
            .join("\n")
      )
      .join("\n\n");
    navigator.clipboard.writeText(raw);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div
      className={cn(
        "relative w-full max-w-3xl overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 shadow-sm font-mono text-xs select-none text-neutral-900 dark:text-neutral-100",
        className
      )}
    >
      {/* Diff Header */}
      <div className="flex h-11 w-full items-center justify-between border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 px-4">
        <div className="flex items-center gap-2 min-w-0">
          <FileCode className="h-4 w-4 text-neutral-500 dark:text-neutral-400 shrink-0" />
          <span className="font-semibold text-neutral-900 dark:text-white truncate">{filename}</span>
          <span className="hidden sm:inline text-[10px] text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-900 px-2 py-0.5 rounded border border-neutral-200 dark:border-neutral-800 shrink-0 font-sans">
            {compareRange}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Additions & Deletions Counter */}
          <div className="flex items-center gap-1.5 text-xs font-semibold">
            <span className="text-emerald-500">+{additions}</span>
            <span className="text-rose-500">-{deletions}</span>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-0.5">
            <button
              type="button"
              onClick={() => setMode("unified")}
              className={cn(
                "p-1 rounded-md transition-colors",
                mode === "unified"
                  ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-950"
                  : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
              )}
              title="Unified Layout"
            >
              <AlignJustify className="h-3 w-3" />
            </button>
            <button
              type="button"
              onClick={() => setMode("split")}
              className={cn(
                "p-1 rounded-md transition-colors",
                mode === "split"
                  ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-950"
                  : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
              )}
              title="Split Layout"
            >
              <Columns className="h-3 w-3" />
            </button>
          </div>

          {/* Copy Button */}
          <button
            type="button"
            onClick={handleCopyDiff}
            className="flex items-center gap-1 px-2 py-1 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 transition-colors text-[11px]"
            title="Copy git diff format"
          >
            {copied ? (
              <Check className="h-3 w-3 text-emerald-500" />
            ) : (
              <Copy className="h-3 w-3 text-neutral-400" />
            )}
            <span className="hidden sm:inline">{copied ? "Copied" : "Copy"}</span>
          </button>
        </div>
      </div>

      {/* Main Diff Hunks */}
      <div className="divide-y divide-neutral-200 dark:divide-neutral-800 bg-white dark:bg-neutral-950">
        {hunks.map((hunk, hIdx) => {
          const isCollapsed = collapsedHunks[hIdx];

          return (
            <div key={hIdx} className="overflow-hidden">
              {/* Hunk Header */}
              <button
                type="button"
                onClick={() => toggleHunk(hIdx)}
                className="flex w-full items-center gap-2 bg-neutral-50/80 dark:bg-neutral-900/60 hover:bg-neutral-100 dark:hover:bg-neutral-800/80 px-4 py-1.5 text-[10px] text-neutral-500 dark:text-neutral-400 font-mono transition-colors text-left border-y border-neutral-200 dark:border-neutral-800"
              >
                {isCollapsed ? (
                  <ChevronRight className="h-3 w-3 shrink-0" />
                ) : (
                  <ChevronDown className="h-3 w-3 shrink-0" />
                )}
                <span className="font-semibold text-neutral-700 dark:text-neutral-300 truncate">{hunk.header}</span>
              </button>

              {/* Hunk Code View */}
              {!isCollapsed && (
                <div className="overflow-x-auto text-[11px] leading-relaxed p-0.5">
                  {mode === "unified" ? (
                    /* Unified Line-by-Line */
                    <div className="divide-y divide-neutral-200/40 dark:divide-neutral-800/40 font-mono">
                      {hunk.lines.map((line, lIdx) => (
                        <div
                          key={lIdx}
                          className={cn(
                            "flex items-center gap-2 px-3 py-0.5 transition-colors",
                            line.type === "added" && "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium",
                            line.type === "removed" && "bg-rose-500/10 text-rose-600 dark:text-rose-400 line-through opacity-80",
                            line.type === "unchanged" && "text-neutral-600 dark:text-neutral-400"
                          )}
                        >
                          <span className="w-6 text-right text-[10px] text-neutral-400 dark:text-neutral-600 select-none">
                            {line.oldNumber || " "}
                          </span>
                          <span className="w-6 text-right text-[10px] text-neutral-400 dark:text-neutral-600 select-none">
                            {line.newNumber || " "}
                          </span>
                          <span className="w-3 text-center select-none font-bold">
                            {line.type === "added" ? "+" : line.type === "removed" ? "-" : " "}
                          </span>
                          <span className="flex-1 whitespace-pre">{line.code}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    /* Split Side-by-Side */
                    <div className="grid grid-cols-2 divide-x divide-neutral-200 dark:divide-neutral-800 font-mono">
                      {/* Left: Old */}
                      <div className="divide-y divide-neutral-200/40 dark:divide-neutral-800/40">
                        {hunk.lines
                          .filter((l) => l.type !== "added")
                          .map((line, lIdx) => (
                            <div
                              key={lIdx}
                              className={cn(
                                "flex items-center gap-2 px-2 py-0.5",
                                line.type === "removed" ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 line-through" : "text-neutral-600 dark:text-neutral-400"
                              )}
                            >
                              <span className="w-6 text-right text-[10px] text-neutral-400 dark:text-neutral-600 select-none">
                                {line.oldNumber}
                              </span>
                              <span className="w-3 text-center select-none font-bold">
                                {line.type === "removed" ? "-" : " "}
                              </span>
                              <span className="flex-1 whitespace-pre truncate">{line.code}</span>
                            </div>
                          ))}
                      </div>

                      {/* Right: New */}
                      <div className="divide-y divide-neutral-200/40 dark:divide-neutral-800/40">
                        {hunk.lines
                          .filter((l) => l.type !== "removed")
                          .map((line, lIdx) => (
                            <div
                              key={lIdx}
                              className={cn(
                                "flex items-center gap-2 px-2 py-0.5",
                                line.type === "added" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium" : "text-neutral-600 dark:text-neutral-400"
                              )}
                            >
                              <span className="w-6 text-right text-[10px] text-neutral-400 dark:text-neutral-600 select-none">
                                {line.newNumber}
                              </span>
                              <span className="w-3 text-center select-none font-bold">
                                {line.type === "added" ? "+" : " "}
                              </span>
                              <span className="flex-1 whitespace-pre truncate">{line.code}</span>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

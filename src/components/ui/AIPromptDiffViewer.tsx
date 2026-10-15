"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, FileCode, Columns, AlignJustify, Sparkles, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DiffLine {
  type: "unchanged" | "added" | "removed";
  oldLineNumber?: number;
  newLineNumber?: number;
  content: string;
}

export interface AIPromptDiffViewerProps {
  /** Filename shown in titlebar. Default: "hooks/useCounter.ts" */
  filename?: string;
  /** Language identifier. Default: "typescript" */
  language?: string;
  /** Diff lines payload */
  lines?: DiffLine[];
  /** Default view mode: "inline" or "split". Default: "inline" */
  defaultViewMode?: "inline" | "split";
  /** Callback when suggestion is accepted */
  onAccept?: () => void;
  /** Callback when suggestion is rejected */
  onReject?: () => void;
  className?: string;
}

const SAMPLE_DIFF: DiffLine[] = [
  { type: "unchanged", oldLineNumber: 12, newLineNumber: 12, content: "export function useCounter(initial = 0) {" },
  { type: "removed", oldLineNumber: 13, content: "  const [count, setCount] = useState(initial);" },
  { type: "added", newLineNumber: 13, content: "  // Optimized with React 19 useOptimistic state" },
  { type: "added", newLineNumber: 14, content: "  const [count, setOptimisticCount] = useOptimistic(initial);" },
  { type: "unchanged", oldLineNumber: 14, newLineNumber: 15, content: "  const increment = () => setCount((c) => c + 1);" },
  { type: "unchanged", oldLineNumber: 15, newLineNumber: 16, content: "  return { count, increment };" },
  { type: "unchanged", oldLineNumber: 16, newLineNumber: 17, content: "}" },
];

export function AIPromptDiffViewer({
  filename = "hooks/useCounter.ts",
  language = "typescript",
  lines = SAMPLE_DIFF,
  defaultViewMode = "inline",
  onAccept,
  onReject,
  className,
}: AIPromptDiffViewerProps) {
  const [viewMode, setViewMode] = useState<"inline" | "split">(defaultViewMode);
  const [status, setStatus] = useState<"pending" | "accepted" | "rejected">("pending");

  const additions = lines.filter((l) => l.type === "added").length;
  const deletions = lines.filter((l) => l.type === "removed").length;

  const handleAccept = () => {
    setStatus("accepted");
    onAccept?.();
  };

  const handleReject = () => {
    setStatus("rejected");
    onReject?.();
  };

  const handleReset = () => {
    setStatus("pending");
  };

  // Keyboard shortcut listener (⌘Y / Ctrl+Y to accept, ⌘N / Ctrl+N to reject)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "y") {
        e.preventDefault();
        handleAccept();
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "n") {
        e.preventDefault();
        handleReject();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div
      className={cn(
        "relative w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-card shadow-sm font-mono text-xs select-none",
        className
      )}
    >
      {/* Titlebar Header */}
      <div className="flex h-11 w-full items-center justify-between border-b border-border bg-muted/40 px-4">
        <div className="flex items-center gap-2 min-w-0">
          <FileCode className="h-4 w-4 text-muted-foreground shrink-0" />
          <span className="font-semibold text-foreground truncate">{filename}</span>
          <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded border border-border shrink-0">
            {language}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Additions / Deletions count */}
          <div className="flex items-center gap-1.5 text-[11px] font-semibold">
            <span className="text-emerald-500">+{additions}</span>
            <span className="text-rose-500">-{deletions}</span>
          </div>

          {/* Inline / Split toggle */}
          <div className="flex items-center rounded-lg border border-border bg-card p-0.5">
            <button
              type="button"
              onClick={() => setViewMode("inline")}
              className={cn(
                "p-1 rounded-md transition-colors",
                viewMode === "inline"
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground"
              )}
              title="Inline Diff"
            >
              <AlignJustify className="h-3 w-3" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("split")}
              className={cn(
                "p-1 rounded-md transition-colors",
                viewMode === "split"
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground"
              )}
              title="Split Diff"
            >
              <Columns className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Diff Code Area */}
      <div className="overflow-x-auto text-[11px] leading-relaxed p-1 bg-background/50">
        {viewMode === "inline" ? (
          <div className="divide-y divide-border/20">
            {lines.map((line, idx) => (
              <div
                key={idx}
                className={cn(
                  "flex items-center gap-2 px-2 py-0.5 transition-colors",
                  line.type === "added" && "bg-emerald-500/10 text-emerald-400 font-medium",
                  line.type === "removed" && "bg-rose-500/10 text-rose-400 line-through opacity-80",
                  line.type === "unchanged" && "text-muted-foreground"
                )}
              >
                {/* Gutter Line Numbers */}
                <span className="w-6 text-right text-[10px] text-muted-foreground/40 select-none">
                  {line.oldLineNumber || " "}
                </span>
                <span className="w-6 text-right text-[10px] text-muted-foreground/40 select-none">
                  {line.newLineNumber || " "}
                </span>
                {/* Symbol Prefix */}
                <span className="w-3 text-center select-none font-bold">
                  {line.type === "added" ? "+" : line.type === "removed" ? "-" : " "}
                </span>
                {/* Code Content */}
                <span className="flex-1 whitespace-pre">{line.content}</span>
              </div>
            ))}
          </div>
        ) : (
          /* Split Diff View */
          <div className="grid grid-cols-2 divide-x divide-border">
            {/* Left: Original */}
            <div className="divide-y divide-border/20">
              <div className="px-3 py-1 bg-muted/30 text-[10px] font-semibold text-muted-foreground border-b border-border/40">
                Original
              </div>
              {lines
                .filter((l) => l.type !== "added")
                .map((line, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "flex items-center gap-2 px-2 py-0.5",
                      line.type === "removed" ? "bg-rose-500/10 text-rose-400 line-through" : "text-muted-foreground"
                    )}
                  >
                    <span className="w-6 text-right text-[10px] text-muted-foreground/40 select-none">
                      {line.oldLineNumber}
                    </span>
                    <span className="flex-1 whitespace-pre truncate">{line.content}</span>
                  </div>
                ))}
            </div>

            {/* Right: Suggested */}
            <div className="divide-y divide-border/20">
              <div className="px-3 py-1 bg-muted/30 text-[10px] font-semibold text-muted-foreground border-b border-border/40">
                Suggested
              </div>
              {lines
                .filter((l) => l.type !== "removed")
                .map((line, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "flex items-center gap-2 px-2 py-0.5",
                      line.type === "added" ? "bg-emerald-500/10 text-emerald-400 font-medium" : "text-muted-foreground"
                    )}
                  >
                    <span className="w-6 text-right text-[10px] text-muted-foreground/40 select-none">
                      {line.newLineNumber}
                    </span>
                    <span className="flex-1 whitespace-pre truncate">{line.content}</span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Floating Action Bar */}
      <div className="flex items-center justify-between border-t border-border bg-muted/40 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-amber-500" />
          <span className="text-[11px] text-muted-foreground">
            {status === "accepted" ? (
              <span className="text-emerald-500 font-semibold">Changes accepted</span>
            ) : status === "rejected" ? (
              <span className="text-rose-500 font-semibold">Changes rejected</span>
            ) : (
              "AI code modification ready"
            )}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {status !== "pending" ? (
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-border bg-card hover:bg-accent text-foreground transition-colors text-[11px]"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset</span>
            </button>
          ) : (
            <>
              {/* Reject Button */}
              <button
                type="button"
                onClick={handleReject}
                className="flex items-center gap-1 px-3 py-1 rounded-lg border border-border bg-card hover:bg-rose-500/10 hover:border-rose-500/30 text-muted-foreground hover:text-rose-400 transition-all text-[11px]"
              >
                <X className="h-3 w-3" />
                <span>Reject</span>
                <span className="hidden sm:inline text-[9px] opacity-60 font-mono">⌘N</span>
              </button>

              {/* Accept Button */}
              <button
                type="button"
                onClick={handleAccept}
                className="flex items-center gap-1 px-3 py-1 rounded-lg border border-emerald-500/40 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 font-medium transition-all text-[11px] shadow-xs active:scale-95"
              >
                <Check className="h-3 w-3" />
                <span>Accept</span>
                <span className="hidden sm:inline text-[9px] opacity-75 font-mono">⌘Y</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

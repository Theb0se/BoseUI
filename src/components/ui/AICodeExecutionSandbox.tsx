"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, RotateCw, Terminal, Code2, Copy, Check, CheckCircle2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AICodeExecutionSandboxProps {
  /** Source code snippet to display and execute */
  code?: string;
  /** Programming language identifier. Default: "typescript" */
  language?: string;
  /** Simulated or real output lines */
  output?: string[];
  /** Execution status */
  status?: "idle" | "running" | "success" | "error";
  /** Execution time in milliseconds. Default: 142 */
  executionTimeMs?: number;
  /** Callback when user clicks Run Code */
  onRun?: () => void;
  className?: string;
}

const DEFAULT_CODE = `async function computeFibonacci(n: number): Promise<number> {
  const dp: number[] = [0, 1];
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  return dp[n];
}

console.log("Fibonacci(40):", await computeFibonacci(40));`;

const DEFAULT_OUTPUT = [
  "✔ Compiling TypeScript v5.7.2 AST...",
  "✔ Initializing V8 isolate sandbox runtime...",
  "→ Executing computeFibonacci(40)",
  "Fibonacci(40): 102334155",
  "✨ Process exited with code 0 (142ms)",
];

export function AICodeExecutionSandbox({
  code = DEFAULT_CODE,
  language = "typescript",
  output = DEFAULT_OUTPUT,
  status = "idle",
  executionTimeMs = 142,
  onRun,
  className,
}: AICodeExecutionSandboxProps) {
  const [activeTab, setActiveTab] = useState<"code" | "output">("code");
  const [isRunning, setIsRunning] = useState(false);
  const [visibleLines, setVisibleLines] = useState<string[]>(output);
  const [copied, setCopied] = useState(false);

  const handleRun = () => {
    setIsRunning(true);
    setActiveTab("output");
    setVisibleLines([]);
    onRun?.();

    // Stream lines sequentially
    let currentIdx = 0;
    const interval = setInterval(() => {
      if (currentIdx < output.length) {
        const nextLine = output[currentIdx];
        setVisibleLines((prev) => [...prev, nextLine]);
        currentIdx++;
      } else {
        clearInterval(interval);
        setIsRunning(false);
      }
    }, 280);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div
      className={cn(
        "relative w-full max-w-2xl overflow-hidden rounded-2xl border border-gray-400 bg-[#0E0E11] text-neutral-200 shadow-xl font-mono text-xs select-none",
        className
      )}
    >
      {/* Top Header Bar */}
      <div className="flex h-11 w-full items-center justify-between border-b border-neutral-800 bg-[#16161A] px-4">
        {/* Tabs: Code vs Output */}
        <div className="flex items-center gap-1.5 p-0.5 rounded-xl bg-neutral-900 border border-neutral-800">
          <button
            type="button"
            onClick={() => setActiveTab("code")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all",
              activeTab === "code"
                ? "bg-neutral-800 text-white shadow-xs"
                : "text-neutral-400 hover:text-white"
            )}
          >
            <Code2 className="h-3.5 w-3.5" />
            <span>Code</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("output")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all relative",
              activeTab === "output"
                ? "bg-neutral-800 text-white shadow-xs"
                : "text-neutral-400 hover:text-white"
            )}
          >
            <Terminal className="h-3.5 w-3.5" />
            <span>Output</span>
            {isRunning && (
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping absolute top-1 right-1" />
            )}
          </button>
        </div>

        {/* Status & Actions */}
        <div className="flex items-center gap-3">
          {/* Execution Telemetry Pill */}
          <div className="hidden sm:flex items-center gap-1.5 text-[10px] text-neutral-400 font-sans">
            {isRunning ? (
              <span className="inline-flex items-center gap-1 text-amber-400">
                <RotateCw className="h-3 w-3 animate-spin" />
                <span>Running V8…</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-emerald-400">
                <CheckCircle2 className="h-3 w-3" />
                <span>Exit 0 ({executionTimeMs}ms)</span>
              </span>
            )}
          </div>

          {/* Copy Button */}
          {activeTab === "code" && (
            <button
              type="button"
              onClick={handleCopy}
              className="p-1.5 rounded-lg border border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white hover:border-neutral-700 transition-colors"
              title="Copy source code"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            </button>
          )}

          {/* Run Code Button */}
          <button
            type="button"
            onClick={handleRun}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg border border-emerald-500/40 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 font-medium transition-all text-xs active:scale-95 disabled:opacity-50"
          >
            {isRunning ? (
              <RotateCw className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Play className="h-3.5 w-3.5 fill-current" />
            )}
            <span>{isRunning ? "Executing…" : "Run Code"}</span>
          </button>
        </div>
      </div>

      {/* Main Body Viewport */}
      <div className="min-h-[200px] p-4 text-[11px] leading-relaxed overflow-x-auto">
        {activeTab === "code" ? (
          <div className="space-y-0.5">
            {code.split("\n").map((line, i) => (
              <div key={i} className="flex items-start gap-4">
                <span className="w-5 text-right text-neutral-600 select-none font-mono">
                  {i + 1}
                </span>
                <span className="flex-1 whitespace-pre font-mono text-neutral-300">
                  {line}
                </span>
              </div>
            ))}
          </div>
        ) : (
          /* Terminal Console Output */
          <div className="space-y-1.5 font-mono">
            {visibleLines.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                className={cn(
                  "flex items-start gap-2",
                  line.startsWith("✔") && "text-emerald-400",
                  line.startsWith("→") && "text-sky-400 font-semibold",
                  line.startsWith("✨") && "text-amber-400 font-semibold pt-1 border-t border-neutral-800/60",
                  line.startsWith("Fibonacci") && "text-white font-bold text-xs"
                )}
              >
                <span>{line}</span>
              </motion.div>
            ))}

            {isRunning && (
              <div className="flex items-center gap-1.5 text-neutral-500 pt-1">
                <span className="inline-block h-3.5 w-1.5 bg-emerald-400 animate-pulse" />
                <span>streaming isolate stdout…</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

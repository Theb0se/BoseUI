"use client";

import React, { useState, useId } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, Copy, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CodeSnippetTab {
  id: string;
  label: string;
  code: string;
  language?: string;
}

export interface CopyCodeBlockProps {
  /** Array of code or package-manager tabs */
  tabs?: CodeSnippetTab[];
  /** Single code string when tabs are not needed */
  code?: string;
  /** Optional header title shown when single `code` is used */
  title?: string;
  /** Show line numbers next to multi-line code. Default: false */
  showLineNumbers?: boolean;
  /** Show terminal `$` prefix for single-line CLI commands. Default: true */
  showPromptPrefix?: boolean;
  /** Callback fired when code is copied to clipboard */
  onCopy?: (copiedText: string) => void;
  className?: string;
}

const DEFAULT_TABS: CodeSnippetTab[] = [
  {
    id: "npx",
    label: "npx",
    code: 'npx shadcn@latest add "https://boseui.site/r/drawer.json"',
    language: "bash",
  },
  {
    id: "pnpm",
    label: "pnpm",
    code: 'pnpm dlx shadcn@latest add "https://boseui.site/r/drawer.json"',
    language: "bash",
  },
  {
    id: "bun",
    label: "bun",
    code: 'bunx --bun shadcn@latest add "https://boseui.site/r/drawer.json"',
    language: "bash",
  },
  {
    id: "yarn",
    label: "yarn",
    code: 'yarn dlx shadcn@latest add "https://boseui.site/r/drawer.json"',
    language: "bash",
  },
];

export function CopyCodeBlock({
  tabs = DEFAULT_TABS,
  code,
  title = "Terminal",
  showLineNumbers = false,
  showPromptPrefix = true,
  onCopy,
  className,
}: CopyCodeBlockProps) {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const tabGroupId = useId();

  const resolvedTabs: CodeSnippetTab[] = code
    ? [{ id: "single", label: title, code }]
    : tabs.length > 0
      ? tabs
      : DEFAULT_TABS;

  const [activeTabId, setActiveTabId] = useState<string>(resolvedTabs[0].id);
  const [copied, setCopied] = useState(false);

  const currentTab =
    resolvedTabs.find((t) => t.id === activeTabId) ?? resolvedTabs[0];

  const lines = currentTab.code.split("\n");
  const isSingleLine = lines.length === 1;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentTab.code);
      setCopied(true);
      onCopy?.(currentTab.code);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Fallback ignore if clipboard permission denied
    }
  };

  return (
    <div
      className={cn(
        "w-full max-w-lg overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-[#262626] dark:bg-[#0A0A0A]",
        className
      )}
    >
      {/* Header Bar with Tabs + Copy Button */}
      <div className="flex items-center justify-between border-b border-neutral-200 bg-neutral-50/80 px-3 py-2 dark:border-[#1A1A1A] dark:bg-[#111111]">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <Terminal className="mr-1 h-3.5 w-3.5 shrink-0 text-neutral-400" />
          {resolvedTabs.length === 1 ? (
            <span className="font-mono text-xs font-medium text-neutral-600 dark:text-neutral-300">
              {resolvedTabs[0].label}
            </span>
          ) : (
            resolvedTabs.map((tab) => {
              const isActive = tab.id === currentTab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTabId(tab.id)}
                  className={cn(
                    "relative rounded-lg px-2.5 py-1 font-mono text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white",
                    isActive
                      ? "text-black dark:text-white"
                      : "text-neutral-500 hover:text-black dark:text-neutral-400 dark:hover:text-white"
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId={`code-tab-pill-${tabGroupId}`}
                      transition={
                        shouldReduceMotion
                          ? { duration: 0 }
                          : { type: "spring", stiffness: 420, damping: 30 }
                      }
                      className="absolute inset-0 rounded-lg border border-neutral-200/80 bg-white shadow-2xs dark:border-[#262626] dark:bg-[#1C1C1C]"
                    />
                  )}
                  <span className="relative z-10">{tab.label}</span>
                </button>
              );
            })
          )}
        </div>

        {/* Copy Button */}
        <button
          type="button"
          aria-label="Copy code to clipboard"
          onClick={handleCopy}
          className={cn(
            "inline-flex h-7 items-center gap-1.5 rounded-lg border px-2.5 font-mono text-[11px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white",
            copied
              ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
              : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 hover:text-black dark:border-[#262626] dark:bg-[#141414] dark:text-neutral-300 dark:hover:text-white"
          )}
        >
          <AnimatePresence mode="wait" initial={false}>
            {copied ? (
              <motion.span
                key="copied"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.12 }}
                className="inline-flex items-center gap-1"
              >
                <Check className="h-3 w-3" />
                <span>Copied</span>
              </motion.span>
            ) : (
              <motion.span
                key="copy"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.12 }}
                className="inline-flex items-center gap-1"
              >
                <Copy className="h-3 w-3" />
                <span>Copy</span>
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Code Content */}
      <div className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-neutral-800 dark:text-neutral-200">
        <pre className="m-0">
          <code>
            {lines.map((line, i) => (
              <div key={i} className="flex items-baseline">
                {showLineNumbers && !isSingleLine && (
                  <span className="mr-4 inline-block w-5 select-none text-right text-[11px] text-neutral-400 dark:text-neutral-600">
                    {i + 1}
                  </span>
                )}
                {isSingleLine && showPromptPrefix && (
                  <span className="mr-2.5 select-none text-neutral-400 dark:text-neutral-500">
                    $
                  </span>
                )}
                <span className="whitespace-pre">{line}</span>
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}

export default CopyCodeBlock;

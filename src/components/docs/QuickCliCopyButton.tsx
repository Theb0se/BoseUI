"use client";

import React, { useState, useEffect } from "react";
import { Check, Copy, Terminal } from "lucide-react";
import { track } from "@vercel/analytics";
import { copyToClipboard, SITE_CONFIG, cn } from "@/lib/utils";

type PackageManager = "npm" | "pnpm" | "bun";

export interface QuickCliCopyButtonProps {
  slug?: string;
  cliCommand?: string;
  className?: string;
}

export function QuickCliCopyButton({
  slug,
  cliCommand,
  className = "",
}: QuickCliCopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const [pm, setPm] = useState<PackageManager>("npm");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("boseui-pm");
      if (saved === "pnpm" || saved === "bun" || saved === "npm" || saved === "npx") {
        setPm(saved === "npx" ? "npm" : (saved as PackageManager));
      }
    } catch {}
  }, []);

  const registryUrl = slug ? `${SITE_CONFIG.url}/r/${slug}.json` : "";

  const getCommand = (mgr: PackageManager) => {
    if (cliCommand && !slug) return cliCommand;
    if (mgr === "pnpm") return `pnpm dlx shadcn@latest add ${registryUrl}`;
    if (mgr === "bun") return `bunx --bun shadcn@latest add ${registryUrl}`;
    return `npx shadcn@latest add ${registryUrl}`;
  };

  const activeCommand = getCommand(pm);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const ok = await copyToClipboard(activeCommand);
    if (ok) {
      setCopied(true);
      track("Copy CLI Command", {
        command: activeCommand,
        source: "QuickCliCopyButton",
      });
      setTimeout(() => setCopied(false), 1800);
    }
  };

  const handlePmChange = (newPm: PackageManager, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setPm(newPm);
    try {
      localStorage.setItem("boseui-pm", newPm);
    } catch {}
  };

  return (
    <div
      className={cn(
        "group inline-flex items-center rounded-xl border border-neutral-200/90 bg-neutral-50/80 shadow-2xs backdrop-blur-sm transition-all hover:border-neutral-300 dark:border-neutral-800/90 dark:bg-neutral-900/60 dark:hover:border-neutral-700",
        className
      )}
    >
      {/* Package Manager Toggle Pills (if slug provided) */}
      {slug && (
        <div className="flex items-center border-r border-neutral-200/80 px-1 py-1 dark:border-neutral-800/80">
          {(["npm", "pnpm", "bun"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={(e) => handlePmChange(m, e)}
              className={cn(
                "rounded px-1.5 py-0.5 font-mono text-[10px] font-medium transition-colors",
                pm === m
                  ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-950"
                  : "text-neutral-400 hover:text-neutral-700 dark:text-neutral-500 dark:hover:text-neutral-200"
              )}
            >
              {m}
            </button>
          ))}
        </div>
      )}

      {/* Main Copy Button */}
      <button
        type="button"
        onClick={handleCopy}
        aria-label={`Copy command: ${activeCommand}`}
        title={`Click to copy: ${activeCommand}`}
        className="flex items-center gap-2 px-3 py-1.5 font-mono text-xs text-neutral-700 hover:text-neutral-950 dark:text-neutral-300 dark:hover:text-white"
      >
        <span className="flex items-center gap-1.5 text-neutral-400 dark:text-neutral-500">
          <Terminal className="h-3.5 w-3.5 shrink-0" />
          <span className="select-none font-semibold text-neutral-400 dark:text-neutral-600">
            $
          </span>
        </span>
        <span className="truncate font-mono text-[11.5px] tracking-tight">
          {activeCommand}
        </span>
        <span
          className={cn(
            "ml-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all",
            copied
              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-400"
              : "border-neutral-200 bg-white text-neutral-500 group-hover:border-neutral-300 group-hover:text-neutral-950 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-400 dark:group-hover:border-neutral-700 dark:group-hover:text-white"
          )}
        >
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
        </span>
      </button>
    </div>
  );
}

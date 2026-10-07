"use client";

import React, { useState } from "react";
import { Check, Copy, Terminal, Wrench } from "lucide-react";
import { CodeViewer } from "@/components/docs/CodeViewer";
import { cn, copyToClipboard, SITE_CONFIG } from "@/lib/utils";

type PackageManager = "npx" | "pnpm" | "bun" | "yarn";

export interface InstallTabsProps {
  slug: string;
  sourceCode: string;
  dependencies: string[];
  usesCnUtility?: boolean;
}

const UTILS_SNIPPET = `import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}`;

export function InstallTabs({
  slug,
  sourceCode,
  dependencies,
  usesCnUtility = true,
}: InstallTabsProps) {
  const [mode, setMode] = useState<"cli" | "manual">("cli");
  const [pm, setPm] = useState<PackageManager>("npx");
  const [copiedCli, setCopiedCli] = useState(false);

  const registryUrl = `${SITE_CONFIG.url}/r/${slug}.json`;

  const cliCommands: Record<PackageManager, string> = {
    npx: `npx shadcn@latest add ${registryUrl}`,
    pnpm: `pnpm dlx shadcn@latest add ${registryUrl}`,
    bun: `bunx --bun shadcn@latest add ${registryUrl}`,
    yarn: `yarn dlx shadcn@latest add ${registryUrl}`,
  };

  const allNpmDeps = Array.from(
    new Set([
      ...dependencies,
      ...(usesCnUtility ? ["clsx", "tailwind-merge"] : []),
    ])
  );
  const manualInstallCmd = `npm install ${allNpmDeps.join(" ")}`;

  const handleCopyCli = async () => {
    const ok = await copyToClipboard(cliCommands[pm]);
    if (ok) {
      setCopiedCli(true);
      setTimeout(() => setCopiedCli(false), 1800);
    }
  };

  return (
    <div className="space-y-4">
      <div className="inline-flex items-center rounded-xl border border-neutral-200 bg-neutral-100 p-1 dark:border-[#222222] dark:bg-[#0A0A0A]">
        <button
          type="button"
          onClick={() => setMode("cli")}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors",
            mode === "cli"
              ? "bg-black text-white shadow-sm dark:bg-white dark:text-black"
              : "text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white"
          )}
        >
          <Terminal className="h-3.5 w-3.5" />
          <span>CLI</span>
        </button>

        <button
          type="button"
          onClick={() => setMode("manual")}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors",
            mode === "manual"
              ? "bg-black text-white shadow-sm dark:bg-white dark:text-black"
              : "text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white"
          )}
        >
          <Wrench className="h-3.5 w-3.5" />
          <span>Manual</span>
        </button>
      </div>

      {mode === "cli" ? (
        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50 dark:border-[#222222] dark:bg-[#050505]">
          <div className="flex items-center justify-between border-b border-neutral-200 bg-white px-4 py-2 dark:border-[#1F1F1F] dark:bg-[#0A0A0A]">
            <div className="flex items-center gap-1">
              {(["npx", "pnpm", "bun", "yarn"] as PackageManager[]).map(
                (manager) => (
                  <button
                    key={manager}
                    type="button"
                    onClick={() => setPm(manager)}
                    className={cn(
                      "rounded-lg px-2.5 py-1 font-mono text-xs transition-colors",
                      pm === manager
                        ? "bg-black font-semibold text-white dark:bg-white dark:text-black"
                        : "text-neutral-500 hover:text-black dark:hover:text-white"
                    )}
                  >
                    {manager}
                  </button>
                )
              )}
            </div>

            <button
              type="button"
              onClick={handleCopyCli}
              className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-neutral-100 px-2.5 py-1 font-mono text-xs text-neutral-700 transition-colors hover:border-black hover:bg-black hover:text-white dark:border-[#262626] dark:bg-[#141414] dark:text-neutral-300 dark:hover:border-white dark:hover:bg-white dark:hover:text-black"
            >
              {copiedCli ? (
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

          <div className="overflow-x-auto p-4 font-mono text-xs sm:text-sm">
            <span className="select-none text-neutral-400 dark:text-neutral-500">
              ${" "}
            </span>
            <span className="text-black dark:text-white">
              {cliCommands[pm]}
            </span>
          </div>
        </div>
      ) : (
        <div className="space-y-6 rounded-2xl border border-neutral-200 bg-neutral-50/50 p-5 dark:border-[#222222] dark:bg-[#0A0A0A] sm:p-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-black font-mono text-xs font-bold text-white dark:bg-white dark:text-black">
                1
              </span>
              <h4 className="text-sm font-semibold text-black dark:text-white">
                Install dependencies
              </h4>
            </div>
            <CodeViewer
              code={manualInstallCmd}
              filename="terminal"
              language="bash"
            />
          </div>

          {usesCnUtility && (
            <div className="space-y-2">
              <div className="flex items-center gap-2.5">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-black font-mono text-xs font-bold text-white dark:bg-white dark:text-black">
                  2
                </span>
                <h4 className="text-sm font-semibold text-black dark:text-white">
                  Add the <code className="font-mono">cn()</code> helper
                </h4>
              </div>
              <CodeViewer
                code={UTILS_SNIPPET}
                filename="src/lib/utils.ts"
                language="ts"
              />
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-black font-mono text-xs font-bold text-white dark:bg-white dark:text-black">
                {usesCnUtility ? "3" : "2"}
              </span>
              <h4 className="text-sm font-semibold text-black dark:text-white">
                Copy component source
              </h4>
            </div>
            <CodeViewer
              code={sourceCode}
              filename={`components/ui/${slug}.tsx`}
              language="tsx"
              maxHeight="420px"
            />
          </div>
        </div>
      )}
    </div>
  );
}

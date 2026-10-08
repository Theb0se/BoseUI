"use client";

import React, { useState } from "react";
import { Check, Copy, Terminal, Wrench, Package } from "lucide-react";
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
    npx: `npx shadcn@latest add "${registryUrl}"`,
    pnpm: `pnpm dlx shadcn@latest add "${registryUrl}"`,
    bun: `bunx --bun shadcn@latest add "${registryUrl}"`,
    yarn: `yarn dlx shadcn@latest add "${registryUrl}"`,
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
      {/* Mode Switcher + Dependencies Summary */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div
          role="tablist"
          aria-label="Installation method"
          className="inline-flex items-center gap-1 rounded-xl border border-neutral-200 bg-neutral-100/90 p-1 dark:border-neutral-800 dark:bg-neutral-900"
        >
          <button
            type="button"
            role="tab"
            aria-selected={mode === "cli"}
            onClick={() => setMode("cli")}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors",
              mode === "cli"
                ? "bg-white text-neutral-950 shadow-2xs dark:bg-neutral-950 dark:text-white"
                : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
            )}
          >
            <Terminal className="h-3.5 w-3.5" />
            <span>CLI (Recommended)</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={mode === "manual"}
            onClick={() => setMode("manual")}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors",
              mode === "manual"
                ? "bg-white text-neutral-950 shadow-2xs dark:bg-neutral-950 dark:text-white"
                : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
            )}
          >
            <Wrench className="h-3.5 w-3.5" />
            <span>Manual Copy</span>
          </button>
        </div>

        {/* Dependency Chips */}
        {allNpmDeps.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center gap-1 text-[11px] text-neutral-400">
              <Package className="h-3 w-3" />
              Requires:
            </span>
            {allNpmDeps.map((dep) => (
              <span
                key={dep}
                className="rounded-md border border-neutral-200 bg-neutral-50 px-2 py-0.5 font-mono text-[11px] text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400"
              >
                {dep}
              </span>
            ))}
          </div>
        )}
      </div>

      {mode === "cli" ? (
        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-[#0A0A0A]">
          <div className="flex items-center justify-between border-b border-neutral-200 bg-neutral-50/80 px-4 py-2.5 dark:border-neutral-800 dark:bg-neutral-900/60">
            <div className="flex items-center gap-1">
              {(["npx", "pnpm", "bun", "yarn"] as PackageManager[]).map(
                (manager) => (
                  <button
                    key={manager}
                    type="button"
                    onClick={() => setPm(manager)}
                    className={cn(
                      "rounded-lg px-2.5 py-1 font-mono text-xs font-medium transition-colors",
                      pm === manager
                        ? "bg-neutral-900 text-white dark:bg-white dark:text-black"
                        : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
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
              className={cn(
                "inline-flex h-7 items-center gap-1.5 rounded-lg border px-2.5 font-mono text-xs font-medium transition-colors",
                copiedCli
                  ? "border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-black"
                  : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-900 hover:text-neutral-950 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300 dark:hover:border-white dark:hover:text-white"
              )}
            >
              {copiedCli ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy Command</span>
                </>
              )}
            </button>
          </div>

          <div className="overflow-x-auto p-4 font-mono text-xs leading-relaxed sm:text-[13px]">
            <span className="mr-2 select-none text-neutral-400 dark:text-neutral-600">
              $
            </span>
            <span className="text-neutral-900 dark:text-neutral-100">
              {cliCommands[pm]}
            </span>
          </div>
        </div>
      ) : (
        <div className="space-y-6 rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-[#0A0A0A] sm:p-6">
          <div className="space-y-2.5">
            <div className="flex items-center gap-2.5">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-900 font-mono text-xs font-semibold text-white dark:bg-white dark:text-black">
                1
              </span>
              <h4 className="text-sm font-semibold text-neutral-950 dark:text-white">
                Install required packages
              </h4>
            </div>
            <CodeViewer
              code={manualInstallCmd}
              filename="terminal"
              language="bash"
            />
          </div>

          {usesCnUtility && (
            <div className="space-y-2.5">
              <div className="flex items-center gap-2.5">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-900 font-mono text-xs font-semibold text-white dark:bg-white dark:text-black">
                  2
                </span>
                <h4 className="text-sm font-semibold text-neutral-950 dark:text-white">
                  Add the <code className="font-mono">cn()</code> helper in{" "}
                  <code className="font-mono text-xs text-neutral-500">
                    src/lib/utils.ts
                  </code>
                </h4>
              </div>
              <CodeViewer
                code={UTILS_SNIPPET}
                filename="src/lib/utils.ts"
                language="ts"
              />
            </div>
          )}

          <div className="space-y-2.5">
            <div className="flex items-center gap-2.5">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-900 font-mono text-xs font-semibold text-white dark:bg-white dark:text-black">
                {usesCnUtility ? "3" : "2"}
              </span>
              <h4 className="text-sm font-semibold text-neutral-950 dark:text-white">
                Copy the component code
              </h4>
            </div>
            <CodeViewer
              code={sourceCode}
              filename={`src/components/ui/${slug}.tsx`}
              language="tsx"
              maxHeight="420px"
            />
          </div>
        </div>
      )}
    </div>
  );
}

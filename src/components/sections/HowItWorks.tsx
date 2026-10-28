"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Check,
  Copy,
  FileCode2,
  Feather,
  Terminal,
} from "lucide-react";
import { copyToClipboard } from "@/lib/utils";

type PkgManager = "npm" | "pnpm" | "bun";

const CLI_COMMANDS: Record<PkgManager, string> = {
  npm: "npx shadcn@latest add https://boseui.site/r/magnetic-button.json",
  pnpm: "pnpm dlx shadcn@latest add https://boseui.site/r/magnetic-button.json",
  bun: "bunx --bun shadcn@latest add https://boseui.site/r/magnetic-button.json",
};

const REGISTRY_ARTIFACTS = [
  { label: "Registry JSON", path: "/registry.json" },
  { label: "LLM Index", path: "/llms.txt" },
  { label: "Sitemap", path: "/sitemap.xml" },
];

export function HowItWorks() {
  const [pkg, setPkg] = useState<PkgManager>("npm");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = async (code: string, idx: number) => {
    const ok = await copyToClipboard(code);
    if (ok) {
      setCopiedIndex(idx);
      setTimeout(() => setCopiedIndex(null), 1800);
    }
  };

  const steps = [
    {
      step: "01",
      tag: "INSTALLATION",
      title: "One-Command Install",
      icon: Terminal,
      description:
        "Add any component directly into your React or Next.js project using your preferred package manager with zero runtime lock-in.",
      code: CLI_COMMANDS[pkg],
      isCli: true,
    },
    {
      step: "02",
      tag: "OWNERSHIP",
      title: "You Own the Code",
      icon: Feather,
      description:
        "The source code drops right into your codebase. Tweak Tailwind styles, Framer Motion spring curves, or TypeScript props however you like.",
      code: "src/components/ui/magnetic-button.tsx",
      isCli: false,
    },
    {
      step: "03",
      tag: "PIPELINE",
      title: "Deterministic Sync Pipeline",
      icon: FileCode2,
      description:
        "Build custom components with companion .meta.ts manifests, then run our CLI sync generator to publish docs, SEO, and JSON manifests automatically.",
      code: "npm run component:new TiltCard && npm run sync",
      isCli: false,
    },
  ];

  return (
    <section className="border-b border-neutral-200/80 bg-white dark:border-neutral-800 dark:bg-black">
      <div className="mx-auto max-w-[1280px] border-x border-neutral-200/80 dark:border-neutral-800">
        {/* Section Header */}
        <div className="flex flex-col justify-between gap-6 border-b border-neutral-200/80 px-5 py-14 dark:border-neutral-800 sm:flex-row sm:items-end sm:px-8 sm:py-16">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-neutral-950 dark:text-white sm:text-4xl">
              Simple to install. Easy to edit.
            </h2>
            <p className="mt-2.5 max-w-xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 sm:text-base">
              Every component is built with Framer Motion, Tailwind CSS, and
              TypeScript—no complex setup or extra dependencies required.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {REGISTRY_ARTIFACTS.map((artifact) => (
              <Link
                key={artifact.path}
                href={artifact.path}
                className="inline-flex items-center gap-1 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 font-mono text-[11px] text-neutral-600 transition-colors hover:border-neutral-900 hover:text-neutral-950 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:border-white dark:hover:text-white"
              >
                <span>{artifact.path}</span>
                <ArrowUpRight className="h-3 w-3" />
              </Link>
            ))}
          </div>
        </div>

        {/* 3-Column Process Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3">
          {steps.map((card, idx) => {
            const Icon = card.icon;
            const isCopied = copiedIndex === idx;
            return (
              <div
                key={card.step}
                className={`flex flex-col justify-between gap-8 p-6 sm:p-8 ${
                  idx !== steps.length - 1
                    ? "border-b border-neutral-200/80 dark:border-neutral-800 md:border-b-0 md:border-r"
                    : ""
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-200/80 bg-neutral-50 text-neutral-950 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white">
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="rounded bg-neutral-100 px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-neutral-600 dark:bg-neutral-900 dark:text-neutral-400">
                      {card.tag}
                    </span>
                  </div>

                  <h3 className="mt-5 text-lg font-semibold tracking-tight text-neutral-950 dark:text-white">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400 sm:text-sm">
                    {card.description}
                  </p>
                </div>

                <div>
                  {card.isCli && (
                    <div className="mb-2 flex items-center gap-1">
                      {(["npm", "pnpm", "bun"] as PkgManager[]).map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setPkg(p)}
                          className={`rounded px-2 py-0.5 font-mono text-[10px] font-medium transition-colors ${
                            pkg === p
                              ? "bg-neutral-950 text-white dark:bg-white dark:text-black font-semibold"
                              : "text-neutral-500 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white"
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-2 rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 font-mono text-[11px] text-neutral-800 dark:border-neutral-800 dark:bg-neutral-900/60 dark:text-neutral-300">
                    <span className="truncate">{card.code}</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(card.code, idx)}
                      aria-label={`Copy ${card.title} snippet`}
                      className="shrink-0 cursor-pointer rounded-md p-1 text-neutral-400 transition-colors hover:bg-neutral-200/70 hover:text-neutral-950 dark:hover:bg-neutral-800 dark:hover:text-white"
                    >
                      {isCopied ? (
                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

"use client";

import React, { useState } from "react";
import {
  BookOpen,
  ArrowRight,
  ArrowLeft,
  Copy,
  Check,
} from "lucide-react";
import { FileTree, FileTreeNode } from "@/components/ui/FileTree";
import { CommandMenu } from "@/components/ui/CommandMenu";
import { cn } from "@/lib/utils";

export interface DocsLayoutBlockProps {
  pageTitle?: string;
  category?: string;
  className?: string;
}

const DOCS_TREE: FileTreeNode[] = [
  {
    id: "getting-started",
    name: "getting-started",
    type: "folder",
    children: [
      { id: "intro", name: "introduction.mdx", type: "file", badge: "DOC" },
      { id: "install", name: "installation.mdx", type: "file", badge: "CLI" },
      { id: "tokens", name: "theming.mdx", type: "file", badge: "CSS" },
    ],
  },
  {
    id: "components",
    name: "components",
    type: "folder",
    children: [
      { id: "buttons", name: "buttons.mdx", type: "file", badge: "UI" },
      { id: "cards", name: "cards.mdx", type: "file", badge: "UI" },
      { id: "shaders", name: "background-shaders.mdx", type: "file", badge: "GL" },
      { id: "blocks", name: "composite-blocks.mdx", type: "file", badge: "26" },
    ],
  },
];

const CLI_COMMANDS: Record<string, string> = {
  npx: "npx boseui@latest add cosmic-launch-hero",
  pnpm: "pnpm dlx boseui@latest add cosmic-launch-hero",
  bun: "bunx boseui@latest add cosmic-launch-hero",
};

const USAGE_CODE = `import { CosmicLaunchHero } from "@/components/blocks/CosmicLaunchHero";

export default function LandingPage() {
  return (
    <main className="w-full min-h-screen bg-black">
      <CosmicLaunchHero
        headline="Launch at the speed of thought"
        tagline="Production-grade kinetic interfaces designed for scale."
      />
    </main>
  );
}`;

export function DocsLayoutBlock({
  pageTitle = "Cosmic Launch Hero Block",
  category = "Composite Blocks // Landing",
  className,
}: DocsLayoutBlockProps) {
  const [selectedDoc, setSelectedDoc] = useState(pageTitle);
  const [cliTab, setCliTab] = useState<"npx" | "pnpm" | "bun">("npx");
  const [copiedCli, setCopiedCli] = useState(false);
  const [copiedUsage, setCopiedUsage] = useState(false);

  const handleCopyCli = () => {
    navigator.clipboard?.writeText(CLI_COMMANDS[cliTab]);
    setCopiedCli(true);
    setTimeout(() => setCopiedCli(false), 2000);
  };

  const handleCopyUsage = () => {
    navigator.clipboard?.writeText(USAGE_CODE);
    setCopiedUsage(true);
    setTimeout(() => setCopiedUsage(false), 2000);
  };

  return (
    <div
      data-fullscreen-scroll
      className={cn(
        "relative w-full min-h-[760px] overflow-hidden rounded-3xl bg-[#090b14] text-white border border-neutral-800 shadow-2xl flex flex-col",
        className
      )}
    >
      {/* Pinned SubNav Header */}
      <div className="rounded-t-3xl border-b border-neutral-800 bg-neutral-950/90 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-sm tracking-tight text-white">BoseUI Documentation</span>
          <span className="rounded-full bg-cyan-500/15 border border-cyan-500/30 px-2 py-0.5 text-[11px] font-mono text-cyan-400">
            v2.4 LTS
          </span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-xs text-neutral-400 font-medium">
          <span className="text-white hover:text-cyan-400 transition-colors cursor-pointer">Quickstart</span>
          <span className="hover:text-white transition-colors cursor-pointer">Installation</span>
          <span className="hover:text-white transition-colors cursor-pointer">Props API</span>
          <span className="hover:text-white transition-colors cursor-pointer">Accessibility</span>
        </div>
        <button
          type="button"
          className="rounded-lg bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 px-3 py-1.5 text-xs font-medium text-neutral-200 transition-colors"
        >
          Feedback
        </button>
      </div>

      {/* Main Documentation Body */}
      <div className="relative flex flex-1 flex-col lg:flex-row overflow-hidden">
        {/* Left Sidebar: Documentation Hierarchy */}
        <div className="w-full lg:w-72 border-b lg:border-b-0 lg:border-r border-neutral-800/80 bg-neutral-950/60 p-4">
          <div className="mb-4">
            <CommandMenu
              placeholder="Search documentation (⌘K)..."
              triggerLabel="Search Docs"
              enableGlobalShortcut={false}
              className="w-full"
            />
          </div>

          <div className="text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2 px-1">
            Documentation Tree
          </div>

          <FileTree
            data={DOCS_TREE}
            searchable={false}
            onSelect={(node) => setSelectedDoc(node.name)}
            className="border-0 bg-transparent p-0"
          />
        </div>

        {/* Center Main Content Article */}
        <div className="relative flex-1 p-6 lg:p-10 overflow-y-auto space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 mb-2">
              <BookOpen className="h-3.5 w-3.5" />
              <span>{category}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              {selectedDoc || pageTitle}
            </h1>

            <p className="mt-2 text-sm sm:text-base text-neutral-400 max-w-2xl leading-relaxed">
              A high-impact landing page hero block featuring a starfield canvas, shimmering headline,
              magnetic button actions, copyable install terminal, and social-proof avatar metrics.
            </p>
          </div>

          {/* Quick CLI Installation Snippet */}
          <div className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-400 font-mono">
              CLI Installation
            </h2>
            <div className="rounded-xl border border-neutral-800 bg-neutral-900/90 overflow-hidden">
              <div className="flex items-center justify-between border-b border-neutral-800 bg-neutral-950/70 px-3 py-2">
                <div className="flex gap-1">
                  {(["npx", "pnpm", "bun"] as const).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setCliTab(tab)}
                      className={cn(
                        "rounded px-2.5 py-1 text-xs font-mono transition-colors",
                        cliTab === tab
                          ? "bg-neutral-800 text-white font-medium"
                          : "text-neutral-400 hover:text-neutral-200"
                      )}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={handleCopyCli}
                  className="rounded p-1 text-neutral-400 hover:text-white transition-colors"
                  title="Copy command"
                >
                  {copiedCli ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
              <pre className="p-3.5 font-mono text-xs text-neutral-300 overflow-x-auto">
                <code>{CLI_COMMANDS[cliTab]}</code>
              </pre>
            </div>
          </div>

          {/* Component Usage Example */}
          <div className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-400 font-mono">
              Usage
            </h2>
            <div className="rounded-xl border border-neutral-800 bg-neutral-900/90 overflow-hidden">
              <div className="flex items-center justify-between border-b border-neutral-800 bg-neutral-950/70 px-4 py-2">
                <span className="font-mono text-xs text-neutral-400">page.tsx</span>
                <button
                  type="button"
                  onClick={handleCopyUsage}
                  className="rounded p-1 text-neutral-400 hover:text-white transition-colors"
                  title="Copy code"
                >
                  {copiedUsage ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
              <pre className="p-4 font-mono text-xs leading-relaxed text-neutral-300 overflow-x-auto">
                <code>{USAGE_CODE}</code>
              </pre>
            </div>
          </div>

          {/* Pagination Navigation Footer */}
          <div className="pt-8 border-t border-neutral-800 flex items-center justify-between">
            <a
              href="#"
              className="inline-flex items-center gap-2 text-xs font-mono text-neutral-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Previous: Buttons</span>
            </a>

            <a
              href="#"
              className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              <span>Next: ProductRevealSection</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DocsLayoutBlock;

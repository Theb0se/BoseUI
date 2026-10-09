"use client";

import React, { useState } from "react";
import {
  BookOpen,
  ArrowRight,
  ArrowLeft,
  Terminal,
  CheckCircle2,
  Code2,
  Sparkles,
  Search,
} from "lucide-react";
import { FileTree, FileTreeNode } from "@/components/ui/FileTree";
import { StickySubNav } from "@/components/ui/StickySubNav";
import { CopyCodeBlock } from "@/components/ui/CopyCodeBlock";
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

export function DocsLayoutBlock({
  pageTitle = "Cosmic Launch Hero Block",
  category = "Composite Blocks // Landing",
  className,
}: DocsLayoutBlockProps) {
  const [selectedDoc, setSelectedDoc] = useState(pageTitle);

  return (
    <div
      data-fullscreen-scroll
      className={cn(
        "relative w-full min-h-[760px] overflow-hidden rounded-3xl bg-[#090b14] text-white border border-neutral-800 shadow-2xl flex flex-col",
        className
      )}
    >
      {/* Pinned SubNav Header */}
      <StickySubNav
        productTitle="BoseUI Documentation"
        priceLabel="v2.4 LTS"
        ctaLabel="Feedback"
        links={[
          { id: "quickstart", label: "Quickstart" },
          { id: "installation", label: "Installation" },
          { id: "props", label: "Props API" },
          { id: "accessibility", label: "Accessibility" },
        ]}
        className="rounded-t-3xl border-b border-neutral-800 bg-neutral-950/90"
      />

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
              {pageTitle}
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
            <CopyCodeBlock
              tabs={[
                {
                  id: "npx",
                  label: "npx",
                  code: "npx boseui@latest add cosmic-launch-hero",
                  language: "bash",
                },
                {
                  id: "pnpm",
                  label: "pnpm",
                  code: "pnpm dlx boseui@latest add cosmic-launch-hero",
                  language: "bash",
                },
                {
                  id: "bun",
                  label: "bun",
                  code: "bunx boseui@latest add cosmic-launch-hero",
                  language: "bash",
                },
              ]}
              className="border-neutral-800 bg-neutral-900/90"
            />
          </div>

          {/* Component Usage Example */}
          <div className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-400 font-mono">
              Usage
            </h2>
            <CopyCodeBlock
              title="page.tsx"
              showLineNumbers={true}
              code={`import { CosmicLaunchHero } from "@/components/ui/CosmicLaunchHero";

export default function LandingPage() {
  return (
    <main className="w-full min-h-screen bg-black">
      <CosmicLaunchHero
        headline="Launch at the speed of thought"
        tagline="Production-grade kinetic interfaces designed for scale."
      />
    </main>
  );
}`}
              className="border-neutral-800 bg-neutral-900/90"
            />
          </div>

          {/* Pagination Navigation Footer */}
          <div className="pt-8 border-t border-neutral-800 flex items-center justify-between">
            <a
              href="#"
              className="inline-flex items-center gap-2 text-xs font-mono text-neutral-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Previous: StickySubNav</span>
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

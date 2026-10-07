import type { Metadata } from "next";
import Link from "next/link";
import { Terminal, Layers, Cpu, ArrowRight } from "lucide-react";
import { CodeViewer } from "@/components/docs/CodeViewer";
import { SITE_CONFIG } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Documentation & CLI Guide",
  description:
    "Getting started with BoseUI, the Two-File Contribution Workflow, and shadcn CLI installation.",
};

const SHADCN_INSTALL_SNIPPET = `# Install any BoseUI component directly via the official shadcn CLI:
npx shadcn@latest add https://boseui.site/r/magnetic-button.json
npx shadcn@latest add https://boseui.site/r/spotlight-card.json
npx shadcn@latest add https://boseui.site/r/cursor-follower.json`;

const TWO_FILE_WORKFLOW_CODE = `# 1. Scaffold a new component + metadata pair in src/components/ui/
npm run component:new TiltCard

# 2. Edit your two files:
#    - src/components/ui/TiltCard.tsx      (Pure reusable component)
#    - src/components/ui/TiltCard.meta.ts  (Structured metadata)

# 3. Run the automated sync pipeline
npm run sync`;

const UTILS_CODE = `import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}`;

export default function DocsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-8 lg:py-12">
      {/* Header */}
      <div className="border-b border-neutral-200 pb-8 dark:border-[#1F1F1F]">
        <h1 className="text-3xl font-bold tracking-tight text-black dark:text-white sm:text-4xl">
          Documentation
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 sm:text-base">
          BoseUI is an open-source kinetic React component library crafted by{" "}
          <a
            href={SITE_CONFIG.author.portfolio}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-black underline underline-offset-4 dark:text-white"
          >
            Rishabh Bose
          </a>
          . Install components via the official{" "}
          <code className="rounded border border-neutral-200 bg-neutral-100 px-1.5 py-0.5 font-mono text-xs text-black dark:border-[#262626] dark:bg-[#0A0A0A] dark:text-white">
            shadcn
          </code>{" "}
          CLI or copy source files directly.
        </p>
      </div>

      <div className="mt-10 space-y-12">
        {/* Section 1: Quick Start with shadcn CLI */}
        <section className="space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-black text-white dark:bg-white dark:text-black">
              <Terminal className="h-4 w-4" />
            </div>
            <h2 className="text-lg font-bold text-black dark:text-white">
              1. CLI Installation
            </h2>
          </div>

          <CodeViewer
            code={SHADCN_INSTALL_SNIPPET}
            filename="terminal"
            language="bash"
          />
        </section>

        {/* Section 2: Manual Setup & cn() utility */}
        <section className="space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-black text-white dark:bg-white dark:text-black">
              <Layers className="h-4 w-4" />
            </div>
            <h2 className="text-lg font-bold text-black dark:text-white">
              2. Utility Setup (`src/lib/utils.ts`)
            </h2>
          </div>

          <CodeViewer
            code={UTILS_CODE}
            filename="src/lib/utils.ts"
            language="ts"
          />
        </section>

        {/* Section 3: The Two-File Contribution Workflow */}
        <section className="space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-black text-white dark:bg-white dark:text-black">
              <Cpu className="h-4 w-4" />
            </div>
            <h2 className="text-lg font-bold text-black dark:text-white">
              3. Adding New Components (`npm run sync`)
            </h2>
          </div>

          <CodeViewer
            code={TWO_FILE_WORKFLOW_CODE}
            filename="terminal"
            language="bash"
          />
        </section>

        {/* Bottom CTA */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-neutral-200 bg-neutral-50 p-6 dark:border-[#222222] dark:bg-[#0A0A0A]">
          <div>
            <h3 className="text-sm font-semibold text-black dark:text-white">
              Explore Components
            </h3>
            <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">
              Interact with live spring physics and inspect component props.
            </p>
          </div>
          <Link
            href="/components"
            className="inline-flex items-center gap-2 rounded-xl bg-black px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
          >
            <span>Browse Components</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

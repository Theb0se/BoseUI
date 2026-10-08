import type { Metadata } from "next";
import Link from "next/link";
import { Terminal, Layers, Cpu, ArrowRight } from "lucide-react";
import { CodeViewer } from "@/components/docs/CodeViewer";
import { SITE_CONFIG } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Documentation & CLI Guide",
  description:
    "How to install and use BoseUI components with the shadcn CLI or manual copy-paste.",
  alternates: {
    canonical: `${SITE_CONFIG.url}/docs`,
  },
  openGraph: {
    title: `Documentation & CLI Guide · ${SITE_CONFIG.name}`,
    description:
      "How to install and use BoseUI components with the shadcn CLI or manual copy-paste.",
    url: `${SITE_CONFIG.url}/docs`,
    siteName: SITE_CONFIG.name,
    type: "article",
    images: [
      {
        url: SITE_CONFIG.ogImage,
        width: 1200,
        height: 630,
        alt: `${SITE_CONFIG.name} Documentation & CLI Guide`,
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Documentation & CLI Guide · ${SITE_CONFIG.name}`,
    description:
      "How to install and use BoseUI components with the shadcn CLI or manual copy-paste.",
    creator: "@Theb0se",
    images: [SITE_CONFIG.ogImage],
  },
};

const SHADCN_INSTALL_SNIPPET = `# Install any BoseUI component directly via the official shadcn CLI:
npx shadcn@latest add "${SITE_CONFIG.url}/r/drawer.json"
npx shadcn@latest add "${SITE_CONFIG.url}/r/autocomplete.json"
npx shadcn@latest add "${SITE_CONFIG.url}/r/toast-stack.json"`;

const TWO_FILE_WORKFLOW_CODE = `# 1. Create a new component + metadata pair in src/components/ui/
npm run component:new TiltCard

# 2. Edit your two files:
#    - src/components/ui/TiltCard.tsx      (Component code)
#    - src/components/ui/TiltCard.meta.ts  (Title, description, props)

# 3. Sync the catalog and registry JSON files
npm run sync`;

const UTILS_CODE = `import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}`;

export default function DocsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-8 lg:py-12">
      {/* Header */}
      <div className="border-b border-neutral-200 pb-8 dark:border-neutral-900">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-950 dark:text-white sm:text-4xl">
          Documentation
        </h1>
        <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 sm:text-[15px]">
          BoseUI is an open-source React component library built with Framer
          Motion, Tailwind CSS, and TypeScript by{" "}
          <a
            href={SITE_CONFIG.author.portfolio}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-neutral-950 underline underline-offset-4 dark:text-white"
          >
            Rishabh Bose
          </a>
          . Install components in seconds using the{" "}
          <code className="rounded border border-neutral-200 bg-neutral-100 px-1.5 py-0.5 font-mono text-xs text-neutral-900 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white">
            shadcn
          </code>{" "}
          CLI or copy the source code directly into your project.
        </p>
      </div>

      <div className="mt-10 space-y-10">
        {/* Section 1: Quick Start with shadcn CLI */}
        <section className="space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-black">
              <Terminal className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-neutral-950 dark:text-white">
                1. Install with CLI
              </h2>
            </div>
          </div>
          <p className="text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
            Run the command below in your React or Next.js project to download the component and its dependencies automatically:
          </p>

          <CodeViewer
            code={SHADCN_INSTALL_SNIPPET}
            filename="terminal"
            language="bash"
          />
        </section>

        {/* Section 2: Manual Setup & cn() utility */}
        <section className="space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-black">
              <Layers className="h-4 w-4" />
            </div>
            <h2 className="text-base font-semibold text-neutral-950 dark:text-white">
              2. Manual Setup (<code className="font-mono text-xs">src/lib/utils.ts</code>)
            </h2>
          </div>
          <p className="text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
            If you prefer copying code manually instead of using the CLI, add this <code className="font-mono">cn()</code> helper for merging Tailwind classes:
          </p>

          <CodeViewer
            code={UTILS_CODE}
            filename="src/lib/utils.ts"
            language="ts"
          />
        </section>

        {/* Section 3: The Two-File Contribution Workflow */}
        <section className="space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-black">
              <Cpu className="h-4 w-4" />
            </div>
            <h2 className="text-base font-semibold text-neutral-950 dark:text-white">
              3. Contributing a Component
            </h2>
          </div>
          <p className="text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
            Every component consists of two files in <code className="font-mono">src/components/ui/</code>: the component (<code className="font-mono">.tsx</code>) and its metadata (<code className="font-mono">.meta.ts</code>).
          </p>

          <CodeViewer
            code={TWO_FILE_WORKFLOW_CODE}
            filename="terminal"
            language="bash"
          />
        </section>

        {/* Bottom CTA */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-neutral-200 bg-neutral-50/70 p-6 dark:border-neutral-800 dark:bg-[#0A0A0A]">
          <div>
            <h3 className="text-sm font-semibold text-neutral-950 dark:text-white">
              Ready to explore?
            </h3>
            <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">
              Try every component live and copy the code in one click.
            </p>
          </div>
          <Link
            href="/components"
            className="inline-flex items-center gap-2 rounded-xl bg-neutral-900 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
          >
            <span>Browse Components</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

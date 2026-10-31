"use client";

import React, { useState } from "react";
import { Check, Copy } from "lucide-react";
import { copyToClipboard } from "@/lib/utils";

const CODE_EXAMPLE = `# 1. Run the install command
npx shadcn@latest add https://boseui.site/r/magnetic-button.json

# 2. Import into your React component
import { MagneticButton } from "@/components/ui/magnetic-button";

export default function Demo() {
  return <MagneticButton>Click me</MagneticButton>;
}`;

export function HowItWorksSection() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(CODE_EXAMPLE);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section>
      <div className="border-b border-neutral-200 pb-3 dark:border-neutral-800">
        <h2 className="text-lg font-semibold tracking-tight text-neutral-950 dark:text-white">
          How it works
        </h2>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center">
        {/* Left: 3 steps, plain */}
        <div className="flex flex-col gap-6">
          <div className="flex gap-3.5">
            <span className="font-mono text-xs font-medium text-neutral-400 dark:text-neutral-600">
              1.
            </span>
            <div>
              <h3 className="text-sm font-semibold text-neutral-950 dark:text-white">
                Run the install command.
              </h3>
              <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Add any component directly using the shadcn CLI with your preferred package manager.
              </p>
            </div>
          </div>

          <div className="flex gap-3.5">
            <span className="font-mono text-xs font-medium text-neutral-400 dark:text-neutral-600">
              2.
            </span>
            <div>
              <h3 className="text-sm font-semibold text-neutral-950 dark:text-white">
                The component file lands in your project.
              </h3>
              <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                The full TypeScript source code and Tailwind classes are saved in your components directory.
              </p>
            </div>
          </div>

          <div className="flex gap-3.5">
            <span className="font-mono text-xs font-medium text-neutral-400 dark:text-neutral-600">
              3.
            </span>
            <div>
              <h3 className="text-sm font-semibold text-neutral-950 dark:text-white">
                Edit it however you like.
              </h3>
              <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Customize styles, animation springs, or props. You own the code with no runtime package dependency.
              </p>
            </div>
          </div>
        </div>

        {/* Right: Code block showing real command and resulting import */}
        <div className="rounded-md border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950">
          <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-2 text-[11px] text-neutral-500 dark:border-neutral-800">
            <span className="font-mono">terminal &amp; react</span>
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1 hover:text-neutral-950 dark:hover:text-white transition-colors"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-emerald-600 dark:text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
          <div className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-neutral-800 dark:text-neutral-200">
            <pre>
              <code>{CODE_EXAMPLE}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}

import React from "react";
import Link from "next/link";
import { ArrowLeft, Layers } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[65vh] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="relative max-w-md overflow-hidden rounded-3xl border border-neutral-200/90 bg-white p-8 shadow-sm dark:border-neutral-800 dark:bg-[#0A0A0A]">
        {/* Subtle dot matrix background */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-dot-matrix opacity-40 [background-size:16px_16px]"
        />

        <div className="relative z-10 flex flex-col items-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 shadow-2xs">
            <Layers className="h-5 w-5 text-neutral-400" />
          </div>

          <span className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-100 px-2.5 py-0.5 font-mono text-[10px] font-medium text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
            404 · NOT FOUND
          </span>

          <h2 className="mt-3 text-xl font-bold tracking-tight text-neutral-950 dark:text-white">
            Surface Not Found
          </h2>

          <p className="mt-2 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
            The component or documentation route you requested could not be found in the BoseUI registry.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <Link
              href="/components"
              className="inline-flex items-center gap-2 rounded-xl bg-neutral-950 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 shadow-2xs"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Browse Components</span>
            </Link>

            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-xs font-medium text-neutral-700 transition-colors hover:border-neutral-900 hover:text-neutral-950 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-white dark:hover:text-white"
            >
              <span>Back Home</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

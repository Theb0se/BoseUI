import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="max-w-md rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm dark:border-[#222222] dark:bg-[#0A0A0A]">
        <div className="font-mono text-xs font-semibold uppercase tracking-widest text-neutral-400">
          404 // NOT_FOUND
        </div>
        <h2 className="mt-2 text-xl font-bold text-black dark:text-white">
          Surface Not Found
        </h2>
        <p className="mt-2 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
          The component or documentation page you requested does not exist in the registry.
        </p>
        <Link
          href="/components"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-black px-4 py-2.5 text-xs font-semibold text-white transition-opacity hover:opacity-90 dark:bg-white dark:text-black"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Browse Components</span>
        </Link>
      </div>
    </div>
  );
}

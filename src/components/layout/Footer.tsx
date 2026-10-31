import React from "react";
import Link from "next/link";
import Image from "next/image";
import { SITE_CONFIG } from "@/lib/utils";

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-white dark:border-neutral-800 dark:bg-black py-8">
      <div className="mx-auto flex max-w-[1100px] flex-col items-start justify-between gap-4 px-4 text-xs text-neutral-500 dark:text-neutral-400 sm:flex-row sm:items-center sm:px-6">
        {/* Left: Logo + short description */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/"
            className="flex items-center gap-2 font-semibold text-neutral-950 transition-colors hover:text-neutral-700 dark:text-white dark:hover:text-neutral-300"
          >
            <Image
              src="/boseui-logo.png"
              alt="BoseUI"
              width={18}
              height={18}
              className="h-4 w-4 rounded object-contain dark:invert"
            />
            <span>BoseUI</span>
          </Link>
          <span className="text-neutral-300 dark:text-neutral-700">·</span>
          <span>React components with spring animations.</span>
        </div>

        {/* Right: Links + Made by attribution */}
        <div className="flex flex-wrap items-center gap-4">
          <Link
            href="/docs"
            className="transition-colors hover:text-neutral-950 dark:hover:text-white"
          >
            Docs
          </Link>
          <a
            href={SITE_CONFIG.author.repo}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-neutral-950 dark:hover:text-white"
          >
            GitHub
          </a>
          <Link
            href="/registry.json"
            className="font-mono text-[11px] transition-colors hover:text-neutral-950 dark:hover:text-white"
          >
            registry.json
          </Link>
          <Link
            href="/llms.txt"
            className="font-mono text-[11px] transition-colors hover:text-neutral-950 dark:hover:text-white"
          >
            llms.txt
          </Link>
          <span className="text-neutral-300 dark:text-neutral-700">·</span>
          <span>
            Made by{" "}
            <a
              href={SITE_CONFIG.author.portfolio}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-neutral-950 hover:underline dark:text-white"
            >
              Rishabh Bose
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}

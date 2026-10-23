import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Github, Linkedin, Globe } from "lucide-react";
import { SITE_CONFIG } from "@/lib/utils";
import { CATALOG_INDEX } from "@/registry/catalog-index";

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-white dark:border-[#1A1A1A] dark:bg-black">
      <div className="mx-auto max-w-[1280px] border-x border-neutral-200 px-5 py-14 dark:border-[#1A1A1A] sm:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          {/* Brand Column */}
          <div className="md:col-span-5">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-black dark:text-white"
            >
              <Image
                src="/boseui-logo.png"
                alt="BoseUI Logo"
                width={26}
                height={26}
                className="h-6 w-6 rounded-md object-contain dark:invert"
              />
              <span>BoseUI</span>
            </Link>

            <p className="mt-3 max-w-sm text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
              {SITE_CONFIG.tagline} Free, open-source, and ready to install with
              a single{" "}
              <code className="rounded border border-neutral-200 bg-neutral-100 px-1.5 py-0.5 font-mono text-[11px] text-black dark:border-[#262626] dark:bg-[#0A0A0A] dark:text-white">
                shadcn
              </code>{" "}
              command.
            </p>
          </div>

          {/* Components Column */}
          <div className="md:col-span-3">
            <h3 className="font-mono text-[11px] uppercase tracking-wider text-black dark:text-white">
              Components
            </h3>
            <ul className="mt-3 space-y-2 text-xs">
              {CATALOG_INDEX.slice(0, 5).map((comp) => (
                <li key={comp.slug}>
                  <Link
                    href={`/components/${comp.slug}`}
                    className="text-neutral-600 transition-colors hover:text-black dark:text-neutral-400 dark:hover:text-white"
                  >
                    {comp.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/components"
                  className="inline-flex items-center gap-1 font-mono text-[11px] text-black hover:underline dark:text-white"
                >
                  <span>All Components</span>
                  <ArrowUpRight className="h-3 w-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Column */}
          <div className="md:col-span-2">
            <h3 className="font-mono text-[11px] uppercase tracking-wider text-black dark:text-white">
              Resources
            </h3>
            <ul className="mt-3 space-y-2 text-xs">
              <li>
                <Link
                  href="/docs"
                  className="text-neutral-600 transition-colors hover:text-black dark:text-neutral-400 dark:hover:text-white"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="/docs/contributing"
                  className="text-neutral-600 transition-colors hover:text-black dark:text-neutral-400 dark:hover:text-white"
                >
                  Contributing Guide
                </Link>
              </li>
              <li>
                <Link
                  href="/registry.json"
                  className="font-mono text-[11px] text-neutral-600 transition-colors hover:text-black dark:text-neutral-400 dark:hover:text-white"
                >
                  /registry.json
                </Link>
              </li>
              <li>
                <Link
                  href="/llms.txt"
                  className="font-mono text-[11px] text-neutral-600 transition-colors hover:text-black dark:text-neutral-400 dark:hover:text-white"
                >
                  /llms.txt
                </Link>
              </li>
            </ul>
          </div>

          {/* Creator Attribution Column */}
          <div className="md:col-span-2">
            <h3 className="font-mono text-[11px] uppercase tracking-wider text-black dark:text-white">
              Creator
            </h3>
            <ul className="mt-3 space-y-2 text-xs">
              <li>
                <a
                  href={SITE_CONFIG.author.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-neutral-600 transition-colors hover:text-black dark:text-neutral-400 dark:hover:text-white"
                >
                  <Globe className="h-3.5 w-3.5" />
                  <span>Portfolio</span>
                  <ArrowUpRight className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href={SITE_CONFIG.author.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-neutral-600 transition-colors hover:text-black dark:text-neutral-400 dark:hover:text-white"
                >
                  <Github className="h-3.5 w-3.5" />
                  <span>@Theb0se</span>
                  <ArrowUpRight className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href={SITE_CONFIG.author.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-neutral-600 transition-colors hover:text-black dark:text-neutral-400 dark:hover:text-white"
                >
                  <Linkedin className="h-3.5 w-3.5" />
                  <span>LinkedIn</span>
                  <ArrowUpRight className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Signature Bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-neutral-200 pt-6 text-xs text-neutral-500 dark:border-[#1F1F1F] sm:flex-row">
          <p className="text-neutral-600 dark:text-neutral-400">
            BoseUI — Crafted by{" "}
            <a
              href={SITE_CONFIG.author.portfolio}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-black underline underline-offset-4 hover:text-neutral-600 dark:text-white dark:hover:text-neutral-300"
            >
              Rishabh Bose
            </a>
          </p>
          <div className="flex items-center gap-4 font-mono text-[11px]">
            <span>BoseUI v2</span>
            <span>·</span>
            <span>MIT License</span>
            <span>·</span>
            <span>Next.js · Tailwind · Framer Motion</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

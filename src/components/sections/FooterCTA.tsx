"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Command } from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { useCommandPalette } from "@/components/layout/CommandPalette";

export function FooterCTA() {
  const { openPalette } = useCommandPalette();

  return (
    <section className="bg-white dark:bg-black">
      <div className="relative mx-auto max-w-[1280px] border-x border-neutral-200 px-5 py-20 dark:border-[#1A1A1A] sm:px-8 sm:py-24">
        <div className="relative overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-50/70 p-8 dark:border-[#222222] dark:bg-[#060606] sm:p-14">
          {/* Subtle dot matrix backdrop */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-dot-matrix opacity-60 [background-size:18px_18px] [mask-image:radial-gradient(ellipse_70%_70%_at_80%_50%,black_20%,transparent_100%)]"
          />

          <div className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-xl">
              <div className="font-mono text-[11px] uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
                // READY TO SHIP
              </div>
              <h2 className="mt-2.5 text-balance text-2xl font-semibold tracking-[-0.035em] text-black dark:text-white sm:text-4xl">
                Start building interfaces that feel alive.
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 sm:text-base">
                Free, MIT-licensed, and ready to drop into your Next.js or React
                codebase in seconds.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link href="/components">
                <MagneticButton variant="primary" size="lg" strength={0.3}>
                  <span>Browse Components</span>
                  <ArrowRight className="h-4 w-4" />
                </MagneticButton>
              </Link>

              <Link href="/docs">
                <MagneticButton variant="secondary" size="lg" strength={0.22}>
                  <BookOpen className="h-4 w-4" />
                  <span>Documentation</span>
                </MagneticButton>
              </Link>

              <button
                type="button"
                onClick={openPalette}
                className="inline-flex h-[46px] cursor-pointer items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 font-mono text-xs text-neutral-600 transition-colors hover:border-black hover:text-black dark:border-[#262626] dark:bg-[#0C0C0C] dark:text-neutral-400 dark:hover:border-white dark:hover:text-white"
              >
                <Command className="h-3.5 w-3.5" />
                <span>⌘K</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

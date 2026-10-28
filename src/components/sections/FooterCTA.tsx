"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Command } from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { MovingGridLines } from "@/components/ui/MovingGridLines";
import { useCommandPalette } from "@/components/layout/CommandPalette";

export function FooterCTA() {
  const { openPalette } = useCommandPalette();

  return (
    <section className="bg-white dark:bg-black">
      <div className="relative mx-auto max-w-[1280px] border-x border-neutral-200/80 px-5 py-16 dark:border-neutral-800 sm:px-8 sm:py-24">
        <div className="relative overflow-hidden rounded-3xl border border-neutral-200/90 bg-neutral-50/70 p-8 shadow-sm dark:border-neutral-800 dark:bg-[#060606] sm:p-14">
          {/* Subtle kinetic grid background */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-40 dark:opacity-60"
          >
            <MovingGridLines
              gridSize={48}
              beamCount={4}
              beamLength={140}
              speed={0.4}
              radialMask={true}
              className="absolute inset-0 h-full w-full"
            />
          </div>

          <div className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-xl">
              <h2 className="text-balance text-2xl font-bold tracking-tight text-neutral-950 dark:text-white sm:text-4xl">
                Start building interfaces that feel alive.
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 sm:text-base">
                Free, MIT-licensed, and ready to drop into your Next.js or React
                codebase in seconds with zero runtime lock-in.
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
                aria-label="Search components command palette"
                className="inline-flex h-[46px] cursor-pointer items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 font-mono text-xs text-neutral-700 shadow-2xs transition-colors hover:border-neutral-900 hover:text-neutral-950 dark:border-neutral-800 dark:bg-neutral-900/80 dark:text-neutral-300 dark:hover:border-white dark:hover:text-white"
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

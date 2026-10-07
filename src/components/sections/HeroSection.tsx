"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Command,
  Copy,
  Terminal,
} from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { useCommandPalette } from "@/components/layout/CommandPalette";
import { copyToClipboard, SITE_CONFIG } from "@/lib/utils";
import { PULSE_COMPONENTS } from "@/registry/generated-catalog";

const QUICK_SLUGS = [
  { slug: "magnetic-button", label: "magnetic-button" },
  { slug: "spotlight-card", label: "spotlight-card" },
  { slug: "split-button", label: "split-button" },
  { slug: "cursor-follower", label: "cursor-follower" },
];

const SPECS = [
  {
    index: "01",
    tag: "FRAMER MOTION",
    title: "Smooth Animations",
    text: "Built with Framer Motion so every hover, click, and transition feels smooth and natural out of the box.",
  },
  {
    index: "02",
    tag: "TAILWIND & TS",
    title: "Easy to Customize",
    text: "Written in clean TypeScript and styled with Tailwind CSS. Edit colors, sizes, or styles right in your code.",
  },
  {
    index: "03",
    tag: "SHADCN CLI",
    title: "One-Command Setup",
    text: "Run a single npx shadcn command to copy the component directly into your project—no extra packages to manage.",
  },
  {
    index: "04",
    tag: "READY FOR PROD",
    title: "Accessible & Responsive",
    text: "Supports keyboard navigation, screen readers, reduced motion, and both Light and Dark mode by default.",
  },
];

function Crosshair({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute z-10 flex h-3 w-3 items-center justify-center text-neutral-300 dark:text-neutral-700 ${className}`}
    >
      <span className="absolute h-px w-3 bg-current" />
      <span className="absolute h-3 w-px bg-current" />
    </span>
  );
}

export function HeroSection() {
  const [selectedSlug, setSelectedSlug] = useState(QUICK_SLUGS[0].slug);
  const [copied, setCopied] = useState(false);
  const { openPalette } = useCommandPalette();
  const reduceMotion = useReducedMotion();

  const cliCommand = `npx shadcn@latest add ${SITE_CONFIG.url}/r/${selectedSlug}.json`;

  const handleCopyCli = async () => {
    const ok = await copyToClipboard(cliCommand);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduceMotion ? 0 : 0.07 } },
  };
  const item: Variants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 14 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reduceMotion ? 0 : 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <section className="relative overflow-hidden border-b border-neutral-200 bg-white dark:border-[#1A1A1A] dark:bg-black">
      {/* Subtle architectural grid & top radial light */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-grid-pattern [background-size:64px_64px] [mask-image:radial-gradient(ellipse_65%_55%_at_50%_20%,black_25%,transparent_100%)]" />
        <div className="absolute left-1/2 top-0 h-[380px] w-[760px] -translate-x-1/2 rounded-full bg-neutral-200/50 blur-[130px] dark:bg-white/[0.055]" />
      </div>

      <div className="relative mx-auto max-w-[1280px] border-x border-neutral-200 dark:border-[#1A1A1A]">
        <Crosshair className="-left-[6px] top-6" />
        <Crosshair className="-right-[6px] top-6" />

        {/* Top status bar inside architectural frame */}
        <div className="flex items-center justify-between border-b border-neutral-200/80 px-5 py-3 font-mono text-[11px] text-neutral-500 dark:border-[#1A1A1A] dark:text-neutral-500 sm:px-8">
          <div className="flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-black dark:bg-white" />
            <span className="uppercase tracking-widest text-neutral-800 dark:text-neutral-300">
              BOSEUI v1.0
            </span>
            <span className="hidden text-neutral-300 dark:text-neutral-700 sm:inline">
              /
            </span>
            <span className="hidden sm:inline">
              {PULSE_COMPONENTS.length} COMPONENTS AVAILABLE
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden md:inline">FRAMER MOTION · TAILWIND CSS · TYPESCRIPT</span>
            <a
              href={SITE_CONFIG.author.portfolio}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-neutral-800 transition-colors hover:text-black dark:text-neutral-300 dark:hover:text-white"
            >
              <span>BY RISHABH BOSE</span>
              <ArrowUpRight className="h-3 w-3" />
            </a>
          </div>
        </div>

        {/* Main Hero Content */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-col items-center px-5 pb-20 pt-16 text-center sm:px-8 sm:pb-24 sm:pt-24"
        >
          {/* Eyebrow Pill */}
          <motion.div variants={item}>
            <Link
              href="/components"
              className="group inline-flex items-center gap-2.5 rounded-full border border-neutral-200 bg-neutral-50/90 py-1 pl-1.5 pr-3.5 text-xs font-medium text-neutral-600 transition-all hover:border-black hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:border-[#262626] dark:bg-[#0A0A0A] dark:text-neutral-400 dark:hover:border-white dark:hover:text-white dark:focus-visible:ring-white"
            >
              <span className="rounded-full bg-black px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-white dark:bg-white dark:text-black">
                Open Source
              </span>
              <span>Free React components — copy, paste, or install with CLI</span>
              <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </motion.div>

          {/* Editorial Display Headline */}
          <motion.h1
            variants={item}
            className="mt-8 max-w-4xl text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.045em] text-black dark:text-white sm:text-6xl lg:text-[72px]"
          >
            Modern React components{" "}
            <span className="text-neutral-400 dark:text-neutral-500">
              built to copy and ship.
            </span>
          </motion.h1>

          {/* Simple, Clear Subheadline */}
          <motion.p
            variants={item}
            className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-neutral-600 dark:text-neutral-400 sm:text-[17px]"
          >
            A clean collection of animated UI components built with{" "}
            <span className="font-medium text-black dark:text-white">
              Framer Motion
            </span>
            ,{" "}
            <span className="font-medium text-black dark:text-white">
              Tailwind CSS
            </span>
            , and{" "}
            <span className="font-medium text-black dark:text-white">
              TypeScript
            </span>
            . Install any component in one command and customize the code
            however you want.
          </motion.p>

          {/* Primary & Secondary Actions */}
          <motion.div
            variants={item}
            className="mt-9 flex flex-wrap items-center justify-center gap-3"
          >
            <Link href="/components">
              <MagneticButton variant="primary" size="lg" strength={0.3}>
                <span>Browse Components</span>
                <ArrowRight className="h-4 w-4" />
              </MagneticButton>
            </Link>

            <Link href="/docs">
              <MagneticButton variant="secondary" size="lg" strength={0.22}>
                <span>Documentation</span>
              </MagneticButton>
            </Link>

            <button
              type="button"
              onClick={openPalette}
              aria-label="Search components"
              className="inline-flex h-[46px] cursor-pointer items-center gap-2.5 rounded-xl border border-neutral-200 bg-white px-4 text-xs font-medium text-neutral-600 transition-colors hover:border-black hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:border-[#262626] dark:bg-[#0A0A0A] dark:text-neutral-400 dark:hover:border-white dark:hover:text-white dark:focus-visible:ring-white"
            >
              <Command className="h-3.5 w-3.5" />
              <span>Search</span>
              <kbd className="rounded border border-neutral-200 bg-neutral-50 px-1.5 py-0.5 font-mono text-[10px] text-neutral-500 dark:border-[#262626] dark:bg-[#141414] dark:text-neutral-400">
                ⌘K
              </kbd>
            </button>
          </motion.div>

          {/* Interactive CLI Bar */}
          <motion.div variants={item} className="mt-12 w-full max-w-2xl">
            <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50/80 shadow-[0_1px_2px_rgba(0,0,0,0.04)] backdrop-blur dark:border-[#222222] dark:bg-[#080808]">
              {/* Component selector tabs */}
              <div className="flex items-center justify-between border-b border-neutral-200/80 px-3 py-2 dark:border-[#1A1A1A]">
                <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                  {QUICK_SLUGS.map((itemSlug) => {
                    const active = selectedSlug === itemSlug.slug;
                    return (
                      <button
                        key={itemSlug.slug}
                        type="button"
                        onClick={() => setSelectedSlug(itemSlug.slug)}
                        className={`cursor-pointer rounded-lg px-2.5 py-1 font-mono text-[11px] transition-colors ${
                          active
                            ? "bg-black text-white dark:bg-white dark:text-black"
                            : "text-neutral-500 hover:text-black dark:text-neutral-500 dark:hover:text-white"
                        }`}
                      >
                        {itemSlug.label}
                      </button>
                    );
                  })}
                </div>
                <span className="hidden font-mono text-[10px] uppercase tracking-wider text-neutral-400 dark:text-neutral-600 sm:inline">
                  Quick Install
                </span>
              </div>

              {/* Command & Copy Button */}
              <div className="flex items-center justify-between gap-3 px-4 py-3.5">
                <div className="flex min-w-0 items-center gap-2.5 font-mono text-xs">
                  <Terminal className="h-3.5 w-3.5 shrink-0 text-neutral-400 dark:text-neutral-500" />
                  <span className="select-all truncate text-neutral-900 dark:text-neutral-200">
                    {cliCommand}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleCopyCli}
                  aria-label="Copy CLI install command"
                  className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 font-mono text-[11px] font-medium text-black transition-colors hover:border-black hover:bg-black hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:border-[#262626] dark:bg-[#121212] dark:text-white dark:hover:border-white dark:hover:bg-white dark:hover:text-black dark:focus-visible:ring-white"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
            <span className="sr-only" aria-live="polite">
              {copied ? "Install command copied to clipboard" : ""}
            </span>
          </motion.div>
        </motion.div>

        {/* Architectural 4-Column Feature Strip */}
        <div className="relative grid grid-cols-1 border-t border-neutral-200 bg-neutral-50/40 dark:border-[#1A1A1A] dark:bg-[#050505] sm:grid-cols-2 lg:grid-cols-4">
          <Crosshair className="-left-[6px] -top-[6px]" />
          <Crosshair className="-right-[6px] -top-[6px]" />

          {SPECS.map((spec, idx) => (
            <div
              key={spec.index}
              className={`group relative flex flex-col justify-between p-6 transition-colors hover:bg-neutral-100/60 dark:hover:bg-[#0B0B0B] sm:p-8 ${
                idx !== SPECS.length - 1
                  ? "border-b border-neutral-200 dark:border-[#1A1A1A] lg:border-b-0 lg:border-r"
                  : ""
              } ${idx % 2 === 0 ? "sm:border-r" : ""}`}
            >
              <div>
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span className="text-neutral-400 dark:text-neutral-600">
                    /{spec.index}
                  </span>
                  <span className="tracking-wider text-neutral-500 dark:text-neutral-500">
                    {spec.tag}
                  </span>
                </div>
                <h2 className="mt-5 text-base font-semibold tracking-tight text-black dark:text-white">
                  {spec.title}
                </h2>
                <p className="mt-2 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
                  {spec.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
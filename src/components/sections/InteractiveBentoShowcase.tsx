"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Check,
  Copy,
  Sparkles,
  Zap,
  MousePointerClick,
  Layers,
  Sliders,
  GitBranch,
} from "lucide-react";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { CursorFollower } from "@/components/ui/CursorFollower";
import { SplitButton } from "@/components/ui/SplitButton";
import { copyToClipboard, SITE_CONFIG } from "@/lib/utils";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 dark:focus-visible:ring-white dark:focus-visible:ring-offset-black";

type CardHeaderProps = {
  index: string;
  icon: React.ReactNode;
  name: string;
  category: string;
  slug: string;
  copiedSlug: string | null;
  onCopy: (slug: string) => void;
};

function CardHeader({
  index,
  icon,
  name,
  category,
  slug,
  copiedSlug,
  onCopy,
}: CardHeaderProps) {
  const copied = copiedSlug === slug;
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200/80 pb-4 dark:border-[#1A1A1A]">
      <div className="flex items-center gap-2.5">
        <span className="font-mono text-[11px] text-neutral-400 dark:text-neutral-600">
          /{index}
        </span>
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold tracking-tight text-black dark:text-white">
          {icon}
          <span>{name}</span>
        </span>
        <span className="hidden rounded border border-neutral-200 bg-neutral-100 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-neutral-500 dark:border-[#222222] dark:bg-[#111111] dark:text-neutral-400 sm:inline-block">
          {category}
        </span>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onCopy(slug)}
          aria-label={`Copy ${name} install command`}
          className={`inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-2.5 py-1 font-mono text-[11px] font-medium text-neutral-600 transition-colors hover:border-black hover:text-black dark:border-[#262626] dark:bg-[#0A0A0A] dark:text-neutral-400 dark:hover:border-white dark:hover:text-white ${focusRing}`}
        >
          {copied ? (
            <>
              <Check className="h-3 w-3" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              <span>Copy CLI</span>
            </>
          )}
        </button>
        <Link
          href={`/components/${slug}`}
          className={`inline-flex items-center gap-1 rounded-lg bg-black px-2.5 py-1 font-mono text-[11px] font-medium text-white transition-colors hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 ${focusRing}`}
        >
          <span>View Code</span>
          <ArrowUpRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}

export function InteractiveBentoShowcase() {
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [strength, setStrength] = useState(0.4);
  const [enableTilt, setEnableTilt] = useState(true);
  const [lastSplitAction, setLastSplitAction] = useState("Click the button or arrow");

  const handleCopySlug = async (slug: string) => {
    const cmd = `npx shadcn@latest add ${SITE_CONFIG.url}/r/${slug}.json`;
    const ok = await copyToClipboard(cmd);
    if (ok) {
      setCopiedSlug(slug);
      setTimeout(() => setCopiedSlug(null), 1800);
    }
  };

  return (
    <section className="border-b border-neutral-200 bg-white dark:border-[#1A1A1A] dark:bg-black">
      <div className="mx-auto max-w-[1280px] border-x border-neutral-200 dark:border-[#1A1A1A]">
        {/* Section Header */}
        <div className="flex flex-col justify-between gap-6 border-b border-neutral-200 px-5 py-14 dark:border-[#1A1A1A] sm:flex-row sm:items-end sm:px-8 sm:py-16">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
              // LIVE PREVIEW
            </div>
            <h2 className="mt-2 text-3xl font-semibold tracking-[-0.035em] text-black dark:text-white sm:text-4xl">
              Try the components right here.
            </h2>
            <p className="mt-2.5 max-w-xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 sm:text-base">
              Interact with each component below before adding it to your
              project. Click &ldquo;View Code&rdquo; to inspect the full
              TypeScript source and props.
            </p>
          </div>

          <Link
            href="/components"
            className={`inline-flex shrink-0 items-center gap-2 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-xs font-medium text-black transition-colors hover:border-black hover:bg-black hover:text-white dark:border-[#262626] dark:bg-[#0A0A0A] dark:text-white dark:hover:border-white dark:hover:bg-white dark:hover:text-black ${focusRing}`}
          >
            <span>All Components</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* 12-Column Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Cell 01: MagneticButton (7 cols) */}
          <div className="flex flex-col justify-between border-b border-neutral-200 p-5 dark:border-[#1A1A1A] sm:p-8 lg:col-span-7 lg:border-r">
            <CardHeader
              index="01"
              icon={<Zap className="h-3.5 w-3.5" />}
              name="MagneticButton"
              category="Buttons"
              slug="magnetic-button"
              copiedSlug={copiedSlug}
              onCopy={handleCopySlug}
            />

            <div className="relative my-6 flex min-h-[240px] flex-col items-center justify-center gap-7 overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50/50 bg-dot-matrix p-6 [background-size:18px_18px] dark:border-[#1F1F1F] dark:bg-[#050505]">
              <div className="flex flex-wrap items-center justify-center gap-3.5">
                <MagneticButton variant="primary" strength={strength}>
                  <Sparkles className="h-4 w-4" />
                  <span>Primary</span>
                </MagneticButton>

                <MagneticButton variant="secondary" strength={strength}>
                  <span>Secondary</span>
                </MagneticButton>

                <MagneticButton variant="outline" strength={strength}>
                  <span>Outline</span>
                </MagneticButton>
              </div>

              {/* Interactive Pull Slider */}
              <div className="flex items-center gap-3 rounded-full border border-neutral-200 bg-white px-4 py-2 text-xs shadow-sm dark:border-[#262626] dark:bg-[#0C0C0C]">
                <Sliders className="h-3.5 w-3.5 text-neutral-400" />
                <label
                  htmlFor="bento-strength-slider"
                  className="font-mono text-[11px] text-neutral-500 dark:text-neutral-400"
                >
                  Pull strength
                </label>
                <input
                  id="bento-strength-slider"
                  type="range"
                  min={0.15}
                  max={0.8}
                  step={0.05}
                  value={strength}
                  onChange={(e) => setStrength(parseFloat(e.target.value))}
                  aria-label="Magnetic pull strength"
                  className="h-1 w-24 cursor-pointer appearance-none rounded-lg bg-neutral-200 accent-black dark:bg-neutral-800 dark:accent-white"
                />
                <span className="w-8 text-right font-mono text-[11px] tabular-nums text-black dark:text-white">
                  {strength.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-neutral-500">
              <span>Smooth button that gently pulls toward your cursor on hover.</span>
              <span className="hidden font-mono text-[11px] text-neutral-400 sm:inline">
                Framer Motion
              </span>
            </div>
          </div>

          {/* Cell 02: SpotlightCard (5 cols) */}
          <div className="flex flex-col justify-between border-b border-neutral-200 p-5 dark:border-[#1A1A1A] sm:p-8 lg:col-span-5">
            <CardHeader
              index="02"
              icon={<Layers className="h-3.5 w-3.5" />}
              name="SpotlightCard"
              category="Cards"
              slug="spotlight-card"
              copiedSlug={copiedSlug}
              onCopy={handleCopySlug}
            />

            <div className="my-6 flex min-h-[240px] flex-col justify-center">
              <SpotlightCard enableTilt={enableTilt} className="p-6">
                <div className="flex items-center justify-between">
                  <span className="rounded-md border border-neutral-200 bg-neutral-100 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-black dark:border-[#262626] dark:bg-[#141414] dark:text-white">
                    Hover me
                  </span>
                  <button
                    type="button"
                    onClick={() => setEnableTilt((v) => !v)}
                    className="cursor-pointer rounded-md border border-neutral-200 px-2 py-1 font-mono text-[10px] text-neutral-500 transition-colors hover:border-black hover:text-black dark:border-[#262626] dark:hover:border-white dark:hover:text-white"
                  >
                    3D Tilt: {enableTilt ? "ON" : "OFF"}
                  </button>
                </div>
                <h3 className="mt-5 text-base font-semibold tracking-tight text-black dark:text-white">
                  Soft cursor spotlight &amp; border glow
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
                  Move your cursor over the card to see the spotlight follow your
                  mouse with an optional 3D tilt effect.
                </p>
              </SpotlightCard>
            </div>

            <div className="flex items-center justify-between text-xs text-neutral-500">
              <span>Great for feature cards, bento grids, and pricing plans.</span>
              <span className="hidden font-mono text-[11px] text-neutral-400 sm:inline">
                Tailwind + Motion
              </span>
            </div>
          </div>

          {/* Cell 03: SplitButton (5 cols) */}
          <div className="flex flex-col justify-between border-b border-neutral-200 p-5 dark:border-[#1A1A1A] sm:p-8 lg:col-span-5 lg:border-b-0 lg:border-r">
            <CardHeader
              index="03"
              icon={<GitBranch className="h-3.5 w-3.5" />}
              name="SplitButton"
              category="Buttons"
              slug="split-button"
              copiedSlug={copiedSlug}
              onCopy={handleCopySlug}
            />

            <div className="relative my-6 flex min-h-[240px] flex-col items-center justify-center gap-6 rounded-2xl border border-neutral-200 bg-neutral-50/50 bg-dot-matrix p-6 [background-size:18px_18px] dark:border-[#1F1F1F] dark:bg-[#050505]">
              <SplitButton
                label="Deploy Release"
                onClick={() => setLastSplitAction("Clicked: Deploy Release")}
                options={[
                  {
                    value: "preview",
                    label: "Deploy Preview",
                    onSelect: () => setLastSplitAction("Selected: Deploy Preview"),
                  },
                  {
                    value: "staging",
                    label: "Deploy to Staging",
                    onSelect: () => setLastSplitAction("Selected: Deploy to Staging"),
                  },
                  {
                    value: "rollback",
                    label: "Rollback Production",
                    onSelect: () => setLastSplitAction("Selected: Rollback Production"),
                  },
                ]}
              />

              <div className="rounded-full border border-neutral-200 bg-white px-3.5 py-1.5 font-mono text-[11px] text-neutral-600 dark:border-[#262626] dark:bg-[#0C0C0C] dark:text-neutral-400">
                {lastSplitAction}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-neutral-500">
              <span>Main action button combined with a clean dropdown menu.</span>
              <span className="hidden font-mono text-[11px] text-neutral-400 sm:inline">
                Keyboard Accessible
              </span>
            </div>
          </div>

          {/* Cell 04: CursorFollower (7 cols) */}
          <div className="flex flex-col justify-between p-5 sm:p-8 lg:col-span-7">
            <CardHeader
              index="04"
              icon={<MousePointerClick className="h-3.5 w-3.5" />}
              name="CursorFollower"
              category="Motion"
              slug="cursor-follower"
              copiedSlug={copiedSlug}
              onCopy={handleCopySlug}
            />

            <div className="my-6">
              <CursorFollower className="min-h-[240px] p-5 sm:p-7">
                <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
                  <div
                    data-cursor-label="OPEN PROJECT ↗"
                    className="rounded-xl border border-neutral-200 bg-white p-4 transition-colors hover:border-black dark:border-[#222222] dark:bg-[#0A0A0A] dark:hover:border-white"
                  >
                    <div className="font-mono text-[10px] text-neutral-400">
                      01
                    </div>
                    <div className="mt-2 text-sm font-semibold text-black dark:text-white">
                      Hover Labels
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
                      Hover this card to see the cursor ring turn into a pill label.
                    </p>
                  </div>

                  <div
                    data-cursor-label="ONE ATTRIBUTE ⚡"
                    className="rounded-xl border border-neutral-200 bg-white p-4 transition-colors hover:border-black dark:border-[#222222] dark:bg-[#0A0A0A] dark:hover:border-white"
                  >
                    <div className="font-mono text-[10px] text-neutral-400">
                      02
                    </div>
                    <div className="mt-2 text-sm font-semibold text-black dark:text-white">
                      Simple Setup
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
                      Just add <code className="font-mono text-black dark:text-white">data-cursor-label</code> to any element.
                    </p>
                  </div>

                  <div
                    data-cursor-label="REDUCED MOTION ✓"
                    className="rounded-xl border border-neutral-200 bg-white p-4 transition-colors hover:border-black dark:border-[#222222] dark:bg-[#0A0A0A] dark:hover:border-white"
                  >
                    <div className="font-mono text-[10px] text-neutral-400">
                      03
                    </div>
                    <div className="mt-2 text-sm font-semibold text-black dark:text-white">
                      Accessibility Friendly
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
                      Automatically switches back to normal cursor if reduced motion is on.
                    </p>
                  </div>
                </div>
              </CursorFollower>
            </div>

            <div className="flex items-center justify-between text-xs text-neutral-500">
              <span>Custom smooth cursor that expands into labels when hovering items.</span>
              <span className="hidden font-mono text-[11px] text-neutral-400 sm:inline">
                Framer Motion
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
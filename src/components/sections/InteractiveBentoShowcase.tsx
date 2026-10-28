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
  Binary,
  ShieldCheck,
  RotateCw,
} from "lucide-react";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { CursorFollower } from "@/components/ui/CursorFollower";
import { CipherScrambleText } from "@/components/ui/CipherScrambleText";
import { SpringPinInput } from "@/components/ui/SpringPinInput";
import { HolographicFlipCard } from "@/components/ui/HolographicFlipCard";
import { RippleBurstButton } from "@/components/ui/RippleBurstButton";
import { copyToClipboard, SITE_CONFIG } from "@/lib/utils";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 dark:focus-visible:ring-white dark:focus-visible:ring-offset-black";

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
  icon,
  name,
  category,
  slug,
  copiedSlug,
  onCopy,
}: CardHeaderProps) {
  const copied = copiedSlug === slug;
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200/80 pb-4 dark:border-neutral-800">
      <div className="flex items-center gap-2.5">
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold tracking-tight text-neutral-950 dark:text-white">
          {icon}
          <span>{name}</span>
        </span>
        <span className="rounded border border-neutral-200 bg-neutral-100 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
          {category}
        </span>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onCopy(slug)}
          aria-label={`Copy ${name} install command`}
          className={`inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-2.5 py-1 font-mono text-[11px] font-medium text-neutral-700 shadow-2xs transition-colors hover:border-neutral-900 hover:text-neutral-950 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-white dark:hover:text-white ${focusRing}`}
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-emerald-500" />
              <span className="text-emerald-500">Copied</span>
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
          className={`inline-flex items-center gap-1 rounded-lg bg-neutral-950 px-2.5 py-1 font-mono text-[11px] font-medium text-white transition-colors hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 shadow-2xs ${focusRing}`}
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
  const [pinVerified, setPinVerified] = useState(false);
  const [cipherKey, setCipherKey] = useState(0);

  const handleCopySlug = async (slug: string) => {
    const cmd = `npx shadcn@latest add ${SITE_CONFIG.url}/r/${slug}.json`;
    const ok = await copyToClipboard(cmd);
    if (ok) {
      setCopiedSlug(slug);
      setTimeout(() => setCopiedSlug(null), 1800);
    }
  };

  return (
    <section className="border-b border-neutral-200/80 bg-white dark:border-neutral-800 dark:bg-black">
      <div className="mx-auto max-w-[1280px] border-x border-neutral-200/80 dark:border-neutral-800">
        {/* Section Header */}
        <div className="flex flex-col justify-between gap-6 border-b border-neutral-200/80 px-5 py-14 dark:border-neutral-800 sm:flex-row sm:items-end sm:px-8 sm:py-16">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-neutral-950 dark:text-white sm:text-4xl">
              Real interactive primitives.
            </h2>
            <p className="mt-2.5 max-w-xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 sm:text-base">
              Test live spring physics, cursor tracking, holographic tilting, and OTP inputs before copying. Zero simulated static cards—every preview renders the true component.
            </p>
          </div>

          <Link
            href="/components"
            className={`inline-flex shrink-0 items-center gap-2 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-xs font-semibold text-neutral-950 transition-colors hover:border-neutral-900 hover:text-black dark:border-neutral-800 dark:bg-neutral-900 dark:text-white dark:hover:border-white shadow-2xs ${focusRing}`}
          >
            <span>All Components</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* 12-Column Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Cell 01: CipherScrambleText (7 cols) */}
          <div className="flex flex-col justify-between border-b border-neutral-200/80 p-5 dark:border-neutral-800 sm:p-8 lg:col-span-7 lg:border-r">
            <CardHeader
              index="01"
              icon={<Binary className="h-3.5 w-3.5" />}
              name="CipherScrambleText"
              category="Text"
              slug="cipher-scramble-text"
              copiedSlug={copiedSlug}
              onCopy={handleCopySlug}
            />

            <div className="relative my-6 flex min-h-[240px] flex-col items-center justify-center gap-5 overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50/50 bg-dot-matrix p-6 [background-size:18px_18px] dark:border-neutral-800 dark:bg-[#050505]">
              <div className="text-center font-mono">
                <CipherScrambleText
                  key={cipherKey}
                  text="QUANTUM CRYPTO PROTOCOL ACTIVE"
                  cyclesPerChar={2}
                  frameInterval={24}
                  className="text-base font-bold tracking-wider text-black dark:text-white sm:text-xl"
                />
              </div>

              <button
                type="button"
                onClick={() => setCipherKey((k) => k + 1)}
                className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-neutral-200 bg-white px-3.5 py-1.5 font-mono text-[11px] font-medium text-neutral-700 shadow-2xs transition-all hover:border-neutral-900 hover:text-black dark:border-neutral-800 dark:bg-[#111111] dark:text-neutral-300 dark:hover:border-white dark:hover:text-white"
              >
                <RotateCw className="h-3 w-3" />
                <span>Re-scramble Cipher</span>
              </button>
            </div>

            <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
              <span>Cryptographic matrix permutation with frame-by-frame lock.</span>
              <span className="hidden font-mono text-[11px] text-neutral-400 sm:inline">
                Framer Motion
              </span>
            </div>
          </div>

          {/* Cell 02: SpotlightCard (5 cols) */}
          <div className="flex flex-col justify-between border-b border-neutral-200/80 p-5 dark:border-neutral-800 sm:p-8 lg:col-span-5">
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
                  <span className="rounded-md border border-neutral-200 bg-neutral-100 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-black dark:border-neutral-800 dark:bg-[#141414] dark:text-white">
                    Hover me
                  </span>
                  <button
                    type="button"
                    onClick={() => setEnableTilt((v) => !v)}
                    className="cursor-pointer rounded-md border border-neutral-200 px-2 py-1 font-mono text-[10px] text-neutral-500 transition-colors hover:border-black hover:text-black dark:border-neutral-800 dark:hover:border-white dark:hover:text-white"
                  >
                    3D Tilt: {enableTilt ? "ON" : "OFF"}
                  </button>
                </div>
                <h3 className="mt-5 text-base font-semibold tracking-tight text-black dark:text-white">
                  Soft cursor spotlight &amp; border glow
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
                  Move your cursor over the card to see the spotlight follow your mouse with an optional 3D tilt effect.
                </p>
              </SpotlightCard>
            </div>

            <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
              <span>Great for feature cards, bento grids, and pricing plans.</span>
              <span className="hidden font-mono text-[11px] text-neutral-400 sm:inline">
                Tailwind + Motion
              </span>
            </div>
          </div>

          {/* Cell 03: SpringPinInput (4 cols) */}
          <div className="flex flex-col justify-between border-b border-neutral-200/80 p-5 dark:border-neutral-800 sm:p-8 lg:col-span-4 lg:border-r">
            <CardHeader
              index="03"
              icon={<ShieldCheck className="h-3.5 w-3.5" />}
              name="SpringPinInput"
              category="Inputs"
              slug="spring-pin-input"
              copiedSlug={copiedSlug}
              onCopy={handleCopySlug}
            />

            <div className="relative my-6 flex min-h-[240px] flex-col items-center justify-center gap-4 overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50/50 bg-dot-matrix p-4 [background-size:18px_18px] dark:border-neutral-800 dark:bg-[#050505]">
              <SpringPinInput
                length={4}
                defaultValue="482"
                onComplete={() => setPinVerified(true)}
              />

              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-mono text-[10px] font-medium ${pinVerified ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-neutral-100 text-neutral-500 dark:bg-neutral-900 dark:text-neutral-400"}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${pinVerified ? "bg-emerald-500 animate-pulse" : "bg-neutral-400"}`} />
                  {pinVerified ? "OTP Confirmed" : "Type 4 Digits"}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
              <span>Keystroke physics with bouncy Hooke springs.</span>
              <span className="hidden font-mono text-[11px] text-neutral-400 sm:inline">
                Accessible OTP
              </span>
            </div>
          </div>

          {/* Cell 04: HolographicFlipCard (4 cols) */}
          <div className="flex flex-col justify-between border-b border-neutral-200/80 p-5 dark:border-neutral-800 sm:p-8 lg:col-span-4 lg:border-r">
            <CardHeader
              index="04"
              icon={<RotateCw className="h-3.5 w-3.5" />}
              name="HolographicFlipCard"
              category="Cards"
              slug="holographic-flip-card"
              copiedSlug={copiedSlug}
              onCopy={handleCopySlug}
            />

            <div className="my-6 flex min-h-[240px] items-center justify-center">
              <HolographicFlipCard
                className="w-full max-w-[260px] h-[190px]"
                front={
                  <div className="flex h-full flex-col justify-between p-4">
                    <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400">
                      <span>FRONT FACE</span>
                      <Sparkles className="h-3.5 w-3.5 text-neutral-400" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-neutral-900 dark:text-white">
                        Holographic Glare
                      </div>
                      <p className="mt-1 text-[11px] text-neutral-500 dark:text-neutral-400">
                        Hover for 3D tilt sheen. Click anywhere to flip.
                      </p>
                    </div>
                  </div>
                }
                back={
                  <div className="flex h-full flex-col justify-between p-4">
                    <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400">
                      <span>BACK FACE</span>
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-neutral-900 dark:text-white">
                        Reverse Geometry
                      </div>
                      <p className="mt-1 text-[11px] text-neutral-500 dark:text-neutral-400">
                        180° true 3D spatial flip with spring physics.
                      </p>
                    </div>
                  </div>
                }
              />
            </div>

            <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
              <span>Gyroscope tilt with specular iridescent foil sheen.</span>
              <span className="hidden font-mono text-[11px] text-neutral-400 sm:inline">
                3D Perspective
              </span>
            </div>
          </div>

          {/* Cell 05: RippleBurstButton & MagneticButton (4 cols) */}
          <div className="flex flex-col justify-between border-b border-neutral-200/80 p-5 dark:border-neutral-800 sm:p-8 lg:col-span-4">
            <CardHeader
              index="05"
              icon={<Zap className="h-3.5 w-3.5" />}
              name="RippleBurstButton"
              category="Buttons"
              slug="ripple-burst-button"
              copiedSlug={copiedSlug}
              onCopy={handleCopySlug}
            />

            <div className="relative my-6 flex min-h-[240px] flex-col items-center justify-center gap-5 overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50/50 bg-dot-matrix p-4 [background-size:18px_18px] dark:border-neutral-800 dark:bg-[#050505]">
              <RippleBurstButton label="Emit Ripple Pulse" />

              <div className="flex items-center gap-2">
                <MagneticButton variant="secondary" size="sm" strength={strength}>
                  <span>Magnetic Pill</span>
                </MagneticButton>
              </div>

              {/* Strength slider */}
              <div className="flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs shadow-2xs dark:border-neutral-800 dark:bg-[#0C0C0C]">
                <Sliders className="h-3 w-3 text-neutral-400" />
                <input
                  type="range"
                  min={0.15}
                  max={0.8}
                  step={0.05}
                  value={strength}
                  onChange={(e) => setStrength(parseFloat(e.target.value))}
                  aria-label="Magnetic pull strength"
                  className="h-1 w-16 cursor-pointer appearance-none rounded-lg bg-neutral-200 accent-neutral-900 dark:bg-neutral-800 dark:accent-white"
                />
                <span className="w-6 text-right font-mono text-[10px] tabular-nums text-neutral-900 dark:text-white">
                  {strength.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
              <span>Radial tactile shockwaves + magnetic attraction cursor.</span>
              <span className="hidden font-mono text-[11px] text-neutral-400 sm:inline">
                Kinetic Micro
              </span>
            </div>
          </div>

          {/* Cell 06: CursorFollower Playground (12 cols) */}
          <div className="flex flex-col justify-between p-5 sm:p-8 lg:col-span-12">
            <CardHeader
              index="06"
              icon={<MousePointerClick className="h-3.5 w-3.5" />}
              name="CursorFollower"
              category="Motion"
              slug="cursor-follower"
              copiedSlug={copiedSlug}
              onCopy={handleCopySlug}
            />

            <div className="my-6">
              <CursorFollower className="min-h-[220px] p-5 sm:p-7">
                <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
                  <div
                    data-cursor-label="OPEN PRIMITIVE ↗"
                    className="rounded-xl border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-900 dark:border-neutral-800 dark:bg-[#0A0A0A] dark:hover:border-white shadow-2xs"
                  >
                    <div className="font-mono text-[10px] text-neutral-400">
                      01
                    </div>
                    <div className="mt-2 text-sm font-semibold text-neutral-950 dark:text-white">
                      Contextual Pill Transform
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
                      Hover this card to watch the cursor ring smoothly transition into a dynamic pill badge.
                    </p>
                  </div>

                  <div
                    data-cursor-label="COPY CLI ⚡"
                    className="rounded-xl border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-900 dark:border-neutral-800 dark:bg-[#0A0A0A] dark:hover:border-white shadow-2xs"
                  >
                    <div className="font-mono text-[10px] text-neutral-400">
                      02
                    </div>
                    <div className="mt-2 text-sm font-semibold text-neutral-950 dark:text-white">
                      Declarative Data Attributes
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
                      Zero custom state needed—just attach <code className="font-mono text-neutral-950 dark:text-white">data-cursor-label</code> to any HTML element.
                    </p>
                  </div>

                  <div
                    data-cursor-label="ACCESSIBLE ✓"
                    className="rounded-xl border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-900 dark:border-neutral-800 dark:bg-[#0A0A0A] dark:hover:border-white shadow-2xs"
                  >
                    <div className="font-mono text-[10px] text-neutral-400">
                      03
                    </div>
                    <div className="mt-2 text-sm font-semibold text-neutral-950 dark:text-white">
                      Motion &amp; Touch Friendly
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
                      Gracefully degrades to native OS pointer when prefers-reduced-motion is active or on touch screens.
                    </p>
                  </div>
                </div>
              </CursorFollower>
            </div>

            <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
              <span>Interactive playground demonstrating declarative context morphing cursor.</span>
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

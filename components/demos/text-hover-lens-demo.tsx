"use client";

import React from "react";
import { TextHoverLens } from "@/components/ui/TextHoverLens";

export function TextHoverLensDemo() {
  return (
    <div className="flex w-full flex-col gap-12 p-6 md:p-10">
      {/* ── Example 1: Large Hero Heading ── */}
      <section className="flex flex-col gap-3 rounded-2xl border border-neutral-200 bg-white/70 p-8 shadow-xs backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-900/60">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-500">
            Example 1 • Large Hero Heading (Magnified 1.1x)
          </span>
          <span className="rounded-full bg-teal-500/10 px-2.5 py-0.5 text-xs font-medium text-teal-600 dark:text-teal-400">
            Snappy Springs
          </span>
        </div>
        <div className="py-6">
          <h1 className="text-4xl font-black tracking-tight sm:text-6xl md:text-7xl">
            <TextHoverLens
              text="KINETIC HORIZON"
              lensColor="#000000"
              lensTextColor="#ffffff"
              lensSize={150}
              magnify={1.12}
            />
          </h1>
        </div>
        <p className="text-xs text-neutral-500">
          Hover cursor across the headline to reveal the teal lens layer with 1.12x spring magnification.
        </p>
      </section>

      {/* ── Example 2: Multi-Line Paragraph ── */}
      <section className="flex flex-col gap-3 rounded-2xl border border-neutral-200 bg-white/70 p-8 shadow-xs backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-900/60">
        <span className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-500">
          Example 2 • Multi-Line Paragraph (Zero Layout Shift)
        </span>
        <div className="max-w-2xl py-4">
          <p className="text-base font-normal leading-relaxed text-neutral-700 dark:text-neutral-300 sm:text-lg">
            <TextHoverLens
              text="Interfaces should feel physically grounded. When you hover across wrapped sentences, the lens glides seamlessly across line breaks, tracking your cursor with natural inertia and zero jump at the boundary."
              lensColor="#0f766e"
              lensTextColor="#f0fdfa"
              lensSize={130}
              magnify={1}
            />
          </p>
        </div>
        <p className="text-xs text-neutral-500">
          Maintains pixel-perfect text metrics across multiple wrapped lines with 1x zoom.
        </p>
      </section>

      {/* ── Example 3: Custom Colours ── */}
      <section className="flex flex-col gap-6 rounded-2xl border border-neutral-200 bg-white/70 p-8 shadow-xs backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-900/60">
        <span className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-500">
          Example 3 • Custom Color Schemes (Hex, Contrast & Inversion)
        </span>

        <div className="grid gap-6 sm:grid-cols-2">
          {/* Variant A: Dark Midnight Lens */}
          <div className="flex flex-col gap-2 rounded-xl border border-neutral-200/80 bg-neutral-100/60 p-6 dark:border-neutral-800/80 dark:bg-neutral-950/60">
            <span className="text-[11px] font-mono text-neutral-500">
              Black Lens • White Text
            </span>
            <div className="py-4">
              <h3 className="text-2xl font-bold tracking-tight text-neutral-400 dark:text-neutral-600 sm:text-3xl">
                <TextHoverLens
                  text="MIDNIGHT REVEAL"
                  lensColor="#000000"
                  lensTextColor="#ffffff"
                  textColor="#737373"
                  lensSize={110}
                  magnify={1.05}
                />
              </h3>
            </div>
            <span className="text-xs text-neutral-500">
              High-contrast monochrome mask.
            </span>
          </div>

          {/* Variant B: Vibrant Lime Lens */}
          <div className="flex flex-col gap-2 rounded-xl border border-neutral-200/80 bg-neutral-100/60 p-6 dark:border-neutral-800/80 dark:bg-neutral-950/60">
            <span className="text-[11px] font-mono text-neutral-500">
              Vibrant Lime • Dark Forest Text
            </span>
            <div className="py-4">
              <h3 className="text-2xl font-bold tracking-tight text-neutral-800 dark:text-neutral-200 sm:text-3xl">
                <TextHoverLens
                  text="ELECTRIC SPRING"
                  lensColor="#a3e635"
                  lensTextColor="#1a2e05"
                  textColor="currentColor"
                  lensSize={120}
                  magnify={1.08}
                />
              </h3>
            </div>
            <span className="text-xs text-neutral-500">
              Acid lime disc with high AA contrast dark text.
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}

export default TextHoverLensDemo;

"use client";

import React from "react";
import {
  Zap,
  Code2,
  Terminal,
  ShieldCheck,
  Cpu,
  Heart,
} from "lucide-react";

const TRUST_POINTS = [
  {
    icon: Zap,
    label: "Framer Motion 11",
    detail: "Physics-tuned springs & gestural mechanics",
  },
  {
    icon: Terminal,
    label: "shadcn CLI Compatible",
    detail: "Install with npx shadcn@latest add",
  },
  {
    icon: Code2,
    label: "Tailwind CSS & TypeScript",
    detail: "Copy, paste, customize and own the code",
  },
  {
    icon: Cpu,
    label: "Next.js 14+ Ready",
    detail: "Server Component & App Router safe",
  },
  {
    icon: ShieldCheck,
    label: "Accessible by Default",
    detail: "Keyboard navigable & prefers-reduced-motion",
  },
  {
    icon: Heart,
    label: "100% Free & Open Source",
    detail: "MIT licensed for personal and commercial apps",
  },
];

export function TechTrustStrip() {
  return (
    <section className="border-b border-neutral-200/80 bg-neutral-50/50 py-6 dark:border-neutral-800 dark:bg-[#070707]">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {TRUST_POINTS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="flex flex-col items-start gap-1 rounded-xl p-2.5 transition-colors"
              >
                <div className="flex items-center gap-1.5 font-mono text-[11px] font-semibold text-neutral-900 dark:text-white">
                  <Icon className="h-3.5 w-3.5 text-neutral-500 dark:text-neutral-400" />
                  <span className="truncate">{item.label}</span>
                </div>
                <p className="line-clamp-1 text-[11px] text-neutral-500 dark:text-neutral-400">
                  {item.detail}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

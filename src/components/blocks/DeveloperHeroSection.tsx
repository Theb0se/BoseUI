"use client";

import React, { useState } from "react";
import { ArrowRight, CheckCircle2, ShieldCheck, Zap, Globe2, Terminal } from "lucide-react";
import { GradientMeshHero } from "@/components/ui/GradientMeshHero";
import { TabbedCodeBlock } from "@/components/ui/TabbedCodeBlock";
import { GlobeArcs } from "@/components/ui/GlobeArcs";
import { cn } from "@/lib/utils";

export interface DeveloperHeroSectionProps {
  headline?: string;
  tagline?: string;
  className?: string;
}

export function DeveloperHeroSection({
  headline = "The financial infrastructure built for developers.",
  tagline = "Accept payments, send payouts, and automate financial workflows globally with a battle-tested API designed for reliability at scale.",
  className,
}: DeveloperHeroSectionProps) {
  const [activeTab, setActiveTab] = useState<"api" | "infra">("api");

  return (
    <div
      data-fullscreen-scroll
      className={cn(
        "relative w-full min-h-[720px] overflow-hidden rounded-3xl bg-neutral-950 text-white border border-neutral-800 shadow-2xl",
        className
      )}
    >
      {/* Top Gradient Mesh Hero Section */}
      <div className="relative overflow-hidden">
        <GradientMeshHero
          headline={headline}
          description={tagline}
          primaryCtaText="Get API Keys"
          secondaryCtaText="Read Documentation"
          preset="stripe"
          className="min-h-[520px] rounded-none border-b border-neutral-800"
        >
          <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
              {/* Left Column: Headline and Badges */}
              <div className="lg:col-span-6 space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1 text-xs font-mono text-cyan-300 backdrop-blur-md">
                  <Zap className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Pulse API v2.4 Released</span>
                </div>

                <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.08]">
                  Financial rails for modern engineering teams.
                </h1>

                <p className="text-base text-neutral-300 leading-relaxed max-w-xl">
                  {tagline}
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <a
                    href="/docs"
                    className="inline-flex h-11 items-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-neutral-950 transition-transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <span>Start Building</span>
                    <ArrowRight className="h-4 w-4" />
                  </a>
                  <a
                    href="#network"
                    className="inline-flex h-11 items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 text-sm font-medium text-white backdrop-blur-md transition-colors hover:bg-white/10"
                  >
                    <Globe2 className="h-4 w-4 text-cyan-400" />
                    <span>Explore Global Backbone</span>
                  </a>
                </div>

                <div className="flex flex-wrap items-center gap-6 pt-4 text-xs font-mono text-neutral-400">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    99.999% SLA
                  </span>
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-cyan-400" />
                    PCI-DSS Level 1
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Terminal className="h-4 w-4 text-purple-400" />
                    Sub-20ms Latency
                  </span>
                </div>
              </div>

              {/* Right Column: Developer Code Block Terminal */}
              <div className="lg:col-span-6 w-full">
                <div className="overflow-hidden rounded-2xl border border-white/15 bg-neutral-900/90 shadow-2xl backdrop-blur-xl">
                  <TabbedCodeBlock className="min-h-[420px] rounded-none border-0" />
                </div>
              </div>
            </div>
          </div>
        </GradientMeshHero>
      </div>

      {/* Bottom Global Infrastructure Showcase */}
      <div className="relative border-t border-neutral-800 bg-[#080808] px-6 py-12 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-800 pb-6">
            <div>
              <p className="text-xs font-mono uppercase tracking-widest text-cyan-400">
                Resilient Global Backbone
              </p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight text-white">
                Global Transaction Routing &amp; Edge Settlement
              </h2>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono text-neutral-400">
              <span>San Francisco · New York · London · Tokyo · Singapore</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12 items-center">
            <div className="lg:col-span-8">
              <GlobeArcs
                showHeader={false}
                showControls={false}
                className="min-h-[380px] rounded-2xl border border-neutral-800"
              />
            </div>
            <div className="lg:col-span-4 space-y-4">
              <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 backdrop-blur-md">
                <p className="text-xs font-mono text-neutral-400">Global Processing Capacity</p>
                <p className="mt-1 text-3xl font-bold text-white">$4.8B+</p>
                <p className="mt-1 text-xs text-neutral-400">Monthly gross volume routed across 140+ countries.</p>
              </div>

              <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 backdrop-blur-md">
                <p className="text-xs font-mono text-neutral-400">Average P99 Settlement Latency</p>
                <p className="mt-1 text-3xl font-bold text-cyan-400">14.2 ms</p>
                <p className="mt-1 text-xs text-neutral-400">Decentralized edge compute with automated failover.</p>
              </div>

              <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 backdrop-blur-md">
                <p className="text-xs font-mono text-neutral-400">Zero-Downtime Releases</p>
                <p className="mt-1 text-3xl font-bold text-emerald-400">99.999%</p>
                <p className="mt-1 text-xs text-neutral-400">Multi-cloud consensus with zero maintenance windows.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default DeveloperHeroSection;

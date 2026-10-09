"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Zap,
  Shield,
  ArrowRight,
  Star,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import {
  ProductCompareTable,
  type CompareTier,
  type CompareSpecRow,
} from "@/components/ui/ProductCompareTable";

export interface TierComparePricingBlockProps {
  /** Optional title override */
  title?: string;
  /** Optional subtitle override */
  description?: string;
  className?: string;
}

const PRICING_TIERS = [
  {
    id: "starter",
    name: "Starter",
    badge: "Free Forever",
    price: "$0",
    period: "free tier",
    description: "For solo builders and engineers exploring kinetic UI design.",
    highlighted: false,
    ctaText: "Start Free",
    ctaVariant: "outline",
    features: [
      "Access to 35+ core kinetic primitives",
      "Tailwind CSS v4 & Lucide icons",
      "Unlimited local developer sandboxes",
      "Community Discord & GitHub Discussions",
    ],
    spotlight: "rgba(128, 128, 128, 0.12)",
    border: "rgba(128, 128, 128, 0.3)",
  },
  {
    id: "pro",
    name: "Professional",
    badge: "Most Popular",
    price: "$29",
    period: "per seat / month",
    description: "For fast-moving SaaS teams shipping world-class digital products.",
    highlighted: true,
    ctaText: "Get Pro Access",
    ctaVariant: "primary",
    features: [
      "Everything in Starter, plus:",
      "Complete library of 80+ physics blocks",
      "Full Figma token library & component kit",
      "Private registry token for team CI/CD",
      "Priority triage & expedited GitHub issues",
      "Commercial production license",
    ],
    spotlight: "rgba(99, 102, 241, 0.22)",
    border: "rgba(99, 102, 241, 0.6)",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    badge: "Custom SLA",
    price: "$99",
    period: "per seat / month",
    description: "For scale-ups and enterprises with bespoke design and compliance needs.",
    highlighted: false,
    ctaText: "Contact Enterprise",
    ctaVariant: "outline",
    features: [
      "Everything in Professional, plus:",
      "Bespoke custom motion primitive design",
      "Dedicated Solutions Architect onboarding",
      "99.99% SLA commitment & uptime guarantee",
      "SOC2 Type II compliance audit telemetry",
      "Invoice billing & procurement support",
    ],
    spotlight: "rgba(16, 185, 129, 0.18)",
    border: "rgba(16, 185, 129, 0.45)",
  },
];

const DETAILED_COMPARE_TIERS: CompareTier[] = [
  { id: "core", name: "Starter", price: "$0" },
  { id: "pro", name: "Professional", price: "$29", badge: "Popular", highlighted: true },
  { id: "enterprise", name: "Enterprise", price: "$99" },
];

const DETAILED_COMPARE_ROWS: CompareSpecRow[] = [
  {
    category: "Components & Primitives",
    feature: "Core Spring & Motion Primitives",
    values: { core: true, pro: true, enterprise: true },
  },
  {
    category: "Components & Primitives",
    feature: "Complex Interactive Blocks & Docks",
    values: { core: false, pro: true, enterprise: true },
  },
  {
    category: "Components & Primitives",
    feature: "Canvas & WebGL Atmospheric Backdrops",
    values: { core: false, pro: true, enterprise: true },
  },
  {
    category: "Design System & Tooling",
    feature: "Tailwind CSS v4 & React 19 Ready",
    values: { core: true, pro: true, enterprise: true },
  },
  {
    category: "Design System & Tooling",
    feature: "Official Figma Kinetic UI Tokens",
    values: { core: false, pro: true, enterprise: true },
  },
  {
    category: "Design System & Tooling",
    feature: "Private Registry CLI Auth Keys",
    values: { core: false, pro: "5 tokens", enterprise: "Unlimited" },
  },
  {
    category: "Compliance & Enterprise",
    feature: "Commercial Multi-Project License",
    values: { core: true, pro: true, enterprise: true },
  },
  {
    category: "Compliance & Enterprise",
    feature: "99.99% Production Uptime SLA",
    values: { core: false, pro: false, enterprise: true },
  },
  {
    category: "Compliance & Enterprise",
    feature: "Dedicated Solutions Engineer",
    values: { core: false, pro: false, enterprise: true },
  },
  {
    category: "Compliance & Enterprise",
    feature: "Custom Component Request Queue",
    values: { core: false, pro: "Standard queue", enterprise: "Priority (48h)" },
  },
];

export function TierComparePricingBlock({
  title = "Simple, transparent tiers for every ambition",
  description = "No arbitrary lock-ins. Build freely, scale your design system, and upgrade as your product accelerates.",
  className,
}: TierComparePricingBlockProps) {
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  return (
    <div
      data-fullscreen-scroll
      className={cn(
        "relative w-full min-h-[540px] overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-[#07080D] p-6 sm:p-8 md:p-10 text-neutral-900 dark:text-white shadow-xl flex flex-col justify-between",
        className
      )}
    >
      {/* Background radial gradient accent */}
      <div
        className="pointer-events-none absolute -top-48 left-1/2 -translate-x-1/2 w-[800px] h-[380px] bg-indigo-500/10 dark:bg-indigo-600/15 blur-[130px] rounded-full"
        aria-hidden="true"
      />

      {/* Header */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
          <Sparkles className="h-3.5 w-3.5" />
          <span>PLANS & PRICING</span>
        </div>

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
          {title}
        </h2>

        <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
          {description}
        </p>
      </div>

      {/* 3-Tier Pricing Grid using SpotlightCard */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 my-10 items-stretch">
        {PRICING_TIERS.map((tier) => {
          const isHighlighted = tier.highlighted;

          return (
            <SpotlightCard
              key={tier.id}
              spotlightColor={tier.spotlight}
              borderColor={tier.border}
              enableTilt={false}
              className={cn(
                "relative flex flex-col justify-between rounded-2xl p-6 sm:p-7 transition-all duration-300",
                isHighlighted
                  ? "border-2 border-indigo-500/80 bg-white/95 dark:bg-neutral-900/90 shadow-2xl shadow-indigo-500/15 ring-1 ring-indigo-500/20"
                  : "border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/50 backdrop-blur-md"
              )}
            >
              {/* Highlight ribbon */}
              {isHighlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider text-white shadow-md">
                  {tier.badge}
                </div>
              )}

              <div>
                {/* Header info */}
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                    {tier.name}
                  </h3>
                  {!isHighlighted && (
                    <span className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 px-2 py-0.5 rounded border border-neutral-200 dark:border-neutral-800">
                      {tier.badge}
                    </span>
                  )}
                </div>

                <p className="text-xs text-neutral-600 dark:text-neutral-400 min-h-[36px]">
                  {tier.description}
                </p>

                {/* Price Display */}
                <div className="mt-4 mb-6 flex items-baseline gap-1.5 border-b border-neutral-200/80 dark:border-neutral-800/80 pb-5">
                  <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white font-mono">
                    {tier.price}
                  </span>
                  <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                    {tier.period}
                  </span>
                </div>

                {/* Features List */}
                <ul className="space-y-3 text-xs sm:text-sm">
                  {tier.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2.5">
                      <div
                        className={cn(
                          "flex h-4 w-4 shrink-0 items-center justify-center rounded-full mt-0.5",
                          isHighlighted
                            ? "bg-indigo-600 text-white"
                            : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                        )}
                      >
                        <Check className="h-2.5 w-2.5 stroke-[3]" />
                      </div>
                      <span className="text-neutral-700 dark:text-neutral-300">
                        {feat}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <div className="mt-8 pt-2">
                <button
                  type="button"
                  className={cn(
                    "w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all cursor-pointer group",
                    tier.ctaVariant === "primary"
                      ? "bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white shadow-md shadow-indigo-600/25"
                      : "border border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-600 bg-transparent text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  )}
                >
                  <span>{tier.ctaText}</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            </SpotlightCard>
          );
        })}
      </div>

      {/* Expandable Disclosure Button */}
      <div className="relative z-10 flex flex-col items-center mt-2 mb-4">
        <button
          type="button"
          onClick={() => setIsCompareOpen((prev) => !prev)}
          className="inline-flex items-center gap-2 rounded-full border border-neutral-300 dark:border-neutral-700 bg-white/80 dark:bg-neutral-900/80 px-5 py-2 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors shadow-sm cursor-pointer"
          aria-expanded={isCompareOpen}
        >
          <span>{isCompareOpen ? "Hide detailed comparison matrix" : "Compare all features in detail"}</span>
          {isCompareOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>

        {/* Expandable ProductCompareTable */}
        <AnimatePresence>
          {isCompareOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="w-full mt-6 overflow-hidden"
            >
              <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/60 dark:bg-neutral-900/40 p-4 sm:p-6 backdrop-blur-md">
                <ProductCompareTable
                  tiers={DETAILED_COMPARE_TIERS}
                  rows={DETAILED_COMPARE_ROWS}
                  allowDiffFilter={true}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Guarantee Banner */}
      <div className="relative z-10 border-t border-neutral-200/60 dark:border-neutral-800/60 pt-4 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 gap-2">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-emerald-500" />
          <span>All plans backed by our 30-day money-back guarantee.</span>
        </div>
        <span>Need custom invoicing or vendor security reviews? <a href="#enterprise" className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">Contact sales</a></span>
      </div>
    </div>
  );
}

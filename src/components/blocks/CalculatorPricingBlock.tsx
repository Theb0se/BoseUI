"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  Zap,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  Cpu,
  Layers,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LiquidPillTabs, type LiquidTabItem } from "@/components/ui/LiquidPillTabs";
import { RollingNumberTicker } from "@/components/ui/RollingNumberTicker";

export interface CalculatorPricingBlockProps {
  /** Initial monthly request volume. Default: 250000 */
  defaultVolume?: number;
  /** Initial billing cycle (monthly vs annual). Default: "annual" */
  defaultBilling?: "monthly" | "annual";
  /** Optional title heading override */
  title?: string;
  /** Optional subtitle description override */
  description?: string;
  className?: string;
}

const BILLING_TABS: LiquidTabItem[] = [
  { id: "monthly", label: "Monthly" },
  { id: "annual", label: "Annual", badge: "Save 20%" },
];

const PRESETS = [
  { label: "50K", value: 50_000 },
  { label: "250K", value: 250_000 },
  { label: "1M", value: 1_000_000 },
  { label: "5M", value: 5_000_000 },
];

export function CalculatorPricingBlock({
  defaultVolume = 250_000,
  defaultBilling = "annual",
  title = "Predictable pricing scaled to your traffic",
  description = "No opaque lock-ins or overage penalties. Slide to match your expected monthly operations.",
  className,
}: CalculatorPricingBlockProps) {
  const [billingCycle, setBillingCycle] = useState<string>(defaultBilling);
  const [volume, setVolume] = useState<number>(defaultVolume);

  const isAnnual = billingCycle === "annual";

  // Tier categorization
  const tierInfo = useMemo(() => {
    if (volume < 100_000) {
      return {
        name: "Starter Tier",
        baseMonthly: 29,
        ratePer1k: 0.2,
        badge: "Early Stage",
        color: "text-blue-500 dark:text-blue-400",
        badgeBg: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
      };
    }
    if (volume < 1_000_000) {
      return {
        name: "Growth Tier",
        baseMonthly: 89,
        ratePer1k: 0.15,
        badge: "Most Popular",
        color: "text-indigo-500 dark:text-indigo-400",
        badgeBg: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
      };
    }
    return {
      name: "Scale Tier",
      baseMonthly: 249,
      ratePer1k: 0.08,
      badge: "High Throughput",
      color: "text-emerald-500 dark:text-emerald-400",
      badgeBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    };
  }, [volume]);

  // Price computation
  const rawPrice = useMemo(() => {
    const usageCost = (volume / 1000) * tierInfo.ratePer1k;
    const monthlyTotal = tierInfo.baseMonthly + usageCost;
    return isAnnual ? Math.round(monthlyTotal * 0.8) : Math.round(monthlyTotal);
  }, [volume, tierInfo, isAnnual]);

  const savingsAmount = useMemo(() => {
    const fullMonthly = tierInfo.baseMonthly + (volume / 1000) * tierInfo.ratePer1k;
    return Math.round(fullMonthly * 0.2 * 12);
  }, [volume, tierInfo]);

  const featureChecklist = [
    { text: "Zero-latency edge routing across 310+ PoPs", included: true },
    { text: "Automatic failover & circuit breaker orchestration", included: true },
    {
      text: "Real-time telemetry stream & eBPF distributed traces",
      included: volume >= 100_000,
    },
    {
      text: "SOC2 Type II compliant log exports & audit trail",
      included: volume >= 250_000,
    },
    {
      text: "Dedicated Solutions Engineer & 99.99% uptime SLA",
      included: volume >= 1_000_000,
    },
  ];

  return (
    <div
      data-fullscreen-scroll
      className={cn(
        "relative w-full min-h-[540px] overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-[#07080D] p-6 sm:p-8 md:p-10 text-neutral-900 dark:text-white shadow-xl flex flex-col justify-between",
        className
      )}
    >
      {/* Background ambient radial glow */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-indigo-500/10 dark:bg-indigo-600/15 blur-[120px] rounded-full"
        aria-hidden="true"
      />

      {/* Top Header */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
          <Sparkles className="h-3.5 w-3.5" />
          <span>FLEXIBLE USAGE CALCULATOR</span>
        </div>

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
          {title}
        </h2>

        <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
          {description}
        </p>

        {/* Liquid Pill Tabs Toggle */}
        <div className="pt-2">
          <LiquidPillTabs
            tabs={BILLING_TABS}
            activeTab={billingCycle}
            onChange={(tabId: string) => setBillingCycle(tabId)}
            className="shadow-sm"
          />
        </div>
      </div>

      {/* Center Grid: Slider & Calculator Configuration */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 my-8 items-stretch">
        {/* Left Side: Volume Slider & Feature Checklist */}
        <div className="lg:col-span-7 flex flex-col justify-between rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/70 dark:bg-neutral-900/40 backdrop-blur-md p-6 sm:p-8 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
                <Cpu className="h-4 w-4 text-indigo-500" />
                Monthly API Invocations
              </span>
              <span className="text-base sm:text-lg font-mono font-bold text-neutral-900 dark:text-neutral-100">
                {volume.toLocaleString()} <span className="text-xs font-normal text-neutral-500">reqs/mo</span>
              </span>
            </div>

            {/* Slider Input */}
            <div className="space-y-2">
              <input
                type="range"
                min={10_000}
                max={5_000_000}
                step={10_000}
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-full h-2 rounded-lg bg-neutral-200 dark:bg-neutral-700 accent-indigo-600 dark:accent-indigo-500 cursor-pointer transition-all"
                aria-label="Monthly request volume slider"
              />
              <div className="flex justify-between text-[11px] font-mono text-neutral-400 dark:text-neutral-500">
                <span>10K</span>
                <span>1M</span>
                <span>2.5M</span>
                <span>5M+</span>
              </div>
            </div>

            {/* Preset Shortcuts */}
            <div className="flex items-center gap-2 pt-1 flex-wrap">
              <span className="text-xs text-neutral-500 dark:text-neutral-400 mr-1">Presets:</span>
              {PRESETS.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => setVolume(preset.value)}
                  className={cn(
                    "rounded-lg px-2.5 py-1 text-xs font-medium transition-colors border",
                    volume === preset.value
                      ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-semibold"
                      : "border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  )}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Tier Feature Matrix */}
          <div className="border-t border-neutral-200 dark:border-neutral-800 pt-5 space-y-3">
            <div className="flex items-center justify-between text-xs font-medium text-neutral-500 dark:text-neutral-400">
              <span>Included Capabilities</span>
              <span className={cn("px-2 py-0.5 rounded text-[11px] font-semibold border", tierInfo.badgeBg)}>
                {tierInfo.badge}
              </span>
            </div>
            <ul className="space-y-2.5">
              {featureChecklist.map((item, idx) => (
                <li key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm">
                  <div
                    className={cn(
                      "flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-white",
                      item.included ? "bg-emerald-500" : "bg-neutral-300 dark:bg-neutral-800 text-neutral-400"
                    )}
                  >
                    {item.included ? (
                      <Check className="h-2.5 w-2.5 stroke-[3]" />
                    ) : (
                      <span className="text-[9px] font-bold">−</span>
                    )}
                  </div>
                  <span
                    className={cn(
                      item.included
                        ? "text-neutral-800 dark:text-neutral-200 font-medium"
                        : "text-neutral-400 dark:text-neutral-600 line-through"
                    )}
                  >
                    {item.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Side: Total Price Dynamic Card with RollingNumberTicker */}
        <div className="lg:col-span-5 flex flex-col justify-between rounded-xl border border-indigo-200 dark:border-indigo-900/50 bg-gradient-to-b from-white to-indigo-50/40 dark:from-neutral-900/80 dark:to-indigo-950/30 p-6 sm:p-8 shadow-md">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider font-semibold text-neutral-500 dark:text-neutral-400">
                  Recommended Plan
                </span>
                <h3 className={cn("text-xl font-bold mt-0.5", tierInfo.color)}>
                  {tierInfo.name}
                </h3>
              </div>
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500 dark:text-indigo-400">
                <Zap className="h-5 w-5" />
              </span>
            </div>

            {/* Rolling Number Ticker Box */}
            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/90 dark:bg-black/40 p-4">
              <div className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">
                Estimated Investment
              </div>
              <div className="flex items-baseline gap-1">
                <RollingNumberTicker
                  value={rawPrice}
                  currency="$"
                  fontSize="xl"
                  className="text-neutral-900 dark:text-white"
                />
                <span className="text-xs sm:text-sm font-medium text-neutral-500 dark:text-neutral-400">
                  / month
                </span>
              </div>
              <div className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1">
                {isAnnual ? "Billed annually" : "Billed monthly without commitment"}
              </div>

              {isAnnual && (
                <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                  <TrendingUp className="h-3 w-3" />
                  <span>Annual savings: ~${savingsAmount}/year</span>
                </div>
              )}
            </div>

            {/* Breakdown itemization */}
            <div className="space-y-2 text-xs text-neutral-600 dark:text-neutral-400 pt-1">
              <div className="flex justify-between">
                <span>Base Platform Subscription</span>
                <span className="font-mono text-neutral-900 dark:text-neutral-200">
                  ${tierInfo.baseMonthly}/mo
                </span>
              </div>
              <div className="flex justify-between">
                <span>Usage Surcharge ({volume.toLocaleString()} calls)</span>
                <span className="font-mono text-neutral-900 dark:text-neutral-200">
                  ${((volume / 1000) * tierInfo.ratePer1k).toFixed(2)}
                </span>
              </div>
              {isAnnual && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                  <span>Annual Billing Discount (20%)</span>
                  <span>Applied</span>
                </div>
              )}
            </div>
          </div>

          {/* CTA Button */}
          <div className="pt-6 space-y-3">
            <button
              type="button"
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-medium px-5 py-3 text-sm shadow-md shadow-indigo-600/20 transition-all cursor-pointer group"
            >
              <span>Deploy on {tierInfo.name}</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-neutral-500 dark:text-neutral-400">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              <span>14-day free trial • Cancel anytime • No credit card required</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Subtext */}
      <div className="relative z-10 border-t border-neutral-200/60 dark:border-neutral-800/60 pt-4 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 gap-2">
        <span>Need custom multi-tenant rate limits or VPC peering?</span>
        <a
          href="#contact"
          className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium inline-flex items-center gap-1"
        >
          <span>Talk to Enterprise Architecture team</span>
          <ArrowRight className="h-3 w-3" />
        </a>
      </div>
    </div>
  );
}

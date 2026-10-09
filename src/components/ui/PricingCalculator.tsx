"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  Zap,
  Sparkles,
  Sliders,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  HelpCircle,
  Building,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TierPlan {
  id: string;
  name: string;
  tagline: string;
  minVolume: number;
  maxVolume: number;
  basePriceMonthly: number;
  perExtraUnitRate: number; // cost per 1,000 calls above base
  popular?: boolean;
  features: string[];
}

const PLANS: TierPlan[] = [
  {
    id: "starter",
    name: "Starter",
    tagline: "For early stage builders & side-projects",
    minVolume: 0,
    maxVolume: 50_000,
    basePriceMonthly: 29,
    perExtraUnitRate: 0.5,
    features: [
      "Up to 50,000 API requests/mo",
      "3 team member seats",
      "Standard Webhook dispatch",
      "Community Discord & Email support",
    ],
  },
  {
    id: "growth",
    name: "Growth",
    tagline: "For fast growing SaaS & ecommerce platforms",
    minVolume: 50_000,
    maxVolume: 500_000,
    basePriceMonthly: 99,
    perExtraUnitRate: 0.35,
    popular: true,
    features: [
      "Up to 500,000 API requests/mo",
      "15 team member seats",
      "Automated ML Dunning & Retries",
      "99.99% Uptime SLA commitment",
      "Priority 24/7 ticketing queue",
    ],
  },
  {
    id: "scale",
    name: "Scale",
    tagline: "For mature products handling heavy transactional throughput",
    minVolume: 500_000,
    maxVolume: 2_500_000,
    basePriceMonthly: 299,
    perExtraUnitRate: 0.2,
    features: [
      "Up to 2,500,000 API requests/mo",
      "Unlimited team seats",
      "Dedicated Slack Connect channel",
      "Multi-region VPC peering",
      "Custom rate limit overrides",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    tagline: "Institutional financial rails & bespoke compliance",
    minVolume: 2_500_000,
    maxVolume: 10_000_000,
    basePriceMonthly: 899,
    perExtraUnitRate: 0.12,
    features: [
      "High volume unlimited transactions",
      "99.999% Zero-downtime SLA",
      "Dedicated Solutions Architect",
      "Custom contract & SOC2 type II audit",
      "Private on-prem telemetry broker",
    ],
  },
];

const CURRENCIES = [
  { code: "USD", symbol: "$", rate: 1.0 },
  { code: "EUR", symbol: "€", rate: 0.92 },
  { code: "GBP", symbol: "£", rate: 0.79 },
];

const PRESET_VOLUMES = [25_000, 150_000, 850_000, 3_500_000];

export interface PricingCalculatorProps {
  className?: string;
  defaultVolume?: number;
  defaultAnnual?: boolean;
}

export function PricingCalculator({
  className,
  defaultVolume = 150_000,
  defaultAnnual = true,
}: PricingCalculatorProps) {
  const [volume, setVolume] = useState<number>(defaultVolume);
  const [isAnnual, setIsAnnual] = useState<boolean>(defaultAnnual);
  const [currencyIndex, setCurrencyIndex] = useState<number>(0);

  const currentCurrency = CURRENCIES[currencyIndex];

  // Find active plan based on volume
  const activePlan =
    PLANS.find((p) => volume >= p.minVolume && volume < p.maxVolume) ||
    PLANS[PLANS.length - 1];

  // Calculate price with volume discount & annual 20% discount
  const calculatePrice = (plan: TierPlan) => {
    let raw = plan.basePriceMonthly;
    if (volume > plan.minVolume) {
      const extraVolume = Math.max(0, volume - plan.minVolume);
      raw += (extraVolume / 1000) * plan.perExtraUnitRate;
    }
    if (isAnnual) {
      raw *= 0.8; // 20% discount
    }
    return Math.round(raw * currentCurrency.rate);
  };

  const calculatedCost = calculatePrice(activePlan);

  return (
    <div
      data-fullscreen-scroll
      className={cn(
        "relative w-full min-h-[520px] overflow-hidden rounded-2xl border border-neutral-800 bg-[#070913] p-6 text-white flex flex-col justify-between shadow-2xl selection:bg-indigo-500/30",
        className
      )}
    >
      {/* Background ambient gradient */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/3 h-96 w-[500px] rounded-full bg-indigo-600/10 blur-[130px]" />
        <div className="absolute bottom-0 right-1/4 h-80 w-80 rounded-full bg-emerald-500/10 blur-[120px]" />
      </div>

      {/* Top Header */}
      <div className="relative z-10 max-w-3xl mx-auto text-center pt-2 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium mb-3">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Tiered Volume Calculator</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          Predictable pricing that scales with you
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-neutral-400 max-w-xl mx-auto">
          Drag the volume slider to estimate your monthly API costs. Volume discounts apply automatically as your traffic expands.
        </p>

        {/* Monthly vs Annual Toggle */}
        <div className="mt-6 inline-flex items-center gap-3 bg-neutral-900/90 border border-neutral-800 p-1 rounded-xl backdrop-blur-md">
          <button
            onClick={() => setIsAnnual(false)}
            className={cn(
              "px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all",
              !isAnnual
                ? "bg-neutral-800 text-white shadow"
                : "text-neutral-400 hover:text-white"
            )}
          >
            Monthly billing
          </button>
          <button
            onClick={() => setIsAnnual(true)}
            className={cn(
              "px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5",
              isAnnual
                ? "bg-indigo-600 text-white shadow shadow-indigo-600/30 font-semibold"
                : "text-neutral-400 hover:text-white"
            )}
          >
            <span>Annual billing</span>
            <span className="text-[10px] bg-emerald-400/20 text-emerald-300 px-1.5 py-0.5 rounded font-mono">
              Save 20%
            </span>
          </button>
        </div>
      </div>

      {/* Interactive Usage Slider Box */}
      <div className="relative z-10 max-w-4xl mx-auto w-full bg-neutral-900/70 border border-neutral-800/90 rounded-2xl p-6 backdrop-blur-xl mb-8 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <span className="text-xs uppercase tracking-wider text-neutral-400 font-semibold">
              Monthly Transactions / API Requests
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-3xl font-extrabold text-white font-mono tracking-tight">
                {volume.toLocaleString()}
              </span>
              <span className="text-xs text-neutral-400">requests / month</span>
            </div>
          </div>

          {/* Estimated Monthly Total Display */}
          <div className="text-right">
            <span className="text-xs text-neutral-400 font-medium">
              Estimated Investment
            </span>
            <div className="flex items-baseline justify-end gap-1 mt-0.5">
              <span className="text-3xl font-black text-indigo-400 tracking-tight font-mono">
                {currentCurrency.symbol}
                {calculatedCost.toLocaleString()}
              </span>
              <span className="text-xs text-neutral-400">/ mo</span>
            </div>
            {isAnnual && (
              <span className="text-[10px] text-emerald-400 font-mono">
                Billed annually ({currentCurrency.symbol}
                {(calculatedCost * 12).toLocaleString()}/yr)
              </span>
            )}
          </div>
        </div>

        {/* Custom Slider Input */}
        <div className="relative my-6">
          <input
            type="range"
            min={10_000}
            max={5_000_000}
            step={10_000}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-full h-2.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />

          {/* Volume tick labels */}
          <div className="flex justify-between text-[11px] font-mono text-neutral-500 mt-2">
            <span>10K</span>
            <span>250K</span>
            <span>1M</span>
            <span>2.5M</span>
            <span>5M+</span>
          </div>
        </div>

        {/* Preset Volume Quick Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-neutral-800/60 text-xs">
          <span className="text-neutral-400">Preset Volume Jumps:</span>
          <div className="flex flex-wrap gap-2">
            {PRESET_VOLUMES.map((pv) => (
              <button
                key={pv}
                onClick={() => setVolume(pv)}
                className={cn(
                  "px-2.5 py-1 rounded font-mono text-[11px] transition-colors",
                  volume === pv
                    ? "bg-indigo-600 text-white font-semibold"
                    : "bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
                )}
              >
                {(pv / 1000).toFixed(0)}k req
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Plans Grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto w-full mb-6">
        {PLANS.map((plan) => {
          const isCurrent = activePlan.id === plan.id;
          const planCost = calculatePrice(plan);

          return (
            <div
              key={plan.id}
              className={cn(
                "relative rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 border",
                isCurrent
                  ? "bg-neutral-900/95 border-indigo-500 shadow-2xl shadow-indigo-500/20 ring-1 ring-indigo-500"
                  : "bg-neutral-900/40 border-neutral-800 hover:border-neutral-700"
              )}
            >
              {/* Highlight badge if active */}
              {isCurrent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-indigo-500 to-violet-600 text-white text-[10px] font-bold tracking-wide uppercase shadow-md">
                  Active Match
                </div>
              )}

              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-base">{plan.name}</h3>
                  {plan.popular && !isCurrent && (
                    <span className="text-[10px] font-semibold text-neutral-400 bg-neutral-800 px-2 py-0.5 rounded">
                      Popular
                    </span>
                  )}
                </div>

                <p className="mt-1 text-[11px] text-neutral-400 leading-snug min-h-[30px]">
                  {plan.tagline}
                </p>

                <div className="mt-4 pt-3 border-t border-neutral-800">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-white font-mono">
                      {currentCurrency.symbol}
                      {planCost}
                    </span>
                    <span className="text-xs text-neutral-400">/mo</span>
                  </div>
                  <span className="text-[10px] text-neutral-500 font-mono block">
                    {plan.maxVolume >= 10_000_000
                      ? "Custom enterprise tier"
                      : `Up to ${(plan.maxVolume / 1000).toLocaleString()}k req/mo`}
                  </span>
                </div>

                {/* Features list */}
                <div className="mt-4 space-y-2">
                  {plan.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-neutral-300">
                      <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="leading-tight text-[11px]">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                className={cn(
                  "mt-6 w-full py-2 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5",
                  isCurrent
                    ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30"
                    : "bg-neutral-800 hover:bg-neutral-700 text-neutral-200"
                )}
              >
                <span>Select {plan.name}</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Interactive Controls Stage Footer */}
      <div className="relative z-20 mt-4 pt-4 border-t border-neutral-800/80 bg-neutral-950/80 backdrop-blur-md -mx-6 -mb-6 px-6 py-4 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-neutral-400 font-medium">Currency:</span>
          {CURRENCIES.map((c, idx) => (
            <button
              key={c.code}
              onClick={() => setCurrencyIndex(idx)}
              className={cn(
                "px-2.5 py-1 rounded font-mono text-xs transition-colors",
                currencyIndex === idx
                  ? "bg-indigo-600 text-white font-semibold"
                  : "bg-neutral-800/80 text-neutral-400 hover:text-white"
              )}
            >
              {c.code} ({c.symbol})
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 text-neutral-400 text-xs">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <ShieldCheck className="h-4 w-4" />
            No hidden setup fees
          </span>
          <span>&bull;</span>
          <span>Cancel anytime</span>
        </div>
      </div>
    </div>
  );
}

export default PricingCalculator;

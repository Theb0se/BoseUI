"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Check, Sparkles, Zap, Shield, ArrowRight, Sliders } from "lucide-react";
import { cn } from "@/lib/utils";

export interface InteractivePricingTierDialProps {
  /** Initial MAU count. Default: 50000 */
  initialUsers?: number;
  /** Currency symbol. Default: "$" */
  currency?: string;
  /** Annual billing discount percent. Default: 20 */
  annualDiscountPercent?: number;
  /** Callback when user clicks CTA button */
  onSelectPlan?: (tier: string, monthlyPrice: number, isAnnual: boolean) => void;
  className?: string;
}

export function InteractivePricingTierDial({
  initialUsers = 50000,
  currency = "$",
  annualDiscountPercent = 20,
  onSelectPlan,
  className,
}: InteractivePricingTierDialProps) {
  const [users, setUsers] = useState(initialUsers);
  const [isAnnual, setIsAnnual] = useState(true);
  const reduceMotion = useReducedMotion();

  // Tier calculation
  let tierName = "Pro";
  let basePrice = 29;
  let features = [
    "Unlimited Team Workspaces",
    "Real-time Collaboration Engine",
    "99.9% Uptime SLA Guarantee",
  ];

  if (users < 10000) {
    tierName = "Starter";
    basePrice = 0;
    features = [
      "Up to 3 Team Members",
      "Community Support Discord",
      "Standard Rate Limits (60 req/min)",
    ];
  } else if (users < 100000) {
    tierName = "Pro";
    basePrice = 29 + Math.round(((users - 10000) / 90000) * 60);
    features = [
      "Unlimited Team Workspaces",
      "Priority 24/7 Slack Support",
      "Advanced Rate Limits (600 req/min)",
    ];
  } else if (users < 500000) {
    tierName = "Growth";
    basePrice = 129 + Math.round(((users - 100000) / 400000) * 220);
    features = [
      "Custom Dedicated VPC Isolation",
      "SOC2 Type II Compliance Reports",
      "Dedicated Technical Account Manager",
    ];
  } else {
    tierName = "Scale";
    basePrice = 499 + Math.round(((users - 500000) / 500000) * 500);
    features = [
      "99.99% Multi-Region Enterprise SLA",
      "Custom SSO / SAML & SCIM Sync",
      "24/7 Dedicated Phone & Pager Duty",
    ];
  }

  const finalPrice =
    basePrice === 0
      ? 0
      : isAnnual
      ? Math.round(basePrice * (1 - annualDiscountPercent / 100))
      : basePrice;

  const formatUsers = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}k`;
    return num.toLocaleString();
  };

  return (
    <div
      className={cn(
        "relative w-full max-w-lg mx-auto overflow-hidden rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 backdrop-blur-xl p-6 sm:p-8 shadow-xl text-neutral-900 dark:text-neutral-100 font-sans",
        className
      )}
    >
      {/* Top Header & Annual Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 px-2.5 py-0.5 text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
            <Sparkles className="h-3 w-3 text-amber-400" />
            <span>Usage-Based Billing</span>
          </div>
          <h3 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Scale As You Grow
          </h3>
        </div>

        {/* Monthly vs Annual Switch */}
        <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-1 rounded-xl self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setIsAnnual(false)}
            className={cn(
              "px-3 py-1 text-xs font-medium rounded-lg transition-all",
              !isAnnual
                ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-xs font-semibold"
                : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
            )}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setIsAnnual(true)}
            className={cn(
              "px-3 py-1 text-xs font-medium rounded-lg transition-all flex items-center gap-1",
              isAnnual
                ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-xs font-semibold"
                : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
            )}
          >
            <span>Annual</span>
            <span className="text-[10px] bg-emerald-500 text-white px-1.5 py-0.2 rounded-full font-bold">
              -{annualDiscountPercent}%
            </span>
          </button>
        </div>
      </div>

      {/* Center Pricing Highlight */}
      <div className="py-6 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400 block mb-1">
            Active Tier: <span className="text-neutral-900 dark:text-white font-bold">{tierName}</span>
          </span>
          <div className="flex items-baseline gap-1 font-mono">
            <span className="text-4xl sm:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
              {basePrice === 0 ? "Free" : `${currency}${finalPrice}`}
            </span>
            {basePrice > 0 && (
              <span className="text-sm font-sans text-neutral-500 dark:text-neutral-400">
                / month
              </span>
            )}
          </div>
        </div>

        <div className="text-left sm:text-right font-mono text-xs text-neutral-500 dark:text-neutral-400">
          <span className="text-sm font-bold text-neutral-900 dark:text-white">
            {formatUsers(users)}
          </span>{" "}
          Monthly Active Users
        </div>
      </div>

      {/* Scrubbable Slider Controller */}
      <div className="py-6 space-y-3">
        <div className="flex items-center justify-between text-xs font-mono text-neutral-500 dark:text-neutral-400">
          <span>1,000 MAU</span>
          <span className="text-neutral-900 dark:text-white font-semibold flex items-center gap-1">
            <Sliders className="h-3 w-3" /> Drag to adjust
          </span>
          <span>1,000,000 MAU</span>
        </div>

        <div className="relative flex items-center">
          <input
            type="range"
            min={1000}
            max={1000000}
            step={5000}
            value={users}
            onChange={(e) => setUsers(Number(e.target.value))}
            className="w-full h-2.5 rounded-lg appearance-none cursor-pointer bg-neutral-200 dark:bg-neutral-800 accent-neutral-900 dark:accent-white focus:outline-none"
            aria-label="Monthly Active Users Slider"
          />
        </div>
      </div>

      {/* Tier Features Checklist */}
      <div className="pt-2 pb-6 space-y-2.5">
        {features.map((feature, i) => (
          <div key={i} className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400">
            <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">
              <Check className="h-2.5 w-2.5" />
            </div>
            <span>{feature}</span>
          </div>
        ))}
      </div>

      {/* CTA Button */}
      <button
        type="button"
        onClick={() => onSelectPlan?.(tierName, finalPrice, isAnnual)}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 py-3.5 px-6 font-semibold text-sm active:scale-98 transition-all shadow-lg"
      >
        <span>Get Started on {tierName}</span>
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}

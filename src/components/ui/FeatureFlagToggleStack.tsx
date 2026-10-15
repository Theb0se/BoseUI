"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Sliders,
  Shield,
  Check,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface FeatureFlag {
  id: string;
  key: string;
  title: string;
  description: string;
  enabled: boolean;
  rolloutPercentage: number;
  environment: "production" | "staging";
  targetingRules: string[];
}

export interface FeatureFlagToggleStackProps {
  /** Initial feature flags */
  initialFlags?: FeatureFlag[];
  /** Callback on change */
  onChange?: (flags: FeatureFlag[]) => void;
  className?: string;
}

const DEFAULT_FLAGS: FeatureFlag[] = [
  {
    id: "f-1",
    key: "ai_speculative_decoding",
    title: "Speculative Decoding v2",
    description: "Multi-token draft prediction engine for low-latency reasoning responses.",
    enabled: true,
    rolloutPercentage: 25,
    environment: "production",
    targetingRules: ["Tier Pro & Enterprise", "Internal Beta"],
  },
  {
    id: "f-2",
    key: "liquid_glass_shaders",
    title: "Liquid Glass 3D Refractions",
    description: "Client-side WebGL GPU shader caustics on card hover interactions.",
    enabled: true,
    rolloutPercentage: 75,
    environment: "production",
    targetingRules: ["All Users"],
  },
  {
    id: "f-3",
    key: "stripe_crypto_rails",
    title: "Solana USDC Settlements",
    description: "Direct instant invoice settlement via decentralized liquidity pools.",
    enabled: false,
    rolloutPercentage: 0,
    environment: "staging",
    targetingRules: ["Fintech Alpha"],
  },
];

export function FeatureFlagToggleStack({
  initialFlags = DEFAULT_FLAGS,
  onChange,
  className,
}: FeatureFlagToggleStackProps) {
  const [flags, setFlags] = useState<FeatureFlag[]>(initialFlags);

  const toggleFlag = (id: string) => {
    const next = flags.map((f) => {
      if (f.id === id) {
        const nextEnabled = !f.enabled;
        return {
          ...f,
          enabled: nextEnabled,
          rolloutPercentage: nextEnabled && f.rolloutPercentage === 0 ? 10 : f.rolloutPercentage,
        };
      }
      return f;
    });
    setFlags(next);
    onChange?.(next);
  };

  const updatePercentage = (id: string, percentage: number) => {
    const next = flags.map((f) => {
      if (f.id === id) {
        return {
          ...f,
          rolloutPercentage: percentage,
          enabled: percentage > 0,
        };
      }
      return f;
    });
    setFlags(next);
    onChange?.(next);
  };

  return (
    <div
      className={cn(
        "w-full rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col gap-5",
        className
      )}
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 dark:border-neutral-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="h-4 w-4 text-emerald-500" />
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white tracking-tight">Feature Flags &amp; Rollouts</h3>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Gradual traffic allocation with kill-switch protection and targeting rules.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-semibold">
            {flags.filter((f) => f.enabled).length}/{flags.length} Active
          </span>
        </div>
      </div>

      {/* Flag Items List */}
      <div className="flex flex-col gap-3">
        {flags.map((flag) => (
          <div
            key={flag.id}
            className={cn(
              "p-4 rounded-xl border transition-all flex flex-col gap-3.5",
              flag.enabled
                ? "bg-neutral-50 dark:bg-neutral-900/60 border-neutral-200 dark:border-neutral-800"
                : "bg-neutral-50/50 dark:bg-neutral-900/20 border-neutral-200/50 dark:border-neutral-800/50 opacity-70"
            )}
          >
            {/* Top row: Title + Master Toggle */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-neutral-900 dark:text-white text-sm">{flag.title}</span>
                  <span
                    className={cn(
                      "text-[9px] font-mono uppercase px-1.5 py-0.2 rounded border",
                      flag.environment === "production"
                        ? "bg-rose-500/10 text-rose-500 border-rose-500/20"
                        : "bg-blue-500/10 text-blue-500 border-blue-500/20"
                    )}
                  >
                    {flag.environment}
                  </span>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">{flag.description}</p>
                <span className="font-mono text-[11px] text-neutral-400 mt-0.5">
                  key: <code className="text-neutral-900 dark:text-neutral-200">{flag.key}</code>
                </span>
              </div>

              {/* Master Toggle */}
              <button
                onClick={() => toggleFlag(flag.id)}
                className={cn(
                  "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                  flag.enabled ? "bg-emerald-500" : "bg-neutral-200 dark:bg-neutral-800"
                )}
              >
                <span
                  className={cn(
                    "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white dark:bg-neutral-100 shadow-lg ring-0 transition duration-200 ease-in-out",
                    flag.enabled ? "translate-x-5" : "translate-x-0"
                  )}
                />
              </button>
            </div>

            {/* Rollout Slider & Targeting Rules */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-neutral-200 dark:border-neutral-800 text-xs">
              {/* Traffic Percentage Slider */}
              <div className="flex items-center gap-3 flex-1 max-w-xs">
                <span className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400 font-semibold shrink-0">
                  Rollout:
                </span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={flag.rolloutPercentage}
                  onChange={(e) => updatePercentage(flag.id, Number(e.target.value))}
                  disabled={!flag.enabled}
                  className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 disabled:opacity-40"
                />
                <span className="font-mono text-neutral-900 dark:text-white font-bold w-10 text-right">
                  {flag.rolloutPercentage}%
                </span>
              </div>

              {/* Targeting Rules */}
              <div className="flex flex-wrap items-center gap-1.5">
                <Users className="h-3 w-3 text-neutral-400" />
                {flag.targetingRules.map((rule) => (
                  <span
                    key={rule}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300 font-mono"
                  >
                    {rule}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

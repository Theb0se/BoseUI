"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Check, Minus, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CompareTier {
  id: string;
  name: string;
  price: string;
  badge?: string;
  highlighted?: boolean;
}

export interface CompareSpecRow {
  feature: string;
  category?: string;
  values: Record<string, boolean | string>;
}

export interface ProductCompareTableProps {
  /** Columns / product tiers to compare */
  tiers?: CompareTier[];
  /** Specification rows with boolean (Check/Dash) or string values per tier id */
  rows?: CompareSpecRow[];
  /** Show toggle to filter only rows where tiers differ. Default: true */
  allowDiffFilter?: boolean;
  className?: string;
}

const DEFAULT_TIERS: CompareTier[] = [
  { id: "core", name: "Core", price: "$0" },
  { id: "pro", name: "Pro", price: "$29", badge: "Popular", highlighted: true },
  { id: "enterprise", name: "Scale", price: "$99" },
];

const DEFAULT_ROWS: CompareSpecRow[] = [
  {
    feature: "Framer Motion Spring Primitives",
    values: { core: true, pro: true, enterprise: true },
  },
  {
    feature: "CLI Registry Installation",
    values: { core: true, pro: true, enterprise: true },
  },
  {
    feature: "Dark & Light Theme Tokens",
    values: { core: true, pro: true, enterprise: true },
  },
  {
    feature: "Multi-Step Wizard & Command Menu",
    values: { core: false, pro: true, enterprise: true },
  },
  {
    feature: "Custom Figma Design Kit",
    values: { core: false, pro: true, enterprise: true },
  },
  {
    feature: "Dedicated SLA & Architecture Review",
    values: { core: false, pro: false, enterprise: true },
  },
  {
    feature: "Concurrent Team Seats",
    values: { core: "1 seat", pro: "Up to 10", enterprise: "Unlimited" },
  },
];

export function ProductCompareTable({
  tiers = DEFAULT_TIERS,
  rows = DEFAULT_ROWS,
  allowDiffFilter = true,
  className,
}: ProductCompareTableProps) {
  const [onlyDifferences, setOnlyDifferences] = useState(false);

  const visibleRows = useMemo(() => {
    if (!onlyDifferences) return rows;
    return rows.filter((row) => {
      const vals = tiers.map((t) => row.values[t.id]);
      return new Set(vals).size > 1;
    });
  }, [rows, tiers, onlyDifferences]);

  return (
    <div
      className={cn(
        "w-full max-w-2xl overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-[#0A0A0A]",
        className
      )}
    >
      {/* Top Filter Header */}
      {allowDiffFilter && (
        <div className="flex items-center justify-between border-b border-neutral-200 bg-neutral-50/70 px-5 py-3 dark:border-neutral-800 dark:bg-neutral-900/50">
          <span className="text-xs font-semibold text-neutral-900 dark:text-white">
            Compare Specifications
          </span>

          <button
            type="button"
            role="switch"
            aria-checked={onlyDifferences}
            onClick={() => setOnlyDifferences((v) => !v)}
            className="inline-flex items-center gap-2 text-xs font-medium text-neutral-600 dark:text-neutral-300"
          >
            <span>Show differences only</span>
            <span
              className={cn(
                "relative inline-flex h-5 w-9 items-center rounded-full p-0.5 transition-colors",
                onlyDifferences
                  ? "bg-neutral-900 dark:bg-white"
                  : "bg-neutral-300 dark:bg-neutral-700"
              )}
            >
              <motion.span
                layout
                transition={{ type: "spring", stiffness: 500, damping: 32 }}
                className={cn(
                  "h-4 w-4 rounded-full bg-white shadow-2xs dark:bg-black",
                  onlyDifferences ? "ml-auto" : "ml-0"
                )}
              />
            </span>
          </button>
        </div>
      )}

      {/* Scrollable Table Container with Sticky Header */}
      <div data-fullscreen-scroll className="max-h-[340px] overflow-auto">
        <table className="w-full border-collapse text-left text-xs">
          <thead className="sticky top-0 z-20 border-b border-neutral-200 bg-white/95 backdrop-blur-md dark:border-neutral-800 dark:bg-[#0A0A0A]/95">
            <tr>
              <th className="min-w-[160px] px-5 py-4 font-mono text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                Feature
              </th>
              {tiers.map((tier) => (
                <th
                  key={tier.id}
                  className={cn(
                    "min-w-[100px] px-4 py-3.5 text-center",
                    tier.highlighted &&
                      "bg-neutral-50/90 dark:bg-neutral-900/60"
                  )}
                >
                  <div className="flex flex-col items-center gap-0.5">
                    {tier.badge && (
                      <span className="mb-0.5 inline-flex items-center gap-1 rounded-full bg-neutral-900 px-2 py-0.2 font-mono text-[9px] font-semibold uppercase text-white dark:bg-white dark:text-black">
                        <Sparkles className="h-2.5 w-2.5" />
                        {tier.badge}
                      </span>
                    )}
                    <span className="text-xs font-bold text-neutral-950 dark:text-white">
                      {tier.name}
                    </span>
                    <span className="font-mono text-[11px] text-neutral-500 dark:text-neutral-400">
                      {tier.price}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-neutral-200/80 dark:divide-neutral-800/80">
            {visibleRows.map((row) => (
              <tr
                key={row.feature}
                className="transition-colors hover:bg-neutral-50/60 dark:hover:bg-neutral-900/30"
              >
                <td className="px-5 py-3.5 font-medium text-neutral-800 dark:text-neutral-200">
                  {row.feature}
                </td>
                {tiers.map((tier) => {
                  const val = row.values[tier.id];
                  return (
                    <td
                      key={tier.id}
                      className={cn(
                        "px-4 py-3.5 text-center",
                        tier.highlighted &&
                          "bg-neutral-50/50 dark:bg-neutral-900/30"
                      )}
                    >
                      {typeof val === "boolean" ? (
                        val ? (
                          <span
                            aria-label="Included"
                            className="mx-auto inline-flex h-5 w-5 items-center justify-center rounded-full bg-neutral-900 text-white dark:bg-white dark:text-black"
                          >
                            <Check className="h-3 w-3 stroke-[2.5]" />
                          </span>
                        ) : (
                          <span
                            aria-label="Not included"
                            className="mx-auto inline-flex h-5 w-5 items-center justify-center text-neutral-300 dark:text-neutral-700"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </span>
                        )
                      ) : (
                        <span className="font-mono text-[11px] font-semibold text-neutral-900 dark:text-white">
                          {val ?? "—"}
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProductCompareTable;

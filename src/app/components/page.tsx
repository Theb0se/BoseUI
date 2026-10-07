"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  ArrowUpRight,
  Check,
  Copy,
  Terminal,
} from "lucide-react";
import { PULSE_COMPONENTS } from "@/registry/generated-catalog";
import { COMPONENT_DEMOS } from "@/registry/generated-demos";
import {
  COMPONENT_CATEGORIES,
  type ComponentCategory,
} from "@/types/component";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { cn, copyToClipboard } from "@/lib/utils";

export default function ComponentsDirectoryPage() {
  const [selectedCategory, setSelectedCategory] = useState<
    ComponentCategory | "All"
  >("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  const filteredComponents = useMemo(() => {
    return PULSE_COMPONENTS.filter((comp) => {
      const matchesCategory =
        selectedCategory === "All" || comp.category === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      if (!q) return matchesCategory;

      const matchesSearch =
        comp.title.toLowerCase().includes(q) ||
        comp.slug.toLowerCase().includes(q) ||
        comp.description.toLowerCase().includes(q) ||
        comp.tagline.toLowerCase().includes(q) ||
        comp.badges.some((b) => b.toLowerCase().includes(q)) ||
        (comp.keywords || []).some((k) => k.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleCopyCli = async (
    e: React.MouseEvent,
    slug: string,
    cliCommand: string
  ) => {
    e.preventDefault();
    e.stopPropagation();
    const ok = await copyToClipboard(cliCommand);
    if (ok) {
      setCopiedSlug(slug);
      setTimeout(() => setCopiedSlug(null), 1800);
    }
  };

  return (
    <div className="px-4 py-10 sm:px-8 lg:py-12">
      {/* Directory Header */}
      <div className="flex flex-col justify-between gap-6 border-b border-neutral-200 pb-8 dark:border-[#1F1F1F] lg:flex-row lg:items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-black dark:text-white sm:text-4xl">
            Components
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
            Minimal React primitives powered by Framer Motion spring physics.
          </p>
        </div>

        {/* Live Search Input */}
        <div className="relative w-full lg:w-72">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400 dark:text-neutral-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter components..."
            aria-label="Filter components"
            className="h-10 w-full rounded-xl border border-neutral-200 bg-neutral-50 pl-10 pr-4 text-xs text-black placeholder-neutral-400 transition-colors focus:border-black focus:outline-none dark:border-[#262626] dark:bg-[#0A0A0A] dark:text-white dark:placeholder-neutral-500 dark:focus:border-white"
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="mt-6 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setSelectedCategory("All")}
          className={cn(
            "rounded-lg border px-3 py-1.5 font-mono text-xs transition-colors",
            selectedCategory === "All"
              ? "border-black bg-black font-semibold text-white dark:border-white dark:bg-white dark:text-black"
              : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400 hover:text-black dark:border-[#222222] dark:bg-[#0A0A0A] dark:text-neutral-400 dark:hover:border-neutral-600 dark:hover:text-white"
          )}
        >
          All ({PULSE_COMPONENTS.length})
        </button>

        {COMPONENT_CATEGORIES.map((category) => {
          const count = PULSE_COMPONENTS.filter(
            (c) => c.category === category
          ).length;
          if (count === 0) return null;
          return (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={cn(
                "rounded-lg border px-3 py-1.5 font-mono text-xs transition-colors",
                selectedCategory === category
                  ? "border-black bg-black font-semibold text-white dark:border-white dark:bg-white dark:text-black"
                  : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400 hover:text-black dark:border-[#222222] dark:bg-[#0A0A0A] dark:text-neutral-400 dark:hover:border-neutral-600 dark:hover:text-white"
              )}
            >
              {category} ({count})
            </button>
          );
        })}
      </div>

      {/* Component Directory Grid */}
      {filteredComponents.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-neutral-200 bg-neutral-50 p-12 text-center dark:border-[#1F1F1F] dark:bg-[#0A0A0A]">
          <p className="text-sm font-medium text-black dark:text-white">
            No components match your filter criteria.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory("All");
              setSearchQuery("");
            }}
            className="mt-4 rounded-lg bg-black px-4 py-2 font-mono text-xs font-medium text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
          {filteredComponents.map((comp) => {
            const Demo = COMPONENT_DEMOS[comp.slug];

            return (
              <SpotlightCard
                key={comp.slug}
                className="flex flex-col justify-between gap-5 p-6"
              >
                <div>
                  {/* Live Interactive Preview Stage */}
                  <div className="relative mb-5 flex min-h-[220px] items-center justify-center overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50/70 bg-dot-matrix p-5 [background-size:18px_18px] dark:border-[#1F1F1F] dark:bg-black">
                    {Demo ? (
                      <Demo />
                    ) : (
                      <span className="font-mono text-xs text-neutral-500">
                        Preview unavailable
                      </span>
                    )}
                  </div>

                  {/* Title & Concise Description */}
                  <Link
                    href={`/components/${comp.slug}`}
                    className="group/title block"
                  >
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-bold text-black transition-colors group-hover/title:underline dark:text-white">
                        {comp.title}
                      </h2>
                      <span className="rounded-md border border-neutral-200 bg-neutral-100 px-2 py-0.5 font-mono text-[10px] text-neutral-600 dark:border-[#262626] dark:bg-[#121212] dark:text-neutral-400">
                        {comp.category}
                      </span>
                    </div>
                    <p className="mt-1.5 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
                      {comp.description}
                    </p>
                  </Link>
                </div>

                {/* Bottom Actions */}
                <div className="flex items-center justify-between gap-2 border-t border-neutral-200 pt-4 dark:border-[#1F1F1F]">
                  <button
                    type="button"
                    onClick={(e) =>
                      handleCopyCli(e, comp.slug, comp.cliCommand)
                    }
                    className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 font-mono text-[11px] text-neutral-700 transition-colors hover:border-black hover:text-black dark:border-[#262626] dark:bg-black dark:text-neutral-300 dark:hover:border-white dark:hover:text-white"
                  >
                    {copiedSlug === comp.slug ? (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        <span>Copied CLI</span>
                      </>
                    ) : (
                      <>
                        <Terminal className="h-3.5 w-3.5 opacity-60" />
                        <span>Copy CLI</span>
                        <Copy className="ml-0.5 h-3 w-3 opacity-60" />
                      </>
                    )}
                  </button>

                  <Link
                    href={`/components/${comp.slug}`}
                    className="inline-flex items-center gap-1 rounded-lg bg-black px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
                  >
                    <span>Open</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </SpotlightCard>
            );
          })}
        </div>
      )}
    </div>
  );
}

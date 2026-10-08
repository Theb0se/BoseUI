"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  ArrowUpRight,
  Check,
  Copy,
  Terminal,
  LayoutGrid,
  List,
  X,
} from "lucide-react";
import { PULSE_COMPONENTS } from "@/registry/generated-catalog";
import { COMPONENT_DEMOS } from "@/registry/generated-demos";
import {
  COMPONENT_CATEGORIES,
  type ComponentCategory,
} from "@/types/component";
import { cn, copyToClipboard } from "@/lib/utils";

export default function ComponentsDirectoryPage() {
  const [selectedCategory, setSelectedCategory] = useState<
    ComponentCategory | "All"
  >("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"preview" | "compact">("preview");

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
    <div className="mx-auto max-w-[1140px] px-4 py-8 sm:px-8 lg:py-12">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-6 border-b border-neutral-200 pb-8 dark:border-neutral-900 lg:flex-row lg:items-end">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 font-mono text-[11px] font-medium text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900/70 dark:text-neutral-400">
            <span>{PULSE_COMPONENTS.length} Ready-to-Use Components</span>
          </div>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-neutral-950 dark:text-white sm:text-4xl">
            Components
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 sm:text-[15px]">
            Copy-paste React components built with Framer Motion, Tailwind CSS,
            and TypeScript. Test them live below, copy the CLI command, or open
            any component for full source code and props.
          </p>
        </div>

        {/* Search & View Controls */}
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-64">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search components..."
              aria-label="Search components"
              className="h-10 w-full rounded-xl border border-neutral-200 bg-white pl-10 pr-8 text-xs text-neutral-900 placeholder:text-neutral-400 transition-colors focus:border-neutral-900 focus:outline-none dark:border-neutral-800 dark:bg-neutral-950 dark:text-white dark:placeholder:text-neutral-500 dark:focus:border-white"
            />
            {searchQuery && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* View Mode Switcher */}
          <div
            role="group"
            aria-label="View mode"
            className="inline-flex h-10 shrink-0 items-center rounded-xl border border-neutral-200 bg-neutral-100/80 p-1 dark:border-neutral-800 dark:bg-neutral-900/70"
          >
            <button
              type="button"
              onClick={() => setViewMode("preview")}
              className={cn(
                "inline-flex h-full items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium transition-colors",
                viewMode === "preview"
                  ? "bg-white text-neutral-950 shadow-2xs dark:bg-neutral-950 dark:text-white"
                  : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
              )}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>Previews</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("compact")}
              className={cn(
                "inline-flex h-full items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium transition-colors",
                viewMode === "compact"
                  ? "bg-white text-neutral-950 shadow-2xs dark:bg-neutral-950 dark:text-white"
                  : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
              )}
            >
              <List className="h-3.5 w-3.5" />
              <span>Index</span>
            </button>
          </div>
        </div>
      </div>

      {/* Category Filter Bar */}
      <div className="mt-5 flex items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setSelectedCategory("All")}
            className={cn(
              "rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
              selectedCategory === "All"
                ? "border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-black"
                : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 hover:text-neutral-950 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-400 dark:hover:border-neutral-700 dark:hover:text-white"
            )}
          >
            All{" "}
            <span className="ml-1 font-mono text-[11px] opacity-70">
              {PULSE_COMPONENTS.length}
            </span>
          </button>

          {COMPONENT_CATEGORIES.map((category) => {
            const count = PULSE_COMPONENTS.filter(
              (c) => c.category === category
            ).length;
            if (count === 0) return null;
            const isSelected = selectedCategory === category;

            return (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  "rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
                  isSelected
                    ? "border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-black"
                    : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 hover:text-neutral-950 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-400 dark:hover:border-neutral-700 dark:hover:text-white"
                )}
              >
                {category}{" "}
                <span className="ml-1 font-mono text-[11px] opacity-70">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Area */}
      {filteredComponents.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-neutral-200 bg-neutral-50/50 p-12 text-center dark:border-neutral-900 dark:bg-neutral-950">
          <p className="text-sm font-medium text-neutral-900 dark:text-white">
            No components found matching &ldquo;{searchQuery}&rdquo;
          </p>
          <p className="mt-1 text-xs text-neutral-500">
            Try searching by category (like Inputs, Overlays, Buttons) or clear
            your filter.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory("All");
              setSearchQuery("");
            }}
            className="mt-4 rounded-xl bg-neutral-900 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
          >
            Reset Filters
          </button>
        </div>
      ) : viewMode === "compact" ? (
        /* Compact Index Grid (3 columns) */
        <div className="mt-7 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredComponents.map((comp) => (
            <Link
              key={comp.slug}
              href={`/components/${comp.slug}`}
              className="group flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-5 transition-all hover:border-neutral-900 hover:shadow-sm dark:border-neutral-800 dark:bg-[#0A0A0A] dark:hover:border-neutral-300"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h2 className="text-sm font-semibold text-neutral-950 group-hover:underline dark:text-white">
                    {comp.title}
                  </h2>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-neutral-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-neutral-950 dark:group-hover:text-white" />
                </div>
                <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
                  {comp.description}
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-3 dark:border-neutral-900">
                <span className="rounded-md border border-neutral-200 bg-neutral-50 px-2 py-0.5 font-mono text-[10px] font-medium text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
                  {comp.category}
                </span>
                <span className="font-mono text-[11px] text-neutral-400">
                  {comp.props.length} props
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        /* Interactive Preview Grid (2 columns) */
        <div className="mt-7 grid grid-cols-1 gap-6 xl:grid-cols-2">
          {filteredComponents.map((comp) => {
            const Demo = COMPONENT_DEMOS[comp.slug];

            return (
              <div
                key={comp.slug}
                className="flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white transition-colors hover:border-neutral-300 dark:border-neutral-800/90 dark:bg-[#0A0A0A] dark:hover:border-neutral-700"
              >
                {/* Top Card Header */}
                <div className="flex items-center justify-between gap-3 border-b border-neutral-100 px-5 py-3.5 dark:border-neutral-900">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <Link
                      href={`/components/${comp.slug}`}
                      className="truncate text-sm font-semibold text-neutral-950 hover:underline dark:text-white"
                    >
                      {comp.title}
                    </Link>
                    <span className="shrink-0 rounded-md border border-neutral-200 bg-neutral-50 px-2 py-0.5 font-mono text-[10px] font-medium text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
                      {comp.category}
                    </span>
                  </div>

                  <Link
                    href={`/components/${comp.slug}`}
                    className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-neutral-200 bg-white px-2.5 py-1 text-xs font-medium text-neutral-700 transition-colors hover:border-neutral-900 hover:text-neutral-950 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300 dark:hover:border-white dark:hover:text-white"
                  >
                    <span>Docs & Code</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>

                {/* Live Interactive Preview Stage (unclipped for dropdowns) */}
                <div className="relative flex min-h-[240px] items-center justify-center p-6">
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-2 overflow-hidden rounded-xl bg-neutral-50/70 bg-dot-matrix [background-size:18px_18px] dark:bg-[#050505]"
                  />
                  <div className="relative z-10 flex w-full items-center justify-center">
                    {Demo ? (
                      <Demo />
                    ) : (
                      <span className="font-mono text-xs text-neutral-400">
                        Preview unavailable
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Footer: Description + Quick Copy CLI */}
                <div className="flex flex-col justify-between gap-3 border-t border-neutral-100 bg-neutral-50/40 px-5 py-3.5 dark:border-neutral-900 dark:bg-neutral-950/50 sm:flex-row sm:items-center">
                  <p className="line-clamp-1 text-xs text-neutral-600 dark:text-neutral-400">
                    {comp.description}
                  </p>

                  <button
                    type="button"
                    onClick={(e) =>
                      handleCopyCli(e, comp.slug, comp.cliCommand)
                    }
                    className={cn(
                      "inline-flex shrink-0 items-center gap-1.5 rounded-lg border px-2.5 py-1.5 font-mono text-[11px] font-medium transition-colors",
                      copiedSlug === comp.slug
                        ? "border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-black"
                        : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-900 hover:text-neutral-950 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-white dark:hover:text-white"
                    )}
                  >
                    {copiedSlug === comp.slug ? (
                      <>
                        <Check className="h-3 w-3" />
                        <span>Copied CLI</span>
                      </>
                    ) : (
                      <>
                        <Terminal className="h-3 w-3 opacity-60" />
                        <span>npx shadcn add</span>
                        <Copy className="ml-0.5 h-3 w-3 opacity-60" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

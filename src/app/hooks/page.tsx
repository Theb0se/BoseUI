"use client";

import React, { useMemo, useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Search,
  ArrowUpRight,
  List,
  X,
  ArrowUpDown,
  Table,
  RotateCcw,
  SlidersHorizontal,
  ShieldCheck,
} from "lucide-react";
import { HOOKS_REGISTRY } from "@/hooks-lib/registry";
import { HOOK_CATEGORIES, type HookCategory } from "@/hooks-lib/types";
import { cn } from "@/lib/utils";

type SortOption = "default" | "name-asc" | "size-asc";

export default function HooksDirectoryPage() {
  const [selectedCategory, setSelectedCategory] = useState<
    HookCategory | "All"
  >("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [viewMode, setViewMode] = useState<"compact" | "table">("compact");

  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "/" &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const filteredHooks = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    const matches = HOOKS_REGISTRY.filter((hook) => {
      const matchesCategory =
        selectedCategory === "All"
          ? true
          : hook.category === selectedCategory;

      if (!matchesCategory) return false;
      if (!q) return true;

      return (
        hook.name.toLowerCase().includes(q) ||
        hook.slug.toLowerCase().includes(q) ||
        hook.description.toLowerCase().includes(q) ||
        hook.category.toLowerCase().includes(q) ||
        hook.tags.some((t) => t.toLowerCase().includes(q))
      );
    });

    if (sortBy === "name-asc") {
      return [...matches].sort((a, b) => a.name.localeCompare(b.name));
    }
    if (sortBy === "size-asc") {
      return [...matches].sort((a, b) => a.sizeBytes - b.sizeBytes);
    }
    return matches;
  }, [selectedCategory, searchQuery, sortBy]);

  return (
    <div className="mx-auto max-w-[1240px] px-4 py-8 sm:px-6 lg:py-12">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-6 pb-6 dark:border-neutral-800 lg:flex-row lg:items-end">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1 font-mono text-[11px] text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
              <span>Zero Dependencies</span>
            </span>

            <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1 font-mono text-[11px] text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
              <span>{HOOKS_REGISTRY.length} Hooks</span>
            </span>

            <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1 font-mono text-[11px] text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
              <span>SSR Safe · Strict TS</span>
            </span>
          </div>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-neutral-950 dark:text-white sm:text-4xl lg:text-5xl">
            React Hooks
          </h1>

          <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 sm:text-[15px]">
            Copy-paste, SSR-safe React hooks written in strict TypeScript with
            zero external dependencies. Test each hook live, inspect edge cases,
            and copy directly into your codebase.
          </p>
        </div>
      </div>

      {/* Control Bar: Search + Sort + View */}
      <div className="flex flex-col gap-2.5 border-b border-neutral-200/80 pb-6 dark:border-neutral-800 sm:flex-row sm:items-center">
        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search hooks or tags..."
            aria-label="Search hooks"
            className="h-10 w-full rounded-xl border border-neutral-200 bg-white pl-10 pr-14 text-xs text-neutral-900 placeholder:text-neutral-400 transition-colors focus:border-neutral-900 focus:outline-none dark:border-neutral-800 dark:bg-neutral-950 dark:text-white dark:placeholder:text-neutral-500 dark:focus:border-white"
          />
          {searchQuery ? (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => {
                setSearchQuery("");
                searchInputRef.current?.focus();
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-1 text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          ) : (
            <kbd className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rounded border border-neutral-200 bg-neutral-100 px-1.5 py-0.5 font-mono text-[10px] text-neutral-400 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-500">
              /
            </kbd>
          )}
        </div>

        <div className="relative shrink-0">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            aria-label="Sort hooks"
            className="h-10 appearance-none rounded-xl border border-neutral-200 bg-white pl-3.5 pr-8 text-xs font-medium text-neutral-700 transition-colors hover:border-neutral-300 focus:border-neutral-900 focus:outline-none dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300 dark:hover:border-neutral-700 dark:focus:border-white"
          >
            <option value="default">Recommended</option>
            <option value="name-asc">Alphabetical (A-Z)</option>
            <option value="size-asc">Smallest Bundle</option>
          </select>
          <ArrowUpDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
        </div>

        <div
          role="group"
          aria-label="View mode"
          className="inline-flex h-10 shrink-0 items-center rounded-xl border border-neutral-200 bg-neutral-100/80 p-1 dark:border-neutral-800 dark:bg-neutral-900/70"
        >
          <button
            type="button"
            onClick={() => setViewMode("compact")}
            title="Compact cards index"
            aria-pressed={viewMode === "compact"}
            className={cn(
              "inline-flex h-full items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium transition-colors",
              viewMode === "compact"
                ? "bg-white text-neutral-950 shadow-2xs dark:bg-neutral-950 dark:text-white"
                : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
            )}
          >
            <List className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Cards</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("table")}
            title="Dense developer table index"
            aria-pressed={viewMode === "table"}
            className={cn(
              "inline-flex h-full items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium transition-colors",
              viewMode === "table"
                ? "bg-white text-neutral-950 shadow-2xs dark:bg-neutral-950 dark:text-white"
                : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
            )}
          >
            <Table className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Index</span>
          </button>
        </div>
      </div>

      {/* Category Filter Pills Bar */}
      <div className="mt-6 flex items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setSelectedCategory("All")}
            className={cn(
              "rounded-xl border px-3 py-1.5 text-xs font-medium transition-colors",
              selectedCategory === "All"
                ? "border-neutral-900 bg-neutral-900 font-semibold text-white dark:border-white dark:bg-white dark:text-black"
                : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 hover:text-neutral-950 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-400 dark:hover:border-neutral-700 dark:hover:text-white"
            )}
          >
            All ({HOOKS_REGISTRY.length})
          </button>

          {HOOK_CATEGORIES.map((category) => {
            const count = HOOKS_REGISTRY.filter(
              (h) => h.category === category
            ).length;
            if (count === 0) return null;
            const isSelected = selectedCategory === category;

            return (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  "rounded-xl border px-3 py-1.5 text-xs font-medium transition-colors",
                  isSelected
                    ? "border-neutral-900 bg-neutral-900 font-semibold text-white dark:border-white dark:bg-white dark:text-black"
                    : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 hover:text-neutral-950 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-400 dark:hover:border-neutral-700 dark:hover:text-white"
                )}
              >
                {category} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Results Showcase */}
      {filteredHooks.length === 0 ? (
        <div className="mt-12 flex min-h-[300px] flex-col items-center justify-center rounded-3xl border border-dashed border-neutral-300 bg-neutral-50/50 p-10 text-center dark:border-neutral-800 dark:bg-neutral-950/50">
          <SlidersHorizontal className="h-8 w-8 text-neutral-400 dark:text-neutral-600" />
          <h2 className="mt-3.5 text-base font-semibold text-neutral-900 dark:text-white">
            No hooks found matching &ldquo;{searchQuery}&rdquo;
          </h2>
          <p className="mt-1.5 max-w-sm text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
            Try searching for terms like &ldquo;debounce&rdquo;, &ldquo;storage&rdquo;,
            &ldquo;media&rdquo;, or reset your active filters.
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => {
                setSelectedCategory("All");
                setSearchQuery("");
              }}
              className="inline-flex items-center gap-1.5 rounded-xl bg-neutral-900 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset All Filters</span>
            </button>
          </div>
        </div>
      ) : viewMode === "compact" ? (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredHooks.map((hook) => (
            <Link
              key={hook.slug}
              href={`/hooks/${hook.slug}`}
              className="group flex flex-col justify-between rounded-2xl border border-neutral-200/90 bg-white p-5 transition-all hover:border-neutral-400 hover:shadow-2xs dark:border-neutral-800 dark:bg-[#0A0A0A] dark:hover:border-neutral-700"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="font-mono text-sm font-semibold text-neutral-950 transition-colors group-hover:underline dark:text-white">
                    {hook.name}
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-neutral-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-neutral-950 dark:group-hover:text-white" />
                </div>

                <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
                  {hook.description}
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                  <span className="rounded-md border border-neutral-200 bg-neutral-50 px-2 py-0.5 font-mono text-[10px] font-medium text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
                    {hook.category}
                  </span>
                  {hook.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md bg-neutral-100 px-1.5 py-0.5 font-mono text-[10px] text-neutral-500 dark:bg-neutral-900/60 dark:text-neutral-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-neutral-100 pt-3.5 dark:border-neutral-900">
                <span className="inline-flex items-center gap-1 font-mono text-[11px] text-neutral-400">
                  {hook.ssrSafe && (
                    <ShieldCheck className="h-3 w-3 text-emerald-500" />
                  )}
                  <span>{hook.sizeBytes} B</span>
                </span>

                <span className="font-mono text-[11px] text-neutral-500 dark:text-neutral-400">
                  {hook.params.length}{" "}
                  {hook.params.length === 1 ? "param" : "params"}
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-8 overflow-hidden rounded-2xl border border-neutral-200/90 bg-white shadow-2xs dark:border-neutral-800 dark:bg-[#0A0A0A]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-neutral-200/80 bg-neutral-50/70 font-mono text-[11px] text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900/50 dark:text-neutral-400">
                <tr>
                  <th className="px-5 py-3 font-medium">Hook</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="hidden px-4 py-3 font-medium md:table-cell">
                    Tags
                  </th>
                  <th className="hidden px-4 py-3 font-medium sm:table-cell">
                    SSR Safe
                  </th>
                  <th className="px-4 py-3 text-right font-medium">Size</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-900">
                {filteredHooks.map((hook) => (
                  <tr
                    key={hook.slug}
                    className="transition-colors hover:bg-neutral-50/60 dark:hover:bg-neutral-900/40"
                  >
                    <td className="px-5 py-3.5 font-medium">
                      <Link
                        href={`/hooks/${hook.slug}`}
                        className="group flex items-center gap-1.5 font-mono text-neutral-950 hover:underline dark:text-white"
                      >
                        <span>{hook.name}</span>
                        <ArrowUpRight className="h-3.5 w-3.5 text-neutral-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </Link>
                      <p className="mt-0.5 line-clamp-1 max-w-md text-[11px] text-neutral-500 dark:text-neutral-400">
                        {hook.description}
                      </p>
                    </td>

                    <td className="px-4 py-3.5">
                      <span className="rounded-md border border-neutral-200 bg-neutral-50 px-2 py-0.5 font-mono text-[10px] text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
                        {hook.category}
                      </span>
                    </td>

                    <td className="hidden px-4 py-3.5 md:table-cell">
                      <div className="flex flex-wrap items-center gap-1">
                        {hook.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-[10px] text-neutral-500 dark:bg-neutral-900 dark:text-neutral-400"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="hidden px-4 py-3.5 font-mono text-[11px] text-neutral-500 dark:text-neutral-400 sm:table-cell">
                      {hook.ssrSafe ? "Yes" : "No"}
                    </td>

                    <td className="px-4 py-3.5 text-right font-mono text-[11px] text-neutral-500 dark:text-neutral-400">
                      {hook.sizeBytes} B
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

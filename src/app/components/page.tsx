"use client";

import React, { useMemo, useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  Search,
  ArrowUpRight,
  Check,
  Copy,
  Terminal,
  LayoutGrid,
  List,
  Layers,
  X,
  Sparkles,
  ArrowUpDown,
  Table,
  RotateCcw,
  SlidersHorizontal,
} from "lucide-react";
import { PULSE_COMPONENTS } from "@/registry/generated-catalog";
import { COMPONENT_DEMOS } from "@/registry/generated-demos";
import {
  COMPONENT_CATEGORIES,
  type ComponentCategory,
  type PulseComponentCatalogEntry,
} from "@/types/component";
import { isBlock } from "@/lib/blocks";
import { cn, copyToClipboard } from "@/lib/utils";

type SortOption = "featured" | "name-asc" | "newest" | "props-desc";


function LazyDemoStage({
  Demo,
  title,
}: {
  Demo?: React.ComponentType;
  title: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasEnteredViewport, setHasEnteredViewport] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Pre-mount when within 300px of viewport to prevent jank while avoiding running animation loops simultaneously
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setHasEnteredViewport(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative flex min-h-[250px] w-full items-center justify-center p-6"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-2 overflow-hidden rounded-xl bg-neutral-50/70 bg-dot-matrix [background-size:18px_18px] dark:bg-[#050505]"
      />
      <div className="relative z-10 flex w-full items-center justify-center">
        {hasEnteredViewport && Demo ? (
          <Demo />
        ) : (
          <div className="flex h-32 w-full flex-col items-center justify-center gap-2 font-mono text-xs text-neutral-400">
            <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white/80 px-3 py-1 shadow-2xs backdrop-blur-xs dark:border-neutral-800 dark:bg-neutral-900/80">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Scroll to preview {title}</span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ComponentsDirectoryPage() {
  const [selectedCategory, setSelectedCategory] = useState<
    ComponentCategory | "All" | "Featured"
  >("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"compact" | "table">(
    "compact"
  );

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut: press '/' or 'Cmd+K' to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === "/" || (e.key === "k" && (e.metaKey || e.ctrlKey))) &&
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

  // Filter out composite blocks (which belong on /blocks) while keeping all kinetic primitives and atmospheric backgrounds
  const uiComponents = useMemo(() => {
    return PULSE_COMPONENTS.filter((comp) => !isBlock(comp.slug));
  }, []);

  // Visible categories for UI components (including Backgrounds)
  const availableCategories = useMemo(() => {
    return COMPONENT_CATEGORIES.filter((cat) =>
      uiComponents.some((comp) => comp.category === cat)
    );
  }, [uiComponents]);

  const filteredComponents = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    const matches = uiComponents.filter((comp) => {
      const matchesCategory =
        selectedCategory === "All"
          ? true
          : selectedCategory === "Featured"
            ? comp.featured === true
            : comp.category === selectedCategory;

      if (!matchesCategory) return false;
      if (!q) return true;

      return (
        comp.title.toLowerCase().includes(q) ||
        comp.slug.toLowerCase().includes(q) ||
        comp.description.toLowerCase().includes(q) ||
        comp.tagline.toLowerCase().includes(q) ||
        comp.category.toLowerCase().includes(q) ||
        comp.badges.some((b) => b.toLowerCase().includes(q)) ||
        (comp.keywords || []).some((k) => k.toLowerCase().includes(q))
      );
    });

    // Sorting
    return matches.sort((a, b) => {
      if (sortBy === "featured") {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return a.title.localeCompare(b.title);
      }
      if (sortBy === "name-asc") {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === "newest") {
        return (b.createdAt || "").localeCompare(a.createdAt || "");
      }
      if (sortBy === "props-desc") {
        return b.props.length - a.props.length;
      }
      return 0;
    });
  }, [uiComponents, selectedCategory, searchQuery, sortBy]);

  const handleCopyCli = useCallback(
    async (e: React.MouseEvent, slug: string, cliCommand: string) => {
      e.preventDefault();
      e.stopPropagation();
      const ok = await copyToClipboard(cliCommand);
      if (ok) {
        setCopiedSlug(slug);
        setTimeout(() => setCopiedSlug(null), 1800);
      }
    },
    []
  );

  const featuredCount = useMemo(
    () => uiComponents.filter((c) => c.featured).length,
    [uiComponents]
  );

  return (
    <div className="mx-auto max-w-[1240px] px-4 py-8 sm:px-6 lg:py-12">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-6 pb-4 dark:border-neutral-800 lg:flex-row lg:items-end">
        <div>
          {/* Top Metric Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1 font-mono text-[11px] text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>BoseUI v2</span>
            </span>

            <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1 font-mono text-[11px] text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
              <span>React 19 & Next.js 15</span>
            </span>

            <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1 font-mono text-[11px] text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
              <span>TypeScript Strict</span>
            </span>
          </div>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-neutral-950 dark:text-white sm:text-4xl lg:text-5xl">
            Components Directory
          </h1>

          <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 sm:text-[15px]">
            Copy-paste animated UI components built with Framer Motion, Tailwind
            CSS, and TypeScript. Test them live, copy the shadcn CLI command, or
            inspect source code.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center  border-b border-neutral-200 pb-8">
        {/* Search Input with Keyboard Shortcut */}
        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search components or badges..."
            aria-label="Search components"
            className="h-10 w-full rounded-xl border border-neutral-200 bg-white pl-10 pr-14 text-xs text-neutral-900 placeholder:text-neutral-400 transition-colors focus:border-neutral-900 focus:outline-hidden dark:border-neutral-800 dark:bg-neutral-950 dark:text-white dark:placeholder:text-neutral-500 dark:focus:border-white"
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

        {/* Sort Dropdown */}
        <div className="relative shrink-0">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            aria-label="Sort components"
            className="h-10 appearance-none rounded-xl border border-neutral-200 bg-white pl-3.5 pr-8 text-xs font-medium text-neutral-700 transition-colors hover:border-neutral-300 focus:border-neutral-900 focus:outline-hidden dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300 dark:hover:border-neutral-700 dark:focus:border-white"
          >
            <option value="featured">Featured First</option>
            <option value="name-asc">Alphabetical (A-Z)</option>
            <option value="newest">Newest Added</option>
            <option value="props-desc">Most Configurable</option>
          </select>
          <ArrowUpDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
        </div>

        {/* View Mode Switcher */}
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
          {/* All */}
          <button
            type="button"
            onClick={() => setSelectedCategory("All")}
            className={cn(
              "rounded-xl border px-3 py-1.5 text-xs font-medium transition-colors",
              selectedCategory === "All"
                ? "border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-black"
                : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 hover:text-neutral-950 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-400 dark:hover:border-neutral-700 dark:hover:text-white"
            )}
          >
            All
          </button>

          {/* Featured */}
          <button
            type="button"
            onClick={() => setSelectedCategory("Featured")}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium transition-colors",
              selectedCategory === "Featured"
                ? "border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-black"
                : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 hover:text-neutral-950 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-400 dark:hover:border-neutral-700 dark:hover:text-white"
            )}
          >
            <Sparkles className="h-3 w-3 text-amber-500" />
            <span>Featured</span>
          </button>

          {/* Atomic UI Category Chips (Backgrounds excluded) */}
          {availableCategories.map((category) => {
            const count = uiComponents.filter(
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
                  "rounded-xl border px-3 py-1.5 text-xs font-medium transition-colors",
                  isSelected
                    ? "border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-black"
                    : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 hover:text-neutral-950 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-400 dark:hover:border-neutral-700 dark:hover:text-white"
                )}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Results Showcase */}
      {filteredComponents.length === 0 ? (
        /* Empty State */
        <div className="mt-12 flex min-h-[320px] flex-col items-center justify-center rounded-3xl border border-dashed border-neutral-300 bg-neutral-50/50 p-10 text-center dark:border-neutral-800 dark:bg-neutral-950/50">
          <SlidersHorizontal className="h-9 w-9 text-neutral-400 dark:text-neutral-600" />
          <h2 className="mt-3.5 text-base font-semibold text-neutral-900 dark:text-white">
            No components found matching &ldquo;{searchQuery}&rdquo;
          </h2>
          <p className="mt-1.5 max-w-sm text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
            Try searching for terms like &ldquo;button&rdquo;, &ldquo;card&rdquo;,
            &ldquo;dialog&rdquo;, or &ldquo;dock&rdquo;, or reset your active filters.
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
        /* Compact Card Grid (3 Columns) */
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredComponents.map((comp) => {
            const isCopied = copiedSlug === comp.slug;

            return (
              <div
                key={comp.slug}
                className="group flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-5 transition-all hover:border-neutral-400 hover:shadow-sm dark:border-neutral-800 dark:bg-[#0A0A0A] dark:hover:border-neutral-700"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      href={`/components/${comp.slug}`}
                      className="text-sm font-semibold text-neutral-950 hover:underline dark:text-white"
                    >
                      {comp.title}
                    </Link>
                    <Link
                      href={`/components/${comp.slug}`}
                      aria-label={`View ${comp.title} docs`}
                      className="text-neutral-400 hover:text-neutral-950 dark:hover:text-white"
                    >
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </Link>
                  </div>

                  <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
                    {comp.description}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-1.5">
                    <span className="rounded-md border border-neutral-200 bg-neutral-50 px-2 py-0.5 font-mono text-[10px] font-medium text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
                      {comp.category}
                    </span>
                    {comp.badges.slice(0, 2).map((b) => (
                      <span
                        key={b}
                        className="rounded-md bg-neutral-100 px-1.5 py-0.5 font-mono text-[10px] text-neutral-500 dark:bg-neutral-900/60 dark:text-neutral-400"
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-neutral-100 pt-3.5 dark:border-neutral-900">
                  <span className="font-mono text-[11px] text-neutral-400">
                    {comp.props.length} props
                  </span>

                  <button
                    type="button"
                    onClick={(e) => handleCopyCli(e, comp.slug, comp.cliCommand)}
                    title="Copy shadcn CLI command"
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 font-mono text-[11px] font-medium transition-colors",
                      isCopied
                        ? "border-emerald-600 bg-emerald-50 text-emerald-700 dark:border-emerald-500 dark:bg-emerald-950/60 dark:text-emerald-300"
                        : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-900 hover:text-neutral-950 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-white dark:hover:text-white"
                    )}
                  >
                    {isCopied ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                        <span>Copied CLI</span>
                      </>
                    ) : (
                      <>
                        <Terminal className="h-3 w-3 opacity-60" />
                        <span>Copy CLI</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : viewMode === "table" ? (
        /* High-Density Index Table View */
        <div className="mt-8 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xs dark:border-neutral-800 dark:bg-[#0A0A0A]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-neutral-200 bg-neutral-50/70 font-mono text-[11px] text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900/50 dark:text-neutral-400">
                <tr>
                  <th className="px-5 py-3 font-medium">Component</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="hidden px-4 py-3 font-medium md:table-cell">
                    Badges & Tech
                  </th>
                  <th className="hidden px-4 py-3 font-medium sm:table-cell">
                    Props
                  </th>
                  <th className="px-4 py-3 text-right font-medium">CLI Command</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-900">
                {filteredComponents.map((comp) => {
                  const isCopied = copiedSlug === comp.slug;

                  return (
                    <tr
                      key={comp.slug}
                      className="transition-colors hover:bg-neutral-50/60 dark:hover:bg-neutral-900/40"
                    >
                      <td className="px-5 py-3.5 font-medium">
                        <Link
                          href={`/components/${comp.slug}`}
                          className="group flex items-center gap-1.5 text-neutral-950 hover:underline dark:text-white"
                        >
                          <span>{comp.title}</span>
                          <ArrowUpRight className="h-3.5 w-3.5 text-neutral-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                        </Link>
                        <p className="mt-0.5 line-clamp-1 max-w-md text-[11px] text-neutral-500 dark:text-neutral-400">
                          {comp.tagline || comp.description}
                        </p>
                      </td>

                      <td className="px-4 py-3.5">
                        <span className="rounded-md border border-neutral-200 bg-neutral-50 px-2 py-0.5 font-mono text-[10px] text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
                          {comp.category}
                        </span>
                      </td>

                      <td className="hidden px-4 py-3.5 md:table-cell">
                        <div className="flex flex-wrap items-center gap-1">
                          {comp.badges.slice(0, 3).map((badge) => (
                            <span
                              key={badge}
                              className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-[10px] text-neutral-500 dark:bg-neutral-900 dark:text-neutral-400"
                            >
                              {badge}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="hidden px-4 py-3.5 font-mono text-[11px] text-neutral-500 dark:text-neutral-400 sm:table-cell">
                        {comp.props.length}
                      </td>

                      <td className="px-4 py-3.5 text-right">
                        <button
                          type="button"
                          onClick={(e) =>
                            handleCopyCli(e, comp.slug, comp.cliCommand)
                          }
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 font-mono text-[11px] transition-colors",
                            isCopied
                              ? "border-emerald-600 bg-emerald-50 text-emerald-700 dark:border-emerald-500 dark:bg-emerald-950/60 dark:text-emerald-300"
                              : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-900 hover:text-neutral-950 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-white dark:hover:text-white"
                          )}
                        >
                          {isCopied ? (
                            <>
                              <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                              <span>Copied</span>
                            </>
                          ) : (
                            <>
                              <Terminal className="h-3 w-3 opacity-60" />
                              <span>Copy CLI</span>
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        null
      )}
    </div>
  );
}

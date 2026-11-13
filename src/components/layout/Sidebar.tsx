"use client";

import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Layers,
  HeartHandshake,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  X,
  Sparkles,
  ChevronRight,
  MousePointerClick,
  LayoutGrid,
  Compass,
  SlidersHorizontal,
  Type,
  Flame,
  Laptop,
  ChevronsUpDown,
} from "lucide-react";
import { PULSE_COMPONENTS } from "@/registry/generated-catalog";
import { isBlock } from "@/lib/blocks";
import { cn } from "@/lib/utils";

// Category configurations with curated Lucide icons and display names
const CATEGORY_CONFIG: Record<
  string,
  {
    name: string;
    icon: React.ComponentType<{ className?: string }>;
  }
> = {
  Buttons: { name: "Buttons", icon: MousePointerClick },
  Cards: { name: "Cards & Bento", icon: LayoutGrid },
  Navigation: { name: "Navigation & Docks", icon: Compass },
  Inputs: { name: "Inputs & Forms", icon: SlidersHorizontal },
  Text: { name: "Text & Typography", icon: Type },
  Motion: { name: "Physics & Motion", icon: Flame },
  Backgrounds: { name: "Visual & Canvas", icon: Sparkles },
  Overlays: { name: "Overlays & Feedback", icon: Layers },
  Mockups: { name: "Mockups & Frames", icon: Laptop },
};

const CATEGORY_ORDER = [
  "Buttons",
  "Cards",
  "Navigation",
  "Inputs",
  "Text",
  "Motion",
  "Backgrounds",
  "Overlays",
  "Mockups",
];

export function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [filter, setFilter] = useState("");
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const activeLinkRef = useRef<HTMLAnchorElement | null>(null);

  // Group all components into categories (sorted alphabetically inside each category)
  const categorizedComponents = useMemo(() => {
    const map = new Map<string, typeof PULSE_COMPONENTS>();

    for (const comp of PULSE_COMPONENTS) {
      const cat = comp.category || "Other";
      if (!map.has(cat)) {
        map.set(cat, []);
      }
      map.get(cat)!.push(comp);
    }

    // Sort items alphabetically inside each category
    for (const [cat, list] of map.entries()) {
      list.sort((a, b) =>
        a.title.localeCompare(b.title, undefined, { sensitivity: "base" })
      );
      map.set(cat, list);
    }

    // Return ordered list of categories
    const orderedKeys = [
      ...CATEGORY_ORDER.filter((k) => map.has(k)),
      ...Array.from(map.keys()).filter((k) => !CATEGORY_ORDER.includes(k)),
    ];

    return orderedKeys.map((catKey) => ({
      key: catKey,
      name: CATEGORY_CONFIG[catKey]?.name || catKey,
      icon: CATEGORY_CONFIG[catKey]?.icon || Layers,
      items: map.get(catKey) || [],
    }));
  }, []);

  // Determine active component and its category
  const activeComponentInfo = useMemo(() => {
    if (!pathname.startsWith("/components/")) return null;
    const slug = pathname.replace("/components/", "").toLowerCase();
    const found = PULSE_COMPONENTS.find(
      (c) =>
        c.slug.toLowerCase() === slug ||
        c.componentName.toLowerCase() === slug
    );
    return found ? { slug: found.slug, category: found.category } : null;
  }, [pathname]);

  // Track accordion state for each category
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    for (const cat of CATEGORY_ORDER) {
      initial[cat] = true; // Default all categories open for instant discoverability
    }
    return initial;
  });

  // Ensure active category is expanded on navigation
  useEffect(() => {
    if (activeComponentInfo?.category) {
      setOpenCategories((prev) => ({
        ...prev,
        [activeComponentInfo.category]: true,
      }));
    }
  }, [activeComponentInfo]);

  // Automatically scroll active link into view
  useEffect(() => {
    if (activeLinkRef.current) {
      activeLinkRef.current.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    }
  }, [pathname]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Close mobile drawer on Escape key press
  useEffect(() => {
    if (!mobileOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen]);

  // Keyboard shortcut: '/' focuses the filter input
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

  const toggleCategory = useCallback((catKey: string) => {
    setOpenCategories((prev) => ({
      ...prev,
      [catKey]: !prev[catKey],
    }));
  }, []);

  const allExpanded = useMemo(() => {
    return categorizedComponents.every((c) => openCategories[c.key] !== false);
  }, [categorizedComponents, openCategories]);

  const toggleAllCategories = useCallback(() => {
    const targetState = !allExpanded;
    const nextState: Record<string, boolean> = {};
    for (const cat of categorizedComponents) {
      nextState[cat.key] = targetState;
    }
    setOpenCategories(nextState);
  }, [allExpanded, categorizedComponents]);

  // Filtered categories when search query is entered
  const filteredCategories = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return categorizedComponents;

    return categorizedComponents
      .map((cat) => {
        const matchingItems = cat.items.filter(
          (c) =>
            c.title.toLowerCase().includes(q) ||
            c.slug.toLowerCase().includes(q) ||
            c.category.toLowerCase().includes(q) ||
            (c.keywords || []).some((k) => k.toLowerCase().includes(q)) ||
            (c.badges || []).some((b) => b.toLowerCase().includes(q))
        );
        return {
          ...cat,
          items: matchingItems,
        };
      })
      .filter((cat) => cat.items.length > 0);
  }, [filter, categorizedComponents]);

  const totalMatches = useMemo(() => {
    return filteredCategories.reduce((sum, cat) => sum + cat.items.length, 0);
  }, [filteredCategories]);

  const sidebarContent = (
    <div className="flex min-h-full flex-col px-3 py-4">
      {/* Quick Search / Filter Bar */}
      <div className="relative mb-4">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
        <input
          ref={searchInputRef}
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter 104 components..."
          aria-label="Filter components"
          className="h-9 w-full rounded-xl border border-neutral-200 bg-neutral-50/80 pl-8 pr-12 text-xs text-neutral-900 placeholder:text-neutral-400 transition-colors focus:border-neutral-900 focus:bg-white focus:outline-none dark:border-neutral-800 dark:bg-neutral-900/60 dark:text-white dark:placeholder:text-neutral-500 dark:focus:border-neutral-300 dark:focus:bg-neutral-950"
        />
        <div className="absolute right-2.5 top-1/2 flex -translate-y-1/2 items-center gap-1">
          {filter ? (
            <button
              type="button"
              aria-label="Clear filter"
              onClick={() => setFilter("")}
              className="rounded p-0.5 text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
            >
              <X className="h-3 w-3" />
            </button>
          ) : (
            <kbd className="pointer-events-none rounded border border-neutral-200 bg-neutral-100 px-1.5 py-0.5 font-mono text-[9px] font-medium text-neutral-400 dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-400">
              /
            </kbd>
          )}
        </div>
      </div>

      <div className="space-y-5">
        {/* Navigation / Overview Links */}
        {!filter && (
          <div>
            <div className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
              Overview
            </div>
            <ul className="space-y-0.5">
              <li>
                <Link
                  href="/components"
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors",
                    pathname === "/components"
                      ? "bg-neutral-950 font-semibold text-white shadow-2xs dark:bg-white dark:text-black"
                      : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-white"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <Layers className="h-3.5 w-3.5 shrink-0" />
                    <span>Components</span>
                  </div>
                  <span
                    className={cn(
                      "rounded-full px-1.5 py-0.2 font-mono text-[10px]",
                      pathname === "/components"
                        ? "bg-white/20 text-white dark:bg-black/20 dark:text-black"
                        : "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400"
                    )}
                  >
                    {PULSE_COMPONENTS.length}
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/docs"
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors",
                    pathname === "/docs"
                      ? "bg-neutral-950 font-semibold text-white shadow-2xs dark:bg-white dark:text-black"
                      : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-white"
                  )}
                >
                  <BookOpen className="h-3.5 w-3.5 shrink-0" />
                  <span>Documentation &amp; CLI</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/docs/contributing"
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors",
                    pathname === "/docs/contributing"
                      ? "bg-neutral-950 font-semibold text-white shadow-2xs dark:bg-white dark:text-black"
                      : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-white"
                  )}
                >
                  <HeartHandshake className="h-3.5 w-3.5 shrink-0" />
                  <span>Contributing</span>
                </Link>
              </li>
            </ul>
          </div>
        )}

        {/* Categories Section Header */}
        <div className="space-y-3 pb-16">
          <div className="flex items-center justify-between px-2 text-[10px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
            <span>
              {filter ? `Matches (${totalMatches})` : "Categories"}
            </span>
            {!filter && (
              <button
                type="button"
                onClick={toggleAllCategories}
                className="flex items-center gap-1 text-[10px] font-normal lowercase tracking-normal text-neutral-400 transition-colors hover:text-neutral-800 dark:hover:text-neutral-200"
                title={allExpanded ? "Collapse all categories" : "Expand all categories"}
              >
                <ChevronsUpDown className="h-3 w-3" />
                <span>{allExpanded ? "collapse" : "expand"}</span>
              </button>
            )}
          </div>

          {/* Search with no results */}
          {filteredCategories.length === 0 && (
            <div className="px-3 py-8 text-center">
              <p className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                No components found
              </p>
              <p className="mt-1 text-[11px] text-neutral-400 dark:text-neutral-500">
                No matches for &ldquo;{filter}&rdquo;
              </p>
              <button
                type="button"
                onClick={() => setFilter("")}
                className="mt-3 inline-flex items-center gap-1 rounded-lg border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-[11px] font-medium text-neutral-700 transition-colors hover:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                Clear filter
              </button>
            </div>
          )}

          {/* Category Accordion Groups */}
          {filteredCategories.map((category) => {
            const Icon = category.icon;
            // When filtering, all matching categories remain expanded
            const isOpen = filter ? true : openCategories[category.key] !== false;
            const categoryHasActive =
              activeComponentInfo?.category === category.key;

            return (
              <div key={category.key} className="space-y-1">
                {/* Category Header Button */}
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => toggleCategory(category.key)}
                  className={cn(
                    "group flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-xs font-semibold transition-colors",
                    categoryHasActive && !isOpen
                      ? "text-neutral-950 dark:text-white"
                      : "text-neutral-700 hover:bg-neutral-100/70 hover:text-neutral-950 dark:text-neutral-300 dark:hover:bg-neutral-900/60 dark:hover:text-white"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="h-3.5 w-3.5 shrink-0 text-neutral-500 transition-colors group-hover:text-neutral-900 dark:text-neutral-400 dark:group-hover:text-white" />
                    <span>{category.name}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[10px] text-neutral-400 dark:text-neutral-500">
                      {category.items.length}
                    </span>
                    <ChevronRight
                      className={cn(
                        "h-3.5 w-3.5 text-neutral-400 transition-transform duration-200",
                        isOpen && "rotate-90 text-neutral-600 dark:text-neutral-300"
                      )}
                    />
                  </div>
                </button>

                {/* Collapsible Component List */}
                {isOpen && (
                  <ul className="ml-3.5 space-y-0.5 border-l border-neutral-200 pl-2.5 dark:border-neutral-800">
                    {category.items.map((comp) => {
                      const href = `/components/${comp.slug}`;
                      const isActive =
                        pathname.toLowerCase() === href.toLowerCase();
                      const isFeatured = comp.featured;
                      const isNew = comp.badges?.includes("New");
                      const compIsBlock = isBlock(comp.slug);

                      return (
                        <li key={comp.slug}>
                          <Link
                            ref={isActive ? activeLinkRef : undefined}
                            href={href}
                            onClick={() => setMobileOpen(false)}
                            className={cn(
                              "group flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs transition-colors",
                              isActive
                                ? "bg-neutral-950 font-semibold text-white shadow-2xs dark:bg-white dark:text-black"
                                : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950 dark:text-neutral-400 dark:hover:bg-neutral-900/80 dark:hover:text-white"
                            )}
                          >
                            <span className="truncate">{comp.title}</span>

                            <div className="ml-1.5 flex shrink-0 items-center gap-1">
                              {compIsBlock && (
                                <span
                                  className={cn(
                                    "rounded px-1 py-0.2 text-[9px] font-semibold uppercase tracking-wider",
                                    isActive
                                      ? "bg-white/20 text-white dark:bg-black/20 dark:text-black"
                                      : "border border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400"
                                  )}
                                >
                                  Block
                                </span>
                              )}

                              {isNew && !compIsBlock && (
                                <span
                                  className={cn(
                                    "rounded px-1 py-0.2 text-[9px] font-semibold uppercase tracking-wider",
                                    isActive
                                      ? "bg-white/20 text-white dark:bg-black/20 dark:text-black"
                                      : "border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                  )}
                                >
                                  New
                                </span>
                              )}

                              {isFeatured && !isActive && (
                                <span
                                  className="text-amber-500 opacity-75 transition-opacity group-hover:opacity-100"
                                  title="Featured primitive"
                                >
                                  <Sparkles className="h-2.5 w-2.5" />
                                </span>
                              )}
                            </div>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Sidebar Toggle Bar */}
      <div className="sticky top-14 z-30 flex items-center justify-between border-b border-neutral-200 bg-white/95 px-4 py-2.5 backdrop-blur-md dark:border-neutral-800 dark:bg-black/95 lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
          className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs font-medium text-neutral-900 shadow-2xs transition-colors hover:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800"
        >
          {mobileOpen ? (
            <PanelLeftClose className="h-3.5 w-3.5" />
          ) : (
            <PanelLeftOpen className="h-3.5 w-3.5" />
          )}
          <span>Browse Components</span>
        </button>

        <span className="font-mono text-[11px] text-neutral-500">
          {PULSE_COMPONENTS.length} Components
        </span>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            aria-hidden="true"
          />
          <aside
            data-lenis-prevent
            className="fixed bottom-0 left-0 top-14 z-50 w-72 overflow-y-auto overscroll-contain border-r border-neutral-200 bg-white shadow-xl dark:border-neutral-800 dark:bg-black sm:w-80"
          >
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Desktop Sticky Sidebar */}
      <aside
        data-lenis-prevent
        className="hidden w-64 shrink-0 border-r border-neutral-200 bg-white dark:border-neutral-800 dark:bg-black lg:block xl:w-72"
      >
        <div
          data-lenis-prevent
          className="sticky top-14 h-[calc(100dvh-3.5rem)] overflow-y-auto overscroll-contain"
        >
          {sidebarContent}
        </div>
      </aside>
    </>
  );
}

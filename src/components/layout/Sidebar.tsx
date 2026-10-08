"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Layers,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  X,
} from "lucide-react";
import { PULSE_COMPONENTS } from "@/registry/generated-catalog";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [filter, setFilter] = useState("");

  // Filter and group components by category
  const grouped = useMemo(() => {
    const q = filter.trim().toLowerCase();
    const list = q
      ? PULSE_COMPONENTS.filter(
          (c) =>
            c.title.toLowerCase().includes(q) ||
            c.category.toLowerCase().includes(q) ||
            c.slug.toLowerCase().includes(q)
        )
      : PULSE_COMPONENTS;

    return list.reduce<Record<string, typeof PULSE_COMPONENTS>>((acc, comp) => {
      if (!acc[comp.category]) acc[comp.category] = [];
      acc[comp.category].push(comp);
      return acc;
    }, {});
  }, [filter]);

  const sidebarContent = (
    <div className="flex h-full flex-col px-4 py-5">
      {/* Quick Sidebar Filter */}
      <div className="relative mb-5">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Jump to component..."
          aria-label="Filter sidebar navigation"
          className="h-9 w-full rounded-lg border border-neutral-200 bg-neutral-50/80 pl-8 pr-7 text-xs text-neutral-900 placeholder:text-neutral-400 transition-colors focus:border-neutral-900 focus:bg-white focus:outline-none dark:border-neutral-800 dark:bg-neutral-900/60 dark:text-white dark:placeholder:text-neutral-500 dark:focus:border-neutral-300 dark:focus:bg-neutral-950"
        />
        {filter && (
          <button
            type="button"
            aria-label="Clear sidebar filter"
            onClick={() => setFilter("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Section 1: Overview */}
        {!filter && (
          <div>
            <div className="mb-1.5 px-2.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
              Getting Started
            </div>
            <ul className="space-y-0.5">
              <li>
                <Link
                  href="/docs"
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium transition-colors",
                    pathname === "/docs"
                      ? "bg-neutral-900 text-white dark:bg-white dark:text-black"
                      : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-white"
                  )}
                >
                  <BookOpen className="h-3.5 w-3.5 shrink-0" />
                  <span>Introduction & CLI</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/components"
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center justify-between rounded-lg px-2.5 py-2 text-[13px] font-medium transition-colors",
                    pathname === "/components"
                      ? "bg-neutral-900 text-white dark:bg-white dark:text-black"
                      : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-white"
                  )}
                >
                  <span className="flex items-center gap-2.5">
                    <Layers className="h-3.5 w-3.5 shrink-0" />
                    <span>All Components</span>
                  </span>
                  <span
                    className={cn(
                      "rounded-md px-1.5 py-0.5 font-mono text-[10px]",
                      pathname === "/components"
                        ? "bg-white/20 text-white dark:bg-black/15 dark:text-black"
                        : "bg-neutral-100 text-neutral-500 dark:bg-neutral-900 dark:text-neutral-400"
                    )}
                  >
                    {PULSE_COMPONENTS.length}
                  </span>
                </Link>
              </li>
            </ul>
          </div>
        )}

        {/* Section 2: Components by Category */}
        <div className="space-y-5 pb-16">
          {Object.entries(grouped).length === 0 ? (
            <p className="px-2.5 py-4 text-xs text-neutral-400">
              No components match &ldquo;{filter}&rdquo;
            </p>
          ) : (
            Object.entries(grouped).map(([category, items]) => (
              <div key={category}>
                <div className="mb-1.5 flex items-center justify-between px-2.5">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                    {category}
                  </span>
                  <span className="font-mono text-[10px] text-neutral-400 dark:text-neutral-600">
                    {items.length}
                  </span>
                </div>

                <ul className="space-y-0.5 border-l border-neutral-200 ml-2.5 pl-2 dark:border-neutral-800">
                  {items.map((comp) => {
                    const href = `/components/${comp.slug}`;
                    const isActive =
                      pathname.toLowerCase() === href.toLowerCase();
                    const isNew = comp.badges?.includes("New");

                    return (
                      <li key={comp.slug}>
                        <Link
                          href={href}
                          onClick={() => setMobileOpen(false)}
                          className={cn(
                            "group flex items-center justify-between rounded-lg px-2.5 py-1.5 text-[13px] transition-colors",
                            isActive
                              ? "bg-neutral-900 font-medium text-white dark:bg-white dark:text-black"
                              : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950 dark:text-neutral-400 dark:hover:bg-neutral-900/80 dark:hover:text-white"
                          )}
                        >
                          <span className="truncate">{comp.title}</span>
                          {isNew && !isActive && (
                            <span className="ml-1.5 shrink-0 rounded-full border border-neutral-300 bg-neutral-100 px-1.5 py-0.2 font-mono text-[9px] font-medium text-neutral-600 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400">
                              New
                            </span>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Sidebar Toggle Bar */}
      <div className="sticky top-14 z-30 flex items-center justify-between border-b border-neutral-200 bg-white/95 px-4 py-2.5 backdrop-blur-md dark:border-neutral-900 dark:bg-black/95 lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen((o) => !o)}
          className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs font-medium text-neutral-900 dark:border-neutral-800 dark:bg-neutral-950 dark:text-white"
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
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
          />
          <aside className="fixed bottom-0 left-0 top-14 z-50 w-64 overflow-y-auto border-r border-neutral-200 bg-white dark:border-neutral-900 dark:bg-black">
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Desktop Sticky Sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-neutral-200 bg-white dark:border-neutral-900 dark:bg-black lg:block">
        <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
          {sidebarContent}
        </div>
      </aside>
    </>
  );
}

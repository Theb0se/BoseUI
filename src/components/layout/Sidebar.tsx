"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Layers,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { PULSE_COMPONENTS } from "@/registry/generated-catalog";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Group components by category
  const grouped = PULSE_COMPONENTS.reduce<
    Record<string, typeof PULSE_COMPONENTS>
  >((acc, comp) => {
    if (!acc[comp.category]) acc[comp.category] = [];
    acc[comp.category].push(comp);
    return acc;
  }, {});

  const sidebarContent = (
    <div className="flex h-full flex-col py-6 px-4">
      <div className="space-y-6">
        {/* Section 1: Getting Started */}
        <div>
          <div className="mb-2 px-2.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
            Overview
          </div>
          <ul className="space-y-1">
            <li>
              <Link
                href="/docs"
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium transition-colors",
                  pathname === "/docs"
                    ? "bg-black text-white dark:bg-white dark:text-black"
                    : "text-neutral-600 hover:bg-neutral-100 hover:text-black dark:text-neutral-400 dark:hover:bg-[#111111] dark:hover:text-white"
                )}
              >
                <BookOpen className="h-3.5 w-3.5 shrink-0" />
                <span>Getting Started</span>
              </Link>
            </li>
            <li>
              <Link
                href="/components"
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center justify-between rounded-lg px-2.5 py-2 text-xs font-medium transition-colors",
                  pathname === "/components"
                    ? "bg-black text-white dark:bg-white dark:text-black"
                    : "text-neutral-600 hover:bg-neutral-100 hover:text-black dark:text-neutral-400 dark:hover:bg-[#111111] dark:hover:text-white"
                )}
              >
                <span className="flex items-center gap-2.5">
                  <Layers className="h-3.5 w-3.5 shrink-0" />
                  <span>All Components</span>
                </span>
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.2 font-mono text-[10px]",
                    pathname === "/components"
                      ? "bg-white/20 text-white dark:bg-black/15 dark:text-black"
                      : "bg-neutral-100 text-neutral-500 dark:bg-[#141414] dark:text-neutral-400"
                  )}
                >
                  {PULSE_COMPONENTS.length}
                </span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Section 2: Components by Category */}
        <div className="space-y-5">
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category}>
              <div className="mb-1.5 px-2.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
                {category}
              </div>

              <ul className="ml-2.5 space-y-0.5 border-l border-neutral-200 pl-2 dark:border-[#1F1F1F]">
                {items.map((comp) => {
                  const href = `/components/${comp.slug}`;
                  const isActive =
                    pathname.toLowerCase() === href.toLowerCase();
                  return (
                    <li key={comp.slug}>
                      <Link
                        href={href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "flex items-center rounded-lg px-2.5 py-2 text-xs transition-colors",
                          isActive
                            ? "bg-black font-semibold text-white dark:bg-white dark:text-black"
                            : "text-neutral-600 hover:bg-neutral-100 hover:text-black dark:text-neutral-400 dark:hover:bg-[#111111] dark:hover:text-white"
                        )}
                      >
                        <span className="truncate">{comp.title}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Sidebar Toggle Bar */}
      <div className="sticky top-14 z-30 flex items-center justify-between border-b border-neutral-200 bg-white/90 px-4 py-2.5 backdrop-blur-md dark:border-[#1F1F1F] dark:bg-black/90 lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen((o) => !o)}
          className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs font-medium text-black dark:border-[#262626] dark:bg-[#0A0A0A] dark:text-white"
        >
          {mobileOpen ? (
            <PanelLeftClose className="h-3.5 w-3.5" />
          ) : (
            <PanelLeftOpen className="h-3.5 w-3.5" />
          )}
          <span>Menu</span>
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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm dark:bg-black/80"
          />
          <aside className="fixed bottom-0 left-0 top-14 z-50 w-64 overflow-y-auto border-r border-neutral-200 bg-white dark:border-[#1F1F1F] dark:bg-black">
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Desktop Sticky Sidebar */}
      <aside className="hidden w-60 shrink-0 border-r border-neutral-200 bg-white dark:border-[#1F1F1F] dark:bg-black lg:block">
        <div className="sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto">
          {sidebarContent}
        </div>
      </aside>
    </>
  );
}

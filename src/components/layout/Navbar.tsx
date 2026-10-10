"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Search, Github, Sun, Moon } from "lucide-react";
import { useCommandPalette } from "@/components/layout/CommandPalette";
import { useTheme } from "@/components/layout/ThemeProvider";
import { cn, SITE_CONFIG } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/components", label: "Components" },
  { href: "/docs", label: "Docs" },
  { href: "/blog", label: "Blog" },
];

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-white dark:focus-visible:ring-offset-black";

const controlBase =
  "border border-neutral-200 bg-neutral-50 text-neutral-600 transition-colors hover:border-neutral-900 hover:text-neutral-900 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-400 dark:hover:border-neutral-200 dark:hover:text-white";

const iconButton = cn(
  "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
  controlBase,
  focusRing
);

export function Navbar() {
  const pathname = usePathname();
  const { openPalette } = useCommandPalette();
  const { theme, toggleTheme } = useTheme();
  const [shortcut, setShortcut] = useState("⌘K");

  // Show the right shortcut for the visitor's keyboard.
  useEffect(() => {
    if (!/Mac|iPhone|iPad/i.test(navigator.userAgent)) setShortcut("Ctrl K");
  }, []);

  const nextTheme = theme === "dark" ? "light" : "dark";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white/80 backdrop-blur-xl dark:border-neutral-900 dark:bg-black/80">
      <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between gap-3 pl-[max(0.75rem,env(safe-area-inset-left))] pr-[max(0.75rem,env(safe-area-inset-right))] sm:h-16 sm:pl-[max(1.5rem,env(safe-area-inset-left))] sm:pr-[max(1.5rem,env(safe-area-inset-right))]">
        {/* Brand and page links */}
        <div className="flex min-w-0 items-center gap-3 sm:gap-6">
          <Link
            href="/"
            aria-label="BoseUI home"
            className={cn(
              "flex shrink-0 items-center gap-2.5 rounded-lg text-base font-semibold tracking-tight text-neutral-950 dark:text-white",
              focusRing
            )}
          >
            <Image
              src="/boseui-logo.png"
              alt="BoseUI - Kinetic React Components"
              width={28}
              height={28}
              priority
              className="h-7 w-7 rounded-md object-contain dark:invert"
            />
            <span className="hidden sm:block">BoseUI</span>
          </Link>

          <nav aria-label="Main" className="flex items-center gap-0.5 sm:gap-1">
            {NAV_LINKS.map((link) => {
              const isActive =
                pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "rounded-lg px-2.5 py-1.5 text-[13px] font-medium transition-colors sm:px-3.5 sm:text-sm",
                    focusRing,
                    isActive
                      ? "bg-neutral-900 text-white dark:bg-white dark:text-black"
                      : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-white"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Search, theme and GitHub */}
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={openPalette}
            aria-label="Search components and docs"
            className={cn(
              "group flex h-9 w-9 items-center justify-center gap-2.5 rounded-lg text-sm sm:w-auto sm:justify-start sm:pl-3 sm:pr-2 lg:w-60",
              controlBase,
              focusRing
            )}
          >
            <Search className="h-4 w-4 shrink-0" />
            <span className="hidden flex-1 text-left sm:inline">Search</span>
            <kbd className="hidden rounded-md border border-neutral-200 bg-white px-1.5 py-0.5 font-sans text-[11px] text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400 md:inline-block">
              {shortcut}
            </kbd>
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${nextTheme} mode`}
            title={`Switch to ${nextTheme} mode`}
            className={iconButton}
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>

          {/* Hidden on the very smallest phones so nothing gets squeezed */}
          <a
            href={SITE_CONFIG.author.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile"
            className={cn(iconButton, "hidden min-[400px]:flex")}
          >
            <Github className="h-4 w-4" />
          </a>
        </div>
      </div>
    </header>
  );
}
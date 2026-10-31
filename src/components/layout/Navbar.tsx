"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Search, Github, Sun, Moon, Menu, X } from "lucide-react";
import { useCommandPalette } from "@/components/layout/CommandPalette";
import { useTheme } from "@/components/layout/ThemeProvider";
import { cn, SITE_CONFIG } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/components", label: "Components" },
  { href: "/docs", label: "Docs" },
  { href: "/blog", label: "Blog" },
];

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-black";

export function Navbar() {
  const pathname = usePathname();
  const { openPalette } = useCommandPalette();
  const { theme, toggleTheme } = useTheme();
  const [shortcut, setShortcut] = useState("⌘K");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Detect platform keyboard shortcut
  useEffect(() => {
    if (typeof navigator !== "undefined" && !/Mac|iPhone|iPad/i.test(navigator.userAgent)) {
      setShortcut("Ctrl K");
    }
  }, []);

  const nextTheme = theme === "dark" ? "light" : "dark";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white/90 backdrop-blur-md dark:border-neutral-800 dark:bg-black/90">
      <div className="mx-auto flex h-14 max-w-[1100px] items-center justify-between gap-4 px-4 sm:px-6">
        {/* Left: Logo & Nav Links */}
        <div className="flex items-center gap-6">
          <Link
            href="/"
            aria-label="BoseUI Home"
            className={cn("flex items-center gap-2 rounded-md py-1", focusRing)}
          >
            <Image
              src="/boseui-logo.png"
              alt="BoseUI Logo"
              width={20}
              height={20}
              priority
              className="h-5 w-5 rounded object-contain dark:invert"
            />
            <span className="text-sm font-semibold tracking-tight text-neutral-950 dark:text-white">
              BoseUI
            </span>
          </Link>

          <nav aria-label="Main navigation" className="hidden items-center gap-5 md:flex">
            {NAV_LINKS.map((link) => {
              const isActive =
                pathname === link.href || pathname.startsWith(`${link.href}/`);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "text-xs font-medium transition-colors sm:text-sm",
                    focusRing,
                    isActive
                      ? "text-neutral-950 font-semibold dark:text-white"
                      : "text-neutral-600 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: Search, GitHub with Star Count, Theme Toggle */}
        <div className="flex items-center gap-2">
          {/* Search (Cmd+K) */}
          <button
            type="button"
            onClick={openPalette}
            aria-label="Search components and docs"
            className={cn(
              "flex h-8 items-center gap-2 rounded-md border border-neutral-200 bg-neutral-50/80 px-2.5 text-xs text-neutral-500 hover:border-neutral-300 hover:bg-neutral-100/80 hover:text-neutral-900 dark:border-neutral-800 dark:bg-neutral-950/80 dark:text-neutral-400 dark:hover:border-neutral-700 dark:hover:text-white sm:w-48",
              focusRing
            )}
          >
            <Search className="h-3.5 w-3.5 shrink-0" />
            <span className="hidden sm:inline">Search...</span>
            <kbd className="ml-auto hidden rounded border border-neutral-200 bg-white px-1.5 py-0.2 font-mono text-[10px] text-neutral-400 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400 sm:inline-block">
              {shortcut}
            </kbd>
          </button>

          {/* GitHub link */}
          <a
            href={SITE_CONFIG.author.repo}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="BoseUI on GitHub"
            title="View BoseUI on GitHub"
            className={cn(
              "flex h-8 items-center gap-1.5 rounded-md border border-neutral-200 bg-white px-2.5 text-xs text-neutral-700 hover:border-neutral-300 hover:text-neutral-950 dark:border-neutral-800 dark:bg-black dark:text-neutral-300 dark:hover:border-neutral-700 dark:hover:text-white",
              focusRing
            )}
          >
            <Github className="h-3.5 w-3.5 shrink-0" />
            <span>GitHub</span>
          </a>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${nextTheme} mode`}
            title={`Switch to ${nextTheme} mode`}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-md border border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 hover:text-neutral-950 dark:border-neutral-800 dark:bg-black dark:text-neutral-400 dark:hover:border-neutral-700 dark:hover:text-white",
              focusRing
            )}
          >
            {theme === "dark" ? (
              <Sun className="h-3.5 w-3.5" />
            ) : (
              <Moon className="h-3.5 w-3.5" />
            )}
          </button>


          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-md border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-100 dark:border-neutral-800 dark:bg-black dark:text-neutral-300 dark:hover:bg-neutral-900 md:hidden",
              focusRing
            )}
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-neutral-200 bg-white px-4 py-4 dark:border-neutral-800 dark:bg-black md:hidden">
          <nav className="flex flex-col gap-2">
            {NAV_LINKS.map((link) => {
              const isActive =
                pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-neutral-100 text-neutral-950 font-semibold dark:bg-neutral-900 dark:text-white"
                      : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-950 dark:text-neutral-400 dark:hover:bg-neutral-900"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Github, Sun, Moon, Sparkles } from "lucide-react";
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

export function Navbar() {
  const pathname = usePathname();
  const { openPalette } = useCommandPalette();
  const { theme, toggleTheme } = useTheme();
  const [shortcut, setShortcut] = useState("⌘K");
  const [scrolled, setScrolled] = useState(false);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);

  // Detect platform keyboard shortcut
  useEffect(() => {
    if (!/Mac|iPhone|iPad/i.test(navigator.userAgent)) {
      setShortcut("Ctrl K");
    }
  }, []);

  // Subtle scroll elevation detection
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 12);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const nextTheme = theme === "dark" ? "light" : "dark";

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        "border-b backdrop-blur-xl supports-[backdrop-filter]:backdrop-blur-xl",
        scrolled
          ? "border-neutral-200/90 bg-white/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:border-neutral-800/90 dark:bg-black/80 dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.4)]"
          : "border-neutral-200/60 bg-white/60 dark:border-neutral-800/60 dark:bg-black/60"
      )}
    >
      <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between gap-2.5 px-3 sm:h-16 sm:gap-4 sm:px-6 lg:px-8">
        {/* Left: Brand logo + Kinetic Navigation */}
        <div className="flex min-w-0 items-center gap-2 sm:gap-5 md:gap-7">
          <Link
            href="/"
            aria-label="BoseUI Home"
            className={cn(
              "group flex shrink-0 items-center gap-2.5 rounded-lg py-1 transition-transform active:scale-95",
              focusRing
            )}
          >
            <div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-b from-neutral-100 to-neutral-200/70 p-1 shadow-sm ring-1 ring-neutral-900/5 transition-all duration-300 group-hover:scale-105 group-hover:shadow group-hover:ring-neutral-900/10 dark:from-neutral-900 dark:to-neutral-950 dark:ring-white/10 dark:group-hover:ring-white/20">
              <Image
                src="/boseui-logo.png"
                alt="BoseUI - Kinetic React Components"
                width={26}
                height={26}
                priority
                className="h-6 w-6 rounded-md object-contain dark:invert"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[15px] font-semibold tracking-tight text-neutral-950 dark:text-white sm:text-base">
                Bose<span className="text-neutral-400 dark:text-neutral-500 font-normal">UI</span>
              </span>
              <span className="hidden items-center gap-1 rounded-full border border-neutral-200/80 bg-neutral-100/80 px-1.5 py-0.5 font-mono text-[10px] font-medium text-neutral-500 transition-colors group-hover:border-neutral-300 dark:border-neutral-800/80 dark:bg-neutral-900/80 dark:text-neutral-400 dark:group-hover:border-neutral-700 md:inline-flex">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                v1.0
              </span>
            </div>
          </Link>

          {/* Hairline divider */}
          <div className="hidden h-4 w-px bg-neutral-200 dark:bg-neutral-800 sm:block" aria-hidden="true" />

          {/* Kinetic Nav Links with Framer Motion sliding pill */}
          <nav
            aria-label="Main navigation"
            className="flex items-center gap-0.5 rounded-xl p-0.5"
            onMouseLeave={() => setHoveredNav(null)}
          >
            {NAV_LINKS.map((link) => {
              const isActive =
                pathname === link.href || pathname.startsWith(`${link.href}/`);
              const isHovered = hoveredNav === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  onMouseEnter={() => setHoveredNav(link.href)}
                  className={cn(
                    "relative rounded-lg px-2.5 py-1.5 text-[13px] font-medium transition-colors sm:px-3 sm:text-sm",
                    focusRing,
                    isActive
                      ? "text-neutral-950 font-semibold dark:text-white"
                      : "text-neutral-600 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white"
                  )}
                >
                  {/* Active sliding pill */}
                  {isActive && (
                    <motion.div
                      layoutId="navbar-active-indicator"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                      className="absolute inset-0 rounded-lg bg-neutral-900/5 shadow-[inset_0_1px_1px_rgba(0,0,0,0.04)] ring-1 ring-neutral-900/10 dark:bg-white/10 dark:ring-white/15"
                    />
                  )}

                  {/* Hover background for inactive items */}
                  {!isActive && isHovered && (
                    <motion.div
                      layoutId="navbar-hover-indicator"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 35,
                      }}
                      className="absolute inset-0 rounded-lg bg-neutral-100/70 dark:bg-neutral-900/60 -z-10"
                    />
                  )}

                  <span className="relative z-10">{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: Omnibar Search + Actions */}
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          {/* Omnibar Search Trigger Button */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={openPalette}
            aria-label="Search components and docs"
            className={cn(
              "group relative flex h-9 items-center justify-between gap-3 rounded-lg px-2.5 text-sm transition-all sm:w-56 lg:w-64",
              "border border-neutral-200/90 bg-neutral-50/80 text-neutral-500 shadow-sm hover:border-neutral-300 hover:bg-neutral-100/80 hover:text-neutral-900",
              "dark:border-neutral-800/90 dark:bg-neutral-950/70 dark:text-neutral-400 dark:hover:border-neutral-700 dark:hover:bg-neutral-900/80 dark:hover:text-white",
              focusRing
            )}
          >
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-110 group-hover:text-neutral-900 dark:group-hover:text-white" />
              <span className="hidden text-xs sm:inline-block">Search components...</span>
            </div>

            <div className="flex items-center gap-1">
              <kbd className="hidden rounded-md border border-neutral-200 bg-white px-1.5 py-0.5 font-mono text-[10px] font-medium text-neutral-500 shadow-[0_1px_1px_rgba(0,0,0,0.05)] transition-colors group-hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400 dark:group-hover:border-neutral-700 sm:inline-block">
                {shortcut}
              </kbd>
            </div>
          </motion.button>

          {/* Hairline Divider */}
          <div className="h-4 w-px bg-neutral-200 dark:bg-neutral-800" aria-hidden="true" />

          {/* Kinetic Theme Toggle Button with Rotational Motion */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            whileHover={{ scale: 1.05 }}
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${nextTheme} mode`}
            title={`Switch to ${nextTheme} mode`}
            className={cn(
              "relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors",
              "border border-neutral-200/90 bg-neutral-50/80 text-neutral-600 hover:border-neutral-300 hover:bg-neutral-100 hover:text-neutral-950",
              "dark:border-neutral-800/90 dark:bg-neutral-950/70 dark:text-neutral-400 dark:hover:border-neutral-700 dark:hover:bg-neutral-900 dark:hover:text-white",
              focusRing
            )}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={theme}
                initial={{ opacity: 0, rotate: -45, scale: 0.6 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 45, scale: 0.6 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="flex items-center justify-center"
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4 text-amber-400" />
                ) : (
                  <Moon className="h-4 w-4 text-neutral-700" />
                )}
              </motion.div>
            </AnimatePresence>
          </motion.button>

          {/* GitHub Repo Button with tactile bounce */}
          <motion.a
            whileTap={{ scale: 0.92 }}
            whileHover={{ scale: 1.05 }}
            href={SITE_CONFIG.author.repo}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub repository"
            title="View BoseUI on GitHub"
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors",
              "border border-neutral-200/90 bg-neutral-50/80 text-neutral-600 hover:border-neutral-300 hover:bg-neutral-100 hover:text-neutral-950",
              "dark:border-neutral-800/90 dark:bg-neutral-950/70 dark:text-neutral-400 dark:hover:border-neutral-700 dark:hover:bg-neutral-900 dark:hover:text-white",
              focusRing
            )}
          >
            <Github className="h-4 w-4" />
          </motion.a>
        </div>
      </div>
    </header>
  );
}
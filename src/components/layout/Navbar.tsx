"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Github,
  Sun,
  Moon,
  Menu,
  X,
  ArrowRight,
  BookOpen,
  Layers,
  FileText,
} from "lucide-react";
import { useCommandPalette } from "@/components/layout/CommandPalette";
import { useTheme } from "@/components/layout/ThemeProvider";
import { cn, SITE_CONFIG } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/components", label: "Components", icon: Layers },
  { href: "/docs", label: "Docs", icon: BookOpen },
  { href: "/blog", label: "Blog", icon: FileText },
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
          ? "border-neutral-200/90 bg-white/85 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:border-neutral-800/90 dark:bg-black/85 dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.4)]"
          : "border-neutral-200/60 bg-white/65 dark:border-neutral-800/60 dark:bg-black/65"
      )}
    >
      <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between gap-2 px-3 sm:h-16 sm:gap-4 sm:px-6 lg:px-8">
        {/* Left: Brand logo + Desktop Nav */}
        <div className="flex min-w-0 items-center gap-2 sm:gap-4 md:gap-6">
          <Link
            href="/"
            aria-label="BoseUI Home"
            className={cn(
              "group flex shrink-0 items-center gap-2 rounded-lg py-1 transition-transform active:scale-95",
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
                v2
              </span>
            </div>
          </Link>

          {/* Desktop Hairline divider */}
          <div className="hidden h-4 w-px bg-neutral-200 dark:bg-neutral-800 md:block" aria-hidden="true" />

          {/* Desktop Nav Links */}
          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-0.5 rounded-xl p-0.5 md:flex"
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
                    "relative rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
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

                  {/* Hover background */}
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

        {/* Right: Omnibar Search + Actions + Mobile Menu Toggle */}
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          {/* Omnibar Search Trigger Button */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={openPalette}
            aria-label="Search components and docs"
            className={cn(
              "group relative flex h-9 items-center justify-between gap-2 rounded-lg px-2 text-sm transition-all sm:w-52 sm:px-2.5 md:w-60 lg:w-64",
              "border border-neutral-200/90 bg-neutral-50/80 text-neutral-500 shadow-sm hover:border-neutral-300 hover:bg-neutral-100/80 hover:text-neutral-900",
              "dark:border-neutral-800/90 dark:bg-neutral-950/70 dark:text-neutral-400 dark:hover:border-neutral-700 dark:hover:bg-neutral-900/80 dark:hover:text-white",
              focusRing
            )}
          >
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-110 group-hover:text-neutral-900 dark:group-hover:text-white" />
              <span className="hidden text-xs sm:inline-block">Search components...</span>
            </div>

            <kbd className="hidden rounded-md border border-neutral-200 bg-white px-1.5 py-0.5 font-mono text-[10px] font-medium text-neutral-500 shadow-[0_1px_1px_rgba(0,0,0,0.05)] transition-colors group-hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400 dark:group-hover:border-neutral-700 sm:inline-block">
              {shortcut}
            </kbd>
          </motion.button>

          {/* Hairline Divider (Desktop) */}
          <div className="hidden h-4 w-px bg-neutral-200 dark:bg-neutral-800 sm:block" aria-hidden="true" />

          {/* Theme Toggle Button */}
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

          {/* GitHub Repo Button (Desktop) */}
          {/* <motion.a
            whileTap={{ scale: 0.92 }}
            whileHover={{ scale: 1.05 }}
            href={SITE_CONFIG.author.repo}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub repository"
            title="View BoseUI on GitHub"
            className={cn(
              "hidden h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors sm:flex",
              "border border-neutral-200/90 bg-neutral-50/80 text-neutral-600 hover:border-neutral-300 hover:bg-neutral-100 hover:text-neutral-950",
              "dark:border-neutral-800/90 dark:bg-neutral-950/70 dark:text-neutral-400 dark:hover:border-neutral-700 dark:hover:bg-neutral-900 dark:hover:text-white",
              focusRing
            )}
          >
            <Github className="h-4 w-4" />
          </motion.a> */}

          {/* Mobile Menu Toggle Button */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors md:hidden",
              "border border-neutral-200/90 bg-neutral-50/80 text-neutral-700 hover:bg-neutral-100",
              "dark:border-neutral-800/90 dark:bg-neutral-950/70 dark:text-neutral-300 dark:hover:bg-neutral-900",
              focusRing
            )}
          >
            {mobileMenuOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-b border-neutral-200 bg-white/95 px-4 pb-6 pt-3 shadow-xl backdrop-blur-2xl dark:border-neutral-800 dark:bg-black/95 md:hidden"
          >
            <nav className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => {
                const isActive =
                  pathname === link.href || pathname.startsWith(`${link.href}/`);
                const Icon = link.icon;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center justify-between rounded-xl px-3.5 py-3 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-black text-white font-semibold dark:bg-white dark:text-black shadow-sm"
                        : "text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-900"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-4 w-4" />
                      <span>{link.label}</span>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 opacity-60" />
                  </Link>
                );
              })}

              <div className="my-2 h-px bg-neutral-200 dark:bg-neutral-800" />

              {/* Mobile GitHub & Search Actions & Theme Switcher */}
              <div className="flex flex-col gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openPalette();
                  }}
                  className="flex w-full items-center justify-between rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-xs font-medium text-neutral-600 transition-colors hover:border-neutral-300 hover:text-neutral-900 dark:border-neutral-800 dark:bg-neutral-900/60 dark:text-neutral-400 dark:hover:border-neutral-700 dark:hover:text-white"
                >
                  <div className="flex items-center gap-2.5">
                    <Search className="h-3.5 w-3.5" />
                    <span>Search components...</span>
                  </div>
                  <kbd className="rounded border border-neutral-200 bg-white px-1.5 py-0.5 font-mono text-[10px] text-neutral-500 shadow-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400">
                    {shortcut}
                  </kbd>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={toggleTheme}
                    className="flex items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-neutral-50 py-2.5 text-xs font-medium text-neutral-800 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-900/60 dark:text-neutral-200 dark:hover:border-neutral-700"
                  >
                    {theme === "dark" ? (
                      <>
                        <Sun className="h-4 w-4 text-amber-500" />
                        <span>Light Mode</span>
                      </>
                    ) : (
                      <>
                        <Moon className="h-4 w-4 text-neutral-700" />
                        <span>Dark Mode</span>
                      </>
                    )}
                  </button>

                  {/* <a
                    href={SITE_CONFIG.author.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-neutral-50 py-2.5 text-xs font-medium text-neutral-800 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-900/60 dark:text-neutral-200 dark:hover:border-neutral-700"
                  >
                    <Github className="h-4 w-4" />
                    <span>GitHub</span>
                  </a> */}
                </div>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
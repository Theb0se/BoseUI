"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  Menu,
  X,
  Compass,
  Layers,
  Code2,
  Terminal,
  ShieldCheck,
  Zap,
  Github,
  ChevronRight,
  ChevronDown,
  ExternalLink,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DynamicIslandToast } from "@/components/ui/DynamicIslandToast";

export interface MegaNavbarBlockProps {
  /** Brand or product name */
  brandName?: string;
  /** Top announcement alert title */
  announcementTitle?: string;
  /** Top announcement alert subtitle */
  announcementSubtitle?: string;
  /** Show live Dynamic Island toast widget at the top */
  showIslandAlert?: boolean;
  /** Custom CTA action callback */
  onCtaClick?: () => void;
  className?: string;
}

export function MegaNavbarBlock({
  brandName = "Pulse UI",
  announcementTitle = "Pulse v2.4 Engine Live",
  announcementSubtitle = "14 new reactive blocks & spring physics runtime",
  showIslandAlert = true,
  onCtaClick,
  className,
}: MegaNavbarBlockProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const NAV_ITEMS = [
    {
      id: "products",
      label: "Products",
      items: [
        { title: "Kinetic Primitives", desc: "Physics-based micro-interactions" },
        { title: "Composite Blocks", desc: "Production landing sections" },
        { title: "Background Shaders", desc: "WebGL and canvas backdrops" },
      ],
    },
    {
      id: "solutions",
      label: "Solutions",
      items: [
        { title: "Fintech & Billing", desc: "Real-time ledger and checkout views" },
        { title: "Enterprise SaaS", desc: "High density dashboards and controls" },
      ],
    },
    { id: "developers", label: "Developers", href: "/docs" },
    { id: "pricing", label: "Pricing", href: "#pricing" },
  ];

  return (
    <div
      data-fullscreen-scroll
      className={cn(
        "relative w-full min-h-[540px] overflow-hidden rounded-2xl border border-neutral-200/80 bg-neutral-950 text-neutral-100 shadow-2xl dark:border-neutral-800",
        className
      )}
    >
      {/* Background Ambient Glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 left-1/2 h-[380px] w-[640px] -translate-x-1/2 rounded-full bg-gradient-to-b from-blue-600/15 via-indigo-500/10 to-transparent blur-3xl" />
        <div className="absolute top-1/3 -right-24 h-72 w-72 rounded-full bg-violet-600/10 blur-3xl" />
        <div className="absolute bottom-10 -left-20 h-80 w-80 rounded-full bg-cyan-600/10 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      {/* Top Announcement Bar with Dynamic Island Telemetry */}
      {showIslandAlert && (
        <section aria-label="Announcement" className="relative z-30 border-b border-neutral-800/80 bg-neutral-900/60 backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 sm:px-6">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-xs font-medium text-neutral-400">
                Production Fleet Status:{" "}
                <span className="font-semibold text-emerald-400">Operational</span>
              </span>
            </div>

            {/* Dynamic Island Capsule Preview */}
            <div className="hidden sm:block">
              <DynamicIslandToast
                title={announcementTitle}
                subtitle={announcementSubtitle}
                defaultMode="compact"
                className="min-h-0 py-0.5"
              />
            </div>

            <div className="flex items-center gap-3 text-xs text-neutral-400">
              <a
                href="#changelog"
                className="hidden items-center gap-1 hover:text-white transition-colors md:inline-flex"
              >
                Changelog 2.4
                <ChevronRight className="h-3 w-3" />
              </a>
              <span className="hidden md:inline text-neutral-700">|</span>
              <span className="font-mono text-[11px] text-neutral-500">v2.4.0-rc</span>
            </div>
          </div>
        </section>
      )}

      {/* Primary Sticky Header Bar */}
      <header className="relative z-20 border-b border-neutral-800/60 bg-neutral-950/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6">
          {/* Brand Logo & Glyph */}
          <div className="flex items-center gap-8">
            <a
              href="#home"
              className="group flex items-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-500 shadow-md shadow-blue-500/20 ring-1 ring-white/20 transition-transform group-hover:scale-105">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold tracking-tight text-white text-base leading-none">
                  {brandName}
                </span>
                <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">
                  Enterprise
                </span>
              </div>
            </a>
          </div>

          {/* Center: Mega Menu Navigation (Desktop) */}
          <div className="hidden lg:flex items-center justify-center gap-1 px-4">
            {NAV_ITEMS.map((item) => (
              <div
                key={item.id}
                className="relative"
                onMouseEnter={() => item.items && setActiveDropdown(item.id)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button
                  type="button"
                  className={cn(
                    "flex items-center gap-1 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors",
                    activeDropdown === item.id
                      ? "text-white bg-neutral-800/80"
                      : "text-neutral-400 hover:text-white"
                  )}
                >
                  {item.label}
                  {item.items && <ChevronDown className="h-3 w-3 opacity-60" />}
                </button>

                {item.items && activeDropdown === item.id && (
                  <div className="absolute left-0 top-full pt-2 w-64 z-50">
                    <div className="rounded-xl border border-neutral-800 bg-neutral-900/95 p-2 shadow-2xl backdrop-blur-xl">
                      {item.items.map((sub, i) => (
                        <a
                          key={i}
                          href="#item"
                          className="block p-2.5 rounded-lg hover:bg-neutral-800/80 transition-colors"
                        >
                          <div className="text-xs font-medium text-white">{sub.title}</div>
                          <div className="text-[11px] text-neutral-400 mt-0.5">{sub.desc}</div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3">
            {/* Quick Search Trigger Pill */}
            <button
              type="button"
              onClick={() => setShowSearchModal((prev) => !prev)}
              className="flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900/80 px-3 py-1.5 text-xs text-neutral-400 hover:border-neutral-700 hover:text-neutral-200 transition-all shadow-inner"
              title="Open Global Search"
            >
              <Compass className="h-3.5 w-3.5 text-blue-400" />
              <span className="hidden sm:inline">Search docs & apis...</span>
              <kbd className="hidden sm:inline-flex items-center rounded border border-neutral-700 bg-neutral-800 px-1.5 text-[10px] text-neutral-400 font-mono">
                ⌘K
              </kbd>
            </button>

            {/* GitHub Star Link */}
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex h-9 w-9 items-center justify-center rounded-full border border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:text-white hover:border-neutral-700 transition-colors"
              aria-label="GitHub Repository"
            >
              <Github className="h-4 w-4" />
            </a>

            {/* CTA Button */}
            <button
              type="button"
              onClick={onCtaClick}
              className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-2 text-xs font-medium text-white shadow-lg shadow-blue-500/20 transition-all duration-300 hover:shadow-blue-500/35 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Get Started</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle mobile menu"
              className="flex lg:hidden h-9 w-9 items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900 text-neutral-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden border-t border-neutral-800 bg-neutral-950/95 px-6 py-6 backdrop-blur-xl"
            >
              <nav className="flex flex-col space-y-4 text-sm font-medium">
                <a
                  href="#products"
                  className="flex items-center justify-between text-neutral-300 hover:text-white"
                >
                  <span className="flex items-center gap-2.5">
                    <Layers className="h-4 w-4 text-blue-400" /> Products
                  </span>
                  <ChevronRight className="h-4 w-4 text-neutral-500" />
                </a>
                <a
                  href="#solutions"
                  className="flex items-center justify-between text-neutral-300 hover:text-white"
                >
                  <span className="flex items-center gap-2.5">
                    <Zap className="h-4 w-4 text-amber-400" /> Solutions
                  </span>
                  <ChevronRight className="h-4 w-4 text-neutral-500" />
                </a>
                <a
                  href="#developers"
                  className="flex items-center justify-between text-neutral-300 hover:text-white"
                >
                  <span className="flex items-center gap-2.5">
                    <Terminal className="h-4 w-4 text-emerald-400" /> Developers & API
                  </span>
                  <ChevronRight className="h-4 w-4 text-neutral-500" />
                </a>
                <a
                  href="#docs"
                  className="flex items-center justify-between text-neutral-300 hover:text-white"
                >
                  <span className="flex items-center gap-2.5">
                    <Code2 className="h-4 w-4 text-purple-400" /> Documentation
                  </span>
                  <ExternalLink className="h-3.5 w-3.5 text-neutral-500" />
                </a>
              </nav>

              <div className="mt-6 pt-6 border-t border-neutral-800 flex flex-col gap-3">
                <button
                  type="button"
                  onClick={onCtaClick}
                  className="w-full rounded-xl bg-blue-600 py-2.5 text-center text-xs font-semibold text-white shadow-md hover:bg-blue-500"
                >
                  Start Building Free
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Search Modal / Bar */}
      <AnimatePresence>
        {showSearchModal && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="relative z-20 border-b border-neutral-800 bg-neutral-900/95 px-4 py-4 backdrop-blur-xl"
          >
            <div className="mx-auto max-w-2xl flex flex-col gap-3">
              <div className="flex w-full items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-widest text-neutral-400">
                  Global Unified Search
                </span>
                <button
                  type="button"
                  onClick={() => setShowSearchModal(false)}
                  className="rounded-full p-1 text-neutral-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search components, shaders, documentation..."
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-neutral-700 bg-neutral-950 text-sm text-white placeholder-neutral-500 focus:border-blue-500 focus:outline-none"
                  autoFocus
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Showcase Under Navbar */}
      <main className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900/80 px-3.5 py-1 text-xs text-neutral-300 backdrop-blur-md mb-6">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>Zero Runtime Latency · ISO 27001 Certified</span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            The next-generation <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              reactive interface framework
            </span>
          </h1>

          <p className="mt-5 text-base text-neutral-400 sm:text-lg">
            Engineered with Hooke’s Law spring physics, hardware-accelerated transforms, and
            production-grade developer tooling for world-class web applications.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={onCtaClick}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-neutral-950 shadow-lg hover:bg-neutral-200 transition-colors"
            >
              <span>Explore Blocks</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setShowSearchModal(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-neutral-800 bg-neutral-900/60 px-5 py-2.5 text-sm font-medium text-neutral-300 hover:border-neutral-700 hover:text-white transition-colors"
            >
              <span>Open Global Search</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default MegaNavbarBlock;

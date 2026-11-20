"use client";

import React, { useState, useRef, useEffect, useId } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  ChevronDown,
  ArrowRight,
  Sparkles,
  Zap,
  Shield,
  Layers,
  Box,
  Cpu,
  Compass,
  FileCode,
  Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface MegaMenuItem {
  title: string;
  description: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export interface MegaMenuCategory {
  id: string;
  label: string;
  title: string;
  description: string;
  items: MegaMenuItem[];
  featured?: {
    title: string;
    description: string;
    href: string;
    ctaText?: string;
    badge?: string;
  };
  quickLinks?: { label: string; href: string }[];
}

export interface MegaMenuProps extends React.HTMLAttributes<HTMLElement> {
  /** Array of mega menu categories with cards and links */
  categories?: MegaMenuCategory[];
  /** Controlled active category ID */
  activeCategory?: string;
  /** Callback fired when a category or link is chosen */
  onCategoryChange?: (id: string) => void;
  /** Custom trigger label or children */
  triggerLabel?: string;
  /** Custom container class */
  className?: string;
}

const DEFAULT_CATEGORIES: MegaMenuCategory[] = [
  {
    id: "products",
    label: "Products",
    title: "Kinetic Architecture",
    description: "Explore our physics-based primitives and application blocks.",
    items: [
      {
        title: "Kinetic Primitives",
        description: "106+ spring-driven buttons, cards, docks, and forms.",
        href: "#primitives",
        icon: Sparkles,
        badge: "v2.0",
      },
      {
        title: "Application Blocks",
        description: "Composite hero sections, pricing tables, and dashboards.",
        href: "#blocks",
        icon: Box,
      },
      {
        title: "Simulation Canvases",
        description: "Interactive particle mesh, black holes, and liquid caustics.",
        href: "#simulations",
        icon: Cpu,
        badge: "WebGL",
      },
      {
        title: "Design Tokens",
        description: "Calibrated typographic scales, palettes, and spring curves.",
        href: "#tokens",
        icon: Layers,
      },
    ],
    featured: {
      title: "BoseUI Pro Engine",
      description: "Upgrade your team's workflow with pre-assembled kinetic screens.",
      href: "#upgrade",
      ctaText: "Explore Pro",
      badge: "Release",
    },
    quickLinks: [
      { label: "Component Catalog", href: "#catalog" },
      { label: "Interactive Playground", href: "#playground" },
      { label: "Figma UI Kit", href: "#figma" },
    ],
  },
  {
    id: "developers",
    label: "Developers",
    title: "Developer Toolkit",
    description: "Documentation, CLI guides, and full source code access.",
    items: [
      {
        title: "CLI Registry",
        description: "Install directly into your codebase with npx shadcn add.",
        href: "#cli",
        icon: Zap,
      },
      {
        title: "Architecture & Rules",
        description: "Two-file contract, Hooke's Law physics, and zero-lock-in design.",
        href: "#architecture",
        icon: Shield,
      },
      {
        title: "Framework Recipes",
        description: "Next.js 14 App Router, Vite, Astro, and Remix integration.",
        href: "#recipes",
        icon: FileCode,
      },
      {
        title: "API Reference",
        description: "TypeScript interfaces, prop contracts, and accessibility guides.",
        href: "#api",
        icon: Compass,
      },
    ],
    featured: {
      title: "CLI Auto-Sync",
      description: "Run npm run sync to regenerate registry manifests and SEO in milliseconds.",
      href: "#sync",
      ctaText: "Read Docs",
    },
    quickLinks: [
      { label: "GitHub Repository", href: "https://github.com/Theb0se/bose-ui" },
      { label: "Contributing Guide", href: "#contributing" },
      { label: "Changelog", href: "#changelog" },
    ],
  },
  {
    id: "ecosystem",
    label: "Ecosystem",
    title: "Community & Workspaces",
    description: "Global open-source network of creators and design engineers.",
    items: [
      {
        title: "Showcase Gallery",
        description: "Real-world production SaaS and landing pages built with BoseUI.",
        href: "#showcase",
        icon: Globe,
      },
      {
        title: "Community Discord",
        description: "Get assistance, share kinetic experiments, and collaborate.",
        href: "#discord",
        icon: Sparkles,
      },
    ],
    quickLinks: [
      { label: "Author Portfolio", href: "https://theb0se.vercel.app/" },
      { label: "Report an Issue", href: "#issues" },
      { label: "Roadmap 2026", href: "#roadmap" },
    ],
  },
];

export function MegaMenu({
  categories = DEFAULT_CATEGORIES,
  activeCategory: controlledActive,
  onCategoryChange,
  triggerLabel = "Explore Platform",
  className,
  ...props
}: MegaMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [internalActiveId, setInternalActiveId] = useState(
    categories[0]?.id || ""
  );
  const [direction, setDirection] = useState<1 | -1>(1);
  const menuRef = useRef<HTMLDivElement>(null);
  const instanceId = useId();
  const shouldReduceMotion = useReducedMotion();

  const currentCategory =
    controlledActive !== undefined ? controlledActive : internalActiveId;

  const currentCategoryData =
    categories.find((c) => c.id === currentCategory) || categories[0];

  const handleSelectCategory = (id: string) => {
    const currentIndex = categories.findIndex((c) => c.id === currentCategory);
    const nextIndex = categories.findIndex((c) => c.id === id);
    setDirection(nextIndex > currentIndex ? 1 : -1);

    if (controlledActive === undefined) {
      setInternalActiveId(id);
    }
    onCategoryChange?.(id);
  };

  // Close when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div
      ref={menuRef}
      className={cn("relative inline-block text-left", className)}
      {...props}
    >
      {/* MegaMenu Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className="inline-flex items-center gap-2 rounded-xl border border-neutral-200/80 bg-white px-4 py-2 text-xs font-semibold text-neutral-900 shadow-sm transition-all hover:bg-neutral-50 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800"
      >
        <span>{triggerLabel}</span>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 transition-transform duration-200",
            isOpen ? "rotate-180" : ""
          )}
        />
      </button>

      {/* Floating Mega Dropdown Container */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 10, scale: 0.98 }
            }
            animate={
              shouldReduceMotion
                ? { opacity: 1 }
                : { opacity: 1, y: 0, scale: 1 }
            }
            exit={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 8, scale: 0.98 }
            }
            transition={{ type: "spring", stiffness: 420, damping: 30 }}
            className="absolute left-1/2 top-full z-50 mt-3 -translate-x-1/2 w-[92vw] max-w-4xl"
          >
            <div className="overflow-hidden rounded-2xl border border-neutral-200/90 bg-white/95 p-6 shadow-2xl shadow-neutral-900/10 backdrop-blur-2xl dark:border-neutral-800/90 dark:bg-neutral-950/95 dark:shadow-black/40">
              {/* Category Tab Selector */}
              <div className="flex items-center gap-2 border-b border-neutral-200/70 pb-4 dark:border-neutral-800/70">
                {categories.map((cat) => {
                  const isActive = cat.id === currentCategory;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleSelectCategory(cat.id)}
                      className={cn(
                        "relative rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none",
                        isActive
                          ? "text-neutral-950 font-bold dark:text-white"
                          : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                      )}
                    >
                      {isActive && (
                        <motion.div
                          layoutId={`mega-category-pill-${instanceId}`}
                          className="absolute inset-0 rounded-lg bg-neutral-100 dark:bg-neutral-800 -z-10 shadow-sm"
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 30,
                          }}
                        />
                      )}
                      <span>{cat.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Dynamic Content Panel with Directional Animation */}
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentCategoryData.id}
                  custom={direction}
                  initial={
                    shouldReduceMotion
                      ? { opacity: 0 }
                      : { opacity: 0, x: direction * 15 }
                  }
                  animate={
                    shouldReduceMotion ? { opacity: 1 } : { opacity: 1, x: 0 }
                  }
                  exit={
                    shouldReduceMotion
                      ? { opacity: 0 }
                      : { opacity: 0, x: direction * -15 }
                  }
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-12"
                >
                  {/* Left Section: Cards Grid */}
                  <div className="md:col-span-8">
                    <div className="mb-4">
                      <h3 className="text-sm font-bold text-neutral-950 dark:text-white">
                        {currentCategoryData.title}
                      </h3>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        {currentCategoryData.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {currentCategoryData.items.map((item) => {
                        const Icon = item.icon;
                        return (
                          <a
                            key={item.title}
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            className="group flex items-start gap-3 rounded-xl border border-transparent p-3 transition-all hover:border-neutral-200/80 hover:bg-neutral-50 dark:hover:border-neutral-800 dark:hover:bg-neutral-900/60"
                          >
                            {Icon && (
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-neutral-200/70 bg-white text-neutral-700 shadow-sm transition-transform group-hover:scale-105 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
                                <Icon className="h-4 w-4" />
                              </div>
                            )}
                            <div className="flex-1">
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-semibold text-neutral-900 group-hover:text-black dark:text-white dark:group-hover:text-white">
                                  {item.title}
                                </span>
                                {item.badge && (
                                  <span className="rounded bg-neutral-100 px-1.5 py-0.2 text-[9px] font-semibold text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
                                    {item.badge}
                                  </span>
                                )}
                              </div>
                              <p className="mt-0.5 text-[11px] leading-relaxed text-neutral-500 dark:text-neutral-400">
                                {item.description}
                              </p>
                            </div>
                          </a>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right Section: Featured Card & Quick Links */}
                  <div className="flex flex-col gap-5 border-t border-neutral-200/70 pt-6 md:border-l md:border-t-0 md:pl-6 md:pt-0 dark:border-neutral-800/70 md:col-span-4">
                    {currentCategoryData.featured && (
                      <div className="relative overflow-hidden rounded-xl border border-neutral-200/80 bg-neutral-50/70 p-4 dark:border-neutral-800 dark:bg-neutral-900/60">
                        {currentCategoryData.featured.badge && (
                          <span className="rounded-full bg-neutral-950 px-2 py-0.5 text-[9px] font-bold text-white dark:bg-white dark:text-neutral-950">
                            {currentCategoryData.featured.badge}
                          </span>
                        )}
                        <h4 className="mt-2 text-xs font-bold text-neutral-950 dark:text-white">
                          {currentCategoryData.featured.title}
                        </h4>
                        <p className="mt-1 text-[11px] leading-relaxed text-neutral-500 dark:text-neutral-400">
                          {currentCategoryData.featured.description}
                        </p>
                        <a
                          href={currentCategoryData.featured.href}
                          onClick={() => setIsOpen(false)}
                          className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-neutral-900 hover:underline dark:text-white"
                        >
                          <span>
                            {currentCategoryData.featured.ctaText || "Learn more"}
                          </span>
                          <ArrowRight className="h-3 w-3" />
                        </a>
                      </div>
                    )}

                    {currentCategoryData.quickLinks && (
                      <div className="flex flex-col gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                          Quick Links
                        </span>
                        <ul className="flex flex-col gap-1.5">
                          {currentCategoryData.quickLinks.map((link) => (
                            <li key={link.label}>
                              <a
                                href={link.href}
                                onClick={() => setIsOpen(false)}
                                className="inline-flex items-center gap-1 text-xs text-neutral-600 transition-colors hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white"
                              >
                                <span>{link.label}</span>
                                <ArrowRight className="h-2.5 w-2.5 opacity-60" />
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default MegaMenu;

"use client";

import React, { useState, useEffect, useRef, useId } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Menu, X, ChevronDown, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export interface NavbarDropdownItem {
  label: string;
  href: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export interface NavbarItem {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string;
  children?: NavbarDropdownItem[];
}

export interface NavbarAction {
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  icon?: React.ComponentType<{ className?: string }>;
}

export interface NavbarProps extends React.HTMLAttributes<HTMLElement> {
  /** Brand identity logo or element */
  brand?: React.ReactNode;
  /** Navigation links and sub-menus */
  items?: NavbarItem[];
  /** Right-aligned action buttons or call-to-actions */
  actions?: NavbarAction[];
  /** Visual style variant: "floating" island, "fixed" top bar, or "glass" header */
  variant?: "floating" | "fixed" | "glass";
  /** Positioning mode: "fixed" at top of viewport, "sticky", or "static" for embedded/preview containers */
  position?: "fixed" | "sticky" | "static";
  /** Whether to intelligently hide navbar on scroll down and reveal on scroll up */
  hideOnScroll?: boolean;
  /** Currently active item href */
  activeHref?: string;
  /** Callback fired when a navigation item is selected */
  onNavigate?: (href: string) => void;
  /** Optional custom Tailwind classes */
  className?: string;
}

const DEFAULT_ITEMS: NavbarItem[] = [
  { label: "Features", href: "#features" },
  {
    label: "Products",
    href: "#products",
    badge: "New",
    children: [
      {
        label: "Kinetic Primitives",
        href: "#primitives",
        description: "Zero-dependency spring-animated interactive components.",
        icon: Sparkles,
      },
      {
        label: "Application Blocks",
        href: "#blocks",
        description: "Composite dashboard, hero, and feature sections.",
      },
      {
        label: "Design Tokens",
        href: "#tokens",
        description: "Curated palettes, fluid typography, and kinetic easings.",
      },
    ],
  },
  { label: "Showcase", href: "#showcase" },
  { label: "Docs", href: "#docs" },
];

const DEFAULT_ACTIONS: NavbarAction[] = [
  { label: "Sign In", href: "#signin", variant: "ghost" },
  { label: "Get Started", href: "#get-started", variant: "primary" },
];

export function Navbar({
  brand,
  items = DEFAULT_ITEMS,
  actions = DEFAULT_ACTIONS,
  variant = "floating",
  position = "fixed",
  hideOnScroll = true,
  activeHref = "#features",
  onNavigate,
  className,
  ...props
}: NavbarProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentActive, setCurrentActive] = useState(activeHref);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const instanceId = useId();

  // Scroll detection for auto hide/reveal
  useEffect(() => {
    if (!hideOnScroll) return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < 40) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY + 8 && currentScrollY > 100) {
        setIsVisible(false);
        setActiveDropdown(null);
      } else if (currentScrollY < lastScrollY - 8) {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hideOnScroll, lastScrollY]);

  // Close dropdown on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveDropdown(null);
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleDropdownEnter = (idx: number) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setActiveDropdown(idx);
  };

  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  const handleItemClick = (href: string) => {
    setCurrentActive(href);
    setActiveDropdown(null);
    setMobileMenuOpen(false);
    onNavigate?.(href);
  };

  const variantStyles = {
    floating:
      "mx-auto mt-4 w-[92%] max-w-6xl rounded-2xl border border-neutral-200/80 bg-white/80 shadow-lg shadow-neutral-900/5 backdrop-blur-xl dark:border-neutral-800/80 dark:bg-neutral-950/80 dark:shadow-black/20",
    fixed:
      "w-full border-b border-neutral-200 bg-white/95 shadow-sm dark:border-neutral-800 dark:bg-neutral-950/95",
    glass:
      "w-full border-b border-white/20 bg-white/40 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-neutral-950/40",
  };

  return (
    <header
      className={cn(
        position === "static"
          ? "relative w-full z-20"
          : position === "sticky"
          ? "sticky top-0 left-0 right-0 z-50 transition-transform duration-300"
          : "fixed top-0 left-0 right-0 z-50 transition-transform duration-300",
        position !== "static" && (isVisible ? "translate-y-0" : "-translate-y-full"),
        variant === "floating" && position !== "static" ? "pointer-events-none" : ""
      )}
      {...props}
    >
      <nav
        aria-label="Main Navigation"
        className={cn(
          "pointer-events-auto relative px-4 py-2.5 sm:px-6",
          variantStyles[variant],
          className
        )}
      >
        <div className="flex items-center justify-between gap-4">
          {/* Brand Logo / Slot */}
          <div className="flex items-center gap-2">
            {brand || (
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleItemClick("#");
                }}
                className="group flex items-center gap-2.5 text-base font-bold tracking-tight text-neutral-900 transition-colors dark:text-white"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-900 text-white shadow-sm transition-transform group-hover:scale-105 dark:bg-white dark:text-neutral-950">
                  <span className="font-mono text-sm font-black">B</span>
                </div>
                <span className="bg-gradient-to-r from-neutral-900 to-neutral-700 bg-clip-text text-transparent dark:from-white dark:to-neutral-300">
                  BoseUI
                </span>
              </a>
            )}
          </div>

          {/* Desktop Navigation Links */}
          <div
            className="hidden md:flex items-center gap-1"
            onMouseLeave={() => setHoveredIdx(null)}
          >
            {items.map((item, idx) => {
              const isActive = currentActive === item.href;
              const isHovered = hoveredIdx === idx;
              const hasDropdown = Boolean(item.children && item.children.length > 0);
              const isDropdownOpen = activeDropdown === idx;

              return (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => {
                    setHoveredIdx(idx);
                    if (hasDropdown) handleDropdownEnter(idx);
                    else setActiveDropdown(null);
                  }}
                  onMouseLeave={() => {
                    if (hasDropdown) handleDropdownLeave();
                  }}
                >
                  <a
                    href={item.href}
                    onClick={(e) => {
                      if (!hasDropdown) {
                        e.preventDefault();
                        handleItemClick(item.href);
                      }
                    }}
                    aria-current={isActive ? "page" : undefined}
                    aria-expanded={hasDropdown ? isDropdownOpen : undefined}
                    aria-haspopup={hasDropdown ? "true" : undefined}
                    className={cn(
                      "relative flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-600",
                      isActive
                        ? "text-neutral-950 font-semibold dark:text-white"
                        : "text-neutral-600 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white"
                    )}
                  >
                    {/* Shared Layout Hover Pill */}
                    {isHovered && !shouldReduceMotion && (
                      <motion.div
                        layoutId={`navbar-hover-${instanceId}`}
                        className="absolute inset-0 rounded-lg bg-neutral-100/90 dark:bg-neutral-800/80 -z-10"
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 30,
                        }}
                      />
                    )}

                    {/* Active Link Spring Indicator */}
                    {isActive && (
                      <motion.div
                        layoutId={`navbar-active-${instanceId}`}
                        className="absolute -bottom-1 left-3 right-3 h-0.5 rounded-full bg-neutral-950 dark:bg-white"
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 28,
                        }}
                      />
                    )}

                    {item.icon && <item.icon className="h-3.5 w-3.5" />}
                    <span>{item.label}</span>

                    {item.badge && (
                      <span className="rounded-full bg-neutral-200/80 px-1.5 py-0.2 text-[10px] font-semibold text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                        {item.badge}
                      </span>
                    )}

                    {hasDropdown && (
                      <ChevronDown
                        className={cn(
                          "h-3 w-3 transition-transform duration-200",
                          isDropdownOpen ? "rotate-180" : ""
                        )}
                      />
                    )}
                  </a>

                  {/* Dropdown Menu */}
                  {hasDropdown && (
                    <AnimatePresence>
                      {isDropdownOpen && (
                        <motion.div
                          initial={
                            shouldReduceMotion
                              ? { opacity: 0 }
                              : { opacity: 0, y: 8, scale: 0.96 }
                          }
                          animate={
                            shouldReduceMotion
                              ? { opacity: 1 }
                              : { opacity: 1, y: 0, scale: 1 }
                          }
                          exit={
                            shouldReduceMotion
                              ? { opacity: 0 }
                              : { opacity: 0, y: 6, scale: 0.96 }
                          }
                          transition={{
                            type: "spring",
                            stiffness: 450,
                            damping: 30,
                          }}
                          className="absolute left-0 top-full pt-2 w-72 z-50"
                        >
                          <div className="overflow-hidden rounded-xl border border-neutral-200/90 bg-white p-2 shadow-xl shadow-neutral-900/10 backdrop-blur-xl dark:border-neutral-800 dark:bg-neutral-900/95 dark:shadow-black/30">
                            {item.children!.map((subItem) => (
                              <a
                                key={subItem.label}
                                href={subItem.href}
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleItemClick(subItem.href);
                                }}
                                className="group flex items-start gap-3 rounded-lg p-2.5 transition-colors hover:bg-neutral-100/80 dark:hover:bg-neutral-800/70"
                              >
                                {subItem.icon && (
                                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-neutral-200/70 bg-neutral-50 text-neutral-600 transition-colors group-hover:border-neutral-400 group-hover:text-neutral-950 dark:border-neutral-700 dark:bg-neutral-800/80 dark:text-neutral-300 dark:group-hover:text-white">
                                    <subItem.icon className="h-3.5 w-3.5" />
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-xs font-semibold text-neutral-900 dark:text-white">
                                      {subItem.label}
                                    </span>
                                    {subItem.badge && (
                                      <span className="rounded bg-neutral-100 px-1 py-0.5 text-[9px] font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
                                        {subItem.badge}
                                      </span>
                                    )}
                                  </div>
                                  {subItem.description && (
                                    <p className="mt-0.5 text-[11px] leading-snug text-neutral-500 line-clamp-2 dark:text-neutral-400">
                                      {subItem.description}
                                    </p>
                                  )}
                                </div>
                              </a>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              );
            })}
          </div>

          {/* Action CTAs */}
          <div className="hidden md:flex items-center gap-2">
            {actions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.label}
                  type="button"
                  onClick={action.onClick}
                  className={cn(
                    "relative inline-flex items-center justify-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-600",
                    action.variant === "primary"
                      ? "bg-neutral-950 text-white shadow hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
                      : action.variant === "secondary"
                      ? "border border-neutral-300/80 bg-white text-neutral-900 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800"
                      : "text-neutral-600 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white"
                  )}
                >
                  {Icon && <Icon className="h-3.5 w-3.5" />}
                  <span>{action.label}</span>
                </button>
              );
            })}
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-700 transition-colors hover:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
            >
              {mobileMenuOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Slide-down Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, height: 0, y: -8 }
              }
              animate={
                shouldReduceMotion
                  ? { opacity: 1 }
                  : { opacity: 1, height: "auto", y: 0 }
              }
              exit={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, height: 0, y: -8 }
              }
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              className="overflow-hidden md:hidden pt-3 border-t border-neutral-200/70 mt-3 dark:border-neutral-800/80"
            >
              <div className="flex flex-col gap-1 pb-2">
                {items.map((item) => {
                  const isActive = currentActive === item.href;
                  return (
                    <div key={item.label} className="flex flex-col">
                      <a
                        href={item.href}
                        onClick={(e) => {
                          e.preventDefault();
                          handleItemClick(item.href);
                        }}
                        className={cn(
                          "flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-colors",
                          isActive
                            ? "bg-neutral-100 font-semibold text-neutral-950 dark:bg-neutral-800 dark:text-white"
                            : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-950 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-white"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          {item.icon && <item.icon className="h-3.5 w-3.5" />}
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className="rounded bg-neutral-200 px-1.5 py-0.5 text-[9px] font-semibold text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                            {item.badge}
                          </span>
                        )}
                      </a>

                      {/* Mobile Sub-items */}
                      {item.children && (
                        <div className="ml-4 flex flex-col gap-1 border-l border-neutral-200 pl-2 my-1 dark:border-neutral-800">
                          {item.children.map((subItem) => (
                            <a
                              key={subItem.label}
                              href={subItem.href}
                              onClick={(e) => {
                                e.preventDefault();
                                handleItemClick(subItem.href);
                              }}
                              className="rounded-md px-2 py-1.5 text-[11px] text-neutral-500 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white"
                            >
                              {subItem.label}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}

                <div className="mt-3 flex flex-col gap-2 pt-2 border-t border-neutral-200/60 dark:border-neutral-800/70">
                  {actions.map((action) => (
                    <button
                      key={action.label}
                      type="button"
                      onClick={() => {
                        action.onClick?.();
                        setMobileMenuOpen(false);
                      }}
                      className={cn(
                        "w-full rounded-lg py-2 text-center text-xs font-medium transition-all active:scale-98",
                        action.variant === "primary"
                          ? "bg-neutral-950 text-white dark:bg-white dark:text-neutral-950"
                          : "border border-neutral-300/80 bg-white text-neutral-800 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
                      )}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}

export default Navbar;

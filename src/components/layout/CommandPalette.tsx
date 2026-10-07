"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Search,
  Sparkles,
  BookOpen,
  Layers,
  Terminal,
  ExternalLink,
  CornerDownLeft,
  Check,
  Home,
  User,
  SunMoon,
} from "lucide-react";
import { PULSE_COMPONENTS } from "@/registry/generated-catalog";
import { useTheme } from "@/components/layout/ThemeProvider";
import { copyToClipboard, SITE_CONFIG } from "@/lib/utils";

interface CommandPaletteContextValue {
  isOpen: boolean;
  openPalette: () => void;
  closePalette: () => void;
  togglePalette: () => void;
}

const CommandPaletteContext = createContext<CommandPaletteContextValue>({
  isOpen: false,
  openPalette: () => {},
  closePalette: () => {},
  togglePalette: () => {},
});

export function useCommandPalette() {
  return useContext(CommandPaletteContext);
}

interface CommandActionItem {
  id: string;
  group: "Components" | "Navigation" | "CLI Registry" | "Creator";
  title: string;
  subtitle: string;
  badge?: string;
  icon: React.ReactNode;
  keywords: string;
  onSelect: () => void;
}

export function CommandPaletteProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const inputRef = useRef<HTMLInputElement>(null);

  const openPalette = useCallback(() => {
    setQuery("");
    setSelectedIndex(0);
    setIsOpen(true);
  }, []);

  const closePalette = useCallback(() => {
    setIsOpen(false);
  }, []);

  const togglePalette = useCallback(() => {
    setIsOpen((prev) => {
      if (!prev) {
        setQuery("");
        setSelectedIndex(0);
      }
      return !prev;
    });
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        togglePalette();
      } else if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        closePalette();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, togglePalette, closePalette]);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 20);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const actions: CommandActionItem[] = useMemo(() => {
    const componentItems: CommandActionItem[] = PULSE_COMPONENTS.map((comp) => ({
      id: `comp-${comp.slug}`,
      group: "Components",
      title: comp.title,
      subtitle: comp.description,
      badge: comp.category,
      icon: <Sparkles className="h-4 w-4" />,
      keywords: `${comp.title} ${comp.slug} ${comp.category} ${comp.badges.join(" ")} ${(comp.keywords || []).join(" ")}`,
      onSelect: () => {
        router.push(`/components/${comp.slug}`);
        closePalette();
      },
    }));

    const cliItems: CommandActionItem[] = PULSE_COMPONENTS.map((comp) => ({
      id: `cli-${comp.slug}`,
      group: "CLI Registry",
      title: `Copy CLI: ${comp.slug}`,
      subtitle: comp.cliCommand,
      badge: "Copy CLI",
      icon: <Terminal className="h-4 w-4" />,
      keywords: `cli install npx shadcn ${comp.slug} ${comp.title}`,
      onSelect: async () => {
        await copyToClipboard(comp.cliCommand);
        setCopiedId(`cli-${comp.slug}`);
        setTimeout(() => {
          setCopiedId(null);
          closePalette();
        }, 650);
      },
    }));

    const navItems: CommandActionItem[] = [
      {
        id: "nav-theme",
        group: "Navigation",
        title: `Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`,
        subtitle: "Toggle between high-contrast Light and Dark monochrome themes",
        badge: "Theme",
        icon: <SunMoon className="h-4 w-4" />,
        keywords: "theme light dark mode toggle appearance",
        onSelect: () => {
          toggleTheme();
          closePalette();
        },
      },
      {
        id: "nav-home",
        group: "Navigation",
        title: "Home — BoseUI",
        subtitle: "Landing page & interactive Bento playground",
        icon: <Home className="h-4 w-4" />,
        keywords: "home landing hero bento",
        onSelect: () => {
          router.push("/");
          closePalette();
        },
      },
      {
        id: "nav-components",
        group: "Navigation",
        title: "Components Directory",
        subtitle: "Browse all kinetic React components",
        icon: <Layers className="h-4 w-4" />,
        keywords: "components directory catalog browse grid",
        onSelect: () => {
          router.push("/components");
          closePalette();
        },
      },
      {
        id: "nav-docs",
        group: "Navigation",
        title: "Documentation",
        subtitle: "Getting started & CLI installation guide",
        icon: <BookOpen className="h-4 w-4" />,
        keywords: "docs documentation guide install cli architecture sync",
        onSelect: () => {
          router.push("/docs");
          closePalette();
        },
      },
    ];

    const creatorItems: CommandActionItem[] = [
      {
        id: "creator-portfolio",
        group: "Creator",
        title: "Rishabh Bose — Portfolio",
        subtitle: SITE_CONFIG.author.portfolio,
        badge: "External",
        icon: <User className="h-4 w-4" />,
        keywords: "rishabh bose creator author portfolio website theb0se",
        onSelect: () => {
          window.open(
            SITE_CONFIG.author.portfolio,
            "_blank",
            "noopener,noreferrer"
          );
          closePalette();
        },
      },
      {
        id: "creator-github",
        group: "Creator",
        title: "GitHub — @Theb0se",
        subtitle: SITE_CONFIG.author.github,
        badge: "External",
        icon: <ExternalLink className="h-4 w-4" />,
        keywords: "github source code repo rishabh bose theb0se",
        onSelect: () => {
          window.open(
            SITE_CONFIG.author.github,
            "_blank",
            "noopener,noreferrer"
          );
          closePalette();
        },
      },
    ];

    return [...componentItems, ...navItems, ...cliItems, ...creatorItems];
  }, [router, closePalette, theme, toggleTheme]);

  const filteredActions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return actions;
    return actions.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.keywords.toLowerCase().includes(q)
    );
  }, [actions, query]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleListKeyDown = (e: React.KeyboardEvent) => {
    if (filteredActions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredActions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(
        (prev) => (prev - 1 + filteredActions.length) % filteredActions.length
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      filteredActions[selectedIndex]?.onSelect();
    }
  };

  return (
    <CommandPaletteContext.Provider
      value={{ isOpen, openPalette, closePalette, togglePalette }}
    >
      {children}

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[12vh]">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.14 }}
              onClick={closePalette}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm dark:bg-black/80"
            />

            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="BoseUI Command Palette"
              initial={{ opacity: 0, scale: 0.96, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -10 }}
              transition={{ type: "spring", stiffness: 420, damping: 30 }}
              onKeyDown={handleListKeyDown}
              className="relative z-10 w-full max-w-xl overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl dark:border-[#262626] dark:bg-[#0A0A0A]"
            >
              <div className="flex items-center gap-3 border-b border-neutral-200 px-4 py-3.5 dark:border-[#1F1F1F]">
                <Search className="h-4 w-4 shrink-0 text-black dark:text-white" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search components, CLI commands, or theme..."
                  className="w-full bg-transparent text-sm text-black placeholder-neutral-400 focus:outline-none dark:text-white dark:placeholder-neutral-500"
                />
                <button
                  type="button"
                  onClick={closePalette}
                  className="rounded border border-neutral-200 bg-neutral-100 px-2 py-0.5 font-mono text-[10px] text-neutral-500 hover:border-black hover:text-black dark:border-[#262626] dark:bg-[#141414] dark:text-neutral-400 dark:hover:border-white dark:hover:text-white"
                >
                  ESC
                </button>
              </div>

              <div className="max-h-[370px] overflow-y-auto p-2">
                {filteredActions.length === 0 ? (
                  <div className="py-12 text-center">
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      No results found for{" "}
                      <span className="font-mono text-black dark:text-white">
                        &ldquo;{query}&rdquo;
                      </span>
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {filteredActions.map((item, idx) => {
                      const isSelected = idx === selectedIndex;
                      const isCopied = copiedId === item.id;

                      return (
                        <button
                          key={item.id}
                          type="button"
                          onMouseEnter={() => setSelectedIndex(idx)}
                          onClick={item.onSelect}
                          className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                            isSelected
                              ? "bg-neutral-100 text-black dark:bg-[#181818] dark:text-white"
                              : "text-neutral-600 hover:bg-neutral-50 dark:text-neutral-400 dark:hover:bg-[#121212]"
                          }`}
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            <div
                              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${
                                isSelected
                                  ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                                  : "border-neutral-200 bg-white text-black dark:border-[#262626] dark:bg-black dark:text-white"
                              }`}
                            >
                              {isCopied ? (
                                <Check className="h-4 w-4" />
                              ) : (
                                item.icon
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="truncate text-sm font-medium text-black dark:text-white">
                                  {item.title}
                                </span>
                                <span className="font-mono text-[10px] text-neutral-400 dark:text-neutral-500">
                                  {item.group}
                                </span>
                              </div>
                              <p className="truncate text-xs text-neutral-500">
                                {item.subtitle}
                              </p>
                            </div>
                          </div>

                          <div className="flex shrink-0 items-center gap-2">
                            {item.badge && (
                              <span className="rounded border border-neutral-200 bg-white px-2 py-0.5 font-mono text-[10px] text-neutral-500 dark:border-[#262626] dark:bg-black dark:text-neutral-400">
                                {isCopied ? "COPIED" : item.badge}
                              </span>
                            )}
                            <CornerDownLeft
                              className={`h-3.5 w-3.5 transition-opacity ${
                                isSelected
                                  ? "text-black opacity-100 dark:text-white"
                                  : "opacity-0"
                              }`}
                            />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between border-t border-neutral-200 bg-neutral-50 px-4 py-2.5 text-[11px] text-neutral-500 dark:border-[#1F1F1F] dark:bg-black">
                <div className="flex items-center gap-3 font-mono">
                  <span>↑↓ Navigate</span>
                  <span>↵ Select</span>
                  <span>ESC Close</span>
                </div>
                <span className="font-mono text-[10px]">BoseUI</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </CommandPaletteContext.Provider>
  );
}

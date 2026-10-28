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
  HeartHandshake,
} from "lucide-react";
import { CATALOG_INDEX } from "@/registry/catalog-index";
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
  const listContainerRef = useRef<HTMLDivElement>(null);
  const selectedItemRef = useRef<HTMLButtonElement | null>(null);

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
      const timer = setTimeout(() => inputRef.current?.focus(), 25);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const actions: CommandActionItem[] = useMemo(() => {
    const componentItems: CommandActionItem[] = CATALOG_INDEX.map((comp) => ({
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

    const cliItems: CommandActionItem[] = CATALOG_INDEX.map((comp) => {
      const cliCommand = `npx shadcn@latest add "${SITE_CONFIG.url}/r/${comp.slug}.json"`;
      return {
        id: `cli-${comp.slug}`,
        group: "CLI Registry",
        title: `Copy CLI: ${comp.title}`,
        subtitle: cliCommand,
        badge: "CLI",
        icon: <Terminal className="h-4 w-4" />,
        keywords: `cli install npx shadcn ${comp.slug} ${comp.title}`,
        onSelect: async () => {
          await copyToClipboard(cliCommand);
          setCopiedId(`cli-${comp.slug}`);
          setTimeout(() => {
            setCopiedId(null);
            closePalette();
          }, 600);
        },
      };
    });

    const navItems: CommandActionItem[] = [
      {
        id: "nav-theme",
        group: "Navigation",
        title: `Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`,
        subtitle: "Toggle between high-contrast Light and Dark themes",
        badge: "Theme",
        icon: <SunMoon className="h-4 w-4" />,
        keywords: "theme light dark mode toggle appearance color",
        onSelect: () => {
          toggleTheme();
          closePalette();
        },
      },
      {
        id: "nav-home",
        group: "Navigation",
        title: "Home",
        subtitle: "BoseUI landing showcase and kinetic playground",
        icon: <Home className="h-4 w-4" />,
        keywords: "home landing hero bento showcase",
        onSelect: () => {
          router.push("/");
          closePalette();
        },
      },
      {
        id: "nav-components",
        group: "Navigation",
        title: "Components Directory",
        subtitle: "Browse all kinetic React components and category filters",
        icon: <Layers className="h-4 w-4" />,
        keywords: "components directory catalog browse grid table primitives",
        onSelect: () => {
          router.push("/components");
          closePalette();
        },
      },
      {
        id: "nav-docs",
        group: "Navigation",
        title: "Documentation",
        subtitle: "Getting started, CLI usage, and architecture overview",
        icon: <BookOpen className="h-4 w-4" />,
        keywords: "docs documentation guide install cli architecture",
        onSelect: () => {
          router.push("/docs");
          closePalette();
        },
      },
      {
        id: "nav-contributing",
        group: "Navigation",
        title: "Contributing Guide",
        subtitle: "How to scaffold, build, and submit components to BoseUI",
        badge: "Guide",
        icon: <HeartHandshake className="h-4 w-4" />,
        keywords: "contribute contributing guide component new pull request github open source",
        onSelect: () => {
          router.push("/docs/contributing");
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
        title: "GitHub — @Theb0se/bose-ui",
        subtitle: SITE_CONFIG.author.repo,
        badge: "External",
        icon: <ExternalLink className="h-4 w-4" />,
        keywords: "github source code repo rishabh bose theb0se",
        onSelect: () => {
          window.open(
            SITE_CONFIG.author.repo,
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

  // Keep selected item visible in list
  useEffect(() => {
    if (selectedItemRef.current) {
      selectedItemRef.current.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    }
  }, [selectedIndex]);

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
          <div className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[10vh] sm:pt-[12vh]">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={closePalette}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm dark:bg-black/80"
            />

            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="BoseUI Command Palette"
              initial={{ opacity: 0, scale: 0.98, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -8 }}
              transition={{ duration: 0.16, ease: "easeOut" }}
              onKeyDown={handleListKeyDown}
              className="relative z-10 w-full max-w-xl overflow-hidden rounded-2xl border border-neutral-200/90 bg-white shadow-2xl dark:border-neutral-800 dark:bg-[#0A0A0A]"
            >
              <div className="flex items-center gap-3 border-b border-neutral-200 px-4 py-3.5 dark:border-neutral-800">
                <Search className="h-4 w-4 shrink-0 text-neutral-500 dark:text-neutral-400" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Type a command or search components..."
                  className="w-full bg-transparent text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none dark:text-white dark:placeholder:text-neutral-500"
                />
                <button
                  type="button"
                  onClick={closePalette}
                  className="rounded border border-neutral-200 bg-neutral-100 px-2 py-0.5 font-mono text-[10px] text-neutral-500 hover:border-neutral-400 hover:text-neutral-900 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:border-neutral-600 dark:hover:text-white"
                >
                  ESC
                </button>
              </div>

              <div
                ref={listContainerRef}
                className="max-h-[380px] overflow-y-auto p-2"
              >
                {filteredActions.length === 0 ? (
                  <div className="py-12 text-center">
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      No matching actions found for{" "}
                      <span className="font-mono text-neutral-900 dark:text-white">
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
                          ref={isSelected ? selectedItemRef : undefined}
                          type="button"
                          onMouseEnter={() => setSelectedIndex(idx)}
                          onClick={item.onSelect}
                          className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-left transition-colors ${
                            isSelected
                              ? "bg-neutral-100 text-neutral-950 dark:bg-neutral-900 dark:text-white"
                              : "text-neutral-600 hover:bg-neutral-50 dark:text-neutral-400 dark:hover:bg-neutral-900/50"
                          }`}
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            <div
                              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-colors ${
                                isSelected
                                  ? "border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-950"
                                  : "border-neutral-200 bg-neutral-50 text-neutral-700 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300"
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
                                <span className="truncate text-xs font-semibold text-neutral-950 dark:text-white sm:text-sm">
                                  {item.title}
                                </span>
                                <span className="font-mono text-[10px] text-neutral-400 dark:text-neutral-500">
                                  {item.group}
                                </span>
                              </div>
                              <p className="truncate text-xs text-neutral-500 dark:text-neutral-400">
                                {item.subtitle}
                              </p>
                            </div>
                          </div>

                          <div className="flex shrink-0 items-center gap-2">
                            {item.badge && (
                              <span className="rounded border border-neutral-200 bg-white px-2 py-0.5 font-mono text-[10px] text-neutral-500 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-400">
                                {isCopied ? "COPIED" : item.badge}
                              </span>
                            )}
                            <CornerDownLeft
                              className={`h-3.5 w-3.5 transition-opacity ${
                                isSelected
                                  ? "text-neutral-900 opacity-100 dark:text-white"
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

              <div className="flex items-center justify-between border-t border-neutral-200 bg-neutral-50 px-4 py-2 text-[11px] text-neutral-500 dark:border-neutral-800 dark:bg-neutral-950">
                <div className="flex items-center gap-3 font-mono text-[10px] sm:text-[11px]">
                  <span>↑↓ Navigate</span>
                  <span>↵ Select</span>
                  <span>ESC Close</span>
                </div>
                <span className="font-mono text-[10px] text-neutral-400">BoseUI v2</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </CommandPaletteContext.Provider>
  );
}

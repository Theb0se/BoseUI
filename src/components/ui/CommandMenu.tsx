"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Search,
  Command,
  CornerDownLeft,
  ArrowUp,
  ArrowDown,
  FileCode2,
  Terminal,
  Sparkles,
  Settings,
  Layers,
  Moon,
  Copy,
  CheckCircle2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface CommandItem {
  id: string;
  label: string;
  group: string;
  shortcut?: string;
  keywords?: string[];
  icon?: React.ReactNode;
  onSelect?: () => void;
}

export interface CommandMenuProps {
  /** Array of command items grouped by their `group` property */
  items?: CommandItem[];
  /** Search input placeholder */
  placeholder?: string;
  /** Label on the trigger button */
  triggerLabel?: string;
  /** Enable global Cmd+K / Ctrl+K shortcut listener. Default: true */
  enableGlobalShortcut?: boolean;
  /** Controlled open state */
  open?: boolean;
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Callback fired when any command item is selected */
  onSelect?: (item: CommandItem) => void;
  /** Empty state message when no commands match */
  emptyMessage?: string;
  className?: string;
}

const DEFAULT_COMMANDS: CommandItem[] = [
  {
    id: "new-component",
    label: "Create New Component",
    group: "Quick Actions",
    shortcut: "⌘ N",
    keywords: ["add", "generate", "ui", "template"],
    icon: <Sparkles className="h-4 w-4" />,
  },
  {
    id: "copy-cli",
    label: "Copy CLI Install Command",
    group: "Quick Actions",
    shortcut: "⌘ C",
    keywords: ["npx", "shadcn", "registry", "terminal"],
    icon: <Terminal className="h-4 w-4" />,
  },
  {
    id: "copy-theme",
    label: "Copy Tailwind Config Tokens",
    group: "Quick Actions",
    shortcut: "⇧ ⌘ C",
    keywords: ["css", "styles", "tokens"],
    icon: <Copy className="h-4 w-4" />,
  },
  {
    id: "nav-components",
    label: "Browse All Components",
    group: "Navigation",
    shortcut: "G C",
    keywords: ["catalog", "gallery", "list"],
    icon: <Layers className="h-4 w-4" />,
  },
  {
    id: "nav-docs",
    label: "Open Documentation & Guides",
    group: "Navigation",
    shortcut: "G D",
    keywords: ["help", "readme", "setup"],
    icon: <FileCode2 className="h-4 w-4" />,
  },
  {
    id: "pref-theme",
    label: "Toggle Dark / Light Appearance",
    group: "Preferences",
    shortcut: "⌘ J",
    keywords: ["dark mode", "light mode", "theme"],
    icon: <Moon className="h-4 w-4" />,
  },
  {
    id: "pref-settings",
    label: "Workspace Settings",
    group: "Preferences",
    shortcut: "⌘ ,",
    keywords: ["config", "account", "preferences"],
    icon: <Settings className="h-4 w-4" />,
  },
];

export function CommandMenu({
  items = DEFAULT_COMMANDS,
  placeholder = "Type a command or search...",
  triggerLabel = "Search commands...",
  enableGlobalShortcut = true,
  open: controlledOpen,
  onOpenChange,
  onSelect,
  emptyMessage = "No matching commands found.",
  className,
}: CommandMenuProps) {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const [mounted, setMounted] = useState(false);
  const [internalOpen, setInternalOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [lastExecuted, setLastExecuted] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;

  useEffect(() => {
    setMounted(true);
  }, []);

  const setOpen = (next: boolean) => {
    if (!isControlled) {
      setInternalOpen(next);
    }
    if (!next) {
      setQuery("");
      setActiveIndex(0);
    }
    onOpenChange?.(next);
  };

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.group.toLowerCase().includes(q) ||
        (item.keywords?.some((k) => k.toLowerCase().includes(q)) ?? false)
    );
  }, [items, query]);

  const groupedItems = useMemo(() => {
    const groups: { group: string; entries: { item: CommandItem; flatIndex: number }[] }[] = [];
    let counter = 0;

    filteredItems.forEach((item) => {
      let existing = groups.find((g) => g.group === item.group);
      if (!existing) {
        existing = { group: item.group, entries: [] };
        groups.push(existing);
      }
      existing.entries.push({ item, flatIndex: counter });
      counter += 1;
    });

    return groups;
  }, [filteredItems]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  // Global Cmd+K / Ctrl+K listener
  useEffect(() => {
    if (!enableGlobalShortcut) return;
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(!isOpen);
      }
    };
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [enableGlobalShortcut, isOpen]);

  // Lock body scroll and focus input when open
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const timer = setTimeout(() => inputRef.current?.focus(), 20);
    return () => {
      document.body.style.overflow = prevOverflow;
      clearTimeout(timer);
    };
  }, [isOpen]);

  // Scroll active command into view
  useEffect(() => {
    if (!isOpen || !listRef.current) return;
    const activeEl = listRef.current.querySelector<HTMLElement>(
      `[data-cmd-index="${activeIndex}"]`
    );
    activeEl?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, isOpen]);

  const handleSelect = (item: CommandItem) => {
    item.onSelect?.();
    onSelect?.(item);
    setLastExecuted(item.label);
    setOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (filteredItems.length > 0) {
        setActiveIndex((prev) => (prev + 1) % filteredItems.length);
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (filteredItems.length > 0) {
        setActiveIndex(
          (prev) => (prev - 1 + filteredItems.length) % filteredItems.length
        );
      }
    } else if (e.key === "Enter" && filteredItems[activeIndex]) {
      e.preventDefault();
      handleSelect(filteredItems[activeIndex]);
    } else if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
    }
  };

  return (
    <div className={cn("inline-flex flex-col items-center gap-2.5", className)}>
      {/* Search Bar Trigger */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group flex h-11 w-full min-w-[260px] max-w-sm items-center justify-between gap-4 rounded-xl border border-neutral-200 bg-white px-3.5 text-xs text-neutral-500 shadow-sm transition-all hover:border-black hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:border-[#262626] dark:bg-[#0A0A0A] dark:text-neutral-400 dark:hover:border-white dark:hover:text-white dark:focus-visible:ring-white"
      >
        <span className="flex items-center gap-2.5">
          <Search className="h-3.5 w-3.5 text-neutral-400 transition-colors group-hover:text-black dark:group-hover:text-white" />
          <span className="font-medium">{triggerLabel}</span>
        </span>
        <kbd className="inline-flex items-center gap-0.5 rounded-md border border-neutral-200 bg-neutral-100 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-neutral-600 dark:border-[#262626] dark:bg-[#141414] dark:text-neutral-400">
          <Command className="h-2.5 w-2.5" />K
        </kbd>
      </button>

      {lastExecuted && (
        <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 dark:text-neutral-400">
          <CheckCircle2 className="h-3.5 w-3.5 text-black dark:text-white" />
          <span>
            Ran: <strong className="font-medium text-black dark:text-white">{lastExecuted}</strong>
          </span>
        </div>
      )}

      {mounted &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <div className="fixed inset-0 z-[9999] flex items-start justify-center p-4 pt-[12vh] sm:pt-[16vh]">
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setOpen(false)}
                  className="fixed inset-0 bg-black/50 backdrop-blur-xs"
                />

                {/* Command Palette Dialog */}
                <motion.div
                  role="dialog"
                  aria-modal="true"
                  aria-label="Command Menu"
                  initial={
                    shouldReduceMotion
                      ? { opacity: 0 }
                      : { opacity: 0, scale: 0.95, y: -12 }
                  }
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={
                    shouldReduceMotion
                      ? { opacity: 0 }
                      : { opacity: 0, scale: 0.96, y: -8 }
                  }
                  transition={{ type: "spring", stiffness: 420, damping: 30 }}
                  className="relative z-10 flex w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl dark:border-[#262626] dark:bg-[#0A0A0A]"
                >
                  {/* Search Input Header */}
                  <div className="flex items-center gap-3 border-b border-neutral-200 px-4 py-3.5 dark:border-[#1A1A1A]">
                    <Search className="h-4 w-4 shrink-0 text-neutral-400" />
                    <input
                      ref={inputRef}
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={placeholder}
                      className="w-full bg-transparent text-sm text-black placeholder:text-neutral-400 focus:outline-none dark:text-white dark:placeholder:text-neutral-500"
                    />
                    {query && (
                      <button
                        type="button"
                        aria-label="Clear search"
                        onClick={() => {
                          setQuery("");
                          inputRef.current?.focus();
                        }}
                        className="rounded-md p-1 text-neutral-400 hover:bg-neutral-100 hover:text-black dark:hover:bg-[#161616] dark:hover:text-white"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="rounded-md border border-neutral-200 bg-neutral-100 px-1.5 py-0.5 font-mono text-[10px] font-medium text-neutral-500 hover:text-black dark:border-[#262626] dark:bg-[#141414] dark:text-neutral-400 dark:hover:text-white"
                    >
                      ESC
                    </button>
                  </div>

                  {/* Grouped Results List */}
                  <div
                    ref={listRef}
                    role="listbox"
                    className="max-h-[320px] overflow-y-auto p-2"
                  >
                    {groupedItems.length === 0 ? (
                      <div className="py-10 text-center text-xs text-neutral-400">
                        {emptyMessage}
                      </div>
                    ) : (
                      groupedItems.map((groupBlock) => (
                        <div key={groupBlock.group} className="mb-2 last:mb-0">
                          <div className="px-2.5 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                            {groupBlock.group}
                          </div>
                          {groupBlock.entries.map(({ item, flatIndex }) => {
                            const isActive = flatIndex === activeIndex;
                            return (
                              <button
                                key={item.id}
                                type="button"
                                role="option"
                                data-cmd-index={flatIndex}
                                aria-selected={isActive}
                                onMouseEnter={() => setActiveIndex(flatIndex)}
                                onClick={() => handleSelect(item)}
                                className={cn(
                                  "flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition-colors",
                                  isActive
                                    ? "bg-neutral-100 text-black dark:bg-[#161616] dark:text-white"
                                    : "text-neutral-600 hover:bg-neutral-50 dark:text-neutral-400 dark:hover:bg-[#121212]"
                                )}
                              >
                                <span className="flex items-center gap-3 font-medium">
                                  <span
                                    className={cn(
                                      "flex h-7 w-7 items-center justify-center rounded-lg border transition-colors",
                                      isActive
                                        ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                                        : "border-neutral-200 bg-neutral-50 text-neutral-500 dark:border-[#262626] dark:bg-[#121212] dark:text-neutral-400"
                                    )}
                                  >
                                    {item.icon ?? <Command className="h-3.5 w-3.5" />}
                                  </span>
                                  <span>{item.label}</span>
                                </span>

                                {item.shortcut && (
                                  <kbd className="rounded-md border border-neutral-200 bg-white px-1.5 py-0.5 font-mono text-[10px] text-neutral-500 dark:border-[#262626] dark:bg-[#0A0A0A] dark:text-neutral-400">
                                    {item.shortcut}
                                  </kbd>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      ))
                    )}
                  </div>

                  {/* Keyboard Hint Footer */}
                  <div className="flex items-center justify-between border-t border-neutral-200 bg-neutral-50/70 px-4 py-2.5 text-[11px] text-neutral-400 dark:border-[#1A1A1A] dark:bg-[#0D0D0D]">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center gap-1">
                        <ArrowUp className="h-3 w-3" />
                        <ArrowDown className="h-3 w-3" />
                        Navigate
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <CornerDownLeft className="h-3 w-3" />
                        Run
                      </span>
                    </div>
                    <span className="font-mono text-[10px]">
                      {filteredItems.length} command{filteredItems.length === 1 ? "" : "s"}
                    </span>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
}

export default CommandMenu;

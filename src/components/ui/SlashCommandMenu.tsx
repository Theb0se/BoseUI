"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heading1,
  Heading2,
  Heading3,
  CheckSquare,
  Code2,
  List,
  AlertCircle,
  Quote,
  Trash2,
  FileText,
  Search,
  Sparkles,
  Command,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type BlockType =
  | "p"
  | "h1"
  | "h2"
  | "h3"
  | "todo"
  | "code"
  | "bullet"
  | "callout"
  | "quote";

export interface DocumentBlock {
  id: string;
  type: BlockType;
  content: string;
  checked?: boolean;
}

export interface CommandOption {
  id: BlockType;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  category: "Basic" | "List" | "Advanced";
}

const COMMAND_OPTIONS: CommandOption[] = [
  {
    id: "h1",
    title: "Heading 1",
    subtitle: "Large top-level title section",
    icon: Heading1,
    category: "Basic",
  },
  {
    id: "h2",
    title: "Heading 2",
    subtitle: "Medium subsection heading",
    icon: Heading2,
    category: "Basic",
  },
  {
    id: "h3",
    title: "Heading 3",
    subtitle: "Small grouping subheader",
    icon: Heading3,
    category: "Basic",
  },
  {
    id: "todo",
    title: "To-do List",
    subtitle: "Track tasks with toggleable checkboxes",
    icon: CheckSquare,
    category: "List",
  },
  {
    id: "bullet",
    title: "Bulleted List",
    subtitle: "Create a simple unordered bulleted list",
    icon: List,
    category: "List",
  },
  {
    id: "code",
    title: "Code Block",
    subtitle: "Capture code snippets with monospaced styling",
    icon: Code2,
    category: "Advanced",
  },
  {
    id: "callout",
    title: "Callout Box",
    subtitle: "Highlight important context with an alert box",
    icon: AlertCircle,
    category: "Advanced",
  },
  {
    id: "quote",
    title: "Quote",
    subtitle: "Capture memorable quotes or citations",
    icon: Quote,
    category: "Advanced",
  },
];

const INITIAL_BLOCKS: DocumentBlock[] = [
  {
    id: "b-1",
    type: "h1",
    content: "Product Strategy & Architecture",
  },
  {
    id: "b-2",
    type: "callout",
    content: "All design components must adhere to the high-density Fintech guidelines.",
  },
  {
    id: "b-3",
    type: "todo",
    content: "Implement real-time sparkline scrubbing",
    checked: true,
  },
  {
    id: "b-4",
    type: "todo",
    content: "Add multiplayer cursor canvas with live chat",
    checked: true,
  },
  {
    id: "b-5",
    type: "code",
    content: "const api = new PulseFinancialClient({ apiKey: 'pk_live_...' });",
  },
];

export interface SlashCommandMenuProps {
  initialBlocks?: DocumentBlock[];
  placeholder?: string;
  className?: string;
}

export function SlashCommandMenu({
  initialBlocks = INITIAL_BLOCKS,
  placeholder = "Type '/' for commands or start writing...",
  className,
}: SlashCommandMenuProps) {
  const [blocks, setBlocks] = useState<DocumentBlock[]>(initialBlocks);
  const [currentInput, setCurrentInput] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Filter commands by fuzzy match against query
  const filteredOptions = COMMAND_OPTIONS.filter((opt) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      opt.title.toLowerCase().includes(q) ||
      opt.subtitle.toLowerCase().includes(q) ||
      opt.id.toLowerCase().includes(q)
    );
  });

  // Keep selected index within bounds
  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery]);

  // Handle typing inside the active block input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCurrentInput(val);

    if (val.startsWith("/")) {
      setMenuOpen(true);
      setSearchQuery(val.slice(1));
    } else {
      setMenuOpen(false);
      setSearchQuery("");
    }
  };

  // Insert a new block
  const insertBlock = useCallback(
    (type: BlockType) => {
      const newBlock: DocumentBlock = {
        id: `b-${Date.now()}`,
        type,
        content:
          type === "todo"
            ? "New pending task..."
            : type === "code"
            ? "// Enter code snippet here"
            : type === "callout"
            ? "Important note context"
            : type === "quote"
            ? "Block quote inspiration"
            : type.startsWith("h")
            ? `New ${type.toUpperCase()} Section`
            : "New paragraph block",
        checked: false,
      };

      setBlocks((prev) => [...prev, newBlock]);
      setCurrentInput("");
      setSearchQuery("");
      setMenuOpen(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    },
    []
  );

  // Key navigation inside input
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (menuOpen) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filteredOptions[selectedIndex]) {
          insertBlock(filteredOptions[selectedIndex].id);
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        setMenuOpen(false);
      }
    } else if (e.key === "Enter" && currentInput.trim()) {
      e.preventDefault();
      // Insert standard paragraph
      setBlocks((prev) => [
        ...prev,
        {
          id: `b-${Date.now()}`,
          type: "p",
          content: currentInput,
        },
      ]);
      setCurrentInput("");
    }
  };

  // Toggle todo item
  const toggleTodo = (id: string) => {
    setBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, checked: !b.checked } : b))
    );
  };

  // Delete a block
  const deleteBlock = (id: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <div
      data-fullscreen-scroll
      className={cn(
        "relative w-full min-h-[520px] overflow-hidden rounded-2xl border border-neutral-200/80 bg-neutral-950 p-6 text-neutral-100 shadow-xl dark:border-neutral-800 flex flex-col justify-between",
        className
      )}
    >
      {/* Top Header */}
      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-neutral-800/80 pb-4">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-neutral-400" />
          <span className="font-semibold text-sm text-white">
            Notion-Style Slash Editor
          </span>
          <span className="rounded-full bg-neutral-800 border border-neutral-700/80 px-2 py-0.5 text-[10px] font-mono text-neutral-400">
            {blocks.length} Blocks
          </span>
        </div>

        {/* Quick action triggers */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setCurrentInput("/");
              setMenuOpen(true);
              setSearchQuery("");
              inputRef.current?.focus();
            }}
            className="flex items-center gap-1.5 rounded-lg border border-neutral-800 bg-neutral-900 px-2.5 py-1 text-xs font-medium text-neutral-200 hover:bg-neutral-800 transition-colors"
          >
            <Command className="h-3 w-3 text-neutral-400" />
            <span>Open Menu (/)</span>
          </button>
          <button
            type="button"
            onClick={() => setBlocks(INITIAL_BLOCKS)}
            className="rounded-lg border border-neutral-800 bg-neutral-900 px-2.5 py-1 text-xs text-neutral-400 hover:text-neutral-200 transition-colors"
          >
            Reset Template
          </button>
        </div>
      </div>

      {/* Main Document Canvas */}
      <div className="relative my-4 flex-1 overflow-y-auto pr-1 space-y-3 max-h-[360px]">
        {blocks.map((block) => (
          <div
            key={block.id}
            className="group relative flex items-start justify-between rounded-lg px-3 py-1.5 hover:bg-neutral-900/40 transition-colors"
          >
            <div className="flex-1">
              {block.type === "h1" && (
                <h1 className="text-2xl font-bold tracking-tight text-white">
                  {block.content}
                </h1>
              )}
              {block.type === "h2" && (
                <h2 className="text-xl font-semibold tracking-tight text-neutral-100">
                  {block.content}
                </h2>
              )}
              {block.type === "h3" && (
                <h3 className="text-base font-semibold text-neutral-200">
                  {block.content}
                </h3>
              )}
              {block.type === "p" && (
                <p className="text-sm text-neutral-300 leading-relaxed">
                  {block.content}
                </p>
              )}
              {block.type === "todo" && (
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={!!block.checked}
                    onChange={() => toggleTodo(block.id)}
                    className="h-4 w-4 rounded border-neutral-700 bg-neutral-800 text-indigo-500 focus:ring-0"
                  />
                  <span
                    className={cn(
                      "text-sm transition-all",
                      block.checked
                        ? "line-through text-neutral-500"
                        : "text-neutral-200"
                    )}
                  >
                    {block.content}
                  </span>
                </label>
              )}
              {block.type === "bullet" && (
                <div className="flex items-center gap-2 text-sm text-neutral-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-neutral-400" />
                  <span>{block.content}</span>
                </div>
              )}
              {block.type === "code" && (
                <div className="rounded-lg border border-neutral-800 bg-neutral-900/90 p-3 font-mono text-xs text-emerald-400">
                  {block.content}
                </div>
              )}
              {block.type === "callout" && (
                <div className="flex items-start gap-2.5 rounded-lg border border-indigo-500/20 bg-indigo-950/20 p-3 text-xs text-indigo-200">
                  <AlertCircle className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                  <span>{block.content}</span>
                </div>
              )}
              {block.type === "quote" && (
                <blockquote className="border-l-2 border-neutral-600 pl-3 italic text-sm text-neutral-400">
                  "{block.content}"
                </blockquote>
              )}
            </div>

            {/* Hover Delete Action */}
            <button
              type="button"
              onClick={() => deleteBlock(block.id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-neutral-500 hover:text-rose-400 rounded"
              title="Delete block"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}

        {/* Active Input Line & Slash Menu Trigger */}
        <div className="relative pt-2">
          <input
            ref={inputRef}
            type="text"
            value={currentInput}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full bg-transparent px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-600 focus:outline-none border-b border-transparent focus:border-neutral-800"
          />

          {/* Floating Slash Command Menu Popover */}
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                ref={menuRef}
                initial={{ opacity: 0, y: -6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className="absolute left-2 top-12 z-30 w-72 max-h-72 overflow-y-auto rounded-xl border border-neutral-800 bg-neutral-900/95 p-1.5 shadow-2xl backdrop-blur-xl"
              >
                <div className="px-2 py-1 text-[10px] font-mono font-semibold uppercase tracking-wider text-neutral-500 border-b border-neutral-800/80 mb-1 flex items-center justify-between">
                  <span>Insert Block</span>
                  <span className="text-neutral-400">↑↓ to navigate</span>
                </div>

                {filteredOptions.length === 0 ? (
                  <div className="p-3 text-center text-xs text-neutral-500 font-mono">
                    No matching block found
                  </div>
                ) : (
                  filteredOptions.map((opt, idx) => {
                    const Icon = opt.icon;
                    const isSelected = idx === selectedIndex;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => insertBlock(opt.id)}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={cn(
                          "w-full flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-left transition-colors",
                          isSelected
                            ? "bg-neutral-800 text-white"
                            : "text-neutral-300 hover:bg-neutral-800/60"
                        )}
                      >
                        <div
                          className={cn(
                            "flex h-7 w-7 shrink-0 items-center justify-center rounded-md border",
                            isSelected
                              ? "border-neutral-700 bg-neutral-700/80 text-white"
                              : "border-neutral-800 bg-neutral-900 text-neutral-400"
                          )}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <p className="text-xs font-medium truncate">
                            {opt.title}
                          </p>
                          <p className="text-[10px] text-neutral-500 truncate">
                            {opt.subtitle}
                          </p>
                        </div>
                      </button>
                    );
                  })
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer Helper Shortcuts */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-t border-neutral-800/80 pt-4 text-[11px] text-neutral-500 font-mono">
        <div className="flex items-center gap-2">
          <kbd className="rounded bg-neutral-900 border border-neutral-800 px-1.5 py-0.5 text-neutral-400">
            /
          </kbd>
          <span>to open menu</span>
          <kbd className="rounded bg-neutral-900 border border-neutral-800 px-1.5 py-0.5 text-neutral-400">
            ↵
          </kbd>
          <span>to insert</span>
          <kbd className="rounded bg-neutral-900 border border-neutral-800 px-1.5 py-0.5 text-neutral-400">
            Esc
          </kbd>
          <span>to cancel</span>
        </div>

        <div className="flex items-center gap-1.5 text-neutral-400">
          <Sparkles className="h-3 w-3 text-indigo-400" />
          <span>Fuzzy search filter enabled</span>
        </div>
      </div>
    </div>
  );
}

export default SlashCommandMenu;

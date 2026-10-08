"use client";

import React, { useState, useRef, useEffect, useId, useMemo } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X, Plus, Tag, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TagSuggestion {
  value: string;
  label: string;
  category?: string;
}

export interface MultiSelectTagInputProps {
  /** Suggested tags shown in the dropdown */
  suggestions?: TagSuggestion[];
  /** Controlled array of selected tag values */
  value?: string[];
  /** Initial selected tag values for uncontrolled mode */
  defaultValue?: string[];
  /** Callback fired whenever selected tags change */
  onChange?: (tags: string[]) => void;
  /** Input placeholder when empty */
  placeholder?: string;
  /** Optional field label */
  label?: string;
  /** Maximum number of tags allowed. Default: 8 */
  maxTags?: number;
  /** Allow creating custom tags not in suggestions by pressing Enter or comma. Default: true */
  allowCustomTags?: boolean;
  /** Disable input and tag removal */
  disabled?: boolean;
  className?: string;
}

const DEFAULT_SUGGESTIONS: TagSuggestion[] = [
  { value: "react", label: "React", category: "Frontend" },
  { value: "typescript", label: "TypeScript", category: "Language" },
  { value: "tailwind", label: "Tailwind CSS", category: "Styling" },
  { value: "framer-motion", label: "Framer Motion", category: "Animation" },
  { value: "nextjs", label: "Next.js", category: "Framework" },
  { value: "accessibility", label: "Accessibility (WAI-ARIA)", category: "UX" },
  { value: "design-systems", label: "Design Systems", category: "UI" },
  { value: "graphql", label: "GraphQL", category: "API" },
];

export function MultiSelectTagInput({
  suggestions = DEFAULT_SUGGESTIONS,
  value,
  defaultValue = ["react", "typescript", "framer-motion"],
  onChange,
  placeholder = "Add tag or select...",
  label = "Tech Stack Tags",
  maxTags = 8,
  allowCustomTags = true,
  disabled = false,
  className,
}: MultiSelectTagInputProps) {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const listboxId = useId();
  const isControlled = value !== undefined;

  const [internalTags, setInternalTags] = useState<string[]>(defaultValue);
  const selectedTags = isControlled ? value : internalTags;

  const [inputValue, setInputValue] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const updateTags = (next: string[]) => {
    if (!isControlled) {
      setInternalTags(next);
    }
    onChange?.(next);
  };

  const getTagLabel = (val: string) => {
    const match = suggestions.find(
      (s) => s.value.toLowerCase() === val.toLowerCase()
    );
    return match ? match.label : val;
  };

  const filteredSuggestions = useMemo(() => {
    const q = inputValue.trim().toLowerCase();
    return suggestions.filter((item) => {
      const alreadySelected = selectedTags.some(
        (t) => t.toLowerCase() === item.value.toLowerCase()
      );
      if (alreadySelected) return false;
      if (!q) return true;
      return (
        item.label.toLowerCase().includes(q) ||
        item.value.toLowerCase().includes(q) ||
        (item.category?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [suggestions, selectedTags, inputValue]);

  const isAtLimit = selectedTags.length >= maxTags;

  const addTag = (rawVal: string) => {
    if (disabled || isAtLimit) return;
    const trimmed = rawVal.trim().replace(/,+$/, "");
    if (!trimmed) return;

    // Check if matches existing suggestion value or label
    const existingSuggestion = suggestions.find(
      (s) =>
        s.value.toLowerCase() === trimmed.toLowerCase() ||
        s.label.toLowerCase() === trimmed.toLowerCase()
    );

    const normalizedValue = existingSuggestion
      ? existingSuggestion.value
      : trimmed;

    if (!existingSuggestion && !allowCustomTags) return;

    const isDuplicate = selectedTags.some(
      (t) => t.toLowerCase() === normalizedValue.toLowerCase()
    );
    if (isDuplicate) {
      setInputValue("");
      return;
    }

    updateTags([...selectedTags, normalizedValue]);
    setInputValue("");
    setActiveIndex(0);
    inputRef.current?.focus();
  };

  const removeTag = (tagToRemove: string) => {
    if (disabled) return;
    updateTags(selectedTags.filter((t) => t !== tagToRemove));
  };

  useEffect(() => {
    setActiveIndex(0);
  }, [inputValue]);

  useEffect(() => {
    if (!open || !listRef.current) return;
    const activeEl = listRef.current.querySelector<HTMLElement>(
      `[data-index="${activeIndex}"]`
    );
    activeEl?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, open]);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!open) {
        setOpen(true);
        return;
      }
      if (filteredSuggestions.length > 0) {
        setActiveIndex((prev) => (prev + 1) % filteredSuggestions.length);
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (filteredSuggestions.length > 0) {
        setActiveIndex(
          (prev) =>
            (prev - 1 + filteredSuggestions.length) %
            filteredSuggestions.length
        );
      }
    } else if (e.key === "Enter" || e.key === ",") {
      if (e.key === "," && !inputValue.trim()) {
        e.preventDefault();
        return;
      }
      if (open && filteredSuggestions[activeIndex] && !inputValue.endsWith(",")) {
        e.preventDefault();
        addTag(filteredSuggestions[activeIndex].value);
      } else if (inputValue.trim()) {
        e.preventDefault();
        addTag(inputValue);
      }
    } else if (
      e.key === "Backspace" &&
      inputValue === "" &&
      selectedTags.length > 0
    ) {
      e.preventDefault();
      removeTag(selectedTags[selectedTags.length - 1]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div ref={containerRef} className={cn("relative w-full max-w-md", className)}>
      {(label || maxTags) && (
        <div className="mb-1.5 flex items-center justify-between">
          {label && (
            <label
              onClick={() => inputRef.current?.focus()}
              className="cursor-pointer text-xs font-medium text-neutral-600 dark:text-neutral-400"
            >
              {label}
            </label>
          )}
          <div className="flex items-center gap-2">
            {selectedTags.length > 0 && !disabled && (
              <button
                type="button"
                onClick={() => updateTags([])}
                className="text-[11px] font-medium text-neutral-400 transition-colors hover:text-black dark:hover:text-white"
              >
                Clear all
              </button>
            )}
            <span
              className={cn(
                "font-mono text-[11px]",
                isAtLimit
                  ? "font-semibold text-amber-600 dark:text-amber-400"
                  : "text-neutral-400 dark:text-neutral-500"
              )}
            >
              {selectedTags.length}/{maxTags}
            </span>
          </div>
        </div>
      )}

      {/* Input & Tag Container */}
      <div
        onClick={() => {
          if (!disabled) {
            inputRef.current?.focus();
            setOpen(true);
          }
        }}
        className={cn(
          "flex min-h-[44px] w-full flex-wrap items-center gap-1.5 rounded-xl border bg-white p-2 transition-colors dark:bg-[#0A0A0A]",
          open
            ? "border-black ring-2 ring-black/10 dark:border-white dark:ring-white/10"
            : "border-neutral-200 hover:border-neutral-300 dark:border-[#262626] dark:hover:border-neutral-700",
          disabled && "cursor-not-allowed opacity-50"
        )}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {selectedTags.map((tag) => (
            <motion.span
              key={tag}
              layout={!shouldReduceMotion}
              initial={
                shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.85 }
              }
              animate={{ opacity: 1, scale: 1 }}
              exit={
                shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.85 }
              }
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="inline-flex items-center gap-1 rounded-lg border border-neutral-200 bg-neutral-100 px-2.5 py-1 text-xs font-medium text-black dark:border-[#262626] dark:bg-[#161616] dark:text-white"
            >
              <Tag className="h-3 w-3 text-neutral-400 dark:text-neutral-500" />
              <span>{getTagLabel(tag)}</span>
              {!disabled && (
                <button
                  type="button"
                  aria-label={`Remove ${getTagLabel(tag)}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    removeTag(tag);
                  }}
                  className="ml-0.5 rounded p-0.5 text-neutral-400 transition-colors hover:bg-neutral-200 hover:text-black dark:hover:bg-[#262626] dark:hover:text-white"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </motion.span>
          ))}
        </AnimatePresence>

        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-autocomplete="list"
          disabled={disabled || isAtLimit}
          value={inputValue}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            const val = e.target.value;
            if (val.endsWith(",")) {
              addTag(val);
            } else {
              setInputValue(val);
              setOpen(true);
            }
          }}
          onKeyDown={handleKeyDown}
          placeholder={
            isAtLimit
              ? "Maximum tags reached"
              : selectedTags.length === 0
                ? placeholder
                : "Add more..."
          }
          className="min-w-[110px] flex-1 bg-transparent px-1.5 py-0.5 text-sm text-black placeholder:text-neutral-400 focus:outline-none disabled:cursor-not-allowed dark:text-white dark:placeholder:text-neutral-600"
        />
      </div>

      {/* Helper hint */}
      <p className="mt-1.5 text-[11px] text-neutral-400 dark:text-neutral-500">
        Press <kbd className="rounded border border-neutral-200 bg-neutral-100 px-1 py-0.5 font-mono text-[10px] dark:border-neutral-800 dark:bg-neutral-900">Enter</kbd> or <kbd className="rounded border border-neutral-200 bg-neutral-100 px-1 py-0.5 font-mono text-[10px] dark:border-neutral-800 dark:bg-neutral-900">,</kbd> to add · <kbd className="rounded border border-neutral-200 bg-neutral-100 px-1 py-0.5 font-mono text-[10px] dark:border-neutral-800 dark:bg-neutral-900">Backspace</kbd> to remove
      </p>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {open && !disabled && !isAtLimit && (
          <motion.div
            id={listboxId}
            ref={listRef}
            role="listbox"
            initial={
              shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.98 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={
              shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -4, scale: 0.98 }
            }
            transition={{ type: "spring", stiffness: 420, damping: 28 }}
            className="absolute left-0 right-0 z-50 mt-1 max-h-52 overflow-y-auto rounded-xl border border-neutral-200 bg-white p-1.5 shadow-xl dark:border-[#262626] dark:bg-[#0A0A0A]"
          >
            {filteredSuggestions.length === 0 ? (
              allowCustomTags && inputValue.trim() ? (
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => addTag(inputValue)}
                  className="flex w-full items-center justify-between rounded-lg bg-neutral-100 px-3 py-2 text-left text-xs font-medium text-black dark:bg-[#161616] dark:text-white"
                >
                  <span className="flex items-center gap-2">
                    <Plus className="h-3.5 w-3.5" />
                    Create tag &ldquo;{inputValue.trim()}&rdquo;
                  </span>
                  <span className="font-mono text-[10px] text-neutral-400">
                    Enter
                  </span>
                </button>
              ) : (
                <div className="px-3 py-3 text-center text-xs text-neutral-400">
                  No matching suggestions available
                </div>
              )
            ) : (
              filteredSuggestions.map((item, idx) => {
                const isActive = idx === activeIndex;
                return (
                  <button
                    key={item.value}
                    type="button"
                    role="option"
                    data-index={idx}
                    aria-selected={isActive}
                    onMouseDown={(e) => e.preventDefault()}
                    onMouseEnter={() => setActiveIndex(idx)}
                    onClick={() => addTag(item.value)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors",
                      isActive
                        ? "bg-neutral-100 text-black dark:bg-[#161616] dark:text-white"
                        : "text-neutral-600 hover:bg-neutral-50 dark:text-neutral-400 dark:hover:bg-[#121212]"
                    )}
                  >
                    <span className="flex items-center gap-2 font-medium">
                      <Plus className="h-3.5 w-3.5 text-neutral-400" />
                      {item.label}
                    </span>
                    {item.category && (
                      <span className="rounded-md border border-neutral-200 px-1.5 py-0.5 font-mono text-[10px] text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
                        {item.category}
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default MultiSelectTagInput;

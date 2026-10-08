"use client";

import React, { useState, useRef, useEffect, useMemo, useId } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, ChevronDown, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AutocompleteOption {
  value: string;
  label: string;
  description?: string;
  category?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface AutocompleteProps {
  /** Array of selectable options */
  options?: AutocompleteOption[];
  /** Currently selected value (controlled) */
  value?: string;
  /** Default selected value (uncontrolled) */
  defaultValue?: string;
  /** Callback fired when an option is selected */
  onChange?: (value: string, option: AutocompleteOption | null) => void;
  /** Input placeholder text */
  placeholder?: string;
  /** Optional label displayed above the control */
  label?: string;
  /** Text displayed when no options match the query */
  emptyMessage?: string;
  /** Allow clearing the current selection */
  clearable?: boolean;
  /** Disable the entire input */
  disabled?: boolean;
  /** Additional container class names */
  className?: string;
}

const DEFAULT_OPTIONS: AutocompleteOption[] = [
  {
    value: "nextjs",
    label: "Next.js 14",
    category: "Frameworks",
    description: "App Router, Server Components & Actions",
  },
  {
    value: "react",
    label: "React 18",
    category: "Frameworks",
    description: "Concurrent UI library with Hooks",
  },
  {
    value: "tailwind",
    label: "Tailwind CSS",
    category: "Styling",
    description: "Utility-first CSS framework",
  },
  {
    value: "framer",
    label: "Framer Motion",
    category: "Animation",
    description: "Production-ready spring physics for React",
  },
  {
    value: "typescript",
    label: "TypeScript",
    category: "Language",
    description: "Strongly typed JavaScript at any scale",
  },
];

export function Autocomplete({
  options = DEFAULT_OPTIONS,
  value: controlledValue,
  defaultValue = "",
  onChange,
  placeholder = "Search options...",
  label,
  emptyMessage = "No matching results found.",
  clearable = true,
  disabled = false,
  className,
}: AutocompleteProps) {
  const shouldReduceMotion = useReducedMotion();
  const listboxId = useId();
  const [internalValue, setInternalValue] = useState(defaultValue);
  const selectedValue =
    controlledValue !== undefined ? controlledValue : internalValue;

  const selectedOption = useMemo(
    () => (options || []).find((o) => o.value === selectedValue) || null,
    [options, selectedValue]
  );

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const filteredOptions = useMemo(() => {
    const safeOptions = options || [];
    const q = query.trim().toLowerCase();
    if (!q) return safeOptions;
    return safeOptions.filter(
      (opt) =>
        opt.label.toLowerCase().includes(q) ||
        opt.value.toLowerCase().includes(q) ||
        (opt.description && opt.description.toLowerCase().includes(q)) ||
        (opt.category && opt.category.toLowerCase().includes(q))
    );
  }, [options, query]);

  const groupedOptions = useMemo(() => {
    const groups = new Map<string, AutocompleteOption[]>();
    for (const opt of filteredOptions) {
      const cat = opt.category || "Options";
      if (!groups.has(cat)) groups.set(cat, []);
      groups.get(cat)!.push(opt);
    }
    return Array.from(groups.entries());
  }, [filteredOptions]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query, open]);

  useEffect(() => {
    if (!open || !listRef.current) return;
    const activeEl = listRef.current.querySelector<HTMLElement>(
      `[data-option-index="${activeIndex}"]`
    );
    activeEl?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, open]);

  useEffect(() => {
    if (!open) return;
    const handleOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [open]);

  const handleSelect = (opt: AutocompleteOption) => {
    if (opt.disabled) return;
    if (controlledValue === undefined) {
      setInternalValue(opt.value);
    }
    onChange?.(opt.value, opt);
    setOpen(false);
    setQuery("");
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (controlledValue === undefined) {
      setInternalValue("");
    }
    onChange?.("", null);
    setQuery("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open && (e.key === "ArrowDown" || e.key === "Enter")) {
      e.preventDefault();
      setOpen(true);
      return;
    }

    if (!open) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) =>
        filteredOptions.length > 0 ? (prev + 1) % filteredOptions.length : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) =>
        filteredOptions.length > 0
          ? (prev - 1 + filteredOptions.length) % filteredOptions.length
          : 0
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      const target = filteredOptions[activeIndex];
      if (target && !target.disabled) {
        handleSelect(target);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      setQuery("");
      inputRef.current?.blur();
    }
  };

  return (
    <div ref={containerRef} className={cn("relative w-full max-w-sm", className)}>
      {label && (
        <label className="mb-1.5 block text-xs font-medium text-neutral-700 dark:text-neutral-300">
          {label}
        </label>
      )}

      {/* Input trigger container */}
      <div
        onClick={() => {
          if (!disabled) {
            setOpen(true);
            inputRef.current?.focus();
          }
        }}
        className={cn(
          "flex h-10 w-full items-center gap-2 rounded-xl border bg-white px-3 text-sm transition-colors dark:bg-[#0A0A0A]",
          open
            ? "border-black ring-2 ring-black/10 dark:border-white dark:ring-white/10"
            : "border-neutral-200 hover:border-neutral-400 dark:border-[#262626] dark:hover:border-neutral-600",
          disabled && "cursor-not-allowed opacity-50"
        )}
      >
        <Search className="h-3.5 w-3.5 shrink-0 text-neutral-400" />

        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-autocomplete="list"
          aria-controls={listboxId}
          disabled={disabled}
          value={open ? query : selectedOption?.label || ""}
          placeholder={selectedOption ? selectedOption.label : placeholder}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!open) setOpen(true);
          }}
          onFocus={() => !disabled && setOpen(true)}
          onKeyDown={handleKeyDown}
          className="h-full w-full bg-transparent text-xs text-black placeholder:text-neutral-400 focus:outline-none dark:text-white dark:placeholder:text-neutral-500"
        />

        {clearable && selectedOption && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear selection"
            className="cursor-pointer rounded p-0.5 text-neutral-400 transition-colors hover:text-black dark:hover:text-white"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}

        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 shrink-0 text-neutral-400 transition-transform duration-200",
            open && "rotate-180 text-black dark:text-white"
          )}
        />
      </div>

      {/* Dropdown Listbox */}
      <AnimatePresence>
        {open && (
          <motion.div
            ref={listRef}
            id={listboxId}
            role="listbox"
            initial={
              shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.98 }
            }
            animate={
              shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }
            }
            exit={
              shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -4, scale: 0.98 }
            }
            transition={{
              type: "spring",
              stiffness: 420,
              damping: 28,
            }}
            className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 max-h-60 overflow-y-auto rounded-xl border border-neutral-200 bg-white p-1.5 shadow-2xl dark:border-[#262626] dark:bg-[#0A0A0A]"
          >
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-6 text-center text-xs text-neutral-500">
                {emptyMessage}
              </div>
            ) : (
              groupedOptions.map(([category, items]) => (
                <div key={category} className="mb-1 last:mb-0">
                  {groupedOptions.length > 1 && (
                    <div className="px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                      {category}
                    </div>
                  )}
                  {items.map((opt) => {
                    const flatIndex = filteredOptions.indexOf(opt);
                    const isActive = flatIndex === activeIndex;
                    const isSelected = opt.value === selectedValue;

                    return (
                      <button
                        key={opt.value}
                        type="button"
                        role="option"
                        data-option-index={flatIndex}
                        aria-selected={isSelected}
                        disabled={opt.disabled}
                        onMouseEnter={() => setActiveIndex(flatIndex)}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => handleSelect(opt)}
                        className={cn(
                          "flex w-full cursor-pointer items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-left text-xs transition-colors",
                          isActive
                            ? "bg-neutral-100 text-black dark:bg-[#161616] dark:text-white"
                            : "text-neutral-700 dark:text-neutral-300",
                          opt.disabled && "cursor-not-allowed opacity-40"
                        )}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 font-medium">
                            {opt.icon && (
                              <span className="shrink-0 text-neutral-400">
                                {opt.icon}
                              </span>
                            )}
                            <span className="truncate">{opt.label}</span>
                          </div>
                          {opt.description && (
                            <p className="mt-0.5 truncate text-[11px] text-neutral-500 dark:text-neutral-400">
                              {opt.description}
                            </p>
                          )}
                        </div>

                        {isSelected && (
                          <Check className="h-3.5 w-3.5 shrink-0 text-black dark:text-white" />
                        )}
                      </button>
                    );
                  })}
                </div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Autocomplete;

"use client";

import React, { useState, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Search, X, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AppleSearchFieldProps {
  /** Placeholder text inside the search field */
  placeholder?: string;
  /** Controlled search query */
  value?: string;
  /** Initial query for uncontrolled mode */
  defaultValue?: string;
  /** Callback fired when query changes */
  onChange?: (query: string) => void;
  /** Callback fired when Cancel is clicked */
  onCancel?: () => void;
  /** Quick suggestion pills shown when focused */
  suggestions?: string[];
  className?: string;
}

const DEFAULT_SUGGESTIONS = [
  "Drawer Overlay",
  "Picker Wheel",
  "Sticky Sub-Nav",
  "Command Menu",
];

export function AppleSearchField({
  placeholder = "Search components, tokens, or docs...",
  value: controlledValue,
  defaultValue = "",
  onChange,
  onCancel,
  suggestions = DEFAULT_SUGGESTIONS,
  className,
}: AppleSearchFieldProps) {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const inputRef = useRef<HTMLInputElement>(null);
  const isControlled = controlledValue !== undefined;

  const [internalQuery, setInternalQuery] = useState(defaultValue);
  const [isActive, setIsActive] = useState(false);

  const query = isControlled ? controlledValue : internalQuery;
  const showCancel = isActive || query.length > 0;

  const setQuery = (next: string) => {
    if (!isControlled) {
      setInternalQuery(next);
    }
    onChange?.(next);
  };

  const handleCancel = () => {
    setQuery("");
    setIsActive(false);
    inputRef.current?.blur();
    onCancel?.();
  };

  const filteredSuggestions = suggestions.filter((s) =>
    s.toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <div className={cn("w-full max-w-md", className)}>
      <div className="flex items-center gap-2.5">
        {/* Expanding / Contracting Rounded Search Field */}
        <motion.div
          layout={!shouldReduceMotion}
          transition={{ type: "spring", stiffness: 420, damping: 32 }}
          className={cn(
            "relative flex h-11 flex-1 items-center rounded-2xl border bg-neutral-100/80 px-3.5 transition-colors dark:bg-[#121212]",
            isActive
              ? "border-neutral-900 bg-white ring-3 ring-neutral-900/10 dark:border-white dark:bg-[#0A0A0A] dark:ring-white/15"
              : "border-neutral-200/80 hover:border-neutral-300 dark:border-neutral-800"
          )}
        >
          <Search
            className={cn(
              "mr-2.5 h-4 w-4 shrink-0 transition-colors",
              isActive
                ? "text-neutral-900 dark:text-white"
                : "text-neutral-400 dark:text-neutral-500"
            )}
          />

          <input
            ref={inputRef}
            type="search"
            value={query}
            onFocus={() => setIsActive(true)}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                handleCancel();
              }
            }}
            placeholder={placeholder}
            className="w-full bg-transparent text-xs font-medium text-neutral-950 placeholder:text-neutral-400 focus:outline-none dark:text-white dark:placeholder:text-neutral-500 sm:text-sm [&::-webkit-search-cancel-button]:hidden"
          />

          {/* Clear Circle Button */}
          <AnimatePresence>
            {query.length > 0 && (
              <motion.button
                type="button"
                aria-label="Clear search query"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={{ duration: 0.12 }}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setQuery("")}
                className="ml-1.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-neutral-300/80 text-neutral-700 transition-colors hover:bg-neutral-400/80 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
              >
                <X className="h-3 w-3" />
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Sliding Cancel Button */}
        <AnimatePresence initial={false}>
          {showCancel && (
            <motion.button
              type="button"
              initial={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, x: 16, width: 0 }
              }
              animate={{ opacity: 1, x: 0, width: "auto" }}
              exit={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, x: 16, width: 0 }
              }
              transition={{ type: "spring", stiffness: 420, damping: 32 }}
              onClick={handleCancel}
              className="shrink-0 overflow-hidden whitespace-nowrap text-xs font-semibold text-neutral-900 hover:underline dark:text-white sm:text-sm"
            >
              Cancel
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Quick Suggestions Shelf when active */}
      <AnimatePresence>
        {showCancel && filteredSuggestions.length > 0 && (
          <motion.div
            initial={
              shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }
            }
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="mt-2.5 flex flex-wrap items-center gap-1.5"
          >
            {filteredSuggestions.map((item) => (
              <button
                key={item}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setQuery(item)}
                className="inline-flex items-center gap-1 rounded-full border border-neutral-200 bg-white px-2.5 py-1 text-[11px] font-medium text-neutral-600 transition-colors hover:border-neutral-900 hover:text-neutral-950 dark:border-neutral-800 dark:bg-[#0A0A0A] dark:text-neutral-400 dark:hover:border-white dark:hover:text-white"
              >
                <span>{item}</span>
                <ArrowUpRight className="h-3 w-3 opacity-60" />
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AppleSearchField;

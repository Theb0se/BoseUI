"use client";

import React, { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Plus, X, Tag } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ElasticTagInputProps {
  /** Initial array of tag strings. */
  defaultTags?: string[];
  /** Maximum number of tags allowed. Default: 8 */
  maxTags?: number;
  /** Input placeholder text. Default: "Add tag & press Enter..." */
  placeholder?: string;
  /** Spring stiffness coefficient for tag pill pop-in and reflow. Default: 380 */
  stiffness?: number;
  /** Spring damping coefficient for tag pill pop-in and reflow. Default: 24 */
  damping?: number;
  /** Callback fired when tag list changes */
  onChange?: (tags: string[]) => void;
  className?: string;
}

const DEFAULT_TAGS = ["framer-motion", "spring-physics", "shadcn-v2"];

export function ElasticTagInput({
  defaultTags = DEFAULT_TAGS,
  maxTags = 8,
  placeholder = "Add tag & press Enter...",
  stiffness = 380,
  damping = 24,
  onChange,
  className,
}: ElasticTagInputProps) {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const [tags, setTags] = useState<string[]>(defaultTags);
  const [inputValue, setInputValue] = useState("");
  const [pendingDeleteLast, setPendingDeleteLast] = useState(false);

  const commitTags = (next: string[]) => {
    setTags(next);
    onChange?.(next);
  };

  const addTag = (raw: string) => {
    const cleaned = raw.trim().toLowerCase().replace(/\s+/g, "-");
    if (!cleaned || tags.includes(cleaned) || tags.length >= maxTags) return;
    commitTags([...tags, cleaned]);
    setInputValue("");
    setPendingDeleteLast(false);
  };

  const removeTag = (target: string) => {
    commitTags(tags.filter((t) => t !== target));
    setPendingDeleteLast(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === "Backspace" && inputValue === "" && tags.length > 0) {
      if (!pendingDeleteLast) {
        setPendingDeleteLast(true);
      } else {
        const last = tags[tags.length - 1];
        if (last) removeTag(last);
      }
    } else {
      setPendingDeleteLast(false);
    }
  };

  return (
    <div
      className={cn(
        "w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-[#222222] dark:bg-[#0A0A0A]",
        className
      )}
    >
      <div className="mb-2.5 flex items-center justify-between text-xs">
        <span className="inline-flex items-center gap-1.5 font-semibold text-black dark:text-white">
          <Tag className="h-3.5 w-3.5" />
          <span>Registry Keywords</span>
        </span>
        <span className="font-mono text-[10px] text-neutral-400">
          {tags.length}/{maxTags} tags
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-neutral-200 bg-neutral-50/70 p-2 focus-within:border-black dark:border-[#262626] dark:bg-[#121212] dark:focus-within:border-white">
        <AnimatePresence mode="popLayout" initial={false}>
          {tags.map((tag, idx) => {
            const isWarned =
              pendingDeleteLast && idx === tags.length - 1;

            return (
              <motion.span
                key={tag}
                layout
                initial={
                  shouldReduceMotion
                    ? { opacity: 1 }
                    : { scale: 0.6, opacity: 0 }
                }
                animate={{
                  scale: 1,
                  opacity: 1,
                  x:
                    isWarned && !shouldReduceMotion
                      ? [0, -4, 4, -3, 3, 0]
                      : 0,
                }}
                exit={
                  shouldReduceMotion
                    ? { opacity: 0 }
                    : { scale: 0.6, opacity: 0 }
                }
                transition={{ type: "spring", stiffness, damping }}
                className={cn(
                  "inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 font-mono text-xs font-medium transition-colors",
                  isWarned
                    ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                    : "border-neutral-200 bg-white text-black dark:border-[#2A2A2A] dark:bg-[#1B1B1B] dark:text-white"
                )}
              >
                <span>#{tag}</span>
                <button
                  type="button"
                  aria-label={`Remove tag ${tag}`}
                  onClick={() => removeTag(tag)}
                  className="rounded p-0.5 opacity-60 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-current"
                >
                  <X className="h-3 w-3" />
                </button>
              </motion.span>
            );
          })}
        </AnimatePresence>

        <div className="flex min-w-[140px] flex-1 items-center gap-1">
          <input
            type="text"
            value={inputValue}
            disabled={tags.length >= maxTags}
            placeholder={
              tags.length >= maxTags ? "Max tags reached" : placeholder
            }
            aria-label="Add keyword tag"
            onChange={(e) => {
              setInputValue(e.target.value);
              setPendingDeleteLast(false);
            }}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent px-1.5 py-1 text-xs text-black placeholder:text-neutral-400 focus:outline-none dark:text-white"
          />
          {inputValue.trim() && (
            <button
              type="button"
              aria-label="Add current tag"
              onClick={() => addTag(inputValue)}
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-black text-white dark:bg-white dark:text-black"
            >
              <Plus className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      <div className="mt-2 text-[10px] text-neutral-400">
        Press Enter to add • Press Backspace twice to confirm removal
      </div>
    </div>
  );
}

export default ElasticTagInput;

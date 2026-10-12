"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
} from "framer-motion";
import { ArrowUp, Check, Square, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AIPromptInputProps {
  placeholder?: string;
  maxLength?: number;
  onSubmit?: (value: string) => void;
  /** Optional stop/cancel callback when user cancels generation */
  onStop?: () => void;
  /** External loading state */
  loading?: boolean;
  /** Optional starter suggestion pills */
  suggestions?: string[];
  className?: string;
}

type BtnState = "idle" | "loading" | "done";

export function AIPromptInput({
  placeholder = "Ask anything…",
  maxLength = 1000,
  onSubmit,
  onStop,
  loading = false,
  suggestions,
  className,
}: AIPromptInputProps) {
  const [value, setValue] = useState("");
  const [internalLoading, setInternalLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const reduceMotion = useReducedMotion();

  const isGenerating = loading || internalLoading;

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, [value]);

  function handleSubmit() {
    const trimmed = value.trim();
    if (!trimmed || isGenerating) return;

    if (!loading) {
      setInternalLoading(true);
      onSubmit?.(trimmed);
      setValue("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }

      // Simulate completion if uncontrolled
      setTimeout(() => {
        setInternalLoading(false);
        setIsDone(true);
        setTimeout(() => setIsDone(false), 1400);
      }, 1500);
    } else {
      onSubmit?.(trimmed);
      setValue("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  }

  function handleStop() {
    if (onStop) {
      onStop();
    } else {
      setInternalLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    // Standard AI UX: Enter submits, Shift+Enter makes newline
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  const charsLeft = maxLength - value.length;
  const isNearLimit = charsLeft <= 50;
  const isAtLimit = charsLeft <= 0;

  return (
    <div className={cn("w-full flex flex-col gap-2", className)}>
      {/* Suggestions if provided */}
      {suggestions && suggestions.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pb-1">
          {suggestions.map((s, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setValue(s);
                textareaRef.current?.focus();
              }}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/60 px-3 py-1 text-xs text-muted-foreground hover:bg-accent hover:text-foreground transition-all"
            >
              <Sparkles className="h-3 w-3 text-foreground/40" />
              <span>{s}</span>
            </button>
          ))}
        </div>
      )}

      {/* Main input card */}
      <div
        className={cn(
          "group relative w-full rounded-2xl border border-border bg-card shadow-sm transition-all focus-within:border-foreground/30 focus-within:shadow-md",
          isGenerating && "ring-1 ring-blue-500/20"
        )}
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => {
            if (e.target.value.length <= maxLength) setValue(e.target.value);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={1}
          className="w-full resize-none rounded-2xl bg-transparent px-4 py-3.5 pr-14 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
          aria-label="AI prompt input"
          aria-multiline="true"
        />

        {/* Character counter */}
        <AnimatePresence>
          {value.length > 0 && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={cn(
                "absolute bottom-3 left-4 text-[10px] tabular-nums font-mono select-none",
                isAtLimit
                  ? "text-red-500 font-semibold"
                  : isNearLimit
                    ? "text-amber-500"
                    : "text-muted-foreground/40"
              )}
            >
              {charsLeft}
            </motion.span>
          )}
        </AnimatePresence>

        {/* Action Button: Submit / Stop / Done */}
        <div className="absolute bottom-2.5 right-2.5 flex items-center">
          {isGenerating ? (
            <button
              type="button"
              onClick={handleStop}
              aria-label="Stop generation"
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-foreground text-background transition-transform hover:scale-105 active:scale-95 shadow-sm"
            >
              <Square className="h-3.5 w-3.5 fill-current" />
            </button>
          ) : isDone ? (
            <motion.div
              initial={reduceMotion ? {} : { scale: 0.8 }}
              animate={reduceMotion ? {} : { scale: 1 }}
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-sm"
            >
              <Check className="h-4 w-4" />
            </motion.div>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!value.trim()}
              aria-label="Submit prompt"
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-xl transition-all shadow-sm",
                value.trim()
                  ? "bg-foreground text-background hover:scale-105 active:scale-95"
                  : "bg-muted text-muted-foreground/40 cursor-not-allowed opacity-60"
              )}
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Keyboard hint */}
        <div className="flex items-center justify-between px-4 pb-2.5 pt-0 text-[10px] text-muted-foreground/50 select-none">
          <span>Enter to send · Shift + Enter for new line</span>
        </div>
      </div>
    </div>
  );
}

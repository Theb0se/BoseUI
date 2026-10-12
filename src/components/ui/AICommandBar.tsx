"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Sparkles, CornerDownLeft, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AICommand {
  id: string;
  /** Display label */
  label: string;
  /** Slash trigger keyword e.g. "summarize" */
  trigger: string;
  /** Optional description */
  description?: string;
  icon?: React.ReactNode;
}

export interface AICommandBarProps {
  commands?: AICommand[];
  /** Called when a command suggestion is selected */
  onSelect?: (command: AICommand) => void;
  /** Called when user hits enter to submit the command / prompt */
  onSubmit?: (command: AICommand | null, query: string) => void;
  placeholder?: string;
  className?: string;
}

const DEFAULT_COMMANDS: AICommand[] = [
  { id: "summarize", trigger: "summarize", label: "Summarize", description: "Condense long content into key bullet points" },
  { id: "explain", trigger: "explain", label: "Explain Concept", description: "Break down complex topics step-by-step" },
  { id: "translate", trigger: "translate", label: "Translate", description: "Convert into any language with native nuances" },
  { id: "rewrite", trigger: "rewrite", label: "Rewrite & Polish", description: "Enhance tone, clarity, and grammatical precision" },
  { id: "code", trigger: "code", label: "Generate Code", description: "Produce typed, production-ready code snippets" },
];

export function AICommandBar({
  commands = DEFAULT_COMMANDS,
  onSelect,
  onSubmit,
  placeholder = "Type / for AI commands or ask anything…",
  className,
}: AICommandBarProps) {
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [activeCommand, setActiveCommand] = useState<AICommand | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const reduceMotion = useReducedMotion();

  // Parse if user started with slash
  const hasSlashPrefix = value.startsWith("/");
  const slashKeyword = hasSlashPrefix
    ? value.slice(1).split(" ")[0].toLowerCase()
    : "";

  const filtered = hasSlashPrefix && !activeCommand
    ? commands.filter(
        (c) =>
          c.trigger.toLowerCase().includes(slashKeyword) ||
          c.label.toLowerCase().includes(slashKeyword)
      )
    : [];

  useEffect(() => {
    if (hasSlashPrefix && !activeCommand && filtered.length > 0) {
      setOpen(true);
      setSelectedIndex(0);
    } else {
      setOpen(false);
    }
  }, [value, activeCommand, hasSlashPrefix, filtered.length]);

  function handleSelect(cmd: AICommand) {
    setActiveCommand(cmd);
    onSelect?.(cmd);
    // Remove the slash prefix and set remaining query
    const parts = value.split(" ");
    parts.shift(); // remove /trigger
    setValue(parts.join(" "));
    setOpen(false);
    inputRef.current?.focus();
  }

  function handleClearCommand() {
    setActiveCommand(null);
    setValue("");
    inputRef.current?.focus();
  }

  function handleSubmit() {
    const trimmed = value.trim();
    if (!trimmed && !activeCommand) return;
    onSubmit?.(activeCommand, trimmed);
    setOpen(false);
  }

  function handleKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (open && filtered.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => (i + 1) % filtered.length);
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => (i - 1 + filtered.length) % filtered.length);
        return;
      }
      if (e.key === "Enter") {
        e.preventDefault();
        if (filtered[selectedIndex]) {
          handleSelect(filtered[selectedIndex]);
        }
        return;
      }
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        return;
      }
    }

    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === "Backspace" && value === "" && activeCommand) {
      setActiveCommand(null);
    }
  }

  return (
    <div className={cn("relative w-full", className)}>
      {/* Input Container */}
      <div
        className={cn(
          "relative flex items-center overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all focus-within:border-foreground/30 focus-within:shadow-md",
          open && "ring-1 ring-border"
        )}
      >
        {/* Shimmer Border */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
          <motion.div
            className="absolute -inset-[100%] opacity-20"
            style={{
              background:
                "conic-gradient(from 0deg, transparent 0 340deg, currentColor 360deg)",
            }}
            animate={reduceMotion ? {} : { rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          />
        </div>

        {/* Leading Icon / Active Command Pill */}
        <div className="relative z-10 flex items-center pl-3.5 pr-1">
          {activeCommand ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs font-mono font-medium text-foreground">
              <span>/{activeCommand.trigger}</span>
              <button
                type="button"
                onClick={handleClearCommand}
                className="hover:text-red-500 transition-colors"
                aria-label="Remove command"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ) : (
            <Sparkles className="h-4 w-4 text-muted-foreground/60" />
          )}
        </div>

        {/* Input */}
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKey}
          placeholder={
            activeCommand
              ? `Prompt for /${activeCommand.trigger}…`
              : placeholder
          }
          className="relative z-10 w-full bg-transparent px-3 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
          aria-label="AI command input"
          aria-autocomplete="list"
          aria-expanded={open}
          role="combobox"
        />

        {/* Enter Key Indicator */}
        <button
          type="button"
          onClick={handleSubmit}
          aria-label="Submit prompt"
          className="relative z-10 mr-2.5 flex items-center gap-1 rounded-lg border border-border bg-muted/60 px-2 py-1 text-[11px] font-mono text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
        >
          <span>Submit</span>
          <CornerDownLeft className="h-3 w-3" />
        </button>
      </div>

      {/* Suggestions Panel */}
      <AnimatePresence>
        {open && filtered.length > 0 && (
          <motion.div
            initial={reduceMotion ? {} : { opacity: 0, y: -6, scale: 0.98 }}
            animate={reduceMotion ? {} : { opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? {} : { opacity: 0, y: -4, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className="absolute left-0 right-0 top-full z-50 mt-1.5 max-h-72 overflow-y-auto rounded-2xl border border-border bg-card p-1.5 shadow-xl"
            role="listbox"
          >
            <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-muted-foreground/60">
              Suggested AI Commands
            </div>
            {filtered.map((cmd, i) => (
              <button
                key={cmd.id}
                type="button"
                onClick={() => handleSelect(cmd)}
                onMouseEnter={() => setSelectedIndex(i)}
                role="option"
                aria-selected={i === selectedIndex}
                className={cn(
                  "relative flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm transition-colors",
                  i === selectedIndex
                    ? "bg-accent text-accent-foreground"
                    : "text-foreground/80 hover:bg-accent/50"
                )}
              >
                <span className="font-mono text-xs font-semibold text-foreground/50">
                  /{cmd.trigger}
                </span>
                <span className="font-medium text-foreground">{cmd.label}</span>
                {cmd.description && (
                  <span className="ml-auto truncate text-[11px] text-muted-foreground">
                    {cmd.description}
                  </span>
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

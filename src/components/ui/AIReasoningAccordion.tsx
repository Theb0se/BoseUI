"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Brain,
  ChevronDown,
  CheckCircle2,
  Clock,
  Sparkles,
  Loader2,
  Copy,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface ReasoningStep {
  id: string;
  label: string;
  details?: string;
  status?: "pending" | "running" | "done";
}

export interface AIReasoningAccordionProps {
  /** Thought duration in seconds. Default: 3.4 */
  thinkingTime?: number;
  /** Current reasoning lifecycle status. Default: "completed" */
  status?: "thinking" | "completed";
  /** Optional custom reasoning steps */
  steps?: ReasoningStep[];
  /** Controlled or initial expanded state. Default: true */
  defaultOpen?: boolean;
  /** Final thought summary or text content */
  children?: React.ReactNode;
  /** Title label next to the icon. Default: "Thought Process" */
  title?: string;
  /** Callback when accordion is toggled */
  onToggle?: (isOpen: boolean) => void;
  className?: string;
}

const DEFAULT_STEPS: ReasoningStep[] = [
  {
    id: "step-1",
    label: "Analyzing request intent and constraints",
    details: "Parsing prompt syntax, identifying target architecture and state bounds.",
    status: "done",
  },
  {
    id: "step-2",
    label: "Exploring algorithmic tradeoffs and dependencies",
    details: "Evaluating Canvas 2D vs DOM composite layers. Selecting zero-dependency spring physics.",
    status: "done",
  },
  {
    id: "step-3",
    label: "Synthesizing modular component structure",
    details: "Validating TypeScript signatures, WCAG contrast compliance, and reduce-motion fallbacks.",
    status: "done",
  },
];

export function AIReasoningAccordion({
  thinkingTime = 3.4,
  status = "completed",
  steps = DEFAULT_STEPS,
  defaultOpen = true,
  children,
  title = "Thought Process",
  onToggle,
  className,
}: AIReasoningAccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [copied, setCopied] = useState(false);
  const reduceMotion = useReducedMotion();

  const handleToggle = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    onToggle?.(nextState);
  };

  const handleCopySteps = (e: React.MouseEvent) => {
    e.stopPropagation();
    const textToCopy = steps
      .map((s, i) => `${i + 1}. ${s.label}${s.details ? ` - ${s.details}` : ""}`)
      .join("\n");
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const isThinking = status === "thinking";

  return (
    <div
      className={cn(
        "relative w-full max-w-2xl overflow-hidden rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md shadow-sm transition-all text-foreground",
        className
      )}
    >
      {/* Header Bar */}
      <button
        type="button"
        onClick={handleToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Animated Brain / Sparkle Icon */}
          <div
            className={cn(
              "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border transition-colors",
              isThinking
                ? "border-amber-500/40 bg-amber-500/10 text-amber-500 animate-pulse"
                : "border-border bg-muted/50 text-muted-foreground"
            )}
          >
            {isThinking ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Brain className="h-3.5 w-3.5" />
            )}
          </div>

          <div className="flex items-center gap-2 truncate">
            <span className="text-xs font-semibold tracking-tight text-foreground truncate">
              {title}
            </span>

            {/* Time Pill */}
            <span className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-muted/60 px-2 py-0.5 text-[10px] font-mono text-muted-foreground">
              <Clock className="h-2.5 w-2.5" />
              {isThinking ? "Thinking…" : `Thought for ${thinkingTime}s`}
            </span>
          </div>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-2 shrink-0">
          {/* One-click copy reasoning steps */}
          <button
            type="button"
            onClick={handleCopySteps}
            title="Copy thought steps"
            className="p-1 rounded-md text-muted-foreground/60 hover:text-foreground hover:bg-muted/80 transition-colors"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-emerald-500" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </button>

          {/* Spring Chevron */}
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { type: "spring", stiffness: 320, damping: 24 }
            }
            className="text-muted-foreground/70"
          >
            <ChevronDown className="h-4 w-4" />
          </motion.div>
        </div>
      </button>

      {/* Accordion Content Body */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
            animate={reduceMotion ? { opacity: 1 } : { height: "auto", opacity: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={
              reduceMotion
                ? { duration: 0.15 }
                : { type: "spring", stiffness: 350, damping: 28 }
            }
            className="overflow-hidden border-t border-border/50 bg-background/40"
          >
            <div className="p-4 space-y-4">
              {/* Sequential Steps List */}
              <div className="space-y-3 relative pl-1">
                {/* Vertical timeline track line */}
                <div className="absolute left-[13px] top-2 bottom-2 w-[1px] bg-border/60" />

                {steps.map((step, idx) => {
                  const stepDone = step.status === "done" || (!step.status && !isThinking);
                  const stepRunning = step.status === "running" || (isThinking && idx === steps.length - 1);

                  return (
                    <motion.div
                      key={step.id || idx}
                      initial={reduceMotion ? false : { opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.04 }}
                      className="relative flex items-start gap-3 group"
                    >
                      {/* Step Indicator Dot / Checkmark */}
                      <div
                        className={cn(
                          "relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[10px] font-mono transition-colors",
                          stepDone
                            ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-500"
                            : stepRunning
                            ? "border-amber-500/40 bg-amber-500/10 text-amber-500"
                            : "border-border bg-card text-muted-foreground"
                        )}
                      >
                        {stepDone ? (
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        ) : stepRunning ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <span>{idx + 1}</span>
                        )}
                      </div>

                      {/* Step Description & Details */}
                      <div className="flex-1 min-w-0 pt-0.5">
                        <div className="text-xs font-medium text-foreground leading-snug">
                          {step.label}
                        </div>
                        {step.details && (
                          <div className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground/80">
                            {step.details}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Final Thought Conclusion / Children */}
              {children && (
                <div className="mt-3 pt-3 border-t border-border/60 text-xs leading-relaxed text-muted-foreground font-sans">
                  {children}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AIChatBubbleProps {
  /** Whose message: "user" (right, filled) or "assistant" (left, outlined) */
  role: "user" | "assistant";
  /** Message content text or rich JSX */
  content?: React.ReactNode;
  /** Show typing dots instead of content */
  typing?: boolean;
  /** Optional avatar string or JSX */
  avatar?: React.ReactNode;
  /** Optional timestamp string */
  timestamp?: string;
  /** Allow copying content to clipboard (assistant only). Default: true */
  showCopy?: boolean;
  /** Extra actions slot (e.g. thumbs up, retry) */
  actions?: React.ReactNode;
  className?: string;
}

function TypingDots() {
  const reduceMotion = useReducedMotion();
  return (
    <span className="inline-flex items-center gap-1.5 py-1 px-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="block h-1.5 w-1.5 rounded-full bg-foreground/60"
          animate={
            reduceMotion
              ? {}
              : {
                  y: [0, -4, 0],
                  opacity: [0.35, 1, 0.35],
                }
          }
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.14,
            ease: "easeInOut",
          }}
        />
      ))}
    </span>
  );
}

export function AIChatBubble({
  role,
  content,
  typing = false,
  avatar,
  timestamp,
  showCopy = true,
  actions,
  className,
}: AIChatBubbleProps) {
  const reduceMotion = useReducedMotion();
  const [copied, setCopied] = useState(false);
  const isUser = role === "user";

  const handleCopy = () => {
    if (typeof content === "string") {
      navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    }
  };

  return (
    <motion.div
      initial={reduceMotion ? {} : { opacity: 0, y: 12, scale: 0.98 }}
      animate={reduceMotion ? {} : { opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className={cn(
        "group relative flex w-full items-start gap-2.5",
        isUser ? "flex-row-reverse" : "flex-row",
        className
      )}
    >
      {/* Avatar */}
      {avatar && (
        <div
          className={cn(
            "flex h-7 w-7 shrink-0 select-none items-center justify-center rounded-full text-xs font-semibold mt-0.5",
            isUser
              ? "bg-foreground text-background"
              : "border border-border bg-muted text-foreground font-mono"
          )}
        >
          {avatar}
        </div>
      )}

      {/* Bubble Container */}
      <div className={cn("flex flex-col max-w-[80%]", isUser ? "items-end" : "items-start")}>
        <div
          className={cn(
            "relative rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap break-words transition-shadow",
            isUser
              ? "rounded-tr-sm bg-foreground text-background"
              : "rounded-tl-sm border border-border bg-card text-foreground shadow-sm"
          )}
        >
          {typing ? <TypingDots /> : <div>{content}</div>}
        </div>

        {/* Footer (Timestamp & Action Controls) */}
        {(!typing && (timestamp || (!isUser && showCopy && typeof content === "string") || actions)) && (
          <div
            className={cn(
              "mt-1 flex items-center gap-2 px-1 text-[11px] text-muted-foreground",
              isUser ? "justify-end" : "justify-start"
            )}
          >
            {timestamp && <span>{timestamp}</span>}

            {!isUser && showCopy && typeof content === "string" && (
              <button
                onClick={handleCopy}
                aria-label="Copy message"
                className="inline-flex items-center gap-1 opacity-0 transition-opacity hover:text-foreground group-hover:opacity-100 focus:opacity-100"
              >
                {copied ? (
                  <>
                    <Check className="h-3 w-3 text-emerald-500" />
                    <span className="text-[10px] text-emerald-500">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    <span className="text-[10px]">Copy</span>
                  </>
                )}
              </button>
            )}

            {actions}
          </div>
        )}
      </div>
    </motion.div>
  );
}

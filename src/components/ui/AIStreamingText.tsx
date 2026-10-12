"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface AIStreamingTextProps {
  /** The full text to stream */
  text: string;
  /** Speed in milliseconds per chunk/token. Default: 24 */
  speed?: number;
  /** Streaming unit: character by character or word/token by word. Default: "character" */
  mode?: "character" | "word";
  /** Show blinking cursor while streaming. Default: true */
  showCursor?: boolean;
  /** Keep blinking cursor visible even after generation finishes. Default: false */
  keepCursor?: boolean;
  /** Cursor character. Default: "▋" */
  cursorChar?: string;
  /** Called when streaming is complete */
  onComplete?: () => void;
  /** Optional restart trigger key (e.g. integer or uuid) */
  restartKey?: string | number;
  className?: string;
}

export function AIStreamingText({
  text,
  speed = 24,
  mode = "character",
  showCursor = true,
  keepCursor = false,
  cursorChar = "▋",
  onComplete,
  restartKey,
  className,
}: AIStreamingTextProps) {
  const [displayed, setDisplayed] = useState("");
  const [isDone, setIsDone] = useState(false);
  const reduceMotion = useReducedMotion();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const indexRef = useRef(0);

  const startStreaming = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setDisplayed("");
    setIsDone(false);
    indexRef.current = 0;

    if (!text) {
      setIsDone(true);
      return;
    }

    if (reduceMotion) {
      setDisplayed(text);
      setIsDone(true);
      onComplete?.();
      return;
    }

    // Tokenize into units (characters or words)
    const tokens =
      mode === "word"
        ? text.match(/(\s+|\S+)/g) || [text]
        : Array.from(text);

    function tick() {
      if (indexRef.current < tokens.length) {
        indexRef.current += 1;
        setDisplayed(tokens.slice(0, indexRef.current).join(""));
        timerRef.current = setTimeout(tick, speed);
      } else {
        setIsDone(true);
        onComplete?.();
      }
    }

    timerRef.current = setTimeout(tick, speed);
  }, [text, speed, mode, reduceMotion, onComplete]);

  useEffect(() => {
    startStreaming();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [startStreaming, restartKey]);

  return (
    <span
      className={cn(
        "inline whitespace-pre-wrap break-words font-sans text-foreground",
        className
      )}
    >
      <span>{displayed}</span>
      {showCursor && (
        <AnimatePresence>
          {(!isDone || keepCursor) && (
            <motion.span
              key="ai-cursor"
              initial={{ opacity: 0 }}
              animate={{ opacity: [1, 0, 1] }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                ease: "linear",
              }}
              className="ml-0.5 inline-block select-none text-[0.85em] leading-none text-foreground/70 align-baseline"
              aria-hidden
            >
              {cursorChar}
            </motion.span>
          )}
        </AnimatePresence>
      )}
    </span>
  );
}

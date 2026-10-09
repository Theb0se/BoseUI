"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Smile,
  Plus,
  Search,
  RotateCcw,
  MessageCircle,
  Sparkles,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface ReactionItem {
  emoji: string;
  count: number;
  reactedByMe: boolean;
  users: string[];
}

export interface ReactionPickerProps {
  initialReactions?: ReactionItem[];
  messageText?: string;
  authorName?: string;
  authorRole?: string;
  /** Whether to render only the inline reaction badge pills and add button */
  inline?: boolean;
  className?: string;
}

const QUICK_EMOJIS = ["👍", "❤️", "🚀", "🎉", "🔥", "👀", "🙌", "💡"];

const FULL_EMOJIS = [
  { emoji: "👍", name: "thumbs up", category: "Frequent" },
  { emoji: "❤️", name: "heart", category: "Frequent" },
  { emoji: "🚀", name: "rocket", category: "Frequent" },
  { emoji: "🎉", name: "tada party", category: "Frequent" },
  { emoji: "🔥", name: "fire lit", category: "Frequent" },
  { emoji: "👀", name: "eyes look", category: "Frequent" },
  { emoji: "🙌", name: "raised hands", category: "Frequent" },
  { emoji: "💡", name: "idea bulb", category: "Frequent" },
  { emoji: "⚡", name: "zap lightning", category: "Objects" },
  { emoji: "⭐", name: "star gold", category: "Objects" },
  { emoji: "💯", name: "hundred score", category: "Symbols" },
  { emoji: "🤝", name: "handshake deal", category: "People" },
  { emoji: "🦾", name: "mechanical arm tech", category: "People" },
  { emoji: "🎯", name: "dart bullseye target", category: "Objects" },
  { emoji: "☕", name: "coffee drink", category: "Food" },
  { emoji: "💎", name: "gem diamond", category: "Objects" },
];

const DEFAULT_REACTIONS: ReactionItem[] = [
  {
    emoji: "🚀",
    count: 14,
    reactedByMe: true,
    users: ["You", "Elena Rostova", "Marcus Chen", "Liam Vance"],
  },
  {
    emoji: "🔥",
    count: 8,
    reactedByMe: false,
    users: ["Sarah Jenkins", "Chloe Dupont", "Amara Okafor"],
  },
  {
    emoji: "❤️",
    count: 5,
    reactedByMe: true,
    users: ["You", "Daisuke Sato", "Nadia Thorne"],
  },
  {
    emoji: "🎉",
    count: 9,
    reactedByMe: false,
    users: ["Marcus Chen", "Elena Rostova", "Sarah Jenkins"],
  },
];

export function ReactionPicker({
  initialReactions = DEFAULT_REACTIONS,
  messageText = "Just shipped the brand-new financial charts and collaboration suite! All 60fps spring transitions are running smoothly in staging. Let me know your feedback! 🚀⚡",
  authorName = "Alexander Vance",
  authorRole = "Staff Design Technologist",
  inline = false,
  className,
}: ReactionPickerProps) {
  const [reactions, setReactions] = useState<ReactionItem[]>(initialReactions);
  const [isQuickBarOpen, setIsQuickBarOpen] = useState(false);
  const [isFullPickerOpen, setIsFullPickerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredBadge, setHoveredBadge] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Toggle reaction vote
  const toggleReaction = (emoji: string) => {
    setReactions((prev) => {
      const existing = prev.find((r) => r.emoji === emoji);
      if (existing) {
        if (existing.reactedByMe) {
          // Decrement
          const newCount = existing.count - 1;
          if (newCount <= 0) {
            return prev.filter((r) => r.emoji !== emoji);
          }
          return prev.map((r) =>
            r.emoji === emoji
              ? {
                  ...r,
                  count: newCount,
                  reactedByMe: false,
                  users: r.users.filter((u) => u !== "You"),
                }
              : r
          );
        } else {
          // Increment
          return prev.map((r) =>
            r.emoji === emoji
              ? {
                  ...r,
                  count: r.count + 1,
                  reactedByMe: true,
                  users: ["You", ...r.users],
                }
              : r
          );
        }
      } else {
        // Add brand new reaction
        return [
          ...prev,
          {
            emoji,
            count: 1,
            reactedByMe: true,
            users: ["You"],
          },
        ];
      }
    });

    setIsQuickBarOpen(false);
    setIsFullPickerOpen(false);
  };

  const filteredFullEmojis = FULL_EMOJIS.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsQuickBarOpen(false);
        setIsFullPickerOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (inline) {
    return (
      <div ref={containerRef} className={cn("relative flex flex-wrap items-center gap-1.5", className)}>
        {reactions.map((r) => (
          <div
            key={r.emoji}
            className="relative"
            onMouseEnter={() => setHoveredBadge(r.emoji)}
            onMouseLeave={() => setHoveredBadge(null)}
          >
            <motion.button
              whileTap={{ scale: 0.88 }}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 25,
              }}
              type="button"
              onClick={() => toggleReaction(r.emoji)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-all select-none",
                r.reactedByMe
                  ? "border-indigo-500/60 bg-indigo-500/20 text-indigo-200 shadow-sm shadow-indigo-500/20"
                  : "border-neutral-800 bg-neutral-900/90 text-neutral-400 hover:border-neutral-700 hover:bg-neutral-800 hover:text-neutral-200"
              )}
            >
              <span className="text-sm leading-none">{r.emoji}</span>
              <motion.span
                key={r.count}
                initial={{ scale: 1.3, y: -2 }}
                animate={{ scale: 1, y: 0 }}
                className="font-mono text-xs font-semibold"
              >
                {r.count}
              </motion.span>
            </motion.button>

            {/* Tooltip showing voters */}
            <AnimatePresence>
              {hoveredBadge === r.emoji && (
                <motion.div
                  initial={{ opacity: 0, y: 4, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 z-30 whitespace-nowrap rounded-md border border-neutral-700 bg-neutral-900 px-2 py-1 text-[10px] text-neutral-200 shadow-xl"
                >
                  <span>
                    {r.users.slice(0, 3).join(", ")}
                    {r.users.length > 3 && ` and ${r.users.length - 3} others`}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}

        {/* Add reaction plus pill */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsFullPickerOpen((prev) => !prev)}
            className="inline-flex items-center gap-1 rounded-full border border-neutral-800 bg-neutral-900/60 px-2.5 py-1 text-xs text-neutral-400 hover:border-neutral-700 hover:bg-neutral-800 hover:text-neutral-200 transition-colors"
          >
            <Plus className="h-3 w-3" />
            <Smile className="h-3.5 w-3.5" />
          </button>

          {/* Quick Picker Dropdown */}
          <AnimatePresence>
            {isFullPickerOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute left-0 bottom-full mb-2 z-30 w-72 rounded-2xl border border-neutral-800 bg-neutral-950/95 p-3 shadow-2xl backdrop-blur-2xl"
              >
                <div className="relative mb-3">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search reactions..."
                    className="w-full rounded-lg border border-neutral-800 bg-neutral-900 pl-8 pr-3 py-1.5 text-xs text-neutral-200 placeholder:text-neutral-500 focus:border-indigo-500 focus:outline-none"
                    autoFocus
                  />
                </div>
                <div className="grid grid-cols-6 gap-1 max-h-48 overflow-y-auto pr-1">
                  {filteredFullEmojis.map((item) => (
                    <motion.button
                      key={item.name}
                      whileHover={{ scale: 1.25 }}
                      whileTap={{ scale: 0.9 }}
                      type="button"
                      onClick={() => {
                        toggleReaction(item.emoji);
                        setIsFullPickerOpen(false);
                      }}
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-xl hover:bg-neutral-800 transition-colors"
                      title={item.name}
                    >
                      {item.emoji}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  return (
    <div
      data-fullscreen-scroll
      className={cn(
        "relative w-full min-h-[520px] overflow-hidden rounded-2xl border border-neutral-200/80 bg-neutral-950 p-6 text-neutral-100 shadow-xl dark:border-neutral-800 flex flex-col justify-between",
        className
      )}
    >
      {/* Ambient background blur */}
      <div className="pointer-events-none absolute -top-32 right-1/4 h-80 w-80 rounded-full bg-pink-500/10 blur-[120px]" />

      {/* Top Header */}
      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-neutral-800/80 pb-4">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-neutral-400" />
          <span className="font-semibold text-sm text-white">
            Slack-Style Emoji Reaction Bar
          </span>
          <span className="rounded-full bg-neutral-800 border border-neutral-700/80 px-2 py-0.5 text-[10px] font-mono text-neutral-400">
            Spring Physics & Popover
          </span>
        </div>

        <button
          type="button"
          onClick={() => setReactions(DEFAULT_REACTIONS)}
          className="flex items-center gap-1.5 rounded-lg border border-neutral-800 bg-neutral-900 px-2.5 py-1 text-xs text-neutral-400 hover:text-neutral-200 transition-colors"
        >
          <RotateCcw className="h-3 w-3" />
          <span>Reset Reactions</span>
        </button>
      </div>

      {/* Main Slack Message Card Stage */}
      <div className="relative my-8 mx-auto w-full max-w-2xl">
        <div
          ref={containerRef}
          className="group relative rounded-2xl border border-neutral-800/90 bg-neutral-900/60 p-5 backdrop-blur-md transition-all hover:border-neutral-700/80 hover:bg-neutral-900/80 shadow-xl"
        >
          {/* Floating Slack Quick Reaction Bar on Hover / Trigger */}
          <div className="absolute -top-4 right-4 z-20 flex items-center gap-1 rounded-xl border border-neutral-700/80 bg-neutral-900/95 p-1 shadow-2xl backdrop-blur-lg">
            {QUICK_EMOJIS.slice(0, 5).map((emoji) => (
              <motion.button
                key={emoji}
                whileHover={{ scale: 1.35, y: -2 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                type="button"
                onClick={() => toggleReaction(emoji)}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-base hover:bg-neutral-800 transition-colors"
                title={`React with ${emoji}`}
              >
                {emoji}
              </motion.button>
            ))}

            {/* Open Quick Bar Popover or Full Picker */}
            <button
              type="button"
              onClick={() => setIsFullPickerOpen((prev) => !prev)}
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors",
                isFullPickerOpen && "bg-neutral-800 text-white"
              )}
              title="Add reaction"
            >
              <Smile className="h-4 w-4" />
            </button>
          </div>

          {/* Full Expanded Emoji Picker Modal/Popover */}
          <AnimatePresence>
            {isFullPickerOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-4 top-8 z-30 w-72 rounded-2xl border border-neutral-800 bg-neutral-950/95 p-3 shadow-2xl backdrop-blur-2xl"
              >
                {/* Search Bar */}
                <div className="relative mb-3">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search reactions..."
                    className="w-full rounded-lg border border-neutral-800 bg-neutral-900 pl-8 pr-3 py-1.5 text-xs text-neutral-200 placeholder:text-neutral-500 focus:border-indigo-500 focus:outline-none"
                    autoFocus
                  />
                </div>

                {/* Emoji Grid */}
                <div className="grid grid-cols-6 gap-1 max-h-48 overflow-y-auto pr-1">
                  {filteredFullEmojis.map((item) => (
                    <motion.button
                      key={item.name}
                      whileHover={{ scale: 1.25 }}
                      whileTap={{ scale: 0.9 }}
                      type="button"
                      onClick={() => toggleReaction(item.emoji)}
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-xl hover:bg-neutral-800 transition-colors"
                      title={item.name}
                    >
                      {item.emoji}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Message Author Header */}
          <div className="flex items-start gap-3">
            <div className="relative h-10 w-10 shrink-0 rounded-full bg-gradient-to-tr from-indigo-500 to-rose-500 p-0.5">
              <div className="h-full w-full rounded-full bg-neutral-950 flex items-center justify-center font-bold text-xs text-white">
                AV
              </div>
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-neutral-900 bg-emerald-500" />
            </div>

            <div className="flex-1">
              <div className="flex items-baseline gap-2">
                <span className="font-semibold text-sm text-white">
                  {authorName}
                </span>
                <span className="text-[11px] text-neutral-500 font-mono">
                  {authorRole}
                </span>
                <span className="text-[10px] text-neutral-600">
                  Today at 10:42 AM
                </span>
              </div>

              {/* Message Body */}
              <p className="mt-1.5 text-sm text-neutral-200 leading-relaxed">
                {messageText}
              </p>

              {/* Active Reaction Pills Container */}
              <div className="mt-4 flex flex-wrap items-center gap-1.5">
                {reactions.map((r) => {
                  return (
                    <div
                      key={r.emoji}
                      className="relative"
                      onMouseEnter={() => setHoveredBadge(r.emoji)}
                      onMouseLeave={() => setHoveredBadge(null)}
                    >
                      <motion.button
                        whileTap={{ scale: 0.88 }}
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 25,
                        }}
                        type="button"
                        onClick={() => toggleReaction(r.emoji)}
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-all select-none",
                          r.reactedByMe
                            ? "border-indigo-500/60 bg-indigo-500/20 text-indigo-200 shadow-sm shadow-indigo-500/20"
                            : "border-neutral-800 bg-neutral-900/90 text-neutral-400 hover:border-neutral-700 hover:bg-neutral-800 hover:text-neutral-200"
                        )}
                      >
                        <span className="text-sm leading-none">{r.emoji}</span>
                        <motion.span
                          key={r.count}
                          initial={{ scale: 1.3, y: -2 }}
                          animate={{ scale: 1, y: 0 }}
                          className="font-mono text-xs font-semibold"
                        >
                          {r.count}
                        </motion.span>
                      </motion.button>

                      {/* Tooltip showing voters */}
                      <AnimatePresence>
                        {hoveredBadge === r.emoji && (
                          <motion.div
                            initial={{ opacity: 0, y: 4, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 z-30 whitespace-nowrap rounded-md border border-neutral-700 bg-neutral-900 px-2 py-1 text-[10px] text-neutral-200 shadow-xl"
                          >
                            <span>
                              {r.users.slice(0, 3).join(", ")}
                              {r.users.length > 3 &&
                                ` and ${r.users.length - 3} others`}
                            </span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}

                {/* Add reaction plus pill */}
                <button
                  type="button"
                  onClick={() => setIsFullPickerOpen((prev) => !prev)}
                  className="inline-flex items-center gap-1 rounded-full border border-neutral-800 bg-neutral-900/60 px-2.5 py-1 text-xs text-neutral-400 hover:border-neutral-700 hover:bg-neutral-800 hover:text-neutral-200 transition-colors"
                >
                  <Plus className="h-3 w-3" />
                  <Smile className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Features Info */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-t border-neutral-800/80 pt-4 text-xs text-neutral-400">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-indigo-500" />
          <span>Click reaction badge to toggle your vote</span>
        </div>

        <div className="flex items-center gap-1.5 text-neutral-500 font-mono text-[11px]">
          <Sparkles className="h-3 w-3 text-indigo-400" />
          <span>Framer Motion Spring Count Bumps</span>
        </div>
      </div>
    </div>
  );
}

export default ReactionPicker;

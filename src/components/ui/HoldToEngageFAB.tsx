"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Plus, Sparkles, Share2, Bookmark, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FABAction {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
}

export interface HoldToEngageFABProps {
  /** Main button icon component */
  icon?: React.ComponentType<{ className?: string }>;
  /** Satellite actions list */
  actions?: FABAction[];
  /** Optional custom class name */
  className?: string;
}

const DEFAULT_ACTIONS: FABAction[] = [
  { id: "share", label: "Share", icon: Share2 },
  { id: "bookmark", label: "Bookmark", icon: Bookmark },
  { id: "feature", label: "Feature", icon: Sparkles },
];

export function HoldToEngageFAB({
  icon: MainIcon = Plus,
  actions = DEFAULT_ACTIONS,
  className,
}: HoldToEngageFABProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();

  const handleActionClick = (action: FABAction) => {
    setSelectedAction(action.id);
    action.onClick?.();
    setTimeout(() => {
      setSelectedAction(null);
      setIsOpen(false);
    }, 400);
  };

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      {/* Satellite Action Pills */}
      <AnimatePresence>
        {isOpen && (
          <div className="absolute bottom-16 flex flex-col items-center gap-2.5 z-20">
            {actions.map((act, index) => {
              const Icon = act.icon;
              const isSelected = selectedAction === act.id;

              return (
                <motion.button
                  key={act.id}
                  type="button"
                  onClick={() => handleActionClick(act)}
                  initial={{ opacity: 0, y: 15, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.85 }}
                  transition={
                    reduceMotion
                      ? { duration: 0.1 }
                      : {
                          type: "spring",
                          stiffness: 450,
                          damping: 24,
                          delay: index * 0.04,
                        }
                  }
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-800 shadow-md transition-colors hover:border-black dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:border-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white whitespace-nowrap",
                    isSelected && "border-emerald-500 text-emerald-600 dark:text-emerald-400"
                  )}
                >
                  {isSelected ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    <Icon className="h-3.5 w-3.5" />
                  )}
                  <span>{act.label}</span>
                </motion.button>
              );
            })}
          </div>
        )}
      </AnimatePresence>

      {/* Main Trigger Button */}
      <motion.button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        whileTap={reduceMotion ? {} : { scale: 0.92 }}
        aria-expanded={isOpen}
        aria-label="Toggle actions"
        className="relative flex h-12 w-12 items-center justify-center rounded-full bg-black text-white shadow-lg transition-transform hover:scale-105 active:scale-95 dark:bg-white dark:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white"
      >
        <motion.span
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ type: "spring", stiffness: 450, damping: 25 }}
          className="flex items-center justify-center"
        >
          <MainIcon className="h-5 w-5" />
        </motion.span>
      </motion.button>
    </div>
  );
}

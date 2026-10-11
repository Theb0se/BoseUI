"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface AvatarItem {
  id: string;
  name: string;
  src?: string;
  fallback?: string;
  role?: string;
}

export interface MagneticAvatarStackProps {
  /** Array of avatar objects */
  avatars?: AvatarItem[];
  /** Maximum visible avatars before overflow indicator. Default: 5 */
  max?: number;
  /** Size variant. Default: "md" */
  size?: "sm" | "md" | "lg";
  /** Callback fired when an avatar is clicked */
  onSelect?: (avatar: AvatarItem) => void;
  /** Optional custom class name */
  className?: string;
}

const SIZES = {
  sm: {
    avatar: "w-8 h-8 text-xs",
    overlap: "-space-x-2.5",
    spread: 6,
  },
  md: {
    avatar: "w-10 h-10 text-sm",
    overlap: "-space-x-3",
    spread: 8,
  },
  lg: {
    avatar: "w-12 h-12 text-base",
    overlap: "-space-x-4",
    spread: 12,
  },
};

const DEFAULT_AVATARS: AvatarItem[] = [
  { id: "1", name: "Alex Rivers", fallback: "AR", role: "Design Lead" },
  { id: "2", name: "Sarah Chen", fallback: "SC", role: "Staff Engineer" },
  { id: "3", name: "Devon Ray", fallback: "DR", role: "Product Manager" },
  { id: "4", name: "Elena Rostova", fallback: "ER", role: "Frontend Architect" },
  { id: "5", name: "Marcus Thorne", fallback: "MT", role: "DevOps" },
];

export function MagneticAvatarStack({
  avatars = DEFAULT_AVATARS,
  max = 5,
  size = "md",
  onSelect,
  className,
}: MagneticAvatarStackProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [isStackHovered, setIsStackHovered] = useState(false);
  const reduceMotion = useReducedMotion();

  const currentSize = SIZES[size] || SIZES.md;
  const visibleAvatars = avatars.slice(0, max);
  const overflow = avatars.length - max;

  return (
    <div
      onMouseEnter={() => setIsStackHovered(true)}
      onMouseLeave={() => {
        setIsStackHovered(false);
        setHoveredId(null);
      }}
      className={cn(
        "relative inline-flex items-center select-none py-4",
        currentSize.overlap,
        className
      )}
    >
      {visibleAvatars.map((item, index) => {
        const isHovered = hoveredId === item.id;

        return (
          <div key={item.id} className="relative">
            <motion.button
              type="button"
              onClick={() => onSelect?.(item)}
              onMouseEnter={() => setHoveredId(item.id)}
              onFocus={() => setHoveredId(item.id)}
              onBlur={() => setHoveredId(null)}
              animate={
                reduceMotion
                  ? {}
                  : {
                      y: isHovered ? -8 : 0,
                      scale: isHovered ? 1.15 : 1,
                      x: isStackHovered
                        ? (index - Math.floor(visibleAvatars.length / 2)) *
                          currentSize.spread
                        : 0,
                    }
              }
              transition={{
                type: "spring",
                stiffness: 450,
                damping: 25,
              }}
              style={{
                zIndex: isHovered ? 30 : index + 1,
              }}
              aria-label={`${item.name} (${item.role || "User"})`}
              className={cn(
                "relative flex items-center justify-center rounded-full border-2 border-white bg-neutral-100 font-medium text-neutral-800 shadow-sm transition-shadow dark:border-black dark:bg-neutral-800 dark:text-neutral-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white",
                currentSize.avatar,
                isHovered && "ring-2 ring-black dark:ring-white shadow-lg"
              )}
            >
              {item.src ? (
                <img
                  src={item.src}
                  alt={item.name}
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <span>{item.fallback || item.name.slice(0, 2).toUpperCase()}</span>
              )}
            </motion.button>

            {/* Hover Floating Tooltip */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, y: 4, scale: 0.9 }}
                  animate={{ opacity: 1, y: -6, scale: 1 }}
                  exit={{ opacity: 0, y: 2, scale: 0.95 }}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 28,
                  }}
                  className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 z-40 whitespace-nowrap rounded-lg border border-neutral-200 bg-white px-2.5 py-1 text-xs shadow-md dark:border-neutral-800 dark:bg-neutral-900"
                >
                  <div className="font-semibold text-neutral-900 dark:text-neutral-100">
                    {item.name}
                  </div>
                  {item.role && (
                    <div className="text-[10px] text-neutral-500 dark:text-neutral-400">
                      {item.role}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}

      {overflow > 0 && (
        <div
          style={{ zIndex: visibleAvatars.length + 1 }}
          className={cn(
            "relative flex items-center justify-center rounded-full border-2 border-white bg-neutral-200 font-mono text-xs font-semibold text-neutral-700 shadow-sm dark:border-black dark:bg-neutral-800 dark:text-neutral-300",
            currentSize.avatar
          )}
        >
          +{overflow}
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SpringDropdownChevronProps {
  /** Expanded state when controlled */
  isOpen?: boolean;
  /** Default open state when uncontrolled. Default: false */
  defaultOpen?: boolean;
  /** Callback fired when state toggles */
  onToggle?: (isOpen: boolean) => void;
  /** Label text displayed beside chevron (optional) */
  label?: string;
  /** Size variant. Default: "md" */
  size?: "sm" | "md" | "lg";
  /** Optional custom class name */
  className?: string;
}

const SIZES = {
  sm: {
    btn: "text-xs gap-1 py-1 px-2",
    icon: "h-3.5 w-3.5",
  },
  md: {
    btn: "text-sm gap-1.5 py-1.5 px-3",
    icon: "h-4 w-4",
  },
  lg: {
    btn: "text-base gap-2 py-2 px-4",
    icon: "h-5 w-5",
  },
};

export function SpringDropdownChevron({
  isOpen: controlledOpen,
  defaultOpen = false,
  onToggle,
  label,
  size = "md",
  className,
}: SpringDropdownChevronProps) {
  const isControlled = controlledOpen !== undefined;
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const open = isControlled ? controlledOpen : internalOpen;
  const [isHovered, setIsHovered] = useState(false);
  const reduceMotion = useReducedMotion();

  const handleToggle = () => {
    const next = !open;
    if (!isControlled) {
      setInternalOpen(next);
    }
    onToggle?.(next);
  };

  const currentSize = SIZES[size] || SIZES.md;

  return (
    <button
      type="button"
      onClick={handleToggle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-expanded={open}
      className={cn(
        "inline-flex items-center justify-between rounded-lg border border-neutral-200 bg-white font-medium text-neutral-800 transition-colors hover:border-black dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:border-white select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white",
        currentSize.btn,
        className
      )}
    >
      {label && <span>{label}</span>}
      <motion.span
        animate={
          reduceMotion
            ? { rotate: open ? 180 : 0 }
            : {
                rotate: open ? 180 : isHovered ? 15 : 0,
                y: isHovered && !open ? 1 : 0,
              }
        }
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 24,
        }}
        className="flex items-center justify-center text-neutral-500 hover:text-black dark:text-neutral-400 dark:hover:text-white"
      >
        <ChevronDown className={currentSize.icon} />
      </motion.span>
    </button>
  );
}

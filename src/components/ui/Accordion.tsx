"use client";

import React, { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AccordionItem {
  id: string;
  title: string;
  subtitle?: string;
  content: React.ReactNode;
}

export interface AccordionProps {
  /** Array of collapsible items */
  items?: AccordionItem[];
  /** Allow multiple items to stay open simultaneously */
  allowMultiple?: boolean;
  /** Default open item IDs */
  defaultOpenIds?: string[];
  /** Additional container class names */
  className?: string;
}

const DEFAULT_ITEMS: AccordionItem[] = [
  {
    id: "item-1",
    title: "How do I install BoseUI components?",
    subtitle: "CLI & Manual Copy",
    content:
      "Run npx shadcn@latest add https://boseui.site/r/<slug>.json in your project terminal, or copy the TypeScript code directly from any component page.",
  },
  {
    id: "item-2",
    title: "Can I customize the Tailwind styles and animations?",
    subtitle: "100% Source Ownership",
    content:
      "Yes. Because the source file lives directly inside your src/components/ui/ folder, you can edit every Tailwind class, Framer Motion spring parameter, or TypeScript prop.",
  },
  {
    id: "item-3",
    title: "Does it support Light Mode, Dark Mode, and Reduced Motion?",
    subtitle: "Built-in Accessibility",
    content:
      "Every component is designed for high-contrast Light and Dark themes and automatically respects system prefers-reduced-motion settings.",
  },
];

export function Accordion({
  items = DEFAULT_ITEMS,
  allowMultiple = false,
  defaultOpenIds = ["item-1"],
  className,
}: AccordionProps) {
  const shouldReduceMotion = useReducedMotion();
  const [openIds, setOpenIds] = useState<string[]>(defaultOpenIds);

  const toggleItem = (id: string) => {
    setOpenIds((prev) => {
      const isOpen = prev.includes(id);
      if (allowMultiple) {
        return isOpen ? prev.filter((i) => i !== id) : [...prev, id];
      }
      return isOpen ? [] : [id];
    });
  };

  return (
    <div
      className={cn(
        "w-full max-w-md divide-y divide-neutral-200 overflow-hidden rounded-2xl border border-neutral-200 bg-white dark:divide-[#1F1F1F] dark:border-[#222222] dark:bg-[#0A0A0A]",
        className
      )}
    >
      {items.map((item) => {
        const isOpen = openIds.includes(item.id);
        return (
          <div key={item.id} className="flex flex-col">
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => toggleItem(item.id)}
              className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-neutral-50 dark:hover:bg-[#111111]"
            >
              <div className="min-w-0">
                <div className="text-xs font-semibold text-black dark:text-white sm:text-sm">
                  {item.title}
                </div>
                {item.subtitle && (
                  <div className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-neutral-400">
                    {item.subtitle}
                  </div>
                )}
              </div>

              <motion.span
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 360, damping: 26 }
                }
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-neutral-200 text-neutral-500 dark:border-[#262626] dark:text-neutral-400"
              >
                <ChevronDown className="h-3.5 w-3.5" />
              </motion.span>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={
                    shouldReduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }
                  }
                  animate={
                    shouldReduceMotion
                      ? { opacity: 1 }
                      : { height: "auto", opacity: 1 }
                  }
                  exit={
                    shouldReduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }
                  }
                  transition={{
                    duration: shouldReduceMotion ? 0 : 0.22,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-4 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

export default Accordion;

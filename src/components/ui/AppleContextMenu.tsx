"use client";

import React, { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Copy,
  Share2,
  Pin,
  FolderInput,
  Trash2,
  MoreHorizontal,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface ContextMenuItem {
  id: string;
  label: string;
  shortcut?: string;
  icon?: React.ReactNode;
  destructive?: boolean;
  onSelect?: () => void;
}

export interface ContextMenuGroup {
  id: string;
  items: ContextMenuItem[];
}

export interface AppleContextMenuProps {
  /** Grouped menu items separated by hairline dividers */
  groups?: ContextMenuGroup[];
  /** Label shown on the trigger button */
  triggerLabel?: string;
  /** Initial open state for uncontrolled mode. Default: false */
  defaultOpen?: boolean;
  /** Callback fired when any menu item is clicked */
  onSelect?: (item: ContextMenuItem) => void;
  className?: string;
}

const DEFAULT_GROUPS: ContextMenuGroup[] = [
  {
    id: "primary",
    items: [
      {
        id: "copy",
        label: "Copy Component Link",
        shortcut: "⌘C",
        icon: <Copy className="h-3.5 w-3.5" />,
      },
      {
        id: "share",
        label: "Share Preview...",
        shortcut: "⇧⌘S",
        icon: <Share2 className="h-3.5 w-3.5" />,
      },
      {
        id: "pin",
        label: "Pin to Workspace",
        shortcut: "⌘P",
        icon: <Pin className="h-3.5 w-3.5" />,
      },
    ],
  },
  {
    id: "organize",
    items: [
      {
        id: "move",
        label: "Move to Collection",
        icon: <FolderInput className="h-3.5 w-3.5" />,
      },
    ],
  },
  {
    id: "danger",
    items: [
      {
        id: "delete",
        label: "Delete Component",
        shortcut: "⌘⌫",
        icon: <Trash2 className="h-3.5 w-3.5" />,
        destructive: true,
      },
    ],
  },
];

export function AppleContextMenu({
  groups = DEFAULT_GROUPS,
  triggerLabel = "Actions Menu",
  defaultOpen = false,
  onSelect,
  className,
}: AppleContextMenuProps) {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const containerRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(defaultOpen);
  const [lastAction, setLastAction] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const handleOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    window.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const handleSelect = (item: ContextMenuItem) => {
    item.onSelect?.();
    onSelect?.(item);
    setLastAction(item.label);
    setOpen(false);
  };

  return (
    <div
      ref={containerRef}
      onContextMenu={(e) => {
        e.preventDefault();
        setOpen(true);
      }}
      className={cn("relative inline-flex flex-col items-center", className)}
    >
      {/* Trigger Bar */}
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          aria-haspopup="menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className={cn(
            "inline-flex h-10 items-center gap-2 rounded-2xl border px-4 text-xs font-semibold shadow-2xs transition-all active:scale-95",
            open
              ? "border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-black"
              : "border-neutral-200 bg-white text-neutral-900 hover:border-neutral-900 dark:border-neutral-800 dark:bg-[#0A0A0A] dark:text-white dark:hover:border-white"
          )}
        >
          <span>{triggerLabel}</span>
          <MoreHorizontal className="h-4 w-4" />
        </button>

        {lastAction && (
          <span className="inline-flex items-center gap-1 text-[11px] text-neutral-500 dark:text-neutral-400">
            <Check className="h-3 w-3 text-neutral-900 dark:text-white" />
            {lastAction}
          </span>
        )}
      </div>

      {/* Frosted Blurred Context Popover with Small Arrow */}
      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            aria-label={triggerLabel}
            initial={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.92, y: -6 }
            }
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.94, y: -4 }
            }
            transition={{ type: "spring", stiffness: 440, damping: 28 }}
            style={{ originY: 0 }}
            className="absolute top-[calc(100%+12px)] z-50 w-60 rounded-2xl border border-neutral-200/90 bg-white/90 p-1.5 shadow-2xl backdrop-blur-xl dark:border-neutral-800/90 dark:bg-[#121212]/90"
          >
            {/* Small Top Arrow Caret */}
            <div
              aria-hidden="true"
              className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-l border-t border-neutral-200/90 bg-white/90 dark:border-neutral-800/90 dark:bg-[#121212]/90"
            />

            {/* Grouped Actions */}
            <div className="relative z-10 divide-y divide-neutral-200/75 dark:divide-neutral-800/80">
              {groups.map((group) => (
                <div key={group.id} className="py-1 first:pt-0 last:pb-0">
                  {group.items.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      role="menuitem"
                      onClick={() => handleSelect(item)}
                      className={cn(
                        "flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs font-medium transition-colors",
                        item.destructive
                          ? "text-red-600 hover:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/15"
                          : "text-neutral-800 hover:bg-neutral-100/90 dark:text-neutral-200 dark:hover:bg-neutral-800/70"
                      )}
                    >
                      <span className="flex items-center gap-2.5">
                        <span
                          className={cn(
                            item.destructive
                              ? "text-red-500 dark:text-red-400"
                              : "text-neutral-500 dark:text-neutral-400"
                          )}
                        >
                          {item.icon}
                        </span>
                        <span>{item.label}</span>
                      </span>

                      {item.shortcut && (
                        <kbd
                          className={cn(
                            "font-mono text-[10px]",
                            item.destructive
                              ? "text-red-400 dark:text-red-500/80"
                              : "text-neutral-400 dark:text-neutral-500"
                          )}
                        >
                          {item.shortcut}
                        </kbd>
                      )}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AppleContextMenu;

"use client";

import React, { useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ModalSize = "sm" | "md" | "lg";
export type ModalVariant = "default" | "danger";

export interface ModalPopupProps {
  /** Controlled open state */
  open?: boolean;
  /** Default open state when uncontrolled */
  defaultOpen?: boolean;
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Dialog title */
  title?: string;
  /** Dialog subtitle/description */
  description?: string;
  /** Width preset */
  size?: ModalSize;
  /** Visual style for confirm action ("default" | "danger") */
  variant?: ModalVariant;
  /** Default trigger button label */
  triggerLabel?: string;
  /** Custom trigger element */
  trigger?: React.ReactNode;
  /** Primary confirm button text */
  confirmLabel?: string;
  /** Cancel button text */
  cancelLabel?: string;
  /** Hide default footer buttons when rendering a custom form in children */
  hideFooter?: boolean;
  /** Callback when confirm button is clicked */
  onConfirm?: () => void;
  /** Custom body content */
  children?: React.ReactNode;
  /** Additional dialog class names */
  className?: string;
}

const SIZE_CLASSES: Record<ModalSize, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
};

export function ModalPopup({
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  title = "Confirm Deployment",
  description = "This action will build and deploy your latest commit to production.",
  size = "md",
  variant = "default",
  triggerLabel = "Open Popup",
  trigger,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  hideFooter = false,
  onConfirm,
  children,
  className,
}: ModalPopupProps) {
  const shouldReduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;

  useEffect(() => {
    setMounted(true);
  }, []);

  const setOpen = useCallback(
    (next: boolean) => {
      if (controlledOpen === undefined) {
        setInternalOpen(next);
      }
      onOpenChange?.(next);
    },
    [controlledOpen, onOpenChange]
  );

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKey);
    };
  }, [isOpen, setOpen]);

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.18 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-xs"
            aria-hidden="true"
          />

          {/* Dialog Card */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.94, y: 10 }
            }
            animate={
              shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }
            }
            exit={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.96, y: 6 }
            }
            transition={{
              type: "spring",
              stiffness: 420,
              damping: 30,
            }}
            className={cn(
              "relative z-[9999] w-full overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6 text-black shadow-2xl dark:border-[#242424] dark:bg-[#0A0A0A] dark:text-white",
              SIZE_CLASSES[size],
              className
            )}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-base font-semibold tracking-tight text-black dark:text-white">
                  {title}
                </h3>
                {description && (
                  <p className="mt-1.5 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
                    {description}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close popup"
                className="cursor-pointer rounded-lg border border-neutral-200 p-1.5 text-neutral-500 transition-colors hover:border-black hover:text-black dark:border-[#262626] dark:hover:border-white dark:hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Body */}
            {children && (
              <div className="mt-4 text-xs text-neutral-600 dark:text-neutral-300">
                {children}
              </div>
            )}

            {/* Footer Actions */}
            {!hideFooter && (
              <div className="mt-6 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="cursor-pointer rounded-xl border border-neutral-200 px-3.5 py-2 text-xs font-medium text-neutral-600 transition-colors hover:border-black hover:text-black dark:border-[#262626] dark:text-neutral-400 dark:hover:border-white dark:hover:text-white"
                >
                  {cancelLabel}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onConfirm?.();
                    setOpen(false);
                  }}
                  className={cn(
                    "cursor-pointer rounded-xl px-4 py-2 text-xs font-medium transition-colors",
                    variant === "danger"
                      ? "bg-red-600 text-white hover:bg-red-700"
                      : "bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
                  )}
                >
                  {confirmLabel}
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      {trigger ? (
        <div onClick={() => setOpen(true)} className="inline-block cursor-pointer">
          {trigger}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-black px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
        >
          {triggerLabel}
        </button>
      )}

      {mounted && createPortal(modalContent, document.body)}
    </>
  );
}

export default ModalPopup;

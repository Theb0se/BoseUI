"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AnnouncementMessage {
  /** Unique identifier for the message */
  id: string;
  /** Main announcement copy */
  text: string;
  /** Optional chip label (e.g. "New", "Update", "Sponsor") */
  badge?: string;
  /** Destination URL */
  href?: string;
  /** Call to action link text. Defaults to "Learn more" */
  linkLabel?: string;
}

export interface AnnouncementBannerProps {
  /**
   * One or more announcement messages.
   * A single message renders a static banner. Multiple messages rotate automatically.
   */
  messages: AnnouncementMessage[];
  /**
   * Visual style variant.
   * - "default": Subtle neutral tone matching light/dark site styling.
   * - "accent": Teal accent tone.
   * - "inverted": High-contrast monochrome (dark in light mode, light in dark mode).
   * @default "default"
   */
  variant?: "default" | "accent" | "inverted" | "glass" | "fade" | "outline" | "highlight";
  /**
   * Whether the user can dismiss and close the banner.
   * @default true
   */
  dismissible?: boolean;
  /**
   * localStorage key namespace for persisting dismissal.
   * If the first message id changes, the banner reappears automatically.
   * @default "boseui-announcement"
   */
  storageKey?: string;
  /**
   * Rotation interval in milliseconds when multiple messages are supplied.
   * Pauses on pointer hover, keyboard focus, and when the browser tab is hidden.
   * @default 5000
   */
  rotateInterval?: number;
  /**
   * If true, fixes to the top of the viewport when scrolling.
   * Otherwise, scrolls with the page flow.
   * @default false
   */
  sticky?: boolean;
  /**
   * Hooke's Law spring stiffness coefficient for enter, exit, and slide animations.
   * Matches the Snappy preset.
   * @default 380
   */
  stiffness?: number;
  /**
   * Spring damping coefficient controlling oscillation decay.
   * Matches the Snappy preset.
   * @default 24
   */
  damping?: number;
  /**
   * Callback fired when the banner is dismissed.
   */
  onDismiss?: () => void;
  /**
   * Optional custom background component (e.g. FlickeringGrid or subtle canvas).
   */
  background?: React.ReactNode;
  /**
   * Additional classes for the outer wrapper element.
   */
  className?: string;
}

export function AnnouncementBanner({
  messages,
  variant = "default",
  dismissible = true,
  storageKey = "boseui-announcement",
  rotateInterval = 5000,
  sticky = false,
  stiffness = 380,
  damping = 24,
  onDismiss,
  background,
  className,
}: AnnouncementBannerProps) {
  // SSR-safe state: null during hydration to prevent flash of already-dismissed banner
  const [isDismissed, setIsDismissed] = useState<boolean | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const bannerRef = useRef<HTMLDivElement | null>(null);
  const shouldReduceMotion = useReducedMotion();

  // Read dismissed state from localStorage on client mount
  useEffect(() => {
    if (!messages || messages.length === 0) {
      setIsDismissed(true);
      return;
    }

    const firstId = messages[0]?.id;
    const key = `${storageKey}-${firstId}`;

    try {
      const stored = localStorage.getItem(key);
      setIsDismissed(stored === "true");
    } catch {
      setIsDismissed(false);
    }
  }, [messages, storageKey]);

  // Expose --announcement-height CSS variable on document.documentElement for sticky header offset
  useEffect(() => {
    if (typeof document === "undefined") return;

    if (isDismissed === false && bannerRef.current) {
      const updateHeight = () => {
        if (bannerRef.current) {
          const h = bannerRef.current.getBoundingClientRect().height;
          document.documentElement.style.setProperty(
            "--announcement-height",
            `${h}px`
          );
        }
      };

      updateHeight();

      const observer = new ResizeObserver(() => {
        updateHeight();
      });
      observer.observe(bannerRef.current);

      return () => {
        observer.disconnect();
        document.documentElement.style.removeProperty("--announcement-height");
      };
    } else {
      document.documentElement.style.removeProperty("--announcement-height");
    }
  }, [isDismissed]);

  // Auto-rotation timer: pauses on hover, focus, hidden tab, or reduced motion
  useEffect(() => {
    if (
      !messages ||
      messages.length <= 1 ||
      shouldReduceMotion ||
      isHovered ||
      isFocused ||
      isDismissed !== false
    ) {
      return;
    }

    const timer = setInterval(() => {
      if (
        typeof document !== "undefined" &&
        document.visibilityState === "hidden"
      ) {
        return;
      }
      setCurrentIndex((prev) => (prev + 1) % messages.length);
    }, rotateInterval);

    return () => clearInterval(timer);
  }, [
    messages,
    shouldReduceMotion,
    isHovered,
    isFocused,
    isDismissed,
    rotateInterval,
  ]);

  const handleDismiss = () => {
    setIsDismissed(true);
    onDismiss?.();

    try {
      const firstId = messages[0]?.id;
      if (firstId) {
        localStorage.setItem(`${storageKey}-${firstId}`, "true");
      }
    } catch {
      // Storage unavailable or quota exceeded
    }
  };

  // If pending hydration or no messages, render nothing to avoid flash
  if (isDismissed === null || !messages || messages.length === 0) {
    return null;
  }

  const currentMessage = messages[currentIndex] || messages[0];

  const springConfig = {
    type: "spring",
    stiffness,
    damping,
  };

  const variantStyles = {
    default:
      "bg-neutral-50/95 dark:bg-neutral-900/90 border-neutral-200/90 dark:border-neutral-800/90 text-neutral-800 dark:text-neutral-200",
    accent:
      "bg-teal-50/95 dark:bg-teal-950/40 border-teal-200/90 dark:border-teal-800/60 text-teal-950 dark:text-teal-100",
    inverted:
      "bg-neutral-950 text-neutral-100 border-neutral-800 dark:bg-white dark:text-neutral-950 dark:border-neutral-200",
    highlight:
      "bg-yellow-300 dark:bg-yellow-400 border-yellow-400 dark:border-yellow-500 text-neutral-950",
    glass:
      "bg-white/60 dark:bg-white/5 backdrop-blur-md border-white/50 dark:border-white/10 text-neutral-900 dark:text-neutral-100 shadow-sm",
    outline:
      "bg-transparent border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200",
    fade:
      "bg-gradient-to-r from-teal-50 via-white to-teal-50 dark:from-teal-950/50 dark:via-neutral-950 dark:to-teal-950/50 border-teal-200/90 dark:border-teal-900/60 text-neutral-900 dark:text-neutral-100",
  };

  const badgeStyles = {
    default:
      "bg-neutral-200/70 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200",
    accent:
      "bg-teal-100 dark:bg-teal-900/60 border-teal-300 dark:border-teal-700 text-teal-800 dark:text-teal-200",
    inverted:
      "bg-neutral-800 text-neutral-200 border-neutral-700 dark:bg-neutral-100 dark:text-neutral-800 dark:border-neutral-300",
  };

  const linkStyles = {
    default:
      "text-neutral-950 dark:text-white hover:text-neutral-900 dark:hover:text-neutral-100",
    accent:
      "text-teal-950 dark:text-teal-200 hover:text-teal-900 dark:hover:text-teal-100",
    inverted: "text-white dark:text-neutral-950 font-semibold",
  };

  const closeStyles = {
    default:
      "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50 focus-visible:ring-neutral-400",
    accent:
      "text-teal-700 hover:text-teal-950 dark:text-teal-400 dark:hover:text-teal-100 hover:bg-teal-100 dark:hover:bg-teal-900/50 focus-visible:ring-teal-500",
    inverted:
      "text-neutral-400 hover:text-white dark:text-neutral-600 dark:hover:text-black hover:bg-neutral-800 dark:hover:bg-neutral-100 focus-visible:ring-neutral-400",
  };

  return (
    <AnimatePresence mode="wait">
      {!isDismissed && (
        <motion.aside
          ref={bannerRef}
          role="region"
          aria-label="Announcement"
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
          transition={springConfig}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={cn(
            "relative w-full overflow-hidden border-b backdrop-blur-sm",
            sticky && "sticky top-0 z-[50]",
            variantStyles[variant],
            className
          )}
        >
          {/* Optional dogfooded background canvas / texture */}
          {background && (
            <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-15">
              {background}
            </div>
          )}

          {/* One-time soft shimmer sweep on initial load */}
          {!shouldReduceMotion && (
            <motion.div
              aria-hidden="true"
              initial={{ x: "-100%" }}
              animate={{ x: "200%" }}
              transition={{ duration: 1.2, ease: "easeInOut", delay: 0.2 }}
              className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-r from-transparent via-white/10 dark:via-white/5 to-transparent"
            />
          )}

          {/* Banner content container */}
          <motion.div
            initial={
              shouldReduceMotion ? { opacity: 0 } : { y: 6, opacity: 0 }
            }
            animate={{ y: 0, opacity: 1 }}
            transition={springConfig}
            className="relative z-10 mx-auto flex min-h-[40px] max-w-7xl items-center justify-center px-8 py-2 sm:px-12 md:py-2.5 text-xs sm:text-sm"
          >
            {/* Center rotating announcement content */}
            <div
              className="flex items-center justify-center overflow-hidden py-0.5 text-center"
              aria-live="off"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={currentMessage.id}
                  initial={
                    shouldReduceMotion
                      ? { opacity: 0 }
                      : { y: 8, opacity: 0 }
                  }
                  animate={{ y: 0, opacity: 1 }}
                  exit={
                    shouldReduceMotion
                      ? { opacity: 0 }
                      : { y: -8, opacity: 0 }
                  }
                  transition={springConfig}
                  className="flex flex-wrap items-center justify-center gap-2"
                >
                  {/* Badge pill */}
                  {currentMessage.badge && (
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium leading-none tracking-normal capitalize",
                        badgeStyles[variant]
                      )}
                    >
                      {currentMessage.badge}
                    </span>
                  )}

                  {/* Message body */}
                  <span className="line-clamp-2 font-normal">
                    {currentMessage.text}
                  </span>

                  {/* Call to action link */}
                  {currentMessage.href && (
                    <Link
                      href={currentMessage.href}
                      className={cn(
                        "group inline-flex items-center gap-1 font-medium underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 rounded",
                        linkStyles[variant]
                      )}
                    >
                      <span className="hidden min-[360px]:inline">
                        {currentMessage.linkLabel ?? "Learn more"}
                      </span>
                      <motion.span
                        className="inline-block transition-transform duration-200 ease-out group-hover:translate-x-0.5"
                        aria-hidden="true"
                      >
                        <ArrowRight className="h-3.5 w-3.5" />
                      </motion.span>
                    </Link>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right dismiss button */}
            {dismissible && (
              <div className="absolute right-2 top-1/2 -translate-y-1/2 sm:right-4 z-20">
                <motion.button
                  type="button"
                  onClick={handleDismiss}
                  whileHover={
                    shouldReduceMotion ? undefined : { scale: 1.08 }
                  }
                  whileTap={
                    shouldReduceMotion
                      ? undefined
                      : { scale: 0.92, rotate: 12 }
                  }
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 20,
                  }}
                  aria-label="Dismiss announcement"
                  className={cn(
                    "flex h-7 w-7 sm:h-6 sm:w-6 items-center justify-center rounded-md transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1",
                    closeStyles[variant]
                  )}
                >
                  <X className="h-3.5 w-3.5" />
                </motion.button>
              </div>
            )}
          </motion.div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

export default AnnouncementBanner;

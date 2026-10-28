"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface ExpandableCardItem {
  id: number | string;
  name: string;
  tagline?: string;
  description?: string;
  quote?: string | string[];
  author?: string;
  role?: string;
  initials?: string;
  href?: string;
  ctaLabel?: string;
  ctaText?: string;
  bg?: string; // tailwind background classes
  border?: string; // tailwind border classes
  logo?: React.ReactNode | React.ComponentType;
  Logo?: React.ReactNode | React.ComponentType;
  className?: string;
}

export type ExpandableStory = ExpandableCardItem;
export type Story = ExpandableCardItem;

export interface ExpandableCardsProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  /** Array of expandable card items with logos and contents passed as props */
  stories?: ExpandableCardItem[];
  /** Optional alias for stories */
  items?: ExpandableCardItem[];
  /** Active card ID on initial render */
  defaultActiveId?: number | string;
  /** Custom headline */
  title?: React.ReactNode;
  /** Eyebrow subtitle */
  subtitle?: React.ReactNode;
  /** Optional custom right-aligned header action */
  headerAction?: React.ReactNode;
  /** Label for the default header link */
  moreStoriesText?: string;
  /** Destination URL for the default header link */
  moreStoriesHref?: string;
  /** Custom container class name */
  className?: string;
}

function renderLogo(logo: React.ReactNode | React.ComponentType | undefined) {
  if (!logo) return null;
  if (typeof logo === "function") {
    const Component = logo as React.ComponentType;
    return <Component />;
  }
  return <>{logo}</>;
}

export function ExpandableCards({
  stories,
  items,
  defaultActiveId,
  title,
  subtitle,
  headerAction,
  moreStoriesText,
  moreStoriesHref,
  className,
  ...props
}: ExpandableCardsProps) {
  const cardList = stories || items || [];
  const initialActive = defaultActiveId ?? cardList[0]?.id;
  const [active, setActive] = useState<number | string | undefined>(initialActive);
  const reduceMotion = useReducedMotion();

  if (cardList.length === 0) {
    return null;
  }

  const hasHeader = Boolean(title || subtitle || headerAction || moreStoriesText);

  return (
    <section
      className={cn("w-full bg-[#141414] px-6 py-16 text-white rounded-2xl", className)}
      {...props}
    >
      <div className="mx-auto max-w-6xl">
        {hasHeader && (
          <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              {subtitle && (
                <span className="block text-sm text-neutral-400 mb-1">
                  {subtitle}
                </span>
              )}
              {title && (
                <h2 className="text-3xl font-medium leading-tight tracking-tight sm:text-4xl">
                  {title}
                </h2>
              )}
            </div>
            {headerAction ? (
              headerAction
            ) : moreStoriesText ? (
              <a
                href={moreStoriesHref || "#"}
                className="shrink-0 pb-1 text-sm text-neutral-300 underline underline-offset-4 transition-colors hover:text-white"
              >
                {moreStoriesText}
              </a>
            ) : null}
          </div>
        )}

        {/* Cards: horizontal accordion on md+, stacked on mobile */}
        <div className="flex h-[640px] flex-col gap-2 md:h-[480px] md:flex-row">
          {cardList.map((s) => {
            const isActive = active === s.id;
            const logoElement = renderLogo(s.logo ?? s.Logo);
            const quoteLines = Array.isArray(s.quote)
              ? s.quote
              : typeof s.quote === "string"
                ? [s.quote]
                : [];
            const initials =
              s.initials ||
              (s.author
                ? s.author
                  .split(" ")
                  .filter(Boolean)
                  .map((w) => w[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()
                : "");
            const ctaText = s.ctaLabel || s.ctaText;
            const tagline = s.tagline || s.description;

            return (
              <motion.article
                key={s.id}
                layout={!reduceMotion}
                tabIndex={0}
                role="button"
                aria-expanded={isActive}
                aria-label={`${s.name}${tagline ? ` - ${tagline}` : ""}`}
                onFocus={() => setActive(s.id)}
                onClick={() => setActive(s.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setActive(s.id);
                  }
                }}
                animate={{ flexGrow: isActive ? 10 : 0 }}
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 180, damping: 26 }
                }
                className={cn(
                  "relative min-h-0 min-w-0 cursor-pointer overflow-hidden rounded-xl border p-6 outline-none focus-visible:ring-2 focus-visible:ring-white/70",
                  s.bg || "bg-neutral-900",
                  s.border || "border-white/10",
                  isActive ? "basis-0" : "basis-14 md:basis-[84px]",
                  s.className
                )}
              >
                {/* Logo: pinned top-left if provided */}
                {logoElement && (
                  <div className="flex h-8 items-center">
                    {logoElement}
                  </div>
                )}

                <AnimatePresence mode="wait">
                  {isActive && (
                    <motion.div
                      key="content"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, transition: { duration: 0.1 } }}
                      transition={{ delay: reduceMotion ? 0 : 0.2, duration: 0.3 }}
                      className="absolute inset-0 flex flex-col p-6"
                    >
                      {/* Spacer for logo */}
                      {logoElement && <div className="h-8" />}

                      <div className="mt-8">
                        <p className="text-sm font-semibold">{s.name}</p>
                        {tagline && (
                          <p className="mt-1 max-w-md text-xs text-white/70">
                            {tagline}
                          </p>
                        )}
                      </div>

                      <div className="mt-auto">
                        {quoteLines.length > 0 && (
                          <blockquote className="max-w-xl text-xl font-medium leading-snug md:text-[22px]">
                            {quoteLines.map((line) => (
                              <span key={line} className="block">
                                {line}
                              </span>
                            ))}
                          </blockquote>
                        )}

                        {(s.author || s.role) && (
                          <div className="mt-5 flex items-center gap-3">
                            {initials && (
                              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-xs font-semibold ring-1 ring-white/20">
                                {initials}
                              </span>
                            )}
                            <p className="text-xs font-medium text-white/80">
                              {s.author}
                              {s.role ? `, ${s.role}` : ""}
                            </p>
                          </div>
                        )}

                        {s.href && (
                          <a
                            href={s.href}
                            onClick={(e) => e.stopPropagation()}
                            className="mt-6 inline-flex items-center gap-1.5 text-xs font-medium underline underline-offset-4 hover:opacity-80"
                          >
                            <span>{ctaText || "Explore \u2192"}</span>
                          </a>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default ExpandableCards;

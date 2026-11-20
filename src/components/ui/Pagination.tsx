"use client";

import React, { useState, useId, useMemo, useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PaginationProps extends React.HTMLAttributes<HTMLElement> {
  /** Total number of pages */
  totalPages?: number;
  /** Controlled current page (1-indexed) */
  currentPage?: number;
  /** Initial page for uncontrolled usage */
  defaultPage?: number;
  /** Number of sibling page buttons visible on each side of the active page. Default: 1 */
  siblingCount?: number;
  /** Callback fired when the active page changes */
  onPageChange?: (page: number) => void;
  /** Whether to show previous/next buttons */
  showControls?: boolean;
  /** Whether to show first/last page skip buttons */
  showEdgeControls?: boolean;
  /** Whether to display a jump-to-page direct input */
  showQuickJumper?: boolean;
  /** Total number of items (optional, displays "Showing X-Y of Z items") */
  totalItems?: number;
  /** Page size when totalItems is provided. Default: 10 */
  pageSize?: number;
  /** Spring stiffness coefficient. Default: 380 */
  stiffness?: number;
  /** Spring damping coefficient. Default: 28 */
  damping?: number;
  /** Custom Tailwind classes */
  className?: string;
}

export function Pagination({
  totalPages = 10,
  currentPage: controlledPage,
  defaultPage = 1,
  siblingCount = 1,
  onPageChange,
  showControls = true,
  showEdgeControls = true,
  showQuickJumper = false,
  totalItems,
  pageSize = 10,
  stiffness = 380,
  damping = 28,
  className,
  ...props
}: PaginationProps) {
  const [internalPage, setInternalPage] = useState(defaultPage);
  const [jumpInput, setJumpInput] = useState("");
  const instanceId = useId();
  const shouldReduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  const activePage =
    controlledPage !== undefined ? controlledPage : internalPage;

  const setPage = (page: number) => {
    const clamped = Math.max(1, Math.min(page, totalPages));
    if (clamped === activePage) return;

    if (controlledPage === undefined) {
      setInternalPage(clamped);
    }
    onPageChange?.(clamped);
  };

  // Keyboard navigation when pagination container is focused
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setPage(activePage - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      setPage(activePage + 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      setPage(1);
    } else if (e.key === "End") {
      e.preventDefault();
      setPage(totalPages);
    }
  };

  // Build page numbers array with ellipses
  const pageRange = useMemo(() => {
    const totalNumbers = siblingCount * 2 + 5; // siblingCount + first + last + current + 2 dots
    if (totalNumbers >= totalPages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const leftSiblingIndex = Math.max(activePage - siblingCount, 1);
    const rightSiblingIndex = Math.min(activePage + siblingCount, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 1;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
      return [...leftRange, "dots-right", totalPages];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = Array.from(
        { length: rightItemCount },
        (_, i) => totalPages - rightItemCount + i + 1
      );
      return [1, "dots-left", ...rightRange];
    }

    const middleRange = Array.from(
      { length: rightSiblingIndex - leftSiblingIndex + 1 },
      (_, i) => leftSiblingIndex + i
    );
    return [1, "dots-left", ...middleRange, "dots-right", totalPages];
  }, [totalPages, siblingCount, activePage]);

  const handleJumpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(jumpInput, 10);
    if (!isNaN(parsed) && parsed >= 1 && parsed <= totalPages) {
      setPage(parsed);
      setJumpInput("");
    }
  };

  const startItem = (activePage - 1) * pageSize + 1;
  const endItem = Math.min(activePage * pageSize, totalItems || activePage * pageSize);

  return (
    <nav
      role="navigation"
      aria-label="Pagination Navigation"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      className={cn(
        "flex flex-wrap items-center justify-center gap-2 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-600 rounded-xl p-2",
        className
      )}
      {...props}
    >
      {/* Optional total items counter */}
      {totalItems !== undefined && (
        <span className="text-xs text-neutral-500 mr-2 dark:text-neutral-400">
          Showing <span className="font-semibold text-neutral-900 dark:text-white">{startItem}-{endItem}</span> of{" "}
          <span className="font-semibold text-neutral-900 dark:text-white">{totalItems}</span>
        </span>
      )}

      {/* First Page Skip Button */}
      {showEdgeControls && (
        <button
          type="button"
          onClick={() => setPage(1)}
          disabled={activePage === 1}
          aria-label="Go to first page"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200/80 bg-white text-neutral-600 shadow-sm transition-all hover:bg-neutral-50 hover:text-neutral-950 disabled:opacity-40 disabled:pointer-events-none active:scale-95 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
        >
          <ChevronsLeft className="h-4 w-4" />
        </button>
      )}

      {/* Previous Page Button */}
      {showControls && (
        <button
          type="button"
          onClick={() => setPage(activePage - 1)}
          disabled={activePage === 1}
          aria-label="Go to previous page"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200/80 bg-white text-neutral-600 shadow-sm transition-all hover:bg-neutral-50 hover:text-neutral-950 disabled:opacity-40 disabled:pointer-events-none active:scale-95 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      )}

      {/* Page Numbers with Spring Active Pill */}
      <div
        ref={containerRef}
        className="flex items-center gap-1 rounded-xl border border-neutral-200/70 bg-neutral-50/70 p-1 backdrop-blur-sm dark:border-neutral-800/80 dark:bg-neutral-900/60"
      >
        {pageRange.map((item, idx) => {
          if (typeof item === "string") {
            const isLeft = item === "dots-left";
            return (
              <button
                key={`${item}-${idx}`}
                type="button"
                onClick={() => setPage(isLeft ? activePage - 4 : activePage + 4)}
                aria-label={isLeft ? "Jump 4 pages backward" : "Jump 4 pages forward"}
                className="group flex h-8 w-8 items-center justify-center text-xs font-mono text-neutral-400 hover:text-neutral-950 dark:text-neutral-500 dark:hover:text-white"
              >
                <span className="group-hover:hidden">…</span>
                <span className="hidden group-hover:inline text-[11px] font-sans">
                  {isLeft ? "«" : "»"}
                </span>
              </button>
            );
          }

          const pageNum = item as number;
          const isActive = pageNum === activePage;

          return (
            <button
              key={pageNum}
              type="button"
              onClick={() => setPage(pageNum)}
              aria-label={`Page ${pageNum}`}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "relative flex h-8 w-8 items-center justify-center rounded-lg text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-600",
                isActive
                  ? "text-white dark:text-neutral-950 font-bold"
                  : "text-neutral-600 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white"
              )}
            >
              {/* Spring Active Indicator Capsule */}
              {isActive && (
                <motion.div
                  layoutId={`pagination-pill-${instanceId}`}
                  className="absolute inset-0 rounded-lg bg-neutral-950 shadow-md dark:bg-white -z-10"
                  transition={
                    shouldReduceMotion
                      ? { duration: 0 }
                      : { type: "spring", stiffness, damping }
                  }
                />
              )}
              <span>{pageNum}</span>
            </button>
          );
        })}
      </div>

      {/* Next Page Button */}
      {showControls && (
        <button
          type="button"
          onClick={() => setPage(activePage + 1)}
          disabled={activePage === totalPages}
          aria-label="Go to next page"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200/80 bg-white text-neutral-600 shadow-sm transition-all hover:bg-neutral-50 hover:text-neutral-950 disabled:opacity-40 disabled:pointer-events-none active:scale-95 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      )}

      {/* Last Page Skip Button */}
      {showEdgeControls && (
        <button
          type="button"
          onClick={() => setPage(totalPages)}
          disabled={activePage === totalPages}
          aria-label="Go to last page"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200/80 bg-white text-neutral-600 shadow-sm transition-all hover:bg-neutral-50 hover:text-neutral-950 disabled:opacity-40 disabled:pointer-events-none active:scale-95 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
        >
          <ChevronsRight className="h-4 w-4" />
        </button>
      )}

      {/* Optional Quick Jumper */}
      {showQuickJumper && (
        <form onSubmit={handleJumpSubmit} className="flex items-center gap-1.5 ml-2">
          <span className="text-xs text-neutral-500 dark:text-neutral-400">Go to</span>
          <input
            type="number"
            min={1}
            max={totalPages}
            value={jumpInput}
            onChange={(e) => setJumpInput(e.target.value)}
            placeholder={`${activePage}`}
            aria-label="Jump to page number"
            className="h-8 w-12 rounded-lg border border-neutral-200 bg-white px-1 text-center text-xs text-neutral-900 shadow-sm focus:border-neutral-950 focus:outline-none dark:border-neutral-800 dark:bg-neutral-900 dark:text-white"
          />
        </form>
      )}
    </nav>
  );
}

export default Pagination;

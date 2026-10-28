"use client";

import React, {
  useState,
  useRef,
  useId,
  useMemo,
  useCallback,
  type ChangeEvent,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

function GooeyFilter({
  filterId,
  blur,
}: {
  filterId: string;
  blur: number;
}) {
  return (
    <svg
      className="pointer-events-none absolute h-0 w-0 opacity-0"
      aria-hidden="true"
    >
      <defs>
        <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation={blur} result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
            result="goo"
          />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>
      </defs>
    </svg>
  );
}

function SearchIcon({ layoutId }: { layoutId: string }) {
  return (
    <motion.svg
      layoutId={layoutId}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      className="block size-4 shrink-0"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </motion.svg>
  );
}

const transition = {
  type: "spring" as const,
  stiffness: 440,
  damping: 28,
  mass: 0.8,
};

const iconBubbleVariants = {
  collapsed: { scale: 0.6, opacity: 0 },
  expanded: { scale: 1, opacity: 1 },
};

export interface GooeyInputClassNames {
  root?: string;
  filterWrap?: string;
  buttonRow?: string;
  trigger?: string;
  input?: string;
  bubble?: string;
  bubbleSurface?: string;
}

export interface GooeyInputProps {
  placeholder?: string;
  className?: string;
  classNames?: GooeyInputClassNames;
  /** Collapsed control width in px */
  collapsedWidth?: number;
  /** Expanded control width in px */
  expandedWidth?: number;
  /** Horizontal offset when expanded (px), aligns detached bubble */
  expandedOffset?: number;
  /** Gaussian blur amount for the gooey SVG filter */
  gooeyBlur?: number;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
}

export function GooeyInput({
  placeholder = "Type to search...",
  className,
  classNames,
  collapsedWidth = 115,
  expandedWidth = 200,
  expandedOffset = 50,
  gooeyBlur = 5,
  value: valueProp,
  defaultValue = "",
  onValueChange,
  onOpenChange,
  disabled = false,
}: GooeyInputProps) {
  const reactId = useId();
  const safeId = reactId.replace(/:/g, "");
  const filterId = `gooey-filter-${safeId}`;
  const iconLayoutId = `gooey-input-icon-${safeId}`;

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);

  const isControlled = valueProp !== undefined;
  const searchText = isControlled ? valueProp : uncontrolledValue;

  const setSearchText = useCallback(
    (next: string) => {
      if (!isControlled) {
        setUncontrolledValue(next);
      }
      onValueChange?.(next);
    },
    [isControlled, onValueChange],
  );

  const setExpanded = useCallback(
    (next: boolean) => {
      setIsExpanded(next);
      onOpenChange?.(next);
    },
    [onOpenChange],
  );

  const handleExpand = useCallback(() => {
    if (disabled) return;
    setExpanded(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  }, [disabled, setExpanded]);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setSearchText(e.target.value);
    },
    [setSearchText],
  );

  // Safe blur handler: only collapse if focus genuinely moves outside this component
  const handleContainerBlur = useCallback(
    (e: React.FocusEvent<HTMLDivElement>) => {
      const nextTarget = e.relatedTarget as Node | null;
      if (!containerRef.current?.contains(nextTarget)) {
        if (!searchText) {
          setExpanded(false);
        }
      }
    },
    [searchText, setExpanded],
  );

  const handleBubbleClick = useCallback(() => {
    if (disabled) return;
    if (isExpanded) {
      if (!searchText) {
        setExpanded(false);
      } else {
        inputRef.current?.focus();
      }
    } else {
      handleExpand();
    }
  }, [disabled, isExpanded, searchText, setExpanded, handleExpand]);

  const pillVariants = useMemo(
    () => ({
      collapsed: { width: collapsedWidth, x: 0 },
      expanded: { width: expandedWidth, x: expandedOffset },
    }),
    [collapsedWidth, expandedWidth, expandedOffset],
  );

  const liquidBubbleVariants = useMemo(
    () => ({
      collapsed: { scale: 0.6, opacity: 0 },
      expanded: { scale: 1, opacity: 1 },
    }),
    [],
  );

  const surfaceBgClass = "bg-foreground shadow-sm ring-1 ring-border/60";

  return (
    <div
      ref={containerRef}
      onBlur={handleContainerBlur}
      className={cn(
        "relative inline-flex items-center select-none",
        className,
        classNames?.root,
      )}
      role="search"
      aria-expanded={isExpanded}
    >
      {/* ── SVG GOOEY METABALL FILTER DEFINITION ── */}
      <GooeyFilter filterId={filterId} blur={gooeyBlur} />

      {/* ── LAYER 1: LIQUID BACKGROUND CANVAS (Filtered) ── */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 flex h-10 items-center",
          classNames?.filterWrap,
        )}
        style={{ filter: `url(#${filterId})` }}
        aria-hidden="true"
      >
        {/* Detached Bubble Liquid Shape */}
        <motion.div
          className={cn(
            "absolute left-0 top-0 size-10 rounded-full",
            surfaceBgClass,
            classNames?.bubbleSurface,
          )}
          variants={liquidBubbleVariants}
          initial="collapsed"
          animate={isExpanded ? "expanded" : "collapsed"}
          transition={transition}
        />

        {/* Expanding Pill Liquid Shape */}
        <motion.div
          className={cn(
            "h-10 rounded-full",
            surfaceBgClass,
            classNames?.buttonRow,
          )}
          variants={pillVariants}
          initial="collapsed"
          animate={isExpanded ? "expanded" : "collapsed"}
          transition={transition}
        />
      </div>

      {/* ── LAYER 2: INTERACTIVE CONTENT (Unfiltered, Crisp Text & Icon) ── */}
      <div className="relative flex h-10 items-center">
        {/* Detached Search Bubble Button (Perfect 40px center alignment) */}
        <motion.button
          type="button"
          tabIndex={isExpanded ? 0 : -1}
          disabled={disabled}
          onClick={handleBubbleClick}
          aria-label={isExpanded ? "Search or toggle input" : "Open search"}
          className={cn(
            "absolute left-0 top-0 m-0 p-0 flex size-10 items-center justify-center rounded-full text-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
            classNames?.bubble,
          )}
          variants={iconBubbleVariants}
          initial="collapsed"
          animate={isExpanded ? "expanded" : "collapsed"}
          transition={transition}
        >
          {isExpanded && <SearchIcon layoutId={iconLayoutId} />}
        </motion.button>

        {/* Expanding Input Bar */}
        <motion.div
          className={cn(
            "relative flex h-10 items-center overflow-hidden rounded-full",
            classNames?.buttonRow,
          )}
          variants={pillVariants}
          initial="collapsed"
          animate={isExpanded ? "expanded" : "collapsed"}
          transition={transition}
          onClick={() => {
            if (!isExpanded) handleExpand();
          }}
        >
          <div
            className={cn(
              "flex h-10 w-full items-center gap-2 rounded-full px-3.5 text-sm font-medium transition-[box-shadow] focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
              !isExpanded && "cursor-pointer",
              classNames?.trigger,
            )}
          >
            {/* Search Icon inside pill when collapsed */}
            {!isExpanded && (
              <span className="flex size-4 shrink-0 items-center justify-center text-background">
                <SearchIcon layoutId={iconLayoutId} />
              </span>
            )}

            {/* Real Search Input */}
            <input
              ref={inputRef}
              type="search"
              enterKeyHint="search"
              autoComplete="off"
              value={searchText}
              onChange={handleChange}
              onFocus={() => {
                if (!isExpanded) setExpanded(true);
              }}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setSearchText("");
                  setExpanded(false);
                  inputRef.current?.blur();
                }
              }}
              disabled={disabled || !isExpanded}
              placeholder={placeholder}
              className={cn(
                "h-full min-w-0 flex-1 bg-transparent text-sm leading-normal text-background outline-none",
                "[&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden",
                isExpanded
                  ? "cursor-text placeholder:text-background/50"
                  : "cursor-pointer pointer-events-none select-none placeholder:text-background/80",
                classNames?.input,
              )}
            />

            {/* Clear Input Button (visible when text is entered) */}
            <AnimatePresence>
              {isExpanded && searchText && (
                <motion.button
                  type="button"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSearchText("");
                    inputRef.current?.focus();
                  }}
                  className="flex size-4 shrink-0 items-center justify-center rounded-full text-background/60 hover:text-background focus:outline-none"
                  aria-label="Clear search input"
                >
                  <X className="size-3" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default GooeyInput;

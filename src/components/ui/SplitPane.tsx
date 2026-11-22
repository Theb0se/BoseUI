"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useId,
  forwardRef,
  Children,
  type ReactNode,
  type PointerEvent as ReactPointerEvent,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

// ============================================================================
// TYPES & PROPS
// ============================================================================

export type SplitDirection = "horizontal" | "vertical";

export interface SplitPaneProps {
  /**
   * Layout orientation of the split panes.
   * - "horizontal": Panes are placed side-by-side (left/right) with a vertical divider.
   * - "vertical": Panes are stacked (top/bottom) with a horizontal divider.
   * @default "horizontal"
   */
  direction?: SplitDirection;

  /**
   * Two child elements representing Pane A and Pane B, or an array of nodes.
   */
  children?: ReactNode;

  /**
   * Explicit array of pane nodes (alternative to children).
   */
  panes?: [ReactNode, ReactNode] | ReactNode[];

  /**
   * Initial size of the first pane (Pane A).
   * Can be a pixel number (e.g. 300) or a percentage string (e.g. "30%").
   * @default "50%"
   */
  defaultSize?: number | string;

  /**
   * Minimum allowable size for Pane A in pixels.
   * @default 120
   */
  minSize?: number;

  /**
   * Maximum allowable size for Pane A.
   * Can be a pixel number or percentage string (e.g. "80%").
   */
  maxSize?: number | string;

  /**
   * Minimum allowable size for Pane B in pixels.
   * @default 120
   */
  minSizeB?: number;

  /**
   * Whether Pane A can be collapsed.
   * Double-clicking the divider or pressing Enter will collapse or expand it.
   * @default false
   */
  collapsible?: boolean;

  /**
   * Size of Pane A in pixels when collapsed.
   * @default 0
   */
  collapsedSize?: number;

  /**
   * Container width breakpoint (in pixels) below which layout automatically
   * stacks vertically for responsive mobile screens.
   */
  responsiveBreakpoint?: number;

  /**
   * Callback fired continuously during divider dragging with the new size in pixels.
   */
  onResize?: (size: number) => void;

  /**
   * Callback fired when dragging completes and the pointer is released.
   */
  onResizeEnd?: (size: number) => void;

  /**
   * LocalStorage key used to persist the Pane A size between page sessions.
   */
  persistKey?: string;

  /**
   * Additional CSS class names for the outer container.
   */
  className?: string;

  /**
   * Additional CSS class names for Pane A.
   */
  paneAClassName?: string;

  /**
   * Additional CSS class names for Pane B.
   */
  paneBClassName?: string;

  /**
   * Additional CSS class names for the divider gutter.
   */
  dividerClassName?: string;
}

// ============================================================================
// HELPER UTILITIES
// ============================================================================

function parseDimension(
  val: number | string | undefined,
  containerTotal: number,
  fallback: number
): number {
  if (val === undefined) return fallback;
  if (typeof val === "number") return val;
  if (typeof val === "string" && val.endsWith("%")) {
    const percent = parseFloat(val);
    if (!isNaN(percent) && containerTotal > 0) {
      return (percent / 100) * containerTotal;
    }
  }
  const parsed = parseFloat(val);
  return isNaN(parsed) ? fallback : parsed;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const SplitPane = forwardRef<HTMLDivElement, SplitPaneProps>(
  function SplitPane(
    {
      direction = "horizontal",
      children,
      panes,
      defaultSize = "50%",
      minSize = 120,
      maxSize,
      minSizeB = 120,
      collapsible = false,
      collapsedSize = 0,
      responsiveBreakpoint,
      onResize,
      onResizeEnd,
      persistKey,
      className,
      paneAClassName,
      paneBClassName,
      dividerClassName,
    },
    forwardedRef
  ) {
    const shouldReduceMotion = useReducedMotion();
    const dividerId = useId();
    const paneAId = useId();
    const paneBId = useId();

    const containerRef = useRef<HTMLDivElement | null>(null);
    const [containerDimensions, setContainerDimensions] = useState<{
      width: number;
      height: number;
    }>({ width: 0, height: 0 });

    const [isDragging, setIsDragging] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Initial size ratio if specified as percentage
    const initialRatio = useRef<number | null>(
      typeof defaultSize === "string" && defaultSize.endsWith("%")
        ? parseFloat(defaultSize) / 100
        : null
    );

    const [size, setSize] = useState<number>(() => {
      if (typeof defaultSize === "number") return defaultSize;
      return 300;
    });

    const prevSizeBeforeCollapse = useRef<number>(size);
    const dragStartPos = useRef<number>(0);
    const dragStartSize = useRef<number>(size);

    // Responsive direction calculation
    const isMobileStacked = Boolean(
      responsiveBreakpoint &&
        containerDimensions.width > 0 &&
        containerDimensions.width < responsiveBreakpoint
    );

    const activeDirection: SplitDirection = isMobileStacked
      ? "vertical"
      : direction;
    const isHorizontal = activeDirection === "horizontal";

    const totalDimension = isHorizontal
      ? containerDimensions.width
      : containerDimensions.height;

    // Measure container size with ResizeObserver
    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      const observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const { width, height } = entry.contentRect;
          if (width > 0 && height > 0) {
            setContainerDimensions({ width, height });
          }
        }
      });

      observer.observe(container);
      return () => observer.disconnect();
    }, []);

    // Load persisted size on mount (SSR safe)
    useEffect(() => {
      if (!persistKey || typeof window === "undefined") return;
      try {
        const saved = localStorage.getItem(persistKey);
        if (saved !== null) {
          const parsed = parseFloat(saved);
          if (!isNaN(parsed) && parsed > 0) {
            setSize(parsed);
            prevSizeBeforeCollapse.current = parsed;
          }
        }
      } catch {
        // Safe access in sandboxed / private modes
      }
    }, [persistKey]);

    // Keep size proportional when container dimensions first initialize or resize
    useEffect(() => {
      if (totalDimension <= 0) return;

      if (initialRatio.current !== null && !persistKey) {
        const calculated = Math.round(totalDimension * initialRatio.current);
        const effectiveMax = totalDimension - minSizeB;
        const clamped = Math.max(minSize, Math.min(effectiveMax, calculated));
        setSize(clamped);
        prevSizeBeforeCollapse.current = clamped;
        initialRatio.current = null; // initialized
      }
    }, [totalDimension, minSize, minSizeB, persistKey]);

    // Calculate maximum allowable size for Pane A
    const effectiveMaxSize = Math.max(
      minSize,
      Math.min(
        maxSize !== undefined
          ? parseDimension(maxSize, totalDimension, totalDimension - minSizeB)
          : totalDimension - minSizeB,
        totalDimension - minSizeB
      )
    );

    // Save size to localStorage
    const saveSize = useCallback(
      (newSize: number) => {
        if (!persistKey || typeof window === "undefined") return;
        try {
          localStorage.setItem(persistKey, String(newSize));
        } catch {}
      },
      [persistKey]
    );

    // Clamp helper
    const clampSize = useCallback(
      (target: number): number => {
        if (isCollapsed) return collapsedSize;
        return Math.max(minSize, Math.min(effectiveMaxSize, target));
      },
      [isCollapsed, collapsedSize, minSize, effectiveMaxSize]
    );

    // Toggle collapse handler
    const toggleCollapse = useCallback(() => {
      if (!collapsible) return;

      if (isCollapsed) {
        // Expand
        const restored = Math.max(minSize, prevSizeBeforeCollapse.current);
        setIsCollapsed(false);
        setSize(restored);
        onResize?.(restored);
        onResizeEnd?.(restored);
        saveSize(restored);
      } else {
        // Collapse
        prevSizeBeforeCollapse.current = size;
        setIsCollapsed(true);
        setSize(collapsedSize);
        onResize?.(collapsedSize);
        onResizeEnd?.(collapsedSize);
        saveSize(collapsedSize);
      }
    }, [
      collapsible,
      isCollapsed,
      minSize,
      size,
      collapsedSize,
      onResize,
      onResizeEnd,
      saveSize,
    ]);

    // Pointer event handlers on divider
    const handlePointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.currentTarget.setPointerCapture(e.pointerId);

      setIsDragging(true);
      dragStartPos.current = isHorizontal ? e.clientX : e.clientY;
      dragStartSize.current = size;

      if (isCollapsed) {
        setIsCollapsed(false);
      }
    };

    const handlePointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
      if (!isDragging || totalDimension <= 0) return;

      const currentPos = isHorizontal ? e.clientX : e.clientY;
      const delta = currentPos - dragStartPos.current;
      const proposedSize = dragStartSize.current + delta;

      // Handle collapse snap threshold
      if (collapsible && proposedSize < minSize / 2) {
        if (!isCollapsed) {
          setIsCollapsed(true);
          setSize(collapsedSize);
          onResize?.(collapsedSize);
        }
        return;
      }

      if (isCollapsed && proposedSize >= minSize / 2) {
        setIsCollapsed(false);
      }

      const clamped = Math.max(minSize, Math.min(effectiveMaxSize, proposedSize));
      setSize(clamped);
      onResize?.(clamped);
    };

    const handlePointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
      if (!isDragging) return;
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {}

      setIsDragging(false);
      onResizeEnd?.(size);
      saveSize(size);
    };

    // Keyboard accessibility navigation
    const handleKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
      const step = e.shiftKey ? 50 : 10;
      let nextSize = size;
      let handled = false;

      if (
        (isHorizontal && e.key === "ArrowLeft") ||
        (!isHorizontal && e.key === "ArrowUp")
      ) {
        nextSize = clampSize(size - step);
        handled = true;
      } else if (
        (isHorizontal && e.key === "ArrowRight") ||
        (!isHorizontal && e.key === "ArrowDown")
      ) {
        if (isCollapsed) {
          setIsCollapsed(false);
          nextSize = minSize;
        } else {
          nextSize = clampSize(size + step);
        }
        handled = true;
      } else if (e.key === "Home") {
        nextSize = minSize;
        if (isCollapsed) setIsCollapsed(false);
        handled = true;
      } else if (e.key === "End") {
        nextSize = effectiveMaxSize;
        if (isCollapsed) setIsCollapsed(false);
        handled = true;
      } else if (e.key === "Enter") {
        if (collapsible) {
          toggleCollapse();
          handled = true;
        }
      }

      if (handled) {
        e.preventDefault();
        setSize(nextSize);
        onResize?.(nextSize);
        onResizeEnd?.(nextSize);
        saveSize(nextSize);
      }
    };

    // Extract exactly two panes from props.panes or children
    const resolvedPanes = panes ?? Children.toArray(children);
    const paneA = resolvedPanes[0] ?? (
      <div className="flex h-full w-full items-center justify-center p-4 text-xs text-neutral-400">
        Pane A
      </div>
    );
    const paneB = resolvedPanes[1] ?? (
      <div className="flex h-full w-full items-center justify-center p-4 text-xs text-neutral-400">
        Pane B
      </div>
    );

    // Compute display dimensions for Pane A
    const paneAStyle: React.CSSProperties = isHorizontal
      ? {
          width: isCollapsed ? collapsedSize : size,
          flexShrink: 0,
        }
      : {
          height: isCollapsed ? collapsedSize : size,
          flexShrink: 0,
        };

    return (
      <div
        ref={(el) => {
          containerRef.current = el;
          if (typeof forwardedRef === "function") forwardedRef(el);
          else if (forwardedRef) forwardedRef.current = el;
        }}
        className={cn(
          "relative flex h-full w-full overflow-hidden select-none bg-neutral-50 dark:bg-neutral-950",
          isHorizontal ? "flex-row" : "flex-col",
          isDragging &&
            (isHorizontal ? "cursor-col-resize" : "cursor-row-resize"),
          className
        )}
      >
        {/* Full-screen drag overlay to prevent iframe / selection hijacking */}
        {isDragging && (
          <div
            className={cn(
              "fixed inset-0 z-[9999] select-none",
              isHorizontal ? "cursor-col-resize" : "cursor-row-resize"
            )}
            style={{ userSelect: "none" }}
            aria-hidden="true"
          />
        )}

        {/* PANE A */}
        <div
          id={paneAId}
          style={paneAStyle}
          className={cn(
            "min-h-0 min-w-0 overflow-auto bg-white dark:bg-neutral-900 select-auto",
            !isDragging &&
              !shouldReduceMotion &&
              "transition-[width,height] duration-200 ease-out",
            isCollapsed && "overflow-hidden",
            paneAClassName
          )}
        >
          {paneA}
        </div>

        {/* DIVIDER GUTTER */}
        <div
          id={dividerId}
          role="separator"
          tabIndex={0}
          aria-orientation={isHorizontal ? "vertical" : "horizontal"}
          aria-valuenow={Math.round(size)}
          aria-valuemin={minSize}
          aria-valuemax={Math.round(effectiveMaxSize)}
          aria-controls={paneAId}
          aria-label={
            isHorizontal
              ? "Resize columns divider"
              : "Resize rows divider"
          }
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onDoubleClick={collapsible ? toggleCollapse : undefined}
          onKeyDown={handleKeyDown}
          className={cn(
            "group relative flex shrink-0 items-center justify-center outline-hidden touch-none select-none transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-teal-500/70 focus-visible:ring-offset-1 dark:focus-visible:ring-offset-neutral-900",
            isHorizontal
              ? "w-2 -mx-0.5 cursor-col-resize flex-col py-1"
              : "h-2 -my-0.5 cursor-row-resize flex-row px-1",
            isDragging && "bg-teal-500/10 dark:bg-teal-400/10",
            dividerClassName
          )}
        >
          {/* Subtle visible 1px line */}
          <div
            className={cn(
              "bg-neutral-200 dark:bg-neutral-800 transition-all duration-150 group-hover:bg-teal-500 dark:group-hover:bg-teal-400 group-focus-visible:bg-teal-500 dark:group-focus-visible:bg-teal-400",
              isHorizontal ? "h-full w-px" : "w-full h-px",
              (isDragging || isCollapsed) &&
                "bg-teal-500 dark:bg-teal-400 shadow-[0_0_8px_rgba(20,184,166,0.5)]"
            )}
          />

          {/* Centered Grip Handle */}
          <div
            className={cn(
              "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 shadow-xs opacity-50 group-hover:opacity-100 group-focus-visible:opacity-100 transition-all duration-150 flex items-center justify-center pointer-events-none",
              isHorizontal
                ? "py-1.5 px-0.5 flex-col gap-0.5"
                : "px-1.5 py-0.5 flex-row gap-0.5",
              isDragging &&
                "opacity-100 border-teal-500 text-teal-500 scale-105"
            )}
            aria-hidden="true"
          >
            <span
              className={cn(
                "h-0.5 w-0.5 rounded-full bg-neutral-400 dark:bg-neutral-500 transition-colors group-hover:bg-teal-500 dark:group-hover:bg-teal-400",
                isDragging && "bg-teal-500 dark:bg-teal-400"
              )}
            />
            <span
              className={cn(
                "h-0.5 w-0.5 rounded-full bg-neutral-400 dark:bg-neutral-500 transition-colors group-hover:bg-teal-500 dark:group-hover:bg-teal-400",
                isDragging && "bg-teal-500 dark:bg-teal-400"
              )}
            />
            <span
              className={cn(
                "h-0.5 w-0.5 rounded-full bg-neutral-400 dark:bg-neutral-500 transition-colors group-hover:bg-teal-500 dark:group-hover:bg-teal-400",
                isDragging && "bg-teal-500 dark:bg-teal-400"
              )}
            />
          </div>
        </div>

        {/* PANE B */}
        <div
          id={paneBId}
          className={cn(
            "min-h-0 min-w-0 flex-1 overflow-auto bg-white dark:bg-neutral-900 select-auto",
            paneBClassName
          )}
        >
          {paneB}
        </div>
      </div>
    );
  }
);

export default SplitPane;

"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export interface StickyPageItem {
  id?: string | number;
  title?: string;
  subtitle?: string;
  description?: string;
  badge?: string;
  content?: React.ReactNode;
  className?: string;
  bg?: string;
}

export interface StickyPagesProps extends React.HTMLAttributes<HTMLDivElement> {
  pages?: StickyPageItem[];
  /** Height of each sticky page. Default: "100vh" */
  pageHeight?: string;
  /** Distance from top of viewport (px) where page locks. Default: 0 */
  topOffset?: number;
  /** Progressive pixel offset between stacked cards. Default: 0 */
  stackOffset?: number;
  /** Rounded top corners on stacked pages. Default: true */
  rounded?: boolean;
  /** Drop shadow as each page covers the previous one. Default: true */
  shadow?: boolean;
  /** Subtle top highlight border. Default: true */
  border?: boolean;
  /** How much each covering card shrinks the one beneath (0.05 = 5%). Default: 0.05 */
  scaleStep?: number;
  /** Darken covered cards slightly. Default: true */
  dim?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export interface StickyPageProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
}

export const StickyPage: React.FC<StickyPageProps> = ({
  children,
  className,
  ...props
}) => (
  <div className={cn("relative h-full w-full", className)} {...props}>
    {children}
  </div>
);

interface StickyPageCardProps {
  index: number;
  topOffset: number;
  stackOffset: number;
  pageHeight: string;
  rounded: boolean;
  shadow: boolean;
  border: boolean;
  children: React.ReactNode;
  className?: string;
  bg?: string;
}

const StickyPageCard: React.FC<StickyPageCardProps> = ({
  index,
  topOffset,
  stackOffset,
  pageHeight,
  rounded,
  shadow,
  border,
  children,
  className,
  bg = "bg-[#090A0F]",
}) => {
  return (
    // Outer = sticky wrapper (never transformed)
    <div
      data-sticky-wrapper
      data-top={topOffset + index * stackOffset}
      style={{
        position: "sticky",
        top: `${topOffset + index * stackOffset}px`,
        height: pageHeight,
        zIndex: index + 1,
      }}
      className="w-full"
    >
      {/* Inner = the visual card that scales */}
      <div
        data-sticky-inner
        style={{ transformOrigin: "top center" }}
        className={cn(
          "relative h-full w-full overflow-hidden will-change-transform",
          index > 0 && rounded && "rounded-t-[2rem]",
          index > 0 && shadow && "shadow-[0_-20px_60px_rgba(0,0,0,0.5)]",
          index > 0 && border && "border-t border-white/10",
          bg,
          className
        )}
      >
        <div className="relative z-10 h-full w-full flex flex-col">
          {children}
        </div>
        {/* dim overlay */}
        <div
          data-sticky-dim
          className="pointer-events-none absolute inset-0 z-20 bg-black"
          style={{ opacity: 0 }}
        />
      </div>
    </div>
  );
};

export const StickyPages: React.FC<StickyPagesProps> = ({
  pages,
  pageHeight = "100vh",
  topOffset = 0,
  stackOffset = 0,
  rounded = true,
  shadow = true,
  border = true,
  scaleStep = 0.05,
  dim = true,
  className,
  children,
  ...props
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const childArray = React.Children.toArray(children);
  const isChildrenMode = childArray.length > 0;
  const total = isChildrenMode ? childArray.length : pages?.length || 0;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let raf = 0;

    const update = () => {
      raf = 0;
      const wrappers = Array.from(
        container.querySelectorAll<HTMLElement>("[data-sticky-wrapper]")
      );
      const vh = window.innerHeight;

      // progress[j] = how much card j has covered the card below it (0 -> 1)
      const progress = wrappers.map((w, j) => {
        if (j === 0) return 0;
        const stickyTop = Number(w.dataset.top || 0);
        const top = w.getBoundingClientRect().top;
        const p = (vh - top) / Math.max(vh - stickyTop, 1);
        return Math.min(Math.max(p, 0), 1);
      });

      wrappers.forEach((w, i) => {
        const inner = w.querySelector<HTMLElement>("[data-sticky-inner]");
        const overlay = w.querySelector<HTMLElement>("[data-sticky-dim]");
        if (!inner) return;

        // cumulative cover from every card after this one
        let cover = 0;
        for (let j = i + 1; j < wrappers.length; j++) cover += progress[j];

        const scale = 1 - cover * scaleStep;
        inner.style.transform = `scale(${scale})`;
        if (overlay && dim) {
          overlay.style.opacity = String(Math.min(cover * 0.15, 0.6));
        }
      });
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [total, scaleStep, dim, topOffset, stackOffset]);

  const common = { topOffset, stackOffset, pageHeight, rounded, shadow, border };

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full", className)}
      {...props}
    >
      {isChildrenMode &&
        childArray.map((child, idx) => (
          <StickyPageCard key={`sticky-page-${idx}`} index={idx} {...common}>
            {child}
          </StickyPageCard>
        ))}

      {!isChildrenMode &&
        pages?.map((page, idx) => (
          <StickyPageCard
            key={page.id || `sticky-page-${idx}`}
            index={idx}
            {...common}
            className={page.className}
            bg={page.bg}
          >
            {page.content ? (
              page.content
            ) : (
              <DefaultPageContent page={page} index={idx} total={total} />
            )}
          </StickyPageCard>
        ))}
    </div>
  );
};

const DefaultPageContent: React.FC<{
  page: StickyPageItem;
  index: number;
  total: number;
}> = ({ page, index, total }) => (
  <div className="flex flex-col items-center justify-center h-full px-6 sm:px-12 text-center max-w-4xl mx-auto">
    {page.badge && (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium text-sky-400 bg-sky-950/60 border border-sky-800/60 mb-6">
        {page.badge}
      </span>
    )}
    {page.subtitle && (
      <span className="text-xs uppercase font-mono tracking-widest text-slate-400 mb-2">
        {page.subtitle} • 0{index + 1} / 0{total}
      </span>
    )}
    {page.title && (
      <h2 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
        {page.title}
      </h2>
    )}
    {page.description && (
      <p className="mt-4 text-base sm:text-lg text-slate-400 max-w-xl">
        {page.description}
      </p>
    )}
  </div>
);

export const StickyStack = StickyPages;
export const StackingPages = StickyPages;

export default StickyPages;

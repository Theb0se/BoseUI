"use client";

import React, { useEffect, useState } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
  type TapInfo,
} from "framer-motion";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Types & Interfaces                                                 */
/* ------------------------------------------------------------------ */

export interface CylinderCardItem {
  id: string | number;
  title?: string;
  pill?: string;
  bg?: string;
  dark?: boolean;
  content?:
    | React.ReactNode
    | ((props: { active: boolean; index: number }) => React.ReactNode);
  Body?: (props: { active: boolean }) => React.ReactNode;
  children?: React.ReactNode;
}

export interface CylinderCarouselProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  /** Array of card items positioned around the 3D cylinder passed strictly via props */
  cards?: CylinderCardItem[];
  /** Optional alias for cards */
  items?: CylinderCardItem[];
  /** Card width in pixels. Default: 280 */
  cardWidth?: number;
  /** Card height in pixels. Default: 360 */
  cardHeight?: number;
  /** Spacing between adjacent cards on cylinder circumference. Default: 70 */
  gap?: number;
  /** CSS perspective value in pixels. Default: 1400 */
  perspective?: number;
  /** Initial selected card index. Default: 0 */
  initialIndex?: number;
  /** Spring stiffness coefficient for snap animation. Default: 120 */
  springStiffness?: number;
  /** Spring damping coefficient. Default: 20 */
  damping?: number;
  /** Spring mass coefficient. Default: 0.9 */
  mass?: number;
  /** Whether to render bottom chevron and dot controls. Default: true */
  showControls?: boolean;
  /** Whether to render the pagination dot indicators. Default: true */
  showDots?: boolean;
  className?: string;
  containerClassName?: string;
}

/* ------------------------------------------------------------------ */
/* Constants & Helpers                                                */
/* ------------------------------------------------------------------ */

export const DEFAULT_CYLINDER_BACKGROUNDS = [
  "radial-gradient(circle at 50% 55%, #17a2c8 0%, #6cc9a3 38%, #d5e59a 62%, #fbd3b6 88%)",
  "linear-gradient(160deg, #6d6cf5 0%, #c15cf0 45%, #f06bd0 100%)",
  "linear-gradient(180deg, #f7f8fa 0%, #eef0f4 100%)",
  "linear-gradient(165deg, #3ccfb4 0%, #6fd6e8 55%, #b6e7f7 100%)",
  "linear-gradient(165deg, #ff9a5a 0%, #ff7a8a 55%, #f4a6d0 100%)",
];

export function normaliseAngle(deg: number): number {
  return ((((deg + 180) % 360) + 360) % 360) - 180;
}

export function CylinderPill({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-[11px] font-medium text-neutral-800 shadow-sm",
        className
      )}
    >
      {label}
      <svg
        viewBox="0 0 10 6"
        className="h-1.5 w-2 fill-none stroke-current"
        strokeWidth="1.5"
        aria-hidden="true"
      >
        <path d="M1 1l4 4 4-4" />
      </svg>
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* CylinderCard Subcomponent                                          */
/* ------------------------------------------------------------------ */

interface CylinderCardProps {
  card: CylinderCardItem;
  index: number;
  step: number;
  radius: number;
  cardWidth: number;
  cardHeight: number;
  rotation: MotionValue<number>;
  active: boolean;
  onSelect: () => void;
}

function CylinderCard({
  card,
  index,
  step,
  radius,
  cardWidth,
  cardHeight,
  rotation,
  active,
  onSelect,
}: CylinderCardProps) {
  const angle = (r: number) => normaliseAngle(index * step + r);

  const transform = useTransform(
    rotation,
    (r) => `rotateY(${angle(r)}deg) translateZ(${radius}px)`
  );
  const filter = useTransform(rotation, (r) => {
    const t = Math.min(Math.abs(angle(r)) / step, 2);
    return `blur(${(t * 3.2).toFixed(2)}px) saturate(${(1 - t * 0.15).toFixed(2)})`;
  });
  const opacity = useTransform(rotation, (r) => {
    const t = Math.min(Math.abs(angle(r)) / step, 3);
    return Math.max(0, 1 - Math.max(0, t - 1) * 0.55);
  });
  const sheen = useTransform(rotation, (r) =>
    Math.min(Math.abs(angle(r)) / step, 1) * 0.55
  );

  const bg =
    card.bg ||
    DEFAULT_CYLINDER_BACKGROUNDS[
      index % DEFAULT_CYLINDER_BACKGROUNDS.length
    ];

  const renderContent = () => {
    if (typeof card.content === "function") {
      return card.content({ active, index });
    }
    if (card.content) {
      return card.content;
    }
    if (typeof card.Body === "function") {
      return <card.Body active={active} />;
    }
    if (card.children) {
      return card.children;
    }
    return null;
  };

  const hasHeader = Boolean(card.title || card.pill);

  return (
    <motion.div
      role="group"
      aria-roledescription="slide"
      aria-label={card.title || `Card ${index + 1}`}
      onClick={onSelect}
      style={{
        width: cardWidth,
        height: cardHeight,
        transform,
        filter,
        opacity,
        background: bg,
      }}
      className="absolute left-0 top-0 cursor-grab select-none overflow-hidden rounded-[22px] shadow-[0_20px_50px_-20px_rgba(30,40,70,0.35)] [backface-visibility:hidden] active:cursor-grabbing"
    >
      {/* header */}
      {hasHeader && (
        <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-5 pt-5">
          {card.title && (
            <p
              className={cn(
                "text-sm font-medium",
                card.dark ? "text-neutral-900" : "text-white"
              )}
            >
              {card.title}
            </p>
          )}
          {card.pill && <CylinderPill label={card.pill} />}
        </div>
      )}

      {/* body */}
      <div className={cn("absolute inset-0", hasHeader ? "pt-12" : "p-4")}>
        {renderContent()}
      </div>

      {/* progress dash, bottom centre */}
      <div
        className={cn(
          "absolute bottom-4 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full",
          card.dark ? "bg-neutral-900" : "bg-white"
        )}
      />

      {/* white sheen that grows as the card turns away */}
      <motion.div
        aria-hidden="true"
        style={{ opacity: sheen }}
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/70 via-white/10 to-white/70"
      />
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* CylinderCarousel Main Component                                    */
/* ------------------------------------------------------------------ */

export function CylinderCarousel({
  cards,
  items,
  cardWidth = 280,
  cardHeight = 360,
  gap = 70,
  perspective = 1400,
  initialIndex = 0,
  springStiffness = 120,
  damping = 20,
  mass = 0.9,
  showControls = true,
  showDots = true,
  className,
  containerClassName,
  ...props
}: CylinderCarouselProps) {
  const cardList = cards || items || [];
  const reduceMotion = useReducedMotion();
  const count = cardList.length;

  const step = 360 / Math.max(count, 1);
  const radius =
    count > 2
      ? (cardWidth + gap) / (2 * Math.tan(Math.PI / count))
      : cardWidth + gap;

  const rotation = useMotionValue(-initialIndex * step);
  const [index, setIndex] = useState(initialIndex);
  const activeCard = count > 0 ? ((index % count) + count) % count : 0;

  const goTo = (i: number) => {
    setIndex(i);
    animate(
      rotation,
      -i * step,
      reduceMotion
        ? { duration: 0.01 }
        : { type: "spring", stiffness: springStiffness, damping, mass }
    );
  };

  // keyboard support
  useEffect(() => {
    if (count === 0) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goTo(index + 1);
      if (e.key === "ArrowLeft") goTo(index - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, step, count]);

  if (count === 0) {
    return null;
  }

  return (
    <section
      className={cn(
        "relative flex min-h-[560px] w-full flex-col items-center justify-center overflow-hidden bg-[#e4e7ec] dark:bg-[#0c0d0e] py-14 transition-colors",
        className
      )}
      {...props}
    >
      <div
        className={cn("relative w-full touch-pan-y", containerClassName)}
        style={{ height: cardHeight + 80, perspective }}
      >
        {/* drag surface */}
        <motion.div
          className="absolute inset-0 z-20 cursor-grab active:cursor-grabbing"
          onPan={(_, info) => {
            rotation.stop();
            rotation.set(rotation.get() + info.delta.x * 0.32);
          }}
          onPanEnd={(_, info) => {
            const projected = rotation.get() + info.velocity.x * 0.04;
            goTo(Math.round(-projected / step));
          }}
          onTap={(event, info: TapInfo) => {
            const el = event.currentTarget as HTMLElement | null;
            if (!el) return;
            const rect = el.getBoundingClientRect();
            const x = info.point.x - rect.left;
            if (x < rect.width * 0.3) goTo(index - 1);
            else if (x > rect.width * 0.7) goTo(index + 1);
          }}
          aria-hidden="true"
        />

        {/* 3D cylinder stage */}
        <div
          className="absolute left-1/2 top-1/2"
          style={{
            width: cardWidth,
            height: cardHeight,
            marginLeft: -cardWidth / 2,
            marginTop: -cardHeight / 2,
            transformStyle: "preserve-3d",
            transform: `translateZ(${-radius}px)`,
          }}
        >
          {cardList.map((card, i) => (
            <CylinderCard
              key={card.id ?? i}
              card={card}
              index={i}
              step={step}
              radius={radius}
              cardWidth={cardWidth}
              cardHeight={cardHeight}
              rotation={rotation}
              active={i === activeCard}
              onSelect={() => {
                const diff = normaliseAngle((i - activeCard) * step) / step;
                goTo(index + Math.round(diff));
              }}
            />
          ))}
        </div>
      </div>

      {/* controls */}
      {showControls && (
        <div className="mt-8 flex items-center gap-4 z-30">
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            aria-label="Previous card"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-neutral-800 shadow-sm transition hover:bg-white dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
          >
            <svg
              viewBox="0 0 8 12"
              className="h-3 w-2 fill-none stroke-current"
              strokeWidth="1.6"
              aria-hidden="true"
            >
              <path d="M6 1L1.5 6 6 11" />
            </svg>
          </button>

          {showDots && (
            <div className="flex items-center gap-2">
              {cardList.map((c, i) => (
                <button
                  type="button"
                  key={c.id ?? i}
                  aria-label={`Go to ${c.title || `Card ${i + 1}`}`}
                  onClick={() =>
                    goTo(
                      index +
                        Math.round(normaliseAngle((i - activeCard) * step) / step)
                    )
                  }
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    i === activeCard
                      ? "w-6 bg-neutral-900 dark:bg-white"
                      : "w-1.5 bg-neutral-400 dark:bg-neutral-600 hover:bg-neutral-600 dark:hover:bg-neutral-400"
                  )}
                />
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={() => goTo(index + 1)}
            aria-label="Next card"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-neutral-800 shadow-sm transition hover:bg-white dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
          >
            <svg
              viewBox="0 0 8 12"
              className="h-3 w-2 fill-none stroke-current"
              strokeWidth="1.6"
              aria-hidden="true"
            >
              <path d="M2 1l4.5 5L2 11" />
            </svg>
          </button>
        </div>
      )}
    </section>
  );
}

export default CylinderCarousel;

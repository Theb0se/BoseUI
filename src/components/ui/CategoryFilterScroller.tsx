"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Flame,
  Palmtree,
  Home,
  Waves,
  MountainSnow,
  TreePine,
  Castle,
  Tent,
  Sun,
  Sparkles,
  Building,
  Coffee,
  SlidersHorizontal,
  Compass,
  Star,
  Heart,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface CategoryItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  tagline: string;
  badge?: string;
}

export interface CategoryFilterScrollerProps {
  /** Initial selected category ID */
  defaultCategory?: string;
  /** Callback on category select */
  onSelectCategory?: (category: CategoryItem) => void;
  /** Extra container className */
  className?: string;
}

const CATEGORIES: CategoryItem[] = [
  { id: "trending", label: "Trending", icon: Flame, tagline: "Most booked destinations worldwide", badge: "Hot" },
  { id: "beachfront", label: "Beachfront", icon: Waves, tagline: "Steps away from white sand & turquoise water" },
  { id: "cabins", label: "Cabins", icon: Home, tagline: "Secluded wood cabins with wood stoves" },
  { id: "mansions", label: "Mansions", icon: Building, tagline: "Luxury estates with private infinity pools" },
  { id: "lakefront", label: "Lakefront", icon: Compass, tagline: "Private docks and calm morning waters" },
  { id: "tiny-homes", label: "Tiny homes", icon: Sparkles, tagline: "Architectural wonders in compact footprints" },
  { id: "islands", label: "Islands", icon: Palmtree, tagline: "Exclusive private island sanctuaries" },
  { id: "skiing", label: "Ski-in/out", icon: MountainSnow, tagline: "Direct alpine access on premier peaks" },
  { id: "treehouses", label: "Treehouses", icon: TreePine, tagline: "Canopy living nestled high in old-growth pine" },
  { id: "castles", label: "Castles", icon: Castle, tagline: "Historic stone towers and royal countryside keeps" },
  { id: "camping", label: "Camping", icon: Tent, tagline: "Luxury yurt and geodesic dome glamping" },
  { id: "desert", label: "Desert", icon: Sun, tagline: "Stargazing retreats in Joshua Tree and Sedona" },
  { id: "bed-breakfast", label: "B & B", icon: Coffee, tagline: "Charming countryside homesteads with breakfast" },
];

const CATEGORY_SHOWCASES: Record<
  string,
  Array<{
    id: string;
    title: string;
    location: string;
    price: string;
    rating: number;
    dates: string;
    gradient: string;
  }>
> = {
  trending: [
    { id: "t1", title: "Glass Pavilion Over Sea", location: "Positano, Italy", price: "$520", rating: 4.97, dates: "May 12–17", gradient: "from-blue-600/40 via-sky-500/30 to-amber-200/20" },
    { id: "t2", title: "Nordic Minimalist Fjord", location: "Bergen, Norway", price: "$340", rating: 4.99, dates: "Jun 1–6", gradient: "from-slate-700/50 via-teal-800/30 to-emerald-900/20" },
    { id: "t3", title: "High-Desert Mirrored Cube", location: "Sedona, AZ", price: "$410", rating: 4.95, dates: "Apr 20–25", gradient: "from-amber-600/40 via-rose-600/30 to-indigo-900/30" },
  ],
  beachfront: [
    { id: "b1", title: "Bioluminescent Lagoon Villa", location: "Vieques, Puerto Rico", price: "$640", rating: 4.98, dates: "Jul 4–9", gradient: "from-cyan-600/40 via-teal-500/30 to-emerald-400/20" },
    { id: "b2", title: "Overwater Bungalow", location: "Bora Bora, French Polynesia", price: "$1,120", rating: 5.0, dates: "Aug 15–20", gradient: "from-blue-500/40 via-cyan-400/30 to-sky-200/20" },
    { id: "b3", title: "Sunset Cliffside Bungalow", location: "Santorini, Greece", price: "$590", rating: 4.94, dates: "Sep 2–7", gradient: "from-sky-700/50 via-indigo-600/30 to-rose-300/20" },
  ],
  cabins: [
    { id: "c1", title: "Whispering Pines A-Frame", location: "Mount Rainier, WA", price: "$280", rating: 4.96, dates: "Jun 10–15", gradient: "from-emerald-800/50 via-amber-900/30 to-stone-800/40" },
    { id: "c2", title: "Nordic Cedar Sauna Haven", location: "Lapland, Finland", price: "$390", rating: 4.99, dates: "Dec 3–8", gradient: "from-blue-900/50 via-slate-800/40 to-cyan-900/30" },
    { id: "c3", title: "Redwood Ridge Hideout", location: "Big Sur, CA", price: "$440", rating: 4.92, dates: "May 22–27", gradient: "from-orange-800/40 via-amber-700/30 to-stone-900/30" },
  ],
};

export function CategoryFilterScroller({
  defaultCategory = "trending",
  onSelectCategory,
  className,
}: CategoryFilterScrollerProps) {
  const [selectedId, setSelectedId] = useState(defaultCategory);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const activeCategory = CATEGORIES.find((c) => c.id === selectedId) || CATEGORIES[0];

  const checkScrollBounds = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 6);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 6);
  }, []);

  useEffect(() => {
    checkScrollBounds();
    const el = scrollContainerRef.current;
    if (!el) return;

    el.addEventListener("scroll", checkScrollBounds, { passive: true });
    window.addEventListener("resize", checkScrollBounds);

    return () => {
      el.removeEventListener("scroll", checkScrollBounds);
      window.removeEventListener("resize", checkScrollBounds);
    };
  }, [checkScrollBounds]);

  const scrollByOffset = (direction: "left" | "right") => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const offset = direction === "left" ? -280 : 280;
    el.scrollBy({ left: offset, behavior: "smooth" });
  };

  const handleSelect = (category: CategoryItem) => {
    setSelectedId(category.id);
    onSelectCategory?.(category);
  };

  const toggleFavorite = (cardId: string) => {
    setFavorites((prev) => ({ ...prev, [cardId]: !prev[cardId] }));
  };

  const showcaseCards = CATEGORY_SHOWCASES[selectedId] || CATEGORY_SHOWCASES.trending;

  return (
    <div
      data-fullscreen-scroll
      className={cn(
        "relative flex min-h-[520px] w-full flex-col justify-between overflow-hidden rounded-2xl border border-neutral-200 bg-white p-4 sm:p-8 dark:border-neutral-800 dark:bg-neutral-950",
        className
      )}
    >
      {/* Header bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200">
            <Compass className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
                Airbnb Category Filter Scroller
              </span>
              <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
                {CATEGORIES.length} Categories
              </span>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Edge fade masks, spring active underline, and tactile scroll navigation
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowFilterDrawer(!showFilterDrawer)}
          className={cn(
            "flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-medium transition shadow-xs",
            showFilterDrawer
              ? "border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900"
              : "border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
          )}
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          <span>Filters</span>
        </button>
      </div>

      {/* Main Filter Scroller Bar */}
      <div className="relative z-10 my-2 w-full">
        {/* Left Scroll Button */}
        <AnimatePresence>
          {canScrollLeft && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
              className="absolute -left-2 top-1/2 z-30 -translate-y-1/2 sm:-left-3"
            >
              <button
                type="button"
                onClick={() => scrollByOffset("left")}
                aria-label="Scroll left"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-300 bg-white text-neutral-700 shadow-md transition hover:scale-105 hover:bg-neutral-50 active:scale-95 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Left edge fade mask */}
        {canScrollLeft && (
          <div className="pointer-events-none absolute bottom-0 left-0 top-0 z-20 w-12 bg-gradient-to-r from-white via-white/80 to-transparent dark:from-neutral-950 dark:via-neutral-950/80" />
        )}

        {/* Scroll Container */}
        <div
          ref={scrollContainerRef}
          className="no-scrollbar flex items-center gap-6 overflow-x-auto scroll-smooth px-3 py-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = cat.id === selectedId;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleSelect(cat)}
                className={cn(
                  "group relative flex shrink-0 cursor-pointer flex-col items-center gap-1.5 pb-2.5 pt-1 text-center transition focus-visible:outline-none",
                  isSelected
                    ? "text-neutral-900 dark:text-white font-semibold"
                    : "text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200 font-medium"
                )}
              >
                <div className="relative">
                  <Icon
                    className={cn(
                      "h-6 w-6 transition-transform duration-200 group-hover:scale-110",
                      isSelected ? "scale-105" : "opacity-80 group-hover:opacity-100"
                    )}
                  />
                  {cat.badge && (
                    <span className="absolute -right-2 -top-1 rounded-full bg-rose-500 px-1 text-[8px] font-bold text-white uppercase leading-tight">
                      {cat.badge}
                    </span>
                  )}
                </div>

                <span className="text-[11px] whitespace-nowrap tracking-tight">
                  {cat.label}
                </span>

                {/* Sliding active underline indicator */}
                {isSelected && (
                  <motion.div
                    layoutId="category-underline"
                    transition={{ type: "spring", stiffness: 450, damping: 35 }}
                    className="absolute -bottom-0.5 inset-x-0 h-0.5 rounded-full bg-neutral-900 dark:bg-white"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Right edge fade mask */}
        {canScrollRight && (
          <div className="pointer-events-none absolute bottom-0 right-0 top-0 z-20 w-12 bg-gradient-to-l from-white via-white/80 to-transparent dark:from-neutral-950 dark:via-neutral-950/80" />
        )}

        {/* Right Scroll Button */}
        <AnimatePresence>
          {canScrollRight && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
              className="absolute -right-2 top-1/2 z-30 -translate-y-1/2 sm:-right-3"
            >
              <button
                type="button"
                onClick={() => scrollByOffset("right")}
                aria-label="Scroll right"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-300 bg-white text-neutral-700 shadow-md transition hover:scale-105 hover:bg-neutral-50 active:scale-95 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Filter drawer preview (interactive toggle) */}
      <AnimatePresence>
        {showFilterDrawer && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="relative z-20 my-2 overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-900"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-200 pb-2.5 dark:border-neutral-800">
              <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                Filter by Type &amp; Amenities
              </span>
              <button
                type="button"
                onClick={() => setShowFilterDrawer(false)}
                className="text-xs text-rose-500 hover:underline"
              >
                Close
              </button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {["Superhost", "Self check-in", "Free Wi-Fi", "Dedicated workspace", "Pool", "Hot tub", "Pet friendly"].map(
                (filter, idx) => (
                  <span
                    key={idx}
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-neutral-300 bg-white px-3 py-1 text-xs text-neutral-700 hover:border-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:border-white"
                  >
                    <Check className="h-3 w-3 text-neutral-400" />
                    <span>{filter}</span>
                  </span>
                )
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selected Category Showcase Area */}
      <div className="relative z-10 mt-4 flex flex-1 flex-col justify-center">
        <div className="mb-3 flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
              Showing {activeCategory.label}
            </h3>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
              {activeCategory.tagline}
            </p>
          </div>
          <span className="font-mono text-[10px] text-neutral-400">
            {showcaseCards.length} verified stays
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
          {showcaseCards.map((card) => {
            const isFav = !!favorites[card.id];
            return (
              <div
                key={card.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-neutral-200/90 bg-white p-3 shadow-xs transition-all hover:shadow-md dark:border-neutral-800/90 dark:bg-neutral-900"
              >
                {/* Visual Thumbnail */}
                <div
                  className={cn(
                    "relative h-28 w-full overflow-hidden rounded-xl bg-gradient-to-br transition group-hover:scale-[1.02]",
                    card.gradient
                  )}
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(card.id);
                    }}
                    aria-label="Save to favorites"
                    className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition hover:scale-110 active:scale-90"
                  >
                    <Heart
                      className={cn(
                        "h-4 w-4 transition-colors",
                        isFav ? "fill-rose-500 text-rose-500" : "text-white"
                      )}
                    />
                  </button>
                </div>

                {/* Card Details */}
                <div className="mt-2.5">
                  <div className="flex items-center justify-between">
                    <span className="truncate text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                      {card.location}
                    </span>
                    <div className="flex items-center gap-1 font-mono text-[11px] font-medium text-neutral-600 dark:text-neutral-300">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span>{card.rating.toFixed(2)}</span>
                    </div>
                  </div>
                  <p className="line-clamp-1 text-[11px] text-neutral-500 dark:text-neutral-400">
                    {card.title}
                  </p>
                  <p className="text-[10px] text-neutral-400 dark:text-neutral-500">
                    {card.dates}
                  </p>
                </div>

                <div className="mt-2 border-t border-neutral-100 pt-2 flex items-baseline gap-1 dark:border-neutral-800">
                  <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                    {card.price}
                  </span>
                  <span className="text-[10px] text-neutral-500">/ night</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer quick category switch buttons */}
      <div className="relative z-10 mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-neutral-200/80 pt-3 dark:border-neutral-800/80">
        <span className="text-xs text-neutral-500">Jump directly to:</span>
        <div className="flex flex-wrap gap-1.5">
          {["beachfront", "cabins", "islands", "skiing"].map((catId) => {
            const target = CATEGORIES.find((c) => c.id === catId);
            if (!target) return null;
            return (
              <button
                key={catId}
                type="button"
                onClick={() => handleSelect(target)}
                className="rounded-md border border-neutral-200 bg-neutral-50 px-2 py-0.5 text-[11px] font-medium text-neutral-700 transition hover:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                {target.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default CategoryFilterScroller;

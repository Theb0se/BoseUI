"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MapPin,
  Calendar,
  Users,
  X,
  ChevronRight,
  Sparkles,
  SlidersHorizontal,
  Plus,
  Minus,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type SearchSegment = "where" | "when" | "who" | null;

export interface SearchState {
  destination: string;
  dateRange: string;
  adults: number;
  children: number;
  infants: number;
}

export interface ExpandingSearchPillProps {
  /** Initial destination query */
  initialDestination?: string;
  /** Initial date selection */
  initialDateRange?: string;
  /** Initial guest count */
  initialAdults?: number;
  /** Callback on search submission */
  onSearch?: (state: SearchState) => void;
  /** Whether the search pill is embedded in a modal or navbar without full background presentation */
  embedded?: boolean;
  /** Extra container className */
  className?: string;
}

const DESTINATION_PRESETS = [
  { id: "flexible", label: "I'm Flexible", icon: Sparkles, hint: "Anywhere in the world" },
  { id: "kyoto", label: "Kyoto, Japan", icon: MapPin, hint: "Historic shrines & bamboo groves" },
  { id: "amalfi", label: "Amalfi Coast, Italy", icon: MapPin, hint: "Cliffside ocean villas" },
  { id: "aspen", label: "Aspen, Colorado", icon: MapPin, hint: "Cozy mountain lodges & ski chalets" },
  { id: "paris", label: "Paris, France", icon: MapPin, hint: "Haussmannian apartments & bistros" },
];

const DATE_PRESETS = [
  { id: "anytime", label: "Anytime", desc: "Flexible travel dates" },
  { id: "weekend", label: "This Weekend", desc: "Fri - Sun getaways" },
  { id: "week", label: "1 Week in July", desc: "Midsummer retreat" },
  { id: "autumn", label: "Autumn Foliage", desc: "Oct 12 - Oct 19" },
];

const SAMPLE_LISTINGS = [
  {
    title: "Panoramic Villa overlooking Mediterranean",
    location: "Amalfi Coast, Italy",
    rating: 4.98,
    price: "$480 / night",
    tag: "Superhost",
    imageBg: "from-blue-600/40 via-sky-500/20 to-teal-400/30",
  },
  {
    title: "Traditional Machiya Zen Sanctuary",
    location: "Kyoto, Japan",
    rating: 4.96,
    price: "$295 / night",
    tag: "Guest favorite",
    imageBg: "from-amber-700/40 via-stone-800/30 to-rose-900/30",
  },
  {
    title: "A-Frame Snow Chalet with Private Hot Tub",
    location: "Aspen, Colorado",
    rating: 4.99,
    price: "$620 / night",
    tag: "Rare find",
    imageBg: "from-indigo-950/50 via-slate-800/40 to-blue-900/30",
  },
];

export function ExpandingSearchPill({
  initialDestination = "Anywhere",
  initialDateRange = "Any week",
  initialAdults = 1,
  onSearch,
  embedded = false,
  className,
}: ExpandingSearchPillProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeSegment, setActiveSegment] = useState<SearchSegment>(null);

  const [destination, setDestination] = useState(initialDestination);
  const [dateRange, setDateRange] = useState(initialDateRange);
  const [adults, setAdults] = useState(initialAdults);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);

  const totalGuests = adults + children + infants;
  const guestSummary =
    totalGuests === 0
      ? "Add guests"
      : `${totalGuests} guest${totalGuests > 1 ? "s" : ""}${infants > 0 ? `, ${infants} infant` : ""}`;

  const destinationSummary = destination.trim() || "Anywhere";
  const dateSummary = dateRange.trim() || "Any week";

  const handleOpenSegment = (seg: SearchSegment) => {
    setIsExpanded(true);
    setActiveSegment(seg);
  };

  const handleApplySearch = () => {
    setIsExpanded(false);
    setActiveSegment(null);
    onSearch?.({
      destination: destinationSummary,
      dateRange: dateSummary,
      adults,
      children,
      infants,
    });
  };

  const handleReset = () => {
    setDestination("Anywhere");
    setDateRange("Any week");
    setAdults(1);
    setChildren(0);
    setInfants(0);
    setActiveSegment(null);
    setIsExpanded(false);
  };

  const applyPreset = (dest: string, dates: string, numGuests: number) => {
    setDestination(dest);
    setDateRange(dates);
    setAdults(numGuests);
    setChildren(0);
    setInfants(0);
    setIsExpanded(false);
    setActiveSegment(null);
  };

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
        setActiveSegment(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const pillWidget = (
    <div ref={containerRef} className="relative w-full max-w-3xl">
      {/* COMPACT PILL MODE */}
      {!isExpanded && (
        <motion.div
          layoutId="search-pill-container"
          transition={{ type: "spring", stiffness: 450, damping: 35 }}
          className="mx-auto flex w-full max-w-lg cursor-pointer items-center justify-between rounded-full border border-neutral-300/80 bg-white p-2 shadow-lg shadow-neutral-950/5 transition-all hover:border-neutral-400 hover:shadow-xl dark:border-neutral-700/80 dark:bg-neutral-900 dark:shadow-black/40 dark:hover:border-neutral-600"
          onClick={() => handleOpenSegment("where")}
          role="button"
          tabIndex={0}
          aria-label="Search destinations, dates, and guests"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleOpenSegment("where");
            }
          }}
        >
          {/* Segment 1: Destination */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleOpenSegment("where");
            }}
            className="flex flex-1 items-center px-4 text-left transition hover:opacity-80"
          >
            <span className="truncate text-xs font-semibold text-neutral-900 dark:text-neutral-100">
              {destinationSummary}
            </span>
          </button>

          <div className="h-4 w-px bg-neutral-200 dark:bg-neutral-700" />

          {/* Segment 2: Dates */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleOpenSegment("when");
            }}
            className="flex flex-1 items-center px-4 text-left transition hover:opacity-80"
          >
            <span className="truncate text-xs font-medium text-neutral-600 dark:text-neutral-300">
              {dateSummary}
            </span>
          </button>

          <div className="h-4 w-px bg-neutral-200 dark:bg-neutral-700" />

          {/* Segment 3: Guests */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleOpenSegment("who");
            }}
            className="flex flex-1 items-center px-4 text-left transition hover:opacity-80"
          >
            <span className="truncate text-xs text-neutral-500 dark:text-neutral-400">
              {guestSummary}
            </span>
          </button>

          {/* Action Button */}
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-rose-500 text-white shadow-md shadow-rose-500/30 transition hover:bg-rose-600 active:scale-95">
            <Search className="h-4 w-4" />
          </div>
        </motion.div>
      )}

      {/* EXPANDED MULTI-SEGMENT SEARCH BAR */}
      {isExpanded && (
        <motion.div
          layoutId="search-pill-container"
          transition={{ type: "spring", stiffness: 450, damping: 35 }}
          className="relative mx-auto flex w-full flex-col rounded-3xl border border-neutral-300/90 bg-white/95 p-2 shadow-2xl shadow-neutral-950/15 backdrop-blur-xl dark:border-neutral-700/80 dark:bg-neutral-900/95 dark:shadow-black/70"
        >
          {/* Top Navigation Row */}
          <div className="flex flex-wrap items-center justify-between border-b border-neutral-100 px-3 py-2 dark:border-neutral-800">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-500 dark:text-neutral-400">
              <span className="inline-block h-2 w-2 rounded-full bg-rose-500" />
              <span>Stays &amp; Experiences</span>
            </div>
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className="rounded-full p-1 text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
              aria-label="Close search"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Multi-segment Selector Bar */}
          <div className="relative mt-2 flex flex-col items-stretch gap-1 sm:flex-row sm:items-center sm:gap-0">
            {/* Segment: Where */}
            <button
              type="button"
              onClick={() => setActiveSegment("where")}
              className={cn(
                "relative z-10 flex flex-1 flex-col rounded-2xl px-5 py-3 text-left transition-colors",
                activeSegment === "where"
                  ? "bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-white"
                  : "hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
              )}
            >
              <span className="text-[10px] font-semibold tracking-wider uppercase text-neutral-500 dark:text-neutral-400">
                Where
              </span>
              <input
                type="text"
                value={destination === "Anywhere" ? "" : destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Search destinations"
                className="mt-0.5 w-full bg-transparent text-xs font-semibold text-neutral-900 placeholder:text-neutral-400 focus:outline-none dark:text-white"
              />
            </button>

            <div className="hidden h-8 w-px bg-neutral-200 sm:block dark:bg-neutral-700" />

            {/* Segment: When */}
            <button
              type="button"
              onClick={() => setActiveSegment("when")}
              className={cn(
                "relative z-10 flex flex-1 flex-col rounded-2xl px-5 py-3 text-left transition-colors",
                activeSegment === "when"
                  ? "bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-white"
                  : "hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
              )}
            >
              <span className="text-[10px] font-semibold tracking-wider uppercase text-neutral-500 dark:text-neutral-400">
                When
              </span>
              <span className="mt-0.5 truncate text-xs font-semibold text-neutral-900 dark:text-white">
                {dateRange || "Add dates"}
              </span>
            </button>

            <div className="hidden h-8 w-px bg-neutral-200 sm:block dark:bg-neutral-700" />

            {/* Segment: Who */}
            <button
              type="button"
              onClick={() => setActiveSegment("who")}
              className={cn(
                "relative z-10 flex flex-1 flex-col rounded-2xl px-5 py-3 text-left transition-colors",
                activeSegment === "who"
                  ? "bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-white"
                  : "hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
              )}
            >
              <span className="text-[10px] font-semibold tracking-wider uppercase text-neutral-500 dark:text-neutral-400">
                Who
              </span>
              <span className="mt-0.5 truncate text-xs font-semibold text-neutral-900 dark:text-white">
                {guestSummary}
              </span>
            </button>

            {/* Search CTA */}
            <div className="p-1 sm:p-2">
              <button
                type="button"
                onClick={handleApplySearch}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-rose-500 px-5 py-3 text-xs font-semibold text-white shadow-lg shadow-rose-500/30 transition hover:bg-rose-600 active:scale-95 sm:w-auto"
              >
                <Search className="h-4 w-4" />
                <span>Search</span>
              </button>
            </div>
          </div>

          {/* POPUP / SHEET CONTENT ACCORDING TO ACTIVE SEGMENT */}
          <AnimatePresence mode="wait">
            {activeSegment === "where" && (
              <motion.div
                key="where-sheet"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                transition={{ duration: 0.18 }}
                className="mt-3 rounded-2xl border border-neutral-200 bg-neutral-50/80 p-4 dark:border-neutral-800 dark:bg-neutral-950/60"
              >
                <div className="mb-2 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Search by region or vibe
                </div>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {DESTINATION_PRESETS.map((item) => {
                    const Icon = item.icon;
                    const isSelected = destination === item.label;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setDestination(item.label);
                          setActiveSegment("when");
                        }}
                        className={cn(
                          "flex items-center gap-3 rounded-xl border p-2.5 text-left transition",
                          isSelected
                            ? "border-rose-500/50 bg-rose-500/10 dark:bg-rose-500/20"
                            : "border-neutral-200 bg-white hover:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:bg-neutral-800"
                        )}
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="truncate text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                            {item.label}
                          </div>
                          <div className="truncate text-[10px] text-neutral-500 dark:text-neutral-400">
                            {item.hint}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {activeSegment === "when" && (
              <motion.div
                key="when-sheet"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                transition={{ duration: 0.18 }}
                className="mt-3 rounded-2xl border border-neutral-200 bg-neutral-50/80 p-4 dark:border-neutral-800 dark:bg-neutral-950/60"
              >
                <div className="mb-2 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Choose your time frame
                </div>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {DATE_PRESETS.map((preset) => {
                    const isSelected = dateRange === preset.label;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => {
                          setDateRange(preset.label);
                          setActiveSegment("who");
                        }}
                        className={cn(
                          "flex flex-col rounded-xl border p-3 text-left transition",
                          isSelected
                            ? "border-rose-500/50 bg-rose-500/10 dark:bg-rose-500/20"
                            : "border-neutral-200 bg-white hover:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:bg-neutral-800"
                        )}
                      >
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-neutral-500" />
                          <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                            {preset.label}
                          </span>
                        </div>
                        <div className="mt-1 text-[10px] text-neutral-500 dark:text-neutral-400">
                          {preset.desc}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {activeSegment === "who" && (
              <motion.div
                key="who-sheet"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                transition={{ duration: 0.18 }}
                className="mt-3 space-y-3 rounded-2xl border border-neutral-200 bg-neutral-50/80 p-4 dark:border-neutral-800 dark:bg-neutral-950/60"
              >
                {/* Adults Stepper */}
                <div className="flex items-center justify-between border-b border-neutral-200 pb-3 dark:border-neutral-800">
                  <div>
                    <div className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                      Adults
                    </div>
                    <div className="text-[10px] text-neutral-500 dark:text-neutral-400">
                      Ages 13 or above
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => setAdults((a) => Math.max(1, a - 1))}
                      disabled={adults <= 1}
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-neutral-300 text-neutral-700 transition hover:bg-neutral-200 disabled:opacity-30 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-4 text-center font-mono text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                      {adults}
                    </span>
                    <button
                      type="button"
                      onClick={() => setAdults((a) => a + 1)}
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-neutral-300 text-neutral-700 transition hover:bg-neutral-200 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                {/* Children Stepper */}
                <div className="flex items-center justify-between border-b border-neutral-200 pb-3 dark:border-neutral-800">
                  <div>
                    <div className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                      Children
                    </div>
                    <div className="text-[10px] text-neutral-500 dark:text-neutral-400">
                      Ages 2–12
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => setChildren((c) => Math.max(0, c - 1))}
                      disabled={children <= 0}
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-neutral-300 text-neutral-700 transition hover:bg-neutral-200 disabled:opacity-30 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-4 text-center font-mono text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                      {children}
                    </span>
                    <button
                      type="button"
                      onClick={() => setChildren((c) => c + 1)}
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-neutral-300 text-neutral-700 transition hover:bg-neutral-200 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                {/* Infants Stepper */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                      Infants
                    </div>
                    <div className="text-[10px] text-neutral-500 dark:text-neutral-400">
                      Under 2
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => setInfants((i) => Math.max(0, i - 1))}
                      disabled={infants <= 0}
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-neutral-300 text-neutral-700 transition hover:bg-neutral-200 disabled:opacity-30 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-4 text-center font-mono text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                      {infants}
                    </span>
                    <button
                      type="button"
                      onClick={() => setInfants((i) => i + 1)}
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-neutral-300 text-neutral-700 transition hover:bg-neutral-200 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );

  if (embedded) {
    return (
      <div className={cn("relative w-full flex justify-center py-2", className)}>
        {pillWidget}
      </div>
    );
  }

  return (
    <div
      data-fullscreen-scroll
      className={cn(
        "relative flex min-h-[520px] w-full flex-col justify-between overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50/70 p-4 sm:p-8 dark:border-neutral-800 dark:bg-neutral-950",
        className
      )}
    >
      {/* Header telemetry & branding */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400">
            <Search className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
                Airbnb Expanding Search Pill
              </span>
              <span className="rounded-full border border-rose-500/30 bg-rose-500/10 px-2 py-0.5 text-[10px] font-semibold text-rose-600 dark:text-rose-400">
                Shared Spring Layout
              </span>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Morphs from a compact floating status pill into an interactive multi-segment drawer
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setIsExpanded(!isExpanded);
              setActiveSegment(isExpanded ? null : "where");
            }}
            className="flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 shadow-xs transition hover:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
          >
            <SlidersHorizontal className="h-3 w-3" />
            <span>{isExpanded ? "Collapse Pill" : "Expand Pill"}</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="relative z-20 my-auto flex flex-col items-center justify-center py-6">
        {pillWidget}

        {/* Live Search Results / Simulated Listings Preview */}
        <div className="mt-8 w-full max-w-3xl">
          <div className="mb-2.5 flex items-center justify-between">
            <span className="font-mono text-[11px] font-semibold tracking-wider uppercase text-neutral-400">
              Matched Escapes for: {destinationSummary} ({guestSummary})
            </span>
            <span className="text-xs text-rose-500 font-medium">3 available</span>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {SAMPLE_LISTINGS.map((listing, idx) => (
              <div
                key={idx}
                className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-neutral-200 bg-white p-3.5 shadow-xs transition hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900"
              >
                <div
                  className={cn(
                    "mb-2.5 h-20 w-full rounded-lg bg-gradient-to-br transition group-hover:scale-[1.02]",
                    listing.imageBg
                  )}
                />
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded bg-neutral-100 px-1.5 py-0.5 text-[9px] font-semibold text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
                      {listing.tag}
                    </span>
                    <span className="font-mono text-[10px] font-medium text-neutral-500">
                      ★ {listing.rating}
                    </span>
                  </div>
                  <h4 className="mt-1.5 line-clamp-1 text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                    {listing.title}
                  </h4>
                  <p className="line-clamp-1 text-[11px] text-neutral-500 dark:text-neutral-400">
                    {listing.location}
                  </p>
                </div>
                <div className="mt-2.5 pt-2 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                    {listing.price}
                  </span>
                  <ChevronRight className="h-3.5 w-3.5 text-neutral-400 transition group-hover:translate-x-0.5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Preset Controls */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-t border-neutral-200/80 pt-4 dark:border-neutral-800/80">
        <div className="flex flex-wrap items-center gap-1.5 text-xs text-neutral-500">
          <span className="font-medium">Quick Presets:</span>
          <button
            type="button"
            onClick={() => applyPreset("Kyoto, Japan", "Autumn Foliage", 2)}
            className="rounded-md bg-neutral-200/60 px-2 py-0.5 text-[11px] font-medium text-neutral-700 transition hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
          >
            Kyoto · 2 Guests
          </button>
          <button
            type="button"
            onClick={() => applyPreset("Amalfi Coast, Italy", "This Weekend", 2)}
            className="rounded-md bg-neutral-200/60 px-2 py-0.5 text-[11px] font-medium text-neutral-700 transition hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
          >
            Amalfi Coast · Weekend
          </button>
          <button
            type="button"
            onClick={() => applyPreset("Aspen, Colorado", "1 Week in July", 4)}
            className="rounded-md bg-neutral-200/60 px-2 py-0.5 text-[11px] font-medium text-neutral-700 transition hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
          >
            Aspen · 4 Guests
          </button>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="text-xs text-neutral-500 underline transition hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
        >
          Reset search
        </button>
      </div>
    </div>
  );
}

export default ExpandingSearchPill;

"use client";

import React, { useState } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  AnimatePresence,
  PanInfo,
} from "framer-motion";
import {
  Heart,
  X,
  Star,
  RotateCcw,
  Zap,
  MapPin,
  Briefcase,
  GraduationCap,
  Sparkles,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface ProfileCard {
  id: string;
  name: string;
  age: number;
  role: string;
  location: string;
  distance: string;
  bio: string;
  tags: string[];
  gradient: string;
  verified?: boolean;
}

export interface SwipeCardsProps {
  /** Array of card profiles */
  profiles?: ProfileCard[];
  /** Callback fired on swipe direction */
  onSwipe?: (card: ProfileCard, direction: "like" | "nope" | "superlike") => void;
  /** Extra container className */
  className?: string;
}

const DEFAULT_PROFILES: ProfileCard[] = [
  {
    id: "card-1",
    name: "Elena Rostova",
    age: 26,
    role: "Product Designer & Ceramicist",
    location: "San Francisco, CA",
    distance: "2 miles away",
    bio: "Obsessed with Swiss typography, pour-over coffee, and hand-built stoneware. Looking for someone to explore hidden architecture spots with.",
    tags: ["Design Systems", "Ceramics", "Matcha", "Architecture"],
    gradient: "from-rose-600 via-pink-700 to-amber-600",
    verified: true,
  },
  {
    id: "card-2",
    name: "Marcus Vance",
    age: 28,
    role: "Sound Engineer & Producer",
    location: "Brooklyn, NY",
    distance: "4 miles away",
    bio: "Collecting vintage analog synthesizers and hunting down rare Japanese vinyl. Let's trade favorite B-sides over craft cider.",
    tags: ["Vinyl Records", "Synthwave", "Hi-Fi Audio", "Film Photography"],
    gradient: "from-indigo-600 via-purple-700 to-slate-900",
    verified: true,
  },
  {
    id: "card-3",
    name: "Sora Takahashi",
    age: 25,
    role: "Landscape Architect",
    location: "Seattle, WA",
    distance: "3 miles away",
    bio: "Designing botanical conservatories and green rooftop gardens. Always down for early morning bouldering or botanical garden walks.",
    tags: ["Bouldering", "Botanicals", "Green Design", "Trail Running"],
    gradient: "from-emerald-600 via-teal-700 to-cyan-900",
    verified: true,
  },
  {
    id: "card-4",
    name: "Julian Brooks",
    age: 29,
    role: "Documentary Filmmaker",
    location: "Austin, TX",
    distance: "6 miles away",
    bio: "Currently editing a doc on regenerative farming. Love 35mm cameras, spicy noodles, and midnight road trips with good playlists.",
    tags: ["Cinema", "Documentaries", "Street Food", "Camping"],
    gradient: "from-amber-600 via-orange-700 to-rose-900",
    verified: false,
  },
];

// Single Top Card with Drag physics & Transform values
function SwipeCardTop({
  card,
  onSwiped,
}: {
  card: ProfileCard;
  onSwiped: (dir: "like" | "nope") => void;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-18, 18]);
  const likeOpacity = useTransform(x, [20, 110], [0, 1]);
  const nopeOpacity = useTransform(x, [-20, -110], [0, 1]);

  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (info.offset.x > 110 || info.velocity.x > 500) {
      onSwiped("like");
    } else if (info.offset.x < -110 || info.velocity.x < -500) {
      onSwiped("nope");
    }
  };

  return (
    <motion.div
      style={{ x, rotate, zIndex: 10 }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.8}
      onDragEnd={handleDragEnd}
      whileDrag={{ scale: 1.02 }}
      className="absolute inset-0 cursor-grab active:cursor-grabbing select-none rounded-3xl overflow-hidden shadow-2xl ring-1 ring-black/10 dark:ring-white/10"
    >
      {/* Visual Canvas Backdrop */}
      <div className={cn("relative h-full w-full bg-gradient-to-br flex flex-col justify-between p-6 text-white", card.gradient)}>
        {/* Stamp Overlays */}
        <div className="pointer-events-none flex items-start justify-between">
          {/* LIKE Stamp */}
          <motion.div
            style={{ opacity: likeOpacity }}
            className="rounded-xl border-4 border-emerald-400 bg-emerald-500/20 px-4 py-1.5 font-mono text-2xl font-black uppercase tracking-wider text-emerald-400 shadow-lg backdrop-blur-md rotate-[-12deg]"
          >
            LIKE
          </motion.div>

          {/* NOPE Stamp */}
          <motion.div
            style={{ opacity: nopeOpacity }}
            className="rounded-xl border-4 border-rose-500 bg-rose-500/20 px-4 py-1.5 font-mono text-2xl font-black uppercase tracking-wider text-rose-500 shadow-lg backdrop-blur-md rotate-[12deg]"
          >
            NOPE
          </motion.div>
        </div>

        {/* Card Metadata Bottom Sheet */}
        <div className="relative z-10 rounded-2xl bg-black/40 p-4.5 backdrop-blur-md border border-white/10">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-white">
              {card.name}, <span className="font-normal opacity-90">{card.age}</span>
            </h2>
            {card.verified && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-sky-500 text-white">
                <Sparkles className="h-3 w-3" />
              </span>
            )}
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-white/80">
            <span className="flex items-center gap-1">
              <Briefcase className="h-3 w-3" />
              {card.role}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {card.distance}
            </span>
          </div>

          <p className="mt-2 text-xs leading-relaxed text-white/90 line-clamp-2">
            {card.bio}
          </p>

          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {card.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-medium backdrop-blur-xs text-white"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function SwipeCards({
  profiles = DEFAULT_PROFILES,
  onSwipe,
  className,
}: SwipeCardsProps) {
  const [deck, setDeck] = useState<ProfileCard[]>(profiles);
  const [swipedHistory, setSwipedHistory] = useState<
    Array<{ card: ProfileCard; dir: "like" | "nope" | "superlike" }>
  >([]);
  const [lastAction, setLastAction] = useState<string | null>(null);

  const activeCard = deck[0];

  const handleSwipeCard = (dir: "like" | "nope" | "superlike") => {
    if (!activeCard) return;

    setSwipedHistory((prev) => [{ card: activeCard, dir }, ...prev]);
    setDeck((prev) => prev.slice(1));
    setLastAction(`Swiped ${dir.toUpperCase()} on ${activeCard.name}`);
    onSwipe?.(activeCard, dir);
  };

  const handleUndo = () => {
    if (swipedHistory.length === 0) return;
    const [lastSwiped, ...restHistory] = swipedHistory;
    setSwipedHistory(restHistory);
    setDeck((prev) => [lastSwiped.card, ...prev]);
    setLastAction(`Restored ${lastSwiped.card.name}`);
  };

  const handleReset = () => {
    setDeck(profiles);
    setSwipedHistory([]);
    setLastAction("Deck reset to start");
  };

  return (
    <div
      data-fullscreen-scroll
      className={cn(
        "relative flex min-h-[520px] w-full flex-col justify-between overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100/70 p-4 sm:p-8 dark:border-neutral-800 dark:bg-neutral-950",
        className
      )}
    >
      {/* Header bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-2">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400">
            <Heart className="h-4 w-4 fill-rose-500" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
                Tinder Swipeable Card Deck
              </span>
              <span className="rounded-full bg-neutral-200 px-2 py-0.5 text-[10px] font-medium text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                Drag Physics
              </span>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Rotational tilt springs, stamp overlays, stack scale-up, and rewind
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-neutral-500 dark:text-neutral-400">
            Remaining: <strong className="text-neutral-900 dark:text-white">{deck.length}</strong>
          </span>
        </div>
      </div>

      {/* Main Card Deck Center Stage */}
      <div className="relative z-10 my-auto flex flex-col items-center justify-center py-4">
        <div className="relative h-[380px] w-full max-w-[320px] sm:max-w-[340px]">
          <AnimatePresence>
            {deck.length === 0 ? (
              /* Empty deck state */
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 flex flex-col items-center justify-center rounded-3xl border border-dashed border-neutral-300 bg-white p-6 text-center shadow-lg dark:border-neutral-800 dark:bg-neutral-900"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-500/10 text-rose-500 mb-3">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                  You&apos;ve seen everyone nearby!
                </h3>
                <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                  Rewind your last swipe or reset the discovery stack to explore again.
                </p>
                <button
                  type="button"
                  onClick={handleReset}
                  className="mt-4 rounded-xl bg-rose-500 px-4 py-2 text-xs font-semibold text-white shadow-md transition hover:bg-rose-600 active:scale-95"
                >
                  Reset Discovery Stack
                </button>
              </motion.div>
            ) : (
              /* Render card deck with depth scaling */
              deck.slice(0, 3).map((card, index) => {
                const isTop = index === 0;
                const scale = 1 - index * 0.05;
                const translateY = index * 12;
                const opacity = 1 - index * 0.2;

                if (isTop) {
                  return (
                    <SwipeCardTop
                      key={card.id}
                      card={card}
                      onSwiped={(dir) => handleSwipeCard(dir)}
                    />
                  );
                }

                return (
                  <motion.div
                    key={card.id}
                    animate={{
                      scale,
                      y: translateY,
                      opacity,
                    }}
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    style={{ zIndex: 10 - index }}
                    className="absolute inset-0 select-none overflow-hidden rounded-3xl shadow-xl ring-1 ring-black/5 dark:ring-white/5"
                  >
                    <div className={cn("h-full w-full bg-gradient-to-br p-6 text-white", card.gradient)}>
                      <div className="mt-auto rounded-2xl bg-black/40 p-4 backdrop-blur-md">
                        <div className="text-lg font-bold text-white">
                          {card.name}, {card.age}
                        </div>
                        <div className="text-xs text-white/80">{card.role}</div>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>

        {/* Tactile Action Buttons Row */}
        <div className="mt-6 flex items-center justify-center gap-3 sm:gap-4">
          {/* Rewind Button */}
          <button
            type="button"
            onClick={handleUndo}
            disabled={swipedHistory.length === 0}
            aria-label="Rewind last swipe"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-neutral-200 bg-white text-amber-500 shadow-md transition hover:scale-110 active:scale-90 disabled:opacity-30 disabled:hover:scale-100 dark:border-neutral-800 dark:bg-neutral-900"
          >
            <RotateCcw className="h-5 w-5" />
          </button>

          {/* Pass / Nope Button */}
          <button
            type="button"
            onClick={() => handleSwipeCard("nope")}
            disabled={deck.length === 0}
            aria-label="Pass profile"
            className="flex h-14 w-14 items-center justify-center rounded-full border border-neutral-200 bg-white text-rose-500 shadow-lg transition hover:scale-110 active:scale-90 disabled:opacity-30 disabled:hover:scale-100 dark:border-neutral-800 dark:bg-neutral-900"
          >
            <X className="h-7 w-7" />
          </button>

          {/* Super Like Button */}
          <button
            type="button"
            onClick={() => handleSwipeCard("superlike")}
            disabled={deck.length === 0}
            aria-label="Super like profile"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-neutral-200 bg-white text-sky-500 shadow-md transition hover:scale-110 active:scale-90 disabled:opacity-30 disabled:hover:scale-100 dark:border-neutral-800 dark:bg-neutral-900"
          >
            <Star className="h-5 w-5" />
          </button>

          {/* Like Button */}
          <button
            type="button"
            onClick={() => handleSwipeCard("like")}
            disabled={deck.length === 0}
            aria-label="Like profile"
            className="flex h-14 w-14 items-center justify-center rounded-full border border-neutral-200 bg-white text-emerald-500 shadow-lg transition hover:scale-110 active:scale-90 disabled:opacity-30 disabled:hover:scale-100 dark:border-neutral-800 dark:bg-neutral-900"
          >
            <Heart className="h-7 w-7 fill-emerald-500" />
          </button>

          {/* Boost Button */}
          <button
            type="button"
            onClick={() => setLastAction("Boost activated for 30 minutes! ⚡")}
            aria-label="Activate boost"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-neutral-200 bg-white text-purple-500 shadow-md transition hover:scale-110 active:scale-90 dark:border-neutral-800 dark:bg-neutral-900"
          >
            <Zap className="h-5 w-5 fill-purple-500" />
          </button>
        </div>
      </div>

      {/* Footer telemetry & status */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-t border-neutral-200/80 pt-4 dark:border-neutral-800/80">
        <div className="flex items-center gap-2 text-xs text-neutral-500">
          <Info className="h-3.5 w-3.5" />
          <span>{lastAction || "Drag card left or right to swipe"}</span>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="text-xs text-neutral-500 underline transition hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
        >
          Reset Deck
        </button>
      </div>
    </div>
  );
}

export default SwipeCards;

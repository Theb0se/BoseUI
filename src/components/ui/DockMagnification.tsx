"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
  MotionValue,
} from "framer-motion";
import {
  Folder,
  Compass,
  MessageSquare,
  Terminal,
  Music,
  Camera,
  Calendar,
  Settings,
  Sliders,
  Sparkles,
  Play,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface DockAppItem {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  gradient: string;
  isRunning?: boolean;
  notificationCount?: number;
}

export interface DockMagnificationProps {
  /** Array of dock items */
  items?: DockAppItem[];
  /** Default base item size in px */
  baseSize?: number;
  /** Max magnification factor (e.g. 1.8) */
  magnification?: number;
  /** Falloff distance in px */
  distance?: number;
  /** On app click callback */
  onItemClick?: (item: DockAppItem) => void;
  /** Whether the dock is embedded in another section without full desktop window framing */
  embedded?: boolean;
  /** Container custom classes */
  className?: string;
}

const DEFAULT_DOCK_ITEMS: DockAppItem[] = [
  {
    id: "finder",
    name: "Finder",
    icon: Folder,
    color: "#3B82F6",
    gradient: "from-blue-500 to-cyan-500",
    isRunning: true,
  },
  {
    id: "safari",
    name: "Safari",
    icon: Compass,
    color: "#0284C7",
    gradient: "from-sky-400 to-blue-600",
    isRunning: true,
  },
  {
    id: "messages",
    name: "Messages",
    icon: MessageSquare,
    color: "#22C55E",
    gradient: "from-emerald-400 to-green-600",
    isRunning: true,
    notificationCount: 3,
  },
  {
    id: "terminal",
    name: "Terminal",
    icon: Terminal,
    color: "#1E293B",
    gradient: "from-neutral-800 to-neutral-950",
    isRunning: true,
  },
  {
    id: "music",
    name: "Music",
    icon: Music,
    color: "#F43F5E",
    gradient: "from-rose-500 to-red-600",
    isRunning: false,
  },
  {
    id: "photos",
    name: "Photos",
    icon: Camera,
    color: "#EAB308",
    gradient: "from-amber-400 to-yellow-600",
    isRunning: false,
  },
  {
    id: "calendar",
    name: "Calendar",
    icon: Calendar,
    color: "#EF4444",
    gradient: "from-red-500 to-rose-600",
    isRunning: true,
  },
  {
    id: "settings",
    name: "System Settings",
    icon: Settings,
    color: "#64748B",
    gradient: "from-slate-500 to-neutral-700",
    isRunning: false,
  },
];

interface DockIconProps {
  item: DockAppItem;
  mouseX: MotionValue<number>;
  baseSize: number;
  magnification: number;
  distanceThreshold: number;
  onClick: (item: DockAppItem) => void;
}

function DockIcon({
  item,
  mouseX,
  baseSize,
  magnification,
  distanceThreshold,
  onClick,
}: DockIconProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isBouncing, setIsBouncing] = useState(false);

  // Compute continuous distance from mouse pointer
  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect();
    if (!bounds || val === Infinity) return Infinity;
    return val - (bounds.x + bounds.width / 2);
  });

  // Calculate width transformation with cosine/gaussian-like interpolation
  const sizeTransform = useTransform(
    distance,
    [-distanceThreshold, 0, distanceThreshold],
    [baseSize, baseSize * magnification, baseSize]
  );

  const springSize = useSpring(sizeTransform, {
    mass: 0.1,
    stiffness: 170,
    damping: 14,
  });

  const handleClick = () => {
    setIsBouncing(true);
    onClick(item);
    setTimeout(() => {
      setIsBouncing(false);
    }, 1200);
  };

  const IconComponent = item.icon;

  return (
    <div
      ref={ref}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative flex flex-col items-center justify-end"
    >
      {/* macOS Floating Tooltip */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.85 }}
            animate={{ opacity: 1, y: -10, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.85 }}
            transition={{ duration: 0.15 }}
            className="pointer-events-none absolute -top-8 z-50 whitespace-nowrap rounded-lg border border-white/20 bg-neutral-900/90 px-3 py-1 text-xs font-medium text-white shadow-xl backdrop-blur-md"
          >
            {item.name}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Animated Icon Container */}
      <motion.button
        type="button"
        onClick={handleClick}
        style={{
          width: springSize,
          height: springSize,
        }}
        animate={
          isBouncing
            ? {
              y: [0, -32, 0, -18, 0, -8, 0],
            }
            : { y: 0 }
        }
        transition={
          isBouncing
            ? {
              duration: 1.1,
              times: [0, 0.2, 0.45, 0.65, 0.8, 0.9, 1],
              ease: "easeOut",
            }
            : undefined
        }
        className={cn(
          "group relative flex items-center justify-center rounded-2xl p-2.5 shadow-lg ring-1 ring-white/25 transition-transform active:scale-95",
          `bg-gradient-to-br ${item.gradient}`
        )}
        aria-label={item.name}
      >
        <IconComponent className="h-full w-full text-white drop-shadow-md transition-transform" />

        {/* Glossy top-specular sheen */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-2xl bg-gradient-to-b from-white/30 to-transparent" />

        {/* Notification badge */}
        {item.notificationCount && (
          <span className="absolute -top-1 -right-1 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow ring-2 ring-neutral-900">
            {item.notificationCount}
          </span>
        )}
      </motion.button>

      {/* macOS Running Indicator Dot */}
      <div className="mt-1 flex h-1.5 w-full items-center justify-center">
        {item.isRunning && (
          <span className="h-1 w-1 rounded-full bg-white/80 shadow-[0_0_4px_rgba(255,255,255,0.8)]" />
        )}
      </div>
    </div>
  );
}

export function DockMagnification({
  items = DEFAULT_DOCK_ITEMS,
  baseSize = 48,
  magnification = 1.65,
  distance = 140,
  onItemClick,
  embedded = false,
  className,
}: DockMagnificationProps) {
  const [currentMagnification, setCurrentMagnification] = useState(magnification);
  const [currentDistance, setCurrentDistance] = useState(distance);
  const [lastClickedApp, setLastClickedApp] = useState<string | null>("Safari");
  const [showRunningOnly, setShowRunningOnly] = useState(false);

  const mouseX = useMotionValue(Infinity);

  const filteredItems = showRunningOnly
    ? items.filter((item) => item.isRunning)
    : items;

  const handleItemClick = (item: DockAppItem) => {
    setLastClickedApp(item.name);
    onItemClick?.(item);
  };

  if (embedded) {
    return (
      <div className={cn("relative flex items-center justify-center", className)}>
        <motion.div
          onMouseMove={(e) => mouseX.set(e.pageX)}
          onMouseLeave={() => mouseX.set(Infinity)}
          className="relative flex items-end gap-3.5 rounded-3xl border border-white/20 bg-white/10 px-4 py-3 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-2xl ring-1 ring-white/10 dark:bg-black/50"
        >
          {filteredItems.map((item) => (
            <DockIcon
              key={item.id}
              item={item}
              mouseX={mouseX}
              baseSize={baseSize}
              magnification={currentMagnification}
              distanceThreshold={currentDistance}
              onClick={handleItemClick}
            />
          ))}
        </motion.div>
      </div>
    );
  }

  return (
    <div
      data-fullscreen-scroll
      className={cn(
        "relative w-full min-h-[520px] overflow-hidden rounded-2xl border border-neutral-200/80 bg-[#090D16] p-6 text-neutral-100 shadow-2xl transition-all dark:border-neutral-800",
        className
      )}
    >
      {/* Atmospheric macOS Desktop Wallpaper Background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background: `radial-gradient(ellipse 80% 60% at 50% 20%, rgba(59, 130, 246, 0.22), transparent 70%),
                       radial-gradient(ellipse 60% 50% at 80% 80%, rgba(236, 72, 153, 0.16), transparent 70%),
                       radial-gradient(ellipse 50% 50% at 20% 70%, rgba(139, 92, 246, 0.18), transparent 70%)`,
        }}
      />

      {/* Desktop Top Menu Bar Simulation */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
            <Sparkles className="h-3 w-3 text-sky-400" />
            macOS Desktop Dock Simulation
          </div>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-white">
            macOS Continuous Spring Dock
          </h2>
          <p className="text-xs text-neutral-300">
            Continuous Gaussian pointer falloff with spring physics, click-to-bounce, and status dots
          </p>
        </div>

        {/* Live Status indicator */}
        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/40 px-3 py-1.5 text-xs text-neutral-300 backdrop-blur-md">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Active App: </span>
          <strong className="text-white">{lastClickedApp || "None"}</strong>
        </div>
      </div>

      {/* Center Desktop Area */}
      <div className="relative z-10 flex flex-col items-center justify-center py-16">
        <div className="text-center mb-8">
          <span className="text-xs font-medium text-neutral-400 uppercase tracking-widest">
            Interactive Test Stage
          </span>
          <p className="text-sm text-neutral-300 mt-1">
            Glide your pointer across the dock to inspect smooth magnification curves. Click an icon to trigger spring bounce.
          </p>
        </div>

        {/* The macOS Dock Bar */}
        <motion.div
          onMouseMove={(e) => mouseX.set(e.pageX)}
          onMouseLeave={() => mouseX.set(Infinity)}
          className="relative flex items-end gap-3.5 rounded-3xl border border-white/20 bg-white/15 px-4 py-3 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-2xl ring-1 ring-white/10 dark:bg-black/40"
        >
          {filteredItems.map((item) => (
            <DockIcon
              key={item.id}
              item={item}
              mouseX={mouseX}
              baseSize={baseSize}
              magnification={currentMagnification}
              distanceThreshold={currentDistance}
              onClick={handleItemClick}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}

export default DockMagnification;

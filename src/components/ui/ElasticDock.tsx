"use client";

import React, { useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import {
  Home,
  Terminal,
  Sparkles,
  Layers,
  Settings,
  Compass,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface ElasticDockItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: string | number;
  onClick?: () => void;
}

export interface ElasticDockProps {
  /** Array of dock items to render. Defaults to a 6-item studio toolbar. */
  items?: ElasticDockItem[];
  /** Resting icon button size in pixels. Default: 46 */
  baseSize?: number;
  /** Peak magnified icon button size in pixels on hover. Default: 72 */
  magnifiedSize?: number;
  /** Pointer proximity radius in pixels affecting neighboring items. Default: 140 */
  distance?: number;
  /** Hooke's Law spring stiffness coefficient. Default: 320 */
  stiffness?: number;
  /** Spring damping coefficient. Default: 22 */
  damping?: number;
  /** Controlled or initial active item id */
  defaultActiveId?: string;
  /** Callback fired when an item is selected */
  onSelect?: (id: string) => void;
  className?: string;
}

const DEFAULT_ITEMS: ElasticDockItem[] = [
  { id: "overview", label: "Overview", icon: <Home className="h-5 w-5" /> },
  { id: "explore", label: "Explore", icon: <Compass className="h-5 w-5" /> },
  {
    id: "primitives",
    label: "Primitives",
    icon: <Layers className="h-5 w-5" />,
    badge: "12",
  },
  { id: "kinetic", label: "Kinetic Lab", icon: <Sparkles className="h-5 w-5" /> },
  { id: "cli", label: "CLI Registry", icon: <Terminal className="h-5 w-5" /> },
  { id: "settings", label: "Settings", icon: <Settings className="h-5 w-5" /> },
];

interface DockIconButtonProps {
  item: ElasticDockItem;
  isActive: boolean;
  mouseX: MotionValue<number>;
  baseSize: number;
  magnifiedSize: number;
  distance: number;
  stiffness: number;
  damping: number;
  shouldReduceMotion: boolean;
  onSelect: () => void;
  onKeyNav: (e: React.KeyboardEvent<HTMLButtonElement>) => void;
  buttonRef: (el: HTMLButtonElement | null) => void;
}

function DockIconButton({
  item,
  isActive,
  mouseX,
  baseSize,
  magnifiedSize,
  distance,
  stiffness,
  damping,
  shouldReduceMotion,
  onSelect,
  onKeyNav,
  buttonRef,
}: DockIconButtonProps) {
  const localRef = useRef<HTMLButtonElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const distanceFromPointer = useTransform(mouseX, (val) => {
    const bounds = localRef.current?.getBoundingClientRect();
    if (!bounds || val === -Infinity) return Infinity;
    return val - (bounds.x + bounds.width / 2);
  });

  const targetSize = useTransform(
    distanceFromPointer,
    [-distance, 0, distance],
    [baseSize, magnifiedSize, baseSize]
  );

  const targetLift = useTransform(
    distanceFromPointer,
    [-distance, 0, distance],
    [0, -8, 0]
  );

  const springSize = useSpring(targetSize, {
    stiffness,
    damping,
    mass: 0.5,
  });

  const springLift = useSpring(targetLift, {
    stiffness,
    damping,
    mass: 0.5,
  });

  const showTooltip = isHovered || isFocused;

  return (
    <div className="relative flex flex-col items-center">
      {/* Floating HUD Tooltip */}
      <motion.div
        initial={false}
        animate={{
          opacity: showTooltip ? 1 : 0,
          y: showTooltip ? -8 : 2,
          scale: showTooltip ? 1 : 0.92,
        }}
        transition={{ duration: 0.14, ease: "easeOut" }}
        aria-hidden="true"
        className="pointer-events-none absolute -top-9 z-20 whitespace-nowrap rounded-md border border-neutral-200 bg-white/95 px-2.5 py-1 text-[11px] font-medium tracking-tight text-black shadow-sm backdrop-blur-md dark:border-[#262626] dark:bg-[#111111]/95 dark:text-white"
      >
        {item.label}
      </motion.div>

      <motion.button
        ref={(el) => {
          localRef.current = el;
          buttonRef(el);
        }}
        type="button"
        aria-label={item.label}
        aria-current={isActive ? "page" : undefined}
        onClick={() => {
          onSelect();
          item.onClick?.();
        }}
        onKeyDown={onKeyNav}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        whileTap={shouldReduceMotion ? undefined : { scale: 0.9 }}
        style={{
          width: shouldReduceMotion ? baseSize : springSize,
          height: shouldReduceMotion ? baseSize : springSize,
          y: shouldReduceMotion ? 0 : springLift,
        }}
        className={cn(
          "group relative flex items-center justify-center rounded-2xl border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white",
          isActive
            ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
            : "border-neutral-200/90 bg-neutral-50/90 text-neutral-700 hover:border-neutral-400 hover:bg-white hover:text-black dark:border-[#222222] dark:bg-[#121212] dark:text-neutral-300 dark:hover:border-[#383838] dark:hover:bg-[#1A1A1A] dark:hover:text-white"
        )}
      >
        <span className="pointer-events-none flex items-center justify-center">
          {item.icon}
        </span>

        {item.badge !== undefined && (
          <span className="pointer-events-none absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full border border-white bg-black px-1 text-[9px] font-bold text-white dark:border-[#0A0A0A] dark:bg-white dark:text-black">
            {item.badge}
          </span>
        )}
      </motion.button>

      {/* Active spring indicator dot */}
      <div className="mt-1.5 flex h-1.5 items-center justify-center">
        {isActive && (
          <motion.span
            layoutId="elastic-dock-active-dot"
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : { type: "spring", stiffness: 380, damping: 26 }
            }
            className="h-1.5 w-1.5 rounded-full bg-black dark:bg-white"
          />
        )}
      </div>
    </div>
  );
}

export function ElasticDock({
  items = DEFAULT_ITEMS,
  baseSize = 46,
  magnifiedSize = 68,
  distance = 140,
  stiffness = 320,
  damping = 22,
  defaultActiveId = "kinetic",
  onSelect,
  className,
}: ElasticDockProps) {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const mouseX = useMotionValue(-Infinity);
  const [activeId, setActiveId] = useState<string>(
    defaultActiveId || items[0]?.id || ""
  );
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLButtonElement>
  ) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      const next = (index + 1) % items.length;
      buttonRefs.current[next]?.focus();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      const prev = (index - 1 + items.length) % items.length;
      buttonRefs.current[prev]?.focus();
    } else if (e.key === "Home") {
      e.preventDefault();
      buttonRefs.current[0]?.focus();
    } else if (e.key === "End") {
      e.preventDefault();
      buttonRefs.current[items.length - 1]?.focus();
    }
  };

  return (
    <motion.div
      role="toolbar"
      aria-label="Application dock navigation"
      onMouseMove={(e) => {
        if (!shouldReduceMotion) {
          mouseX.set(e.clientX);
        }
      }}
      onMouseLeave={() => mouseX.set(-Infinity)}
      className={cn(
        "inline-flex items-end gap-2.5 rounded-3xl border border-neutral-200/90 bg-white/85 px-4 pb-2 pt-3 shadow-sm backdrop-blur-xl dark:border-[#222222] dark:bg-[#0A0A0A]/85",
        className
      )}
    >
      {items.map((item, idx) => (
        <DockIconButton
          key={item.id}
          item={item}
          isActive={activeId === item.id}
          mouseX={mouseX}
          baseSize={baseSize}
          magnifiedSize={magnifiedSize}
          distance={distance}
          stiffness={stiffness}
          damping={damping}
          shouldReduceMotion={shouldReduceMotion}
          onSelect={() => {
            setActiveId(item.id);
            onSelect?.(item.id);
          }}
          onKeyNav={(e) => handleKeyDown(idx, e)}
          buttonRef={(el) => {
            buttonRefs.current[idx] = el;
          }}
        />
      ))}
    </motion.div>
  );
}

export default ElasticDock;

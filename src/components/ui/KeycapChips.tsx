"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Keyboard,
  Command,
  CornerDownLeft,
  Search,
  Sparkles,
  Terminal,
  Volume2,
  VolumeX,
  Plus,
  Trash2,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type KeycapVariant = "obsidian" | "classic" | "cyber" | "porcelain";
export type KeycapSize = "sm" | "md" | "lg";

export interface ShortcutItem {
  id: string;
  name: string;
  category: string;
  keys: string[];
}

export interface KeycapChipsProps {
  shortcuts?: ShortcutItem[];
  keys?: string[];
  size?: KeycapSize;
  variant?: KeycapVariant;
  enableGlobalListener?: boolean;
  inline?: boolean;
  onShortcutPress?: (key: string) => void;
  className?: string;
}

const DEFAULT_SHORTCUTS: ShortcutItem[] = [
  {
    id: "cmd-k",
    name: "Open Command Palette",
    category: "Navigation",
    keys: ["⌘", "K"],
  },
  {
    id: "quick-open",
    name: "Quick File Search",
    category: "Workbench",
    keys: ["⌘", "P"],
  },
  {
    id: "commit",
    name: "Commit & Instant Push",
    category: "Source Control",
    keys: ["⌘", "⇧", "↵"],
  },
  {
    id: "terminal-toggle",
    name: "Toggle Embedded Terminal",
    category: "Developer Tools",
    keys: ["⌃", "`"],
  },
  {
    id: "zen-mode",
    name: "Toggle Zen Fullscreen",
    category: "Display",
    keys: ["⌥", "⌘", "F"],
  },
];

const VARIANT_STYLES: Record<
  KeycapVariant,
  {
    keycap: string;
    keycapPressed: string;
    text: string;
    border: string;
    badge: string;
  }
> = {
  obsidian: {
    keycap:
      "bg-neutral-800 text-neutral-100 border border-neutral-700/80 shadow-[0_3px_0_0_#171717,0_6px_8px_rgba(0,0,0,0.5)]",
    keycapPressed:
      "bg-neutral-750 text-white translate-y-[3px] shadow-[0_0px_0_0_#171717,0_2px_4px_rgba(0,0,0,0.4)] ring-1 ring-cyan-500/60",
    text: "text-neutral-200",
    border: "border-neutral-800",
    badge: "border-neutral-700 bg-neutral-900 text-neutral-300",
  },
  classic: {
    keycap:
      "bg-[#D6D3D1] text-neutral-900 border border-[#E7E5E4] shadow-[0_3px_0_0_#A8A29E,0_6px_8px_rgba(0,0,0,0.3)]",
    keycapPressed:
      "bg-[#E7E5E4] text-black translate-y-[3px] shadow-[0_0px_0_0_#A8A29E,0_2px_4px_rgba(0,0,0,0.3)] ring-1 ring-amber-500/60",
    text: "text-neutral-100",
    border: "border-neutral-700",
    badge: "border-stone-700 bg-stone-900 text-stone-200",
  },
  cyber: {
    keycap:
      "bg-neutral-900 text-amber-400 border border-amber-500/60 shadow-[0_3px_0_0_#78350F,0_0_12px_rgba(245,158,11,0.2)]",
    keycapPressed:
      "bg-amber-950 text-amber-300 translate-y-[3px] shadow-[0_0px_0_0_#78350F,0_0_16px_rgba(245,158,11,0.5)] ring-1 ring-amber-400",
    text: "text-amber-400",
    border: "border-amber-900/50",
    badge: "border-amber-800/60 bg-amber-950/40 text-amber-400",
  },
  porcelain: {
    keycap:
      "bg-neutral-100 text-neutral-900 border border-white shadow-[0_3px_0_0_#CBD5E1,0_6px_10px_rgba(0,0,0,0.2)]",
    keycapPressed:
      "bg-white text-black translate-y-[3px] shadow-[0_0px_0_0_#CBD5E1,0_2px_4px_rgba(0,0,0,0.2)] ring-1 ring-indigo-500/60",
    text: "text-neutral-200",
    border: "border-neutral-700",
    badge: "border-slate-700 bg-slate-900 text-slate-200",
  },
};

const SIZE_STYLES: Record<
  KeycapSize,
  {
    container: string;
    keycap: string;
    font: string;
  }
> = {
  sm: {
    container: "gap-1",
    keycap: "min-w-[22px] h-[22px] px-1.5 rounded text-[10px]",
    font: "text-[10px]",
  },
  md: {
    container: "gap-1.5",
    keycap: "min-w-[28px] h-[28px] px-2 rounded-md text-xs",
    font: "text-xs",
  },
  lg: {
    container: "gap-2",
    keycap: "min-w-[38px] h-[36px] px-3 rounded-lg text-sm font-semibold",
    font: "text-sm",
  },
};

export function KeycapChips({
  shortcuts = DEFAULT_SHORTCUTS,
  keys,
  size = "md",
  variant = "obsidian",
  enableGlobalListener = true,
  inline = false,
  onShortcutPress,
  className,
}: KeycapChipsProps) {
  const [activeSize, setActiveSize] = useState<KeycapSize>(size);
  const [activeVariant, setActiveVariant] = useState<KeycapVariant>(variant);
  const [activePressedKey, setActivePressedKey] = useState<string | null>(null);
  const [lastExecuted, setLastExecuted] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [customCombo, setCustomCombo] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState<boolean>(false);

  const vStyle = VARIANT_STYLES[activeVariant];
  const sStyle = SIZE_STYLES[activeSize];

  // Key press sound simulation via Web Audio API synth click
  const playClickSound = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(800, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, audioCtx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.04);
    } catch {
      // AudioContext unavailable or blocked
    }
  }, [soundEnabled]);

  // Global keyboard listener to depress keycaps physically
  useEffect(() => {
    if (!enableGlobalListener) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing inside input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      let keyLabel = e.key;
      if (e.metaKey || e.key === "Meta") keyLabel = "⌘";
      else if (e.altKey || e.key === "Alt") keyLabel = "⌥";
      else if (e.shiftKey && e.key !== "Shift") keyLabel = "⇧";
      else if (e.ctrlKey || e.key === "Control") keyLabel = "⌃";
      else if (e.key === "Enter") keyLabel = "↵";
      else if (e.key === "Escape") keyLabel = "Esc";
      else if (e.key === " ") keyLabel = "Space";
      else keyLabel = e.key.toUpperCase();

      setActivePressedKey(keyLabel);
      playClickSound();

      if (isRecording) {
        setCustomCombo((prev) => {
          if (!prev.includes(keyLabel) && prev.length < 4) {
            return [...prev, keyLabel];
          }
          return prev;
        });
      }
    };

    const handleKeyUp = () => {
      setActivePressedKey(null);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [enableGlobalListener, isRecording, playClickSound]);

  const triggerShortcut = (item: ShortcutItem) => {
    playClickSound();
    setLastExecuted(item.name);
    setTimeout(() => setLastExecuted(null), 2500);
  };

  if (inline) {
    const displayKeys =
      keys || (shortcuts.length > 0 ? shortcuts[0].keys : ["⌘", "K"]);
    return (
      <div className={cn("inline-flex items-center", sStyle.container, className)}>
        {displayKeys.map((k, idx) => (
          <kbd
            key={idx}
            className={cn(
              "inline-flex items-center justify-center font-mono font-bold select-none cursor-pointer transition-all duration-100",
              sStyle.keycap,
              activePressedKey === k ? vStyle.keycapPressed : vStyle.keycap
            )}
            onClick={() => {
              playClickSound();
              onShortcutPress?.(k);
            }}
          >
            {k}
          </kbd>
        ))}
      </div>
    );
  }

  return (
    <div
      data-fullscreen-scroll
      className={cn(
        "relative w-full min-h-[520px] overflow-hidden rounded-2xl border border-neutral-800 bg-[#090A0F] p-6 text-white shadow-2xl flex flex-col justify-between selection:bg-neutral-700",
        className
      )}
    >
      {/* Subtle grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-15"
        style={{
          backgroundImage:
            "linear-gradient(#262626 1px, transparent 1px), linear-gradient(to right, #262626 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Header bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-neutral-800/80 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-700 bg-neutral-900 font-mono text-xs font-bold text-neutral-200">
            <Command className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-tight text-white flex items-center gap-2">
              Tactile Keycap Chips
              <span
                className={cn(
                  "text-[10px] uppercase font-mono px-2 py-0.5 rounded-full border",
                  vStyle.badge
                )}
              >
                {activeVariant}
              </span>
            </h3>
            <p className="text-xs text-neutral-400 font-mono">
              Raycast-grade 3D mechanical bevels with keypress haptics
            </p>
          </div>
        </div>

        {/* Live Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Variant picker */}
          <div className="flex items-center rounded-lg border border-neutral-800 bg-neutral-900/90 p-1">
            {(["obsidian", "classic", "cyber", "porcelain"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setActiveVariant(v)}
                className={cn(
                  "px-2.5 py-1 text-[11px] font-mono rounded capitalize transition-all",
                  activeVariant === v
                    ? "bg-neutral-800 text-white font-bold shadow-sm"
                    : "text-neutral-400 hover:text-neutral-200"
                )}
              >
                {v}
              </button>
            ))}
          </div>

          {/* Size picker */}
          <div className="flex items-center rounded-lg border border-neutral-800 bg-neutral-900/90 p-1 font-mono text-[10px]">
            {(["sm", "md", "lg"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setActiveSize(s)}
                className={cn(
                  "px-2.5 py-1 rounded uppercase transition-all",
                  activeSize === s
                    ? "bg-neutral-800 text-white font-bold"
                    : "text-neutral-400 hover:text-neutral-200"
                )}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            aria-label={soundEnabled ? "Mute audio" : "Unmute audio"}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono rounded-lg border transition-all",
              soundEnabled
                ? "border-neutral-700 bg-neutral-800 text-white"
                : "border-neutral-800 bg-neutral-900 text-neutral-500 hover:text-neutral-300"
            )}
          >
            {soundEnabled ? (
              <Volume2 className="h-3.5 w-3.5 text-cyan-400" />
            ) : (
              <VolumeX className="h-3.5 w-3.5" />
            )}
            <span>{soundEnabled ? "Audio On" : "Muted"}</span>
          </button>
        </div>
      </div>

      {/* Main Showcase: Shortcut List */}
      <div className="relative z-10 my-6 flex flex-col gap-2.5 max-w-2xl mx-auto w-full">
        {shortcuts.map((item) => {
          const isRowActive = item.keys.includes(activePressedKey || "");

          return (
            <motion.div
              key={item.id}
              tabIndex={0}
              role="button"
              onClick={() => triggerShortcut(item)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  triggerShortcut(item);
                }
              }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className={cn(
                "group flex items-center justify-between rounded-xl border p-3.5 transition-all cursor-pointer backdrop-blur-sm",
                isRowActive
                  ? "border-cyan-500/50 bg-neutral-800/90 shadow-md"
                  : "border-neutral-800/90 bg-neutral-950/60 hover:border-neutral-700 hover:bg-neutral-900/60"
              )}
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] text-neutral-500 uppercase">
                  {item.category}
                </span>
                <span className="text-sm font-medium text-neutral-200 group-hover:text-white transition-colors">
                  {item.name}
                </span>
              </div>

              {/* Physical 3D Keycaps */}
              <div className={cn("flex items-center", sStyle.container)}>
                {item.keys.map((k, kIdx) => {
                  const isKeyPressed = activePressedKey === k;
                  return (
                    <kbd
                      key={kIdx}
                      className={cn(
                        "inline-flex items-center justify-center font-mono font-bold select-none cursor-pointer transition-all duration-100",
                        sStyle.keycap,
                        isKeyPressed ? vStyle.keycapPressed : vStyle.keycap
                      )}
                    >
                      {k}
                    </kbd>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Toast Notification of Triggered Shortcut */}
      <AnimatePresence>
        {lastExecuted && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="relative z-20 mx-auto -mt-2 mb-4 flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-950/80 px-4 py-1.5 font-mono text-xs text-emerald-300 backdrop-blur-md shadow-lg"
          >
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            <span>Action Dispatched: &ldquo;{lastExecuted}&rdquo;</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Interactive Key Recorder */}
      <div className="relative z-10 border-t border-neutral-800/80 pt-4 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setIsRecording(!isRecording);
              if (!isRecording) setCustomCombo([]);
            }}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-mono text-xs transition-all",
              isRecording
                ? "border-rose-500/60 bg-rose-950/50 text-rose-300 animate-pulse"
                : "border-neutral-700 bg-neutral-900 text-neutral-300 hover:text-white"
            )}
          >
            <Keyboard className="h-3.5 w-3.5" />
            <span>{isRecording ? "Recording Keys..." : "Record Shortcut"}</span>
          </button>

          {customCombo.length > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-neutral-500 text-[11px]">Recorded:</span>
              <div className="flex items-center gap-1">
                {customCombo.map((k, i) => (
                  <kbd
                    key={i}
                    className={cn(
                      "inline-flex items-center justify-center font-mono font-bold px-2 py-0.5 rounded text-xs",
                      vStyle.keycap
                    )}
                  >
                    {k}
                  </kbd>
                ))}
              </div>
              <button
                onClick={() => setCustomCombo([])}
                aria-label="Clear recorded shortcut"
                className="text-neutral-500 hover:text-neutral-300 p-1"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 font-mono text-[11px] text-neutral-400">
          <span>
            LAST KEY:{" "}
            <span className="text-white font-bold">
              {activePressedKey ? activePressedKey : "NONE"}
            </span>
          </span>
          <span className="hidden sm:inline">GLOBAL LISTENER: ACTIVE</span>
        </div>
      </div>
    </div>
  );
}

export default KeycapChips;

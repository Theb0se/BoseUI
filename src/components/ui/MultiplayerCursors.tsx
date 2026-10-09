"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  MessageSquare,
  Plus,
  Play,
  Pause,
  Sparkles,
  MousePointer,
  Send,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface Collaborator {
  id: string;
  name: string;
  color: string;
  x: number;
  y: number;
  message?: string;
  state: "active" | "idle" | "typing";
}

export interface MultiplayerCursorsProps {
  initialCollaborators?: Collaborator[];
  showGrid?: boolean;
  overlayOnly?: boolean;
  className?: string;
}

const DEFAULT_COLLABORATORS: Collaborator[] = [
  {
    id: "collab-1",
    name: "Elena Rostova",
    color: "#ec4899", // pink-500
    x: 22,
    y: 35,
    message: "Loving this component architecture! ✨",
    state: "typing",
  },
  {
    id: "collab-2",
    name: "Marcus Chen",
    color: "#3b82f6", // blue-500
    x: 68,
    y: 28,
    message: "Checking the token contracts",
    state: "active",
  },
  {
    id: "collab-3",
    name: "Sarah Jenkins",
    color: "#10b981", // emerald-500
    x: 45,
    y: 65,
    message: "Ready for review 🚀",
    state: "active",
  },
];

const BOT_NAMES = [
  "Liam Vance",
  "Chloe Dupont",
  "Daisuke Sato",
  "Nadia Thorne",
  "Amara Okafor",
];

const BOT_COLORS = ["#8b5cf6", "#f59e0b", "#06b6d4", "#ef4444", "#14b8a6"];

const BOT_PHRASES = [
  "LGTM! Shipping it 🚢",
  "Can you inspect line 42?",
  "Refactoring the hooks here",
  "Looks pixel perfect! 👌",
  "Updating typography scales",
];

// Figma-style cursor arrow SVG
function CursorSvg({ color }: { color: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="drop-shadow-md select-none pointer-events-none"
    >
      <path
        d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19841L11.7841 12.3673H5.65376Z"
        fill={color}
        stroke="#ffffff"
        strokeWidth="1.2"
      />
    </svg>
  );
}

export function MultiplayerCursors({
  initialCollaborators = DEFAULT_COLLABORATORS,
  showGrid = true,
  overlayOnly = false,
  className,
}: MultiplayerCursorsProps) {
  const [collaborators, setCollaborators] =
    useState<Collaborator[]>(initialCollaborators);
  const [isSimulating, setIsSimulating] = useState(true);
  const [userChatInput, setUserChatInput] = useState("");
  const [userCursorPos, setUserCursorPos] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [userMessage, setUserMessage] = useState<string | null>(
    "You (Type below to chat)"
  );
  const [clicks, setClicks] = useState<
    { id: number; x: number; y: number; color: string }[]
  >([]);

  const canvasRef = useRef<HTMLDivElement>(null);

  // Track local user pointer
  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const xPercent = ((e.clientX - rect.left) / rect.width) * 100;
      const yPercent = ((e.clientY - rect.top) / rect.height) * 100;
      setUserCursorPos({ x: xPercent, y: yPercent });
    },
    []
  );

  const handlePointerLeave = () => {
    setUserCursorPos(null);
  };

  // Canvas click broadcast wave
  const handleCanvasClick = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newClick = {
      id: Date.now(),
      x,
      y,
      color: "#6366f1",
    };

    setClicks((prev) => [...prev.slice(-6), newClick]);
  };

  // Automated collaborator movement simulation
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setCollaborators((prev) =>
        prev.map((c) => {
          // Roam around slightly
          const dx = (Math.random() - 0.5) * 12;
          const dy = (Math.random() - 0.5) * 12;
          const newX = Math.max(10, Math.min(90, c.x + dx));
          const newY = Math.max(15, Math.min(85, c.y + dy));

          // Occasionally change message
          const shouldChangeMsg = Math.random() < 0.12;
          const newMsg = shouldChangeMsg
            ? BOT_PHRASES[Math.floor(Math.random() * BOT_PHRASES.length)]
            : c.message;

          return {
            ...c,
            x: newX,
            y: newY,
            message: newMsg,
          };
        })
      );
    }, 2400);

    return () => clearInterval(interval);
  }, [isSimulating]);

  // Add a new collaborator
  const addCollaborator = () => {
    const nextIdx = collaborators.length;
    const name = BOT_NAMES[nextIdx % BOT_NAMES.length];
    const color = BOT_COLORS[nextIdx % BOT_COLORS.length];
    const newCollab: Collaborator = {
      id: `bot-${Date.now()}`,
      name,
      color,
      x: Math.floor(Math.random() * 70) + 15,
      y: Math.floor(Math.random() * 60) + 20,
      message: "Just joined the session 👋",
      state: "active",
    };
    setCollaborators((prev) => [...prev, newCollab]);
  };

  // Handle user bubble chat submit
  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userChatInput.trim()) return;
    setUserMessage(userChatInput);
    setUserChatInput("");
  };

  if (overlayOnly) {
    return (
      <div className={cn("pointer-events-none absolute inset-0 overflow-hidden select-none", className)}>
        {collaborators.map((c) => (
          <motion.div
            key={c.id}
            animate={{ left: `${c.x}%`, top: `${c.y}%` }}
            transition={{
              type: "spring",
              damping: 30,
              stiffness: 140,
              mass: 0.5,
            }}
            className="pointer-events-none absolute z-20 -translate-x-1 -translate-y-1"
          >
            <CursorSvg color={c.color} />
            <div
              style={{ backgroundColor: c.color }}
              className="ml-4 -mt-2 inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold text-white shadow-md whitespace-nowrap"
            >
              <span>{c.name}</span>
            </div>
            {c.message && (
              <div className="mt-1 ml-4 max-w-[180px] rounded-lg border border-neutral-700/80 bg-neutral-900/95 p-1.5 text-[11px] text-neutral-100 shadow-xl backdrop-blur-md">
                <p className="leading-snug">{c.message}</p>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div
      data-fullscreen-scroll
      className={cn(
        "relative w-full min-h-[520px] overflow-hidden rounded-2xl border border-neutral-200/80 bg-neutral-950 p-6 text-neutral-100 shadow-xl dark:border-neutral-800 flex flex-col justify-between select-none",
        className
      )}
    >
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute -top-32 left-1/3 h-96 w-96 rounded-full bg-violet-600/10 blur-[120px]" />

      {/* Top Header & Collaborators Presence Pills */}
      <div className="relative z-20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <MousePointer className="h-4 w-4 text-neutral-400" />
          <span className="font-semibold text-sm text-white">
            Multiplayer Canvas
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-800/80 border border-neutral-700/60 px-2.5 py-0.5 text-xs text-neutral-300">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            {collaborators.length + 1} live presences
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={addCollaborator}
            className="flex items-center gap-1 rounded-lg border border-neutral-800 bg-neutral-900 px-2.5 py-1.5 text-xs font-medium text-neutral-200 hover:bg-neutral-800 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Teammate</span>
          </button>
          <button
            type="button"
            onClick={() => setIsSimulating((prev) => !prev)}
            className="flex items-center gap-1 rounded-lg border border-neutral-800 bg-neutral-900 px-2.5 py-1.5 text-xs font-medium text-neutral-300 hover:bg-neutral-800 transition-colors"
          >
            {isSimulating ? (
              <>
                <Pause className="h-3.5 w-3.5 text-amber-400" />
                <span>Pause Motion</span>
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5 text-emerald-400" />
                <span>Resume Motion</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Interactive Canvas Board */}
      <div
        ref={canvasRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onClick={handleCanvasClick}
        className={cn(
          "relative my-4 flex-1 min-h-[320px] rounded-xl border border-neutral-800/80 bg-neutral-900/40 backdrop-blur-sm cursor-crosshair overflow-hidden",
          showGrid &&
            "bg-[radial-gradient(#27272a_1.2px,transparent_1.2px)] [background-size:24px_24px]"
        )}
      >
        {/* Helper Hint */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-center p-6 opacity-30">
          <div>
            <Sparkles className="mx-auto mb-2 h-7 w-7 text-neutral-400" />
            <p className="font-mono text-xs text-neutral-300">
              Hover to move your live pointer • Click to send waves • Type
              cursor chat
            </p>
          </div>
        </div>

        {/* Click Wave Ripple Animations */}
        <AnimatePresence>
          {clicks.map((clk) => (
            <motion.div
              key={clk.id}
              initial={{ scale: 0, opacity: 0.9 }}
              animate={{ scale: 3.5, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              style={{ left: clk.x - 16, top: clk.y - 16 }}
              className="pointer-events-none absolute h-8 w-8 rounded-full border-2 border-indigo-400"
            />
          ))}
        </AnimatePresence>

        {/* Remote Collaborators Cursors */}
        {collaborators.map((c) => (
          <motion.div
            key={c.id}
            animate={{ left: `${c.x}%`, top: `${c.y}%` }}
            transition={{
              type: "spring",
              damping: 30,
              stiffness: 140,
              mass: 0.5,
            }}
            className="pointer-events-none absolute z-10 -translate-x-1 -translate-y-1"
          >
            {/* Pointer Arrow */}
            <CursorSvg color={c.color} />

            {/* User Name Tag Badge */}
            <div
              style={{ backgroundColor: c.color }}
              className="ml-4 -mt-2 inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold text-white shadow-md whitespace-nowrap"
            >
              <span>{c.name}</span>
            </div>

            {/* Chat Bubble Message */}
            <AnimatePresence>
              {c.message && (
                <motion.div
                  initial={{ opacity: 0, y: 4, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="mt-1 ml-4 max-w-[200px] rounded-lg border border-neutral-700/80 bg-neutral-900/95 p-2 text-xs text-neutral-100 shadow-xl backdrop-blur-md"
                >
                  <p className="leading-snug">{c.message}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}

        {/* Local User Cursor Indicator (when inside canvas) */}
        {userCursorPos && (
          <div
            style={{
              left: `${userCursorPos.x}%`,
              top: `${userCursorPos.y}%`,
            }}
            className="pointer-events-none absolute z-20 -translate-x-1 -translate-y-1 transition-transform duration-75"
          >
            <CursorSvg color="#6366f1" />

            <div className="ml-4 -mt-2 inline-flex items-center gap-1 rounded-md bg-indigo-600 px-2 py-0.5 text-[11px] font-semibold text-white shadow-md whitespace-nowrap">
              <span>You</span>
            </div>

            {userMessage && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1 ml-4 max-w-[220px] rounded-lg border border-indigo-500/40 bg-neutral-900/95 p-2 text-xs text-indigo-200 shadow-xl backdrop-blur-md"
              >
                <p className="leading-snug">{userMessage}</p>
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* Footer Cursor Chat Bar */}
      <div className="relative z-20 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-neutral-800/80 pt-4 text-xs text-neutral-400">
        <form
          onSubmit={handleSendChat}
          className="flex w-full sm:w-auto flex-1 max-w-md items-center gap-2"
        >
          <div className="relative flex-1">
            <MessageSquare className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-500" />
            <input
              type="text"
              value={userChatInput}
              onChange={(e) => setUserChatInput(e.target.value)}
              placeholder="Type message to broadcast to cursor bubble..."
              className="w-full rounded-lg border border-neutral-800 bg-neutral-900 pl-8 pr-3 py-1.5 text-xs text-neutral-200 placeholder:text-neutral-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-1.5 font-medium text-white hover:bg-indigo-500 transition-colors shadow-sm"
          >
            <Send className="h-3 w-3" />
            <span>Broadcast</span>
          </button>
        </form>

        <div className="flex items-center gap-3 text-neutral-500 font-mono text-[11px]">
          <span>Figma Real-Time Protocol</span>
          <span>•</span>
          <span>WebRTC Presence</span>
        </div>
      </div>
    </div>
  );
}

export default MultiplayerCursors;

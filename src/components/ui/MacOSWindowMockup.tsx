"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export interface MacOSWindowMockupProps {
  /** Window title displayed in the center of the titlebar */
  title?: string;
  /** Subtitle or breadcrumb path in titlebar */
  subtitle?: string;
  /** Enable frosted glass vibrancy backdrop blur. Default: true */
  frosted?: boolean;
  /** Active / focused window state. Default: true */
  active?: boolean;
  /** Callback when close button is clicked */
  onClose?: () => void;
  /** Callback when minimize button is clicked */
  onMinimize?: () => void;
  /** Callback when expand / fullscreen button is clicked */
  onExpand?: () => void;
  /** Optional screenshot or window image URL */
  imageSrc?: string;
  /** Content rendered inside the window body */
  children?: React.ReactNode;
  className?: string;
}

export function MacOSWindowMockup({
  title = "Untitled Window",
  subtitle,
  frosted = true,
  active = true,
  onClose,
  onMinimize,
  onExpand,
  imageSrc,
  children,
  className,
}: MacOSWindowMockupProps) {
  const [controlsHovered, setControlsHovered] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  return (
    <div
      className={cn(
        "relative w-full max-w-2xl overflow-hidden rounded-xl border border-border shadow-2xl transition-all",
        frosted ? "bg-card/85 backdrop-blur-xl" : "bg-card",
        !active && "opacity-80 shadow-md",
        className
      )}
    >
      {/* macOS Titlebar Header */}
      <div className="relative flex h-11 w-full items-center justify-between border-b border-border/80 px-4 select-none bg-muted/40">
        {/* Left: Traffic Light Window Controls */}
        <div
          onMouseEnter={() => setControlsHovered(true)}
          onMouseLeave={() => setControlsHovered(false)}
          className="flex items-center gap-2 z-20"
        >
          {/* Close (Red) */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close window"
            className="group flex h-3 w-3 items-center justify-center rounded-full bg-[#FF5F56] border border-[#E0443E] transition-transform active:scale-90"
          >
            {controlsHovered && (
              <span className="text-[8px] font-bold text-black/70 leading-none">✕</span>
            )}
          </button>

          {/* Minimize (Yellow) */}
          <button
            type="button"
            onClick={() => {
              setIsMinimized((prev) => !prev);
              onMinimize?.();
            }}
            aria-label="Minimize window"
            className="group flex h-3 w-3 items-center justify-center rounded-full bg-[#FFBD2E] border border-[#DEA123] transition-transform active:scale-90"
          >
            {controlsHovered && (
              <span className="text-[10px] font-bold text-black/70 leading-none -mt-0.5">−</span>
            )}
          </button>

          {/* Expand (Green) */}
          <button
            type="button"
            onClick={onExpand}
            aria-label="Expand window"
            className="group flex h-3 w-3 items-center justify-center rounded-full bg-[#27C93F] border border-[#1AAB29] transition-transform active:scale-90"
          >
            {controlsHovered && (
              <span className="text-[7px] font-bold text-black/70 leading-none">⤢</span>
            )}
          </button>
        </div>

        {/* Center: Window Title */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-20">
          <div className="flex items-center gap-1.5 truncate">
            <span className="text-xs font-semibold text-foreground/80 truncate">
              {title}
            </span>
            {subtitle && (
              <span className="text-[11px] text-muted-foreground/60 truncate">
                — {subtitle}
              </span>
            )}
          </div>
        </div>

        {/* Right: Dummy spacer for visual balance */}
        <div className="w-14" />
      </div>

      {/* Window Body Viewport */}
      <AnimatePresence>
        {!isMinimized && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className="relative overflow-hidden"
          >
            {children ? (
              children
            ) : imageSrc ? (
              <div className="relative w-full aspect-[16/10] overflow-hidden">
                <img
                  src={imageSrc}
                  alt="Window content"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="relative w-full aspect-[16/10] overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1400&auto=format&fit=crop"
                  alt="Code Editor Workspace"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30 pointer-events-none" />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
